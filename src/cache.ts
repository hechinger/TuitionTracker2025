import { revalidatePath } from "next/cache";
import { head, put, del } from "@vercel/blob";
import ms, { type StringValue } from "ms";
import { locales } from "@/i18n/routing";
import { crossProduct } from "@/utils/crossProduct";
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

export const blobCache = async <T>(key: string | null, compute: () => Promise<T>) => {
  if (!key) {
    return compute();
  }

  const blobKey = `blob-cache/${key}`;

  try {
    const blob = await head(blobKey);
    const rsp = await fetch(blob.url);
    const data = await rsp.json();
    return data as T;
  } catch (_) { // eslint-disable-line
    // pass
  }

  const data = await compute();
  await put(blobKey, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return data;
};

export const clearBlobCache = async (keys: string[]) => {
  const blobKeys = keys.map((k) => `blob-cache/${k}`);
  await del(blobKeys);
};

export const revalidateSchools = async (ids?: string[]) => {
  revalidatePath("/api/schools", "page");
  revalidatePath("/api/schools/names", "page");
  revalidatePath("/api/schools/price-histogram", "page");
  revalidatePath("/api/schools/size-histogram", "page");
  revalidatePath("/api/schools/download-data/[dataset]", "page");
  revalidatePath("/admin", "layout");
  if (ids) {
    ids.forEach((id) => {
      revalidatePath(`/api/schools/${id}`);
    });
  } else {
    revalidatePath("/api/schools/[id]", "page");
  }
  const sizeHistoKeys = crossProduct(
    ["all", "public", "private", "for-profit"],
    ["all", "2-year", "4-year"],
  ).map(([a, b]) => `schools-size-histogram-${a}-${b}`);
  await clearBlobCache([
    "schools-all-school-names",
    "schools-schools-index",
    "schools-price-histogram",
    ...sizeHistoKeys,
  ]);
  await revalidateRecommendedSchools();
};

export const revalidateContent = async () => {
  // revalidate all pages under the [locale] layout
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin", "layout");
  await clearBlobCache([
    "content-locale-default",
    ...locales.map((locale) => `content-locale-${locale}`),
  ]);
};

export const revalidateRecirculation = async () => {
  // revalidate all pages under the [locale] layout
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin", "layout");
};

export const revalidateRecommendedSchools = async () => {
  // only used on the landing page
  revalidatePath("/[locale]", "page");
  revalidatePath("/admin", "layout");
  await clearBlobCache(["recommended-schools"]);
};
