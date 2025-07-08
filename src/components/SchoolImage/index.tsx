import type { SchoolIndex, SchoolDetail } from "@/types";
import privateImg from "./private.jpg";
import publicImg from "./public.jpg";

const fallbacks = {
  public: publicImg.src,
  private: privateImg.src,
  "for-profit": privateImg.src,
};

export default function SchoolImage(props: {
  school: SchoolIndex | SchoolDetail;
  withFallback?: boolean;
}) {
  const {
    school,
    withFallback = false,
    ...rest
  } = props;

  const fallback = fallbacks[school.schoolControl];
  const img = school.image;

  if (!img && !withFallback) return null;

  return (
    <img
      {...rest}
      src={img || fallback}
      alt={school.name}
    />
  );
}
