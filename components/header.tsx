"use client"

import { useState } from "react"
import { Bell, User, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Notification } from "@/lib/types"
import { markNotificationAsRead, clearNotifications } from "@/lib/storage"
import { useAuth } from "@/components/auth-provider"

interface HeaderProps {
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
}

export function Header({ notifications, setNotifications }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id)
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleClearAll = () => {
    clearNotifications()
    setNotifications([])
  }

  return (
    <header className="w-full">
      <div className="flex justify-between items-center py-4 md:py-6">
        <h1 className="text-lg md:text-xl font-normal tracking-wide truncate">GENSYN TESTNET DASHBOARD</h1>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium">Notifications</span>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs">
                    Clear all
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`px-4 py-3 cursor-pointer ${notification.read ? "opacity-70" : ""}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="font-medium">{notification.nodeName}</div>
                        <div className="text-sm">{notification.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-4 py-2 border-b">
                <p className="font-medium">{user?.username || user?.email}</p>
              </div>
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#caaca5]/30 p-4 rounded-md mb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Notifications</span>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>

            {notificationsOpen && (
              <div className="border border-[#260f06] rounded-md p-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">No notifications</div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-2 py-2 cursor-pointer border-b border-dashed border-[#260f06] last:border-b-0 ${notification.read ? "opacity-70" : ""}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex flex-col space-y-1">
                          <div className="font-medium">{notification.nodeName}</div>
                          <div className="text-sm">{notification.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {notifications.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs w-full mt-2">
                        Clear all
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-medium">{user?.username || user?.email}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="dotted-divider my-2"></div>
    </header>
  )
}
