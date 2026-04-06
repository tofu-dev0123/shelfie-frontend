import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import styles from "./styles/MainLayout.module.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </>
  );
}
