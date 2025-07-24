import { NextResponse } from "next/server";
import { getSchoolsIndex } from "@/db/schools";
import { cacheControl } from "@/cache";

export async function GET() {
  const schools = await getSchoolsIndex();
  return NextResponse.json(schools, {
    headers: cacheControl({
      maxAge: "5m",
      sMaxAge: "6h",
    }),
  });
}
