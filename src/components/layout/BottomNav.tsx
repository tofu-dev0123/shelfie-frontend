"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useBottomNav } from "@/hooks/layout/useBottomNav";
import { useMe } from "@/hooks/useMe";
import styles from "./styles/BottomNav.module.css";

export function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { accountMenuOpen, accountMenuRef, toggleAccountMenu, handleLogout } =
    useBottomNav();
  const { data: me } = useMe(!!isSignedIn);

  return (
    <nav className={styles.nav}>
      <Link
        href="/"
        className={`${styles.item} ${pathname === "/" ? styles.active : ""}`}
      >
        <i className={`fa-solid fa-house ${styles.icon}`} />
      </Link>
      <Link
        href="/search"
        className={`${styles.item} ${pathname.startsWith("/search") ? styles.active : ""}`}
      >
        <i className={`fa-solid fa-magnifying-glass ${styles.icon}`} />
      </Link>
      <Link href="/me/books/new" className={styles.item}>
        <span className={styles.postIcon}>
          <i className="fa-solid fa-plus" />
        </span>
      </Link>
      <div
        ref={accountMenuRef}
        className={`${styles.item} ${styles.accountWrapper}`}
      >
        <button
          className={`${styles.iconButton} ${pathname.startsWith("/me") ? styles.active : ""}`}
          onClick={toggleAccountMenu}
          aria-label="アカウントメニューを開く"
        >
          <i className={`fa-solid fa-user ${styles.icon}`} />
        </button>
        {accountMenuOpen && (
          <div className={styles.accountMenu}>
            {me && (
              <div className={styles.accountUser}>
                <span className={styles.accountNickname}>{me.nickname}</span>
                <span className={styles.accountUsername}>@{me.username}</span>
              </div>
            )}
            <Link
              href="/me"
              className={styles.accountItem}
              onClick={() => toggleAccountMenu()}
            >
              本棚
            </Link>
            <button className={styles.accountItem} onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
