"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Container from "@mui/material/Container";
import PublishIcon from "@mui/icons-material/Publish";
import { contentSections } from "@/content/schema";
import Field from "@/admin/components/Field";
import SchoolEditor from "@/admin/components/SchoolEditor";
import styles from "./styles.module.scss";

type ContentEntry = {
  db_id: number;
  locale?: string | null;
  component: string;
  path: string;
  value?: string | null;
};

const tabs = ["Content", "Schools"] as const;

export default function Dashboard(props: {
  content: ContentEntry[];
}) {
  const {
    content,
  } = props;

  const [tab, setTab] = useState<typeof tabs[number]>(tabs[0]);
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [submittingState, setSubmittingState] = useState("ready");
  const [edits, /* setEdits */] = useState(new Map<string, string>());
  // const state = useMemo(() => {
  //   const s = {};
  //   content.forEach((c) => {
  //     const p = `${c.component}.${c.path}`;
  //     const k = c.locale ? [p, c.locale] : [p];
  //     set(s, k, c.value);
  //   });
  //   return s;
  // }, [content]);

  // const onChange = useCallback((path: string[], value: string) => {
  //   setEdits((old) => {
  //     const newEdits = new Map(old);
  //     newEdits.set(JSON.stringify(path), value);
  //     return newEdits;
  //   });
  // }, []);

  const submitChanges = useCallback(async () => {
    setSubmittingState("submitting");
    try {
      const dbIds = new Map(content.map((c) => [
        `${c.component}.${c.path}.${c.locale}`,
        c.db_id,
      ]));
      const newContent = [...edits].map(([key, value]) => {
        const [path, locale] = JSON.parse(key);
        const [component, ...restPath] = path.split(".");
        const idKey = `${component}.${restPath.join(".")}.${locale}`;
        return {
          db_id: dbIds.get(idKey),
          locale,
          component,
          path: restPath.join("."),
          value,
        };
      });
      const rsp = await fetch("/api/admin/set-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });

      if (rsp.ok) {
        setSubmittingState("success");
      } else {
        throw new Error("post failed");
      }
    } catch (error) {
      console.error(error);
      setSubmittingState("error");
    } finally {
      setTimeout(() => setSubmittingState("ready"), 3000);
    }
  }, [edits, content]);

  return (
    <div className={styles.page}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">
              Tuition Tracker
            </Link>
          </Typography>
          <SignedIn>
            <SignOutButton redirectUrl="/admin">
              <Button color="inherit">Sign out</Button>
            </SignOutButton>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Stack spacing={4} sx={{ py: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabs.findIndex((t) => t === tab)}
              onChange={(_, newTabIndex) => setTab(tabs[newTabIndex])}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  label={tab}
                  id={`tab-${tab}`}
                  aria-controls={`tab-content-${tab}`}
                />
              ))}
            </Tabs>
          </Box>

          <div
            role="tabpanel"
            hidden={tab !== "Content"}
            id="tab-content-Content"
            aria-labelledby="tab-Content"
          >
            {tab === "Content" && (
              <Stack spacing={4} sx={{ py: 4 }}>
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
                      <ToggleButton value="en">
                        English
                      </ToggleButton>
                      <ToggleButton value="es">
                        Spanish
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Paper>

                {contentSections.map((section) => (
                  <Paper
                    key={section.title}
                    sx={{ p: 4 }}
                    elevation={1}
                  >
                    <Typography variant="h4" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {section.description}
                    </Typography>

                    <Stack spacing={3}>
                      {section.fields.map((fieldGroup) => (
                        <Box key={fieldGroup.title}>
                          <Typography variant="h5" gutterBottom>
                            {fieldGroup.title}
                          </Typography>
                          <Stack spacing={2}>
                            {fieldGroup.fields.map((field) => (
                              <Field
                                key={field.path}
                                locale={locale}
                                field={field}
                              />
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                ))}

                <div className={styles.fab}>
                  <Fab
                    color="primary"
                    aria-label="submit"
                    onClick={submitChanges}
                    disabled={submittingState !== "ready"}
                  >
                    <PublishIcon />
                  </Fab>
                </div>
              </Stack>
            )}
          </div>

          <div
            role="tabpanel"
            hidden={tab !== "Content"}
            id="tab-content-Content"
            aria-labelledby="tab-Content"
          >
            {tab === "Schools" && (
              <SchoolEditor />
            )}
          </div>
        </Stack>
      </Container>
    </div>
  );
}
