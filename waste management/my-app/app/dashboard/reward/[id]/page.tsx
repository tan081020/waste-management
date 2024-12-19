"use client";

import ChangeUserRole from '@/components/ui/user/ChangeUser';
import { deleteUser, getAllUser, getHistoryRewards } from '@/utils/db/actions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type HistoryReward = {

  name: string;
  description: string;
  amount: number;

  date: Date;
};

const Page = () => {
  const [historyReward, setHistoryReward] = useState<HistoryReward[]>([]);
  const id = useParams()
  const idstring = id.id.toString()
  useEffect(() => {
    const fetchHistoryReward = async () => {
      try {
        const rewards = await getHistoryRewards(parseInt(idstring))
        setHistoryReward(rewards as [])
      } catch (error) {
        console.error(error);
        
      }
    }
    fetchHistoryReward()
  }, [])

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
    <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center animate-textChange">
      Quản lý lịch sử giao dịch
    </h1>
    
    <div className="overflow-x-auto">
      <table className="w-full table-auto shadow-md rounded-lg border-collapse">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Sr.</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Điểm</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Mô tả</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {historyReward.map((user, i) => (
            <tr key={i} className="bg-gray-50 hover:bg-gray-100">
              <td className="px-6 py-3 text-sm">{i + 1}</td>
              <td className="px-6 py-3 text-sm">{user?.name}</td>
              <td className="px-6 py-3 text-sm">{user?.amount}</td>
              <td className="px-6 py-3 text-sm truncate">{user?.description}</td>
              <td className="px-6 py-3 text-sm">{new Date(user?.date).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default Page;
