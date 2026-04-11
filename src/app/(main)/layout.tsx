import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthInitializer } from "@/components/layout/AuthInitializer";
import styles from "./styles/MainLayout.module.css";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      <Header />
      <main className={styles.main}>{children}</main>
      <BottomNav />
    </>
  );
}
