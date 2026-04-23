import { Fragment } from "react";
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
          return (
            <span key={i} className={styles.hashtag}>
              {seg.value}
            </span>
          );
        }
        return <Fragment key={i}>{seg.value}</Fragment>;
      })}
    </div>
  );
}
