"use client";

import { useId } from "react";
import Editor from "react-simple-wysiwyg";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Robotext from "@/components/Robotext";
import styles from "./styles.module.scss";

type FieldType = {
  type: string;
  title: string;
  path: string;
  variables?: {
    name: string;
    help: string;
    example: string;
  }[];
  options?: {
    value: string;
    label: string;
  }[];
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function Field(props: {
  locale?: string;
  localeLabel?: string;
  field: FieldType;
  value: unknown;
  onChange: (path: string[], value: unknown) => void;
}) {
  const {
    locale = "en",
    localeLabel = "English",
    field,
    value,
    onChange,
  } = props;

  const id = useId();

  if (field.type === "string") {
    return (
      <TextField
        id={field.path}
        label={field.title}
        value={value}
        variant="outlined"
        onChange={(e) => onChange([field.path], e.target.value)}
      />
    );
  }

  if (field.type === "copy") {
    return (
      <Stack>
        <TextField
          id={field.path}
          label={`${field.title} (${localeLabel})`}
          value={value}
          variant="outlined"
          onChange={(e) => onChange([field.path, locale], e.target.value)}
        />
        {field.variables && (
          <div className={styles.autotextHelp}>
            <div className={styles.autotextPreview}>
              <Robotext
                template={`${value || ""}`}
                context={Object.fromEntries(field.variables.map((v) => [
                  v.name,
                  v.example,
                ]))}
              />
            </div>
            <div className={styles.autotextVariables}>
              <div>Variables:</div>
              {field.variables.map((v) => (
                <div key={v.name}>
                  <span>{v.name}</span>
                  {" "}
                  <span>{v.help}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Stack>
    );
  }

  if (field.type === "richCopy") {
    return (
      <div className={styles.richCopy}>
        <div className={styles.label}>
          {`${field.title} (${localeLabel})`}
        </div>

        <Editor
          value={`${value || ""}`}
          onChange={(e) => onChange([field.path, locale], e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "autotext") {
    return (
      <div className={styles.autotext}>
        <div className={styles.label}>
          {`${field.title} (${localeLabel})`}
        </div>

        <Editor
          value={`${value || ""}`}
          onChange={(e) => onChange([field.path, locale], e.target.value)}
        />

        {field.variables && (
          <div className={styles.autotextHelp}>
            <div className={styles.autotextPreview}>
              <Robotext
                template={`${value || ""}`}
                context={Object.fromEntries(field.variables.map((v) => [
                  v.name,
                  v.example,
                ]))}
              />
            </div>
            <div className={styles.autotextVariables}>
              <div>Variables:</div>
              <ul>
                {field.variables.map((v) => (
                  <li key={v.name}>
                    <span className={styles.varName}>{v.name}</span>
                    {" "}
                    <span>{v.help}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <FormControl fullWidth>
        <InputLabel id={`select-${id}-label`}>
          {field.title}
        </InputLabel>
        <Select
          labelId={`select-${id}-label`}
          id={`select-${id}`}
          value={value}
          label={field.title}
          onChange={(e) => onChange([field.path], e.target.value)}
        >
          {field.options?.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (field.type === "boolean") {
    return (
      <FormControlLabel
        control={(
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange([field.path], e.target.checked)}
          />
        )}
        label={field.title}
      />
    );
  }

  if (field.type === "image") {
    const url = (() => {
      if (!value) return null;
      if (typeof value === "string") return value;
      return URL.createObjectURL(value as MediaSource);
    })();
    return (
      <div className={styles.imagePicker}>
        <div className={styles.imageTitle}>
          {field.title}
        </div>
        {url ? (
          <div className={styles.imagePreview}>
            <img
              src={url}
              alt="Image preview"
              className={styles.image}
            />
            <IconButton
              role={undefined}
              size="small"
              aria-label="Clear"
              onClick={() => onChange([field.path], undefined)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ) : (
          <div className={styles.imagePlaceholder}>
            <Button
              component="label"
              role={undefined}
              variant="outlined"
              tabIndex={-1}
              startIcon={<ImageIcon />}
            >
              {field.title}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const [file] = event.target.files || [];
                  onChange([field.path], file);
                }}
              />
            </Button>
          </div>
        )}
      </div>
    );
  }

  console.error("Unknown field type", field);
  return null;
}
