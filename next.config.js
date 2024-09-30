import nextra from 'nextra'

const withNextra = nextra({
  theme: "nextra-theme-blog",
  themeConfig: "./theme.config.js",
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // any configs you need
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withNextra(nextConfig);
