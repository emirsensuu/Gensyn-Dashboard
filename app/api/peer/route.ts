import { NextResponse } from "next/server"

// API endpoint
const API_BASE_URL = "https://dashboard.gensyn.ai/api/v1"

// Valid test nodes for development
const VALID_TEST_NODES = {
  "GILDED REPTILIAN APE": true,
  "THICK MUSE CHICKEN": true,
  "SHORT HOARSE BEE": true
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const peerName = searchParams.get("name")

  if (!peerName) {
    return NextResponse.json({ error: "Peer name is required" }, { status: 400 })
  }

  try {
    const formattedPeerName = peerName.toUpperCase()
    
    // In development, check if it's a valid test node
    if (process.env.NODE_ENV === 'development' && !VALID_TEST_NODES[formattedPeerName]) {
      return NextResponse.json({ error: "Invalid node name" }, { status: 404 })
    }

    // API'ye istek gönderirken peerName'i küçük harfe çeviriyoruz
    const normalizedPeerName = peerName.toLowerCase()
    console.log(`Fetching peer data for: ${normalizedPeerName}`)

    const response = await fetch(`${API_BASE_URL}/peer?name=${encodeURIComponent(normalizedPeerName)}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Node not found" }, { status: 404 })
      }
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    console.log(`API response for ${normalizedPeerName}:`, data)

    return NextResponse.json({
      id: data.peerId || `peer_${Math.random().toString(36).substring(2, 10)}`,
      peerName: formattedPeerName,
      peerId: data.peerId || `peer_${Math.random().toString(36).substring(2, 10)}`,
      status: "unknown", // Yeni eklenen node'lar için "unknown" olarak başlat
      reward: data.reward || 0,
      passedRounds: data.score || 0,
      lastUpdated: Date.now(),
      lastReward: data.reward || 0,
      online: data.online,
    })
  } catch (error) {
    console.error(`Failed to fetch peer data for ${peerName}:`, error)
    return NextResponse.json({ error: "Failed to fetch node data" }, { status: 500 })
  }
}
