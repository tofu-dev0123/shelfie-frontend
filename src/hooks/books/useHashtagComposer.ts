import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type CompositionEvent,
  type SyntheticEvent,
} from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import {
  detectHashtagTrigger,
  replaceHashtagToken,
  type HashtagTrigger,
} from "@/lib/hashtag";
import { useHashtagSuggest } from "./useHashtagSuggest";
import type { BookPostFormData } from "@/schemas/book";

/**
 * 本文 textarea とハッシュタグサジェストを連動させるフック。
 * キャレット位置・IME 状態・キーボード操作を監視し、トリガー検出時に
 * サジェスト API を呼ぶ。選択されたタグで本文中のトークンを置換する。
 * @param control - react-hook-form の Control
 * @param setValue - react-hook-form の setValue
 * @returns textareaRef, textareaProps, サジェスト表示用の状態とハンドラ群
 */
export const useHashtagComposer = (
  control: Control<BookPostFormData>,
  setValue: UseFormSetValue<BookPostFormData>,
) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [caret, setCaret] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  // Esc でユーザーが閉じたトリガー位置。同じトークンの間は panel を再オープンしない。
  const [closedAt, setClosedAt] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const content = useWatch({ control, name: "content" }) ?? "";

  // IME 変換中は未確定文字列に対してサジェストを走らせたくないため無効化する
  const rawTrigger: HashtagTrigger | null = useMemo(() => {
    if (isComposing) return null;
    return detectHashtagTrigger(content, caret);
  }, [content, caret, isComposing]);

  // ユーザーが Esc で閉じたトークンと同位置ならトリガーを抑止する。
  // caret がトークンから外れる or 別のトークンに移った時点で、
  // rawTrigger の start が変わるので自動的に再オープンできる。
  const trigger: HashtagTrigger | null =
    rawTrigger && closedAt === rawTrigger.start ? null : rawTrigger;

  const { suggestions, isLoading } = useHashtagSuggest(trigger?.query ?? "");

  // サジェストが更新されたら選択位置を先頭に戻す（render 時同期パターン）
  const [lastSuggestions, setLastSuggestions] = useState(suggestions);
  if (suggestions !== lastSuggestions) {
    setLastSuggestions(suggestions);
    setActiveIndex(0);
  }

  // query が 1 文字以上入力されていれば、読込中・結果なしでもパネルを開き
  // 「検索中...」や「該当なし → 新規タグ作成」ヒントを出す。
  const isOpen = trigger !== null && trigger.query.length > 0;

  const syncCaret = useCallback((e: SyntheticEvent<HTMLTextAreaElement>) => {
    setCaret(e.currentTarget.selectionStart);
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (e: CompositionEvent<HTMLTextAreaElement>) => {
      setIsComposing(false);
      setCaret(e.currentTarget.selectionStart);
    },
    [],
  );

  const closePanel = useCallback(() => {
    if (trigger) setClosedAt(trigger.start);
  }, [trigger]);

  const selectSuggestion = useCallback(
    (name: string) => {
      if (!trigger) return;
      const { text, caret: nextCaret } = replaceHashtagToken(
        content,
        trigger,
        name,
      );
      setValue("content", text, { shouldValidate: true, shouldDirty: true });
      setCaret(nextCaret);
      // setValue 後の再レンダで反映された textarea に caret 位置を戻す
      queueMicrotask(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(nextCaret, nextCaret);
      });
    },
    [trigger, content, setValue],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) =>
          suggestions.length === 0 ? 0 : (i + 1) % suggestions.length,
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) =>
          suggestions.length === 0
            ? 0
            : (i - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        const target =
          suggestions[activeIndex] ?? (trigger ? trigger.query : undefined);
        if (!target) return;
        e.preventDefault();
        selectSuggestion(target);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
      }
    },
    [isOpen, suggestions, activeIndex, trigger, selectSuggestion, closePanel],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLTextAreaElement>) => {
      syncCaret(e);
    },
    [syncCaret],
  );

  const textareaProps = {
    onSelect: syncCaret,
    onKeyUp: syncCaret,
    onClick: handleClick,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  };

  return {
    textareaRef,
    textareaProps,
    isOpen,
    query: trigger?.query ?? "",
    suggestions,
    isLoading,
    activeIndex,
    setActiveIndex,
    selectSuggestion,
    closePanel,
  };
};
