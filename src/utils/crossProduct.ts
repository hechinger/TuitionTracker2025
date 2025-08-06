export function crossProduct<AType, BType>(as: AType[], bs: BType[]) {
  const values = [] as [AType, BType][];
  as.forEach((a) => {
    bs.forEach((b) => {
      values.push([a, b]);
    });
  });
  return values;
}
