import { NextResponse } from "next/server";
import { getIpedsFilesForYear } from "@/pipeline/utils/ipedsFiles";
import { IPEDS_BASE_URLS } from "@/pipeline/utils/ipedsBaseUrls";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || "", 10);

    if (!year || Number.isNaN(year)) {
      throw new Error("Specify year in query parameter");
    }

    const files = getIpedsFilesForYear(year);

    // Deduplicate file names (multiple templates can resolve to the same file
    // across different year ranges, but each zip only needs to be checked once)
    const uniqueFiles = [...new Map(files.map((f) => [f.file, f])).values()];

    // A file counts as available if any of the IPEDS base URLs serves it —
    // the archive is split across directories by collection year.
    const results = await Promise.all(
      uniqueFiles.map(async ({ file, label }) => {
        for (const baseUrl of IPEDS_BASE_URLS) {
          const url = new URL(file, baseUrl).href;
          try {
            const rsp = await fetch(url, { method: "HEAD" });
            if (rsp.ok) return { file, label, available: true, baseUrl };
          } catch {
            // Try the next base URL
          }
        }
        return { file, label, available: false, baseUrl: null };
      }),
    );

    return NextResponse.json({
      year,
      files: results,
    });
  } catch (error) {
    console.error("[pipeline]", error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
