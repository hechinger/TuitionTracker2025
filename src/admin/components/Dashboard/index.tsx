"use client";

import { useCallback, useState, useMemo } from "react";
import set from "lodash/set";
import { schema } from "@/content/schema";
import Field from "@/admin/components/Field";

type ContentEntry = {
  db_id: number;
  locale?: string | null;
  component: string;
  path: string;
  value?: string | null;
};

export default function Dashboard(props: {
  content: ContentEntry[];
}) {
  const {
    content,
  } = props;

  const [submittingState, setSubmittingState] = useState("ready");
  const [edits, setEdits] = useState(new Map<string, string>());
  const state = useMemo(() => {
    const s = {};
    content.forEach((c) => {
      const p = `${c.component}.${c.path}`;
      const k = c.locale ? [p, c.locale] : [p];
      set(s, k, c.value);
    });
    return s;
  }, [content]);

  const onChange = useCallback((path: string[], value: string) => {
    setEdits((old) => {
      const newEdits = new Map(old);
      newEdits.set(JSON.stringify(path), value);
      return newEdits;
    });
  }, []);

  const submitChanges = useCallback(async () => {
    setSubmittingState("submitting");
    try {
      const dbIds = new Map(content.map((c) => [
        `${c.component}.${c.path}.${c.locale}`,
        c.db_id,
      ]));
      const newContent = [...edits].map(([key, value]) => {
        const [path, locale] = JSON.parse(key);
        const [component, ...restPath] = path.split(".");
        const idKey = `${component}.${restPath.join(".")}.${locale}`;
        return {
          db_id: dbIds.get(idKey),
          locale,
          component,
          path: restPath.join("."),
          value,
        };
      });
      const rsp = await fetch("/api/admin/set-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });

      if (rsp.ok) {
        setSubmittingState("success");
      } else {
        throw new Error("post failed");
      }
    } catch (error) {
      console.error(error);
      setSubmittingState("error");
    } finally {
      setTimeout(() => setSubmittingState("ready"), 3000);
    }
  }, [edits, content]);

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={submitChanges}
          disabled={submittingState !== "ready"}
        >
          Submit
        </button>
      </div>

      <Field
        field={schema}
        state={state}
        edits={edits}
        onChange={onChange}
      />
    </div>
  );
}
