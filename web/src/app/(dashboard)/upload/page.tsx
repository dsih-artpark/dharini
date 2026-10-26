import { Suspense } from "react";
import UploadPage from "@/src/components/upload/upload-page";
import Spinner from "@/src/components/ui/spinner";

// UploadPage reads `?projectId=` via useSearchParams, which needs a
// Suspense boundary in the App Router.
export default function Upload() {
  return (
    <Suspense
      fallback={
        <div className="dashboard-page-shell flex justify-center">
          <Spinner />
        </div>
      }
    >
      <UploadPage />
    </Suspense>
  );
}
