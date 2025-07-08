import { type NextRequest } from "next/server";
import { getSchoolsDetail } from "@/db/schools";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [school] = await getSchoolsDetail({
    schoolIds: [id],
  });

  return Response.json(school);
}
