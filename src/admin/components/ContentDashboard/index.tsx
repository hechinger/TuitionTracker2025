"use client";

import { useCallback, useState, useMemo } from "react";
import kebabCase from "lodash/kebabCase";
import get from "lodash/get";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { contentSections } from "@/content/schema";
import Field from "@/admin/components/Field";
import SubmitButton, { type SubmittingState } from "@/admin/components/SubmitButton";
import type { ContentEntry } from "@/types/admin";
import { useTab } from "./useTab";
import FieldGroup from "./FieldGroup";
import styles from "./styles.module.scss";

const locales = {
  en: "English",
  es: "Spanish",
} as const;

const tabNames = contentSections.map((section) => {
  return kebabCase(section.title);
});

export default function ContentDashboard(props: {
  content: ContentEntry[];
}) {
  const {
    content,
  } = props;

  const [tab, setTab] = useTab(tabNames);
  const [locale, setLocale] = useState<keyof typeof locales>("en");
  const [submittingState, setSubmittingState] = useState<SubmittingState>({ state: "ready" });
  const [edits, setEdits] = useState(new Map<string, unknown>());
  const state = useMemo(() => {
    return new Map(content.map((c) => {
      const p = `${c.component}.${c.path}`;
      const k = c.locale ? [p, c.locale] : [p];
      return [JSON.stringify(k), c.value];
    }));
  }, [content]);

  const onChange = useCallback((path: string[], value: unknown) => {
    setEdits((old) => {
      const newEdits = new Map(old);
      newEdits.set(JSON.stringify(path), value);
      return newEdits;
    });
  }, []);

  const copyFields = new Set(["copy", "richCopy", "autotext"]);
  const getValue = (field: { type: string, path: string }) => {
    const p = copyFields.has(field.type) ? [field.path, locale] : [field.path];
    const k = JSON.stringify(p);
    return edits.has(k) ? edits.get(k) : state.get(k);
  };

  const submitChanges = useCallback(async () => {
    setSubmittingState({ state: "submitting" });
    try {
      const fieldTypeByPath = new Map<string, string>();
      contentSections.forEach((section) => {
        section.fields.forEach((group) => {
          group.fields.forEach((field) => {
            fieldTypeByPath.set(field.path, field.type);
          });
        });
      });
      const dbIds = new Map(content.map((c) => [
        `${c.component}.${c.path}.${c.locale}`,
        c.db_id,
      ]));

      const newContent = [] as { db_id?: number, locale?: string, component: string, path: string, value: unknown }[];
      const newImages = [] as { db_id?: number, locale?: string, component: string, path: string, value: unknown }[];

      [...edits].forEach(([key, value]) => {
        const [path, locale] = JSON.parse(key);
        const [component, ...restPath] = path.split(".");
        const idKey = `${component}.${restPath.join(".")}.${locale}`;
        const type = fieldTypeByPath.get(`${component}.${restPath.join(".")}`);
        const data = {
          db_id: dbIds.get(idKey),
          locale,
          component,
          path: restPath.join("."),
          value,
        };
        if (type === "image" && value) {
          newImages.push(data);
        } else {
          newContent.push(data);
        }
      });

      if (newImages.length > 0) {
        for (const img of newImages) {
          const key = `${img.component}.${img.path}`;
          const filename = key.replace(/\./g, "-").toLowerCase();
          const file = img.value as Blob;
          const rsp = await fetch(`/api/admin/upload-image?filename=${filename}`, {
            method: "POST",
            body: file,
          });
          const blob = await rsp.json();

          if (!rsp.ok) {
            throw new Error("Image upload failed");
          }

          const idKey = `${img.component}.${img.path}.${img.locale}`;
          newContent.push({
            db_id: dbIds.get(idKey),
            locale: img.locale,
            component: img.component,
            path: img.path,
            value: blob.url,
          });
        }
      }

      if (newContent.length > 0) {
        const rsp = await fetch("/api/admin/set-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newContent),
        });

        if (!rsp.ok) {
          throw new Error("Failed to update content");
        }
      }

      setSubmittingState({ state: "success" });
      window.location.reload();
    } catch (error) {
      console.error(error);
      setSubmittingState({ state: "error", error: `${error}` });
    } finally {
      setTimeout(() => setSubmittingState({ state: "ready" }), 3000);
    }
  }, [edits, content]);

  return (
    <div className={styles.page}>
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={(_, newTabIndex) => setTab(newTabIndex)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {contentSections.map((section, i) => (
                <Tab
                  key={section.title}
                  label={section.title}
                  id={`tab-${i}`}
                  aria-controls={`tab-content-${i}`}
                />
              ))}
            </Tabs>
          </Box>

          <Paper
            sx={{ p: 4 }}
            elevation={1}
          >
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography variant="h5" gutterBottom>
                Selected Language
              </Typography>

              <ToggleButtonGroup
                value={locale}
                exclusive
                onChange={(_, newLocale) => setLocale(newLocale)}
                aria-label="text alignment"
              >
                {Object.entries(locales).map(([locale, label]) => (
                  <ToggleButton
                    key={locale}
                    value={locale}
                  >
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Paper>

          {contentSections.map((section, i) => (
            <div
              key={section.title}
              role="tabpanel"
              hidden={tab !== i}
              id={`tab-content-${i}`}
              aria-labelledby={`tab-${i}`}
            >
              {tab === i && (
                <Stack spacing={4}>
                  <Paper
                    sx={{ p: 4 }}
                    elevation={1}
                  >
                    <Typography variant="h4" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {section.description}
                    </Typography>
                  </Paper>

                  {section.fields.map((fieldGroup) => (
                    <FieldGroup
                      key={fieldGroup.title}
                      title={fieldGroup.title}
                      presentation={get(fieldGroup, "presentation")}
                    >
                      <Stack spacing={4}>
                        {fieldGroup.fields.map((field) => (
                          <Field
                            key={field.path}
                            locale={locale}
                            localeLabel={locales[locale]}
                            field={field}
                            value={getValue(field) || ""}
                            onChange={onChange}
                          />
                        ))}
                      </Stack>
                    </FieldGroup>
                  ))}
                </Stack>
              )}
            </div>
          ))}
        </Stack>

        <SubmitButton
          submittingState={submittingState}
          submitChanges={submitChanges}
          disabled={edits.size < 1}
        />
      </Container>
    </div>
  );
}
