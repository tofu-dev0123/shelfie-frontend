"use client";

import { useFollow } from "@/hooks/useFollow";
import styles from "./styles/FollowButton.module.css";

type Props = {
  username: string;
  initialIsFollowing: boolean;
};

export function FollowButton({ username, initialIsFollowing }: Props) {
  const { isFollowing, isPending, handleFollow } = useFollow(
    username,
    initialIsFollowing,
  );

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
