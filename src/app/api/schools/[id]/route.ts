import { type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { default: schoolData } = await import(`@/data/split/school_${id}.json`);

  return Response.json(schoolData);
}
