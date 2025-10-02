import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

export type UploadResult = UploadApiResponse;

export const uploadFile = (buffer: Buffer): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        flags: "attachment:false",
        access_mode: "public",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const deleteFile = async (public_id: string) => {
  return cloudinary.uploader.destroy(public_id);
};