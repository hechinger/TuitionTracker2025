"use client";

import { useId, useState, useMemo } from "react";
import get from "lodash/get";
import clsx from "clsx";
import Editor from "react-simple-wysiwyg";
import type { AdminField, AdminState } from "@/types/admin";
import {
  isStringField,
  isCopyField,
  isRichCopyField,
  isFileField,
  isSchoolIdField,
  isSequence,
  isSection,
  getStateValueWithEdits,
} from "@/admin/utils/fields";
import { useSchools } from "@/hooks/useSchools";
import styles from "./styles.module.scss";

const locales = [
  {
    locale: "en",
    label: "English",
  },
  {
    locale: "es",
    label: "Spanish",
  },
];

const Label = (props: {
  level?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const {
    level = 0,
    className,
    children,
  } = props;
  const tags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  const Tag = tags[level] || "h6";
  return (
    <Tag className={clsx(className, styles.label)}>
      {children}
    </Tag>
  );
};

const SchoolIdInput = (props: {
  label: string;
  value: string | undefined;
  level?: number;
  onChange: (value: string) => void;
}) => {
  const {
    label,
    value,
    level,
    onChange,
  } = props;

  const [state, setState] = useState("");

  const id = `SchoolIdInput--${useId()}`;

  const { data: schools = [] } = useSchools();
  const {
    names,
    nameToId,
    idToName,
  } = useMemo(() => {
    const names = [] as string[];
    const nameToId = new Map<string, string>();
    const idToName = new Map<string, string>();
    schools.forEach((school) => {
      names.push(school.name);
      nameToId.set(school.name, school.id);
      idToName.set(school.id, school.name);
    });
    return {
      names,
      nameToId,
      idToName,
    };
  }, [schools]);

  const search = value ? value.toLowerCase() : "";
  const options = (() => {
    if (search.length < 3) return [];
    return names.filter((name) => name.toLowerCase().includes(search));
  })();

  return (
    <label className={styles.schoolIdField}>
      <Label level={level} className={styles.label}>
        {label}
      </Label>

      <input
        id={id}
        className={styles.schoolIdInput}
        value={state}
        onChange={(e) => {
          const v = e.target.value;
          const id = nameToId.get(v);
          setState(v);
          if (id) {
            onChange(id);
          }
        }}
        onBlur={() => setState(idToName.get(value || "") || "")}
      />

      <datalist id={`${id}--datalist`}>
        {options.slice(0, 50).map((option) => (
          <option key={option} value={option}></option>
        ))}
      </datalist>
    </label>
  );
};

export default function Field(props: {
  field: AdminField;
  path?: string;
  level?: number;
  state: Record<string, string>;
  edits: Map<string, string>;
  onChange: (path: string[], value: string) => void;
}) {
  const {
    field,
    state,
    edits,
    onChange,
    path = "",
    level = 0,
  } = props;

  const getStateValue = getStateValueWithEdits(edits);

  if (isStringField(field)) {
    return (
      <label className={styles.stringField}>
        <Label level={level} className={styles.label}>
          {field.label}
        </Label>

        <input
          type="text"
          className={styles.stringInput}
          value={getStateValue(state, [path])}
          onChange={(e) => onChange([path], e.target.value)}
        />
      </label>
    );
  }

  if (isCopyField(field)) {
    console.log({
      field,
      value_en: getStateValue(state, [path, "en"]),
      path,
      state,
    });
    return (
      <div className={styles.copy}>
        <Label level={level} className={styles.label}>
          {field.label}
        </Label>

        {locales.map((locale) => (
          <label
            key={locale.locale}
            className={styles.locale}
          >
            <div className={styles.localeLabel}>
              {locale.label}
            </div>

            <input
              type="text"
              className={styles.stringInput}
              value={getStateValue(state, [path, locale.locale])}
              onChange={(e) => onChange(
                [path, locale.locale],
                e.target.value,
              )}
            />
          </label>
        ))}
      </div>
    );
  }

  if (isRichCopyField(field)) {
    return (
      <div className={styles.richCopy}>
        <Label level={level} className={styles.label}>
          {field.label}
        </Label>

        {locales.map((locale) => (
          <div
            key={locale.locale}
            className={styles.locale}
          >
            <div className={styles.localeLabel}>
              {locale.label}
            </div>

            <Editor
              value={getStateValue(state, [path, locale.locale])}
              onChange={(e) => onChange(
                [path, locale.locale],
                e.target.value,
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  if (isFileField(field)) {
    return (
      <label className={styles.fileField}>
        <Label level={level} className={styles.label}>
          {field.label}
        </Label>

        <input
          type="file"
          className={styles.fileInput}
          onChange={(e) => onChange([path], e.target.value)}
          accept={field.accept}
        />
      </label>
    );
  }

  if (isSchoolIdField(field)) {
    return null;

    return (
      <SchoolIdInput
        label={field.label}
        value={getStateValue(state, path)}
        onChange={(v: string) => onChange(path, v)}
      />
    );
  }

  if (isSequence(field)) {
    return null;

    const elements = get(state, path, []) as (string | AdminState)[];

    const addSlot = () => {
      onChange(path, [...elements, field.defaultValue]);
    };

    const removeSlot = (i: number) => {
      const newElements = elements.slice();
      newElements.splice(i, 1);
      onChange(path, newElements);
    };

    return (
      <div className={styles.sequence}>
        <Label level={level} className={styles.sequenceLabel}>
          {field.label}
        </Label>

        {elements.map((_, i) => (
          <div key={i}>
            <Field
              field={field.element}
              path={`${path}.${i}`}
              state={state}
              level={level + 1}
              onChange={onChange}
            />
            <button
              type="button"
              className={styles.sequenceRemoveButton}
              onClick={() => removeSlot(i)}
            >
              Remove
            </button>
          </div>
        ))}

        <div>
          <button
            type="button"
            className={styles.sequenceRemoveButton}
            onClick={addSlot}
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  if (isSection(field)) {
    return (
      <div
        className={clsx(styles.section, styles[`section${level}`])}
      >
        <Label level={level} className={styles.sectionLabel}>
          {field.label}
        </Label>

        {field.fields.map((sectionField) => (
          <Field
            key={sectionField.key}
            field={sectionField}
            path={`${path ? `${path}.` : ""}${sectionField.key}`}
            state={state}
            edits={edits}
            level={level + 1}
            onChange={onChange}
          />
        ))}
      </div>
    );
  }

  console.error("Unknown field type", field);
  return null;
}
