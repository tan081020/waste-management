import { NewsItem } from "@/public/types/new";
import Image from "next/image";

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const news: NewsItem[] = await fetch(
    `https://news-api-next-js-kappa.vercel.app/api/news`
  ).then((res) => res.json());
  return news.map((item) => ({
    id: String(item?._id),
  }));
}

const NewsDetailspage = async ({ params }: { params: { id: string } }) => {
  const post = await fetch(
    `https://news-api-next-js-kappa.vercel.app/api/news/${params.id}`
  ).then((res) => res.json());

  if (!post) {
    return <div>News is Not Found!</div>;
  }
  return (
    <section className="py-12">
      <article className="max-w-4xl mx-auto p-6 shadow-md border rounded-lg">
        {post?.imageUrl && (
          <div>
            <Image
              src={post?.imageUrl}
              alt={post?.title}
              width={800}
              height={450}
              className="rounded-md object-cover"
            />
          </div>
        )}

        <div className="my-5">
          <h2 className="text-3xl font-bold mb-4">{post?.title}</h2>

          <div className="flex justify-between items-center text-sm mb-4">
            <p>{new Date(post?.published_at).toLocaleDateString()}</p>
            <p>
              Source: <span>{post?.source}</span>
            </p>
          </div>
        </div>

        <div className="mb-4">
          {post?.categories?.map((category: string) => (
            <span
              key={category}
              className="bg-blue-100 text-blue-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Snippet */}
        <p className=" mb-2">{post?.snippet}</p>

        {/* Full Description */}
        <p className=" mb-4">{post?.description}</p>
        <p>Khôi Nguyên</p>
      </article>
    </section>
  );
};

export default NewsDetailspage;