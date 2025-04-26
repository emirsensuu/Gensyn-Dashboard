import type { Node, Notification } from "./types"

// Local storage keys
const NODES_STORAGE_KEY = "gensyn-nodes"
const NOTIFICATIONS_STORAGE_KEY = "gensyn-notifications"

// Save nodes to local storage
export function saveNodes(nodes: Node[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(NODES_STORAGE_KEY, JSON.stringify(nodes))
  }
}

// Load nodes from local storage
export function loadNodes(): Node[] {
  if (typeof window !== "undefined") {
    const storedNodes = localStorage.getItem(NODES_STORAGE_KEY)
    return storedNodes ? JSON.parse(storedNodes) : []
  }
  return []
}

// Save notifications to local storage
export function saveNotifications(notifications: Notification[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  }
}

// Load notifications from local storage
export function loadNotifications(): Notification[] {
  if (typeof window !== "undefined") {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    return storedNotifications ? JSON.parse(storedNotifications) : []
  }
  return []
}

// Mark notification as read
export function markNotificationAsRead(notificationId: string): void {
  if (typeof window !== "undefined") {
    const notifications = loadNotifications()
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    )
    saveNotifications(updatedNotifications)
  }
}

// Add a new notification
export function addNotification(notification: Notification): void {
  if (typeof window !== "undefined") {
    const notifications = loadNotifications()
    saveNotifications([notification, ...notifications])
  }
}

// Clear all notifications
export function clearNotifications(): void {
  if (typeof window !== "undefined") {
    saveNotifications([])
  }
}

// Mark all notifications as read
export function markAllNotificationsAsRead(): void {
  if (typeof window !== "undefined") {
    const notifications = loadNotifications()
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))
    saveNotifications(updatedNotifications)
  }
}
