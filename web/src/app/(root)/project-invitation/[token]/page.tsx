"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProjectInviteByInviteToken } from "@/src/app/(root)/project-invitation/loader";
import { acceptProjectInvite } from "@/src/app/(root)/project-invitation/actions";
import Loader from "@/src/components/ui/loader";

export default function ProjectInvite() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleInvite = async () => {
    if (!token) return;

    try {
      await acceptProjectInvite(token);
      const { projectId } = await getProjectInviteByInviteToken(token);
      router.replace(`/project-onboarding/${projectId}`);
    } catch (err) {
      console.error("Error accepting invite:", err);
      // setError((err as Error).message);
      setLoading(false);
      // setTimeout(() => {
      //   router.replace("/");
      // }, 3000);
    }
  };

  useEffect(() => {
    if (token) {
      handleInvite();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <p className="mt-10 text-center">Accepting your invite</p>
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="mb-10 text-xl font-semibold text-center text-grey-80">
        Invalid Token
      </h2>
      <p className="mb-10 text-center text-grey-60">
        The token used for invitation has expired or invalid.
      </p>
      {/* <p className="mt-10 text-center">You will be redirected shortly...</p> */}
    </div>
  );
}
