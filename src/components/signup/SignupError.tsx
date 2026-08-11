import styles from "./styles/SignupError.module.css";

type Props = {
  onRetry: () => void;
  onGoToLogin: () => void;
};

export function SignupError({ onRetry, onGoToLogin }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.message}>
          サーバーへの接続に失敗しました。
          <br />
          しばらくしてから再試行してください。
        </p>
        <div className={styles.buttons}>
          <button className={styles.retryButton} onClick={onRetry}>
            再試行
          </button>
          <button className={styles.loginButton} onClick={onGoToLogin}>
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
