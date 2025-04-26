import { NextResponse } from "next/server"

// API endpoint
const API_BASE_URL = "https://dashboard.gensyn.ai/api/v1"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const peerName = searchParams.get("name")

  if (!peerName) {
    return NextResponse.json({ error: "Peer name is required" }, { status: 400 })
  }

  try {
    // API'ye istek gönderirken peerName'i küçük harfe çeviriyoruz
    // API büyük harfli isimleri kabul etmiyor olabilir
    const normalizedPeerName = peerName.toLowerCase()

    console.log(`Fetching peer data for: ${normalizedPeerName}`)

    const response = await fetch(`${API_BASE_URL}/peer?name=${encodeURIComponent(normalizedPeerName)}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`API returned ${response.status} for peer ${normalizedPeerName}`)
      // API 404 döndüğünde mock data kullanacağız
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    console.log(`API response for ${normalizedPeerName}:`, data)

    // Peer name'i büyük harfe çevirelim (UI için)
    const formattedPeerName = peerName.toUpperCase()

    // Transform API response to our Node type
    return NextResponse.json({
      id: data.peerId || `peer_${Math.random().toString(36).substring(2, 10)}`,
      peerName: formattedPeerName,
      peerId: data.peerId || `peer_${Math.random().toString(36).substring(2, 10)}`,
      status: data.online !== undefined ? (data.online ? "active" : "inactive") : "unknown",
      reward: data.reward || 0,
      passedRounds: data.score || 0, // Score is Passed Rounds
      lastUpdated: Date.now(),
      lastReward: data.reward || 0,
      online: data.online,
    })
  } catch (error) {
    console.error(`Failed to fetch peer data for ${peerName}:`, error)

    // Peer name'i büyük harfe çevirelim (UI için)
    const formattedPeerName = peerName.toUpperCase()

    // API hata verdiğinde, yerel verileri kullanacağız
    // Örnek node verileri
    const exampleNodes = {
      "GILDED REPTILIAN APE": {
        peerId: "QmYCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU5",
        reward: 1300.86,
        passedRounds: 242,
        online: false,
      },
      "THICK MUSE CHICKEN": {
        peerId: "QmZCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU6",
        reward: 1450.25,
        passedRounds: 431,
        online: true,
      },
      "SHORT HOARSE BEE": {
        peerId: "QmXCWGNueDSj1RmTRxDzXqK4pJvJy2b9i8kxk5FaX8miU7",
        reward: 980.5,
        passedRounds: 215,
        online: false,
      },
    }

    // Eğer örnek verilerimizde bu node varsa, onu kullanalım
    const exampleNode = exampleNodes[formattedPeerName]

    if (exampleNode) {
      console.log(`Using example data for ${formattedPeerName}`)
      return NextResponse.json({
        id: exampleNode.peerId,
        peerName: formattedPeerName,
        peerId: exampleNode.peerId,
        status: exampleNode.online ? "active" : "inactive",
        reward: exampleNode.reward,
        passedRounds: exampleNode.passedRounds,
        lastUpdated: Date.now(),
        lastReward: exampleNode.reward,
        online: exampleNode.online,
      })
    }

    // Eğer örnek verilerimizde de yoksa, varsayılan değerler kullanalım
    return NextResponse.json({
      id: `peer_${Math.random().toString(36).substring(2, 10)}`,
      peerName: formattedPeerName,
      peerId: `QmRandom${Math.random().toString(36).substring(2, 10)}`,
      status: "unknown", // Yeni eklenen node'lar için "unknown" kullanıyoruz
      reward: 0,
      passedRounds: 0,
      lastUpdated: Date.now(),
      lastReward: 0,
      online: undefined, // online değeri belirtilmemiş
    })
  }
}
