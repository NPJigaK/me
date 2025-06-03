import type { CollectionEntry } from "astro:content";
import { TfIdf, TokenizerJa } from "natural";
import { getPath } from "./getPath";

export interface RelatedPost {
  slug: string;
  title: string;
  score: number;
}

const tfidf = new TfIdf();
// TokenizerJa uses TinySegmenter under the hood for Japanese text
// This works reasonably well for both Japanese and English text.
tfidf.tokenizer = new TokenizerJa();

let built = false;
let cache: CollectionEntry<"blog">[] = [];

function buildText(post: CollectionEntry<"blog">): string {
  const { title, description, tags, category } = post.data;
  return [title, description, category, ...(tags ?? []), post.body].join(" ");
}

export function initRelatedPosts(posts: CollectionEntry<"blog">[]) {
  if (built) return;
  cache = posts;
  posts.forEach(p => {
    tfidf.addDocument(buildText(p), p.id);
  });
  built = true;
}

export function getRelatedPosts(
  target: CollectionEntry<"blog">,
  limit = 4
): RelatedPost[] {
  if (!built) {
    throw new Error("initRelatedPosts must be called first");
  }
  const docText = buildText(target);
  const scores: { post: CollectionEntry<"blog">; score: number }[] = [];
  tfidf.tfidfs(docText, (i, measure) => {
    scores.push({ post: cache[i], score: measure });
  });
  return scores
    .filter(r => r.post.id !== target.id)
    .sort((a, b) => {
      if (b.score === a.score) {
        return (
          new Date(b.post.data.pubDatetime).getTime() -
          new Date(a.post.data.pubDatetime).getTime()
        );
      }
      return b.score - a.score;
    })
    .slice(0, limit)
    .map(r => ({
      slug: getPath(r.post.id, r.post.filePath, false),
      title: r.post.data.title,
      score: r.score,
    }));
}
