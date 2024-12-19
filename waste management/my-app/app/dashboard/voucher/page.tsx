"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UpLoadVoucher from "@/components/ui/UpLoadVoucher";
import { deleteVoucherById, getUserVoucher } from "@/utils/db/actions";

// Định nghĩa kiểu dữ liệu Voucher
type Voucher = {
  id: number;
  name: string | null;
  nameVoucher: string;
  description: string;
  content: string;
  point: number;
  createAt: Date;
  status: "not_used" | "used";
};

const Page = () => {
  const router = useRouter();
  const [allVoucher, setAllVoucher] = useState<Voucher[]>([]);
  const [showUpload, setShowUpload] = useState<boolean>(false);

  // Hàm xóa voucher
  const handleDeleteVoucher = async (id: number) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa voucher này không?");
    if (!isConfirmed) {
      return;
    }

    try {
      const deleteResult = await deleteVoucherById(id);
      if (deleteResult) {
        toast.success("Xóa voucher thành công");
        setAllVoucher((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== id));
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      toast.error("Đã xảy ra lỗi");
    }
  };
  const fetchAllVouchers = async () => {
    try {
      const vouchers = await getUserVoucher();
      setAllVoucher(vouchers as Voucher[]);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Không thể lấy danh sách voucher");
    }
  }
  useEffect(() => {


    fetchAllVouchers();
  }, []);

  // Inline CSS cho hiệu ứng ellipsis
  const ellipsisStyle: React.CSSProperties = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px", // Điều chỉnh độ dài của ô
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Quản lý Voucher
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto shadow-md rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Sr.</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Mô tả</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Nội dung</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Điểm</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Tên người sở hữu</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Ngày tạo</th>
                <th className="px-6 py-3 text-center text-sm font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {allVoucher.map((voucher, i) => (
                <tr key={voucher.id} className="bg-gray-50 border-b">
                  <td className="px-6 py-3 text-sm">{i + 1}</td>
                  <td className="px-6 py-3 text-sm truncate" style={{ maxWidth: '200px' }}>
                    {voucher.nameVoucher}
                  </td>

                  {/* Mô tả với ellipsis */}
                  <td className="px-6 py-3 text-sm truncate" style={{ maxWidth: '200px' }}>
                    {voucher.description}
                  </td>

                  {/* Nội dung với ellipsis */}
                  <td className="px-6 py-3 text-sm truncate" style={{ maxWidth: '250px' }}>
                    {voucher.content}
                  </td>

                  {/* Điểm với ellipsis */}
                  <td className="px-6 py-3 text-sm truncate" style={{ maxWidth: '100px' }}>
                    {voucher.point}
                  </td>

                  {/* Tên người sở hữu với ellipsis */}
                  <td className="px-6 py-3 text-sm truncate" style={{ maxWidth: '200px' }}>
                    {voucher.name === null ? "Chưa có ai sử dụng" : voucher.name}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-3 text-sm truncate">
                    {voucher.status === "not_used" ? "Chưa sử dụng" : "Đã sử dụng"}
                  </td>

                  <td className="px-6 py-3 text-sm">{new Date(voucher.createAt).toDateString()}</td>

                  <td className="px-4 py-2 flex">
                    <button
                      className="bg-green-200 text-green-800 px-4 py-2 rounded-full hover:bg-green-500 hover:text-white transition duration-300 ease-in-out mr-2"
                      onClick={() => router.push(`/dashboard/voucher/${voucher.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-200 text-red-800 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteVoucher(voucher.id);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>




      <div className="text-center my-6">
        <button
          onClick={() => setShowUpload((prev) => !prev)}
          className="bg-green-500 text-white py-2 px-6 text-lg font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
        >
          {showUpload ? "Đóng" : "Thêm voucher"}
        </button>

        {showUpload && (
          <div className="mt-6">
            <UpLoadVoucher />
          </div>
        )}
      </div>

    </div>
  );
};

export default Page;
