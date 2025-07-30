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

export const sections = [
  {
    url: "/admin/content",
    name: "Content",
  },
  {
    url: "/admin/schools",
    name: "Schools",
  },
  {
    url: "/admin/recommended-schools",
    name: "Recommendations",
  },
  {
    url: "/admin/recirculation-articles",
    name: "Recirculation",
  },
  {
    url: "/admin/data-pipeline",
    name: "Data Pipeline",
  },
];

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
              {sections.map((section) => (
                <Typography key={section.url}>
                  <Link href={section.url}>
                    {section.name}
                  </Link>
                </Typography>
              ))}
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
