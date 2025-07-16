"use client";

import { useState, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSchools } from "@/hooks/useSchools";

type SchoolOption = {
  label: string;
  value: string;
  search: string;
};

export default function SelectSchool(props: {
  label?: string;
  onChange: (value?: string) => void;
}) {
  const {
    onChange,
    label = "School",
  } = props;

  const [input, setInput] = useState("");

  const { data: schools = [] } = useSchools();

  const {
    names,
  } = useMemo(() => {
    const names = [] as SchoolOption[];
    schools.forEach((school) => {
      names.push({
        label: school.name,
        value: school.id,
        search: `${school.name} ${school.alias}`.toLowerCase(),
      });
    });
    return {
      names,
    };
  }, [schools]);

  const options = useMemo(() => {
    if (input.length < 3) return names.slice(0, 20);
    const search = input.toLowerCase();
    return names
      .filter((school) => school.search.includes(search))
      .slice(0, 20);
  }, [names, input]);

  return (
    <Autocomplete
      disablePortal
      options={options}
      onChange={(_, school) => onChange(school?.value)}
      onInputChange={(_, newInput) => setInput(newInput)}
      renderInput={(params) => (
        <TextField {...params} label={label} />
      )}
    />
  );
}
