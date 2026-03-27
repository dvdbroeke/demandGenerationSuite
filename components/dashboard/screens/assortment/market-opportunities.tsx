"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, AlertTriangle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MixScreen } from "../mix/mix-performance"

interface Props { onNavigate?: (screen: MixScreen) => void }

const tabs: { id: MixScreen; label: string }[] = [
  { id: "market-opportunities", label: "Overview" },
  { id: "portfolio-quality", label: "Portfolio Quality Analysis" },
  { id: "assortment-share", label: "Assortment Share" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Categories
const categories = [
  { id: "cola-regular", label: "Cola Regular" },
  { id: "cola-zero", label: "Cola Zero/Diet" },
  { id: "citrus-fruity", label: "Citrus/Fruity" },
  { id: "energy", label: "Energy" },
  { id: "water", label: "Water" },
]

// Brands per category
const brandsByCategory: Record<string, { name: string; shortName: string; color: string; isTccc: boolean }[]> = {
  "cola-regular": [
    { name: "Coca-Cola Classic", shortName: "CC Classic", color: "#ef4444", isTccc: true },
    { name: "Pepsi Regular", shortName: "Pepsi", color: "#2563eb", isTccc: false },
    { name: "Dr Pepper", shortName: "Dr Pepper", color: "#7c3aed", isTccc: false },
    { name: "RC Cola", shortName: "RC Cola", color: "#4338ca", isTccc: false },
    { name: "Private Label Cola", shortName: "PL Cola", color: "#6b7280", isTccc: false },
  ],
  "cola-zero": [
    { name: "Coca-Cola Zero", shortName: "CC Zero", color: "#ef4444", isTccc: true },
    { name: "Diet Coke", shortName: "Diet Coke", color: "#dc2626", isTccc: true },
    { name: "Pepsi Max", shortName: "Pepsi Max", color: "#2563eb", isTccc: false },
    { name: "Pepsi Zero Sugar", shortName: "Pepsi Zero", color: "#1d4ed8", isTccc: false },
    { name: "Dr Pepper Zero", shortName: "Dr P Zero", color: "#7c3aed", isTccc: false },
  ],
  "citrus-fruity": [
    { name: "Fanta Orange", shortName: "Fanta", color: "#f97316", isTccc: true },
    { name: "Sprite", shortName: "Sprite", color: "#22c55e", isTccc: true },
    { name: "7UP", shortName: "7UP", color: "#10b981", isTccc: false },
    { name: "Mirinda", shortName: "Mirinda", color: "#f59e0b", isTccc: false },
    { name: "Mountain Dew", shortName: "Mtn Dew", color: "#84cc16", isTccc: false },
  ],
  "energy": [
    { name: "Monster Energy", shortName: "Monster", color: "#22c55e", isTccc: true },
    { name: "Red Bull", shortName: "Red Bull", color: "#3b82f6", isTccc: false },
    { name: "Rockstar", shortName: "Rockstar", color: "#eab308", isTccc: false },
    { name: "Burn", shortName: "Burn", color: "#ef4444", isTccc: false },
  ],
  "water": [
    { name: "Smartwater", shortName: "Smartwater", color: "#06b6d4", isTccc: true },
    { name: "Dasani", shortName: "Dasani", color: "#0ea5e9", isTccc: true },
    { name: "Evian", shortName: "Evian", color: "#ec4899", isTccc: false },
    { name: "Aquafina", shortName: "Aquafina", color: "#2563eb", isTccc: false },
    { name: "Private Label Water", shortName: "PL Water", color: "#6b7280", isTccc: false },
  ],
}

// Segments per dimension
const channelSegments = ["Hypermarket", "Supermarket", "Convenience", "Discounter", "Gas Station", "HoReCa", "Vending", "E-commerce"]
const packTypeSegments = ["PET", "Can", "Glass", "Carton", "Pouch"]
const packSizeSegments = ["250ml", "330ml", "500ml", "750ml", "1L", "1.5L", "2L"]

// Segment colors
const segmentColors: Record<string, string> = {
  // Channels
  "Hypermarket": "#3b82f6",
  "Supermarket": "#22c55e", 
  "Convenience": "#f97316",
  "Discounter": "#a855f7",
  "Gas Station": "#eab308",
  "HoReCa": "#ef4444",
  "Vending": "#06b6d4",
  "E-commerce": "#ec4899",
  // Pack types
  "PET": "#3b82f6",
  "Can": "#ef4444",
  "Glass": "#22c55e",
  "Carton": "#f97316",
  "Pouch": "#a855f7",
  // Pack sizes
  "250ml": "#06b6d4",
  "330ml": "#22c55e",
  "500ml": "#3b82f6",
  "750ml": "#f97316",
  "1L": "#eab308",
  "1.5L": "#a855f7",
  "2L": "#ef4444",
}

// Seeded random for consistent data
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

// Generate sales data for a brand
function generateBrandData(brandName: string, categoryId: string) {
  const seed = brandName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + categoryId.charCodeAt(0) * 100
  const rng = seededRandom(seed)
  
  const isTccc = brandsByCategory[categoryId]?.find(b => b.name === brandName)?.isTccc || false
  const isCokeClassic = brandName === "Coca-Cola Classic"
  
  // Channel split - STORYLINE: CC Classic skewed toward HoReCa
  const channelRaw: Record<string, number> = {}
  channelSegments.forEach(ch => {
    let base = 8 + rng() * 15
    if (isCokeClassic) {
      if (ch === "HoReCa") base = 28
      if (ch === "Gas Station") base = 18
      if (ch === "Convenience") base = 16
      if (ch === "Supermarket") base = 12
      if (ch === "E-commerce") base = 6
      if (ch === "Hypermarket") base = 10
      if (ch === "Vending") base = 6
      if (ch === "Discounter") base = 4
    } else {
      if (ch === "Supermarket") base *= 1.6
      if (ch === "Hypermarket") base *= 1.4
      if (ch === "E-commerce") base *= 1.3
      if (ch === "HoReCa") base *= 0.7
    }
    channelRaw[ch] = base
  })
  const chTotal = Object.values(channelRaw).reduce((s, v) => s + v, 0)
  const channels: Record<string, number> = {}
  Object.keys(channelRaw).forEach(k => { channels[k] = Math.round(channelRaw[k] / chTotal * 100) })
  
  // Pack type split - STORYLINE: CC Classic over-indexed on Cans
  const packTypeRaw: Record<string, number> = {}
  packTypeSegments.forEach(pt => {
    let base = 10 + rng() * 20
    if (isCokeClassic) {
      if (pt === "Can") base = 42
      if (pt === "PET") base = 35
      if (pt === "Glass") base = 15
      if (pt === "Carton") base = 5
      if (pt === "Pouch") base = 3
    } else {
      if (pt === "PET") base *= 1.8
      if (pt === "Can") base *= 1.0
      if (pt === "Glass") base *= 0.6
    }
    packTypeRaw[pt] = base
  })
  const ptTotal = Object.values(packTypeRaw).reduce((s, v) => s + v, 0)
  const packTypes: Record<string, number> = {}
  Object.keys(packTypeRaw).forEach(k => { packTypes[k] = Math.round(packTypeRaw[k] / ptTotal * 100) })
  
  // Pack size split - STORYLINE: CC Classic concentrated in 500ml
  const packSizeRaw: Record<string, number> = {}
  packSizeSegments.forEach(ps => {
    let base = 8 + rng() * 18
    if (isCokeClassic) {
      if (ps === "500ml") base = 32
      if (ps === "1.5L") base = 22
      if (ps === "2L") base = 16
      if (ps === "330ml") base = 14
      if (ps === "1L") base = 8
      if (ps === "750ml") base = 5
      if (ps === "250ml") base = 3
    } else {
      if (ps === "330ml") base *= 1.7
      if (ps === "500ml") base *= 1.3
      if (ps === "1.5L") base *= 1.2
    }
    packSizeRaw[ps] = base
  })
  const psTotal = Object.values(packSizeRaw).reduce((s, v) => s + v, 0)
  const packSizes: Record<string, number> = {}
  Object.keys(packSizeRaw).forEach(k => { packSizes[k] = Math.round(packSizeRaw[k] / psTotal * 100) })
  
  return { channels, packTypes, packSizes }
}

// Vertical Stacked Bar for a single brand
function VerticalStackedBar({ 
  data, 
  segments,
  brandColor,
  highlightSegments,
  height = 200 
}: { 
  data: Record<string, number>
  segments: string[]
  brandColor: string
  highlightSegments?: string[]
  height?: number
}) {
  // Filter and sort segments by value
  const sortedSegments = segments
    .filter(s => (data[s] || 0) > 0)
    .sort((a, b) => (data[b] || 0) - (data[a] || 0))
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-14 bg-zinc-800/30 rounded-lg overflow-hidden flex flex-col"
        style={{ height }}
      >
        {sortedSegments.map((segment, idx) => {
          const value = data[segment] || 0
          const segHeight = (value / 100) * height
          const isHighlighted = highlightSegments?.includes(segment)
          const color = segmentColors[segment] || "#6b7280"
          
          return (
            <div
              key={segment}
              className={cn(
                "w-full relative flex items-center justify-center transition-all",
                isHighlighted && "ring-2 ring-inset ring-amber-400"
              )}
              style={{ 
                height: segHeight,
                backgroundColor: color,
                opacity: isHighlighted ? 1 : 0.85
              }}
              title={`${segment}: ${value}%`}
            >
              {segHeight > 20 && (
                <span className="text-[9px] font-bold text-white drop-shadow-md">
                  {value}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function MarketOpportunities({ onNavigate }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("cola-regular")

  const brands = useMemo(() => brandsByCategory[selectedCategory] || [], [selectedCategory])

  const brandDataMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof generateBrandData>> = {}
    brands.forEach(brand => {
      map[brand.name] = generateBrandData(brand.name, selectedCategory)
    })
    return map
  }, [brands, selectedCategory])

  // Storyline highlights for Coca-Cola Classic
  const getHighlights = (brandName: string, dimension: "channel" | "packType" | "packSize"): string[] | undefined => {
    if (brandName !== "Coca-Cola Classic") return undefined
    if (dimension === "channel") return ["HoReCa", "E-commerce", "Supermarket"]
    if (dimension === "packType") return ["Can"]
    if (dimension === "packSize") return ["500ml", "330ml"]
    return undefined
  }

  // Legend component
  const Legend = ({ segments }: { segments: string[] }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
      {segments.map(segment => (
        <div key={segment} className="flex items-center gap-1.5">
          <div 
            className="w-3 h-3 rounded" 
            style={{ backgroundColor: segmentColors[segment] }} 
          />
          <span className="text-[10px] text-zinc-400">{segment}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-6 space-y-5 max-w-[1800px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => onNavigate?.(t.id)} 
            className={cn(
              "px-5 py-2.5 text-xs font-medium transition-colors", 
              t.id === "market-opportunities" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Assortment & Mix Overview</h2>
          <p className="text-xs text-zinc-500">Compare sales distribution by channel, pack type, and pack size across brands</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-8 w-[160px] bg-zinc-900 border-zinc-700 text-zinc-300 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id} className="text-zinc-200 text-xs">{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-amber-300">AI Insight</span>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px]">Channel Gap</Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[9px]">Pack Size Gap</Badge>
              </div>
              <p className="text-xs text-zinc-300">
                Coca-Cola Classic is <span className="text-amber-300 font-medium">skewed toward HoReCa (28%) & Cans (42%)</span> while competitors lead in Supermarket and E-commerce. 
                Pack size mix is <span className="text-amber-300 font-medium">concentrated in 500ml (32%)</span> while competitors show stronger 330ml representation (22-25%).
              </p>
            </div>
            <button 
              onClick={() => onNavigate?.("portfolio-quality")}
              className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-colors flex items-center gap-2"
            >
              Assess in PQA
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* === CHANNEL DISTRIBUTION BOX === */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-100">Channel Distribution</h3>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] text-amber-400">CC Classic over-indexed on HoReCa (28%)</span>
            </div>
          </div>
          
          {/* Bars for each brand */}
          <div className="flex justify-around items-end gap-4">
            {brands.map(brand => {
              const data = brandDataMap[brand.name]
              const isCokeClassic = brand.name === "Coca-Cola Classic"
              return (
                <div key={brand.name} className="flex flex-col items-center">
                  <VerticalStackedBar
                    data={data?.channels || {}}
                    segments={channelSegments}
                    brandColor={brand.color}
                    highlightSegments={getHighlights(brand.name, "channel")}
                    height={180}
                  />
                  <div className={cn(
                    "mt-2 text-[10px] font-medium text-center px-2 py-1 rounded",
                    isCokeClassic ? "text-amber-300 bg-amber-500/10" : "text-zinc-400"
                  )}>
                    {brand.shortName}
                    {brand.isTccc && <span className="ml-1 text-[8px] text-red-400">*</span>}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <Legend segments={channelSegments} />
        </CardContent>
      </Card>

      {/* === PACK TYPE DISTRIBUTION BOX === */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-100">Pack Type Distribution</h3>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] text-amber-400">CC Classic over-indexed on Cans (42%)</span>
            </div>
          </div>
          
          {/* Bars for each brand */}
          <div className="flex justify-around items-end gap-4">
            {brands.map(brand => {
              const data = brandDataMap[brand.name]
              const isCokeClassic = brand.name === "Coca-Cola Classic"
              return (
                <div key={brand.name} className="flex flex-col items-center">
                  <VerticalStackedBar
                    data={data?.packTypes || {}}
                    segments={packTypeSegments}
                    brandColor={brand.color}
                    highlightSegments={getHighlights(brand.name, "packType")}
                    height={180}
                  />
                  <div className={cn(
                    "mt-2 text-[10px] font-medium text-center px-2 py-1 rounded",
                    isCokeClassic ? "text-amber-300 bg-amber-500/10" : "text-zinc-400"
                  )}>
                    {brand.shortName}
                    {brand.isTccc && <span className="ml-1 text-[8px] text-red-400">*</span>}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <Legend segments={packTypeSegments} />
        </CardContent>
      </Card>

      {/* === PACK SIZE DISTRIBUTION BOX === */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-100">Pack Size Distribution</h3>
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <span className="text-[10px] text-amber-400">CC Classic concentrated in 500ml (32%), weak in 330ml (14%)</span>
            </div>
          </div>
          
          {/* Bars for each brand */}
          <div className="flex justify-around items-end gap-4">
            {brands.map(brand => {
              const data = brandDataMap[brand.name]
              const isCokeClassic = brand.name === "Coca-Cola Classic"
              return (
                <div key={brand.name} className="flex flex-col items-center">
                  <VerticalStackedBar
                    data={data?.packSizes || {}}
                    segments={packSizeSegments}
                    brandColor={brand.color}
                    highlightSegments={getHighlights(brand.name, "packSize")}
                    height={180}
                  />
                  <div className={cn(
                    "mt-2 text-[10px] font-medium text-center px-2 py-1 rounded",
                    isCokeClassic ? "text-amber-300 bg-amber-500/10" : "text-zinc-400"
                  )}>
                    {brand.shortName}
                    {brand.isTccc && <span className="ml-1 text-[8px] text-red-400">*</span>}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Legend */}
          <Legend segments={packSizeSegments} />
        </CardContent>
      </Card>

      {/* Navigate to Next Step */}
      <div className="flex justify-end pt-2">
        <button 
          onClick={() => onNavigate?.("portfolio-quality")}
          className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors flex items-center gap-2"
        >
          Continue to Portfolio Quality Analysis
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
