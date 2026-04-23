import { getHashtagRanges } from "@/lib/hashtag";

export type LinkifySegment =
  | { type: "text"; value: string }
  | { type: "url"; value: string }
  | { type: "hashtag"; value: string };

const URL_REGEX = /https?:\/\/[^\s]+/g;

type Range = {
  start: number;
  end: number;
  type: "url" | "hashtag";
};

/**
 * 本文をテキスト・URL・ハッシュタグのセグメントに分解する。
 * 呼び出し側は segment.type に応じて `<a>`・ハイライト付き `<span>`・プレーンテキストを描画する。
 * ハッシュタグ検出は `lib/hashtag.ts` の正規表現を流用しバックエンドの抽出結果と揃える。
 * @param content - 本文
 * @returns テキスト・URL・ハッシュタグが混在したセグメント配列
 */
export const linkifyContent = (content: string): LinkifySegment[] => {
  if (content.length === 0) return [];

  const ranges: Range[] = [];

  for (const m of content.matchAll(URL_REGEX)) {
    if (m.index === undefined) continue;
    ranges.push({ start: m.index, end: m.index + m[0].length, type: "url" });
  }

  for (const r of getHashtagRanges(content)) {
    ranges.push({ start: r.start, end: r.end, type: "hashtag" });
  }

  ranges.sort((a, b) => a.start - b.start);

  const segments: LinkifySegment[] = [];
  let cursor = 0;

  for (const r of ranges) {
    // URL 内にハッシュタグが重なる等の被りは、先頭優先で後続をスキップする
    if (r.start < cursor) continue;
    if (r.start > cursor) {
      segments.push({ type: "text", value: content.slice(cursor, r.start) });
    }
    segments.push({ type: r.type, value: content.slice(r.start, r.end) });
    cursor = r.end;
  }

  if (cursor < content.length) {
    segments.push({ type: "text", value: content.slice(cursor) });
  }

  return segments;
};
