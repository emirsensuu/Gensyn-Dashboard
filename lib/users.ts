export interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this would be hashed
  nodes: string[]; // Array of node IDs
  notifications: string[]; // Array of notification IDs
}

// Get users from localStorage
const getUsers = (): StoredUser[] => {
  const users = localStorage.getItem('gensyn-users')
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem('gensyn-users', JSON.stringify(users))
}

// Find user by email
export const findUserByEmail = (email: string): StoredUser | undefined => {
  const users = getUsers()
  return users.find(user => user.email === email)
}

// Register new user
export const registerUser = (username: string, email: string, password: string): StoredUser => {
  const users = getUsers()
  
  if (findUserByEmail(email)) {
    throw new Error('Email already registered')
  }

  const newUser: StoredUser = {
    id: `user_${Math.random().toString(36).substring(2)}`,
    username,
    email,
    password, // In a real app, this would be hashed
    nodes: [],
    notifications: []
  }

  users.push(newUser)
  saveUsers(users)
  return newUser
}

// Verify user credentials
export const verifyCredentials = (email: string, password: string): StoredUser => {
  const user = findUserByEmail(email)
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password')
  }

  return user
}

// Add node to user
export const addNodeToUser = (userId: string, nodeId: string) => {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }

  if (!users[userIndex].nodes.includes(nodeId)) {
    users[userIndex].nodes.push(nodeId)
    saveUsers(users)
  }
}

// Add notification to user
export const addNotificationToUser = (userId: string, notificationId: string) => {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }

  if (!users[userIndex].notifications.includes(notificationId)) {
    users[userIndex].notifications.push(notificationId)
    saveUsers(users)
  }
}

// Get user's nodes
export const getUserNodes = (userId: string): string[] => {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  return user ? user.nodes : []
}

// Get user's notifications
export const getUserNotifications = (userId: string): string[] => {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  return user ? user.notifications : []
} 