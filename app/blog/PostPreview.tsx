import { BlogPostMetadata } from "@/types/nextTypes";
import Link from "next/link";

export default function PostPreview(props: BlogPostMetadata) {
  return (
    <Link href={`/blog/${props.slug}`} className="preview">
      <p className="metadata">
        {props.tags.join(" | ")} &middot; {props.date}
      </p>
      <h4>{props.title}</h4>
      <p className="desc">{props.description}</p>
    </Link>
  );
}
