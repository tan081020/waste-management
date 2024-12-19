"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { getUserByEmail, getVoucherUser, updateVoucherById, updateVoucherUsed } from "@/utils/db/actions";
import { useRouter } from "next/navigation";
import VoucherInfor from "@/components/ui/VoucherInfor";

type Voucher = {
  id: number;
  name: string;
  description: string;
  content: string;
  status: "not used" | "used";
  point: number;
  type: string;
  cardCode: string; // Giá trị thẻ

}
type VoucherID = {

  name: string;
  description: string;
  content: string;

  cardCode: string; // Giá trị thẻ

};


const NewsCard = () => {
  const [voucherUser, setVoucherUser] = useState<Voucher[]>([]);
  const [voucherId, setVoucherId] = useState<VoucherID>({
    name: '',
    description: '',
    content: '',
    cardCode: '',
  }) as any

  const [showCard, setShowCard] = useState(false)
  const router = useRouter();

  const checkUser = async () => {
    const email = localStorage.getItem("userEmail");

    if (email) {
      const user = await getUserByEmail(email);
      const getVoucher = await getVoucherUser(user?.id as number);
      setVoucherUser(getVoucher as []);
    } else {
      router.push("/");
    }
  }
  useEffect(() => {
    checkUser();
  }, []);


  const handleUseVoucher = async (Id: number) => {
    setShowCard(!showCard)
    const voucherById = voucherUser.find((voucher) => (voucher.id === Id))
    setVoucherId(voucherById)


  };
  const handleUsed = async (Id: number) => {
    await updateVoucherUsed(Id)
    checkUser()
  };
  return (
    <div className="p-5">
      {/* Kiểm tra nếu voucherUser rỗng và hiển thị thông báo */}
      {voucherUser.length === 0 ? (
        <div className=" text-gray-500 p-6 rounded-lg text-center font-semibold text-2xl md:text-4xl flex justify-center items-center">
          Bạn chưa có voucher
        </div>

      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {/* Hiển thị voucher cards */}
          {voucherUser.map((v, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[400px] mb-5 flex flex-col transition-transform transform hover:translate-y-[-8px] hover:shadow-2xl"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{v.name}</h3>
                <span className="text-lg font-semibold text-teal-500">{v.type}</span>
              </div>
              <p className="text-base text-gray-600 mb-3">{v.description}</p>

              {v.status === "used" ? (
                <div>
                  <p
                    onClick={() => handleUseVoucher(v.id)}
                    className="font-semibold cursor-pointer text-base text-gray-600 mb-3"
                  >
                    Hiện thông tin thẻ
                  </p>

                  <button
                    className="flex justify-center items-center bg-teal-500 text-white py-3 px-6 rounded-lg text-base font-semibold w-full transition-colors transform hover:bg-teal-600 disabled:bg-teal-300"
                    disabled
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Đã sử dụng
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="flex justify-center items-center bg-teal-500 text-white py-3 px-6 rounded-lg text-base font-semibold w-full transition-colors transform hover:bg-teal-600"
                    onClick={() => handleUsed(v.id)}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Sử dụng
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hiển thị thông tin voucher nếu có */}
      {showCard && (
        <VoucherInfor voucher={voucherId} />
      )}
    </div>

  );
};

export default NewsCard;
