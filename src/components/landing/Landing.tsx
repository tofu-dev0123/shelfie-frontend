import Link from "next/link";
import { BookshelfVisual } from "./BookshelfVisual";
import styles from "./styles/Landing.module.css";

export function Landing() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            読み終えた本で、
            <br />
            <span className={styles.accent}>自分の本棚</span>を作ろう。
          </h1>
          <p className={styles.heroLead}>
            Shelfie は、読了した本を 1
            冊ずつ投稿して、あなただけの本棚を育てていく読書記録サービスです。
            他の人の本棚を覗けば、次に読みたい 1 冊に出会えます。
          </p>
          <div className={styles.heroCta}>
            {/* 新規・既存の判定は Rails のコールバックが行うため、導線は /login に一本化する */}
            <Link
              href="/login"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              無料ではじめる
            </Link>
            <Link
              href="/login"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              ログイン
            </Link>
          </div>
          <p className={styles.heroSub}>
            Google / GitHub アカウントで登録できます
          </p>
        </div>
        <div className={styles.heroVisual}>
          <BookshelfVisual />
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Shelfie でできること</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <i className="fa-solid fa-bookmark" aria-hidden="true" />
            </div>
            <h3 className={styles.featureTitle}>読了した本を記録</h3>
            <p className={styles.featureDesc}>
              読み終えた瞬間を逃さず、感想と一緒に 1
              冊ずつ残せます。読書の軌跡がいつでも振り返れる形で積み上がります。
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <i className="fa-solid fa-book-open" aria-hidden="true" />
            </div>
            <h3 className={styles.featureTitle}>自分だけの本棚を公開</h3>
            <p className={styles.featureDesc}>
              投稿を重ねるほど、あなたの読書の世界観が本棚として見えてきます。好きなタイミングでシェアできます。
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <i className="fa-solid fa-users" aria-hidden="true" />
            </div>
            <h3 className={styles.featureTitle}>誰かの本棚を覗く</h3>
            <p className={styles.featureDesc}>
              自分では手に取らなかったであろう本との出会いが、本棚にはあります。次の
              1 冊との縁が広がります。
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaBottom}>
        <div>
          <h3 className={styles.ctaTitle}>さっそく本棚を作ってみよう</h3>
          <p className={styles.ctaDesc}>登録は無料。いつでも退会できます。</p>
        </div>
        <Link href="/login" className={`${styles.btn} ${styles.btnOnDark}`}>
          無料ではじめる
        </Link>
      </section>
    </div>
  );
}
