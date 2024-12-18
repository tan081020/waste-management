"use client"


import { getNewsById, getVoucherById, updateNewsById, updateVoucherById } from '@/utils/db/actions'
import { Loader, Route, Upload } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
type Voucher = {

  name: string
  description: string
  point: number
  content: string

}
const page = () => {
  const id = useParams()
  const idstring = id.id.toString()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voucher, setVoucher] = useState<Voucher>({
    name: '',
    description: '',
    point: 0,
    content: '',
  }) as any

 
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setVoucher((pre:any) => ({
      ...pre,
      [name]: value
    }))
  }
  const handleOnchangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target
    setVoucher((pre:any) => ({
      ...pre,
      [name]: value
    }))
  }
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
    
      await updateVoucherById(parseInt(idstring),voucher)
      toast.success('thanh cong')
      router.push('/dashboard/voucher')
    } catch (error) {
      console.error('loi ', error);
      toast.error("ban thu lai sao")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    try {
      const getOneVoucher = async () => {
        const getVoucher = await getVoucherById(parseInt(idstring))
        
        setVoucher({
          name: getVoucher?.name,
          description: getVoucher?.description,
          point: getVoucher?.point,
          content: getVoucher?.content,
         
        }) 

      }
      getOneVoucher()
    } catch (error) {

    }
  }, [idstring])

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
    <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
      Chỉnh sửa Voucher
    </h1>
    <form onSubmit={handleSubmit}>
  
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Tên voucher</label>
        <input
          type="text"
          id="name"
          name="name"
          value={voucher.name}
          onChange={handleOnchange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <input
          type="text"
          id="description"
          name="description"
          value={voucher.description}
          onChange={handleOnchange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="point" className="block text-sm font-medium text-gray-700 mb-2">Điểm</label>
        <input
          type="text"
          id="point"
          name="point"
          value={voucher.point}
          onChange={handleOnchange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Nội Dung</label>
        <textarea
          id="content"
          name="content"
          value={voucher.content}
          onChange={handleOnchangeArea}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-36"
        />
      </div>
  
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-medium disabled:opacity-50 hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Đang chỉnh sửa ....
            </>
          ) : 'Chỉnh sửa'}
        </button>
      </div>
  
    </form>
  </div>
  
  )
}

export default page
