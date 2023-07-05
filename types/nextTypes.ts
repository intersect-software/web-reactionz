export type BlogPostMetadata = {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
};

declare module "*.mdx" {
  export const meta: BlogPostMetadata;
}
