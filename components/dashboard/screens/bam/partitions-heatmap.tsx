"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BAMLogo } from "@/components/ui/platform-logos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface BAMPartitionsHeatmapProps {
  onNavigate?: (screen: string) => void
  onNavigateToSkuHeatmap?: () => void
}

const markets = [
  { code: "sp", name: "Spain" },
  { code: "de", name: "Germany" },
  { code: "gb", name: "Great Britain" },
  { code: "fr", name: "France" },
  { code: "be", name: "Belgium" },
  { code: "nl", name: "Netherlands" },
  { code: "it", name: "Italy" },
  { code: "pl", name: "Poland" },
  { code: "ro", name: "Romania" },
  { code: "ch", name: "Switzerland" },
  { code: "at", name: "Austria" },
  { code: "gr", name: "Greece" },
  { code: "rs", name: "Serbia" },
]

const years = ["2025", "2024", "2023", "2022", "2021", "2020"]

// Row/column labels for the heatmap (13 partitions)
const partitions = [
  "Diet", "Coca-Cola Zero", "Regular Calorie", 
  "No Calorie/Diet", "Regular Calorie (Citrus)", "Cherry/Dark fruit", "Specialty flavours", 
  "Energy >=500ML", "Energy <500ML", "Adv. Hydration", "Juices & Smoothies", "Water, Tea & Coffee", "PL"
]

// Overlap matrix data (13x13 matrix) - scrambled but preserving patterns
// Diet and Zero still show meaningful overlap, Energy partitions correlate, etc.
const overlapData: number[][] = [
  // Diet
  [9.7, 5.2, 2.1, 3.8, 1.6, 4.1, 1.8, 1.6, 0.7, 1.4, 1.8, 1.6, 2.4],
  // Coca-Cola Zero (merged)
  [5.2, 7.9, 1.6, 2.9, 1.6, 3.8, 2.1, 1.2, 0.8, 1.5, 2.4, 2.3, 1.5],
  // Regular Calorie
  [2.1, 1.6, 5.3, 4.0, 2.3, 2.3, 3.7, 1.9, 2.8, 2.5, 2.3, 2.3, 1.5],
  // No Calorie/Diet Citrus
  [3.8, 5.1, 2.0, 7.6, 3.6, 2.1, 2.6, 3.3, 1.3, 1.8, 2.6, 3.2, 2.0],
  // Regular Calorie Citrus
  [1.6, 1.7, 4.0, 3.6, 4.3, 2.3, 3.5, 3.8, 1.6, 3.9, 2.9, 2.4, 1.9],
  // Cherry/Dark fruit
  [4.1, 4.0, 2.3, 2.1, 2.3, 6.8, 5.9, 5.9, 1.3, 2.8, 2.1, 1.9, 2.0],
  // Specialty flavours
  [1.8, 2.1, 2.3, 2.6, 3.5, 5.9, 11.8, 1.5, 0.7, 4.2, 2.1, 1.5, 1.7],
  // Energy >=500ML
  [1.6, 1.2, 3.7, 3.3, 3.8, 5.9, 1.5, 14.2, 4.8, 3.9, 3.2, 3.0, 1.2],
  // Energy <500ML
  [0.7, 0.6, 1.9, 1.3, 1.6, 1.3, 0.7, 4.8, 7.2, 4.3, 1.7, 2.6, 0.8],
  // Advanced Hydration
  [1.4, 1.5, 2.8, 1.8, 3.9, 2.8, 4.2, 3.9, 4.3, 7.1, 2.4, 3.0, 1.5],
  // Juices and Smoothies
  [1.8, 2.1, 2.5, 2.6, 2.9, 2.1, 2.1, 3.2, 1.7, 2.4, 4.0, 2.8, 2.4],
  // Water, Tea and Coffee
  [1.6, 2.3, 2.3, 3.2, 2.4, 1.9, 1.5, 3.0, 2.6, 3.0, 2.8, 4.9, 1.9],
  // PL
  [2.4, 1.7, 1.5, 2.0, 1.9, 2.0, 1.7, 1.2, 0.8, 1.5, 2.4, 1.9, 3.9],
]

const getOverlapColor = (value: number): string => {
  if (value >= 10) return "bg-teal-500"
  if (value >= 6) return "bg-teal-600"
  if (value >= 4) return "bg-teal-700"
  if (value >= 2) return "bg-teal-800"
  return "bg-teal-900/50"
}

// Check if cell is the Coca-Cola Zero (All) diagonal cell (row 1, col 1)
const isCokeZeroCellDiagonal = (rowIdx: number, colIdx: number): boolean => {
  return rowIdx === 1 && colIdx === 1
}

const handleCellDoubleClick = (rowIdx: number, colIdx: number) => {
  // Handle double click event here
}

export function BAMPartitionsHeatmap({ onNavigate, onNavigateToSkuHeatmap }: BAMPartitionsHeatmapProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    // Only Coca-Cola Zero (All) diagonal cell is clickable
    if (isCokeZeroCellDiagonal(rowIdx, colIdx) && onNavigateToSkuHeatmap) {
      onNavigateToSkuHeatmap()
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <BAMLogo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Brand Accelerator Model</h1>
            <p className="text-xs text-zinc-500">Strategic Market Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
              {markets.map((market) => (
                <SelectItem key={market.code} value={market.code} className="text-zinc-100 text-xs">
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {years.map((year) => (
                <SelectItem key={year} value={year} className="text-zinc-100 text-xs">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button 
          onClick={() => onNavigate?.("overview")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Overview
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">
          Partitions Heatmap
        </button>
        <button 
          onClick={() => onNavigate?.("partition-tree")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Partition Tree
        </button>
        <button 
          onClick={() => onNavigate?.("market-map")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Market Map
        </button>
        <button 
          onClick={() => onNavigate?.("key-insights")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          AI-Driven Insights
        </button>
      </div>

      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Consumer Partitions - Relative Overlap Index</h2>
        <p className="text-sm text-zinc-500">How consumers' behaviour shapes the NARTD market. Higher values indicate stronger consumer overlap between partitions.</p>
      </div>

      {/* Main Heatmap */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="h-24">
                  <th className="p-1 text-left text-zinc-500 font-normal w-28 align-bottom"></th>
                  {partitions.map((p, idx) => (
                    <th key={idx} className="p-1 text-center text-zinc-400 font-normal min-w-[48px] align-bottom relative">
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -rotate-45 origin-bottom-left whitespace-nowrap text-[9px]">
                        {p}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partitions.map((rowPartition, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="p-1 text-right text-zinc-400 font-normal pr-2 whitespace-nowrap">
                      {rowPartition}
                    </td>
                    {overlapData[rowIdx].map((value, colIdx) => {
                      const isHighlightedCell = isCokeZeroCellDiagonal(rowIdx, colIdx)
                      
                      return (
                        <td key={colIdx} className="p-0.5">
                          <div 
                            onClick={() => handleCellClick(rowIdx, colIdx)}
                            className={cn(
                              "w-full h-8 flex items-center justify-center rounded-sm text-[10px] font-medium transition-all",
                              getOverlapColor(value),
                              rowIdx === colIdx ? "text-zinc-100" : "text-zinc-200",
                              isHighlightedCell && "ring-2 ring-amber-400 cursor-pointer hover:brightness-110"
                            )}
                            title={isHighlightedCell ? "Click to view Shopper Partitions for Coca-Cola Zero" : undefined}
                          >
                            {value.toFixed(1)}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] text-zinc-500">
              <span className="font-medium">Overlap Index:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-900/50" />
                <span>Low (0-2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-800" />
                <span>2-4</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-700" />
                <span>4-6</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-600" />
                <span>6-10</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-500" />
                <span>High (10+)</span>
              </div>
            </div>
            
            {/* Highlighted cell hint */}
            <div className="flex items-center gap-2 text-[10px] text-amber-400">
              <div className="w-6 h-6 rounded-sm bg-teal-500 ring-2 ring-amber-400" />
              <span>Click highlighted cell to view Shopper Partitions</span>
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
