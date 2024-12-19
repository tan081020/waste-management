"use client";
import { Eye, EyeOff, X } from "lucide-react";
import React, { useState } from "react";
import { genSaltSync, hashSync } from "bcrypt-ts";
import toast from "react-hot-toast";
import { createUser, getUserByEmail } from "@/utils/db/actions";

type Data = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = ({ onclose }: { onclose: () => void }) => {
  const [data, setData] = useState<Data>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (checkEmail) {
      toast.error("Email đã tồn tại!");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Mật khẩu nhập lại không trùng khớp!");
      return;
    }
    if (data.password.length >= 8) {
      const salt = genSaltSync(10);
      const hash = hashSync(data.password, salt);

      const user = await createUser(data.email, data.name, hash);
      if (user) {
        onclose();
        toast.success("Đăng kí thành công!");
      }
    } else {
      toast.error("Mật khẩu phải chứa ít nhất 8 kí tự!");
    }
  };

  return (
    <section className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 w-full max-w-md rounded-lg shadow-lg relative">
        {/* Header */}
        <div className="relative flex justify-center items-center mb-6">
          <h2 className="text-2xl font-semibold text-green-600 text-center">
            Đăng Kí
          </h2>
          <button
            onClick={onclose}
            className="absolute top-0 right-0 text-gray-500 hover:text-red-500 transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleOnSubmit}>
          {/* Họ và tên */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Họ và tên:
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên của bạn"
              value={data.name}
              onChange={handleOnChanger}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập Email"
              value={data.email}
              onChange={handleOnChanger}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Mật khẩu:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={data.password}
                onChange={handleOnChanger}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-green-500 transition"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Nhập lại mật khẩu */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Nhập lại mật khẩu:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={data.confirmPassword}
                onChange={handleOnChanger}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-green-500 transition"
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Nút Đăng kí */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transform hover:scale-105 transition-all"
          >
            Đăng Kí
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
