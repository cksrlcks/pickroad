"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ulid } from "ulid";
import urlMetadata from "url-metadata";
import {
  Roadmap,
  RoadmapFormWithUploadedUrl,
  roadmapInsertSchema,
  RoadmapItemMetaData,
} from "@/features/roadmap/type";
import { auth } from "@/lib/auth";
import { r2 } from "@/lib/r2-client";
import { isValidUrl } from "@/lib/utils";
import { ServerActionResult } from "@/types";
import {
  bookmarkRoadmap,
  createRoadmap,
  deleteRoadmap,
  updateRoadmap,
  getRoadmapAuthorId,
  likeRoadmap,
  unbookmarkRoadmap,
  unlikeRoadmap,
} from "./service";

export const getPresignedUrlAction = async (): Promise<
  ServerActionResult<{ presignedUrl: string; fileUrl: string }>
> => {
  const key = `uploads/${ulid()}`;
  const bucket = process.env.R2_BUCKET_NAME;

  try {
    const presignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 3600 },
    );

    return {
      success: true,
      message: "presignedUrl을 성공적으로 가져왔습니다.",
      payload: {
        presignedUrl,
        fileUrl: `${process.env.R2_CDN_URL}/${key}`,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "업로드를 할 수 없습니다.",
    };
  }
};

export const createRoadmapAction = async (
  form: RoadmapFormWithUploadedUrl,
): Promise<ServerActionResult<{ externalId?: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = roadmapInsertSchema.safeParse(form);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    const { externalId } = await createRoadmap({
      ...form,
      authorId: session.user.id,
    });

    revalidatePath("/");

    return {
      success: true,
      message: "성공적으로 작성했습니다.",
      payload: {
        externalId: externalId,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const updateRoadmapAction = async (
  form: RoadmapFormWithUploadedUrl,
): Promise<ServerActionResult<{ externalId?: string }>> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  if (form?.authorId !== session.user.id) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  const parsed = roadmapInsertSchema.safeParse(form);

  if (!parsed.success) {
    return {
      success: false,
      message: "입력필드를 다시 확인해주세요",
    };
  }

  try {
    const { externalId } = await updateRoadmap(form);

    revalidatePath("/");
    revalidatePath(`/roadmap/${externalId}`);

    return {
      success: true,
      message: "성공적으로 수정되었습니다.",
      payload: {
        externalId: externalId,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const deleteRoadmapAction = async (
  id: Roadmap["id"],
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  const { authorId } = await getRoadmapAuthorId(id);

  if (authorId !== session.user.id) {
    return {
      success: false,
      message: "권한이 없습니다.",
    };
  }

  try {
    await deleteRoadmap(id);

    revalidatePath("/");

    return {
      success: true,
      message: "성공적으로 삭제했습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const getOgDataAction = async (
  url: string,
): Promise<ServerActionResult<RoadmapItemMetaData>> => {
  if (!isValidUrl(url)) {
    return {
      success: false,
      message: "정확한 url을 입력해주세요",
    };
  }

  try {
    const data = await urlMetadata(url, {
      cache: "no-cache",
      requestHeaders: {
        "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
      },
    });

    return {
      success: true,
      message: "메타데이터를 성공적으로 가져왔습니다.",
      payload: {
        title: data["og:title"] || data.title,
        image: data["og:image"],
        description: data["og:description"] || data.description,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "메타데이터를 불러오는 데 실패했습니다. 링크가 차단되었거나 권한이 없을 수 있습니다.",
    };
  }
};

export const likeRoadmapAction = async (
  id: Roadmap["id"],
  externalId: Roadmap["externalId"],
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  try {
    await likeRoadmap(session.user.id, id);
    revalidatePath(`/roadmap/${externalId}`);

    return {
      success: true,
      message: "로드맵에 좋아요를 눌렀습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const unlikeRoadmapAction = async (
  id: Roadmap["id"],
  externalId: Roadmap["externalId"],
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  try {
    await unlikeRoadmap(session.user.id, id);

    revalidatePath(`/roadmap/${externalId}`);

    return {
      success: true,
      message: "로드맵의 좋아요를 취소했습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const bookmarkRoadmapAction = async (
  id: Roadmap["id"],
  externalId: Roadmap["externalId"],
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  try {
    await bookmarkRoadmap(session.user.id, id);

    revalidatePath(`/roadmap/${externalId}`);

    return {
      success: true,
      message: "로드맵을 북마크했습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};

export const unbookmarkRoadmapAction = async (
  id: Roadmap["id"],
  externalId: Roadmap["externalId"],
): Promise<ServerActionResult> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "로그인을 해주세요",
    };
  }

  try {
    await unbookmarkRoadmap(session.user.id, id);

    revalidatePath(`/roadmap/${externalId}`);

    return {
      success: true,
      message: "로드맵의 북마크를 취소했습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};
