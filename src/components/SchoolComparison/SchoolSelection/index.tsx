"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Well from "@/components/Well";
import ScrollArea from "@/components/ScrollArea";
import type { SchoolIndex, SavedSchools } from "@/types";
import Slot from "./Slot";
import SchoolOption from "./SchoolOption";
import { useCopySavedSchoolsLink } from "./useCopySavedSchoolsLink";
import styles from "./styles.module.scss";

export default function SchoolSelection(props: {
  savedSchools: SavedSchools;
  optionSchools: SchoolIndex[];
  compareSchools: SchoolIndex[];
  setCompareSchoolIds: (schools: string[]) => void;
  clearCompareIds: () => void;
}) {
  const copy = useCopySavedSchoolsLink({
    savedSchools: props.savedSchools,
  });

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
          <div className={styles.header}>
            <h2 className={styles.title}>
              Your saved schools
            </h2>

            <button
              type="button"
              className={styles.copyButton}
              onClick={copy.copy}
            >
              {copy.message}
            </button>
          </div>
          <ScrollArea scroll="x">
            <div className={styles.schools}>
              {props.optionSchools.map((school) => (
                <SchoolOption
                  key={school.id}
                  school={school}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        <Well>
          <div className={styles.selection}>
            <div className={styles.header}>
              <h3 className={styles.subtitle}>
                Compare schools
              </h3>
              <button
                type="button"
                className={styles.clearButton}
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
        </Well>
      </div>
    </DndProvider>
  );
}
