"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SubmitButton, { type SubmittingState } from "@/admin/components/SubmitButton";
import { type Article } from "@/db/recirculationArticles";
import RecircArticle from "./RecircArticle";

export default function RecirculationDashboard() {
  const { data: articles } = useQuery<Article[]>({
    queryKey: ['recommendedSchools'],
    queryFn: async () => {
      const rsp = await fetch("/api/admin/recirculation-articles");
      const data = await rsp.json();
      return data;
    },
  });

  const [state, setState] = useState<Partial<Article>[]>([]);
  useEffect(() => {
    if (!articles) return;
    setState(articles);
  }, [articles]);

  const [submittingState, setSubmittingState] = useState<SubmittingState>({ state: "ready" });

  const submit = useCallback(async () => {
    setSubmittingState({ state: "submitting" });
    try {
      const rsp = await fetch("/api/admin/recirculation-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      if (!rsp.ok) {
        throw new Error("Failed to update articles");
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
        {state.map((article, i) => (
          <RecircArticle
            key={article.dbId || `new-article-${i}`}
            article={article}
            onChange={(newSection) => {
              const newSections = state.map((oldSection, oldIndex) => {
                if (i === oldIndex) return newSection;
                return oldSection;
              });
              setState(newSections);
            }}
            removeArticle={() => setState(state.filter((_, j) => i !== j))}
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
            Add article
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
