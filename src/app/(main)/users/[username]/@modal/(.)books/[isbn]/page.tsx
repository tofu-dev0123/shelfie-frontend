import { notFound } from "next/navigation";
import axios from "axios";
import { getBookPostDetail } from "@/lib/api/books";
import { BookDetailModal } from "@/components/books/BookDetailModal";
import type { BookPostDetail } from "@/types/book";

type Props = {
  params: Promise<{ username: string; isbn: string }>;
};

export default async function BookDetailModalPage({ params }: Props) {
  const { username, isbn } = await params;

  let post: BookPostDetail;
  try {
    post = await getBookPostDetail(username, isbn);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  return <BookDetailModal post={post} />;
}
