"use client";

import styles from "./styles/TagSuggestList.module.css";

type Props = {
  query: string;
  suggestions: string[];
  isLoading: boolean;
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (name: string) => void;
};

export function TagSuggestList({
  query,
  suggestions,
  isLoading,
  activeIndex,
  onHover,
  onSelect,
}: Props) {
  return (
    <div className={styles.panel} role="listbox">
      {isLoading && suggestions.length === 0 && (
        <div className={styles.hint}>検索中...</div>
      )}
      {!isLoading && suggestions.length === 0 && query.length > 0 && (
        <div className={styles.hint}>
          該当するタグがありません。Enterで「#{query}」を新規タグとして追加
        </div>
      )}
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
