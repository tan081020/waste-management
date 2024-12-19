"use client"


import { getNewsById, updateNewsById } from '@/utils/db/actions'
import { Loader, Route, Upload } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
interface News {
  description: string
  content: string;
  author: string;

  imageUrl: string | null;

}
const page = () => {
  const id = useParams()
  const idstring = id.id.toString()
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState('') as any
  const [preview, setPreview] = useState<string | null>(null) as any
  const [news, setNews] = useState<News>({
    description: '',
    content: '',
    author: '',
    imageUrl: '',

  }) as any

 
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setNews((pre:any) => ({
      ...pre,
      [name]: value
    }))
  }
  const handleOnchangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target
    setNews((pre:any) => ({
      ...pre,
      [name]: value
    }))
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  console.log("news1",news);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      console.log('new2',news);
      const newsData ={
        ...news,
        imageUrl:preview
      }
      await updateNewsById(parseInt(idstring),newsData)
      toast.success('thanh cong')
      router.push('/dashboard/news')
    } catch (error) {
      console.error('loi ', error);
      toast.error("ban thu lai sao")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    try {
      const getOneNews = async () => {
        const news = await getNewsById(parseInt(idstring))
        setNews({
          description: news?.description,
          content: news?.content,
          author: news?.author,
          imageUrl: news?.imageUrl
        }) 
        setPreview(news?.imageUrl)
      }
      getOneNews()
    } catch (error) {

    }
  }, [idstring])
  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
    <h1 className="text-2xl font-semibold text-center mb-6">Đăng Tin Tức</h1>
    <form onSubmit={handleSubmit}>
      {/* Tiêu đề */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Tiêu Đề:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={news.description}
          onChange={handleOnchange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>
  
      {/* Tác giả */}
      <div className="mb-4">
        <label htmlFor="author" className="block text-lg font-medium text-gray-700 mb-2">Tác Giả:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={news.author}
          onChange={handleOnchange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>
  
      {/* Nội dung */}
      <div className="mb-4">
        <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">Nội Dung:</label>
        <textarea
          id="content"
          name="content"
          value={news.content}
          onChange={handleOnchangeArea}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 h-40"
        />
      </div>
  
      {/* Upload Image */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-2">Upload Waste Image</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors duration-300">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image"
                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
              >
                <span>Upload a file</span>
                <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {preview && (
          <div className="mt-4 mb-8">
            <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
          </div>
        )}
      </div>
  
      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Đang đăng ...
            </>
          ) : (
            "Chỉnh Sửa"
          )}
        </button>
      </div>
    </form>
  </div>
  
  )
}

export default page
