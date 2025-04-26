"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LeaderboardEntry {
  rank: number
  name: string
  participation: number
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch this data from an API
        // For now, we'll use mock data
        const mockData: LeaderboardEntry[] = [
          { rank: 1, name: "THICK MUSE CHICKEN", participation: 431 },
          { rank: 2, name: "SHORT HOARSE BEE", participation: 431 },
          { rank: 3, name: "STRONG SUBTLE OPOSSUM", participation: 431 },
          { rank: 4, name: "PENSIVE SCREECHING ALBATROSS", participation: 431 },
          { rank: 5, name: "MARINE SLOW CASSOWARY", participation: 431 },
          { rank: 6, name: "STINKY SNEAKY IBIS", participation: 431 },
          { rank: 7, name: "BOLD THORNY VULTURE", participation: 431 },
          { rank: 8, name: "RAVENOUS ZEALOUS GIBBON", participation: 431 },
          { rank: 9, name: "NOISY LITHE HEDGEHOG", participation: 431 },
          { rank: 10, name: "STEALTHY DOWNY CHINCHILLA", participation: 431 },
        ]

        setEntries(mockData)
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <Card className="border-[#260f06] bg-[#caaca5]/30">
      <CardHeader className="border-b border-[#260f06] pb-2">
        <h3 className="text-lg font-normal">LEADERBOARD</h3>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 text-center">Loading leaderboard data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dashed border-[#260f06]">
                  <th className="py-2 px-2 sm:px-4 text-left">Rank</th>
                  <th className="py-2 px-2 sm:px-4 text-left">Name</th>
                  <th className="py-2 px-2 sm:px-4 text-right">Participation</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.rank} className="border-b border-dashed border-[#260f06]">
                    <td className="py-2 px-2 sm:px-4">{entry.rank}</td>
                    <td className="py-2 px-2 sm:px-4 truncate max-w-[150px] sm:max-w-none">{entry.name}</td>
                    <td className="py-2 px-2 sm:px-4 text-right">{entry.participation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
