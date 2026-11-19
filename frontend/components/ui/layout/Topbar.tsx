"use client";

import { Bell, ChevronDown, Settings as SettingsIcon } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Project Selector */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
          <span className="text-gray-500">Project</span>
          <select
            defaultValue="My Cartoon Project"
            className="text-gray-700 bg-transparent border-none focus:ring-0 outline-none w-32"
          >
            <option>My Cartoon Project</option>
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white" />
        </button>

        {/* Settings */}
        <button
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
