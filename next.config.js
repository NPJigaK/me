/** @type {import('next').NextConfig} */
const withExportImages = require("next-export-optimize-images");

const nextConfig = {
  output: "export",
  /* config options here */
};

module.exports = withExportImages(nextConfig);
