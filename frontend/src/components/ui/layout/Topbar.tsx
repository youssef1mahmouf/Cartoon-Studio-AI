import { useStore } from '@/stores/useStore';
import { Sun, Moon, Settings, LogOut } from 'lucide-react';

export default function Topbar() {
  const { settings, ui, setSettings } = useStore();

  return (
    <header className="bg-[--sidebar] border-b w-full flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="Cartoon Studio AI" 
            width={32} 
            height={32} 
            className="opacity-80"
          />
          <span className="font-bold text-lg text-white">Cartoon Studio</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle - toggle between light and dark mode */}
        <button 
          onClick={() => setSettings({ ...settings, selected_provider: settings.selected_provider === 'kokoro' ? 'piper' : 'kokoro' })} 
          className="rounded-lg p-2 hover:bg-[--muted]/20 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button 
          onClick={() => setUI({ notifications: ui.notifications.length === 0 ? [{ id: '1', type: 'info', message: 'New project added' }] : [] })} 
          className="relative rounded-lg p-2 hover:bg-[--muted]/20 transition-colors"
          aria-label="Notifications"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 8A6 6 0 006 8c0 7-3 11-3 11s-3-4-3-11A6 6 0 002 8c0 3 1.54 5.33 4 7 2.5 1.67 4 3.57 4 7a6.5 6.5 0 005-1 6 6 0 00-5-1zM8 14s-1 4 4 4 4-1 4-1-4-1-4 1-4 1z"/>
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[--sidebar]"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button 
            className="rounded-full p-2 hover:bg-[--muted]/20 transition-colors"
            aria-label="User menu"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </button>
          <div className="absolute right-0 mt-2 w-44 bg-[--sidebar] rounded-lg shadow p-4 right-0 w44">
            <Link href="/settings" className="block px-4 py-2 text-sm text-white hover:bg-[--muted]/20">Settings</Link>
            <button onClick={() => /* logout */} className="block w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}