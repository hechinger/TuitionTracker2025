import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import { type SchoolDetail } from "@/types";

export function useSchool(id: string) {
  return useQuery<SchoolDetail>({
    queryKey: ['schools', id],
    queryFn: async () => {
      if (!id) return undefined;
      const rsp = await fetch(api.school(id));
      const data = await rsp.json();
      return data;
    },
  });
}
