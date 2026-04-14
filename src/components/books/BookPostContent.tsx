"use client";

import { useAuthStore } from "@/store/authStore";
import { useBookPostSearch } from "@/hooks/books/useBookPostSearch";
import { useTags } from "@/hooks/books/useTags";
import { useBookPostForm } from "@/hooks/books/useBookPostForm";
import styles from "./styles/BookPostContent.module.css";

export function BookPostContent() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = !!accessToken;

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
  } = useBookPostSearch(isAuthenticated);

  const { tags } = useTags();

  const {
    register,
    onSubmit,
    errors,
    isSubmitting,
    content,
    selectedTags,
    toggleTag,
    tagFilter,
    setTagFilter,
  } = useBookPostForm(selectedBook);

  const filteredTags = tags.filter((tag) => tag.includes(tagFilter));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>本を投稿</h1>

      {/* 書籍選択エリア（未選択時） */}
      {!selectedBook ? (
        <div className={styles.searchSection}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="キーワード"
            className={styles.searchInput}
            autoFocus
          />
          {isSearchLoading && (
            <div className={styles.searchLoading}>
              <i className="fa-solid fa-spinner fa-spin" />
            </div>
          )}
          {isEmpty && (
            <p className={styles.emptyText}>
              「{debouncedKeyword}」に一致する本が見つかりませんでした
            </p>
          )}
          {books.length > 0 && (
            <ul className={styles.searchResultList}>
              {books.map((book) => (
                <li
                  key={book.isbn}
                  className={styles.searchResultItem}
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
          )}
        </div>
      ) : (
        <>
          {/* 書籍選択エリア（選択済み時） */}
          <div className={styles.selectedBook}>
            <div className={styles.selectedBookCover}>
              {selectedBook.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedBook.thumbnail_url}
                  alt={selectedBook.title}
                  className={styles.selectedBookCoverImage}
                />
              ) : (
                <div className={styles.selectedBookCoverPlaceholder} />
              )}
            </div>
            <div className={styles.selectedBookInfo}>
              <p className={styles.selectedBookTitle}>{selectedBook.title}</p>
              {selectedBook.authors.length > 0 && (
                <p className={styles.selectedBookAuthor}>
                  {selectedBook.authors.join(", ")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={clearBook}
              className={styles.changeButton}
            >
              変更する
            </button>
          </div>

          {/* 投稿フォーム */}
          <form onSubmit={onSubmit} className={styles.form}>
            {/* コメント */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
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
                className={styles.textarea}
                placeholder="読んだ感想を書いてください"
                rows={5}
              />
              {errors.content && (
                <p className={styles.error}>{errors.content.message}</p>
              )}
            </div>

            {/* タグ */}
            <div className={styles.field}>
              <label className={styles.label}>タグ</label>

              {/* 選択済みタグバッジ */}
              {selectedTags.length > 0 && (
                <div className={styles.selectedTags}>
                  {selectedTags.map((tag) => (
                    <span key={tag} className={styles.tagBadge}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={styles.tagBadgeRemove}
                        aria-label={`${tag}を外す`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {selectedTags.length >= 5 && (
                <p className={styles.warning}>タグは5個までです</p>
              )}

              {/* タグ絞り込み */}
              <input
                type="text"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="タグを絞り込む..."
                className={styles.tagFilterInput}
              />

              {/* タグチェックボックスリスト */}
              <div className={styles.tagList}>
                {filteredTags.map((tag) => (
                  <label key={tag} className={styles.tagItem}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      disabled={
                        !selectedTags.includes(tag) && selectedTags.length >= 5
                      }
                      className={styles.tagCheckbox}
                    />
                    <span className={styles.tagName}>{tag}</span>
                  </label>
                ))}
              </div>

              {errors.tags && (
                <p className={styles.error}>{errors.tags.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
