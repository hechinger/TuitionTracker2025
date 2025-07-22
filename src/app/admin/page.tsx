"use client";

import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { sections } from "@/admin/components/AdminNav";

export default function Admin() {
  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        {sections.map((section) => (
          <Paper
            key={section.url}
            sx={{ p: 4 }}
            elevation={1}
          >
            <Link href={section.url}>
              <Typography variant="h4" gutterBottom>
                {section.name}
              </Typography>
            </Link>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
