import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import { type SchoolIndex } from "@/types";

export function useSchools() {
  return useQuery<SchoolIndex[]>({
    queryKey: ['schools'],
    queryFn: async () => {
      const rsp = await fetch(api.index());
      const data = await rsp.json();
      return data;
    },
  });
}
