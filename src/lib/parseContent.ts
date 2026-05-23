export type ContentPart =
  | { type: "text"; value: string }
  | { type: "tag"; value: string; tagName: string };

const TAG_REGEX = /#[\p{L}\p{N}_]+/gu;

/**
 * 投稿本文を解析し、テキストとタグ（#xxx 形式）の配列に分解する。
 * タグは Unicode の文字・数字・アンダースコアで構成される連続文字列を抽出する
 * （日本語・英数字混在に対応）。
 * @param content - 解析対象の本文
 * @returns テキスト断片とタグ断片の順序付き配列
 */
export const parseContent = (content: string): ContentPart[] => {
  const parts: ContentPart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(TAG_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, start) });
    }
    parts.push({
      type: "tag",
      value: match[0],
      tagName: match[0].slice(1),
    });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
};
