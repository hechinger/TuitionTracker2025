import type {
  AdminField,
  AdminStringField,
  AdminCopyField,
  AdminRichCopyField,
  AdminFileField,
  AdminSchoolIdField,
  AdminSequence,
  AdminSection,
  AdminState,
} from "@/types/admin";
import get from "lodash/get";

export function isStringField(field: AdminField): field is AdminStringField {
  return field.type === "string";
}

export function isCopyField(field: AdminField): field is AdminCopyField {
  return field.type === "copy";
}

export function isRichCopyField(field: AdminField): field is AdminRichCopyField {
  return field.type === "richCopy";
}

export function isFileField(field: AdminField): field is AdminFileField {
  return field.type === "file";
}

export function isSchoolIdField(field: AdminField): field is AdminSchoolIdField {
  return field.type === "schoolId";
}

export function isSequence(field: AdminField): field is AdminSequence {
  return field.type === "array";
}

export function isSection(field: AdminField): field is AdminSection {
  return field.type === "section";
}

export function getStateValue(state: AdminState, path: string[]) {
  const value = get(state, path, "");
  if (typeof value !== "string") {
    throw new Error("Invalid admin state value, not a string");
  }
  return value;
}

export function getStateValueWithEdits(edits: Map<string, string>) {
  return (state: AdminState, path: string[]) => {
    const value = edits.get(JSON.stringify(path)) || get(state, path, "");
    if (typeof value !== "string") {
      throw new Error("Invalid admin state value, not a string");
    }
    return value;
  };
}
