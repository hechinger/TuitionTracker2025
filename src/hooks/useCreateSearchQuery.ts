export type SchoolSearchParams = {
  where: string;
  schoolType?: Record<string, boolean>;
};

export function useCreateSearchQuery(params: SchoolSearchParams) {
  const q = {} as Partial<SchoolSearchParams>;

  if (params.where) {
    q.where = params.where;
  }

  if (params.schoolType && Object.values(params.schoolType).some(Boolean)) {
    q.schoolType = Object.fromEntries(
      Object.entries(params.schoolType).filter(([, value]) => !!value),
    );
  }

  return new URLSearchParams({
    search: JSON.stringify(Object.fromEntries(
      Object.entries(q).filter(([, value]) => value !== undefined),
    )),
  });
}
