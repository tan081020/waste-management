'use client'
import { useEffect, useState } from 'react'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUserByEmail, updateUserByEmail } from '@/utils/db/actions'

type UserSettings = {
    name: string
    email: string
    phone: string
    address: string

}

export default function SettingsPage() {

    const [settings, setSettings] = useState<UserSettings>({
        name: '',
        email: '',
        phone: '',
        address: '',
    }) as any


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))  
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const user = localStorage.getItem('userEmail')

            if (user) {
                await updateUserByEmail(user, settings.name, settings.phone, settings.address)
            } else {
                alert('dang nhap de thuc hien chuc nang nay')

            }

            alert('Settings updated successfully!')
        } catch (error) {

        }

    }
    const getUser = async (email: string) => {
        const userSetting = await getUserByEmail(email)
        setSettings({
            name: userSetting?.name,
            email: userSetting?.email,
            phone: userSetting?.phone,
            address: userSetting?.address,
        })
        
        

    }
    useEffect(() => {
        try {
            const user = localStorage.getItem('userEmail')

            if (user) {
                getUser(user)
            } else {
                setSettings({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                })
            }
        } catch (error) {

        }
    }, [])
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Account Settings</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
             
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleInputChange}
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
                            value={settings.name}
                            onChange={handleInputChange}
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
                            value={settings.phone}
                            onChange={handleInputChange}
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
                            value={settings.address}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>



                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </form>
        </div>
    )
}