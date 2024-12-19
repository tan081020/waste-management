'use client'
import { Eye, EyeOff, X } from 'lucide-react';
import React, { useState } from 'react';
import { compareSync } from 'bcrypt-ts';
import toast from 'react-hot-toast';
import { getUserByEmail } from '@/utils/db/actions';
import { Button } from '../button';

type Data = {
  email: string;
  password: string;
};

const Login = ({
  onclose,
  init,
}: {
  onclose: () => void;
  init: () => void;
}) => {
  const [data, setData] = useState<Data>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  

  const handleOnChanger = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const checkEmail = await getUserByEmail(data.email);
    const hash = checkEmail?.password;

    if (checkEmail && compareSync(data.password, hash as any)) {
      localStorage.setItem('userEmail', data.email);
      onclose();
      init();
      toast.success('Đăng Nhập Thành Công');
    } else {
      toast.error('Email hoặc mật khẩu sai bạn vui lòng thử lại!');
      return;
    }
  };

  return (
  <div className="animate-slideDown">
    <section
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onclose} // Đóng form khi nhấn vào overlay
    >
      <div
        className={`container mx-auto px-4 animate-slideDown`}
        onClick={(e) => e.stopPropagation()} // Ngăn overlay đóng form khi nhấn vào form
      >
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transition-transform transform">
          {/* Nút Close */}
          <button
            onClick={onclose}
            className="absolute top-4 right-4 text-white hover:text-red-500 transition duration-300"
          >
            <X size={28} />
          </button>

          {/* Header */}
          <div className="border-b pb-6 px-8 bg-gradient-to-r from-green-400 to-green-500 rounded-t-2xl flex justify-center items-center pt-6 pb-4">
            <h2 className="text-3xl font-extrabold text-white text-center">
              Đăng Nhập
            </h2>
          </div>

          {/* Form */}
          <form className="p-8 space-y-6" onSubmit={handleOnSubmit}>
            {/* Email */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChanger}
                placeholder="Nhập Email"
                required
                className="w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Mật khẩu:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={data.password}
                  onChange={handleOnChanger}
                  placeholder="Nhập Mật khẩu"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-green-500 transition duration-300"
                >
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <div>
              <Button className="w-full bg-green-500 text-white font-semibold py-3 text-lg rounded-lg hover:bg-green-600 hover:shadow-lg transition-all duration-300">
                Đăng Nhập
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Login;
