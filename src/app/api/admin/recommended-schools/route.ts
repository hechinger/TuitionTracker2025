import { NextResponse } from "next/server";
import { getRecommendedSchools, setRecommendedSchools } from "@/db/recommendedSchools";

export async function GET() {
  const sections = await getRecommendedSchools();
  return Response.json(sections);
}

export async function POST(request: Request) {
  try {
    const sections = await request.json();

    await setRecommendedSchools(sections);
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
