"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
import { useBottomNav } from "@/hooks/layout/useBottomNav";
import { useMe } from "@/hooks/useMe";
import styles from "./styles/BottomNav.module.css";

export function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn, isInitializing } = useAuth();
  const { accountMenuOpen, accountMenuRef, toggleAccountMenu } = useBottomNav();
  const handleLogout = useLogout();
  const { data: me } = useMe(isSignedIn);

  // 未ログイン時は /login、ログイン済みで me 未解決時は / に飛ばし SSR リダイレクトに委ねる
  const shelfHref = !isSignedIn ? "/login" : me ? `/users/${me.username}` : "/";
  const isShelfActive = !!me && pathname.startsWith(`/users/${me.username}`);

  return (
    <nav className={styles.nav}>
      <Link
        href={shelfHref}
        className={`${styles.item} ${isShelfActive ? styles.active : ""}`}
        aria-label="本棚"
      >
        <i className={`fa-solid fa-book-open ${styles.icon}`} />
      </Link>
      <Link
        href="/feed"
        className={`${styles.item} ${pathname.startsWith("/feed") ? styles.active : ""}`}
        aria-label="フィード"
      >
        <i className={`fa-solid fa-rss ${styles.icon}`} />
      </Link>
      <Link
        href="/search"
        className={`${styles.item} ${pathname.startsWith("/search") ? styles.active : ""}`}
        aria-label="探す"
      >
        <i className={`fa-solid fa-magnifying-glass ${styles.icon}`} />
      </Link>
      <Link
        href="/books/new"
        className={`${styles.item} ${pathname === "/books/new" ? styles.active : ""}`}
        aria-current={pathname === "/books/new" ? "page" : undefined}
        aria-label="投稿"
      >
        <i className={`fa-solid fa-plus ${styles.icon}`} />
      </Link>
      {!isInitializing &&
        (isSignedIn ? (
          <div
            ref={accountMenuRef}
            className={`${styles.item} ${styles.accountWrapper}`}
          >
            <button
              className={styles.iconButton}
              onClick={toggleAccountMenu}
              aria-label="アカウントメニューを開く"
            >
              <i className={`fa-solid fa-user ${styles.icon}`} />
            </button>
            {accountMenuOpen && (
              <div className={styles.accountMenu}>
                {me && (
                  <div className={styles.accountUser}>
                    <span className={styles.accountNickname}>
                      {me.nickname}
                    </span>
                    <span className={styles.accountUsername}>
                      @{me.username}
                    </span>
                  </div>
                )}
                {me && (
                  <Link
                    href="/profile"
                    className={styles.accountItem}
                    onClick={toggleAccountMenu}
                  >
                    プロフィール
                  </Link>
                )}
                <button className={styles.accountItem} onClick={handleLogout}>
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.item} aria-label="ログイン">
            <i className={`fa-solid fa-right-to-bracket ${styles.icon}`} />
          </Link>
        ))}
    </nav>
  );
}
