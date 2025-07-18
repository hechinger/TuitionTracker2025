"use client";

import { useState, useCallback } from "react";
import get from "lodash/get";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Field from "@/admin/components/Field";
import SelectSchool from "@/admin/components/SelectSchool";
import SubmitButton, { type SubmittingState } from "@/admin/components/SubmitButton";
import { useSchool } from "@/hooks/useSchool";
import { schoolFields } from "@/content/schema";

export default function SchoolsDashboard() {
  const [schoolId, setSchoolId] = useState<string>();
  const { data: school } = useSchool(schoolId);

  const [edits, setEdits] = useState(new Map<string, unknown>());

  const [submittingState, setSubmittingState] = useState<SubmittingState>({ state: "ready" });

  const selectSchoolId = (id: string | undefined) => {
    setEdits(new Map());
    setSchoolId(id);
  };

  const onChange = useCallback((path: string[], value: unknown) => {
    setEdits((old) => {
      const newEdits = new Map(old);
      newEdits.set(path[0], value);
      return newEdits;
    });
  }, []);

  const getValue = (field: { path: string }) => {
    const k = field.path;
    return edits.has(k) ? edits.get(k) : get(school, k);
  };

  const submitChanges = useCallback(async () => {
    setSubmittingState({ state: "submitting" });
    try {
      const fieldTypeByPath = new Map<string, string>();
      schoolFields.forEach((field) => {
        fieldTypeByPath.set(field.path, field.type);
      });

      const data = new FormData();
      [...edits].forEach(([path, value]) => {
        data.append(path, value as Blob | string);
      });

      const rsp = await fetch("/api/admin/patch-school", {
        method: "POST",
        body: data,
      });

      if (!rsp.ok) {
        throw new Error("Failed to update school");
      }

      setSubmittingState({ state: "success" });
    } catch (error) {
      console.error(error);
      setSubmittingState({ state: "error", error: `${error}` });
    } finally {
      setTimeout(() => setSubmittingState({ state: "ready" }), 3000);
    }
  }, [edits]);

  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        <Paper
          sx={{ p: 4 }}
          elevation={1}
        >
          <SelectSchool
            label="School"
            onChange={selectSchoolId}
          />
        </Paper>

        {school && (
          <Paper
            sx={{ p: 4 }}
            elevation={1}
          >
            <Stack spacing={4}>
              {schoolFields.map((field) => (
                <Field
                  key={field.path}
                  field={field}
                  value={getValue(field) || ""}
                  onChange={onChange}
                />
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>

      <SubmitButton
        submittingState={submittingState}
        submitChanges={submitChanges}
        disabled={edits.size < 1}
      />
    </Container>
  );
}
