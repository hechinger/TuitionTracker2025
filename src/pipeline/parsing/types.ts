import type { parseHD } from "./hd";
import type { parseADM } from "./adm";
import type { parseEFFY } from "./effy";
import type { parseGR } from "./gr";
import type { parseEFD } from "./efd";
import type { parseICAY } from "./icay";
import type { parseSFA } from "./sfa";

type SchoolDataIntersection = ReturnType<typeof parseHD>
  & ReturnType<typeof parseADM>
  & ReturnType<typeof parseEFFY>
  & ReturnType<typeof parseGR>
  & ReturnType<typeof parseEFD>
  & ReturnType<typeof parseICAY>
  & ReturnType<typeof parseSFA>;

export type SchoolData = {
  [Property in keyof SchoolDataIntersection]: SchoolDataIntersection[Property];
};
