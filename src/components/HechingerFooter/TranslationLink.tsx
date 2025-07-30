"use client";

import { Link, usePathname } from "@/i18n/navigation";

const localeCrosswalk = {
  en: {
    text: "En Español",
    locale: "es",
  },
  es: {
    text: "In English",
    locale: "en",
  },
};

export default function TranslationLink(props: {
  locale: string;
}) {
  const opts = localeCrosswalk[props.locale as keyof typeof localeCrosswalk];
  const pathname = usePathname();

  if (!opts) {
    return null;
  }

  return (
    <Link href={pathname} locale={opts.locale}>
      {opts.text}
    </Link>
  );
}
