# me
https://devkey.jp/

## Related Posts generator

This project includes a TF‑IDF based utility for generating related posts at build time.

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build the project:

   ```bash
   pnpm build
   ```

### Usage

`getRelatedPosts` can be called from `PostDetails.astro`.

```ts
import { initRelatedPosts, getRelatedPosts } from "@/utils/relatedPosts";

initRelatedPosts(posts); // posts = all published posts
const related = getRelatedPosts(post);
```

The layout renders a list of up to four related posts for each article.

### Performance

On a few hundred posts the TF‑IDF model builds in under a second and queries
are instantaneous. The model is generated once during the build process.
