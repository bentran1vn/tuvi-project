import { siteConfig } from "@/lib/site-config";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { TuViForm } from "@/components/tu-vi-form";
import { AdsenseAd } from "@/components/adsense-ad";
import { ShopeeAd } from "@/components/shopee-ad";

const features = [
  {
    icon: "✦",
    title: "Lá Số Tử Vi",
    description:
      "Phân tích chi tiết lá số tử vi dựa trên ngày giờ sinh, giúp bạn hiểu rõ vận mệnh và con đường phía trước.",
  },
  {
    icon: "☰",
    title: "Tử Vi Hàng Ngày",
    description:
      "Cập nhật dự báo tử vi hàng ngày, hàng tuần và hàng tháng giúp bạn chủ động lên kế hoạch.",
  },
  {
    icon: "◎",
    title: "12 Cung Hoàng Đạo",
    description:
      "Tìm hiểu đặc điểm tính cách, tương hợp và dự đoán cho từng cung hoàng đạo.",
  },
  {
    icon: "⬡",
    title: "Phong Thủy",
    description:
      "Lời khuyên phong thủy kết hợp với lá số tử vi để mang lại may mắn và thịnh vượng.",
  },
];

export default function Home() {
  const adsenseClientSlotHomeTop =
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP || "";
  const adsenseClientSlotSidebar =
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Trang chủ", url: siteConfig.url }])}
      />

      {/* Hero + Lập Lá Số Form */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent dark:from-amber-900/10" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-8">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                  Khám Phá Vận Mệnh
                  <span className="block bg-linear-to-r from-amber-600 to-red-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-red-400">
                    Qua Tử Vi Việt Nam
                  </span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                  {siteConfig.description}
                </p>
              </div>

              <TuViForm />

              {/* home-top: ngay dưới form */}
              <div className="mt-6">
                <AdsenseAd slotId={adsenseClientSlotHomeTop} minHeight={240} />
                <div className="mt-4">
                  <ShopeeAd placement="home-top" minHeight={120} />
                </div>
              </div>
            </div>

            {/* sidebar: cột phải trên desktop */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-24">
                <AdsenseAd slotId={adsenseClientSlotSidebar} minHeight={300} />
                <div className="mt-4">
                  <ShopeeAd placement="sidebar" minHeight={120} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="bg-white py-20 dark:bg-zinc-900"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              id="features-heading"
              className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Dịch Vụ Của Chúng Tôi
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Công cụ tử vi toàn diện giúp bạn hiểu rõ bản thân và vận mệnh.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative rounded-2xl border border-zinc-200 p-8 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl dark:bg-indigo-950">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
