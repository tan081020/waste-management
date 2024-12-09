"use client";
import NewsList from "@/components/ui/news/NewList";
import { getAllNews } from "@/utils/db/actions";
import { useEffect, useState } from "react";
import { NewsItem } from "@/public/types/new";
import { Loader } from "lucide-react";

const Newspage = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[] | null>([]) as any;
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    try {
      const getnews = async () => {
        const data = await getAllNews();

        setNews(data);
      };
      getnews();
    } catch (error) {
      console.error("loi doc news", error);
    } finally {
      setLoading(false);
    }
    console.log(news);
  }, []);
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text ">
        Tin Tức Mới Nhất
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <NewsList news={news} />
      )}
    </section>
  );
};

export default Newspage;
