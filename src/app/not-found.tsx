import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Không Tìm Thấy Trang",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Không tìm thấy trang
      </h1>
      <p className="mt-4 text-center text-zinc-600 dark:text-zinc-400">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Quay Về Trang Chủ
      </Link>
    </section>
  );
}
