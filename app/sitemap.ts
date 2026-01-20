import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://go-to-china.com/",
      lastModified,
    },
    {
      url: "https://go-to-china.com/plan",
      lastModified,
    },
    {
      url: "https://go-to-china.com/result",
      lastModified,
    },
  ];
}
