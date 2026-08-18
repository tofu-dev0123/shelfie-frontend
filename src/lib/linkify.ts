export type LinkifySegment =
  | { type: "text"; value: string }
  | { type: "url"; value: string };

const URL_REGEX = /https?:\/\/[^\s]+/g;

/**
 * 本文をテキストとURLのセグメントに分解する。
 * 呼び出し側は segment.type に応じて `<a>`・プレーンテキストを描画する。
 * @param content - 本文
 * @returns テキストとURLが混在したセグメント配列
 */
export const linkifyContent = (content: string): LinkifySegment[] => {
  if (content.length === 0) return [];

  const segments: LinkifySegment[] = [];
  let cursor = 0;

  for (const m of content.matchAll(URL_REGEX)) {
    if (m.index === undefined) continue;
    if (m.index > cursor) {
      segments.push({ type: "text", value: content.slice(cursor, m.index) });
    }
    segments.push({ type: "url", value: m[0] });
    cursor = m.index + m[0].length;
  }

  if (cursor < content.length) {
    segments.push({ type: "text", value: content.slice(cursor) });
  }

  return segments;
};
