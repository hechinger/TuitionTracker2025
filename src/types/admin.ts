export type AdminState = {
  [key: string]: string | AdminState | (string | AdminState)[];
};

export type AdminStateValue = AdminState[string];

export type AdminStringField = {
  type: "string";
  path: string;
  title: string;
};

export type AdminCopyField = {
  type: "copy";
  path: string;
  title: string;
};

export type AdminRichCopyField = {
  type: "richCopy";
  path: string;
  title: string;
};

export type AdminFileField = {
  type: "image";
  path: string;
  title: string;
};

export type AdminField = {
  type: string;
  path: string;
  title: string;
};
