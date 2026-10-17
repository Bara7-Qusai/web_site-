export const dynamic = "force-static";

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "الكنوز للحلول الزراعية · Al-Kunooz Agricultural Solutions",
    short_name: "Al-Kunooz",
    start_url: "/ar",
    display: "standalone",
    background_color: "#fbfaf6",
    theme_color: "#115230",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
