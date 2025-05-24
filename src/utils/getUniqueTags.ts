import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const tagMap = new Map<string, { tagName: string; count: number }>();

  posts
    .filter(postFilter)
    .flatMap(post => post.data.tags)
    .forEach(tagName => {
      const tag = slugifyStr(tagName);
      const entry = tagMap.get(tag);
      if (entry) {
        entry.count += 1;
      } else {
        tagMap.set(tag, { tagName, count: 1 });
      }
    });

  const tags: Tag[] = Array.from(tagMap.entries())
    .map(([tag, { tagName, count }]) => ({ tag, tagName, count }))
    .sort((tagA, tagB) => tagA.tag.localeCompare(tagB.tag));

  return tags;
};

export default getUniqueTags;
