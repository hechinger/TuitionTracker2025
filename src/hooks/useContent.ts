import get from "lodash/get";
import { useDataContext } from "./useDataContext";

export function useContent(prefix?: string) {
  const {
    locale,
    content,
  } = useDataContext();

  return (key: string) => {
    const k = prefix ? `${prefix}.${key}` : key;
    return get(content, [locale, k]);
  };
}
