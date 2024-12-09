"use client";

import { useEffect, useState } from "react";
import { getUserReport } from "@/utils/db/actions";

type UserReport = {
  id: number;
  name: string;
  location: string;
  amount: string;
  status: string;
  wasteType: string;
  createAt: Date;
};

export default function ManagementReport() {
  const [userReport, setUserReport] = useState<UserReport[]>([]);
  const [sum, setSum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(10); // Số dòng trên mỗi trang

  useEffect(() => {
    const fetchUserReport = async () => {
      try {
        const user = await getUserReport();
        setUserReport(user as UserReport[]);
        const totalAmount = user?.reduce((init, users) => {
          return init + parseFloat(users.amount);
        }, 0);
        setSum(totalAmount as any);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserReport();
  }, []);

  // Xác định các mục cần hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userReport.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm chuyển sang trang tiếp theo
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Tính tổng số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(userReport.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Báo cáo rác
        </h1>

        <table className="w-full table-auto shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Sr.</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Địa chỉ</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Số lượng</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Loại rác</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Create Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{indexOfFirstItem + i + 1}</td>
                <td className="px-6 py-4 text-sm">{user?.name}</td>
                <td className="px-6 py-4 text-sm">{user?.location}</td>
                <td className="px-6 py-4 text-sm">{user?.amount}</td>
                <td className="px-6 py-4 text-sm">{user?.status}</td>
                <td className="px-6 py-4 text-sm">{user?.wasteType}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(user?.createAt).toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex gap-3">
              {pageNumbers.map((number) => (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`px-5 py-2 text-sm font-semibold rounded-md transition-all ${
                      currentPage === number
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-white text-green-600 border border-green-600 hover:bg-green-100"
                    }`}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Total Amount */}
        <div className="block max-w-sm p-6 bg-green-500 border border-gray-200 rounded-lg shadow-lg mt-6">
          <h5 className="mb-2 text-xl font-bold text-white">Tổng rác Báo cáo</h5>
          <p className="font-normal text-white">{sum} kg</p>
        </div>
      </div>
    </div>
  );
}
