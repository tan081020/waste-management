"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getUserByEmail,
    updatePasswordByEmail,
    updateUserByEmail,
} from "@/utils/db/actions";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import toast from "react-hot-toast";

type UserSettings = {
    name: string;
    email: string;
    phone: string;
    address: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export default function SettingsPage() {
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordCNew, setShowPasswordCNew] = useState(false);

    const [openPassword, setOpenPassword] = useState(false);
    const [settings, setSettings] = useState<UserSettings>({
        name: "",
        email: "",
        phone: "",
        address: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    }) as any;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = localStorage.getItem("userEmail");

            if (user) {
                if (openPassword === false) {
                    await updateUserByEmail(
                        user,
                        settings.name,
                        settings.phone,
                        settings.address
                    );
                    toast.success("thay đổi thành công");
                } else {
                    const checkEmail = await getUserByEmail(user);
                    const hash = checkEmail?.password;

                    if (settings.newPassword !== settings.confirmPassword) {
                        toast.error("mật khẩu không trùng khớp");
                        return;
                    }
                    if (settings.newPassword.length < 8) {
                        toast.error("mật khẩu phải nhập trên 8 kí tự");
                        return;
                    }
                    if (compareSync(settings.oldPassword, hash as any)) {
                        const salt = genSaltSync(10);
                        const hash = hashSync(settings.newPassword, salt);
                        await updatePasswordByEmail(user, hash);
                        setSettings((pre: any) => ({
                            ...pre,
                            oldPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                        }));
                        toast.success("thay đổi thành công");
                    } else {
                        toast.error("mật khẩu cũ không trùng khớp");
                    }
                }
            } else {
                toast.error("đăng nhập để thực hiện chức năng này");
            }
        } catch (error) { }
    };
    const getUser = async () => {
        try {
            const email = localStorage.getItem("userEmail");
            if (email) {
                const userSetting = await getUserByEmail(email);
                setSettings({
                    name: userSetting?.name,
                    email: userSetting?.email,
                    phone: userSetting?.phone,
                    address: userSetting?.address,
                });
            } else {
                setSettings({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getUser();
    }, []);
    console.log(settings);

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6 text-green-600 justify-end text-center">
                Hồ sơ người dùng
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            disabled
                        />
                        <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                    </div>
                </div>

                {/* ten */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Họ và tên
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nhập họ và tên"
                            value={settings.name}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-green-500 focus:border-green-500"
                        />
                        <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                    </div>

                </div>
                {/* sdt */}
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Số điện thoại
                    </label>
                    <div className="relative">
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Nhập mật số điện thoại"
                            value={settings.phone}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-green-500 focus:border-green-500"
                        />
                        <Phone
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                    </div>
                </div>
                {/* dc */}
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Địa chỉ
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Nhập địa chỉ"
                            value={settings.address}
                            onChange={handleInputChange}
                            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-4 focus:ring-green-500 focus:border-green-500"
                        />
                        <MapPin
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                    </div>
                </div>
                <p
                    onClick={() => setOpenPassword(!openPassword)}
                    className=" cursor-pointer hover:text-green-500"
                >
                    Thay Đổi Mật Khẩu
                </p>
                {openPassword && (
                    <div>
                        {/* mkc */}
                        <div className="mb-3">
                            <label
                                htmlFor="oldPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Mật khẩu cũ
                            </label>

                            <div className="relative">
                                <input
                                    type={showPasswordOld ? "text" : "password"}
                                    id="oldPassword"
                                    name="oldPassword"
                                    placeholder="Nhập mật khẩu cũ"
                                    value={settings.oldPassword}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordOld(!showPasswordOld)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-green-500 transition"
                                >
                                    {showPasswordOld ? <Eye /> : <EyeOff />}
                                </button>
                            </div>

                        </div>
                        {/* mkm */}
                        <div className="mb-3">
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswordNew ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Nhập mật khẩu mới"
                                    value={settings.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordNew(!showPasswordNew)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-green-500 transition"
                                >
                                    {showPasswordNew ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                        
                        </div>
                        {/* nlmk */}
                        <div className="mb-3">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nhập lại mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswordCNew ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={settings.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordCNew(!showPasswordCNew)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-green-500 transition"
                                >
                                    {showPasswordCNew ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                          
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                </Button>
            </form>
        </div>
    );
}
