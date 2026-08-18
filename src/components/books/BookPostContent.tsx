"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/auth/useAuth";
import { useBookPostSearch } from "@/hooks/books/useBookPostSearch";
import { useBookPostForm } from "@/hooks/books/useBookPostForm";
import { BookFormSkeleton } from "./BookFormSkeleton";
import styles from "./styles/BookPostContent.module.css";

export function BookPostContent() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const {
    keyword,
    setKeyword,
    books,
    isLoading: isSearchLoading,
    isEmpty,
    debouncedKeyword,
    selectedBook,
    selectBook,
    clearBook,
    isInitializing,
  } = useBookPostSearch(isSignedIn);

  const { register, onSubmit, errors, isSubmitting, content } =
    useBookPostForm(selectedBook);

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

        {isInitializing ? (
          <BookFormSkeleton />
        ) : !selectedBook ? (
          <>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="投稿する本のタイトルを検索"
              className={styles.searchInput}
              autoFocus
            />
            {isSearchLoading && (
              <div className={styles.searchLoading}>
                <Spinner />
              </div>
            )}
            {isEmpty && (
              <p className={styles.emptyText}>
                「{debouncedKeyword}」に一致する本が見つかりませんでした
              </p>
            )}
            {books.length > 0 && (
              <div className={styles.results}>
                <p className={styles.resultsLabel}>検索結果</p>
                <ul className={styles.resultList}>
                  {books.map((book) => (
                    <li
                      key={book.isbn}
                      className={styles.resultItem}
                      onClick={() => selectBook(book)}
                    >
                      <div className={styles.bookCover}>
                        {book.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.thumbnail_url}
                            alt={book.title}
                            className={styles.bookCoverImage}
                          />
                        ) : (
                          <div className={styles.bookCoverPlaceholder} />
                        )}
                      </div>
                      <div className={styles.bookInfo}>
                        <p className={styles.bookTitle}>{book.title}</p>
                        {book.authors.length > 0 && (
                          <p className={styles.bookAuthor}>
                            {book.authors.join(", ")}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.formCard}>
              <button
                type="button"
                onClick={clearBook}
                className={styles.changeLink}
              >
                変更する
              </button>

              <div className={styles.bookHero}>
                <div className={styles.heroCover}>
                  {selectedBook.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedBook.thumbnail_url}
                      alt={selectedBook.title}
                      className={styles.heroCoverImage}
                    />
                  ) : (
                    <div className={styles.heroCoverPlaceholder} />
                  )}
                </div>
                <div className={styles.bookMeta}>
                  <h2 className={styles.bookTitleLg}>{selectedBook.title}</h2>
                  {selectedBook.authors.length > 0 && (
                    <p className={styles.bookAuthorLg}>
                      {selectedBook.authors.join(", ")}
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
                {isSubmitting ? "投稿中..." : "投稿する"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
