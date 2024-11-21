'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import {  usePathname,useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn, LogOut, Loader } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

import { checkUser, createUser, getUnreadNotifications, getUserBalance, getUserByEmail, markNotificationAsRead } from "@/utils/db/actions";
import { useMediaQuery } from "@/hooks/useMediaQuery";



const clientId = process.env.W3_AUTH_CLIENT_ID

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0xaa36a7',
    rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
    displayName: 'Sepolia Testnet',
    blockExlorerUrl: 'https://sepolia.etherscan.io',
    ticker: 'ETH',
    ticketName: 'Ethereum',
    logo: 'https://assets.web3auth.io/evm-chains/sepolia.png'
}
const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
})
const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider
})

interface HeaderProps {
    onMenuClick: () => void;
    totalEarings: number;
}

export default function Header({ onMenuClick, totalEarings }: HeaderProps) {
    const [provider, setProvider] = useState<IProvider | null>(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState<any>(null)
    const pathname = usePathname()
    const [notification, setNotification] = useState<Notification[]>([])
    const [balence, setBalence] = useState(0)
    const isMobile = useMediaQuery("(max-width: 768px)")
    const router = useRouter()
    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider)
                if (web3auth.connected) {
                    setLoggedIn(true)
                    const user = await web3auth.getUserInfo()
                    setUserInfo(user)

                    if (user.email) {
                        localStorage.setItem('userEmail', user.email)
                        try {
                            await getUserByEmail(user.email)
                        } catch (error) {
                            console.error('ok the tao dc user', error);

                        }
                    }
                }
            } catch (error) {
                console.error('loi web3auth', error);

            }
            finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email)
                if (user) {
                    const unreadNotifications = await getUnreadNotifications(user.id)
                    setNotification(unreadNotifications)
                }
            }
        }
        fetchNotifications()

        const notificationInterval = setInterval(() => {
            fetchNotifications
        }, 30000);
        return () => clearInterval(notificationInterval)
    }, [userInfo])

    useEffect(() => {
        const fetchUserBalance = async () => {
            if (userInfo && userInfo.email) {
                const user = await getUserByEmail(userInfo.email)
                if (user) {
                    const userBalence = await getUserBalance(user.id)
                    setBalence(userBalence)
                }
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


    const login = async () => {
        if (!web3auth) {
            console.error('ko co web3auth');
            return
        }
        try {
            const web3authProvider = await web3auth.connect()
            setProvider(web3authProvider)
            setLoggedIn(true)
            const user = await web3auth.getUserInfo()
            setUserInfo(user)
          
         
            if (user.email) {
                localStorage.setItem('userEmail', user.email)
                try {
                    const checkUSer = await checkUser(user.email)
                    if(checkUSer){
                        await getUserByEmail(user.email)
                    }
                    else{

                        await createUser(user.email, user.name   || 'anonymost user')
                    }
                } catch (error) {
                    console.error("loitao user", error)
                }
            }
        } catch (error) {
            console.error('loi login', error);

        }
    }
    
    
    
    const logout = async () => {
        if (!web3auth) {
            console.log("web3auth ko kha dung");
            return
        }
        try {
            await web3auth.logout()
            router.push('/')
            setProvider(null)
            setLoggedIn(false)
            setUserInfo(null)
            localStorage.removeItem('userEmail')
            
        } catch (error) {
            console.error("dang xuat that bai", error)
        }
    }
    const getUserInfo = async () => {
        if (web3auth) {
            const user = await web3auth.getUserInfo()
            setUserInfo(user)
            if (user.email) {
                localStorage.setItem('userEmail', user.email)
                try {
                    await getUserByEmail(user.email)
                } catch (error) {
                    console.error("loi dang tao user", error)
                }
            }
        }
    }
    const handleNotificationClick = async (notificationId: number) => {
        await markNotificationAsRead(notificationId)
    }
    if (loading) {
        return <div>
            loading.....
        </div>
           
        
        
        
    }

    return (
        <header className=" bg-white border-b broder-gray-200 sticky top-0 z-50">
            <div className=" flex items-center justify-between px-4 py-2">
                <div className=" flex items-center">
                    <Button variant='ghost' size='icon' className=" mr-2 md:mr-4" onClick={onMenuClick}>
                        <Menu className=" h-6 w-6 text-gray-800"></Menu>
                    </Button>
                    <Link href='/' className=" flex items-center">
                        <Leaf className=" h-6 w-6 md:h-8 text-green-500 mr-1 md:mr-2"></Leaf>
                        <span className=" font-bold text-base md:text-lg text-gray-800">Quản lý chất thải</span>
                    </Link>
                </div>

                {
                    !isMobile && (
                        <div className=" flex-1 max-w-xl mx-4">
                            <div className=" relative">
                                <input
                                    type="text"
                                    placeholder="Tìm Kiếm...."
                                    className=" w-full py-4 px-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500"
                                ></input>
                                <Search className=" absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></Search>
                            </div>
                        </div>
                    )}
                <div className=" flex items-center">
                    {
                        isMobile && (
                            <Button variant='ghost' size='icon' className=" mr-2">
                                <Search className=" h-5 w-5"></Search>
                            </Button>
                        )
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant='ghost' size='icon' className=" mr-2 relative">
                                <Bell className=" h-5 w-5 text-gray-800" ></Bell>
                                {
                                    notification.length > 0 && (
                                        <Badge className=" absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                                            {notification.length}
                                        </Badge>
                                    )
                                }
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className=" w-64">
                            {
                                notification.length > 0 ? (
                                    notification.map((notification: any) => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className=" flex flex-col">
                                                <span className=" font-medium">{notification.type}</span>
                                                <span className=" text-sm text-gray-500">{notification.message}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem>ko co thong bao moi</DropdownMenuItem>
                                )
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className=" mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
                        <Coins className=" h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500"></Coins>
                        <span className=" font-semibold text-sm md:text-base text-gray-800">
                            {balence.toFixed(2)}
                        </span>
                    </div>
                    {
                        !loggedIn ? (
                            <Button onClick={login} className=" bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
                                Login
                                <LogIn className=" ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5"></LogIn>
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className=" items-center flex">
                                        <User className=" h-5 w-5 mr-1"></User>
                                        <ChevronDown className=" h-4 w-4"></ChevronDown>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={getUserInfo} >
                                        {userInfo ? userInfo.name : 'thong tin'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={getUserInfo}>
                                        <Link href={'/settings'}>Cài Đặt</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout}>
                                        Đăng Xuất
                                    </DropdownMenuItem>
                                    <DropdownMenuItem >
                                        <Link href={'/dashboard'}>Admin</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                </div>

            </div>
        </header>
    )
}