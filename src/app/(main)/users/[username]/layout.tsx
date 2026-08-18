type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

/**
 * 本棚ページのレイアウト。
 * modal スロットは Intercepting Routes 用で、本棚からの遷移時のみ中身が入る。
 * 直リンクやリロード時は default.tsx が null を返すため、children 側のフルページが表示される。
 */
export default function UserLayout({ children, modal }: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
