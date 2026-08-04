"use client";

import { useRouter } from "next/navigation";
import { useBookEditForm } from "@/hooks/books/useBookEditForm";
import { BookFormSkeleton } from "./BookFormSkeleton";
import styles from "./styles/BookPostContent.module.css";

type Props = {
  isbn: string;
};

export function BookEditContent({ isbn }: Props) {
  const router = useRouter();
  const {
    post,
    isLoading,
    error,
    register,
    onSubmit,
    errors,
    isSubmitting,
    content,
  } = useBookEditForm(isbn);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="戻る"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>

        {isLoading || !post ? (
          <BookFormSkeleton />
        ) : error ? (
          <p className={styles.emptyText}>投稿の取得に失敗しました</p>
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.formCard}>
              <div className={styles.bookHero}>
                <div className={styles.heroCover}>
                  {post.book.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.book.thumbnail_url}
                      alt={post.book.title}
                      className={styles.heroCoverImage}
                    />
                  ) : (
                    <div className={styles.heroCoverPlaceholder} />
                  )}
                </div>
                <div className={styles.bookMeta}>
                  <h2 className={styles.bookTitleLg}>{post.book.title}</h2>
                  {post.book.authors.length > 0 && (
                    <p className={styles.bookAuthorLg}>
                      {post.book.authors.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.commentArea}>
                <div className={styles.commentHeader}>
                  <label htmlFor="content" className={styles.label}>
                    コメント
                    <span className={styles.required}>必須</span>
                  </label>
                  <span className={styles.charCount}>
                    {content?.length ?? 0}/1000
                  </span>
                </div>
                <textarea
                  id="content"
                  {...register("content")}
                  rows={5}
                  placeholder="読んだ感想を書いてください"
                  className={styles.textarea}
                />
                {errors.content && (
                  <p className={styles.error}>{errors.content.message}</p>
                )}
              </div>
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? "更新中..." : "更新する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
