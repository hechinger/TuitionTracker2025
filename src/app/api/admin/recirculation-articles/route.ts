import { NextResponse } from "next/server";
import { getRecirculationArticles, setRecirculationArticles } from "@/db/recirculationArticles";
import { revalidateRecirculation } from "@/cache";

export async function GET() {
  const articles = await getRecirculationArticles();
  return Response.json(articles);
}

export async function POST(request: Request) {
  try {
    const articles = await request.json();

    await setRecirculationArticles(articles);
    revalidateRecirculation();

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
