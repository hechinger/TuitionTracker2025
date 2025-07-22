import { NextResponse } from "next/server";
import { setSchool } from "@/db/schools";

export async function POST(request: Request) {
  try {
    const school = await request.json();
    await setSchool(school);
    return NextResponse.json({
      message: "School updated",
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
