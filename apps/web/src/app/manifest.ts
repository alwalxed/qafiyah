import { SITE_NAME } from "@/lib/constants"
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Qaf",
    description: "موقع مفتوح المصدر يُعنى بجمع الشعر العربي وحفظه وتيسير الوصول إليه",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#fafafa",
    dir: "rtl",
    lang: "ar",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/opengraph.png",
        type: "image/png",
        sizes: "1200x630",
        form_factor: "wide",
      },
    ],
    orientation: "portrait",
    categories: ["books", "education", "literature"],
  }
}
