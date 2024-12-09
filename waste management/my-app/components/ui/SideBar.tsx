import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Trash,
  Coins,
  Medal,
  Settings,
  Home,
  BookOpen,
} from "lucide-react";

const sidebarItems = [
  {
    href: "/",
    icon: () => <Home className="text-blue-500 w-8 h-8 text-2xl " />,
    label: "Trang chủ",
  },
  {
    href: "/report",
    icon: () => <MapPin className="text-green-500 w-8 h-8 text-2xl" />,
    label: "Báo cáo rác thải",
  },
  {
    href: "/collect",
    icon: () => <Trash className="text-red-500 w-8 h-8 text-2xl" />,
    label: "Nhiệm vụ thu gom rác",
  },
  {
    href: "/rewards",
    icon: () => <Coins className="text-yellow-500 w-8 h-8 text-2xl" />,
    label: "Điểm thưởng",
  },
  {
    href: "/leaderboard",
    icon: () => <Medal className="text-purple-500 w-8 h-8 text-2xl" />,
    label: "Bảng xếp hạng",
  },

  {
    href: "/news",
    icon: () => <BookOpen className="text-green-500 w-12 h-12 text-3xl" />,
    label: "Tin tức",
  },
  {
    href: "/chatbot",
    icon: () => <span className="text-pink-500 text-xl">🤖</span>,
    label: "Chatbot",
  },
];

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-white border-r pt-20 border-gray-200 text-gray-800 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <nav className="h-full flex flex-col justify-between">
        <div className="px-4 py-6 space-y-50">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start py-3 ${
                  pathname === item.href
                    ? "bg-green-100 text-green-800"
                    : "text-gray-600 hover:bg-gray-100"
                }mb-4`}
              >
                <item.icon className=" mr-4 h-10 w-10" />
                <span className="text-lg ">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/user/settings" passHref>
            <Button
              variant={pathname === "/user/settings" ? "secondary" : "outline"}
              className={`w-full py-3 ${
                pathname === "/settings"
                  ? "bg-green-100 text-green-800"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              <span className="text-base">Thay đổi thông tin</span>
            </Button>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
