"use client";

import WasteChart from "@/components/ui/waste/waste-chart";
import { getAllNews, getAllUser, getAllVoucher, getCollect, getPoint, getUserByEmail, getUserReport } from "@/utils/db/actions";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState({
    sumUsers: 0,
    sumNews: 0,
    sumCollect: 0,
    sumreport: 0,
    sumPoints: 0,
    sumVoucher: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      router.push("/");
      return;
    }

    try {
      const user2 = await getUserByEmail(email);
      if (user2?.role !== "ADMIN") {
        toast.error("Bạn không có quyền truy cập");
        router.push("/");
        return;
      }

      // Fetch data concurrently using Promise.all for performance
      const [
        user, news, collect, report, voucher, point
      ] = await Promise.all([
        getAllUser(),
        getAllNews(),
        getCollect(),
        getUserReport(),
        getAllVoucher(),
        getPoint(),
      ]) as any

      const sumPoint = point?.reduce((init:number, amoun:any) => {
        const point = parseFloat(amoun.point as any);
        return init + point;
      }, 0);

      setData({
        sumUsers: user.length,
        sumNews: news.length || 0,
        sumCollect: collect?.length || 0,
        sumreport: report?.length || 0,
        sumVoucher: voucher?.length || 0,
        sumPoints: sumPoint || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return   <div className="flex justify-center items-center h-64">
    <Loader className="animate-spin h-8 w-8 text-gray-600" />
  </div>; // You can replace this with a loading spinner or skeleton UI.
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Số Lượng Người Dùng */}
        <div className="block p-6 bg-green-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 h-full">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Người Dùng</h5>
          <p className="font-normal text-white text-xl">{data.sumUsers}</p>
        </div>

        {/* Số Lượng Tin Tức Đã Đăng */}
        <div className="block p-6 bg-yellow-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 h-full">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Tin Tức Đã Đăng</h5>
          <p className="font-normal text-white text-xl">{data.sumNews}</p>
        </div>

        {/* Số Lượng Rác Thải Thu Gom */}
        <div className="block p-6 bg-red-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 h-full">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Rác Thải Thu Gom</h5>
          <p className="font-normal text-white text-xl">{data.sumCollect}</p>
        </div>

        {/* Số Lượng Rác Thải Báo Cáo */}
        <div className="block p-6 bg-blue-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 h-full">
          <h5 className="mb-2 text-2xl font-bold text-white">Số Lượng Rác Thải Báo Cáo</h5>
          <p className="font-normal text-white text-xl">{data.sumreport}</p>
        </div>

        {/* Điểm Thưởng */}
        <div className="block p-6 bg-teal-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 h-full">
          <h5 className="mb-2 text-2xl font-bold text-white">Điểm Thưởng</h5>
          <p className="font-normal text-white text-xl">{data.sumPoints}</p>
        </div>

        {/* Voucher */}
        <div className="block p-6 bg-indigo-500 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 h-full">
          <h5 className="mb-2 text-2xl font-bold text-white">Voucher</h5>
          <p className="font-normal text-white text-xl">{data.sumVoucher}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8">
        <WasteChart />
      </div>
    </div>
  );
};

export default Page;
