import PostPreview from "@/app/blog/PostPreview";
import fs from "fs";
import Link from "next/link";
import path from "path";

const postsDirectory = path.resolve("app/blog/posts");
const directoryContents = fs.readdirSync(postsDirectory, {
  withFileTypes: true,
});

export default async function Guides() {
  const posts = await Promise.all(
    directoryContents
      .filter((f) => f.isFile())
      .map((f) => import(`@/app/blog/posts/${f.name}`))
  );

  posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );

  const tags = [...new Set(posts.map((p) => p.meta.tags).flat())];
  return (
    <main>
      <Link href="/blog">
        <h2>Blog</h2>
      </Link>
      <div>
        Tags:{" "}
        <span className="tagsLinks">
          {tags.map((t) => (
            <Link key={t} href={`/blog/tag/${t}`}>
              {t}
            </Link>
          ))}
        </span>
      </div>
      <div className="postsPreviewWrapper">
        {posts.map((p, i) => (
          <PostPreview {...p.meta} key={i} />
        ))}
      </div>
    </main>
  );
}
