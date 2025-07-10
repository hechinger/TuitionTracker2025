"use client";

import Editor from "react-simple-wysiwyg";
import TextField from "@mui/material/TextField";
import type { AdminField } from "@/types/admin";
import {
  isStringField,
  isCopyField,
  isRichCopyField,
  isFileField,
} from "@/admin/utils/fields";
import styles from "./styles.module.scss";

const localeLabels = {
  en: "English",
  es: "Spanish",
} as const;

export default function Field(props: {
  locale: keyof typeof localeLabels;
  field: AdminField;
  value?: string;
  onChange?: (path: string, value: string) => void;
}) {
  const {
    locale,
    field,
    value,
    onChange = () => {},
  } = props;

  if (isStringField(field)) {
    return (
      <TextField
        id={field.path}
        label={field.title}
        value={value}
        variant="outlined"
        onChange={(e) => onChange(field.path, e.target.value)}
      />
    );
  }

  if (isCopyField(field)) {
    return (
      <TextField
        id={field.path}
        label={`${field.title} (${localeLabels[locale]})`}
        value={value}
        variant="outlined"
        onChange={(e) => onChange(field.path, e.target.value)}
      />
    );
  }

  if (isRichCopyField(field)) {
    return (
      <div className={styles.richCopy}>
        <div className={styles.label}>
          {`${field.title} (${localeLabels[locale]})`}
        </div>

        <Editor
          value={value}
          onChange={(e) => onChange(field.path, e.target.value)}
        />
      </div>
    );
  }

  if (isFileField(field)) {
    return null;
    // return (
    //   <label className={styles.fileField}>
    //     <Label level={level} className={styles.label}>
    //       {field.label}
    //     </Label>

    //     <input
    //       type="file"
    //       className={styles.fileInput}
    //       onChange={(e) => onChange([path], e.target.value)}
    //       accept={field.accept}
    //     />
    //   </label>
    // );
  }

  console.error("Unknown field type", field);
  return null;
}
