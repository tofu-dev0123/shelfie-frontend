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
  const { isSignedIn } = useAuth();
  const { accountMenuOpen, accountMenuRef, toggleAccountMenu } = useBottomNav();
  const handleLogout = useLogout();
  const { data: me } = useMe(isSignedIn);

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
      <Link
        href="/books/new"
        className={`${styles.item} ${pathname === "/books/new" ? styles.active : ""}`}
        aria-current={pathname === "/books/new" ? "page" : undefined}
      >
        <i className={`fa-solid fa-plus ${styles.icon}`} />
      </Link>
      <div
        ref={accountMenuRef}
        className={`${styles.item} ${styles.accountWrapper}`}
      >
        <button
          className={`${styles.iconButton} ${me && pathname.startsWith(`/users/${me.username}`) ? styles.active : ""}`}
          onClick={toggleAccountMenu}
          aria-label="アカウントメニューを開く"
        >
          <i className={`fa-solid fa-user ${styles.icon}`} />
        </button>
        {accountMenuOpen && (
          <div className={styles.accountMenu}>
            {me && (
              <>
                <div className={styles.accountUser}>
                  <span className={styles.accountNickname}>{me.nickname}</span>
                  <span className={styles.accountUsername}>@{me.username}</span>
                </div>
                <Link
                  href={`/users/${me.username}`}
                  className={styles.accountItem}
                  onClick={() => toggleAccountMenu()}
                >
                  本棚
                </Link>
              </>
            )}
            <button className={styles.accountItem} onClick={handleLogout}>
              ログアウト
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
