import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import CategoryList from "@/components/CategoryList";
import { getPosts } from "@/lib/posts";

export default function CategoryBlogPage({ posts, categoryName, categories }) {
  return (
    <Layout>
      <h1 className="text-5xl border-b-4 p-5">Posts in ${categoryName}</h1>
      <div className="flex justify-between">
        <div className="w-3/4 mr-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <Post key={index} post={post} />
            ))}
          </div>
        </div>
        <div className="w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join("posts"));

  const categories = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join("posts", filename),
      "utf-8"
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    return frontmatter.category.toLowerCase();
  });

  const paths = categories.map((category) => {
    return {
      params: { category_name: category },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { category_name } }) {
  const files = fs.readdirSync(path.join("posts"));

  const posts = getPosts();

  const categories = posts.map((post) => post.frontmatter.category);

  const uniqueCategories = [...new Set(categories)];

  const categoryPosts = posts.filter(
    (post) => post.frontmatter.category.toLowerCase() === category_name
  );

  return {
    props: {
      posts: categoryPosts,
      categoryName: category_name,
      categories: uniqueCategories,
    },
  };
}
