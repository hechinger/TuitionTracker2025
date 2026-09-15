import { NextResponse, after } from "next/server";
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

    // Run the pipeline in the background after the response is sent. This
    // must be `after` rather than a bare `waitUntil`: Next.js applies
    // `revalidatePath` calls when the handler's response completes, so a
    // purge queued minutes later from `waitUntil` is silently dropped.
    // Callbacks passed to `after` get their revalidations applied when they
    // finish.
    after(async () => {
      await pipeline({ year });
      await revalidateSchools();
    });

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
