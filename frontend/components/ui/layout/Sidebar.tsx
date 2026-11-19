"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Layout,
  List,
  Film,
  FileText,
  User,
  Image,
  Mic,
  Play,
  Sliders,
  Settings as SettingsIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Layout },
  { href: "/projects", label: "Projects", icon: List },
  { href: "/episodes", label: "Episodes", icon: Film },
  { href: "/script-studio", label: "Script Studio", icon: FileText },
  { href: "/characters", label: "Characters", icon: User },
  { href: "/backgrounds", label: "Backgrounds", icon: Image },
  { href: "/voices", label: "Voices", icon: Mic },
  { href: "/render", label: "Render Center", icon: Play },
  { href: "/pipeline", label: "Pipeline", icon: Sliders },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-indigo-600 font-bold text-xl tracking-tight">Cartoon</span>
          <span className="text-gray-900 font-bold text-xl tracking-tight">Studio</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon
                className={cn("w-5 h-5 shrink-0", active ? "text-indigo-600" : "text-gray-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs font-medium text-gray-900">Cartoon Studio AI</div>
        <div className="text-xs text-gray-400 mt-1">v1.0.0</div>
      </div>
    </aside>
  );
}
