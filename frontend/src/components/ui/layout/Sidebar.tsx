import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/stores/useStore';
import { LogOut } from 'lucide-react';

export default function Sidebar() {
  const { projects, activeProject, jobs } = useStore();

  return (
    <aside className="w-64 bg-[--sidebar] h-screen border-r flex flex-col">
      <div className="px-6 py-4 border-b">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="Cartoon Studio AI" 
            width={40} 
            height={40} 
            className="opacity-80 transition-opacity"
          />
          <span className="font-bold text-xl text-white">Cartoon Studio AI</span>
        </Link>
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-2">
        <Link href="/dashboard" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/dashboard' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Dashboard</Link>

        <Link href="/projects" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/projects' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Projects</Link>

        <Link href="/episodes" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/episodes' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Episodes</Link>

        <Link href="/script-studio" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/script-studio' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Script Studio</Link>

        <Link href="/characters" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/characters' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Characters</Link>

        <Link href="/backgrounds" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/backgrounds' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Backgrounds</Link>

        <Link href="/voices" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/voices' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Voices</Link>

        <Link href="/render" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/render' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Render Center</Link>

        <Link href="/pipeline" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/pipeline' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Pipeline</Link>

        <Link href="/settings" className={({ router }) => `
          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[--foreground]
          ${router.pathname === '/settings' ? 'bg-[--primary]/20 text-primary' : 'text-[--muted] hover:bg-[--muted]/20 hover:text-white'}
        `}>Settings</Link>
      </nav>

      <div className="p-6 border-t">
        <div className="text-sm text-muted-400">v1.0.0</div>
      </div>
    </aside>
  );
}