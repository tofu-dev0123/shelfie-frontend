import { getPurchaseLabel } from "@/lib/purchaseLabel";
import styles from "./styles/BookDetailPurchaseLinks.module.css";

type Props = {
  links: string[];
};

export function BookDetailPurchaseLinks({ links }: Props) {
  if (links.length === 0) return null;
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>購入リンク</h2>
      <ul className={styles.list}>
        {links.map((url) => {
          const label = getPurchaseLabel(url);
          return (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.item}
              >
                {label && (
                  <span
                    className={`${styles.label} ${
                      label === "Amazon" ? styles.amazon : styles.rakuten
                    }`}
                  >
                    {label}
                  </span>
                )}
                <span className={styles.url}>{url}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
