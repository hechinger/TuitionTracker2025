import { NextResponse } from "next/server";
import { pipeline } from "@/pipeline";
import { revalidateSchools } from "@/cache";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const year = parseInt(searchParams.get("year") || "", 10);

    if (!year || Number.isNaN(year)) {
      throw new Error("Specify year in query parameter");
    }

    // Do not await this promise so that it runs in the background
    pipeline({ year }).then(() => revalidateSchools());

    return NextResponse.json({
      message: "Success",
      year,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
