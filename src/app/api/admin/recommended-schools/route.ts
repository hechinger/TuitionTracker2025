import { NextResponse } from "next/server";
import { getRecommendedSchools, setRecommendedSchools } from "@/db/recommendedSchools";
import { revalidateRecommendedSchools } from "@/cache";

export async function GET() {
  const sections = await getRecommendedSchools();
  const adminSections = sections.map(({ schools, ...section }) => ({
    ...section,
    schoolIds: schools.map((school) => school.id),
  }));
  return Response.json(adminSections);
}

export async function POST(request: Request) {
  try {
    const sections = await request.json();

    await setRecommendedSchools(sections);
    await revalidateRecommendedSchools();

    return NextResponse.json({
      message: "Content updated",
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
