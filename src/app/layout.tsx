import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description = "読了した本を投稿して本棚を作成・公開できる読書管理アプリ";
const ogImage = "/images/shelfie-text-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shelfie",
    template: "%s | Shelfie",
  },
  description,
  openGraph: {
    title: "Shelfie",
    description,
    url: "/",
    siteName: "Shelfie",
    images: [
      {
        url: ogImage,
        width: 1801,
        height: 715,
        alt: "Shelfie",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelfie",
    description,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body>
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
