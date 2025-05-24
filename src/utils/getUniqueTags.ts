import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const tagMap: Record<string, Tag> = {};

  posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .forEach(tag => {
      const slug = slugifyStr(tag);
      if (tagMap[slug]) {
        tagMap[slug].count += 1;
      } else {
        tagMap[slug] = { tag: slug, tagName: tag, count: 1 };
      }
    });

  return Object.values(tagMap).sort((a, b) => a.tag.localeCompare(b.tag));
};

export default getUniqueTags;
