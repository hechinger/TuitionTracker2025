"use client";

import { useState, useCallback } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import Field from "@/admin/components/Field";
import SubmitButton, { type SubmittingState } from "@/admin/components/SubmitButton";

type FileStatus = {
  file: string;
  label: string;
  available: boolean;
};

export default function PipelineDashboard() {
  const [year, setYear] = useState<string>("");
  const [checking, setChecking] = useState(false);
  const [files, setFiles] = useState<FileStatus[] | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [pipelineStarted, setPipelineStarted] = useState<string | null>(null);

  const [submittingState, setSubmittingState] = useState<SubmittingState>({ state: "ready" });

  const checkFiles = useCallback(async () => {
    if (!year) return;

    setChecking(true);
    setFiles(null);
    setCheckError(null);

    try {
      const rsp = await fetch(`/api/admin/check-ipeds-files?year=${year}`);
      if (!rsp.ok) throw new Error("Failed to check files");
      const data = await rsp.json();
      setFiles(data.files);
    } catch (error) {
      setCheckError(`${error}`);
    } finally {
      setChecking(false);
    }
  }, [year]);

  const allAvailable = files?.every((f) => f.available) ?? false;
  const missingCount = files?.filter((f) => !f.available).length ?? 0;

  const submitChanges = useCallback(async () => {
    if (!year || !allAvailable) return;

    setSubmittingState({ state: "submitting" });
    try {
      const rsp = await fetch(`/api/admin/run-data-pipeline?year=${year}`, {
        method: "POST",
      });

      if (!rsp.ok) {
        throw new Error("Data pipeline failed");
      }

      setPipelineStarted(year);
      setSubmittingState({ state: "success" });
      setYear("");
      setFiles(null);
    } catch (error) {
      console.error(error);
      setSubmittingState({ state: "error", error: `${error}` });
    } finally {
      setTimeout(() => setSubmittingState({ state: "ready" }), 3000);
    }
  }, [year, allAvailable]);

  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }} elevation={1}>
          <Stack spacing={3}>
            <Typography variant="h6">Run Data Pipeline</Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the IPEDS data year, then check file availability before
              running the pipeline.
            </Typography>

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Field
                field={{
                  type: "string",
                  title: "Year",
                  path: "year",
                }}
                value={year}
                onChange={(_, value) => {
                  setYear(`${value}`);
                  setFiles(null);
                  setCheckError(null);
                }}
              />
              <Button
                variant="contained"
                onClick={checkFiles}
                disabled={!year || checking}
                sx={{ mt: "8px !important", whiteSpace: "nowrap" }}
              >
                {checking ? <CircularProgress size={24} /> : "Check Files"}
              </Button>
            </Stack>

            {checkError && (
              <Alert severity="error">{checkError}</Alert>
            )}
          </Stack>
        </Paper>

        {pipelineStarted && (
          <Alert severity="info" onClose={() => setPipelineStarted(null)}>
            The {pipelineStarted} data pipeline is running in the background.
            This typically takes a few minutes.
          </Alert>
        )}

        {files && (
          <Paper sx={{ p: 4 }} elevation={1}>
            <Stack spacing={2}>
              <Typography variant="h6">IPEDS File Availability</Typography>
              {files.map(({ file, label, available }) => (
                <Stack
                  key={file}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ py: 0.5 }}
                >
                  {available ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <ErrorIcon color="error" fontSize="small" />
                  )}
                  <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {file}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                  </Stack>
                </Stack>
              ))}

              {missingCount > 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {missingCount} file(s) not yet available on IPEDS. The
                  pipeline cannot run until all files are published.
                </Alert>
              )}

              {allAvailable && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  All files are available. Ready to run the pipeline.
                </Alert>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>

      <SubmitButton
        submittingState={submittingState}
        submitChanges={submitChanges}
        disabled={!allAvailable}
      />
    </Container>
  );
}
