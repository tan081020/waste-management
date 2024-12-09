"use client";
import { createVoucher, getUserByEmail } from "@/utils/db/actions";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Voucher = {
  name: string;
  description: string;
  point: string;
  content: string;
  cardType: string; // Thêm thuộc tính loại thẻ
};

const UploadNews = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [voucher, setVoucher] = useState<Voucher>({
    name: "",
    description: "",
    point: "",
    content: "",
    cardType: "", // Mặc định loại thẻ là rỗng
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const upload = await createVoucher(voucher);

      if (upload) {
        setVoucher({
          name: "",
          description: "",
          point: "",
          content: "",
          cardType: "", // Reset lại cardType
        });
        toast.success("Thành công");
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
    <div
      style={{
        width: "400px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1>Đăng Voucher</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Tên Voucher</label>
          <input
            type="text"
            id="name"
            name="name"
            value={voucher.name}
            onChange={handleOnchange}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label htmlFor="description">Mô Tả</label>
          <input
            type="text"
            id="description"
            name="description"
            value={voucher.description}
            onChange={handleOnchange}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label htmlFor="point">Điểm</label>
          <input
            type="number"
            id="point"
            name="point"
            value={voucher.point}
            onChange={handleOnchange}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label htmlFor="content">Nội Dung</label>
          <textarea
            id="content"
            name="content"
            value={voucher.content}
            onChange={handleOnchangeArea}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
              height: "150px",
            }}
          />
        </div>

        {/* Dropdown chọn loại thẻ */}
        <div>
          <label htmlFor="cardType">Loại Thẻ</label>
          <select
            id="cardType"
            name="cardType"
            value={voucher.cardType}
            onChange={handleOnchangeSelect}
            required
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Chọn loại thẻ</option>
            <option value="Viettel">Viettel</option>
            <option value="Vina">Vina</option>
            <option value="Mobi">Mobi</option>
            <option value="Vietnamobile">Vietnamobile</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
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
