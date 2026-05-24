"use client";

import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { MAX_PURCHASE_LINKS, type BookPostFormData } from "@/schemas/book";
import styles from "./styles/PurchaseLinksField.module.css";

type Props = {
  control: Control<BookPostFormData>;
  register: UseFormRegister<BookPostFormData>;
  errors: FieldErrors<BookPostFormData>;
};

export function PurchaseLinksField({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "purchase_links" as never,
  });

  const canAdd = fields.length < MAX_PURCHASE_LINKS;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>購入リンク</span>
        <span className={styles.count}>
          {fields.length}/{MAX_PURCHASE_LINKS}
        </span>
      </div>

      {fields.length > 0 && (
        <ul className={styles.list}>
          {fields.map((field, index) => {
            const itemError = errors.purchase_links?.[index]?.message;
            return (
              <li key={field.id} className={styles.item}>
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://..."
                  className={styles.input}
                  {...register(`purchase_links.${index}` as const)}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={styles.removeButton}
                  aria-label="削除"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
                {itemError && <p className={styles.error}>{itemError}</p>}
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => append("")}
        disabled={!canAdd}
        className={styles.addButton}
      >
        <i className="fa-solid fa-plus" />
        リンクを追加
      </button>

      {errors.purchase_links?.root?.message && (
        <p className={styles.error}>{errors.purchase_links.root.message}</p>
      )}
    </div>
  );
}
