import ProfileContainer from "@/src/components/profile/profile-container";

export const metadata = {
  title: "Profile | Dharini",
  description: "View and edit your personal profile and workspace details.",
};

export default function ProfilePage() {
  return (
    <div className="dashboard-page-shell flex flex-col gap-6 bg-subtle min-h-[calc(100vh-76px)]">
      <ProfileContainer />
    </div>
  );
}
