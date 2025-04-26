"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getDashboardStats } from "@/lib/api"
import type { DashboardStats, Node, Notification } from "@/lib/types"
import { loadNodes, saveNodes, loadNotifications, saveNotifications, addNotification } from "@/lib/storage"
import { NodeTable } from "@/components/node-table"
import { AddNodeForm } from "@/components/add-node-form"
import { NotificationMenu } from "@/components/notification-menu"
import { checkNodeStatus } from "@/lib/api"

// Örnek node verileri
const exampleNodes: Node[] = [
  {
    id: "QmYCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU5",
    peerName: "GILDED REPTILIAN APE",
    peerId: "QmYCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU5",
    status: "inactive",
    reward: 1300.86,
    passedRounds: 242, // This will be displayed as Score
    lastUpdated: Date.now(),
    lastReward: 1300.86,
    online: false,
  },
  {
    id: "QmZCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU6",
    peerName: "THICK MUSE CHICKEN",
    peerId: "QmZCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU6",
    status: "unknown", // API hata verdiğinde "unknown" olarak gösteriyoruz
    reward: 1450.25,
    passedRounds: 431,
    lastUpdated: Date.now(),
    lastReward: 1450.25,
  },
  {
    id: "QmXCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU7",
    peerName: "SHORT HOARSE BEE",
    peerId: "QmXCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU7",
    status: "unknown", // API hata verdiğinde "unknown" olarak gösteriyoruz
    reward: 980.5,
    passedRounds: 215,
    lastUpdated: Date.now(),
    lastReward: 980.5,
  },
]

// Örnek bildirimler
const exampleNotifications: Notification[] = [
  {
    id: "notif_1",
    nodeId: "QmYCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU5",
    nodeName: "GILDED REPTILIAN APE",
    message: "Node is now offline",
    read: false,
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
  },
  {
    id: "notif_2",
    nodeId: "QmZCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU6",
    nodeName: "THICK MUSE CHICKEN",
    message: "Node completed a new round",
    read: true,
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
  },
  {
    id: "notif_3",
    nodeId: "QmXCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU7",
    nodeName: "SHORT HOARSE BEE",
    message: "Node status changed to unknown",
    read: false,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
  },
]

export default function Home() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    nodesConnected: 0,
    modelsTrained: 0,
    currentRound: 0,
    currentStage: 0,
  })
  const [nodes, setNodes] = useState<Node[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load nodes from local storage or use example nodes if none exist
    const storedNodes = loadNodes()
    setNodes(storedNodes.length > 0 ? storedNodes : exampleNodes)

    // Load notifications or use example notifications if none exist
    const storedNotifications = loadNotifications()
    if (storedNotifications.length === 0) {
      saveNotifications(exampleNotifications)
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      const data = await getDashboardStats()
      setStats(data)
    }

    fetchStats()

    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  const handleStatusChange = (node: Node, previousStatus: string) => {
    // Create a notification when node status changes
    const statusText = node.status === "active" ? "running" : node.status === "inactive" ? "offline" : "unknown"
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      nodeId: node.id,
      nodeName: node.peerName,
      message: `Node status changed to ${statusText}`,
      read: false,
      timestamp: Date.now(),
    }
    addNotification(notification)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      // Refresh dashboard stats
      const data = await getDashboardStats()
      setStats(data)

      // Refresh node statuses
      const updatedNodes = await Promise.all(
        nodes.map(async (node) => {
          const previousStatus = node.status
          try {
            console.log(`Refreshing node: ${node.peerName}`)
            const updatedNode = await checkNodeStatus(node)

            if (updatedNode.status !== previousStatus) {
              handleStatusChange(updatedNode, previousStatus)
            }

            return updatedNode
          } catch (error) {
            console.error(`Error updating node ${node.peerName}:`, error)
            // API hata verdiğinde mevcut durumu koruyoruz
            return {
              ...node,
              status: node.status, // Mevcut durumu koruyoruz
              lastUpdated: Date.now(),
            }
          }
        }),
      )

      setNodes(updatedNodes)
      saveNodes(updatedNodes)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gensyn-bg">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gensyn-bg text-gensyn-text p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-2">
          <h1 className="text-xl md:text-2xl font-normal">GENSYN TESTNET DASHBOARD by COMMUNITY</h1>
          <div className="flex items-center gap-2">
            <NotificationMenu />
            <div className="relative">
              <button className="p-2" onClick={() => setShowUserMenu(!showUserMenu)}>
                <Settings className="h-5 w-5" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gensyn-bg border border-gensyn-text shadow-lg z-50">
                  <div className="p-3 border-b border-gensyn-text">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left p-3 hover:bg-gensyn-muted/30 flex items-center gap-2"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dotted-divider my-4"></div>

        <section className="mb-8">
          <p className="mb-4">
            JOIN BY RUNNING AN RL SWARM NODE TO TRAIN YOUR LOCAL MODEL USING SWARM INTELLIGENCE. TRACK YOUR
            CONTRIBUTIONS BELOW.
          </p>
          <a
            href="https://github.com/gensyn-ai/rl-swarm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-gensyn-text px-4 py-2 hover:bg-gensyn-muted/30 transition-colors"
          >
            JOIN THE SWARM
          </a>
        </section>

        <div className="dotted-divider my-4"></div>

        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gensyn-text p-4">
              <p className="text-sm">CURRENT NODES CONNECTED: {stats.nodesConnected}</p>
            </div>
            <div className="border border-gensyn-text p-4">
              <p className="text-sm">TOTAL MODELS TRAINED: {stats.modelsTrained}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <AddNodeForm nodes={nodes} setNodes={setNodes} />
          </div>

          <NodeTable
            nodes={nodes}
            setNodes={setNodes}
            onStatusChange={handleStatusChange}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </section>

        <section className="mb-8">
          <div className="border border-gensyn-text p-4">
            <p className="text-sm">
              Round: {stats.currentRound} Stage: {stats.currentStage}
            </p>
          </div>
        </section>

        <div className="dotted-divider my-4"></div>

        <footer className="mt-8">
          <div className="bg-gensyn-accent/40 p-6 rounded-md text-center mb-6">
            <p>This is not an official Gensyn tool. This dashboard is an unofficial community project.</p>
          </div>
          <div className="text-center text-sm">
            <p>
              Crafted by{" "}
              <a
                href="https://x.com/0xemir_"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @0xemir_
              </a>{" "}
              for the{" "}
              <a href="https://gensyn.ai" className="text-gray-600 underline" target="_blank" rel="noopener noreferrer">
                Gensyn
              </a>{" "}
              community
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
