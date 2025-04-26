import { NextResponse } from "next/server"

// API endpoints
const API_BASE_URL = "https://dashboard.gensyn.ai/api/v1"
const API_ENDPOINTS = {
  nodesConnected: `${API_BASE_URL}/nodes-connected`,
  modelsTrained: `${API_BASE_URL}/unique-voters`,
  roundStage: `${API_BASE_URL}/round-stage`,
}

export async function GET() {
  try {
    // Make parallel requests to all endpoints
    const [nodesConnectedRes, modelsTrainedRes, roundStageRes] = await Promise.all([
      fetch(API_ENDPOINTS.nodesConnected, { cache: "no-store" }),
      fetch(API_ENDPOINTS.modelsTrained, { cache: "no-store" }),
      fetch(API_ENDPOINTS.roundStage, { cache: "no-store" }),
    ])

    // Parse the responses
    const nodesConnected = await nodesConnectedRes.json()
    const modelsTrained = await modelsTrainedRes.json()
    const roundStage = await roundStageRes.json()

    return NextResponse.json({
      nodesConnected: Number.parseInt(nodesConnected) || 222,
      modelsTrained: Number.parseInt(modelsTrained) || 24596,
      currentRound: roundStage?.round || 431,
      currentStage: roundStage?.stage || 2,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)

    // Return fallback data if API fails
    return NextResponse.json({
      nodesConnected: 222,
      modelsTrained: 24596,
      currentRound: 431,
      currentStage: 2,
    })
  }
}
