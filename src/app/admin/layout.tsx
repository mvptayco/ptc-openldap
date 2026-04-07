'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ShieldCheck,
  Users,
  Laptop,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: ShieldCheck },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/endpoints", label: "Endpoints", icon: Laptop },
    { href: "/admin/logs", label: "Logs", icon: History },
    { href: "/admin/reports", label: "Reports", icon: History },
    { href: "/admin/ise", label: "Cisco ISE", icon: ShieldCheck },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = () => {
    router.push("/admin/login")
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="flex flex-1 bg-slate-950">
        <motion.aside
          initial={false}
          animate={{ width: isSidebarCollapsed ? 80 : 260 }}
          className="fixed left-0 top-0 bottom-0 z-20 bg-slate-950 border-r border-slate-800 flex flex-col shadow-xl transition-colors duration-300"
        >
          <div className="h-16 flex items-center px-6 gap-3 overflow-hidden border-b border-slate-800">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
              >
                SecureAuth
              </motion.span>
            )}
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-all relative group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-slate-500 group-hover:text-white")} />
                  {!isSidebarCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavAdmin"
                      className="absolute inset-0 bg-primary rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </motion.aside>

        <main
          className={cn(
            "flex-1 flex flex-col transition-all duration-300 min-h-screen",
            isSidebarCollapsed ? "pl-20" : "pl-[260px]"
          )}
        >
          <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </Button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search..."
                  className="w-64 pl-9 bg-slate-800/50 border-slate-700 text-sm h-9 rounded-lg focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800 relative rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-slate-600 rounded-full border-2 border-slate-900" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 h-auto rounded-xl hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border border-slate-700">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold text-white leading-none">Admin User</p>
                        <p className="text-xs text-slate-500 mt-1">Super Admin</p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-300">
                  <DropdownMenuLabel className="text-slate-400">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem className="hover:bg-slate-800 hover:text-white cursor-pointer rounded-lg m-1">
                    <Users className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-slate-800 hover:text-white cursor-pointer rounded-lg m-1">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg m-1"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 px-12 md:px-24 lg:px-32 py-12 md:py-16 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto w-full space-y-8">
              {pathname !== "/admin/dashboard" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl gap-2 pl-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to previous</span>
                  </Button>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
