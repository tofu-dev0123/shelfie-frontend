/**
 * textarea 内のキャレット位置の座標を、要素の content-box 原点（paddingを含む位置）からの
 * 相対座標として返すユーティリティ。
 *
 * 実装手法は mirror-div と呼ばれる古典的な技法：
 *   1. textarea と同じフォント・パディング・ボーダー・折返し設定を持つ非表示の div を作る
 *   2. div の中にキャレット位置までのテキスト + マーカー span を入れる
 *   3. マーカー span の offsetTop / offsetLeft を測定する
 *
 * スクロール量は含めない。呼び出し側で必要に応じて引き算する。
 */

// textarea からコピーする CSS プロパティ。text レイアウトに影響するものをすべて拾う。
const COPIED_PROPERTIES = [
  "direction",
  "boxSizing",
  "width",
  "height",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "fontSizeAdjust",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
] as const;

export type CaretCoordinates = {
  top: number;
  left: number;
  height: number;
};

/**
 * textarea 内のキャレット位置の座標を測定する。
 * @param element - 対象の textarea
 * @param caret - 測定対象のインデックス（selectionStart 相当）
 * @param value - textarea の内容（省略時は element.value を使用）
 * @returns content-box 原点からのオフセット。測定できない環境では null
 */
export const getCaretCoordinates = (
  element: HTMLTextAreaElement,
  caret: number,
  value: string = element.value,
): CaretCoordinates | null => {
  if (typeof document === "undefined") return null;

  const computed = window.getComputedStyle(element);

  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.left = "-9999px";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";

  for (const prop of COPIED_PROPERTIES) {
    div.style.setProperty(prop, computed.getPropertyValue(prop));
  }

  div.textContent = value.substring(0, caret);

  const span = document.createElement("span");
  // 末尾が改行の場合でも高さを確保するため、非空の文字を必ず含める
  span.textContent = value.substring(caret) || ".";
  div.appendChild(span);

  document.body.appendChild(div);

  const lineHeight =
    parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) || 16;

  const coords: CaretCoordinates = {
    top: span.offsetTop,
    left: span.offsetLeft,
    height: lineHeight,
  };

  document.body.removeChild(div);

  return coords;
};
