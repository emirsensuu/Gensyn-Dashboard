import type { Node, Notification } from "./types"

// Local storage keys
const NODES_STORAGE_KEY = "gensyn-nodes"
const NOTIFICATIONS_STORAGE_KEY = "gensyn-notifications"

// Save nodes to local storage for specific user
export function saveNodes(nodes: Node[], userId: string): void {
  if (typeof window !== "undefined") {
    const key = `${NODES_STORAGE_KEY}_${userId}`
    localStorage.setItem(key, JSON.stringify(nodes))
  }
}

// Load nodes from local storage for specific user
export function loadNodes(userId: string): Node[] {
  if (typeof window !== "undefined") {
    const key = `${NODES_STORAGE_KEY}_${userId}`
    const storedNodes = localStorage.getItem(key)
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
  const notifications = loadNotifications()
  notifications.push(notification)
  saveNotifications(notifications)
}

// Clear all storage for a user
export function clearUserStorage(userId: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${NODES_STORAGE_KEY}_${userId}`)
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
    localStorage.removeItem("gensyn-session")
    localStorage.removeItem("gensyn-users")
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
