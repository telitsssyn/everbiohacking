import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Pin the workspace root to this project. Next otherwise infers it from the
  // nearest lockfile up the tree (the home directory), which makes Turbopack build
  // asset identifiers out of the path from there — and that path contains
  // non-ASCII segments it slices at non-char boundaries, panicking the build.
  turbopack: {
    root: __dirname,
  },
  // /articles/* was the pre-protocol URL space. A protocol's whole value is a
  // permanent URL, so the old paths keep their link equity instead of 404ing.
  // Unprefixed /articles/... is left to the next-intl middleware, which adds
  // the visitor's locale first and then lands on the rules below.
  async redirects() {
    return [
      {
        source: "/:locale(en|ru)/articles",
        destination: "/:locale/protocols",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/articles/:path*",
        destination: "/:locale/protocols/:path*",
        permanent: true,
      },
      // Renamed protocols keep their old address working. A protocol lives at
      // one URL for years, so a rename owes the old slug a redirect.
      {
        source: "/ru/protocols/supplements/moy-stek-dobavok-2026",
        destination: "/ru/protocols/supplements/moy-top-dobavok",
        permanent: true,
      },
      {
        source: "/en/protocols/supplements/my-supplement-stack-2026",
        destination: "/en/protocols/supplements/my-top-supplements",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
