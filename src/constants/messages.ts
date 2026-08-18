export const MESSAGES = {
  AUTH: {
    SIGNUP_SESSION_EXPIRED:
      "サインアップの有効期限が切れました。もう一度お試しください。",
    SIGNUP_SERVER_ERROR:
      "サインアップに失敗しました。しばらく経ってから再度お試しください。",
    SIGNUP_VALIDATION_ERROR: "入力内容に誤りがあります。ご確認ください。",
    LOGOUT_ERROR: "ログアウトに失敗しました",
  },
  USER: {
    UPDATE_SUCCESS: "プロフィールを更新しました",
    UPDATE_ERROR: "プロフィールの更新に失敗しました",
  },
  BOOK: {
    CREATE_SUCCESS: "投稿しました",
    CREATE_ERROR: "投稿に失敗しました",
    UPDATE_SUCCESS: "更新しました",
    UPDATE_ERROR: "更新に失敗しました",
    DELETE_SUCCESS: "削除しました",
    DELETE_ERROR: "削除に失敗しました",
    SHELF_FETCH_ERROR: "本棚の取得に失敗しました",
    SEARCH_ERROR: "書籍の検索に失敗しました",
    SEARCH_LOGIN_REQUIRED: "書籍の検索にはログインが必要です",
    FETCH_ERROR: "書籍の取得に失敗しました",
  },
  SHARE: {
    COPY_SUCCESS: "URLをコピーしました",
    COPY_ERROR: "URLのコピーに失敗しました",
  },
  COMMON: {
    ERROR: "操作に失敗しました",
    SAVE_SUCCESS: "保存しました",
  },
} as const;

/**
 * OAuth コールバック失敗時に Rails が /login?error=<code> で返すエラーコードと表示文言の対応。
 * クエリパラメータは誰でも書き換えられるため、この辞書に無いコードは表示しない
 * （任意の文言を Shelfie の画面として表示させられるのを防ぐ）。
 * キーはバックエンドの Oauth::CallbackService の定数と一致させること。
 */
export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  cancelled: "ログインをキャンセルしました",
  invalid_state: "セッションの有効期限が切れました。もう一度お試しください",
  provider_error: "認証に失敗しました。時間をおいてお試しください",
  email_unavailable:
    "GitHub のメールアドレスが認証されていません。GitHub 側で認証してからお試しください",
  email_already_registered:
    "このメールアドレスは別の方法で登録済みです。最初に使ったサービスでログインしてください",
};
