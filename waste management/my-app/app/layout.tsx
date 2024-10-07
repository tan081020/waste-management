'use client'

import React, { useState,useEffect, use, Children } from "react"
import {Inter} from 'next/font/google'
import './globals.css'

// header
// sidebar

import {Toaster} from "react-hot-toast"

const inter = Inter({subsets:['latin']})

export default function RootLayout  ({
  childern,
}:{
  childern : React.ReactNode
}){
  const [sidebarOpen,setSidebarOpen] = useState(false)
  const [totalEarnings,setTotalEarnings] = useState(0)

  return( 
    <html lang="en">
        <body className={inter.className}>
          <div className=" min-h-screen bg-gray-500 flex flex-col">
              {/** header */}
              <div className=" flex flex-1">
                  {/** side bar */}
                  <main className=" flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                    {childern}
                  </main>
              </div>
          </div>
          <Toaster/>
        </body>
    </html>
  )
}
