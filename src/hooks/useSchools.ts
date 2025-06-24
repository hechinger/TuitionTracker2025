import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/routes";
import { type SchoolIndex } from "@/types";

// import type { SchoolControl, DegreeLevel } from "@/types";

// type HetchYearlyData = {
//   year: string;
//   price_instate_oncampus: number | null;
//   price_instate_offcampus_nofamily: number | null;
//   avg_net_price_0_30000_titleiv_privateforprofit: number | null;
//   avg_net_price_30001_48000_titleiv_privateforprofit: number | null;
//   avg_net_price_48001_75000_titleiv_privateforprofit: number | null;
//   avg_net_price_75001_110000_titleiv_privateforprofit: number | null;
//   avg_net_price_110001_titleiv_privateforprofit: number | null;
//   min_max_diff_0_30000_titleiv_privateforprofit_campus: number[];
//   min_max_diff_30001_48000_titleiv_privateforprofit_campus: number[];
//   min_max_diff_48001_75000_titleiv_privateforprofit_campus: number[];
//   min_max_diff_75001_110000_titleiv_privateforprofit_campus: number[];
//   min_max_diff_110001_titleiv_privateforprofit_campus: number[];
//   min_max_diff_0_30000_titleiv_privateforprofit_offcampus: number[];
//   min_max_diff_30001_48000_titleiv_privateforprofit_offcampus: number[];
//   min_max_diff_48001_75000_titleiv_privateforprofit_offcampus: number[];
//   min_max_diff_75001_110000_titleiv_privateforprofit_offcampus: number[];
//   min_max_diff_110001_titleiv_privateforprofit_offcampus: number[];
//   grad_rate_associate_3years_total?: number | null;
//   grad_rate_bachelors_6years_total?: number | null;
//   grad_rate_associate_3years_white?: number | null;
//   grad_rate_associate_3years_black?: number | null;
//   grad_rate_associate_3years_hisp?: number | null;
//   grad_rate_associate_3years_amerindalasknat?: number | null;
//   grad_rate_associate_3years_unknown?: number | null;
//   grad_rate_associate_3years_asian?: number | null;
//   grad_rate_associate_3years_nathawpacisl?: number | null;
//   grad_rate_associate_3years_twomore?: number | null;
//   grad_rate_bachelors_6years_white?: number | null;
//   grad_rate_bachelors_6years_black?: number | null;
//   grad_rate_bachelors_6years_hisp?: number | null;
//   grad_rate_bachelors_6years_amerindalasknat?: number | null;
//   grad_rate_bachelors_6years_unknown?: number | null;
//   grad_rate_bachelors_6years_asian?: number | null;
//   grad_rate_bachelors_6years_nathawpacisl?: number | null;
//   grad_rate_bachelors_6years_twomore?: number | null;
//   full_time_retention_rate?: number | null;
//   part_time_retention_rate?: number | null;
// };
// 
// type HetchSchoolDetail = {
//   unitid: string;
//   institution: string;
//   alias: string;
//   city: string;
//   abbreviation: string;
//   hbcu: number;
//   tribal_college: number;
//   level: number;
//   enrollment: {
//     perc_sticker: number;
//     perc_admitted: number | null,
//     enrollment_unknown: number;
//     enrollment_twomore: number;
//     enrollment_white: number;
//     enrollment_hisp: number;
//     enrollment_nathawpacisl: number;
//     enrollment_black: number;
//     enrollment_asian: number;
//     enrollment_amerindalasknat: number;
//     enrollment_nonresident: number;
//     total_men: number;
//     total_women: number;
//     total_enrollment: number;
//     total_genderunknown: number;
//     total_anothergender: number | null
//   },
//   yearly_data: HetchYearlyData[];
// };
// 
// type HetchSchoolIndex = {
//   unitid: string;
//   schoolname: string;
//   stateabbr: string;
//   programs: number[];
//   aliasname: string;
//   schoolcontrol: string;
//   degreetype: string;
//   enrollment1617: number;
//   details: HetchSchoolDetail;
// };

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
