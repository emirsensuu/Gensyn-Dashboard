"use client"

import type React from "react"

import { useState } from "react"
import { getPeerData } from "@/lib/api"
import type { Node } from "@/lib/types"
import { saveNodes } from "@/lib/storage"

interface AddNodeFormProps {
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
}

export function AddNodeForm({ nodes, setNodes }: AddNodeFormProps) {
  const [peerName, setPeerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!peerName.trim()) {
      setError("Please enter a peer name")
      return
    }

    // Peer name'i normalize edelim
    const normalizedPeerName = peerName.trim().toUpperCase()

    // Check if node already exists
    if (nodes.some((node) => node.peerName.toUpperCase() === normalizedPeerName)) {
      setError("This node is already added")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Adding node: ${normalizedPeerName}`)
      const nodeData = await getPeerData(normalizedPeerName)

      if (!nodeData) {
        setError("Failed to fetch node data. Please try again.")
        return
      }

      const updatedNodes = [...nodes, nodeData]
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
        className="bg-[#E8CDC7] hover:bg-[#DEC2BC] px-4 py-2 border border-gensyn-text border-l-0"
      >
        {isLoading ? "SEARCHING..." : "SEARCH"}
      </button>
    </form>
  )
}
