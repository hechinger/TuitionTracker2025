import { getSchoolsIndex } from "@/db/schools";

export async function GET() {
  const schools = await getSchoolsIndex();
  return Response.json(schools);
}
