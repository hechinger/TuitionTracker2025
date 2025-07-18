import { getAllSchoolNames } from "@/db/schools";

export async function GET() {
  const schools = await getAllSchoolNames();
  return Response.json(schools);
}
