import { NewsItem } from "@/public/types/new";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard = ({ item }: NewsCardProps) => {
  return (
    <div
      
      className="flex flex-col border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105 h-full"
    >
      <Link href={`/news/${item.id}`} className="flex-grow">
        <Image
          src={item?.imageUrl}
          alt={item?.description}
          width={500}
          height={500}
          className="mb-4 md:h-56 object-cover rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        />
      </Link>
      <div className="flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-gray-800 hover:text-teal-600 transition-colors duration-300">
          {item?.description.substring(0, 25)}{item?.description.length > 25 && '...'}
        </h2>
        <p className="text-gray-600 mb-4">{item?.content.substring(0, 65)}{item?.content.length > 65 && '...'}</p>
        <Link href={`/news/${item.id}`}>
          <button className="inline-flex items-center px-4 py-2 bg-teal-500 text-white font-semibold text-sm rounded-lg hover:bg-teal-600 transition-colors duration-300">
            Đọc tin tức
          </button>
        </Link>
      </div>
    </div>
  
  );
};

export default NewsCard;