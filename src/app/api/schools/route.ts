import data from "@/data/schools_index.json";

export async function GET() {
  return Response.json(data);
}
