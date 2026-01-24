import Image from "next/image";
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
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const {
    school,
    withFallback = false,
    className,
    width = 250,
    height = 141,
    priority = false,
  } = props;

  const fallback = fallbacks[school.schoolControl];
  const img = school.image;

  if (!img && !withFallback) return null;

  return (
    <Image
      className={className}
      src={img || fallback}
      alt={school.name}
      width={width}
      height={height}
      sizes="250px"
      priority={priority}
    />
  );
}