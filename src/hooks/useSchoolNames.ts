import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import { type SchoolNameInfo } from "@/types";

export function useSchoolNames() {
  return useQuery<SchoolNameInfo[]>({
    queryKey: ['schoolNames'],
    queryFn: async () => {
      const rsp = await fetch(api.names());
      const data = await rsp.json();
      return data;
    },
  });
}