import cloudinary from "@/lib/cloudinary";

export interface UploadResult {
  public_id: string;
  url: string;
  [key: string]: unknown;
}

export const uploadFile = (buffer: Buffer): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error || !result)
          return reject(error || new Error("Upload failed"));
        resolve(result as UploadResult);
      }
    );
    stream.end(buffer);
  });
};

export const deleteFile = async (public_id: string) => {
  const result = await cloudinary.uploader.destroy(public_id);
  return result;
};
