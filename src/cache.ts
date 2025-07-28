import { revalidatePath } from "next/cache";
import ms, { type StringValue } from "ms";
import { isProduction } from "@/env";

export const cacheControl = (opts: {
  maxAge?: StringValue;
  sMaxAge?: StringValue;
}) => {
  if (!isProduction) {
    return undefined;
  }

  const {
    maxAge = "0s",
    sMaxAge,
  } = opts;

  const s = (m: StringValue) => ms(m) / 1000;

  const headers = [
    `max-age=${s(maxAge)}`,
  ];

  if (typeof sMaxAge === "number") {
    headers.push(`s-maxage=${sMaxAge}`);
  }

  return {
    "Cache-Control": headers.join(", "),
  };
};

export const revalidateSchools = (ids?: string[]) => {
  revalidatePath("/api/schools", "page");
  revalidatePath("/api/schools/names", "page");
  revalidatePath("/api/schools/price-histogram", "page");
  revalidatePath("/api/schools/download-data/[dataset]", "page");
  revalidatePath("/admin", "layout");
  if (ids) {
    ids.forEach((id) => {
      revalidatePath(`/api/schools/${id}`);
    });
  } else {
    revalidatePath("/api/schools/[id]", "page");
  }
};

export const revalidateContent = () => {
  // revalidate all pages under the [locale] layout
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin", "layout");
};

export const revalidateRecirculation = () => {
  // revalidate all pages under the [locale] layout
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin", "layout");
};

export const revalidateRecommendedSchools = () => {
  // only used on the landing page
  revalidatePath("/[locale]", "page");
  revalidatePath("/admin", "layout");
};
