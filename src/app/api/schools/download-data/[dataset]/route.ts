import { NextResponse, type NextRequest } from "next/server";
import Papa from "papaparse";
import { cacheControl } from "@/cache";
import {
  getStickerPriceDataset,
  getNetPriceDataset,
  getGraduationRateDataset,
  getRetentionRateDataset,
} from "@/db/schools";

const getDatasetCsv = async (dataset: string) => {
  if (dataset === "sticker") {
    const data = await getStickerPriceDataset();
    return Papa.unparse(data);
  }
  if (dataset === "net") {
    const data = await getNetPriceDataset();
    return Papa.unparse(data);
  }
  if (dataset === "graduation") {
    const data = await getGraduationRateDataset();
    return Papa.unparse(data);
  }
  if (dataset === "retention") {
    const data = await getRetentionRateDataset();
    return Papa.unparse(data);
  }
  throw new Error(`Unknown dataset: ${dataset}`);
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ dataset: string }> },
) {
  try {
    const { dataset } = await params;
    const csv = await getDatasetCsv(dataset);
    return new NextResponse(csv, {
      headers: {
        ...cacheControl({
          maxAge: "5m",
          sMaxAge: "6h",
        }),
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=tuition-tracker-${dataset}.csv`,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
      statusText: "Bad request",
    });
  }
}
