import { NextResponse } from "next/server";
// import { pipeline } from "@/pipeline";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const year = parseInt(searchParams.get("year") || "", 10);

    if (!year || Number.isNaN(year)) {
      throw new Error("Specify year in query parameter");
    }

    // await pipeline({ year });
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });

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
