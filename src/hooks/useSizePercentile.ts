import { useSchools } from "./useSchools";

export function useSizePercentile(size: number) {
  const { data: schools = [] } = useSchools();
  let numBelow = 0;
  schools.forEach((school) => {
    const n = school.enrollment;
    if (n <= size) {
      numBelow += 1;
    }
  });
  return numBelow / (schools.length || 1);
}
