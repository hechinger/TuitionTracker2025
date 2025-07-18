import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import type { RecommendationSection } from "@/types";

export default function RecommendationSection(props: {
  section: Partial<RecommendationSection>;
  onChange: (section: RecommendationSection) => void;
}) {

  return (
    <Paper
      key={section.dbId || `new-section-${i}`}
      sx={{ p: 4 }}
      elevation={1}
    >
      <SelectSchool
        label="School"
        onChange={selectSchoolId}
      />
    </Paper>
  );
}
