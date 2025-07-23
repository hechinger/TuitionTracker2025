"use client";

import { useState, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Field from "@/admin/components/Field";
import SubmitButton, { type SubmittingState } from "@/admin/components/SubmitButton";

export default function PipelineDashboard() {
  const [year, setYear] = useState<string>();

  const [submittingState, setSubmittingState] = useState<SubmittingState>({ state: "ready" });

  const submitChanges = useCallback(async () => {
    if (!year) return;

    setSubmittingState({ state: "submitting" });
    try {
      const rsp = await fetch(`/api/admin/run-data-pipeline?year=${year}`, {
        method: "POST",
      });

      if (!rsp.ok) {
        throw new Error("Data pipeline failed");
      }

      setSubmittingState({ state: "success" });
      setYear(undefined);
    } catch (error) {
      console.error(error);
      setSubmittingState({ state: "error", error: `${error}` });
    } finally {
      setTimeout(() => setSubmittingState({ state: "ready" }), 3000);
    }
  }, [year]);

  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        <Paper
          sx={{ p: 4 }}
          elevation={1}
        >
          <Stack>
            <Field
              field={{
                type: "string",
                title: "Year",
                path: "year",
              }}
              value={year || ""}
              onChange={(_, value) => setYear(`${value}`)}
            />
          </Stack>
        </Paper>
      </Stack>

      <SubmitButton
        submittingState={submittingState}
        submitChanges={submitChanges}
        disabled={!year}
      />
    </Container>
  );
}
