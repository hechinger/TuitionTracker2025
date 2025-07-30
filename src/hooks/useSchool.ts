import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import { type SchoolDetail } from "@/types";
import { useDataContext } from "@/hooks/useDataContext";

export function useSchool(id: string | undefined) {
  const { schools = {} } = useDataContext();
  const school = (typeof id === "string") && schools[id];
  const opts = school
    ? { initialData: school, staleTime: 1000 * 60 * 5 }
    : {};

  return useQuery<SchoolDetail>({
    queryKey: ['schools', id],
    queryFn: async () => {
      if (!id) return null;
      const rsp = await fetch(api.school(id));
      const data = await rsp.json();
      return data;
    },
    ...opts,
  });
}
