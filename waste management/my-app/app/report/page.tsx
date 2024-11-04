'use client'

import React, { useCallback, useEffect, useState } from "react"

import { MapPin,Upload,Loader,CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import { Libraries } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createReport } from "@/utils/db/actions";

const geminiApiKey = process.env.GEMENI_API_KEY as any
const googleMapsApiKey = process.env.GOOGLE_MAP_API_KEY as any

const libraries : Libraries = ['places']

export default function ReportPage (){
    const [user,setUser] = useState('') as any
    const router = useRouter()

    const [reports , setReports] = useState<Array<{
        id:number;
        location:string;
        wasteType:string;
        amount:string;
        createdAt:string;
    }>
    >([])
    const [newReports,setNewReports] = useState({
        location:'',
        type:'',
        amount:''
    })

    const [file,setFile] = useState<File | null >(null)
    const [preview,setPreview] = useState<String | null>(null)
    const [verificationStatus,setVerificationStatus] = useState<'idle'|'verifying'|'sucess'|'failure'>('idle')
    const [verificationResult,setVerificationResult] = useState<{
        wasteType: string,
        quantity: string,
        confidence : number,
    } | null >(null)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [searchBox,setSearchBox] = useState<google.maps.places.SearchBox | null>(null)
    const {isLoaded} = useJsApiLoader({
        id:'google-map-scrip',
        googleMapsApiKey: googleMapsApiKey,
        libraries: libraries
    })

    const onLoad = useCallback((ref:google.maps.places.SearchBox)=>{
        setSearchBox(ref)
    },[])

    const onPlaceChanged = ()=>{
        if(searchBox){
            const places =  searchBox.getPlaces()
            if(places && places.length > 0){
                const place = places[0]
                setNewReports((prev)=>({
                    ...prev,
                    location:place.formatted_address || ''
                }))
            }
        }
    }
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name,value} = e.target
        setNewReports({...newReports,[name]:value})
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files&&e.target.files[0]){
            const selectedFile = e.target.files[0]
            setFile(selectedFile)

            const reader = new FileReader()
            reader.onload = (e)=>{
                setPreview(e.target?.result as String)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const  readFileAsBase = (file:File) : Promise<String> =>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload =()=>resolve(reader.result as String)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }
    const handleVerify = async () => {
        if(!file) return
        setVerificationStatus('verifying')
        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey)
            const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'})
            const base64Data = await readFileAsBase(file)

            const imageParts =[
                {
                    inlineData:{
                        data:base64Data.split(',')[1],
                        mimeType: file.type
                    }
                }
            ]
            const prompt = 'ban da su li thanh cong rac thai'
            const result = await model.generateContent([prompt,...imageParts])
            const responce = await result.response
            const text = responce.text()
            try {
                const parsedResult = JSON.parse(text)
                if(parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence){
                    setVerificationResult(parsedResult)
                    setVerificationStatus("sucess")
                    setNewReports({
                        ...newReports,
                        type:parsedResult.wasteType,
                        amount:parsedResult.quantity
                    })
                }
                else{
                    console.error('ival verifition resilt',parsedResult);
                    setVerificationStatus("failure")
                    
                }
            } catch (error) {
                console.error('loi json',error);
                setVerificationStatus("failure")
            }
        } catch (error) {
            console.error('error',error);
            setVerificationStatus("failure")
        }
    }
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        if(verificationStatus !=="sucess"||!user){
            toast.error("lam oi dang nhap")
            return
        }
        setIsSubmitting(true)
        try {
            const report = (await createReport(
                user.id,
                newReports.location,
                newReports.type,
                newReports.amount, 
                preview || undefined ,
                verificationResult ? JSON.stringify(verificationResult):undefined
            )) as any

            const formattedReport ={
                id: report.id,
                location: report.location,
                wasteType : report.wasteType,
                amount: report.amount,
                createAt: report.createAt.toISOString().split("T")[0]
            }
            setReports([formattedReport,...reports])
            setNewReports({location:"",type:"",amount:""})
            setFile(null)
            setPreview(null)
            setVerificationStatus('idle')
            setVerificationResult(null)

            toast.success('bao cao rac thanh cong')
                
        } catch (error) {
            console.error('loi ko the bao cao rac',error); 
            toast.error("ban thu lai sao")            
        }finally{
            setIsSubmitting(false)
        }
    }
}