import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { pipeline } from "@/pipeline";
import { revalidateSchools } from "@/cache";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const year = parseInt(searchParams.get("year") || "", 10);

    if (!year || Number.isNaN(year)) {
      throw new Error("Specify year in query parameter");
    }

    // Use waitUntil to keep the serverless function alive while the
    // pipeline runs in the background after the response is sent.
    waitUntil(pipeline({ year }).then(() => revalidateSchools()));

    return NextResponse.json({
      message: "Success",
      year,
    });
  } catch (error) {
    console.error("[pipeline]", error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
