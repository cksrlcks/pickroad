import { S3Client } from "@aws-sdk/client-s3";
import { getPresignedUrlAction } from "@/features/roadmap/server/action";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_END_POINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const uploadImageByClient = async (file: File) => {
  try {
    const response = await getPresignedUrlAction();

    if (!response.success || !response.payload) {
      throw new Error(response.message);
    }

    const { presignedUrl, fileUrl } = response.payload;
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`${uploadResponse.status}: ${uploadResponse.statusText}`);
    }

    return fileUrl;
  } catch (error) {
    throw new Error(
      `${error instanceof Error ? error.message : "이미지 업로드 실패"}`,
    );
  }
};
