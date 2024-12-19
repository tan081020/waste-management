"use client";

import { deleteNewsById, getAllNews } from '@/utils/db/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NewsItem } from "@/public/types/new";
import toast from 'react-hot-toast';
import UploadNews from '@/components/ui/news/UpLoadNews';

const Page = () => {
  const router = useRouter();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  const handleDeleteNews = async (id: number) => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa tin tức này không?');
    if (!isConfirmed) {
      return;
    }

    try {
      const deleteResult = await deleteNewsById(id);
      if (deleteResult) {
        toast.success('Xóa thành công');
        setAllNews((prevNews) => prevNews.filter((news) => news.id !== id));
      } else {
        toast.error('Xóa thất bại');
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const news = await getAllNews();
        setAllNews(news as unknown as NewsItem[]);
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Không thể lấy tin tức");
      }
    };

    fetchAllNews();
  }, []);

  // Inline CSS for ellipsis effect
  const ellipsisStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px', // Điều chỉnh độ dài của ô
  };

  return (
    <div className="bg-white pb-4">
    <table className="w-full table-auto border-collapse shadow-md rounded-lg mt-5">
      <thead>
        <tr className="bg-green-500 text-white text-left rounded-t-lg">
          <th className="px-4 py-3">Sr.</th>
          <th className="px-4 py-3">Tác giả</th>
          <th className="px-4 py-3">Mô tả</th>
          <th className="px-4 py-3">Nội dung</th>
          <th className="px-4 py-3">Ngày tạo</th>
          <th className="px-4 py-3 text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {allNews.map((news, i) => (
          <tr key={i} className="bg-gray-50 border-b hover:bg-gray-100">
            <td className="px-4 py-3">{i + 1}</td>
            <td className="px-4 py-3">{news?.author}</td>
            
            {/* Mô tả với ellipsis */}
            <td className="px-4 py-3 truncate" style={{ maxWidth: '200px' }}>{news?.description}</td>
            
            {/* Nội dung với ellipsis */}
            <td className="px-4 py-3 truncate" style={{ maxWidth: '250px' }}>{news?.content}</td>
            
            <td className="px-4 py-3">{new Date(news?.createAt).toDateString()}</td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={() => router.push(`/dashboard/news/${news.id}`)}
                className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Sửa
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteNews(news.id);
                }}
                className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition ml-2"
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="text-center my-5">
    <button
      onClick={() => setShowUpload((prev) => !prev)}
      className="bg-green-500 text-white py-2 px-6 text-lg rounded-lg hover:bg-green-600 transition"
    >
      {showUpload ? "Đóng" : "Thêm bài viết"}
    </button>
    {showUpload && (
      <div className="mt-5">
        <UploadNews />
      </div>
    )}
  </div>
  </div>
  
 
  
  
  );
};

export default Page;
