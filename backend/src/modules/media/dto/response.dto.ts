export class FileUploadResult {
  filename: string;
  uploaded: boolean;
  fileUrl: string | null;
  publicUrl: string | null;
}

export class UploadMultipleFilesResponse {
  success: boolean;
  message: string;
  data: FileUploadResult[];
}
