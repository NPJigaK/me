import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import strip from 'strip-markdown';
import { pipeline } from '@xenova/transformers';

const BLOG_DIR = path.resolve('src/data/blog');
const OUTPUT = path.resolve('src/generated/related.json');
const MAX_RELATED = 4;
const THRESHOLD = 0.35;

function detectLang(text) {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text) ? 'ja' : 'en';
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for await (const f of walk(res)) {
        yield f;
      }
    } else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith('_')) {
      yield res;
    }
  }
}

function cosine(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function extract(file) {
  const raw = await fs.readFile(file, 'utf8');
  const { content, data } = matter(raw);
  const processed = await unified().use(remarkParse).use(strip).process(content);
  const text = String(processed);
  const slug = data.slug || path.basename(file, path.extname(file));
  const lang = detectLang(text);
  return { slug, lang, text: `${data.title ?? ''}\n${text}` };
}

async function main() {
  const extractor = await pipeline('feature-extraction', 'Snowflake/snowflake-arctic-embed-m-v2.0');
  const posts = [];
  for await (const file of walk(BLOG_DIR)) {
    const info = await extract(file);
    const emb = await extractor(info.text, { pooling: 'mean', normalize: true });
    posts.push({ ...info, emb });
  }

  const result = {};
  for (const post of posts) {
    const others = posts.filter(p => p.slug !== post.slug && p.lang === post.lang);
    const scores = others.map(o => ({ slug: o.slug, score: cosine(post.emb.data, o.emb.data) }));
    scores.sort((a, b) => b.score - a.score);
    result[post.slug] = scores.filter(s => s.score >= THRESHOLD).slice(0, MAX_RELATED).map(s => s.slug);
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify(result, null, 2));
}

main();
