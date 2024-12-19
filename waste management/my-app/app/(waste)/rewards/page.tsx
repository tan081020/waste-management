"use client"

import { useState, useEffect } from 'react'
import { Coins, ArrowUpRight, ArrowDownRight, Loader, Gift, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createTransaction, getAllVoucher, getAvailableRewards, getRewardTransactions, getUserByEmail, updateVoucherUserId } from '@/utils/db/actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'


type Transaction = {
  id: number
  type: 'earned_report' | 'earned_collect' | 'redeemed'
  amount: number
  description: string
  date: string
}

type Reward = {
  id: number
  name: string
  cost: number
  description: string | null
  collectionInfo: string
}
type Voucher = {
  id: number
  userId: number | null
  name: string
  description: string
  point: number
  content: string
  createAt: Date
}
export default function RewardsPage() {
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [voucher, setVoucher] = useState<Voucher[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVoucher = async () => {
      const getVoucher = await getAllVoucher()
      setVoucher(getVoucher as [])
    }
    const fetchUserDataAndRewards = async () => {
      setLoading(true)
      try {
        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail)
          if (fetchedUser) {
            setUser(fetchedUser)
            const fetchedTransactions = await getRewardTransactions(fetchedUser.id);
            if (!Array.isArray(fetchedTransactions)) throw new Error("Invalid transactions data");
        
            setTransactions(fetchedTransactions as Transaction[]);
        
            const fetchedRewards = await getAvailableRewards(fetchedUser.id);
            if (!Array.isArray(fetchedRewards)) throw new Error("Invalid rewards data");
        
            // Filter out rewards with 0 points
            setRewards(fetchedRewards.filter(r => r.cost > 0));
        
            // Calculate balance
            const calculatedBalance = fetchedTransactions.reduce((acc, transaction) => {
              const amount = transaction.amount ?? 0; // Ensuring `amount` is a number
              if (transaction.type.startsWith('earned')) {
                return acc + amount;
              } else {
                return acc - amount;
              }
            }, 0);
            setBalance(Math.max(calculatedBalance, 0)) // Ensure balance is never negative
          } else {
            toast.error('Vui lòng đăng nhập để thực hiện chức năng này')
          }
        } else {
          toast.error('Vui lòng đăng nhập để thực hiện chức năng này')
        }
      } catch (error) {
        console.error('Error fetching user data and rewards:', error)
        toast.error('thử lại sau ')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDataAndRewards()
    fetchVoucher()
  }, [])

  const handleReward = async (voucherId: number, point: number, name: string) => {
    if (!user) {
      toast.error('Please log in to redeem rewards.')
      return
    }
    if (balance < point) {
      toast.error(' Bạn ko đủ điểm để đổi vật phẩm này')
      return
    } else {
      const updateVoucher = await updateVoucherUserId(voucherId, user.id)
      await createTransaction(user.id, 'redeemed', point, `Đổi ${name}`);
      toast.success('chúc mừng bạn đã đổi thành ccông')

    }

  }



  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-gray-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-semibold mb-6 text-gray-900 hover:text-green-500 transition-colors duration-300 ease-in-out">
        <Coins className="w-8 h-8 mr-3 text-green-500" />
        Phần thưởng
      </h1>



      {/* Reward Balance Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-between h-full border-l-4 border-green-500 mb-10 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Số dư thưởng</h2>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Coins className="w-12 h-12 mr-4 text-green-500" />
            <div>
              <span className="text-5xl font-bold text-green-500">{balance}</span>
              <p className="text-sm text-gray-500">Điểm có sẵn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions and Rewards Section */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Giao dịch gần đây</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-all duration-200 ease-in-out">
                  <div className="flex items-center">
                    {transaction.type === 'earned_report' ? (
                      <ArrowUpRight className="w-6 h-6 text-green-500 mr-4" />
                    ) : transaction.type === 'earned_collect' ? (
                      <ArrowUpRight className="w-6 h-6 text-blue-500 mr-4" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6 text-red-500 mr-4" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${transaction.type.startsWith('earned') ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type.startsWith('earned') ? '+' : '-'}{transaction.amount}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">Chưa có giao dịch nào</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Đổi thưởng</h2>
          <div className="space-y-4">
            {
              voucher.map(v => (
                v.userId ? (
                  <div></div>
                ) : (
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{v.name}</h3>
                      <span className="text-green-500 font-semibold">{v.point} Diem</span>
                    </div>
                    <p className="text-gray-600 mb-2">{v.description}</p>
                    <p className="text-sm text-gray-500 mb-4">{v.content}</p>

                    <div className="space-y-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          handleReward(v.id, v.point, v.name)
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        disabled={balance === 0}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Đổi thưởng
                      </Button>
                    </div>


                  </div>
                )

              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
