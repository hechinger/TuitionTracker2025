import arrowFromLeft from "./arrow-from-left.svg";
import arrowFromRight from "./arrow-from-right.svg";

const imgs = {
  "from-left": arrowFromLeft.src,
  "from-right": arrowFromRight.src,
} as const;

export default function Arrow(props: {
  direction: keyof typeof imgs;
}) {
  const img = imgs[props.direction];
  return (
    <img src={img} alt="" />
  );
}
