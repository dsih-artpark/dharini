declare namespace Express {
  export interface Multer {
    File: {
      /** Name of the file on the user's computer */
      originalname: string;
      /** Encoding type of the file */
      encoding: string;
      /** MIME type of the file */
      mimetype: string;
      /** Size of the file in bytes */
      size: number;
      /** Destination folder where the file was uploaded */
      destination: string;
      /** Name of the file within the destination */
      filename: string;
      /** Absolute path to the file */
      path: string;
      /** Buffer of the uploaded file (if applicable) */
      buffer: Buffer;
    };
  }
}
