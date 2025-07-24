import { NextResponse, type NextRequest } from "next/server";
import { getSchoolsDetail } from "@/db/schools";
import { cacheControl } from "@/cache";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [school] = await getSchoolsDetail({
    schoolIds: [id],
  });
  return NextResponse.json(school, {
    headers: cacheControl({
      maxAge: "5m",
      sMaxAge: "6h",
    }),
  });
}
