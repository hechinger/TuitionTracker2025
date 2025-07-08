export type AdminState = {
  [key: string]: string | AdminState | (string | AdminState)[];
};

export type AdminStateValue = AdminState[string];

export type AdminStringField = {
  type: "string";
  key: string;
  label: string;
};

export type AdminCopyField = {
  type: "copy";
  key: string;
  label: string;
};

export type AdminRichCopyField = {
  type: "richCopy";
  key: string;
  label: string;
};

export type AdminFileField = {
  type: "file";
  key: string;
  label: string;
  accept: string;
};

export type AdminSchoolIdField = {
  type: "schoolId";
  key: string;
  label: string;
};

export type AdminSequence = {
  type: "array";
  key: string;
  label: string;
  defaultValue: string | AdminState;
  element: AdminField;
};

export type AdminSection = {
  type: "section";
  key: string;
  label: string;
  fields: AdminField[];
};

export type AdminField = AdminStringField
  | AdminCopyField
  | AdminRichCopyField
  | AdminFileField
  | AdminSchoolIdField
  | AdminSequence
  | AdminSection;
