'use client'

import React, { useCallback, useEffect, useState } from "react"


import { MapPin, Upload, Loader, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import { Libraries } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createReport, getRecentReports, getUserByEmail } from "@/utils/db/actions";

const geminiApiKey = process.env.GEMENI_API_KEY as any
const googleMapsApiKey = process.env.GOOGLE_MAP_API_KEY as any

const libraries: Libraries = ['places']

export default function ReportPage() {
    const [user, setUser] = useState('') as any
    const router = useRouter()

    const [reports, setReports] = useState<Array<{
        id: number;
        location: string;
        wasteType: string;
        amount: string;
        createdAt: string;
    }>>([]);
    const [newReports, setNewReports] = useState({
        location: '',
        type: '',
        amount: ''
    })

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'sucess' | 'failure'>('idle')
    const [verificationResult, setVerificationResult] = useState<{
        wasteType: string,
        quantity: string,
        confidence: number,
    } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey!,
        libraries: libraries
    });

   
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewReports({ ...newReports, [name]: value })
    }
    const [location, setLocation] = useState(""); // Giá trị nhập vào
    const [suggestions, setSuggestions] = useState<unknown[]>([]); // Gợi ý địa điểm
    // Hàm tìm kiếm địa điểm
    const handleLocationChange = async (e: { target: { value: any } }) => {
        const inputValue = e.target.value;
        setLocation(inputValue); // gõ input lấy value const api goong map

        if (inputValue.length > 2) {
            try {
                const response = await fetch(
                    `https://rsapi.goong.io/place/autocomplete?input=${inputValue}&api_key=l88dnrSbxbsh0yXbKTs5hz624XJmiersBeZlbLXX`
                );
                if (!response.ok) {
                    throw new Error("Không tìm nạp được đề xuất vị trí");
                }
                const data = await response.json();
                setSuggestions(data.predictions); // Cập nhật gợi ý địa điểm
            } catch (error) {
                console.error("Lỗi khi tìm nạp đề xuất vị trí:", error);
            }
        } else {
            setSuggestions([]); // Xóa gợi ý nếu chuỗi nhập vào quá ngắn
        }
    };

    
    // Hàm chọn gợi ý
    const handleSuggestionClick = (suggestion: {
        description: React.SetStateAction<string>;
    }) => {
        setLocation(suggestion.description); // Cập nhật giá trị ô nhập liệu
        setSuggestions([]); // Xóa gợi ý sau khi chọn
    };

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

    const readFileAsBase = (file: File): Promise<String> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as String)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }
    const handleVerify = async () => {
        if (!file) return
        setVerificationStatus('verifying')
        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey)
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
            const base64Data = await readFileAsBase(file)

            const imageParts = [
                {
                    inlineData: {
                        data: base64Data.split(',')[1],
                        mimeType: file.type
                    }
                }
            ]
            const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
            1. The type of waste (e.g., plastic, paper, glass, metal, organic)
            2. amount (in kg or liters)
            3. Your confidence level in this assessment (as a percentage) 
            No Explanation
            No Approximately

            {
              "wasteType": "type of waste",
              "quantity": " quantity with unit",
              "confidence": confidence level as a number between 0 and 1
            }`


            const result = await model.generateContent([prompt, ...imageParts])
            const responce = await result.response
            const text = responce.text()


            const json = `${text.slice(8, -4)}`

         console.log(json);


            try {
                const parsedResult = JSON.parse(json)
                if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence) {
                    setVerificationResult(parsedResult)
                    setVerificationStatus("sucess")
                    setNewReports({
                        ...newReports,
                        type: parsedResult.wasteType,
                        amount: parsedResult.quantity
                    })
                }
                else {
                    console.error('ival verifition resilt', parsedResult);
                    setVerificationStatus("failure")

                }
            } catch (error) {
                console.error('loi json', error);
                setVerificationStatus("failure")
            }
        } catch (error) {
            console.error('error', error);
            setVerificationStatus("failure")
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (verificationStatus !== "sucess" || !user) {
            toast.error("lam oi dang nhap")
            return
        }
        setIsSubmitting(true)
        try {
            const report = (await createReport(
                user.id,
                location,
                newReports.type,
                newReports.amount,
                preview || undefined,
                verificationResult ? JSON.stringify(verificationResult) : undefined
            )) as any

            const formattedReport = {
                id: report.id,
                location: location,
                wasteType: report.wasteType,
                amount: report.amount,
                createdAt: report.createdAt.toISOString().split('T')[0]
            }
            setReports([formattedReport, ...reports]);
            setNewReports({ location: "", type: "", amount: "" })
            setFile(null)
            setPreview(null)
            setVerificationStatus('idle')
            setVerificationResult(null)

            toast.success('bao cao rac thanh cong')

        } catch (error) {
            console.error('loi ko the bao cao rac', error);
            toast.error("ban thu lai sao")
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const checkUser = async () => {
            const email = localStorage.getItem("userEmail")
            if (email) {
                let user = await getUserByEmail(email)
                setUser(user)

                const recentReports = await getRecentReports() as any
                const formattedReports = recentReports?.map((report: any) => ({
                    ...report,
                    createdAt: report.createdAt.toISOString().split("T")[0]
                }))
                setReports(formattedReports)
            } else {
                router.push("/")
            }


        }
        checkUser()
    }, [router])

    return (
        <div className=" p-8 max-w-4xl mx-auto">
            <h1 className=" text-3xl font-semibold mb-6 text-gray-800">
                bao cao rac
            </h1>
            <form onSubmit={handleSubmit} className=" bg-white p-8 rounded-2xl shadow-lg mb-12">
                <div className="mb-8">
                    <label htmlFor="waste-image" className="block text-lg font-medium text-gray-700 mb-2">
                        Upload Waste Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="waste-image"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="waste-image" name="waste-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                {preview && (
                    <div className="mt-4 mb-8">
                        <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
                    </div>
                )}
                <Button
                    type="button"
                    onClick={handleVerify}
                    className=" w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
                    disabled={!file || verificationStatus === "verifying"}
                >
                    {verificationStatus === "verifying" ? (
                        <>
                            <Loader className=" animate-spin -ml-1 mr-3 h-5 w-5 text-white"> verifying...</Loader>
                        </>
                    ) : "Verify waste"}
                </Button>

                {verificationStatus === "sucess" && verificationResult && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
                        <div className="flex items-center">
                            <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Waste Type: {verificationResult.wasteType}</p>
                                    <p>Quantity: {verificationResult.quantity}</p>
                                    <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
                <div>
                        <label
                            htmlFor="location"
                            className=" block text-sm font-medium text-gray-700 mb-1"
                        >
                            Vị trí
                        </label>


                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={handleLocationChange} //hiển thị giá trị input
                            placeholder="Enter waste location"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        />

                        {suggestions.length > 0 && (
                            <ul
                                style={{
                                    listStyleType: "none",
                                    padding: 0,
                                    margin: 0,
                                    border: "1px solid #ccc",
                                    maxHeight: "150px",
                                    overflowY: "auto",
                                }}
                            >
                                {suggestions.map((suggestion: any) => (
                                    <li
                                        key={suggestion.place_id}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        style={{
                                            padding: "10px",
                                            cursor: "pointer",
                                            backgroundColor: "#fff",
                                            borderBottom: "1px solid #eee",
                                        }}
                                    >
                                        {suggestion.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={newReports.type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
                            placeholder="Verified waste type"
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Estimated Amount</label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            value={newReports.amount}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
                            placeholder="Verified amount"
                            readOnly
                        />
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Submitting...
                        </>
                    ) : 'Submit Report'}
                </Button>
            </form>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recent Reports</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                                        {report.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.wasteType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}