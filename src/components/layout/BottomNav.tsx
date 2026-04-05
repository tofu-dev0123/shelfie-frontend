"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles/BottomNav.module.css";

export function BottomNav() {
  const pathname = usePathname();

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
      <Link
        href="/me"
        className={`${styles.item} ${pathname.startsWith("/me") ? styles.active : ""}`}
      >
        <i className={`fa-solid fa-user ${styles.icon}`} />
      </Link>
    </nav>
  );
}
