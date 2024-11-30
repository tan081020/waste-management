"use client"

import ChangeUserRole from '@/components/ui/ChangeUser'
import { deleteUser, getAllUser, getUserByEmail, getWasteCollectionTalk } from '@/utils/db/actions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
type allUsers = {
  id: number,
  email: string,
  name: string,
  phone: string,
  address: string,
  role: string,
  date: string
}
type UserUpdate = {
  name: string
  email: string
  phone: string
  address: string
  role: string

}
const page = () => {
  const router = useRouter()
  const [allUsers, setAllUsers] = useState<allUsers[]>([])
  const [openUpdateUser, setOpenUpdateUser] = useState(false)
  const [email,setEmail]=useState('')
  const handleClose = () => {
    setOpenUpdateUser(false)

  }
  const getAllUsers = async () => {
    const getUSer = await getAllUser()
    setAllUsers(getUSer as allUsers[])
  }
  useEffect(() => {
   
    getAllUsers()
  }, [])

  return (
    <div className=' bg-white pb-4'>
      <table className='w-full userTable'>
        <thead>
          <tr className=' bg-black text-white'>
            <th>Sr.</th>
            <th>name</th>
            <th>email</th>
            <th>role</th>
            <th>createDate</th>
            <th></th>

          </tr>

        </thead>
        <tbody>
          {
            allUsers.map((user, i) => {
              return (
                <tr>
                  <td>{i + 1}</td>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.role}</td>
                  <td>{user?.date}</td>
                  <td>
                    <button className='bg-green-100 p-2 rounded-full hover:bg-green-500 hover:text-white'
                      onClick={() => {
                        setEmail(user?.email)
                        setOpenUpdateUser(true)
                      }}

                    >sua
                    </button>

                  </td>

                </tr>

              )
            })
          }
        </tbody>
      </table>
      {
        openUpdateUser && (
          <ChangeUserRole
            email={email}
            onclose={handleClose}
            onfuc = {getAllUsers}
          >

          </ChangeUserRole>
        )
      }
    </div>
  )
}

export default page
