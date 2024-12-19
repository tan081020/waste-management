'use client'
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Menu, Coins, Leaf, Bell, User, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from "@/utils/db/actions";
import Login from "./user/Login";
import SignUp from "./user/SignUp";

interface HeaderProps {
    onMenuClick: () => void;

}

export default function Header({ onMenuClick }: HeaderProps) {
    const [loggedIn, setLoggedIn] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)
    const [openSignUp, setOpenSignUp] = useState(false)
    const [userInfo, setUserInfo] = useState<any>(null)
    const [notification, setNotification] = useState<Notification[]>([])
    const [balence, setBalence] = useState(0)
    const router = useRouter()



    const init = async () => {
        
        try {
            const userEmail = localStorage.getItem('userEmail')
            if (userEmail) {
                setLoggedIn(true)

                try {
                    const userS = await getUserByEmail(userEmail)
                    setUserInfo(userS)
                } catch (error) {
                    console.error('Không thể tạo được user', error);
                }
            }


        } catch (error) {
            console.error('Lỗi đăng nhập', error);
        }
      

    }
    useEffect(() => {

        init()
    }, [])
    // thong bao
    useEffect(() => {
        const fetchNotifications = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email)
                if (user) {
                    const unreadNotifications = await getUnreadNotifications(user.id)
                    setNotification(unreadNotifications as [])
                }
            }
            else {
                setNotification([])
            }
        }
        fetchNotifications()

        const notificationInterval = setInterval(() => {
            fetchNotifications()
        }, 30000);
        return () => clearInterval(notificationInterval)
    }, [userInfo])
    // tong diem
    useEffect(() => {
        const fetchUserBalance = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email)
                if (user) {
                    const userBalence = await getUserBalance(user.id)
                    setBalence(userBalence)
                }
            }
            else {
                setBalence(0)
            }
        }
        fetchUserBalance()

        const handleBalenceUpadate = (event: CustomEvent) => {
            setBalence(event.detail)
        }

        window.addEventListener('balenceUpdate', handleBalenceUpadate as EventListener)
        return () => {
            window.removeEventListener('balenceUpdate', handleBalenceUpadate as EventListener)
        }

    }, [userInfo])
    // dang nhap


    // dang xuat
    const logout = async () => {

        try {

            router.push('/')

            setLoggedIn(false)
            setUserInfo(null)
            localStorage.removeItem('userEmail')
        } catch (error) {
            console.error("Đăng Xuất Thất Bại", error)
        }
    }

    // xem thong bao
    const handleNotificationClick = async (notificationId: number) => {
        await markNotificationAsRead(notificationId)
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 py-4">
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2 md:mr-4" onClick={onMenuClick}>
                        <Menu className="h-6 w-6 text-gray-800" />
                    </Button>
                    <Link href="/" className="flex items-center">
                        <Leaf className="h-10 w-10 text-green-500 mr-2 transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-green-700 " />

                        <span className="font-bold text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 transition-colors duration-300 ease-in-out">
                            Quản lý Rác thải
                        </span>

                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div  className="relative p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 ease-in-out">
                                <Bell className="h-10 w-12 md:h-12 md:w-[20px] text-gray-800" />
                                {notification.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5 bg-red-500 text-white text-xs rounded-full flex justify-center items-center">
                                        {notification.length}
                                    </Badge>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-white shadow-lg rounded-lg border border-gray-200">
                            {notification.length > 0 ? (
                                notification.map((notification: any) => (
                                    <DropdownMenuItem key={notification.id} onClick={() => handleNotificationClick(notification.id)} className="p-2 hover:bg-gray-100 rounded-md">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{notification.type}</span>
                                            <span className="text-sm text-gray-500">{notification.message}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem className="p-2 text-gray-500">Không có thông báo mới</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>


                    <div className="mr-2 md:mr-4 flex items-center justify-center bg-gray-100 rounded-full px-4 md:px-6 py-2 shadow-md hover:bg-gray-200 transition-all duration-200 ease-in-out">
                        <Coins className="h-6 w-6 md:h-7 md:w-7 mr-2 text-green-500" />
                        <span className="font-semibold text-lg md:text-xl text-gray-800">{balence.toFixed(2)}</span>
                    </div>

                    {!loggedIn ? (
                        <div className=" flex">

                            <Button onClick={() => setOpenSignUp(true)} className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base  px-4 py-2 transition-all duration-200 ease-in-out">
                                Đăng kí
                                <UserPlus className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                            <Button onClick={() => setOpenLogin(true)} className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base  px-4 py-2 transition-all duration-200 ease-in-out ml-2">
                                Đăng nhập
                                <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
                            </Button>
                        </div>

                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="items-center flex hover:bg-gray-200 rounded-full p-2 transition-colors duration-200 ease-in-out">
                                    <User className="h-24 w-24" />
                                    <ChevronDown className="h-24 w-24" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-lg border border-gray-200">
                                <DropdownMenuItem onClick={() => { router.push('/user/settings') }} className="p-2 hover:bg-gray-100 rounded-md">
                                    {userInfo ? userInfo.name : 'Thông tin'}
                                </DropdownMenuItem>
                              
                                <DropdownMenuItem onClick={() => router.push('/user/voucher-wallet')} className="p-2 hover:bg-gray-100 rounded-md">
                                    Kho voucher
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout} className="p-2 hover:bg-gray-100 rounded-md">
                                    Đăng Xuất
                                </DropdownMenuItem>
                                {
                                    userInfo?.role === 'ADMIN' ? (
                                        <DropdownMenuItem onClick={() => router.push('/dashboard')} className="p-2 hover:bg-gray-100 rounded-md">
                                            Admin
                                        </DropdownMenuItem>
                                    ) : (
                                        <div></div>
                                    )
                                }

                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

            </div>
            {
                openLogin && (
                    <Login onclose={() => setOpenLogin(false)} init={init}></Login>

                )
            }
            {
                openSignUp && (
                    <SignUp onclose={() => setOpenSignUp(false)}></SignUp>

                )
            }
        </header>

    );
}
