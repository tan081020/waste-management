"use client";

import WasteChart from "@/components/ui/waste/waste-chart";
import { getAllNews, getAllUser, getCollect, getUserByEmail, getUserReport } from "@/utils/db/actions";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [sumUsers, setSumUsers] = useState<number>(0);
  const [sumNews, setSumNews] = useState<number>(0);
  const [sumCollect, setsumCollect] = useState<number>(0);
  const [sumreport, setsumreport] = useState<number>(0);
  const [sumPoints, setSumPoints] = useState<number>(0); 
  const [sumVoucher, setSumVoucher] = useState<number>(0); 
  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        const user2 = await getUserByEmail(email);
        if (user2?.role === "ADMIN") {
          try {
            const user = await getAllUser();
            setSumUsers(user.length);

            const news = await getAllNews();
            setSumNews(news ? news.length : 0);
            const collect = await getCollect();
            setsumCollect(collect?.length as 0);
            const report = await getUserReport();
            setsumreport(report?.length as 0);
          } catch (error) {
            console.error(error);
          }
        } else {
          toast.error("Bạn không có quyền truy cập");
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };
    checkUser();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="block p-6 bg-green-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Người Dùng</h5>
          <p className="font-normal text-white">{sumUsers}</p>
        </div>
        <div className="block p-6 bg-yellow-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Tin Tức Đã Đăng</h5>
          <p className="font-normal text-white">{sumNews}</p>
        </div>
        <div className="block p-6 bg-red-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Rác Thải Thu Gom</h5>
          <p className="font-normal text-white">{sumCollect}</p>
        </div>
        <div className="block p-6 bg-blue-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Rác Thải Báo Cáo</h5>
          <p className="font-normal text-white">{sumreport}</p>
        </div>
        <div className="block p-6 bg-teal-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h5 className="mb-2 text-2xl font-bold text-white">Điểm Thưởng</h5>
          <p className="font-normal text-white">{sumPoints}</p>
        </div>
        <div className="block p-6 bg-indigo-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h5 className="mb-2 text-2xl font-bold text-white">Voucher</h5>
          <p className="font-normal text-white">{sumVoucher}</p>
        </div>
      </div>

      <div className="mt-8">
        <WasteChart />
      </div>
    </div>
  );
};

export default Page;
