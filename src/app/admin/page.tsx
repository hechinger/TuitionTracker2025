import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";

export default async function Admin() {
  return (
    <Container maxWidth="md">
      <Stack spacing={4} sx={{ py: 4 }}>
        <Paper
          sx={{ p: 4 }}
          elevation={1}
        >
          <Link href="/admin/content">
            <Typography variant="h4" gutterBottom>
              Content management
            </Typography>
          </Link>
        </Paper>

        <Paper
          sx={{ p: 4 }}
          elevation={1}
        >
          <Link href="/admin/schools">
            <Typography variant="h4" gutterBottom>
              School data management
            </Typography>
          </Link>
        </Paper>
      </Stack>
    </Container>
  );
}
