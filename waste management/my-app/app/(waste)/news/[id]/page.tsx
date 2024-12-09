"use client"

import { NewsItem } from "@/public/types/new";
import { getNewsById } from "@/utils/db/actions";
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
  const id = useParams()
  const idstring = id.id.toString()

  const [news, setNews] = useState<News>({

    description: '',
    content: '',
    author: '',

    imageUrl: ''
  }) as any
  const [date,setDate] = useState('') as any
  useEffect(() => {
    try {
      const getNews = async () => {
        const newsById = await getNewsById(parseInt(idstring))
        setNews({

          description: newsById?.description,
          content: newsById?.content,
          author: newsById?.author,
          imageUrl: newsById?.imageUrl
        })
        setDate(newsById?.createAt.toISOString().split("T")[0])

      }
      getNews()
    } catch (error) {

    }
  }, [id])
 console.log(date);
 

  return (
    <section className="py-12">
      <article className="max-w-4xl mx-auto p-6 shadow-md border rounded-lg">
        {news?.imageUrl && (
          <div>
            <Image
              src={news?.imageUrl}
              alt={news?.description}
              width={800}
              height={450}
              className="rounded-md object-cover"
            />
          </div>
        )}

        <div className="my-5">
          <h2 className="text-3xl font-bold mb-4">{news?.description}</h2>
          <p className=" mb-4">{news.content}</p>
          <p className="mb-4">{news.author}</p>
          <div className="flex justify-between items-center text-sm mb-4">
            <p>Ngày đăng: {date} </p>
           
          </div>
        </div>

        

    
      </article>
    </section>
  );
};

export default NewsDetailspage;