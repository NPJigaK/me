/* eslint-disable no-console */
import { pipeline } from "@xenova/transformers";
import fg from 'fast-glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import strip from 'strip-markdown';

const BLOG_DIR = path.join('src', 'data', 'blog');

function isJapanese(text) {
  return /[\u3040-\u30FF\u4E00-\u9FFF]/.test(text);
}

function cosine(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

async function toText(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(strip)
    .process(markdown);
  return String(file).replace(/\s+/g, ' ').trim();
}

async function main() {
  const files = await fg(`${BLOG_DIR}/**/[^_]*.{md,mdx}`);
  const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', {
    quantized: true,
  });
  const posts = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || path.parse(file).name;
    const text = await toText(content);
    const embedding = await extractor(text, { pooling: 'mean', normalize: true });
    posts.push({ slug, embedding: embedding.data, lang: isJapanese(text) ? 'ja' : 'en' });
  }

  const result = {};
  for (const post of posts) {
    const others = posts.filter(p => p.slug !== post.slug && p.lang === post.lang);
    const scores = others
      .map(o => ({ slug: o.slug, score: cosine(post.embedding, o.embedding) }))
      .filter(x => x.score >= 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(x => x.slug);
    result[post.slug] = scores;
  }

  await mkdir('src/generated', { recursive: true });
  await writeFile('src/generated/related.json', JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
