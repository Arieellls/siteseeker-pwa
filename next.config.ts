// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

module.exports = withPWA({
  reactStrictMode: true,
  disable: process.env.NODE_ENV === "development",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // Optional: include the port if it's part of the URL
        pathname: "/runs/detect/**", // Adjust the path based on your images
      },
    ],
  },
});
