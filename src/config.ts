export const SITE = {
  website: "https://devkey.jp/", // replace this with your deployed domain
  author: "Devkey",
  profile: "https://devkey.jp/about/",
  desc: "engineer blog.",
  title: "DEVKEY",
  ogImage: "devkey-og.jpeg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Suggest Changes",
    url: "not used",
  },
  dynamicOgImage: true,
  lang: "jp", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Tokyo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
