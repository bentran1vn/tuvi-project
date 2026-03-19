import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: SeoProps = {}): Metadata {
  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      alternateLocale: siteConfig.alternateLocale,
      url,
      title: title
        ? `${title} | ${siteConfig.name}`
        : siteConfig.name,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: title
        ? `${title} | ${siteConfig.name}`
        : siteConfig.name,
      description,
      images: [imageUrl],
      creator: `@${siteConfig.name.toLowerCase().replace(/\s/g, "")}`,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
