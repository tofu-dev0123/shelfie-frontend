import styles from "./styles/BookDetailTags.module.css";

type Props = {
  tags: string[];
};

export function BookDetailTags({ tags }: Props) {
  if (tags.length === 0) return null;
  return (
    <ul className={styles.list}>
      {tags.map((tag) => (
        <li key={tag} className={styles.chip}>
          #{tag}
        </li>
      ))}
    </ul>
  );
}
