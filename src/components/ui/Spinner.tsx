import styles from "./styles/Spinner.module.css";

type Size = "sm" | "md";

type Props = {
  size?: Size;
  className?: string;
};

const sizeClassMap: Record<Size, string> = {
  sm: styles.sm,
  md: styles.md,
};

export function Spinner({ size = "md", className }: Props) {
  const composed = [
    "fa-solid",
    "fa-spinner",
    "fa-spin",
    sizeClassMap[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <i className={composed} aria-label="読み込み中" role="status" />;
}
