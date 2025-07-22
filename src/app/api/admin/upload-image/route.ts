import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || "image";

    if (!request.body) {
      throw new Error("No image in request body");
    }

    const blob = await put(filename, request.body, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
