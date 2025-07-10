"use client";

import Paper from "@mui/material/Paper";
import SchoolIdInput from "./SchoolIdInput";

export default function SchoolEditor() {
  return (
    <Paper
      sx={{ p: 4 }}
      elevation={1}
    >
      <SchoolIdInput />
    </Paper>
  );
}
