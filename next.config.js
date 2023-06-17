/** @type {import('next').NextConfig} */
const withExportImages = require("next-export-optimize-images");
const nextConfig = withExportImages({
  output: "export",
});

module.exports = nextConfig;
