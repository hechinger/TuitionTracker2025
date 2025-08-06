import { NextResponse } from "next/server";
import { setContent } from "@/db/content";
import { revalidateContent } from "@/cache";

export async function POST(request: Request) {
  try {
    const content = await request.json();
    await setContent(content);
    await revalidateContent();
    return NextResponse.json({
      message: "Content updated",
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
