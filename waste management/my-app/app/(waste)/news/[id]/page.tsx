"use client"

import { NewsItem } from "@/public/types/new";
import { getNewsById } from "@/utils/db/actions";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface News {
  description: string
  content: string;
  author: string;
  imageUrl: string | null;
}

const NewsDetailspage = () => {
  const id = useParams();
  const idstring = id.id.toString();

  const [news, setNews] = useState<News>({
    description: '',
    content: '',
    author: '',
    imageUrl: ''
  }) as any;

  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getNews = async () => {
      try {
        const newsById = await getNewsById(parseInt(idstring));
        setNews({
          description: newsById?.description,
          content: newsById?.content,
          author: newsById?.author,
          imageUrl: newsById?.imageUrl
        });
        setDate(newsById?.createAt.toISOString().split("T")[0] as string)
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false)
      }
    };
    
    getNews();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center col-span-full">
            <Loader className="animate-spin h-16 w-16 text-teal-500" />
          </div>
    )
  }

  return (
    <section className="py-12 bg-gray-50">
  <article className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl">
    {/* Article Header */}
    <div className="my-5">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">{news?.description}</h2>
      <p className="text-sm text-gray-500 mb-8">
        Câu chuyện của <span className="font-medium text-teal-500">{news.author}</span> •
        <span> Ngày đăng: {date}</span>
      </p>
    </div>

    {/* Image Section */}
    {news?.imageUrl && (
      <div className="mb-8  rounded-lg overflow-hidden shadow-md">
        <Image
          src={news?.imageUrl}
          alt={news?.description}
          width={800}
          height={450}
          className="object-cover w-full h-[400px] transition-all duration-300 hover:scale-105"
        />
      </div>
    )}

    {/* Content Section */}
    <p className="text-lg text-gray-700 mb-6 leading-relaxed">{news.content}</p>

    {/* Date and Share Section */}
    <div className="flex justify-between items-center text-sm text-gray-500 mt-8">
      <div className="flex space-x-3">
        <button className="text-teal-500 hover:text-teal-600 transition-colors duration-300 flex items-center space-x-2">
          <i className="fas fa-share-alt text-base"></i>
          <span>Chia sẻ</span>
        </button>
        <button className="text-teal-500 hover:text-teal-600 transition-colors duration-300 flex items-center space-x-2">
          <i className="fas fa-bookmark text-base"></i>
          <span>Lưu</span>
        </button>
      </div>
    </div>
  </article>
</section>

  );
};

export default NewsDetailspage;
