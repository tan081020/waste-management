
'use client'

import { ArrowRight, Leaf, Recycle,  Coins, MapPin, UsersRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import React, { useEffect, useState } from "react";
import { getAllUser, getAmoutCollect, getPoint } from "@/utils/db/actions";
import { useRouter } from "next/navigation";

const AnimatedGolbe = () => {
  return (
    <div className=" relative h-32 w-32 mx-auto mb-8">
      <div className=" absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse">
        <div className=" absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
        <div className=" absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
        <div className=" absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
        <Leaf className=" absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse"> </Leaf>
      </div>
    </div>
  )
}
export default function Home() {
  const [amountCollect, setAmountCollcet] = useState<number>()
  const [location, setLocation] = useState<number>()
  const [point, setPoint] = useState<number>()
  const [users, setUsers] = useState<number>()
  const router = useRouter()



  const get = async () => {
    const amount = await getAmoutCollect()
    const sum = amount?.reduce((init, amoun) => {
      const amount = parseFloat(amoun.amount)
      return init + amount
    }, 0)
    const point = await getPoint()
    const sumPoint = point?.reduce((init, amoun) => {
      const point = parseFloat(amoun.point as any)
      return init + point
    }, 0)
    const amountUser = await getAllUser()

    setAmountCollcet(sum)
    setLocation(amount?.length)
    setPoint(sumPoint)
    setUsers(amountUser?.length)
  }
  useEffect(() => {
    try {
      get()
    } catch (error) {

    }
  }, [])
  return (
    <div className=" container mx-auto px-4 py-16">

      <section className=" text-center mb-20 ">
        <AnimatedGolbe></AnimatedGolbe>
        <h1 className=" text-8xl font-bold mb-6 text-gray-800 tracking-tight">
          Quản Lý Rác Thải
          <span className=" text-green-500">Bảo Vệ Môi Trường</span>
        </h1>
        <p className=" text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tham gia với chúng tôi để cùng bảo về môi trường
        </p>
        <Button onClick={()=>router.push('/report')} className=" bg-green-600 hover:bg-green-700 text-white text-lg mt-6 py-6 px-10 rounded-full">
          Bắt Đầu
          <ArrowRight></ArrowRight>
        </Button>
      </section>
      <section className=" grid md:grid-cols-3 gap-10 mb-20">
        <FeatureCard icon={Leaf}
          title="Thân thiện với môi trường"
          description="Chúng tôi cam kết giảm thiểu chất thải và thúc đẩy tính bền vững"></FeatureCard>
        <FeatureCard icon={Coins}
          title="Kiếm phần thưởng"
          description="Bảo vệ môi trường giúp bạn có tiền tiêu vặc"></FeatureCard>
        <FeatureCard icon={UsersRound}
          title="Thúc đẩy cộng đồng"
          description="Vì lí tưởng của Bác Hồ vĩ đại SẲN SÀNG!!"></FeatureCard>
      </section>
      <section className=" bg-white p-10 rounded-3xl shadow-lg mb-20">
        <h2 className=" text-4xl font-bold mb-12 text-center text-gray-800">Ảnh hưởng của chúng tôi</h2>
        <div className=" grid gap-6 md:grid-cols-4">
          <ImpactCard title="Chất thải đã thu thập" value={`${amountCollect} kg`} icon={Recycle}></ImpactCard>
          <ImpactCard title="Địa điểm đã dọn" value={location as number} icon={MapPin}></ImpactCard>
          <ImpactCard title="Điểm thưởng" value={point as number} icon={Coins}></ImpactCard>
          <ImpactCard title="Thành viên đã tham gia" value={users as number} icon={Users}></ImpactCard>

        </div>
      </section>
     
    </div>

  );
}


function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className=" bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className=" bg-green-100 p-4 rounded-full mb-6">
        <Icon className=" h-8 w-8 text-green-600"></Icon>
      </div>
      <h3 className=" text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className=" text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function ImpactCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className=" p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className=" h-10 w-10 text-green-500 mb-4"></Icon>
      <p className=" text-3xl font-bold text-gray-800 mb-3">{value}</p>
      <p className=" text-sm text-gray-600">{title}</p>
    </div>
  )
}