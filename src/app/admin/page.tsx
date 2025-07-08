import { getContentForAdmin } from "@/db/content";
import DataProvider from "@/components/DataProvider";
import PageTopOverlap from "@/components/PageTopOverlap";
import Well from "@/components/Well";
import Dashboard from "@/admin/components/Dashboard";

export default async function Admin() {
  const content = await getContentForAdmin();

  return (
    <DataProvider>
      <PageTopOverlap>
        <Well width="text">
          <h1>Tuition Tracker Admin</h1>
        </Well>
      </PageTopOverlap>
      <Well width="text">
        <Dashboard content={content} />
      </Well>
    </DataProvider>
  );
}
