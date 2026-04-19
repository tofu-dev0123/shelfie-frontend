"use client";

import { type ReactNode } from "react";
import {
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { useHashtagComposer } from "@/hooks/books/useHashtagComposer";
import { getHashtagRanges } from "@/lib/hashtag";
import type { BookPostFormData } from "@/schemas/book";
import { TagSuggestList } from "./TagSuggestList";
import styles from "./styles/HashtagEditor.module.css";

type Props = {
  register: UseFormRegister<BookPostFormData>;
  control: Control<BookPostFormData>;
  setValue: UseFormSetValue<BookPostFormData>;
  id?: string;
  rows?: number;
  placeholder?: string;
};

/**
 * ハッシュタグを色付きで表示しつつ、キャレット直下にサジェストを浮かせる textarea エディタ。
 * 実体の textarea はテキスト色を透明にし、背面に同スタイルの backdrop を重ねて
 * ハッシュタグ部分だけ着色する手法をとる。
 */
export function HashtagEditor({
  register,
  control,
  setValue,
  id,
  rows = 5,
  placeholder,
}: Props) {
  const {
    textareaRef,
    textareaProps,
    isOpen,
    caretCoords,
    suggestions,
    isLoading,
    activeIndex,
    setActiveIndex,
    selectSuggestion,
    scrollOffset,
  } = useHashtagComposer(control, setValue);

  const { ref: rhfRef, ...contentRest } = register("content");

  // backdrop のハイライト表示は常に最新の入力値が必要なので別途 subscribe する。
  const content = useWatch({ control, name: "content" }) ?? "";

  return (
    <div className={styles.wrapper}>
      <div
        aria-hidden
        className={styles.backdrop}
        style={{
          transform: `translate(${-scrollOffset.left}px, ${-scrollOffset.top}px)`,
        }}
      >
        {renderHighlighted(content)}
      </div>
      <textarea
        id={id}
        {...contentRest}
        ref={(node) => {
          rhfRef(node);
          textareaRef.current = node;
        }}
        rows={rows}
        placeholder={placeholder}
        className={styles.textarea}
        {...textareaProps}
      />
      {isOpen && caretCoords && (
        <TagSuggestList
          suggestions={suggestions}
          isLoading={isLoading}
          activeIndex={activeIndex}
          onHover={setActiveIndex}
          onSelect={selectSuggestion}
          style={{ top: caretCoords.top, left: caretCoords.left }}
        />
      )}
    </div>
  );
}

const renderHighlighted = (text: string): ReactNode[] => {
  if (text.length === 0) {
    // 空テキストでも backdrop の高さを保つために空白を 1 つ入れる
    return [" "];
  }
  const ranges = getHashtagRanges(text);
  const parts: ReactNode[] = [];
  let last = 0;
  ranges.forEach((r, i) => {
    if (r.start > last) parts.push(text.slice(last, r.start));
    parts.push(
      <span key={i} className={styles.hashtag}>
        {text.slice(r.start, r.end)}
      </span>,
    );
    last = r.end;
  });
  if (last < text.length) parts.push(text.slice(last));
  // 末尾が改行で終わる場合、div 側だけ改行が食われるので空白を足して補正する
  if (text.endsWith("\n")) parts.push(" ");
  return parts;
};
