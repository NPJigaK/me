import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Category {
  category: string;
  categoryName: string;
  count: number;
}

const getUniqueCategories = (posts: CollectionEntry<"blog">[]) => {
  const categoryMap = new Map<string, { categoryName: string; count: number }>();

  posts
    .filter(postFilter)
    .forEach(post => {
      const categoryName = post.data.category ?? "others";
      const category = slugifyStr(categoryName);
      const entry = categoryMap.get(category);
      if (entry) {
        entry.count += 1;
      } else {
        categoryMap.set(category, { categoryName, count: 1 });
      }
    });

  const categories: Category[] = Array.from(categoryMap.entries())
    .map(([category, { categoryName, count }]) => ({
      category,
      categoryName,
      count,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  return categories;
};

export default getUniqueCategories;
