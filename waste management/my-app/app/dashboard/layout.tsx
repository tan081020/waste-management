"use client"

import { useState, useEffect } from "react"
import { Inter } from 'next/font/google'
import "../globals.css"

import { Toaster } from 'react-hot-toast'
import Header from "@/components/ui/Header"
import SideBarDashboard from "@/components/ui/SideBarDashboard"



const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode,

}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en">
      <body className={inter.className}>

        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)}  />
          <div className="flex flex-1">

            <SideBarDashboard></SideBarDashboard>
            <main className="flex-1 p-4 lg:p-8 ml-0  transition-all duration-300">
              {children}
            </main>
          </div>
        </div>

        <Toaster />
      </body>
    </html>
  )
}