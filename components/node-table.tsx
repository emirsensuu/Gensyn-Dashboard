"use client"

import { useState, useEffect } from "react"
import { Settings, Copy, Check, Trash2 } from "lucide-react"
import type { Node } from "@/lib/types"
import { saveNodes } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import { getUserNodes } from "@/lib/users"

interface NodeTableProps {
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
  onStatusChange: (node: Node, previousStatus: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function NodeTable({ nodes, setNodes, onStatusChange, onRefresh, isRefreshing }: NodeTableProps) {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Filter nodes to only show user's nodes
  const userNodes = nodes.filter((node) => {
    if (!user) return false
    const userNodeIds = getUserNodes(user.id)
    return userNodeIds.includes(node.id)
  })

  const filteredNodes = userNodes.filter((node) => {
    if (activeFilter === "all") return true
    if (activeFilter === "active") return node.status === "active"
    if (activeFilter === "inactive") return node.status === "inactive"
    if (activeFilter === "unknown") return node.status === "unknown"
    return true
  })

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return <span className="status-indicator status-active"></span>
      case "inactive":
        return <span className="status-indicator status-inactive"></span>
      default:
        return <span className="status-indicator status-unknown"></span>
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const handleRemoveNode = (nodeId: string) => {
    if (window.confirm("Are you sure you want to remove this node?")) {
      const updatedNodes = nodes.filter((node) => node.id !== nodeId)
      setNodes(updatedNodes)
      saveNodes(updatedNodes)
    }
  }

  // Format peer names consistently
  const formatPeerName = (name: string) => {
    return name.toUpperCase()
  }

  return (
    <div className="border border-gensyn-text">
      <div className="flex border-b border-gensyn-text">
        <button
          className={`px-4 py-2 ${activeFilter === "all" ? "bg-gensyn-search" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All Nodes
        </button>
        <button
          className={`px-4 py-2 ${activeFilter === "active" ? "bg-gensyn-search" : ""}`}
          onClick={() => setActiveFilter("active")}
        >
          Running
        </button>
        <button
          className={`px-4 py-2 ${activeFilter === "unknown" ? "bg-gensyn-search" : ""}`}
          onClick={() => setActiveFilter("unknown")}
        >
          Unknown
        </button>
        <button
          className={`px-4 py-2 ${activeFilter === "inactive" ? "bg-gensyn-search" : ""}`}
          onClick={() => setActiveFilter("inactive")}
        >
          Offline
        </button>
        <div className="ml-auto flex items-center">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-4 py-2 bg-[#E8CDC7] hover:bg-[#DEC2BC]"
          >
            <Settings className="h-4 w-4" />
            <span>REFRESH</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        {filteredNodes.length === 0 ? (
          <div className="py-8 text-center">
            <p>No nodes found. Add a node to get started.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 border-b border-dotted border-gensyn-text text-xs">Status</th>
                    <th className="text-left py-2 border-b border-dotted border-gensyn-text text-xs">Peer Name</th>
                    <th className="text-left py-2 border-b border-dotted border-gensyn-text text-xs">Peer ID</th>
                    <th className="text-left py-2 border-b border-dotted border-gensyn-text text-xs">Score</th>
                    <th className="text-left py-2 border-b border-dotted border-gensyn-text text-xs">Rewards</th>
                    <th className="text-left py-2 border-b border-dotted border-gensyn-text text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNodes.map((node) => (
                    <tr key={node.id} className="border-b border-dotted border-gensyn-text">
                      <td className="py-2">
                        {getStatusIndicator(node.status)}
                        <span className="hidden sm:inline">
                          {node.status === "active" ? "Running" : node.status === "inactive" ? "Offline" : "Unknown"}
                        </span>
                      </td>
                      <td className="py-2 truncate max-w-[100px] sm:max-w-none">
                        <button
                          onClick={() => handleCopy(node.peerName)}
                          className="flex items-center gap-1 hover:text-gensyn-accent text-sm"
                          title="Copy Peer Name"
                        >
                          {formatPeerName(node.peerName)}
                          {copiedText === node.peerName ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 opacity-50" />
                          )}
                        </button>
                      </td>
                      <td className="py-2 truncate max-w-[100px] sm:max-w-none">
                        <button
                          onClick={() => handleCopy(node.peerId)}
                          className="flex items-center gap-1 hover:text-gensyn-accent text-sm"
                          title="Copy Peer ID"
                        >
                          {node.peerId}
                          {copiedText === node.peerId ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 opacity-50" />
                          )}
                        </button>
                      </td>
                      <td className="py-2">{node.passedRounds}</td>
                      <td className="py-2">{node.reward.toFixed(2)}</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleRemoveNode(node.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove Node"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gensyn-text">
              Note: Nodes with "Unknown" status will be automatically updated every 45 minutes.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
