"use client";

import { useAuthStore } from "@/store/authStore";
import { useBookPostSearch } from "@/hooks/books/useBookPostSearch";
import { useBookPostForm } from "@/hooks/books/useBookPostForm";
import { useHashtagComposer } from "@/hooks/books/useHashtagComposer";
import { extractHashtags, MAX_HASHTAGS } from "@/lib/hashtag";
import { TagSuggestList } from "./TagSuggestList";
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

  const {
    register,
    control,
    setValue,
    onSubmit,
    errors,
    isSubmitting,
    content,
  } = useBookPostForm(selectedBook);

  const {
    textareaRef,
    textareaProps,
    isOpen,
    query,
    suggestions,
    isLoading: isSuggestLoading,
    activeIndex,
    setActiveIndex,
    selectSuggestion,
  } = useHashtagComposer(control, setValue);

  const tagCount = extractHashtags(content ?? "").length;
  const tagCountClass =
    tagCount > MAX_HASHTAGS
      ? styles.tagCountError
      : tagCount === MAX_HASHTAGS
        ? styles.tagCountWarn
        : "";

  const { ref: contentRef, ...contentRest } = register("content");

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
                  <span className={tagCountClass}>
                    タグ {tagCount}/{MAX_HASHTAGS}
                  </span>
                  {" ・ "}
                  {content?.length ?? 0}/1000
                </span>
              </div>
              <textarea
                id="content"
                {...contentRest}
                ref={(node) => {
                  contentRef(node);
                  textareaRef.current = node;
                }}
                className={styles.textarea}
                placeholder="読んだ感想を書いてください（#でタグ付け）"
                rows={5}
                {...textareaProps}
              />
              {isOpen && (
                <TagSuggestList
                  query={query}
                  suggestions={suggestions}
                  isLoading={isSuggestLoading}
                  activeIndex={activeIndex}
                  onHover={setActiveIndex}
                  onSelect={selectSuggestion}
                />
              )}
              <p className={styles.tagHint}>
                本文中に「#タグ名」と書くとタグ付けされます（最大{MAX_HASHTAGS}
                個）
              </p>
              {errors.content && (
                <p className={styles.error}>{errors.content.message}</p>
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
