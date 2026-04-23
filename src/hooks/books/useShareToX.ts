"use client";

/**
 * Xの投稿画面を新規タブで開くフック。
 * 本のタイトルと現在のページURLをプリフィルする。
 * @returns share - Xの投稿画面を新規タブで開くハンドラー
 */
export const useShareToX = (bookTitle: string) => {
  const share = () => {
    const params = new URLSearchParams({
      text: bookTitle,
      url: window.location.href,
    });
    const intentUrl = `https://twitter.com/intent/post?${params.toString()}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  };
  return { share };
};
