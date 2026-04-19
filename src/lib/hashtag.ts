/**
 * 本文ハッシュタグ（#xxx）のパース・検出・置換ユーティリティ。
 *
 * バックエンド（Rails）の HashtagParser と抽出結果を必ず一致させる必要があるため、
 * 本ファイルの正規表現・トークン最大長はバックエンド側と同期して管理する。
 *   バックエンド: `/#([\p{L}\p{N}_]{1,50})/u`
 */

// ハッシュタグのトークン本体に使える文字クラス（Unicode letter/number/underscore）。
// バックエンド側の HashtagParser の正規表現と一致している必要がある。
const HASHTAG_BODY = "[\\p{L}\\p{N}_]";

// ハッシュタグトークンの最大文字数。バックエンドの HASHTAG_REGEX と揃える。
const HASHTAG_MAX_LENGTH = 50;

// 1 投稿あたりのタグ数上限。バックエンドの UserBookConstants::MAX_TAGS と揃える。
export const MAX_HASHTAGS = 5;

const HASHTAG_REGEX = new RegExp(
  `#(${HASHTAG_BODY}{1,${HASHTAG_MAX_LENGTH}})`,
  "gu",
);

const HASHTAG_BODY_REGEX = new RegExp(HASHTAG_BODY, "u");

export type HashtagTrigger = {
  query: string;
  start: number;
  end: number;
};

/**
 * 本文からハッシュタグを抽出する。
 * バックエンドの HashtagParser.extract と同じ抽出結果を返すよう、
 * 重複を uniq で取り除く。
 * @param content - 本文
 * @returns 抽出されたタグ名の配列（先頭の # を除いた文字列・重複除去済み）
 */
export const extractHashtags = (content: string): string[] => {
  const matches = content.matchAll(HASHTAG_REGEX);
  const tags: string[] = [];
  for (const m of matches) {
    const name = m[1];
    if (!tags.includes(name)) tags.push(name);
  }
  return tags;
};

/**
 * キャレット直前にあるハッシュタグトークンを検出する。
 * キャレット位置から左に走査し、
 *   - 同一トークン範囲の直前に HASHTAG_BODY 以外（空白・句読点・行頭）が来ている
 *   - その次の文字が `#`
 *   - `#` からキャレットまでのすべての文字が HASHTAG_BODY に合致する
 *   - トークン長が 0〜HASHTAG_MAX_LENGTH
 * を満たした場合のみトリガーとして返す。
 * @param text - テキスト全体
 * @param caret - 現在のキャレット位置（selectionStart）
 * @returns マッチした場合は { query, start, end }、なければ null
 */
export const detectHashtagTrigger = (
  text: string,
  caret: number,
): HashtagTrigger | null => {
  if (caret < 0 || caret > text.length) return null;

  // キャレット直前から左に向かって HASHTAG_BODY を遡る
  let i = caret;
  while (i > 0 && HASHTAG_BODY_REGEX.test(text[i - 1])) {
    i -= 1;
  }

  // 走査停止位置の直前が "#" でなければトリガーなし
  if (i === 0 || text[i - 1] !== "#") return null;

  // `#` の直前が HASHTAG_BODY / `#` だった場合は「単語途中の #」「連続する #」なので除外。
  // 例: "abc#def"（単語途中）や "##foo"（連続）はトリガーしない。
  const hashIndex = i - 1;
  if (hashIndex > 0) {
    const prev = text[hashIndex - 1];
    if (prev === "#" || HASHTAG_BODY_REGEX.test(prev)) return null;
  }

  const query = text.slice(i, caret);
  if (query.length > HASHTAG_MAX_LENGTH) return null;

  return { query, start: hashIndex, end: caret };
};

/**
 * キャレット位置のハッシュタグトークンを、指定したタグ名で置換する。
 * 置換後は末尾に半角スペースを挿入して次の入力を促す。
 * @param text - テキスト全体
 * @param trigger - detectHashtagTrigger の戻り値
 * @param tagName - サジェストから選ばれたタグ名（先頭の # は含まない）
 * @returns 置換後テキストと新しいキャレット位置
 */
export const replaceHashtagToken = (
  text: string,
  trigger: HashtagTrigger,
  tagName: string,
): { text: string; caret: number } => {
  const before = text.slice(0, trigger.start);
  const after = text.slice(trigger.end);
  const inserted = `#${tagName} `;
  const nextText = `${before}${inserted}${after}`;
  const nextCaret = trigger.start + inserted.length;
  return { text: nextText, caret: nextCaret };
};
