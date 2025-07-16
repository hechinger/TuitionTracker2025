"use client";

import Link from "next/link";
import {
  SignedIn,
  SignOutButton,
} from "@clerk/nextjs";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function AdminNav() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/">
            Tuition Tracker
          </Link>
        </Typography>
        <SignedIn>
          <Stack direction="row" alignItems="center" spacing={4}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>
                <Link href="/admin/content">
                  Content
                </Link>
              </Typography>

              <Typography>
                <Link href="/admin/schools">
                  Schools
                </Link>
              </Typography>
            </Stack>

            <SignOutButton redirectUrl="/admin">
              <Button color="inherit">Sign out</Button>
            </SignOutButton>
          </Stack>
        </SignedIn>
      </Toolbar>
    </AppBar>
  );
}
