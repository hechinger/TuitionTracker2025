"use client";

import { useDrag } from "react-dnd";
import { dndRef } from "@/utils/dndRef";
import SchoolCard from "@/components/SchoolCard";
import type { SchoolIndex } from "@/types";

export default function SchoolOption(props: {
  school: SchoolIndex;
}) {
  const [, drag] = useDrag(() => ({
    type: 'SchoolOption',
    item: {
      id: props.school.id,
    },
  }), [props.school.id]);

  return (
    <div ref={dndRef(drag)}>
      <SchoolCard
        school={props.school}
      />
    </div>
  );
}
