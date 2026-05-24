"use client";

import Link from "next/link";
import { useProfileForm } from "@/hooks/profile/useProfileForm";
import { AvatarUploader } from "./AvatarUploader";
import type { Me } from "@/types/user";
import styles from "./styles/ProfileEditor.module.css";

type Props = {
  me: Me;
};

export function ProfileEditor({ me }: Props) {
  const {
    register,
    errors,
    isSubmitting,
    fields,
    onSubmit,
    handleCancel,
    handleAddLink,
    handleRemoveLink,
  } = useProfileForm(me);

  return (
    <div className={styles.page}>
      <Link href={`/users/${me.username}`} className={styles.backLink}>
        <i className="fa-solid fa-chevron-left" />
        本棚に戻る
      </Link>

      <h1 className={styles.pageTitle}>プロフィール編集</h1>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>アバター画像</span>
        <AvatarUploader
          username={me.username}
          nickname={me.nickname}
          avatarUrl={me.avatar_url}
        />
        <p className={styles.helperText}>JPEG / PNG / WebP、最大 5MB</p>
      </section>

      <form onSubmit={onSubmit} noValidate>
        <div className={styles.section}>
          <label htmlFor="nickname" className={styles.sectionLabel}>
            ニックネーム
          </label>
          <input
            id="nickname"
            type="text"
            className={styles.input}
            {...register("nickname")}
          />
          {errors.nickname && (
            <p className={styles.error}>{errors.nickname.message}</p>
          )}
        </div>

        <div className={styles.section}>
          <label htmlFor="bio" className={styles.sectionLabel}>
            自己紹介
          </label>
          <textarea
            id="bio"
            className={styles.textarea}
            placeholder="自己紹介を入力"
            {...register("bio")}
          />
          {errors.bio && <p className={styles.error}>{errors.bio.message}</p>}
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>リンク</span>
          <div className={styles.linkList}>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.linkRow}>
                <input
                  type="url"
                  className={styles.input}
                  placeholder="https://example.com"
                  {...register(`links.${index}.url` as const)}
                />
                <button
                  type="button"
                  className={styles.removeLinkButton}
                  onClick={() => handleRemoveLink(index)}
                  aria-label="削除"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>
          {errors.links && Array.isArray(errors.links)
            ? errors.links.map((linkError, index) =>
                linkError?.url ? (
                  <p key={index} className={styles.error}>
                    {linkError.url.message}
                  </p>
                ) : null,
              )
            : null}
          <button
            type="button"
            className={styles.addLinkButton}
            onClick={handleAddLink}
          >
            <i className="fa-solid fa-plus" /> リンクを追加
          </button>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "変更を保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
