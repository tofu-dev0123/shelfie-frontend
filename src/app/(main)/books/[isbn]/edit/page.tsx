import { BookEditContent } from "@/components/books/BookEditContent";

type Props = {
  params: Promise<{ isbn: string }>;
};

export default async function BookEditPage({ params }: Props) {
  const { isbn } = await params;
  return <BookEditContent isbn={isbn} />;
}
