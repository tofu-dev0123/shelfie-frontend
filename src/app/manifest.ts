import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Shelfie",
  short_name: "Shelfie",
  description: "読了した本を投稿して本棚を作成・公開できる読書管理アプリ",
  start_url: "/",
  display: "standalone",
  background_color: "#F9FAFB",
  theme_color: "#1E3A5F",
  icons: [
    {
      src: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
});

export default manifest;
