"use client";

import { getPointById } from '@/utils/db/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

const Page = () => {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<Rewards[]>([]);

  const result: { [userId: number]: Result } = {};

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
    } else {
      result[userId].totalAmount -= amount;
    }
  });

  // Chuyển kết quả thành mảng và sắp xếp theo tổng điểm giảm dần
  const output: Result[] = Object.values(result).sort((a, b) => b.totalAmount - a.totalAmount);

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
    <div className="container">
      <table className="user-table">
        <thead>
          <tr className="header-row">
            <th>Sr.</th>
            <th>Name</th>
            <th>Tổng điểm</th>
            <th>Hành động</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {output.map((user, i) => {
            return (
              <tr key={user.userId} className="table-row">
                <td>{i + 1}</td>
                <td>{user.name}</td>
                <td>{user.totalAmount}</td>
                <td>
                  <button
                    onClick={() => {
                      router.push(`/dashboard/reward/${user.userId}`);
                    }}
                    className="view-button"
                  >
                    Xem lịch sử điểm thưởng
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          font-family: 'Arial', sans-serif;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .header-row {
          background-color: #2e8b57; /* Màu xanh lá cây đậm */
          color: white;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
        }

        .header-row th {
          padding: 12px 18px;
        }

        .table-row {
          border-bottom: 1px solid #f1f1f1;
        }

        .table-row td {
          padding: 12px 18px;
          color: #34495e;
        }

        .table-row:hover {
          background-color: #f1f8f2; /* Màu nền nhẹ khi hover */
        }

        .view-button {
          padding: 8px 16px;
          background-color: #28a745; /* Màu xanh lá cây */
          color: white;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .view-button:hover {
          background-color: #218838; /* Màu xanh lá cây đậm hơn khi hover */
        }

        .view-button:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Page;
