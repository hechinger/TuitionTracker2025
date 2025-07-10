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
  className?: string;
}) {
  const {
    school,
    withFallback = false,
    className,
  } = props;

  const fallback = fallbacks[school.schoolControl];
  const img = school.image;

  if (!img && !withFallback) return null;

  return (
    <img
      className={className}
      src={img || fallback}
      alt={school.name}
    />
  );
}
