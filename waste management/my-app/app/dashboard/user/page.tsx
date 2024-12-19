"use client";

import ChangeUserRole from '@/components/ui/user/ChangeUser';
import { deleteUser, getAllUser } from '@/utils/db/actions';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type allUsers = {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  role: string;
  date: string;
};

const Page = () => {
  const [allUsers, setAllUsers] = useState<allUsers[]>([]);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);
  const [email, setEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(10); // Số dòng trên mỗi trang

  const handleClose = () => {
    setOpenUpdateUser(false);
  };

  const getAllUsers = async () => {
    const getUser = await getAllUser();
    setAllUsers(getUser as allUsers[]);
  };

  const handleDeleteUser = async (email: string) => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
    if (!isConfirmed) return;

    try {
      // const deleteResult = await deleteUser(email);
      // if (deleteResult) {
      //   toast.success('Xóa người dùng thành công');
      //   setAllUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      // } else {
      //   toast.error('Xóa người dùng thất bại');
      // }
      toast.error(' xóa người dùng thất bạibại')
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      toast.error('Đã xảy ra lỗi');
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  // Xác định các mục cần hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm chuyển sang trang tiếp theo
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Tính tổng số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="bg-white pb-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4 animate-textChange">Quản lý người dùng</h1>
      <table className="w-full table-auto shadow-md rounded-lg">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Sr.</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Create Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user, i) => (
            <tr key={i} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">{indexOfFirstItem + i + 1}</td>
              <td className="px-4 py-2">{user?.name}</td>
              <td className="px-4 py-2">{user?.email}</td>
              <td className="px-4 py-2">{user?.role}</td>
              <td className="px-4 py-2">{user?.date}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-green-200 text-green-800 px-4 py-2 rounded-full hover:bg-green-500 hover:text-white transition duration-300 ease-in-out mr-2"
                  onClick={() => {
                    setEmail(user?.email);
                    setOpenUpdateUser(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-200 text-red-800 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
                  onClick={() => handleDeleteUser(user.email)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      {openUpdateUser && (
        <ChangeUserRole email={email} onclose={handleClose} onfuc={getAllUsers} />
      )}
    </div>
  );
};

export default Page;
