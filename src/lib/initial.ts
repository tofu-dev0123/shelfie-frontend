/**
 * ニックネームの頭文字1文字を返す。アバター代わりの円形プレースホルダーに表示する。
 * 絵文字などサロゲートペアで表現される文字が割れないよう、コードポイント単位で切り出す。
 * @param name - ニックネーム
 * @returns 頭文字1文字（空文字・空白のみの場合は "?"）
 */
export const initialOf = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return [...trimmed][0].toUpperCase();
};
