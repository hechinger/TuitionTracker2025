import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import { type PriceHistogramData } from "@/types";

export function usePriceHistogram() {
  return useQuery<PriceHistogramData>({
    queryKey: ['priceHistogram'],
    queryFn: async () => {
      const rsp = await fetch(api.priceHistogram());
      const data = await rsp.json();
      return data;
    },
    initialData: {
      sticker: [],
      average: [],
      "0_30000": [],
      "30001_48000": [],
      "48001_75000": [],
      "75001_110000": [],
      "110001": [],
    },
  });
}
