export type SchoolControl = "public" | "private" | "for-profit";
export type DegreeLevel = "2-year" | "4-year";
export type StickerPriceType = string;

export type SchoolIndex = {
  id: string;
  slug: string;
  image: string;
  name: string;
  alias: string;
  city: string;
  state: string;
  hbcu: boolean;
  tribalCollege: boolean;
  schoolControl: SchoolControl;
  degreeLevel: DegreeLevel;
  enrollment: number;
  stickerPrice: {
    type: StickerPriceType;
    price: number;
  },
  netPricesByBracket: {
    average: number;
    "0_30000": number;
    "30001_48000": number;
    "48001_75000": number;
    "75001_110000": number;
    "110001": number;
  },
};

export type YearData = {
  year: string;
  startYear: number;
  stickerPrice: {
    type: StickerPriceType;
    price: number;
  },
  netPricesByBracket: {
    average: {
      price: number;
      min?: number;
      max?: number;
    },
    "0_30000": {
      price: number;
      min?: number;
      max?: number;
    },
    "30001_48000": {
      price: number;
      min?: number;
      max?: number;
    },
    "48001_75000": {
      price: number;
      min?: number;
      max?: number;
    },
    "75001_110000": {
      price: number;
      min?: number;
      max?: number;
    },
    "110001": {
      price: number;
      min?: number;
      max?: number;
    },
  },
};

export type SchoolDetail = {
  id: string;
  name: string;
  alias: string;
  city: string;
  state: string;
  hbcu: boolean;
  tribalCollege: boolean;
  schoolControl: SchoolControl;
  degreeLevel: DegreeLevel;
  stats: {
    percentSticker: number;
    percentAdmitted: number | null,
  };
  stickerPrice: {
    type: string;
    price: number;
  };
  image: string;
  netPricesByBracket: {
    average: number;
    "0_30000": number;
    "30001_48000": number;
    "48001_75000": number;
    "75001_110000": number;
    "110001": number;
  };
  enrollment: {
    total: number;
    byRace: {
      unknown: number;
      multiple: number;
      white: number;
      hisp: number;
      nathawpacisl: number;
      black: number;
      asian: number;
      amerindalasknat: number;
      nonresident: number;
    },
    byGender: {
      men: number;
      women: number;
      unknown: number;
      other: number;
    },
  },
  retention: {
    fullTime: number;
    partTime: number;
  },
  graduationBachelors: {
    total: number;
    byRace: {
      unknown: number;
      multiple: number;
      white: number;
      hisp: number;
      nathawpacisl: number;
      black: number;
      asian: number;
      amerindalasknat: number;
      nonresident: number;
    },
  },
  graduationAssociates: {
    total: number;
    byRace: {
      unknown: number;
      multiple: number;
      white: number;
      hisp: number;
      nathawpacisl: number;
      black: number;
      asian: number;
      amerindalasknat: number;
      nonresident: number;
    },
  },
  years: YearData[];
};

export type SavedSchools = {
  schools: string[];
  schoolIsSaved: (id: string) => boolean;
  toggleSavedSchool: (id: string) => void;
};

export type IncomeBracket = {
  bracket: string | undefined;
  setIncomeBracket: (bracket: string | undefined) => void;
};

export type RecirculationArticle = {
  url: string;
  headline: string;
  image: string;
  imageAlt: string;
};
