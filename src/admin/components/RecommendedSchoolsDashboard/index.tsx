"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SubmitButton, { type SubmittingState } from "@/admin/components/SubmitButton";
import type { RecommendationSection as RecommendationSectionType } from "@/types";
import RecommendationSection from "./RecommendationSection";

export default function RecommendedSchoolsDashboard() {
  const { data: sections } = useQuery<RecommendationSectionType[]>({
    queryKey: ['recommendedSchools'],
    queryFn: async () => {
      const rsp = await fetch("/api/admin/recommended-schools");
      const data = await rsp.json();
      return data;
    },
  });

  const [state, setState] = useState<Partial<RecommendationSectionType>[]>([]);
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
      window.location.reload();
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
          <RecommendationSection
            key={section.dbId || `new-section-${i}`}
            section={section}
            pageOrder={i}
            onChange={(newSection) => {
              const newSections = state.map((oldSection, oldIndex) => {
                if (i === oldIndex) return newSection;
                return oldSection;
              });
              setState(newSections);
            }}
            removeSection={() => setState(state.filter((_, j) => i !== j))}
          />
        ))}

        <Paper
          sx={{ p: 4 }}
          elevation={1}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setState([...state, {}])}
          >
            Add section
          </Button>
        </Paper>
      </Stack>

      <SubmitButton
        submittingState={submittingState}
        submitChanges={submit}
      />
    </Container>
  );
}
