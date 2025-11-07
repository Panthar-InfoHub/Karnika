import { siteConfig } from "@/site.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.title}`,
  description: siteConfig.description,
  keywords: [],
  openGraph: {
    title: `${siteConfig.title}`,
    description: siteConfig.description,
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.title}`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <>{/* add sections here - like hero, categories, testimonial etc */}</>;
}
