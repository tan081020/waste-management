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
    setVoucher(pre => ({
      ...pre,
      [name]: value
    }))
  }
  const handleOnchangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target
    setVoucher(pre => ({
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
  console.log(voucher);
  
  return (
    <div style={{ width: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
    <h1>Đăng Voucher</h1>
    <form onSubmit={handleSubmit}>

      <div>
        <label htmlFor="name">Tên voucher</label>
        <input
          type="text"
          id="name"
          name="name"
          value={voucher.name}
          onChange={handleOnchange}
          required
          style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label htmlFor="description">Mô tả</label>
        <input
          type="text"
          id="description"
          name="description"
          value={voucher.description}
          onChange={handleOnchange}

          required
          style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div>
        <label htmlFor="point">Điểm</label>
        <input
          type="text"
          id="point"
          name="point"
          value={voucher.point}
          onChange={handleOnchange}

          required
          style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <label htmlFor="content">Nội Dung:</label>
        <textarea
          id="content"
          name="content"
          value={voucher.content}
          onChange={handleOnchangeArea}

          required
          style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc', height: '150px' }}
        />
      </div>



      <div>
        <button
          type="submit"
          style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', display: 'flex',alignItems: 'center',justifyContent: 'center', gap: '10px', }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
               Đang chỉnh sữa ....
            </>
          ) : 'chỉnh sữa'}
        </button>
      </div>
    </form>
  </div>
  )
}

export default page
