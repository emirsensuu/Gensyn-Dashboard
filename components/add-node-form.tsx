"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { addNodeToUser } from "@/lib/users"
import type { Node } from "@/lib/types"
import { saveNodes } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddNodeFormProps {
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
}

// User nodes are stored in localStorage with this key pattern: user_{userId}_nodes
const USER_NODES_KEY_PREFIX = "user_"

const getUserNodes = (userId: string): string[] => {
  const key = `${USER_NODES_KEY_PREFIX}${userId}_nodes`
  const storedNodes = localStorage.getItem(key)
  return storedNodes ? JSON.parse(storedNodes) : []
}

export function AddNodeForm({ nodes, setNodes }: AddNodeFormProps) {
  const { user } = useAuth()
  const [peerName, setPeerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to add nodes")
      return
    }

    if (!peerName.trim()) {
      setError("Please enter a peer name")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const normalizedPeerName = peerName.trim().toUpperCase()
      console.log(`Adding node: ${normalizedPeerName}`)

      // Check if node already exists in the nodes array
      const existingNode = nodes.find(node => 
        node.peerName.toUpperCase() === normalizedPeerName
      )

      if (existingNode) {
        setError("This node has already been added")
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/peer?name=${encodeURIComponent(normalizedPeerName)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to fetch node data")
        return
      }

      // Create new node with unique ID
      const newNode: Node = {
        ...data,
        id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        peerName: normalizedPeerName,
      }

      // Add node to user's nodes
      addNodeToUser(user.id, newNode.id)

      // Update nodes state with the new node
      const updatedNodes = [...nodes, newNode]
      setNodes(updatedNodes)
      saveNodes(updatedNodes)
      setPeerName("")
    } catch (error) {
      console.error("Error adding node:", error)
      setError("An error occurred while adding the node")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="ADD YOUR NODE"
          value={peerName}
          onChange={(e) => setPeerName(e.target.value)}
          className="w-full p-2 border border-gensyn-text bg-[#E8CDC7] focus:outline-none"
          disabled={isLoading}
        />
        {error && <p className="absolute text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#806760] px-4 py-2 border border-gensyn-text border-l-0"
      >
        {isLoading ? "SEARCHING..." : "SEARCH"}
      </button>
    </form>
  )
}
