export const SITE = {
  website: "https://devkey.jp/", // replace this with your deployed domain
  author: "Sat Naing",
  profile: "https://devkey.jp/",
  desc: "engineer blog.",
  title: "DEVKEY",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    url: "https://devkey.jp/temp",
    text: "Suggest Changes",
    appendFilePath: true,
  },
  dynamicOgImage: true,
} as const;
