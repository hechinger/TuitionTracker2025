import { NextResponse } from "next/server";
import { cacheControl } from "@/cache";
import { getSizeHistogram } from "@/db/schools";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolControl = searchParams.get("schoolControl") || undefined;
  const degreeLevel = searchParams.get("degreeLevel") || undefined;
  const histogram = await getSizeHistogram({
    schoolControl,
    degreeLevel,
  });
  return NextResponse.json(histogram, {
    headers: cacheControl({
      maxAge: "5m",
      sMaxAge: "6h",
    }),
  });
}
