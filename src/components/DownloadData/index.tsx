"use client";

import {
  CurrencyDollarIcon,
  ScalesIcon,
  GraduationCapIcon,
  ChartLineUpIcon,
  CloudArrowDownIcon,
} from "@phosphor-icons/react";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

const datasets = [
  {
    name: "School sticker prices",
    description: "Sticker prices for each school",
    url: "/api/schools/download-data/sticker",
    icon: <CurrencyDollarIcon size={24} />,
  },
  {
    name: "School net prices",
    description: "Net, in-state prices for each school",
    url: "/api/schools/download-data/net",
    icon: <ScalesIcon size={24} />,
  },
  {
    name: "Graduation rates",
    description: "Graduation rates for each school",
    url: "/api/schools/download-data/graduation",
    icon: <GraduationCapIcon size={24} />,
  },
  {
    name: "Retention rates",
    description: "Student retention rates for each school",
    url: "/api/schools/download-data/retention",
    icon: <ChartLineUpIcon size={24} />,
  },
];

export default function DownloadData() {
  return (
    <Well width="text">
      <div className={styles.downloadData}>
        {datasets.map((dataset) => (
          <a
            key={dataset.url}
            className={styles.dataset}
            href={dataset.url}
            download
          >
            <div className={styles.icon}>
              {dataset.icon}
            </div>
            <div className={styles.info}>
              <div className={styles.name}>
                {dataset.name}
              </div>
              <div className={styles.description}>
                {dataset.description}
              </div>
            </div>
            <div className={styles.download}>
              <CloudArrowDownIcon size={24} />
            </div>
          </a>
        ))}
      </div>
    </Well>
  );
}
