import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type CompositionEvent,
  type SyntheticEvent,
  type UIEvent,
} from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import {
  detectHashtagTrigger,
  replaceHashtagToken,
  type HashtagTrigger,
} from "@/lib/hashtag";
import { getCaretCoordinates } from "@/lib/textareaCaret";
import { useHashtagSuggest } from "./useHashtagSuggest";
import type { BookPostFormData } from "@/schemas/book";

type CaretPoint = { top: number; left: number };

/**
 * 本文 textarea とハッシュタグサジェストを連動させるフック。
 * キャレット位置・IME 状態・キーボード操作・スクロール位置を監視し、
 * トリガー検出時にサジェスト API を呼んで、キャレット直下に浮かせるための
 * 座標も算出する。
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
  const [caretCoords, setCaretCoords] = useState<CaretPoint | null>(null);
  const [scrollOffset, setScrollOffset] = useState({ top: 0, left: 0 });
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

  // 候補が 0 件の間はパネルを開かない（キャレット直下に空パネルを出さない方針）
  const isOpen = trigger !== null && suggestions.length > 0;

  // 現在の textarea 要素とキャレット位置・値から、パネル位置用の座標を取得する。
  // 呼び出し側の event handler 内で使用するため、ref アクセスを避けられる。
  const measureCaret = useCallback(
    (el: HTMLTextAreaElement, pos: number): void => {
      const coords = getCaretCoordinates(el, pos, el.value);
      if (!coords) return;
      setCaretCoords({
        top: coords.top + coords.height - el.scrollTop,
        left: coords.left - el.scrollLeft,
      });
    },
    [],
  );

  const syncCaret = useCallback(
    (e: SyntheticEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const pos = el.selectionStart;
      setCaret(pos);
      measureCaret(el, pos);
    },
    [measureCaret],
  );

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(
    (e: CompositionEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const pos = el.selectionStart;
      setIsComposing(false);
      setCaret(pos);
      measureCaret(el, pos);
    },
    [measureCaret],
  );

  const handleScroll = useCallback((e: UIEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    setScrollOffset({ top: el.scrollTop, left: el.scrollLeft });
    // スクロール中もキャレット座標を追従させる
    const coords = getCaretCoordinates(el, el.selectionStart, el.value);
    if (!coords) return;
    setCaretCoords({
      top: coords.top + coords.height - el.scrollTop,
      left: coords.left - el.scrollLeft,
    });
  }, []);

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
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        const target = suggestions[activeIndex];
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
    [isOpen, suggestions, activeIndex, selectSuggestion, closePanel],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLTextAreaElement>) => {
      syncCaret(e);
    },
    [syncCaret],
  );

  // onInput は入力（paste/IME 含む）のたびに発火し、rhf の onChange とも共存する。
  // キャレット座標はここでも再計算して追従させる。
  const handleInput = useCallback(
    (e: SyntheticEvent<HTMLTextAreaElement>) => {
      syncCaret(e);
    },
    [syncCaret],
  );

  const textareaProps = {
    onSelect: syncCaret,
    onKeyUp: syncCaret,
    onClick: handleClick,
    onInput: handleInput,
    onScroll: handleScroll,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  };

  return {
    textareaRef,
    textareaProps,
    isOpen,
    caretCoords,
    suggestions,
    isLoading,
    activeIndex,
    setActiveIndex,
    selectSuggestion,
    closePanel,
    scrollOffset,
  };
};
