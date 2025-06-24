"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { SchoolIndex, SavedSchools } from "@/types";
import Slot from "./Slot";
import SchoolOption from "./SchoolOption";
import styles from "./styles.module.scss";

export default function SchoolSelection(props: {
  savedSchools: SavedSchools;
  optionSchools: SchoolIndex[];
  compareSchools: SchoolIndex[];
  setCompareSchoolIds: (schools: string[]) => void;
  clearCompareIds: () => void;
}) {
  const getSlotSetter = (index: number) => (id: string) => {
    const compareIds = props.compareSchools.map((school) => school.id);
    const newIds = [...Array(3)].map((_, i) => {
      if (i === index) return id;
      return compareIds[i];
    });
    props.setCompareSchoolIds(newIds);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.schoolSelection}>
        <div className={styles.savedSchools}>
          <h2 className={styles.title}>
            Your saved schools
          </h2>
          <div className={styles.schools}>
            {props.optionSchools.map((school) => (
              <SchoolOption
                key={school.id}
                school={school}
              />
            ))}
          </div>
        </div>
        <div className={styles.selection}>
          <div>
            <h3>
              Compare schools
            </h3>
            <button
              type="button"
              onClick={props.clearCompareIds}
            >
              Clear
            </button>
          </div>
          <div className={styles.slots}>
            {[0, 1, 2].map((index) => (
              <Slot
                key={index}
                school={props.compareSchools[index]}
                setSlot={getSlotSetter(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
