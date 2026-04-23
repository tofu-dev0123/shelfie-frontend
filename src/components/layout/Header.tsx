"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";
import { useHeader } from "@/hooks/layout/useHeader";
import { useMe } from "@/hooks/useMe";
import styles from "./styles/Header.module.css";

export function Header() {
  const pathname = usePathname();
  const { isSignedIn, isInitializing } = useAuth();
  const { dropdownOpen, dropdownRef, toggleDropdown } = useHeader();
  const handleLogout = useLogout();
  const { data: me } = useMe(isSignedIn);

  // 未ログイン時は /login、ログイン済みで me 未解決時は / に飛ばし SSR リダイレクトに委ねる
  const shelfHref = !isSignedIn ? "/login" : me ? `/users/${me.username}` : "/";
  const isShelfActive = !!me && pathname.startsWith(`/users/${me.username}`);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/images/shelfie-text-logo.png"
          alt="Shelfie"
          width={120}
          height={32}
          className={styles.logoImage}
        />
      </Link>
      <nav className={styles.nav}>
        <Link
          href={shelfHref}
          className={`${styles.navLink} ${isShelfActive ? styles.active : ""}`}
        >
          <i className="fa-solid fa-book-open" />
          本棚
        </Link>
        <Link
          href="/feed"
          className={`${styles.navLink} ${pathname.startsWith("/feed") ? styles.active : ""}`}
        >
          <i className="fa-solid fa-rss" />
          フィード
        </Link>
        <Link
          href="/search"
          className={`${styles.navLink} ${pathname.startsWith("/search") ? styles.active : ""}`}
        >
          <i className="fa-solid fa-magnifying-glass" />
          探す
        </Link>
        <Link
          href="/books/new"
          className={`${styles.navLink} ${pathname === "/books/new" ? styles.active : ""}`}
          aria-current={pathname === "/books/new" ? "page" : undefined}
        >
          <i className="fa-solid fa-plus" />
          投稿
        </Link>
        {!isInitializing &&
          (isSignedIn ? (
            <div ref={dropdownRef} className={styles.avatarWrapper}>
              <button
                className={styles.avatar}
                onClick={toggleDropdown}
                aria-label="メニューを開く"
              >
                <i className="fa-solid fa-user" />
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  {me && (
                    <div className={styles.dropdownUser}>
                      <span className={styles.dropdownNickname}>
                        {me.nickname}
                      </span>
                      <span className={styles.dropdownUsername}>
                        @{me.username}
                      </span>
                    </div>
                  )}
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              ログイン
            </Link>
          ))}
      </nav>
    </header>
  );
}
