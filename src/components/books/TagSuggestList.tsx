"use client";

import type { CSSProperties } from "react";
import styles from "./styles/TagSuggestList.module.css";

type Props = {
  suggestions: string[];
  isLoading: boolean;
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (name: string) => void;
  style?: CSSProperties;
};

export function TagSuggestList({
  suggestions,
  activeIndex,
  onHover,
  onSelect,
  style,
}: Props) {
  if (suggestions.length === 0) return null;
  return (
    <div className={styles.panel} role="listbox" style={style}>
      {suggestions.map((name, i) => (
        <button
          key={name}
          type="button"
          role="option"
          aria-selected={i === activeIndex}
          className={`${styles.item} ${i === activeIndex ? styles.itemActive : ""}`}
          onMouseEnter={() => onHover(i)}
          // mousedown にすることで textarea の blur より先にハンドラを走らせる
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(name);
          }}
        >
          #{name}
        </button>
      ))}
    </div>
  );
}
