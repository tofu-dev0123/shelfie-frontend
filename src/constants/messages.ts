export const MESSAGES = {
  AUTH: {
    LOGIN_ERROR:
      "ログインに失敗しました。しばらく経ってから再度お試しください。",
    LOGIN_AUTH_ERROR: "認証に失敗しました。再度お試しください。",
    SIGNUP_ERROR: "サインアップに失敗しました",
    SIGNUP_SERVER_ERROR:
      "サインアップに失敗しました。しばらく経ってから再度お試しください。",
    SIGNUP_VALIDATION_ERROR: "入力内容に誤りがあります。ご確認ください。",
    LOGOUT_ERROR: "ログアウトに失敗しました",
  },
  USER: {
    FOLLOW_SUCCESS: "フォローしました",
    FOLLOW_ERROR: "フォローに失敗しました",
    UNFOLLOW_SUCCESS: "フォローを外しました",
    UNFOLLOW_ERROR: "フォローを外すのに失敗しました",
    UPDATE_SUCCESS: "プロフィールを更新しました",
    UPDATE_ERROR: "プロフィールの更新に失敗しました",
    AVATAR_UPLOAD_SUCCESS: "アバターを更新しました",
    AVATAR_UPLOAD_ERROR: "アバターのアップロードに失敗しました",
    AVATAR_DELETE_SUCCESS: "アバターを削除しました",
    AVATAR_DELETE_ERROR: "アバターの削除に失敗しました",
    AVATAR_TYPE_ERROR: "JPEG / PNG / WebP の画像をアップロードしてください",
    AVATAR_SIZE_ERROR: "ファイルサイズは 5MB 以下にしてください",
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
    WANT_TO_READ_SUCCESS: "読みたいリストに追加しました",
    WANT_TO_READ_ERROR: "読みたいリストへの追加に失敗しました",
    WANT_TO_READ_ALREADY_ADDED: "すでに読みたいリストに追加済みです",
    WANT_TO_READ_LOGIN_REQUIRED:
      "読みたいリストに追加するにはログインが必要です",
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
