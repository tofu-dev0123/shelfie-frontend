import { Fragment } from "react";
import Link from "next/link";
import { linkifyContent } from "@/lib/linkify";
import styles from "./styles/BookDetailBody.module.css";

type Props = {
  content: string | null;
};

export function BookDetailBody({ content }: Props) {
  if (!content) return null;
  const segments = linkifyContent(content);
  return (
    <div className={styles.body}>
      {segments.map((seg, i) => {
        if (seg.type === "url") {
          return (
            <a
              key={i}
              href={seg.value}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {seg.value}
            </a>
          );
        }
        if (seg.type === "hashtag") {
          const tagName = seg.value.slice(1);
          return (
            <Link
              key={i}
              href={`/search?type=tags&q=${encodeURIComponent(tagName)}`}
              className={styles.hashtag}
            >
              {seg.value}
            </Link>
          );
        }
        return <Fragment key={i}>{seg.value}</Fragment>;
      })}
    </div>
  );
}
