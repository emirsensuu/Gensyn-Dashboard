export interface Node {
  id: string
  peerName: string
  peerId: string
  status: "active" | "inactive" | "unknown"
  reward: number
  passedRounds: number
  lastUpdated: number
  lastReward?: number
  online?: boolean
}

export interface DashboardStats {
  nodesConnected: number
  modelsTrained: number
  currentRound: number
  currentStage: number
}

export interface Notification {
  id: string
  nodeId: string
  nodeName: string
  message: string
  read: boolean
  timestamp: number
}
