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
    <div>
      <div className='bg-white pb-4'>
        <table
          className='w-full userTable'
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: '20px 0',
            fontSize: '14px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead>
            <tr className='bg-green-500 text-white rounded-t-lg'>
              <th style={{ padding: '12px 20px', textAlign: 'left' }}>Sr.</th>
              <th style={{ padding: '12px 20px', textAlign: 'left' }}>Tác giả</th>
              <th style={{ padding: '12px 20px', textAlign: 'left' }}>Mô tả</th>
              <th style={{ padding: '12px 20px', textAlign: 'left' }}>Nội dung</th>
              <th style={{ padding: '12px 20px', textAlign: 'left' }}>Ngày tạo</th>
              <th style={{ padding: '12px 20px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {allNews.map((news, i) => (
              <tr key={i} style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px 20px' }}>{i + 1}</td>
                <td style={{ padding: '12px 20px' }}>{news?.author}</td>
                <td style={{ padding: '12px 20px' }} style={ellipsisStyle}>{news?.description}</td>
                <td style={{ padding: '12px 20px' }} style={ellipsisStyle}>{news?.content}</td>
                <td style={{ padding: '12px 20px' }}>{new Date(news?.createAt).toDateString()}</td>
                <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                  <button
                    onClick={() => router.push(`/dashboard/news/${news.id}`)}
                    style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteNews(news.id);
                    }}
                    style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button
          onClick={() => setShowUpload((prev) => !prev)}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showUpload ? 'Đóng' : 'Thêm bài viết'}
        </button>
        {showUpload && (
          <div style={{ marginTop: '20px' }}>
            <UploadNews />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
