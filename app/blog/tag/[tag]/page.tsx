import PostPreview from "@/app/blog/PostPreview";
import fs from "fs";
import Link from "next/link";
import path from "path";

const postsDirectory = path.resolve("app/blog/posts");
const postFilenames = fs.readdirSync(postsDirectory);
const postsPromise = Promise.all(
  postFilenames.map((p) => import(`@/app/blog/posts/${p}`))
);

export default async function Tags({ params }: { params: { tag: string } }) {
  const posts = await postsPromise;
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
            <Link
              key={t}
              href={`/blog/tag/${t}`}
              className={params.tag === t ? "active" : ""}
            >
              {t}
            </Link>
          ))}
        </span>
      </div>
      <div className="postsPreviewWrapper">
        {posts
          .filter((p) => p.meta.tags.includes(params.tag))
          .map((p, i) => (
            <PostPreview {...p.meta} key={i} />
          ))}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await postsPromise;
  const tags = [...new Set(posts.map((p) => p.meta.tags).flat())];
  const paths = tags.map((t) => ({ tag: t }));
  return paths;
}
