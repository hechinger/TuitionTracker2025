import { NextResponse } from "next/server";
import { cacheControl } from "@/cache";
import { getPriceHistogram } from "@/db/schools";

export async function GET() {
  const histogram = await getPriceHistogram();
  return NextResponse.json(histogram, {
    headers: cacheControl({
      maxAge: "5m",
      sMaxAge: "6h",
    }),
  });
}
