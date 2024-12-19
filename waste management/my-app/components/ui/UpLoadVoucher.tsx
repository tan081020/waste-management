"use client";
import { createVoucher, getUserByEmail } from "@/utils/db/actions";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import cryptoRandomString from 'crypto-random-string';

type Voucher = {
  name: string;
  description: string;
  point: number;
  content: string;
  type: string; // Thêm thuộc tính loại thẻ
  cardCode:string
};

const UploadNews = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [voucher, setVoucher] = useState<Voucher>({
    name: "",
    description: "",
    point:0,
    content: "",
    type: "", // Mặc định loại thẻ là rỗng
    cardCode:''
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnchangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnchangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setVoucher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

// Tạo chuỗi ngẫu nhiên dài 7 ký tự với chữ cái và số
const randomString = cryptoRandomString({ length: 7, type: 'alphanumeric' });


console.log(voucher);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
     const data = {
      ...voucher,
       cardCode:randomString
     }
      const upload = await createVoucher(data);

      if (upload) {
        setVoucher({
          name: "",
          description: "",
          point:0,
          content: "",
          type: "", 
          cardCode:''

        })
        toast.success("Thành công")

      } else {
        toast.error("Thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra. Bạn thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        const user = await getUserByEmail(email);
        setUser(user);
      } else {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-lg">
    <h1 className="text-2xl font-semibold text-center mb-6">Đăng Voucher</h1>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên Voucher</label>
        <input
          type="text"
          id="name"
          name="name"
          value={voucher.name}
          onChange={handleOnchange}
          required
          className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô Tả</label>
        <input
          type="text"
          id="description"
          name="description"
          value={voucher.description}
          onChange={handleOnchange}
          required
          className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="point" className="block text-sm font-medium text-gray-700">Điểm</label>
        <input
          type="number"
          id="point"
          name="point"
          value={voucher.point}
          onChange={handleOnchange}
          required
          className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội Dung</label>
        <textarea
          id="content"
          name="content"
          value={voucher.content}
          onChange={handleOnchangeArea}
          required
          className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 h-40"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Loại Thẻ</label>
        <select
          id="type"
          name="type"
          value={voucher.type}
          onChange={handleOnchangeSelect}
          required
          className="w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Chọn nhà cung cấp</option>
          <option value="shopee">Shopee</option>
          <option value="lazada">Lazada</option>
        </select>
      </div>
  
      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold disabled:opacity-50 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Đang đăng ...
            </>
          ) : (
            "Đăng bài"
          )}
        </button>
      </div>
    </form>
  </div>
  
  );
};

export default UploadNews;
