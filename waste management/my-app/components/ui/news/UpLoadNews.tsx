"use client"
import { createNews, getUserByEmail } from "@/utils/db/actions";
import { Loader, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type News = {
  id: number
  description: string
  content: string
  author: string
  imageUrl: string

}
const UploadNews = () => {
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState('') as any
  const [preview, setPreview] = useState<string | null>(null)
  const [news, setNews] = useState<Array<News>>([])
  const [newNews, setNewNews] = useState({
    description: '',
    content: '',
    author: '',


  })
  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setNewNews(pre => ({
      ...pre,
      [name]: value
    }))
  }
  const handleOnchangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target
    setNewNews(pre => ({
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const upLoadNews = (await createNews(user.id, newNews?.description, newNews?.content, newNews?.author, preview || undefined)) as any
      if (upLoadNews) {

        const formattedNew = {
          id: upLoadNews?.id,
          description: upLoadNews?.description,
          content: upLoadNews?.content,
          author: upLoadNews?.author,
          imageUrl: preview
        } as any
        setNews([formattedNew, ...news]);
        setNewNews({ description: "", content: "", author: "" })
        setPreview(null)
        setFile(null)
        toast.success('Thành Công')
      }
      else {
        toast.error('Thất Bại')
      }
    } catch (error) {
      console.error('loi ', error);
      toast.error("Bạn thử lại xem sao")
    } finally {
      setIsSubmitting(false)
    }
  }


  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem("userEmail")
      if (email) {
        const user = await getUserByEmail(email)
        setUser(user)


      } else {
        router.push("/")
      }


    }
    checkUser()
  }, [router])


  return (
    <div style={{ width: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h1>Đăng Tin Tức</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="description">Tiêu Đề:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={newNews.description}
            onChange={handleOnchange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label htmlFor="author">Tác Giả:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={newNews.author}
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
            value={newNews.content}
            onChange={handleOnchangeArea}

            required
            style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px', border: '1px solid #ccc', height: '150px' }}
          />
        </div>


        <label htmlFor="image" className="block text-lg font-medium text-gray-700 mb-2">
          Upload Waste Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
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

        <div>
          <button
            type="submit"
            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px', display: 'flex',alignItems: 'center',justifyContent: 'center', gap: '10px', }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                đang đăng ....
              </>
            ) : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadNews;