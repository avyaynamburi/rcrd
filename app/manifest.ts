import type { MetadataRoute } from "next";
import { en } from "@/lib/i18n/en";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: en.appName,
    short_name: en.appName,
    description: en.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1E2A4A",
    icons: [192, 512].map((size) => ({
      src: `/icons/icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
      purpose: "any",
    })),
  };
}
