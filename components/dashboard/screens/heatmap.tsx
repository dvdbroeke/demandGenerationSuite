"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const partitions = [
  "Cola Regular",
  "Cola Zero",
  "Cola Diet",
  "Citrus",
  "Cherry/Dark",
  "Energy",
  "Lemon-Lime",
  "Orange",
]

// Overlap index data (symmetric matrix)
const overlapData: Record<string, Record<string, number>> = {
  "Cola Regular": {
    "Cola Regular": 100,
    "Cola Zero": 72,
    "Cola Diet": 65,
    Citrus: 34,
    "Cherry/Dark": 45,
    Energy: 28,
    "Lemon-Lime": 38,
    Orange: 31,
  },
  "Cola Zero": {
    "Cola Regular": 72,
    "Cola Zero": 100,
    "Cola Diet": 78,
    Citrus: 42,
    "Cherry/Dark": 51,
    Energy: 35,
    "Lemon-Lime": 44,
    Orange: 38,
  },
  "Cola Diet": {
    "Cola Regular": 65,
    "Cola Zero": 78,
    "Cola Diet": 100,
    Citrus: 39,
    "Cherry/Dark": 47,
    Energy: 31,
    "Lemon-Lime": 41,
    Orange: 35,
  },
  Citrus: {
    "Cola Regular": 34,
    "Cola Zero": 42,
    "Cola Diet": 39,
    Citrus: 100,
    "Cherry/Dark": 56,
    Energy: 44,
    "Lemon-Lime": 68,
    Orange: 74,
  },
  "Cherry/Dark": {
    "Cola Regular": 45,
    "Cola Zero": 51,
    "Cola Diet": 47,
    Citrus: 56,
    "Cherry/Dark": 100,
    Energy: 52,
    "Lemon-Lime": 48,
    Orange: 53,
  },
  Energy: {
    "Cola Regular": 28,
    "Cola Zero": 35,
    "Cola Diet": 31,
    Citrus: 44,
    "Cherry/Dark": 52,
    Energy: 100,
    "Lemon-Lime": 39,
    Orange: 41,
  },
  "Lemon-Lime": {
    "Cola Regular": 38,
    "Cola Zero": 44,
    "Cola Diet": 41,
    Citrus: 68,
    "Cherry/Dark": 48,
    Energy: 39,
    "Lemon-Lime": 100,
    Orange: 62,
  },
  Orange: {
    "Cola Regular": 31,
    "Cola Zero": 38,
    "Cola Diet": 35,
    Citrus: 74,
    "Cherry/Dark": 53,
    Energy: 41,
    "Lemon-Lime": 62,
    Orange: 100,
  },
}

function getColorForValue(value: number): string {
  if (value === 100) return "bg-teal-400"
  if (value >= 70) return "bg-teal-500"
  if (value >= 55) return "bg-teal-600"
  if (value >= 45) return "bg-teal-700"
  if (value >= 35) return "bg-teal-800"
  return "bg-teal-900"
}

function getTextColorForValue(value: number): string {
  if (value >= 55) return "text-zinc-900"
  return "text-zinc-100"
}

export function HeatmapScreen() {
  const [hoveredCell, setHoveredCell] = useState<{
    row: string
    col: string
    value: number
  } | null>(null)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">
            Consumer Partitions Overlap Matrix
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Shows relative consumer overlap behavior between partition pairs.
            Higher values indicate stronger cross-purchase affinity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Overlap Index:</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 bg-teal-900 rounded-sm" />
            <span className="text-xs text-zinc-500">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 bg-teal-600 rounded-sm" />
            <span className="text-xs text-zinc-500">Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 bg-teal-400 rounded-sm" />
            <span className="text-xs text-zinc-500">High</span>
          </div>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-zinc-500 bg-zinc-900/80 border-b border-zinc-800 sticky left-0 z-10 min-w-[120px]">
                    Partition
                  </th>
                  {partitions.map((col) => (
                    <th
                      key={col}
                      className="p-3 text-center text-xs font-medium text-zinc-400 bg-zinc-900/80 border-b border-zinc-800 min-w-[90px]"
                    >
                      <span className="block truncate">{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partitions.map((row) => (
                  <tr key={row}>
                    <td className="p-3 text-sm font-medium text-zinc-300 bg-zinc-900/80 border-b border-zinc-800/50 sticky left-0 z-10">
                      {row}
                    </td>
                    {partitions.map((col) => {
                      const value = overlapData[row][col]
                      const isHovered =
                        hoveredCell?.row === row && hoveredCell?.col === col
                      return (
                        <td
                          key={col}
                          className="p-0 border-b border-zinc-800/50"
                          onMouseEnter={() =>
                            setHoveredCell({ row, col, value })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div
                            className={`relative flex items-center justify-center h-14 transition-all ${getColorForValue(value)} ${
                              isHovered
                                ? "ring-2 ring-white/50 z-10"
                                : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-semibold ${getTextColorForValue(value)}`}
                            >
                              {value}
                            </span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tooltip / Detail Panel */}
      {hoveredCell && (
        <Card className="bg-zinc-900 border-zinc-700 shadow-xl fixed bottom-6 right-6 w-80 z-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-100">
              Overlap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Partition Pair:</span>
              <span className="text-sm font-medium text-zinc-100">
                {hoveredCell.row} ↔ {hoveredCell.col}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Overlap Index:</span>
              <span className="text-sm font-bold text-teal-400">
                {hoveredCell.value}
              </span>
            </div>
            <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
              {hoveredCell.value >= 70
                ? "High overlap indicates strong cross-purchase behavior. Consumers frequently buy from both partitions."
                : hoveredCell.value >= 45
                  ? "Moderate overlap suggests some shared consumer base with opportunity for cross-selling."
                  : "Low overlap indicates distinct consumer segments with limited cross-purchase behavior."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-zinc-100 mb-2">
              Highest Overlap
            </h4>
            <p className="text-2xl font-bold text-teal-400">78</p>
            <p className="text-xs text-zinc-400 mt-1">
              Cola Zero ↔ Cola Diet
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Health-conscious consumers show strong cross-partition behavior
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-zinc-100 mb-2">
              Lowest Overlap
            </h4>
            <p className="text-2xl font-bold text-zinc-400">28</p>
            <p className="text-xs text-zinc-400 mt-1">
              Cola Regular ↔ Energy
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Distinct consumer segments with different occasion drivers
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-zinc-100 mb-2">
              Flavor Cluster
            </h4>
            <p className="text-2xl font-bold text-amber-400">74</p>
            <p className="text-xs text-zinc-400 mt-1">Citrus ↔ Orange</p>
            <p className="text-xs text-zinc-500 mt-2">
              Citrus flavor family shows strong internal overlap
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
