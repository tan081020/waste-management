"use client"



import { NewsItem } from "@/public/types/new";
import { useState } from "react";

import SearchBar from "./SearchBar";
import NewsCard from "../NewsCard";
import { Loader } from "lucide-react";

const NewsList = ({ news }: { news: NewsItem[] }) => {
  const [searchTerm, setSearchTerm] = useState(""); // state để lưu trữ từ khoá tìm kiếm
  const [category, setCategory] = useState(""); // state để lưu trữ danh mục đã chọn

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };


  // Lọc danh sách tin tức theo từ khoá tìm kiếm và danh mục
  const filteredNews = news.filter((item) => {
    const matchesSearchTerm =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = category ? item.category === category : true; // Kiểm tra danh mục
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-12 mb-5">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.length > 0 ? (
          filteredNews.map((item: NewsItem) => (
            <NewsCard key={item.id} item={item} />
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full">
            <Loader className="animate-spin h-16 w-16 text-teal-500" />
          </div>
        )}
      </div>
    </div>

  );
};

export default NewsList;

