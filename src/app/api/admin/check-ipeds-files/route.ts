import { NextResponse } from "next/server";
import { getIpedsFilesForYear } from "@/pipeline/utils/ipedsFiles";

const IPEDS_BASE_URL = "https://nces.ed.gov/ipeds/datacenter/data/";

const getNetTicks = () => {
  return Math.floor((Date.now() / 1000 + 62135596800) * 10000000);
};

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

    // Check availability of each file — try static URL, then data generator
    const results = await Promise.all(
      uniqueFiles.map(async ({ file, label }) => {
        // Try static URL first
        const staticUrl = new URL(file, IPEDS_BASE_URL).href;
        try {
          const rsp = await fetch(staticUrl, { method: "HEAD" });
          if (rsp.ok) return { file, label, available: true };
        } catch {
          // fall through
        }

        // Try data generator fallback (must use GET — HEAD returns 500)
        const tableName = file.replace(/\.zip$/i, "");
        const t = getNetTicks();
        const fallbackUrl = `https://nces.ed.gov/ipeds/data-generator?year=${year}&tableName=${tableName}&HasRV=0&type=csv&t=${t}`;
        try {
          const controller = new AbortController();
          const rsp = await fetch(fallbackUrl, { method: "GET", signal: controller.signal });
          controller.abort(); // Don't download the full body
          if (rsp.ok) return { file, label, available: true };
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            return { file, label, available: true };
          }
          // fall through
        }

        return { file, label, available: false };
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
