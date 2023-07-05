import Link from "next/link";
import fs from "fs";
import ReactionsWidget from "@/components/ReactionsWidget";

export default async function Blog({ params }: { params: { slug: string } }) {
  const Post = await import(`@/app/blog/posts/${params.slug}.mdx`);

  return (
    <>
      <main className="narrow">
        <Link href="/blog">&larr; Back to Blog</Link>
        <div className="post">
          <p className="metadata">
            {Post.meta.tags.map((t) => (
              <Link href={`/blog/tag/${t}`} key={t}>
                {t}
              </Link>
            ))}{" "}
            &middot; {Post.meta.date}
          </p>
          <div id="content">
            <h2>{Post.meta.title}</h2>
            <p>
              <i>{Post.meta.description}</i>
            </p>
            <Post.default />
          </div>
        </div>
      </main>
      <ReactionsWidget
        domSelector="#content"
        bordered="0"
        layout="vertical"
        position="left"
        prompt=""
      />
    </>
  );
}

export function generateStaticParams() {
  const postsDirectory = "app/blog/posts";
  const postFilenames = fs.readdirSync(postsDirectory, { withFileTypes: true });
  const paths = postFilenames
    .filter((f) => f.isFile())
    .map((f) => ({ slug: f.name.split(".mdx")[0] }));
  return paths;
}
