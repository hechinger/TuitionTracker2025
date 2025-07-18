"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import SelectSchool from "@/admin/components/SelectSchool";
import SubmitButton from "@/admin/components/SubmitButton";
import type { RecommendationSection } from "@/types";

export default function RecommendedSchoolsDashboard() {
  const { data: sections } = useQuery<RecommendationSection[]>({
    queryKey: ['recommendedSchools'],
    queryFn: async () => {
      const rsp = await fetch("/api/admin/recommended-schools");
      const data = await rsp.json();
      return data;
    },
  });

  const [state, setState] = useState<RecommendationSection[]>([]);
  useEffect(() => {
    if (!sections) return;
    setState(sections);
  }, [sections]);

  const [submittingState, setSubmittingState] = useState<SubmittingState>({ state: "ready" });

  const submit = useCallback(async () => {
    setSubmittingState({ state: "submitting" });
    try {
      const rsp = await fetch("/api/admin/recommended-schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      if (!rsp.ok) {
        throw new Error("Failed to update recommendations");
      }

      setSubmittingState({ state: "success" });
    } catch (error) {
      console.error(error);
      setSubmittingState({ state: "error", error: `${error}` });
    } finally {
      setTimeout(() => setSubmittingState({ state: "ready" }), 3000);
    }
  }, [state]);

  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        {state.map((section, i) => (
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
        ))}
      </Stack>

      <SubmitButton
        submittingState={submittingState}
        submitChanges={submit}
      />
    </Container>
  );
}
