import { formatDollars } from "@/utils/formatDollars";

export default function BarLabel(props: {
  value?: number;
  fallback?: string;
}) {
  const {
    value,
    fallback = "No data",
  } = props;

  const dollars = formatDollars(value || 0, { round: true });
  const label = value ? dollars : fallback;

  return (
    <span>{label}</span>
  );
}
