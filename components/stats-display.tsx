"use client"

import type { DashboardStats } from "@/lib/types"

interface StatsDisplayProps {
  stats: DashboardStats
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="border border-[#260f06] p-4 bg-[#caaca5]/30">
        <p className="text-sm">CURRENT NODES CONNECTED: {stats.nodesConnected}</p>
      </div>
      <div className="border border-[#260f06] p-4 bg-[#caaca5]/30">
        <p className="text-sm">TOTAL MODELS TRAINED: {stats.modelsTrained}</p>
      </div>
    </div>
  )
}
