"use client";
import NewsList from "@/components/ui/news/NewList";
import { getAllNews } from "@/utils/db/actions";
import { useEffect, useState } from "react";
import { NewsItem } from "@/public/types/new";

const Newspage = () => {
  const [news, setNews] = useState<NewsItem[] | null>([]) as any;
  
  useEffect(() => {
   
    try {
      const getnews = async () => {
        const data = await getAllNews();

        setNews(data);
      };
      getnews();
    } catch (error) {
      console.error("loi doc news", error);
    }

  }, []);
  return (
    <section className=" container">
      <h2 className="text-2xl font-bold  text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text ">
        Tin Tức Mới Nhất
      </h2>

      
        <NewsList news={news} />
   
    </section>
  );
};

export default Newspage;
