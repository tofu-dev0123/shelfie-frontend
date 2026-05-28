import type { CSSProperties } from "react";
import styles from "./styles/Skeleton.module.css";

type Radius = "sm" | "md" | "lg" | "xl" | "full";

type Props = {
  width?: number | string;
  height?: number | string;
  radius?: Radius;
  className?: string;
  style?: CSSProperties;
};

const radiusClassMap: Record<Radius, string> = {
  sm: styles.radiusSm,
  md: styles.radiusMd,
  lg: styles.radiusLg,
  xl: styles.radiusXl,
  full: styles.radiusFull,
};

export function Skeleton({
  width,
  height,
  radius = "md",
  className,
  style,
}: Props) {
  const composed = [styles.skeleton, radiusClassMap[radius], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={composed}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}
