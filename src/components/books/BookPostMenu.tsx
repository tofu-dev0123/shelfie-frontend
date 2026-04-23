"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { useMe } from "@/hooks/useMe";
import { useBookPostMenu } from "@/hooks/books/useBookPostMenu";
import { useShareBookUrl } from "@/hooks/books/useShareBookUrl";
import { useShareToX } from "@/hooks/books/useShareToX";
import styles from "./styles/BookPostMenu.module.css";

type Props = {
  authorUsername: string;
  bookTitle: string;
  isbn: string;
};

export function BookPostMenu({ authorUsername, bookTitle, isbn }: Props) {
  const { open, wrapRef, toggle, close } = useBookPostMenu();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { data: me } = useMe(isSignedIn);
  const { copy } = useShareBookUrl();
  const { share } = useShareToX(bookTitle);

  const isMine = isSignedIn && me?.username === authorUsername;

  const handleEdit = () => {
    close();
    router.push(`/books/${isbn}/edit`);
  };

  const handleCopy = async () => {
    close();
    await copy();
  };

  const handleShareX = () => {
    close();
    share();
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.triggerBtn}
        aria-label="メニュー"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {isMine && (
            <button
              type="button"
              role="menuitem"
              className={styles.item}
              onClick={handleEdit}
            >
              <span className={styles.icon} aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </span>
              編集
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={handleCopy}
          >
            <span className={styles.icon} aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </span>
            共有（URLコピー）
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={handleShareX}
          >
            <span className={styles.icon} aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </span>
            Xへ共有
          </button>
        </div>
      )}
    </div>
  );
}
