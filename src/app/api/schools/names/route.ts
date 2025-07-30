import { NextResponse } from "next/server";
import { getAllSchoolNames } from "@/db/schools";
import { cacheControl } from "@/cache";

export async function GET() {
  const schools = await getAllSchoolNames();
  return NextResponse.json(schools, {
    headers: cacheControl({
      maxAge: "5m",
      sMaxAge: "6h",
    }),
  });
}
