"use client";

import ChangeUserRole from '@/components/ui/ChangeUser';
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
    <div className="bg-white pb-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4 animate-textChange">Quản lý lịch sữ giao dich</h1>
      <table className="w-full table-auto shadow-md rounded-lg">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Sr.</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Điểm</th>
            <th className="px-4 py-2 text-left">mô tả</th>
            <th className="px-4 py-2 text-left">Create Date</th>
          
          </tr>
        </thead>
        <tbody>
          {historyReward.map((user, i) => (
            <tr key={i} className="border-b hover:bg-gray-100">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{user?.name}</td>
              <td className="px-4 py-2">{user?.amount}</td>
              <td className="px-4 py-2">{user?.description}</td>
              <td className="px-4 py-2">{new Date(user?.date).toDateString()}</td>
              <td className="px-4 py-2">
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Page;
