"use client";

import { useEffect, useMemo, useRef, useState, ElementType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import Image from "next/image";
import {
  Activity,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dna,
  FlaskConical,
  Folder,
  Home,
  LayoutDashboard,
  Map,
  MoreHorizontal,
  Plus,
  Upload,
  Users,
  Settings,
  X,
} from "lucide-react";

import { userAtom } from "@/src/store/userAtom";
import { currentWorkspaceAtom } from "@/src/store/currentWorkspaceAtom";
import UserMenu from "@/src/components/nav/user-menu";
import HeaderSearch from "@/src/components/nav/header-search";
import { GEOLENS_HEADER_SLOT_ID } from "@/src/app/(dashboard)/geolens/types";
import { fetchUserProfileApi } from "@/src/app/(root)/loader";
import { getAllProjectsApi } from "@/src/app/(dashboard)/manage/loader";
import { getMyWorkspaces } from "@/src/app/(root)/workspaces/loader";
import { createWorkspaceApi } from "@/src/app/(root)/workspaces/loader";
import type { Workspace } from "@/src/types/global";
import {
  useCanUploadAnywhere,
  useHasPermission,
  useIsSuperAdmin,
  useIsWorkspaceAdmin,
} from "@/src/hooks/check-permission";
import {
  getStoredSuperAdminProjectId,
  isSuperAdminLabFlowEnabled,
  isUserSuperAdmin,
  resolveSuperAdminProject,
} from "@/src/lib/super-admin-lab-flow";

type NavItem = {
  href: string;
  label: string;
  icon: ElementType;
  active: boolean;
  badge?: number;
};

export default function Header() {
  const pathname = usePathname();
  // GeoLens puts its own controls in the header instead of the breadcrumb and search.
  const isGeoLens = pathname === "/geolens";
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [currentWorkspace, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [createWorkspaceError, setCreateWorkspaceError] = useState("");
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const routeProjectId = pathname.match(/^\/projects\/([^/]+)/)?.[1] ?? "";

  const isSuperAdmin = useIsSuperAdmin();
  const isWorkspaceAdmin = useIsWorkspaceAdmin();
  const hasPermission = useHasPermission();
  const canUpload = useCanUploadAnywhere();
  // No `user.projects?.[0]?.id` fallback: picking an arbitrary project from
  // a multi-project user's list would silently evaluate these checks
  // against the wrong project. Without a resolved project, hasPermission
  // falls through to workspace/system roles for currentWorkspaceAtom on its
  // own - which is correct here since canAdmin/canLab already OR in
  // isSuperAdmin/isWorkspaceAdmin separately.
  const activeProjectId = routeProjectId || user?.project?.id;
  const canAdmin =
    isSuperAdmin ||
    isWorkspaceAdmin ||
    hasPermission("read", "project", activeProjectId);
  const canLab =
    hasPermission("read", "sample-test", activeProjectId) ||
    (isSuperAdmin && isSuperAdminLabFlowEnabled() && !!activeProjectId);
  // 4.3: workspace-admins have no user.project of their own (their UserRole
  // is workspace-scoped, not project-scoped) - without this they'd fall
  // through to the dead "#" href despite canAdmin being true for them.
  const adminHref =
    isSuperAdmin || isWorkspaceAdmin ? "/manage" : canAdmin ? "/manage" : "#";

  const fetchUser = async () => {
    try {
      const { success, data } = await fetchUserProfileApi();
      if (success) {
        let nextUser = data;

        if (pathname.startsWith("/projects/") && data.projects?.length) {
          const pathProjectId = pathname.split("/")[2];
          const matchedProject =
            data.projects.find((project) => project.id === pathProjectId) ??
            data.project ??
            data.projects[0];

          nextUser = {
            ...data,
            project: matchedProject,
          };
        }

        if (isSuperAdminLabFlowEnabled() && isUserSuperAdmin(data)) {
          try {
            const projectsResponse = await getAllProjectsApi({
              page: 1,
              limit: 500,
            });
            if (projectsResponse.success) {
              const selectedProject = resolveSuperAdminProject(
                projectsResponse.data,
                getStoredSuperAdminProjectId(),
                data.project?.id,
              );

              nextUser = {
                ...data,
                projects: projectsResponse.data,
                project: selectedProject ?? data.project,
              };
            }
          } catch (error) {
            console.error(
              "Failed to load projects for super admin lab flow",
              error,
            );
          }
        }

        setUser(nextUser);
      }
    } catch {
      console.warn(
        "Could not fetch user profile - backend may be unavailable.",
      );
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname, user?.id]);

  // 4.3: fetch the switcher's options, and silently settle on the only
  // workspace if the atom hasn't been set yet (e.g. an already-logged-in
  // session from before this feature existed never went through the
  // /workspaces picker).
  //
  // Also VALIDATE an existing selection against what the server actually
  // returns. currentWorkspaceAtom is localStorage-backed, so it outlives the
  // session: a user removed from a workspace — or a second user on a shared
  // browser — would otherwise keep operating "inside" a workspace they can no
  // longer reach. The backend correctly refuses to serve its data, so the
  // symptom is blank dashboards and a stale name in the nav with nothing
  // explaining why. Re-syncing the stored copy also picks up a rename.
  useEffect(() => {
    if (!user?.id) return;
    getMyWorkspaces()
      .then((data) => {
        setWorkspaces(data);

        if (!currentWorkspace) {
          if (data.length === 1) setCurrentWorkspace(data[0]);
          return;
        }

        const stillAMember = data.find((w) => w.id === currentWorkspace.id);
        if (!stillAMember) {
          // Fall back to their only remaining workspace rather than stranding
          // them; with several, clear it so the picker decides.
          setCurrentWorkspace(data.length === 1 ? data[0] : null);
          return;
        }
        if (stillAMember.name !== currentWorkspace.name) {
          setCurrentWorkspace(stillAMember);
        }
      })
      .catch((error) => console.error("Failed to load workspaces", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(event.target as Node)
      ) {
        setShowWorkspaceMenu(false);
        setShowCreateWorkspace(false);
        setNewWorkspaceName("");
        setCreateWorkspaceError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setShowWorkspaceMenu(false);
    router.refresh();
  };

  const handleCreateWorkspace = async () => {
    const name = newWorkspaceName.trim();
    if (!name) {
      setCreateWorkspaceError("Workspace name is required.");
      return;
    }

    if (
      workspaces.some(
        (w) => w.name.trim().toLowerCase() === name.toLowerCase(),
      )
    ) {
      setCreateWorkspaceError(`Workspace with name "${name}" already exists.`);
      return;
    }

    setIsCreatingWorkspace(true);
    setCreateWorkspaceError("");
    try {
      const created = await createWorkspaceApi(name);
      setWorkspaces((prev) => [...prev, created]);
      setCurrentWorkspace(created);
      setNewWorkspaceName("");
      setCreateWorkspaceError("");
      setShowCreateWorkspace(false);
      setShowWorkspaceMenu(false);
      router.refresh();
      // Show success notification — imported from react-toastify like the rest of the app
      const { toast } = await import("react-toastify");
      toast.success("Workspace created successfully!");
    } catch (err) {
      console.error("Failed to create workspace", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create workspace";
      setCreateWorkspaceError(errorMsg);
      const { toast } = await import("react-toastify");
      toast.error(errorMsg);
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GeoLens needs the room for its map: the sidebar folds away on arriving
  // there (the user can open it again, and it stays as they leave it)
  useEffect(() => {
    if (isGeoLens) setCollapsed(true);
  }, [isGeoLens]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--dashboard-sidebar-width",
      collapsed ? "88px" : "256px",
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--dashboard-sidebar-width",
      );
    };
  }, [collapsed]);

  const monitorItems: NavItem[] = [
    { href: "/home", label: "Home", icon: Home, active: pathname === "/home" },
    {
      href: "/monitor",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/monitor",
    },
    {
      href: "/geolens",
      label: "Geolens",
      icon: Map,
      active: pathname === "/geolens",
    },
    {
      href: "/comparison",
      label: "Comparison",
      icon: Activity,
      active: pathname.startsWith("/comparison"),
    },
    ...(canLab
      ? [
        {
          href: "/lab",
          label: "Lab Processing",
          icon: FlaskConical,
          active: pathname.startsWith("/lab"),
        },
      ]
      : []),
    {
      href: "/sequencing",
      label: "SNP Analysis",
      icon: Dna,
      active: pathname.startsWith("/sequencing"),
    },
  ];

  const manageItems: NavItem[] = [
    ...(canAdmin
      ? [
        {
          href: adminHref,
          label: "Projects",
          icon: Folder,
          active:
            pathname === "/manage" || /^\/projects\/[\w-]+/.test(pathname),
        },
      ]
      : []),
    ...(canUpload
      ? [
        {
          href: "/upload",
          label: "Upload Data Files",
          icon: Upload,
          active: pathname.startsWith("/upload"),
        },
      ]
      : []),
    {
      href: "/team",
      label: "Team & User Management",
      icon: Users,
      active: pathname === "/team",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  const breadcrumbs = useMemo(() => {
    const segments = pathname
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      );

    return segments.length ? segments : ["Home"];
  }, [pathname]);

  if (pathname === "/") {
    return null;
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[95] bg-grey-90/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col border-r border-grey-20 bg-blue-40 text-white shadow-xl transition-all duration-300 ease-in-out ${collapsed ? "w-[88px]" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-4">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
            <Image
              src="/images/site-logo.png"
              fill
              sizes="40px"
              className="object-contain"
              alt="Dharini logo"
              priority
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-5">
                Dharini
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-white/55">
                Surveillance
              </p>
            </div>
          )}
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:bg-white/15 lg:flex"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {!collapsed && (
          <div
            className="relative border-b border-white/10 p-3"
            ref={workspaceMenuRef}
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/10"
              onClick={() => setShowWorkspaceMenu((prev) => !prev)}
            >
              <Building2 className="h-4 w-4 shrink-0 text-white/60" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                {currentWorkspace?.name ?? "Select workspace"}
              </span>
              {(workspaces.length > 1 || isSuperAdmin || isWorkspaceAdmin) && (
                <ChevronDown className="h-4 w-4 shrink-0 text-white/55" />
              )}
            </button>
            {showWorkspaceMenu && workspaces.length > 0 && (
              <div className="absolute left-3 right-3 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-lg border border-grey-20 bg-white py-1 shadow-lg">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-grey-80 hover:bg-grey-10"
                    onClick={() => handleSelectWorkspace(workspace)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {workspace.name}
                    </span>
                    {workspace.id === currentWorkspace?.id && (
                      <Check className="h-4 w-4 shrink-0 text-blue-40" />
                    )}
                  </button>
                ))}
                {(isSuperAdmin || isWorkspaceAdmin) && (
                  <>
                    <div className="mx-2 my-1 border-t border-grey-20" />
                    {showCreateWorkspace ? (
                      <div className="px-3 py-2 flex flex-col gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={newWorkspaceName}
                          onChange={(e) => {
                            setNewWorkspaceName(e.target.value);
                            if (createWorkspaceError) setCreateWorkspaceError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateWorkspace();
                            if (e.key === "Escape") {
                              setShowCreateWorkspace(false);
                              setNewWorkspaceName("");
                              setCreateWorkspaceError("");
                            }
                          }}
                          placeholder="Workspace name"
                          className={`w-full rounded-md border px-2 py-1.5 text-sm text-grey-80 outline-none focus:border-blue-40 ${createWorkspaceError
                            ? "border-red-30"
                            : "border-grey-20"
                            }`}
                        />
                        {createWorkspaceError && (
                          <p className="text-xs text-red-30 leading-tight">
                            {createWorkspaceError}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCreateWorkspace}
                            disabled={
                              isCreatingWorkspace || !newWorkspaceName.trim()
                            }
                            className="flex-1 rounded-md bg-blue-40 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                          >
                            {isCreatingWorkspace ? "Creating..." : "Create"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCreateWorkspace(false);
                              setNewWorkspaceName("");
                              setCreateWorkspaceError("");
                            }}
                            className="rounded-md border border-grey-20 p-1.5 text-grey-60 hover:bg-grey-10"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-blue-40 hover:bg-grey-10"
                        onClick={() => {
                          setCreateWorkspaceError("");
                          setShowCreateWorkspace(true);
                        }}
                      >
                        <Plus className="h-4 w-4 shrink-0" />
                        New Workspace
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-5">
          <SidebarSection
            title="Monitor"
            items={monitorItems}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
          />
          <SidebarSection
            title="Manage"
            items={manageItems}
            collapsed={collapsed}
            onNavigate={() => setMobileOpen(false)}
          />
        </nav>

        <div
          className="relative border-t border-white/10 p-3"
          ref={profileMenuRef}
        >
          <button
            type="button"
            className={`flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition hover:bg-white/10 ${collapsed ? "justify-center" : ""
              }`}
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            {user?.profilePicture ? (
              <Image
                className="h-9 w-9 rounded-full object-cover"
                src={user.profilePicture}
                width={36}
                height={36}
                alt="profile photo"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-10 text-xs font-semibold uppercase text-grey-80">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </div>
            )}
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold capitalize leading-5">
                    {user?.firstName ?? "-"} {user?.lastName ?? "-"}
                  </p>
                  <p className="truncate text-xs capitalize leading-4 text-white/55">
                    {(() => {
                      const allRoles = user?.roles ?? [];
                      const scoped = currentWorkspace
                        ? allRoles.filter(
                          (r) =>
                            r.workspace?.id === currentWorkspace.id ||
                            (!r.workspace && r.role?.scope === "system"),
                        )
                        : allRoles;
                      const display = scoped.length ? scoped : allRoles;
                      return display.length
                        ? [
                          ...new Set(
                            display
                              .map((r) => r.role?.name?.replace(/-/g, " "))
                              .filter(Boolean),
                          ),
                        ].join(", ")
                        : "-";
                    })()}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-white/55" />
              </>
            )}
          </button>
          {showProfileMenu && (
            <UserMenu onClose={() => setShowProfileMenu(false)} />
          )}
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-[90] flex h-[76px] items-center justify-between border-b border-grey-20 bg-white px-4 transition-[padding] duration-300 lg:pl-[calc(var(--dashboard-sidebar-width,256px)+24px)] lg:pr-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-grey-20 bg-white text-blue-40 shadow-sm lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {!isGeoLens && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-grey-60">Dharini</span>
              {breadcrumbs.map((crumb, index) => (
                <span
                  className="flex items-center gap-2"
                  key={`${crumb}-${index}`}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-grey-50" />
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "font-semibold text-grey-90"
                        : "text-grey-60"
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
        {isGeoLens ? (
          // GeoLens renders its title, tabs, location search and filters here
          // (see GeoLensTopBar) so the page has a single header row.
          <div
            id={GEOLENS_HEADER_SLOT_ID}
            className="ml-3 flex min-w-0 flex-1 items-center"
          />
        ) : (
          <div className="hidden w-full max-w-[360px] sm:block">
            <HeaderSearch darkMode={false} />
          </div>
        )}
      </header>
    </>
  );
}

function SidebarSection({
  title,
  items,
  collapsed,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  onNavigate: () => void;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-6">
      {!collapsed && (
        <p className="mb-2 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
          {title}
        </p>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarLink
            key={`${item.href}-${item.label}`}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
      className={`relative flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${item.active
        ? "bg-white/[0.16] text-white shadow-sm before:absolute before:left-0 before:top-2 before:h-7 before:w-1 before:rounded-r-full before:bg-white"
        : "text-white/72 hover:bg-white/10 hover:text-white"
        } ${collapsed ? "justify-center px-0" : ""}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge ? (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-30 px-1.5 text-[11px] font-bold leading-none text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
