import type { Node, DashboardStats } from "./types"

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Use our Next.js API route instead of calling the external API directly
    const response = await fetch("/api/dashboard-stats", { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    // Return fallback data if API fails
    return {
      nodesConnected: 222,
      modelsTrained: 24596,
      currentRound: 431,
      currentStage: 2,
    }
  }
}

// Get peer data by name
export async function getPeerData(peerName: string): Promise<Node | null> {
  if (!peerName) return null

  try {
    console.log(`Fetching peer data for: ${peerName}`)
    // Use our Next.js API route instead of calling the external API directly
    const response = await fetch(`/api/peer?name=${encodeURIComponent(peerName)}`, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    console.log(`Received peer data:`, data)
    return data
  } catch (error) {
    console.error(`Failed to fetch peer data for ${peerName}:`, error)
    // Return null to indicate failure
    return null
  }
}

// Check node status based on score changes
export async function checkNodeStatus(node: Node): Promise<Node> {
  try {
    console.log(`Checking status for node: ${node.peerName}`)
    // Fetch the latest data for this node using our API route
    const response = await fetch(`/api/peer?name=${encodeURIComponent(node.peerName)}`, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    const newReward = data.reward || 0

    // Determine status based on online status from API or score change
    let status: "active" | "inactive" | "unknown" = "unknown"

    if (data.online !== undefined) {
      status = data.online ? "active" : "inactive"
    } else if (node.lastReward !== undefined) {
      if (newReward > node.lastReward) {
        status = "active"
      } else if (newReward === node.lastReward) {
        status = "inactive"
      }
    }

    return {
      ...node,
      peerId: data.peerId || node.peerId,
      status,
      reward: data.reward || 0,
      passedRounds: data.score || 0, // Score field
      lastReward: newReward,
      lastUpdated: Date.now(),
    }
  } catch (error) {
    console.error(`Failed to check status for node ${node.peerName}:`, error)

    // API hata verdiğinde mevcut durumu koruyoruz
    return {
      ...node,
      lastUpdated: Date.now(),
    }
  }
}
