import { getUserByEmail, updateUserByEmailAdmin } from '@/utils/db/actions';
import { Mail, MapPin, Phone, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type UserUpdate = {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

const ChangeUserRole = ({
  email,
  onclose,
  onfuc,
}: {
  email: string;
  onclose: () => void;
  onfuc: () => void;
}) => {
  const ROLE = {
    USER: 'USER',
    ADMIN: 'ADMIN',
  };

  const [userUpdate, setUserUpdate] = useState<UserUpdate>({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
  });
 
  const handleOnChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    email: string
  ) => {
    e.preventDefault();
    try {
      const update = await updateUserByEmailAdmin(
        email,
      userUpdate
      );
      if (update) {
        toast.success('Cập nhật thành công');
        onclose();
        onfuc();
      } else {
        toast.error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const fetchedUser = await getUserByEmail(email);
       
        
        setUserUpdate({
          name: fetchedUser?.name || '',
          email: fetchedUser?.email || '',
          phone: fetchedUser?.phone || '',
          address: fetchedUser?.address || '',
          role: fetchedUser?.role || '',
        });
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, [email]);
  console.log(userUpdate);
  
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 mt-10">
    <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 relative">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Sửa thông tin người dùng</h2>
        <button
          className="text-gray-600 hover:text-red-600"
          onClick={onclose}
        >
          <X size={24} />
        </button>
      </div>
  
      <form>
        {/* Email (Read-Only) */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              id="email"
              name="email"
              value={userUpdate.email}
              disabled
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
  
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên đầy đủ
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="name"
              name="name"
              value={userUpdate.name}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
  
        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={userUpdate.phone}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
  
        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="address"
              name="address"
              value={userUpdate.address}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
  
        {/* Role */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Quyền
          </label>
          <select
            id="role"
            name='role'
            value={userUpdate.role}
            onChange={handleOnChangeRole}
            className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
          >
            {Object.values(ROLE).map((role) => (
              <option value={role} key={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
  
        {/* Update Button */}
        <button
          onClick={(e) => handleUpdateUser(e, email)}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Cập nhật
        </button>
      </form>
    </div>
  </div>
  
  );
};

export default ChangeUserRole;
