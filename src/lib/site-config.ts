export const siteConfig = {
  name: "Tử Vi Việt Nam",
  description:
    "Khám phá nghệ thuật Tử Vi cổ truyền của người Việt. Nhận luận giải lá số theo ngày giờ sinh, phân tích tử vi và gợi ý cho con đường phía trước.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tuvi-project.com",
  ogImage: "/og-image.jpg",
  locale: "vi_VN",
  alternateLocale: "en_US",
  creator: "Nhóm Tử Vi Việt Nam",
  keywords: [
    "tử vi",
    "tu vi",
    "lá số tử vi",
    "xem tử vi",
    "tử vi hàng ngày",
    "luận giải lá số",
    "phân tích tử vi",
    "xem vận mệnh",
    "tử vi 12 cung",
    "phong thủy",
  ],
  links: {
    github: "https://github.com/tuvi-project",
  },
} as const;

export type SiteConfig = typeof siteConfig;
