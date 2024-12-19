"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { User, Trash, BookOpen, Gift, Coins } from "lucide-react"; // Import icons từ lucide-react
import { Leaf } from "lucide-react"; // Import icon lá
import { useRouter } from "next/navigation";
import { getUserByEmail } from "@/utils/db/actions";
type User ={
  id: number;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: string;
  createAt: Date;
}
const SideBarDashboard = () => {
  const router = useRouter();
  const[user,setUser] = useState<User>()
  useEffect(()=>{
    const getUser = async () => {
      try {
        const email = localStorage.getItem("userEmail")

        if(email){

          const fetchUser = await getUserByEmail(email)

          
          setUser(fetchUser)
        }
      } catch (error) {
        
      }
    }
    getUser()
  },[])

  
  return (
    <div>
      <aside className="bg-white min-h-full w-full max-w-[250px] customShadow p-4">
        {/* Thanh header */}
        <div className="h-32 flex justify-center items-center flex-col mb-6">
          <div
            onClick={() => router.push("/dashboard")}
            className="text-3xl cursor-pointer relative flex justify-center font-extrabold text-green-600 transition-colors duration-300 hover:text-green-800"
          >
            Dashboard
            {/* Hiệu ứng AnimatedGolbe */}
            <div className="relative h-10 w-10 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse">
                <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
                <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
                <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
              </div>
              <Leaf className="absolute inset-0 m-auto h-4 w-4 text-green-600 animate-pulse animate-spin-slow" />
            </div>
          </div>



          <p className="capitalize text-lg font-semibold text-gray-800">
            {user?.name}
          </p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        {/* Navigation */}
        <div>
          <nav className="space-y-4">
            <Link
              href="/dashboard/user"
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-slate-100"
            >
              <User className="mr-3 h-5 w-5 text-gray-600" />
              Người dùng
            </Link>
            <Link
              href="/dashboard/waste"
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-slate-100"
            >
              <Trash className="mr-3 h-5 w-5 text-gray-600" />
              Rác thải
            </Link>
            <Link
              href="/dashboard/news"
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-slate-100"
            >
              <BookOpen className="mr-3 h-5 w-5 text-gray-600" />
              Tin tức
            </Link>
            <Link
              href="/dashboard/reward"
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-slate-100"
            >
              <Coins className="mr-3 h-5 w-5 text-gray-600" />
              Điểm thưởng
            </Link>
            <Link
              href="/dashboard/voucher"
              className="flex items-center px-4 py-2 text-gray-700 rounded hover:bg-slate-100"
            >
              <Gift className="mr-3 h-5 w-5 text-gray-600" />
              Voucher
            </Link>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default SideBarDashboard;
