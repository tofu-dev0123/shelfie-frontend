"use client";

import { useRef } from "react";
import { useAvatarUpload } from "@/hooks/profile/useAvatarUpload";
import styles from "./styles/AvatarUploader.module.css";

type Props = {
  username: string;
  nickname: string;
  avatarUrl: string | null;
};

export function AvatarUploader({ username, nickname, avatarUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, handleUpload, handleDelete } = useAvatarUpload(username);

  const onSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleUpload(file);
    // 同一ファイルを連続で選んでも change が発火するようリセット
    event.target.value = "";
  };

  const onClickChange = () => inputRef.current?.click();

  return (
    <div className={styles.block}>
      <div className={styles.avatar}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={nickname} className={styles.avatarImage} />
        ) : (
          <i className={`fa-solid fa-user ${styles.avatarIcon}`} />
        )}
      </div>

      <div className={styles.actions}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onSelect}
          className={styles.fileInput}
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          className={styles.changeButton}
          onClick={onClickChange}
          disabled={isUploading}
        >
          <i className="fa-solid fa-camera" />
          {isUploading ? "アップロード中..." : "画像を変更"}
        </button>
        {avatarUrl ? (
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleDelete}
            disabled={isUploading}
          >
            画像を削除
          </button>
        ) : null}
      </div>
    </div>
  );
}
