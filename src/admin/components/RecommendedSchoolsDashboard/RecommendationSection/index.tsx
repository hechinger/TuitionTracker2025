import get from "lodash/get";
import set from "lodash/set";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Field from "@/admin/components/Field";
import SelectSchool from "@/admin/components/SelectSchool";
import type { RecommendationSection } from "@/types";

export default function RecommendationSection(props: {
  section: Partial<RecommendationSection>;
  pageOrder: number;
  onChange: (section: RecommendationSection) => void;
  removeSection: () => void;
}) {
  const {
    section,
    pageOrder,
    onChange,
    removeSection,
  } = props;

  const onSectionChange = (path: string[], value: unknown) => {
    const newSection = {
      dbId: get(section, "dbId"),
      key: get(section, "key", `${pageOrder}`),
      pageOrder,
      title: {
        en: get(section, "title.en", ""),
        es: get(section, "title.es", ""),
      },
      schoolIds: get(section, "schoolIds", []),
    };
    set(newSection, path[0], value);
    onChange(newSection);
  };

  const schoolIds = (() => {
    const ids = get(section, "schoolIds", []);
    if (typeof ids === "string") return JSON.parse(ids) as string[];
    return ids;
  })();

  return (
    <Paper
      sx={{ p: 4 }}
      elevation={1}
    >
      <Stack spacing={4}>
        <Stack direction="row" spacing={4}>
          <Stack spacing={4} sx={{ flexGrow: 1 }}>
            <Field
              field={{
                type: "string",
                title: "Title (English)",
                path: "title.en",
              }}
              value={get(section, "title.en", "")}
              onChange={onSectionChange}
            />
            <Field
              field={{
                type: "string",
                title: "Title (Spanish)",
                path: "title.es",
              }}
              value={get(section, "title.es", "")}
              onChange={onSectionChange}
            />
          </Stack>
          <Box>
            <IconButton
              size="small"
              aria-label="Remove"
              onClick={removeSection}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
        {schoolIds.map((id, i) => (
          <Stack
            key={`${id}-${i}`}
            spacing={4}
            direction="row"
            sx={{ pr: 8 }}
          >

            <Box sx={{ flexGrow: 1 }}>
              <SelectSchool
                label="School"
                value={id || null}
                onChange={(schoolId) => onSectionChange([`schoolIds.${i}`], schoolId)}
              />
            </Box>
            <Box>
              <IconButton
                size="small"
                aria-label="Remove"
                onClick={() => onSectionChange(
                  ["schoolIds"],
                  schoolIds.filter((_, idx) => idx !== i),
                )}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Stack>
        ))}
        <div>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => onSectionChange(["schoolIds"], [...schoolIds, undefined])}
          >
            Add school
          </Button>
        </div>
      </Stack>
    </Paper>
  );
}
