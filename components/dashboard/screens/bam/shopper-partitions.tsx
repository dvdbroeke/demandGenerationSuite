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
import { ArrowLeft, ChevronRight, AlertCircle, AlertTriangle, Zap } from "lucide-react"

interface ShopperPartitionsProps {
  onBack: () => void
  onNavigate?: (screen: string) => void
  onNavigateToFuelight?: () => void
  onNavigateToInitiative?: () => void
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

// Row labels (pack size / format)
const rowLabels = [
  { packType: "Single Pack", serveType: "Single Serve", size: "150mL", rsv: "$3.8M", rsvPct: "1.1%" },
  { packType: "Single Pack", serveType: "Single Serve", size: "250mL", rsv: "$0.2M", rsvPct: "0.1%" },
  { packType: "Single Pack", serveType: "Single Serve", size: "330mL", rsv: "$21.6M", rsvPct: "5.8%" },
  { packType: "Single Pack", serveType: "Single Serve", size: "500mL", rsv: "$78.4M", rsvPct: "20.2%" },
  { packType: "Single Pack", serveType: "Multi Serve", size: "1.25L", rsv: "$8.5M", rsvPct: "2.4%" },
  { packType: "Single Pack", serveType: "Multi Serve", size: "1.5L", rsv: "$1.3M", rsvPct: "0.4%" },
  { packType: "Single Pack", serveType: "Multi Serve", size: "1.75L", rsv: "$2.4M", rsvPct: "0.7%" },
  { packType: "Single Pack", serveType: "Multi Serve", size: "2L", rsv: "$56.8M", rsvPct: "14.6%" },
  { packType: "Multi Pack", serveType: "Single Serve", size: "8 x 330mL", rsv: "$44.2M", rsvPct: "11.4%" },
  { packType: "Multi Pack", serveType: "Single Serve", size: "18 x 330mL", rsv: "$15.4M", rsvPct: "4.0%" },
  { packType: "Multi Pack", serveType: "Single Serve", size: "24 x 330mL", rsv: "$108.6M", rsvPct: "28.0%" },
]

// Column headers
const columnHeaders = {
  singlePack: {
    singleServe: ["150mL", "250mL", "330mL", "500mL"],
    multiServe: ["1.25L", "1.5L", "1.75L", "2L"]
  },
  multiPack: {
    singleServe: ["8 x 330mL", "18 x 330mL", "24 x 330mL"]
  }
}

// ROI data matrix (11 rows x 11 cols) - preserving patterns
const roiData: (number | string)[][] = [
  // 150mL row
  [18.7, 5.9, 7.8, 5.2, 1.9, 5.1, 4.9, 2.2, 2.3, 0.9, 3.0],
  // 250mL row
  [5.9, 9.4, 9.4, 5.9, 1.6, 2.3, 3.1, 3.5, 3.0, 1.4, 3.4],
  // 330mL row
  [7.8, 9.4, 15.1, 12.5, 5.1, 4.1, 12.1, 2.4, 3.8, 0.9, 0.7],
  // 500mL row
  [5.2, 5.9, 12.5, 17.4, 3.5, 3.7, 6.0, 4.9, 3.6, 1.5, 2.8],
  // 1.25L row
  [1.9, 1.6, 5.1, 3.5, 8.5, 10.1, 2.2, 5.0, 3.1, 3.2, 0.7],
  // 1.5L row
  [5.1, 2.3, 4.1, 3.7, 10.1, "-", 15.1, 5.2, 1.6, 3.0, 3.6],
  // 1.75L row
  [4.9, 3.1, 12.1, 6.0, 2.2, 15.1, "-", 2.0, 1.8, 3.1, 7.8],
  // 2L row (highlighted - has initiative)
  [2.2, 3.5, 2.4, 4.9, 5.0, 5.2, 2.0, 9.7, 2.7, 1.6, 3.0],
  // 8x330mL row
  [2.3, 3.0, 3.8, 3.6, 5.0, 1.6, 1.8, 2.7, 9.1, 5.9, 4.3],
  // 18x330mL row
  [0.9, 1.4, 0.9, 1.5, 3.2, 3.0, 3.1, 1.6, 5.9, "-", 6.7],
  // 24x330mL row
  [3.0, 3.4, 0.7, 2.8, 0.7, 3.6, 7.8, 3.0, 4.3, 6.7, 5.6],
]

// Insights/callouts positions and content
const callouts = [
  {
    row: 0,
    cols: [2, 3],
    text: "Small format adds incrementality, only 1% of Segment A2 sales today; small multipack to be rolled out",
    highlight: "Small format adds incrementality",
  },
  {
    row: 5,
    cols: [4, 5, 6],
    text: "Multi-serve priorities can be driven by 2 priority formats: 1) Large format, 2) Small format, and opportunistically mid-size where relevant for specific retailers",
    highlight: "Multi-serve priorities",
  },
  {
    row: 8,
    cols: [8, 9, 10],
    text: "Multipack priorities can be driven by one small and one large multi-pack; potential to retain others only when relevant for specific retailers",
    highlight: "Multipack priorities",
  },
]

const getROIColor = (value: number | string): string => {
  if (value === "-") return "bg-zinc-700"
  const num = typeof value === "number" ? value : 0
  if (num >= 15) return "bg-teal-500"
  if (num >= 10) return "bg-teal-600"
  if (num >= 6) return "bg-teal-700"
  if (num >= 3) return "bg-teal-800"
  return "bg-teal-900/50"
}

const getTextColor = (value: number | string): string => {
  if (value === "-") return "text-zinc-400"
  return "text-zinc-100"
}

// Age group data for the lower section
const ageGroups = [
  { id: "all", name: "All Ages" },
  { id: "genz", name: "Gen Z / Alpha (13-29y)" },
  { id: "millennials", name: "Millennials (30-44y)" },
  { id: "genx", name: "Gen X (45-59y)" },
  { id: "boomers", name: "Boomers+ (60+)" },
]

const variantDataByAge: Record<string, { categories: string[], data: number[][] }> = {
  all: {
    categories: ["Tier 1", "Tier 2", "Tier 3"],
    data: [
      [5.2, 2.1, 1.6],
      [2.1, 9.7, 4.4],
      [1.6, 4.4, 5.1],
    ]
  },
  genz: {
    categories: ["Tier 1", "Tier 2", "Tier 3"],
    data: [
      [5.1, 3.6, 2.0],
      [3.6, 9.2, 6.1],
      [2.0, 6.1, 6.2],
    ]
  },
  millennials: {
    categories: ["Tier 1", "Tier 2", "Tier 3"],
    data: [
      [5.5, 2.3, 1.8],
      [2.3, 10.2, 4.8],
      [1.8, 4.8, 5.4],
    ]
  },
  genx: {
    categories: ["Tier 1", "Tier 2", "Tier 3"],
    data: [
      [4.9, 1.7, 1.4],
      [1.7, 10.6, 3.9],
      [1.4, 3.9, 4.5],
    ]
  },
  boomers: {
    categories: ["Tier 1", "Tier 2", "Tier 3"],
    data: [
      [4.6, 1.4, 1.1],
      [1.4, 11.5, 3.1],
      [1.1, 3.1, 3.8],
    ]
  },
}

const getColaBrandColor = (value: number): string => {
  if (value >= 9) return "bg-teal-500"
  if (value >= 5) return "bg-teal-600"
  if (value >= 3) return "bg-teal-700"
  return "bg-teal-800"
}

export function BAMShopperPartitions({ onBack, onNavigate, onNavigateToFuelight, onNavigateToInitiative }: ShopperPartitionsProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all")

  const currentVariantData = variantDataByAge[selectedAgeGroup] || variantDataByAge.all
  const isGenZ = selectedAgeGroup === "genz"

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
        <button onClick={() => onNavigate?.("overview")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Overview</button>
        <button onClick={onBack} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Partitions Heatmap</button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">Shopper Partitions</button>
        <button onClick={() => onNavigate?.("partition-tree")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Partition Tree</button>
        <button onClick={() => onNavigate?.("market-map")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Market Map</button>
        <button onClick={() => onNavigate?.("key-insights")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">AI-Driven Insights</button>
      </div>

      {/* Fuelight Call-out - At the top */}
      {onNavigateToFuelight && (
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <button onClick={onNavigateToFuelight} className="w-full p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-sm font-medium text-emerald-300">View Segment A2 Performance in Artemis</span>
                  <p className="text-xs text-emerald-400/70">Analyze sales drivers and media effectiveness</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </CardContent>
        </Card>
      )}

      {/* Back button + Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Partitions Heatmap
          </button>
          <h2 className="text-lg font-semibold text-zinc-100">
            Shopper Partitions | Segment A2
          </h2>
        </div>
      </div>

      {/* Main Shopper Partitions Heatmap */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              {/* Header rows */}
              <thead>
                {/* Pack type header */}
                <tr>
                  <th colSpan={4} className="p-0 bg-transparent"></th>
                  <th colSpan={8} className="p-1.5 text-center text-zinc-100 font-semibold bg-zinc-800 border-b border-zinc-700 text-xs">
                    Single Pack
                  </th>
                  <th colSpan={3} className="p-1.5 text-center text-zinc-100 font-semibold bg-zinc-700 border-b border-zinc-600 text-xs">
                    Multi Pack
                  </th>
                </tr>
                {/* Serve type header */}
                <tr>
                  <th colSpan={4} className="p-0 bg-transparent"></th>
                  <th colSpan={4} className="p-1 text-center text-zinc-300 font-medium bg-zinc-800/70 border-b border-zinc-700/50 text-[10px]">
                    Single Serve
                  </th>
                  <th colSpan={4} className="p-1 text-center text-zinc-300 font-medium bg-zinc-800/70 border-b border-zinc-700/50 text-[10px]">
                    Multi Serve
                  </th>
                  <th colSpan={3} className="p-1 text-center text-zinc-300 font-medium bg-zinc-700/70 border-b border-zinc-600/50 text-[10px]">
                    Single Serve
                  </th>
                </tr>
                {/* Size header */}
                <tr className="h-10">
                  <th colSpan={2} className="p-2 text-left text-zinc-400 font-normal text-[9px] bg-zinc-800/30">
                    <div>ROI | Segment A2</div>
                    <div className="text-zinc-500 mt-1">RSV (% of Segment A2), &apos;25</div>
                  </th>
                  <th className="p-1 text-center text-zinc-400 font-normal min-w-[48px] bg-zinc-800/30 text-[9px]"></th>
                  <th className="p-1 text-center text-zinc-400 font-normal min-w-[60px] bg-zinc-800/30 text-[9px]"></th>
                  {/* Single Pack - Single Serve */}
                  {columnHeaders.singlePack.singleServe.map((size, idx) => (
                    <th key={`ss-${idx}`} className="p-1 text-center text-zinc-400 font-normal min-w-[48px] bg-zinc-800/30 text-[9px]">
                      {size}
                    </th>
                  ))}
                  {/* Single Pack - Multi Serve */}
                  {columnHeaders.singlePack.multiServe.map((size, idx) => (
                    <th key={`ms-${idx}`} className="p-1 text-center text-zinc-400 font-normal min-w-[48px] bg-zinc-800/30 text-[9px]">
                      {size}
                    </th>
                  ))}
                  {/* Multi Pack - Single Serve */}
                  {columnHeaders.multiPack.singleServe.map((size, idx) => (
                    <th key={`mp-${idx}`} className="p-1 text-center text-zinc-400 font-normal min-w-[52px] bg-zinc-700/30 text-[9px]">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowLabels.map((row, rowIdx) => {
                  const is2LRow = row.size === "2L"
                  const showPackType = rowIdx === 0 || rowLabels[rowIdx - 1].packType !== row.packType
                  const showServeType = rowIdx === 0 || rowLabels[rowIdx - 1].serveType !== row.serveType || showPackType
                  
                  // Calculate rowspan for packType
                  let packTypeRowSpan = 1
                  if (showPackType) {
                    for (let i = rowIdx + 1; i < rowLabels.length; i++) {
                      if (rowLabels[i].packType === row.packType) packTypeRowSpan++
                      else break
                    }
                  }
                  
                  // Calculate rowspan for serveType within current packType
                  let serveTypeRowSpan = 1
                  if (showServeType) {
                    for (let i = rowIdx + 1; i < rowLabels.length; i++) {
                      if (rowLabels[i].packType === row.packType && rowLabels[i].serveType === row.serveType) serveTypeRowSpan++
                      else break
                    }
                  }

                  return (
                    <tr key={rowIdx}>
                      {/* Pack Type cell */}
                      {showPackType && (
                        <td 
                          rowSpan={packTypeRowSpan} 
                          className={cn(
                            "p-2 text-center text-zinc-100 font-semibold text-[10px] w-16",
                            row.packType === "Single Pack" ? "bg-zinc-800" : "bg-zinc-700"
                          )}
                        >
                          <div className="writing-mode-vertical transform -rotate-0">
                            {row.packType}
                          </div>
                        </td>
                      )}
                      {/* Serve Type cell */}
                      {showServeType && (
                        <td 
                          rowSpan={serveTypeRowSpan} 
                          className={cn(
                            "p-2 text-center text-zinc-300 font-medium text-[10px] w-16",
                            row.packType === "Single Pack" ? "bg-zinc-800/70" : "bg-zinc-700/70"
                          )}
                        >
                          {row.serveType}
                        </td>
                      )}
                      {/* Size cell */}
                      <td className="p-2 text-center text-zinc-300 font-medium bg-zinc-800/40 text-[10px]">
                        {row.size}
                      </td>
                      {/* RSV cell */}
                      <td className="p-2 text-left text-zinc-400 bg-zinc-800/20 text-[9px] whitespace-nowrap">
                        <span className="font-semibold text-zinc-200">{row.rsv}</span>
                        <span className="text-zinc-500 ml-1">({row.rsvPct})</span>
                      </td>
                      {/* Data cells */}
                      {roiData[rowIdx].map((value, colIdx) => {
                        const isHighlighted = is2LRow && colIdx === 7 // 2L diagonal
                        return (
                          <td key={colIdx} className="p-0.5">
                            <div 
                              className={cn(
                                "w-full h-8 flex items-center justify-center rounded-sm text-[10px] font-medium transition-all",
                                getROIColor(value),
                                getTextColor(value),
                                isHighlighted && "ring-2 ring-amber-400"
                              )}
                            >
                              <div className="flex items-center gap-1">
                                {value}
                                {is2LRow && colIdx === 7 && (
                                  <button 
                                    onClick={onNavigateToInitiative}
                                    className="ml-0.5"
                                    title="View ongoing initiative"
                                  >
                                    <AlertCircle className="h-3 w-3 text-amber-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Legend - directly under the heatmap */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] text-zinc-500">
              <span className="font-medium">Overlap Index:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-900/50" />
                <span>Low (0-3)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-800" />
                <span>3-6</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-700" />
                <span>6-10</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-600" />
                <span>10-15</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-500" />
                <span>High (15+)</span>
              </div>
            </div>
            
            {/* Highlighted cell hint */}
            <div className="flex items-center gap-2 text-[10px] text-amber-400">
              <div className="w-6 h-6 rounded-sm bg-teal-600 ring-2 ring-amber-400 flex items-center justify-center">
                <AlertCircle className="h-3 w-3 text-amber-400" />
              </div>
              <span>Initiative linked to this SKU</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insight Findings - below the heatmap card */}
      <div className="space-y-3">
        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p className="text-xs text-zinc-300">
            <span className="text-amber-400 font-semibold">Small format adds incrementality</span>, only 1% of Segment A2 sales today; small multipack to be rolled out
          </p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p className="text-xs text-zinc-300">
            <span className="text-amber-400 font-semibold">Multi-serve priorities</span> can be driven by 2 priority formats: 1) Large format, 2) Small format, and opportunistically mid-size where relevant for specific retailers
          </p>
        </div>
        <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p className="text-xs text-zinc-300">
            <span className="text-amber-400 font-semibold">Multipack priorities</span> can be driven by one small and one large multi-pack; potential to retain others only when relevant for specific retailers
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-zinc-800 my-8"></div>

      {/* Age Deep-Dive Section (Previously beach-heatmap) */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Age Lens (BEACH Data)</h3>
        <p className="text-sm text-zinc-500 mb-6">Consumer crossover between Tier 1, Tier 2, and Tier 3 product variants by age cohort</p>
      </div>

      {/* Age Group Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">Age Group:</span>
        <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
          <SelectTrigger className="w-[200px] h-9 bg-zinc-900 border-zinc-800 text-zinc-100 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {ageGroups.map((group) => (
              <SelectItem key={group.id} value={group.id} className="text-zinc-100 text-sm">
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Age Deep-Dive Content */}
      <div className="grid grid-cols-2 gap-8">
        {/* Heatmap */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-6">
            <div className={cn(
              "mb-4 px-4 py-2 rounded-lg text-center text-sm font-semibold uppercase tracking-wide",
              isGenZ ? "bg-amber-600 text-white" : "bg-zinc-700 text-zinc-200"
            )}>
              {isGenZ ? "Gen Z Analysis" : `Category - ${ageGroups.find(g => g.id === selectedAgeGroup)?.name || "All Ages"}`}
            </div>
            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-xs text-zinc-500 font-medium bg-zinc-800/30 border border-zinc-700/50 w-28">
                    <div className="text-[10px] leading-tight">
                      CATEGORY<br/>
                      <span className="text-zinc-600">{ageGroups.find(g => g.id === selectedAgeGroup)?.name || "All ages"}</span>
                    </div>
                  </th>
                  {currentVariantData.categories.map((cat, idx) => (
                    <th key={idx} className="p-3 text-center text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 min-w-[100px]">
                      {cat}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentVariantData.categories.map((rowCat, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className={cn(
                      "p-3 text-sm font-medium border border-zinc-700/50",
                      rowCat === "Tier 1" && "bg-red-500/20 text-red-300",
                      rowCat === "Tier 2" && "bg-zinc-700/50 text-zinc-300",
                      rowCat === "Tier 3" && "bg-emerald-500/20 text-emerald-300"
                    )}>
                      {rowCat}
                    </td>
                    {currentVariantData.data[rowIdx].map((value, colIdx) => (
                      <td key={colIdx} className="p-1 border border-zinc-700/50">
                        <div className={cn(
                          "py-4 px-4 text-center text-lg font-bold text-zinc-900 rounded-sm",
                          getColaBrandColor(value)
                        )}>
                          {value.toFixed(1)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Annotations */}
            <div className="mt-4 space-y-2">
              {selectedAgeGroup === "all" && (
                <>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-amber-400 font-bold">&#8593;</span>
                    <span>Over-indexed on younger consumers (13-39 drive ~60% consumption)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-amber-400 font-bold">&#8595;</span>
                    <span>Over-indexed on older consumers (40+ drive ~70% consumption)</span>
                  </div>
                </>
              )}
              {isGenZ && (
                <div className="flex items-start gap-2 text-xs text-amber-400">
                  <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Gen Z shows higher cross-brand consumption: Tier 2-Tier 3 overlap increases from 4.1 to 5.8</span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-[10px] text-zinc-500">
              <span className="font-medium">Overlap Index:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-800" />
                <span>{"< 3"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-700" />
                <span>3-5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-600" />
                <span>5-9</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-500" />
                <span>{">= 9"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Observations */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-6">
            <h4 className="text-base font-semibold text-zinc-100 border-b border-zinc-700 pb-3 mb-4">Key Observations</h4>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">1</div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Across brands, <span className="text-amber-400 font-semibold">Tier 1, Tier 2, and Tier 3 attract distinct consumers</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Diagonal values (4.9, 10.3, 4.7) indicate strong variant-specific loyalty</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">2</div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="text-red-400 font-semibold">Younger generations are more indifferent</span> between Tier 2 and Tier 3, and consume more across categories
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Gen Z Tier 2-Tier 3 overlap: 5.8 vs All Ages: 4.1 (+41%)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">3</div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Tier 3 has weaker brand loyalty</span> compared to Tier 2 across all age groups
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Tier 3 diagonal (4.7) vs Tier 2 diagonal (10.3) shows 2x weaker retention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insight Card */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 bg-amber-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-zinc-100 mb-2">Strategic Insight: Product Variant Positioning</h4>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Younger generations (Gen Z) show significantly higher cross-consumption between Tier 2 and Tier 3 variants. The Tier 2-Tier 3 overlap increases from 4.1 (all ages) to 5.8 (Gen Z), indicating these variants are increasingly perceived as interchangeable by younger consumers.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-300 border border-zinc-700">
                  Brand Differentiation Risk
                </span>
                <span className="px-3 py-1 bg-red-500/20 rounded-full text-xs font-medium text-red-300 border border-red-500/30">
                  Gen Z Priority
                </span>
              </div>
              <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                <p className="text-sm text-cyan-300 leading-relaxed">
                  <span className="underline text-cyan-200">Implication:</span> Today, each Brand A variant must be treated as a standalone asset with distinct positioning to capture Gen Z loyalty.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
