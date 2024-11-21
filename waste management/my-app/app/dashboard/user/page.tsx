"use client"

import { getAllUser, getWasteCollectionTalk } from '@/utils/db/actions'
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
const page = () => {

  const [allUsers, setAllUsers] = useState<allUsers[]>([])

  useEffect(() => {
    const getAllUsers = async () => {
      const getUSer = await getAllUser()
      setAllUsers(getUSer as allUsers[])
    }
    getAllUsers()
  }, [])

  console.log('allUsers', allUsers);

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
               

                </tr>

              )
            })
          }
        </tbody>
      </table>

    </div>
  )
}

export default page
