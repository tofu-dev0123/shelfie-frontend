"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useHeader } from "@/hooks/useHeader";
import { useMe } from "@/hooks/useMe";
import styles from "./styles/Header.module.css";

export function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { dropdownOpen, dropdownRef, toggleDropdown, handleLogout } =
    useHeader();
  const { data: me } = useMe(!!isSignedIn);

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
          href="/"
          className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
        >
          <i className="fa-solid fa-house" />
          ホーム
        </Link>
        <Link
          href="/search"
          className={`${styles.navLink} ${pathname.startsWith("/search") ? styles.active : ""}`}
        >
          <i className="fa-solid fa-magnifying-glass" />
          探す
        </Link>
        <Link href="/me/books/new" className={styles.postButton}>
          <i className="fa-solid fa-plus" />
          投稿
        </Link>
        {isSignedIn ? (
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
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  ログアウト
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.loginButton}>
            ログイン
          </Link>
        )}
      </nav>
    </header>
  );
}
