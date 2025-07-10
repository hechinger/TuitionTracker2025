"use client";

import { useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSchools } from "@/hooks/useSchools";

export default function SchoolIdInput() {
  const { data: schools = [] } = useSchools();
  const {
    names,
  } = useMemo(() => {
    const names = [] as { label: string, value: string }[];
    schools.forEach((school) => {
      names.push({ label: school.name, value: school.id });
    });
    return {
      names,
    };
  }, [schools]);

  return (
    <Autocomplete
      disablePortal
      options={names}
      renderInput={(params) => (
        <TextField {...params} label="School" />
      )}
    />
  );
}
