import { getUserByEmail, updateUserByEmailAdmin } from '@/utils/db/actions'
import { Mail, MapPin, Phone, User, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


type UserUpdate = {
    name: string
    email: string
    phone: string
    address: string
    role: string




}

const ChangeUserRole = ({
    email,
    onclose,
    onfuc,
}: {
    email: string
    onclose: () => void
    onfuc: () => void

}) => {

    const ROLE = {
        USER: "USER",
        ADMIN: "ADMIN"
    }
    const [userUpdate, setUserUpdate] = useState<UserUpdate>({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: ''

    }) as any
    const [usersRole, setUsersRole] = useState('') as any
    const handleOnChangeRole = (e) => {
        setUsersRole(e.target.value)
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setUserUpdate(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))  
    }

    
    const handleUpdateUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, email: string) => {
        e.preventDefault()

        try {
           const update = await updateUserByEmailAdmin(email,userUpdate.name,userUpdate.phone,userUpdate.address,usersRole)
           if(update){
            toast.success('cap nhap thanh cong')
            onclose()
            onfuc()
           }
           else{
            toast.error('that bai')
           }
        } catch (error) {
            console.log(error);
            
        }

    }
    useEffect(() => {
        try {
            const getUSer = async () => {
                const getuser = await getUserByEmail(email)
                setUserUpdate({
                    name: getuser?.name,
                    email: getuser?.email,
                    phone: getuser?.phone,
                    address: getuser?.address,
                    role: getuser?.role
                })
                setUsersRole(getuser?.role)
            }
            getUSer()
        } catch (error) {

        }
    }, [])
    return (
        <div className=' fixed top-0 bottom-0 right-0 left-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50 '>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
                <div className=' flex justify-center items-center pb-3'>

                    <h1 className='pb-4 text-lg font-medium'>sửa thông tin người dùng</h1>

                    <div className='pb-4 w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onclose}>
                        <X></X>
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                           
                            value={userUpdate.email}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            disabled
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange}
                            value={userUpdate.name}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            onChange={handleInputChange}

                            value={userUpdate.phone}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            onChange={handleInputChange}

                            value={userUpdate.address}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>


                <div className='flex justify-between my-3 items-center'>
                    <p>role: {userUpdate.role} </p>
                    <select className=' border px-4 py-1' value={usersRole} onChange={handleOnChangeRole}>

                        {
                            Object.values(ROLE).map((role) => {
                                return (
                                    <option value={role} key={role}>{role}</option>
                                )
                            })
                        }

                    </select>
                </div>
                <button className='w-fit mx-auto block border py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700' onClick={e => handleUpdateUser(e, email)} > Chỉnh sửa</button>
            </div>
        </div>
    )
}

export default ChangeUserRole
