import { getContentForAdmin } from "@/db/content";
import ContentDashboard from "@/admin/components/ContentDashboard";

export default async function Admin() {
  const content = await getContentForAdmin();

  return (
    <ContentDashboard content={content} />
  );
}
