export type PurchaseLabel = "Amazon" | "楽天ブックス" | null;

/**
 * 購入リンクのURLから表示ラベルを判定する。
 * Amazon・楽天ブックスのドメインのみラベル化し、それ以外は null を返す（URLのみ表示する用途）。
 * @param url - 購入リンクのURL
 * @returns ラベル名、または該当なしなら null
 */
export const getPurchaseLabel = (url: string): PurchaseLabel => {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (host.includes("amazon.")) return "Amazon";
  if (host === "rakuten.co.jp" || host.endsWith(".rakuten.co.jp")) {
    return "楽天ブックス";
  }
  return null;
};
