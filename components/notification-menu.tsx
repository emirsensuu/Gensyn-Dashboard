"use client"

import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { loadNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/storage"
import type { Notification } from "@/lib/types"

export function NotificationMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load notifications from local storage
    const storedNotifications = loadNotifications()
    setNotifications(storedNotifications)

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id)
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button className="relative p-2" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gensyn-bg border border-gensyn-text shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-gensyn-text">
            <h3 className="font-medium">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs underline hover:text-gensyn-accent">
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gensyn-text cursor-pointer hover:bg-gensyn-muted/30 ${
                    notification.read ? "opacity-70" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="font-medium">{notification.nodeName}</div>
                  <div className="text-sm">{notification.message}</div>
                  <div className="text-xs text-gensyn-text/70 mt-1">{formatDate(notification.timestamp)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
