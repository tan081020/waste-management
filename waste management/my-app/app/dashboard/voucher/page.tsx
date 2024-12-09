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
  const [totalVouchers, setTotalVouchers] = useState<number>(0); // State mới để lưu tổng số voucher
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

  useEffect(() => {
    const fetchAllVouchers = async () => {
      try {
        const vouchers = await getUserVoucher();
        setAllVoucher(vouchers as Voucher[]);
        setTotalVouchers(vouchers.length); // Cập nhật tổng số voucher
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        toast.error("Không thể lấy danh sách voucher");
      }
    };

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
    <div>
      <div className="bg-white pb-4">
        {/* Hiển thị tổng số voucher */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Tổng số voucher: {totalVouchers}</h3>
        </div>

        <table
          className="w-full userTable"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "20px 0",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr className="bg-green-500 text-white rounded-t-lg">
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Sr.</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Tên</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Mô tả</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Nội dung</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Điểm</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Tên người sở hữu</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Trạng thái</th>
              <th style={{ padding: "12px 20px", textAlign: "left" }}>Ngày tạo</th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {allVoucher.map((voucher, i) => (
              <tr key={voucher.id} style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px 20px" }}>{i + 1}</td>
                <td style={{ padding: "12px 20px" }}>{voucher.nameVoucher}</td>
                <td style={{ padding: "12px 20px" }} style={ellipsisStyle}>
                  {voucher.description}
                </td>
                <td style={{ padding: "12px 20px" }} style={ellipsisStyle}>
                  {voucher.content}
                </td>
                <td style={{ padding: "12px 20px" }} style={ellipsisStyle}>
                  {voucher.point}
                </td>
                <td style={{ padding: "12px 20px" }} style={ellipsisStyle}>
                  {voucher.name === null ? "Chưa có ai sử dụng" : voucher.name}
                </td>
                <td style={{ padding: "12px 20px" }} style={ellipsisStyle}>
                  {voucher.status === "not_used" ? "Chưa sử dụng" : "Đã sử dụng"}
                </td>
                <td style={{ padding: "12px 20px" }}>{new Date(voucher.createAt).toDateString()}</td>
                <td style={{ padding: "12px 20px", textAlign: "center" }}>
                  <button
                    onClick={() => router.push(`/dashboard/voucher/${voucher.id}`)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteVoucher(voucher.id);
                    }}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
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

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button
          onClick={() => setShowUpload((prev) => !prev)}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showUpload ? "Đóng" : "Thêm voucher"}
        </button>
        {showUpload && (
          <div style={{ marginTop: "20px" }}>
            <UpLoadVoucher />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
