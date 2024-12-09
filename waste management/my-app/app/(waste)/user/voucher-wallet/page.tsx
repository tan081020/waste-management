"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { getUserByEmail, getVoucherUser } from "@/utils/db/actions";
import { useRouter } from "next/navigation";

type Voucher = {
  id: number;
  name: string;
  description: string;
  content: string;
  status: "not used" | "used";
  point: number;
  cardType: string; // Loại thẻ: Viettel, Vina, Mobi, v.v.
  value: string; // Giá trị thẻ
  phoneRequired: string; // Số điện thoại cần nộp
};

type Card = {
  id: number;
  title: string;
  details: string;
  reward: string;
  cardType: string; // Loại thẻ: Viettel, Vina, Mobi, v.v.
  value: string; // Giá trị thẻ
  phoneRequired: string; // Số điện thoại cần nộp
};

const NewsCard = () => {
  const [voucherUser, setVoucherUser] = useState<Voucher[]>([]);
  const [id, setId] = useState(0);
  const [showCard, setShowCard] = useState<Card | null>(null); // Trạng thái để hiển thị card mới
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem("userEmail");

      if (email) {
        const user = await getUserByEmail(email);
        const getVoucher = await getVoucherUser(user?.id);
        setVoucherUser(getVoucher as []);
      } else {
        router.push("/");
      }
    };
    checkUser();
  }, []);

  // Hàm để hiển thị card mới khi nhấn nút sử dụng
  const handleUseVoucher = (voucherId: number) => {
    // Tìm voucher từ danh sách voucherUser
    const selectedVoucher = voucherUser.find((voucher) => voucher.id === voucherId);

    if (selectedVoucher) {
      // Tạo dữ liệu card từ voucher được chọn
      const newCard: Card = {
        id: selectedVoucher.id,
        title: `Thẻ quà tặng ${selectedVoucher.id}`,
        details: `Đây là thông tin chi tiết của thẻ quà tặng: ${selectedVoucher.description}`,
        reward: `Giảm giá 50% cho đơn hàng tiếp theo.`, // Bạn có thể thay đổi reward tùy vào voucher
        cardType: selectedVoucher.cardType, // Lấy loại thẻ từ dữ liệu
        value: selectedVoucher.value, // Lấy giá trị thẻ từ dữ liệu
        phoneRequired: selectedVoucher.phoneRequired, // Lấy số điện thoại cần nộp từ dữ liệu
      };

      // Cập nhật state để hiển thị card mới
      setShowCard(newCard);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Hiển thị voucher cards */}
      {voucherUser.map((v, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333" }}>{v.name}</h3>
            <span style={{ fontSize: "1rem", fontWeight: "600", color: "#22c55e" }}>{v.point} Điểm</span>
          </div>
          <p style={{ fontSize: "1rem", color: "#555", marginBottom: "12px" }}>{v.description}</p>
          <p style={{ fontSize: "0.875rem", color: "#777", marginBottom: "20px" }}>{v.content}</p>

          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
              width: "100%",
              transition: "background-color 0.3s ease, transform 0.3s ease",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#16a34a"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#22c55e"}
            onClick={() => handleUseVoucher(v.id)} // Gọi hàm khi nhấn nút sử dụng
          >
            <Gift className="w-4 h-4 mr-2" />
            Sử dụng
          </Button>
        </div>
      ))}

      {/* Hiển thị card mới sau khi nhấn nút Sử dụng */}
      {showCard && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
            marginTop: "20px",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333" }}>{showCard.title}</h3>
          <p style={{ fontSize: "1rem", color: "#555", marginBottom: "12px" }}>{showCard.details}</p>
          <p style={{ fontSize: "1rem", color: "#777", marginBottom: "12px" }}>{showCard.reward}</p>
          <p style={{ fontSize: "1rem", color: "#777", marginBottom: "12px" }}>
            <strong>Loại Thẻ:</strong> {showCard.cardType}
          </p>
          <p style={{ fontSize: "1rem", color: "#777", marginBottom: "12px" }}>
            <strong>Giá Trị:</strong> {showCard.value}
          </p>
          <p style={{ fontSize: "1rem", color: "#777", marginBottom: "12px" }}>
            <strong>Số Điện Thoại Cần Nộp:</strong> {showCard.phoneRequired}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsCard;
