import type { SchoolIndex, SchoolDetail } from "@/types";
import privateImg from "./private.jpg";
import publicImg from "./public.jpg";

const fallbacks = {
  public: publicImg.src,
  private: privateImg.src,
  "for-profit": privateImg.src,
};

/**
 * Renders the custom school image if the school has one, or the standard
 * fallback images for public and private schools.
 */
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
