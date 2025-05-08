import { NextResponse } from "next/server";
import urlMetadata from "url-metadata";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "url parameter is required" },
      { status: 400 },
    );
  }

  try {
    const data = await urlMetadata(targetUrl, {
      cache: "force-cache",
    });

    return NextResponse.json({
      title: data["og:title"] || data.title,
      image: data["og:image"],
      description: data["og:desciption"] || data.description,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
