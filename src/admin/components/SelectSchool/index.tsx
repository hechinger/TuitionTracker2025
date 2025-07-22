"use client";

import { useState, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSchoolNames } from "@/hooks/useSchoolNames";

type SchoolOption = {
  label: string;
  value: string;
  search: string;
};

export default function SelectSchool(props: {
  label?: string;
  value?: string | null;
  onChange: (value?: string) => void;
}) {
  const {
    value,
    onChange,
    label = "School",
  } = props;

  const [input, setInput] = useState("");

  const { data: schools = [] } = useSchoolNames();

  const {
    selectedValue,
    names,
  } = useMemo(() => {
    let val: undefined | null | { label: string, value: string } = (typeof value === "undefined") ? undefined : null;
    const names = [] as SchoolOption[];
    schools.forEach((school) => {
      const opt = {
        label: school.name,
        value: school.id,
        search: `${school.name} ${school.alias}`.toLowerCase(),
      };
      if (value && school.id === value) {
        val = opt;
      }
      names.push(opt);
    });
    return {
      selectedValue: val,
      names,
    };
  }, [schools, value]);

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
      value={selectedValue}
      onChange={(_, school) => onChange(school?.value)}
      onInputChange={(_, newInput) => setInput(newInput)}
      renderInput={(params) => (
        <TextField {...params} label={label} />
      )}
    />
  );
}
