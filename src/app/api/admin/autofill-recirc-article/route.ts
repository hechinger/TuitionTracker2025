import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      throw new Error("Must specify article URL with `url` query param");
    }

    const rsp = await fetch(url);
    const html = await rsp.text();
    const $ = cheerio.load(html);
    const headline = $("head meta[property=og:title]").attr("content");
    const image = $("head meta[property=og:image]").attr("content");

    return NextResponse.json({
      url,
      headline,
      image,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
