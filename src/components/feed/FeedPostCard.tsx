"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import type { FeedItem } from "@/types/feed";
import { parseContent } from "@/lib/parseContent";
import { initialOf } from "@/lib/initial";
import styles from "./styles/FeedPostCard.module.css";

type Props = {
  item: FeedItem;
};

export function FeedPostCard({ item }: Props) {
  const router = useRouter();
  const postedAt = formatRelativeTime(item.created_at);
  const detailHref = `/users/${item.user.username}/books/${item.book.isbn}`;

  const handlePostClick = (event: MouseEvent<HTMLElement>) => {
    // 内側の <a> / <button> がクリックされた場合はそちらに任せる
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;

    // テキスト選択中の誤遷移を防ぐ
    if (window.getSelection()?.toString()) return;

    // middle-click / Cmd+click / Ctrl+click は新タブ
    if (event.button === 1 || event.metaKey || event.ctrlKey) {
      window.open(detailHref, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(detailHref);
  };

  return (
    <article
      className={styles.post}
      onClick={handlePostClick}
      onAuxClick={handlePostClick}
    >
      <header className={styles.postHead}>
        <Link href={`/users/${item.user.username}`} className={styles.user}>
          <span className={styles.avatar} aria-hidden="true">
            {initialOf(item.user.nickname)}
          </span>
          <span className={styles.userMeta}>
            <span className={styles.nickname}>{item.user.nickname}</span>
            <span className={styles.username}>@{item.user.username}</span>
          </span>
        </Link>
        <time className={styles.postedAt} dateTime={item.created_at}>
          {postedAt}
        </time>
      </header>

      <div className={styles.bookBlock}>
        <Link
          href={detailHref}
          className={styles.cover}
          aria-label={item.book.title}
        >
          {item.book.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.book.thumbnail_url}
              alt={item.book.title}
              className={styles.coverImage}
            />
          ) : null}
        </Link>
        <div className={styles.bookInfo}>
          <Link href={detailHref} className={styles.bookTitle}>
            {item.book.title}
          </Link>
          <p className={styles.bookAuthor}>{item.book.authors.join("、")}</p>
        </div>
      </div>

      {item.content ? (
        <p className={styles.comment}>
          {parseContent(item.content).map((part, index) =>
            part.type === "tag" ? (
              <Link
                key={index}
                href={`/search?type=tags&q=${encodeURIComponent(part.tagName)}`}
                className={styles.tagLink}
              >
                {part.value}
              </Link>
            ) : (
              <span key={index}>{part.value}</span>
            ),
          )}
        </p>
      ) : null}
    </article>
  );
}

const formatRelativeTime = (iso: string): string => {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "";
  const diff = Date.now() - target;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "たった今";
  if (diff < hour) return `${Math.floor(diff / minute)}分前`;
  if (diff < day) return `${Math.floor(diff / hour)}時間前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}日前`;

  const d = new Date(iso);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  return `${y}/${m}/${dd}`;
};
