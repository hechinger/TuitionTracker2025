import { permanentRedirect, notFound } from "next/navigation";
import { queryRows } from "@/db/pool";

export const revalidate = 31536000; // 1y

export default async function OldSchool({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
}) {
  const { unitid } = await searchParams;

  if (!unitid) {
    return notFound();
  }

  const [school] = await queryRows({
    text: "SELECT slug FROM schools WHERE id = $1;",
    values: [unitid],
  });

  if (!school) {
    return notFound();
  }

  return permanentRedirect(`/schools/${school.slug}`);
}
