"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";

import { userAtom } from "@/src/store/userAtom";
import { getTeamsByProjectIdApi } from "@/src/app/(dashboard)/manage/loader";
import { Team } from "@/src/types/teams";
import AddUpdateTeamMember from "@/src/components/projects/manage-access/add-update-team-member";
import DeleteTeamMember from "@/src/components/projects/manage-access/delete-team-member";
import AddTeam from "@/src/components/projects/manage-access/add-team";
import EditTeam from "@/src/components/projects/manage-access/edit-team";
import Loader from "@/src/components/ui/loader";
import { User } from "@/src/types/global";
import { useHasPermission } from "@/src/hooks/check-permission";
import { toast } from "react-toastify";

export default function ManageAccess() {
  const { id } = useParams<{ id: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addTeamModal, setAddTeamModal] = useState<{
    visible: boolean;
  }>({ visible: false });
  const [editTeamModal, setEditTeamModal] = useState<{
    visible: boolean;
    team?: Team;
  }>({ visible: false });
  const [addMemberModal, setAddMemberModal] = useState<{
    visible: boolean;
    teamId: string;
    member?: Partial<User>;
  }>({ visible: false, teamId: "" });
  const [removeMemberModal, setRemoveMemberModal] = useState<{
    visible: boolean;
    teamId: string;
    memberId: string;
  }>({ visible: false, teamId: "", memberId: "" });
  const [collapseState, setCollapseState] = useState<boolean[]>(
    Array.from({ length: teams?.length || 0 }, () => false),
  );
  const hasPermission = useHasPermission();
  const canCreateTeam = hasPermission("create", "team", id);
  const canEditTeam = hasPermission("update", "team", id);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const response = await getTeamsByProjectIdApi(id);
        if (response.success) {
          setTeams(response.data);
        }
      } catch (e) {
        toast.error((e as Error)?.message ?? "Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleCollapse = (index: number) => {
    const newCollapseState = [...collapseState];
    newCollapseState[index] = !newCollapseState[index];
    setCollapseState(newCollapseState);
  };

  const onTeamAdded = (teamData: Team) => {
    setTeams((prevTeams) => [...prevTeams, teamData]);
  };

  const onTeamUpdated = (teamData: Team) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamData.id ? { ...team, ...teamData } : team,
      ),
    );
  };

  const onAddMember = (teamId: string) => async (memberData: Partial<User>) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? { ...team, members: [memberData, ...team.members] }
          : team,
      ),
    );
  };

  const onUpdateMember =
    (teamId: string, memberId: string) => async (memberData: Partial<User>) => {
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                members: [
                  ...team.members.map((m) =>
                    m.id === memberId ? memberData : m,
                  ),
                ],
              }
            : team,
        ),
      );
    };

  const onMemberRemoved = (teamId: string, memberId: string) => async () => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: [...team.members.filter((m) => m.id !== memberId)],
            }
          : team,
      ),
    );
  };

  return (
    <section className="flex flex-col rounded-2xl border border-grey-20 bg-white shadow-card overflow-hidden">
      <div className="flex items-start justify-between px-6 py-6">
        <h1 className="text-2xl font-semibold text-grey-90">Manage Teams</h1>
        {canCreateTeam && (
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-blue-40 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            onClick={() => setAddTeamModal({ visible: true })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M9.33463 9.50264V10.896C8.73125 10.6826 8.08549 10.6172 7.45157 10.7052C6.81766 10.7931 6.2141 11.0319 5.69159 11.4014C5.16908 11.771 4.74286 12.2605 4.44874 12.8289C4.15462 13.3973 4.00118 14.028 4.0013 14.668L2.66797 14.6673C2.66776 13.8532 2.85392 13.0499 3.21217 12.3189C3.57042 11.5879 4.09126 10.9486 4.73478 10.45C5.3783 9.95139 6.12742 9.60672 6.92474 9.4424C7.72206 9.27807 8.54641 9.29845 9.33463 9.50197V9.50264ZM8.0013 8.66797C5.7913 8.66797 4.0013 6.87797 4.0013 4.66797C4.0013 2.45797 5.7913 0.667969 8.0013 0.667969C10.2113 0.667969 12.0013 2.45797 12.0013 4.66797C12.0013 6.87797 10.2113 8.66797 8.0013 8.66797ZM8.0013 7.33464C9.47464 7.33464 10.668 6.1413 10.668 4.66797C10.668 3.19464 9.47464 2.0013 8.0013 2.0013C6.52797 2.0013 5.33464 3.19464 5.33464 4.66797C5.33464 6.1413 6.52797 7.33464 8.0013 7.33464ZM12.0013 11.3346V9.33464H13.3346V11.3346H15.3346V12.668H13.3346V14.668H12.0013V12.668H10.0013V11.3346H12.0013Z"
                fill="white"
              />
            </svg>
            Add Team
          </button>
        )}
      </div>
      {isLoading && (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader />
        </div>
      )}
      {!isLoading && teams.length > 0 && (
        <div className="flex flex-col">
          {teams.map((team, index) => (
            <div key={team.id} className="flex flex-col">
              <div
                className={`flex cursor-pointer items-start justify-between px-6 py-4 ${
                  collapseState[index]
                    ? "bg-grey-10"
                    : "border-t border-grey-20"
                }`}
                onClick={() => handleCollapse(index)}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-8">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center transition-transform ${
                        collapseState[index] ? "rotate-180" : "rotate-90"
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.0007 10.828L7.05072 15.778L5.63672 14.364L12.0007 8L18.3647 14.364L16.9507 15.778L12.0007 10.828Z"
                          fill="#5D7FDD"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-grey-80">
                      {team.teamName}
                    </p>
                    {canEditTeam && (
                      <button
                        className="flex h-5 w-5 items-center justify-center text-primary-500 transition-colors hover:text-primary-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTeamModal({
                            visible: true,
                            team,
                          });
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.48533 4.45739L7.54267 3.51472L1.33333 9.72406V10.6667H2.276L8.48533 4.45739ZM9.428 3.51472L10.3707 2.57206L9.428 1.62939L8.48533 2.57206L9.428 3.51472ZM2.828 12.0001H0V9.17139L8.95667 0.214722C9.08169 0.0897416 9.25122 0.0195312 9.428 0.0195312C9.60478 0.0195312 9.77432 0.0897416 9.89933 0.214722L11.7853 2.10072C11.9103 2.22574 11.9805 2.39528 11.9805 2.57206C11.9805 2.74883 11.9103 2.91837 11.7853 3.04339L2.82867 12.0001H2.828Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-sm font-light text-grey-70">
                    {team.members.length} Members{" "}
                    {team.address && (
                      <span>
                        <span className="mx-2">|</span>Address: {team.address}
                      </span>
                    )}
                  </p>
                </div>
                {hasPermission("create", "team-member", id, team.id) && (
                  <button
                    className="inline-flex items-center gap-1 rounded-lg border border-primary-500 px-2 py-1 text-xs font-medium text-primary-500 transition-colors hover:bg-primary-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMemberModal({ visible: true, teamId: team.id });
                    }}
                  >
                    + Add New Member
                  </button>
                )}
              </div>
              {collapseState[index] && (
                <div className="flex flex-col gap-2 border-grey-20 pb-10">
                  <div className="flex flex-col justify-between gap-4 border-b border-grey-20 px-6 py-3 sm:flex-row sm:gap-4">
                    <label className="text-sm font-medium text-grey-70 sm:w-1/4 sm:pl-8">
                      Email
                    </label>
                    <label className="text-sm font-medium text-grey-70 sm:w-1/4">
                      Name
                    </label>
                    <label className="text-sm font-medium text-grey-70 sm:w-1/4">
                      Phone Number
                    </label>
                    <label className="text-sm font-medium text-grey-70 sm:w-1/4">
                      Roles
                    </label>
                    <label className="min-w-[60px] text-sm font-medium text-grey-80">
                      Actions
                    </label>
                  </div>
                  {team.members.map((member: Partial<User>) => (
                    <div
                      key={member.id}
                      className="flex flex-col gap-4 px-6 py-2 sm:flex-row sm:gap-4"
                    >
                      <div className="flex gap-2 sm:w-1/4">
                        <p className="flex h-6 w-6 items-center justify-center rounded-full bg-grey-20 text-center text-sm capitalize text-grey-80">
                          {member.email?.charAt(0)}
                        </p>
                        <p className="text-sm text-grey-80">{member.email}</p>
                      </div>
                      <p className="text-sm text-grey-80 sm:w-1/4">
                        {member.firstName ?? "-"} {member.lastName}
                      </p>
                      {member.contactNumber ? (
                        <p className="text-sm text-grey-80 sm:w-1/4">
                          {member.contactNumber}
                        </p>
                      ) : (
                        <p className="text-xs font-light text-grey-80 sm:w-1/4">
                          Not Available
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 sm:w-1/4">
                        {!!member.roles?.length
                          ? [
                              ...new Set(
                                member.roles
                                  ?.map((r) => r.role?.name)
                                  .filter((r): r is string => !!r),
                              ),
                            ].map((r) => (
                              <p
                                key={r}
                                className="w-fit whitespace-nowrap rounded-lg bg-primary-50 px-2 py-1 text-sm text-primary-700"
                              >
                                {r}
                              </p>
                            ))
                          : "-"}
                      </div>
                      <div className="flex min-w-[60px] items-center justify-end gap-4">
                        {user?.id === member.id && (
                          <p className="w-full text-center text-sm text-grey-60">
                            [You]
                          </p>
                        )}
                        {user?.id !== member.id &&
                          hasPermission(
                            "update",
                            "team-member",
                            id,
                            team.id,
                          ) && (
                            <button
                              className="h-5 w-5 text-primary-500 transition-colors hover:text-primary-700"
                              onClick={() =>
                                setAddMemberModal({
                                  visible: true,
                                  teamId: team.id,
                                  member,
                                })
                              }
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.48533 4.45739L7.54267 3.51472L1.33333 9.72406V10.6667H2.276L8.48533 4.45739ZM9.428 3.51472L10.3707 2.57206L9.428 1.62939L8.48533 2.57206L9.428 3.51472ZM2.828 12.0001H0V9.17139L8.95667 0.214722C9.08169 0.0897416 9.25122 0.0195312 9.428 0.0195312C9.60478 0.0195312 9.77432 0.0897416 9.89933 0.214722L11.7853 2.10072C11.9103 2.22574 11.9805 2.39528 11.9805 2.57206C11.9805 2.74883 11.9103 2.91837 11.7853 3.04339L2.82867 12.0001H2.828Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          )}
                        {user?.id !== member.id &&
                          hasPermission(
                            "delete",
                            "team-member",
                            id,
                            team.id,
                          ) && (
                            <button
                              className="h-5 w-5 text-red-30 transition-colors hover:text-red-600"
                              onClick={() =>
                                setRemoveMemberModal({
                                  visible: true,
                                  teamId: team.id,
                                  memberId: member.id ?? "",
                                })
                              }
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <AddTeam
        {...addTeamModal}
        onClose={() => setAddTeamModal({ visible: false })}
        onTeamAdded={onTeamAdded}
      />
      <EditTeam
        {...editTeamModal}
        onClose={() => setEditTeamModal({ visible: false })}
        onTeamUpdated={onTeamUpdated}
      />
      <AddUpdateTeamMember
        isOpen={addMemberModal.visible}
        teamId={addMemberModal.teamId}
        defaultMemberData={addMemberModal.member}
        onClose={() => setAddMemberModal({ visible: false, teamId: "" })}
        onAddMember={onAddMember(addMemberModal.teamId)}
        onUpdateMember={onUpdateMember(
          addMemberModal.teamId,
          addMemberModal.member?.id ?? "",
        )}
      />
      <DeleteTeamMember
        projectId={id}
        isOpen={removeMemberModal.visible}
        teamId={removeMemberModal.teamId}
        memberId={removeMemberModal.memberId}
        onClose={() =>
          setRemoveMemberModal({ visible: false, teamId: "", memberId: "" })
        }
        onMemberRemoved={onMemberRemoved(
          removeMemberModal.teamId,
          removeMemberModal.memberId,
        )}
      />
    </section>
  );
}
