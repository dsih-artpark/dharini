import { ProjectDetail } from "@/src/types/global";

export type UserProfile = {
  id?: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
  organizationName?: string;
  designation?: string;
  contactNumber?: string;
  address?: string;
  email?: string;
  otp?: string;
  userType?: string;
  status?: number;
  profilePicture?: string;
  roles?: UserRole[];
  organization?: {
    id?: string;
    organizationName: string;
  };
  team?: {
    id: string;
    teamName: string;
    logo: string;
  };
  project?: ProjectDetail;
  projects?: ProjectDetail[];
  visible?: boolean;
};

export type UserRole = {
  id: string;
  team: string;
  project: string;
  status: number;
  role: Role;
  // 4.5: populated on workspace-member rows (GET /workspaces/:id/members) -
  // absent on plain project/team-role rows elsewhere in the app.
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    contactNumber?: string;
  };
  // A7: as of the backend fix, this is now populated on `/users/profile`'s
  // role rows too, not just on workspace-member rows (GET
  // /workspaces/:id/members) as the `user` field above still is - the
  // response DTO's `UserRole` class in
  // backend/src/common/dto/response/base.response.ts exposes it via a
  // strict, Exclude-guarded `Workspace` response DTO ({id, name} only).
  // `useIsWorkspaceAdmin()` (hooks/check-permission.ts) relies on this
  // being present to scope admin status to the current workspace.
  workspace?: { id: string; name: string } | null;
};

export type Role = {
  id: string;
  name: string;
  scope: string;
  type: string;
  status: number;
  permissions?: [Permission];
};

export type Permission = {
  id: string;
  action: string;
  subject: string;
  status: number;
};
