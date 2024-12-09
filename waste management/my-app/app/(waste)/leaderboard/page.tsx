'use client'
import { useState, useEffect } from 'react'
import { getAllRewards, getAllUser, getPointById, getUserByEmail } from '@/utils/db/actions'
import { Loader, Award, User, Trophy, Crown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Medal } from 'lucide-react';
type Rewards = {
  userId: number;
  name: string;
  type: string;
  amount: number;
};

type Result = {
  userId: number;
  name: string;
  totalAmount: number;
};

// Hàm tính cấp độ dựa trên điểm số
const calculateLevel = (points: number) => {
  return Math.floor(points / 500) + 1 // Mỗi 500 điểm sẽ lên một cấp
}
type Reward2 = {
  id: number
  userId: number
  points: number
  level: number
  createdAt: Date
  userName: string | null
}

export default function LeaderboardPage() {
  const [allUsers, setAllUsers] = useState<Rewards[]>([]);
  const [loading, setLoading] = useState(false)
  const result: { [userId: number]: Result } = {};
  const [rewards, setRewards] = useState<Reward2[]>([])


  // Tính tổng điểm cho mỗi người dùng
  allUsers.forEach(entry => {
    const { userId, amount, type, name } = entry;

    if (!result[userId]) {
      result[userId] = {
        userId,
        name,
        totalAmount: 0
      };
    }

    if (type.startsWith('earned')) {
      result[userId].totalAmount += amount;
    }
  });

  // Chuyển kết quả thành mảng và sắp xếp theo tổng điểm giảm dần
  const output: Result[] = Object.values(result)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10); // Lấy chỉ 10 người đứng đầu

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const getUSer = await getPointById();
        setAllUsers(getUSer as []);
      } catch (error) {
        console.error("Error :", error);
        toast.error("Failed to fetch user data");
      }
    };
    getAllUsers();
  }, []);

  return (
    <div className="">
      <div className="max-w-3xl mx-auto">
        <Medal className="h-8 w-8 text-yellow-500 mr-2" />
        <h1 className="text-3xl font-semibold mb-6 text-green-600">Bảng xếp hạng </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-gray-600" />
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex justify-between items-center text-white">
                <Trophy className="h-10 w-10 text-yellow-500 " />
                <span className="text-2xl font-bold text-yellow-400">Top Ten</span>
                <Award className="h-10 w-10  text-yellow-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {output.map((reward, index) => (
                    <tr key={reward.userId} >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <Crown className={`h-6 w-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-yellow-600'}`} />
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <User className="h-full w-full rounded-full bg-gray-200 text-gray-500 p-2" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{reward.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-indigo-500 mr-2" />
                          <div className="text-sm font-semibold text-gray-900">{reward.totalAmount.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          Level {calculateLevel(parseInt(reward.totalAmount.toLocaleString()))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
