"use client";

import { useFollow } from "@/hooks/users/useFollow";
import styles from "./styles/FollowButton.module.css";

type Props = {
  username: string;
};

export function FollowButton({ username }: Props) {
  const { isFollowing, isPending, handleFollow } = useFollow(username);

  return (
    <button
      className={`${styles.button} ${isFollowing ? styles.following : styles.follow}`}
      onClick={handleFollow}
      disabled={isPending}
    >
      {isFollowing ? "フォロー中" : "フォロー"}
    </button>
  );
}
