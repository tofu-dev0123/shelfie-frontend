"use client";

import {
  SEARCH_TYPES,
  SEARCH_TYPE_LABEL,
  type SearchType,
} from "@/constants/search";
import styles from "./styles/SearchTabs.module.css";

type Props = {
  current: SearchType;
  onChange: (next: SearchType) => void;
};

export function SearchTabs({ current, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist">
      {SEARCH_TYPES.map((type) => {
        const isActive = type === current;
        return (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tab} ${isActive ? styles.isActive : ""}`}
            onClick={() => onChange(type)}
          >
            {SEARCH_TYPE_LABEL[type]}
          </button>
        );
      })}
    </div>
  );
}
