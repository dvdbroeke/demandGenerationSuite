"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BAMLogo } from "@/components/ui/platform-logos"
import { cn } from "@/lib/utils"

interface BAMMarketMapProps {
  onNavigate?: (screen: string) => void
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

const years = ["2025", "2024", "2023", "2022"]

interface PartitionData {
  name: string
  category: string
  partitionCagr: { value: number; volume: number }
  tcccCagr: { value: number; volume: number }
  tcccShare: { value: number; volume: number }
  marketSize: number
  status: "hotspot" | "stronghold" | "pressure" | "emerging"
}

const partitions: PartitionData[] = [
  {
    name: "Cola Regular",
    category: "SSD - Cola",
    partitionCagr: { value: 2.4, volume: 1.1 },
    tcccCagr: { value: 2.7, volume: 1.3 },
    tcccShare: { value: 59, volume: 55 },
    marketSize: 2.6,
    status: "stronghold",
  },
  {
    name: "Cola Zero <500ml",
    category: "SSD - Cola",
    partitionCagr: { value: 15.8, volume: 11.4 },
    tcccCagr: { value: 13.6, volume: 9.2 },
    tcccShare: { value: 43, volume: 40 },
    marketSize: 0.7,
    status: "hotspot",
  },
  {
    name: "Cola Zero 500ml+",
    category: "SSD - Cola",
    partitionCagr: { value: 18.9, volume: 14.1 },
    tcccCagr: { value: 16.7, volume: 12.3 },
    tcccShare: { value: 46, volume: 43 },
    marketSize: 0.6,
    status: "hotspot",
  },
  {
    name: "Cola Diet",
    category: "SSD - Cola",
    partitionCagr: { value: 2.1, volume: -0.2 },
    tcccCagr: { value: 2.4, volume: 0.4 },
    tcccShare: { value: 68, volume: 66 },
    marketSize: 1.1,
    status: "stronghold",
  },
  {
    name: "Citrus/Fruity Regular",
    category: "SSD - Citrus/Fruity",
    partitionCagr: { value: 11.4, volume: 7.8 },
    tcccCagr: { value: 10.1, volume: 6.6 },
    tcccShare: { value: 63, volume: 60 },
    marketSize: 0.8,
    status: "hotspot",
  },
  {
    name: "Citrus/Fruity No Cal",
    category: "SSD - Citrus/Fruity",
    partitionCagr: { value: 4.8, volume: 2.7 },
    tcccCagr: { value: 4.4, volume: 2.2 },
    tcccShare: { value: 51, volume: 48 },
    marketSize: 0.5,
    status: "stronghold",
  },
  {
    name: "Cherry/Dark Fruit",
    category: "SSD - Bold",
    partitionCagr: { value: 12.9, volume: 9.1 },
    tcccCagr: { value: 10.6, volume: 7.0 },
    tcccShare: { value: 40, volume: 37 },
    marketSize: 0.6,
    status: "hotspot",
  },
  {
    name: "Energy >=500ml",
    category: "Performance - Energy",
    partitionCagr: { value: 20.8, volume: 17.2 },
    tcccCagr: { value: 9.4, volume: 6.9 },
    tcccShare: { value: 8, volume: 7 },
    marketSize: 0.9,
    status: "pressure",
  },
  {
    name: "Energy <500ml",
    category: "Performance - Energy",
    partitionCagr: { value: 16.2, volume: 12.4 },
    tcccCagr: { value: 7.1, volume: 5.3 },
    tcccShare: { value: 9, volume: 8 },
    marketSize: 1.0,
    status: "pressure",
  },
  {
    name: "Advanced Hydration",
    category: "Performance",
    partitionCagr: { value: 13.8, volume: 10.6 },
    tcccCagr: { value: 28.9, volume: 24.1 },
    tcccShare: { value: 4, volume: 4 },
    marketSize: 0.8,
    status: "emerging",
  },
  {
    name: "Juices & Smoothies",
    category: "Traditional",
    partitionCagr: { value: 4.6, volume: 2.1 },
    tcccCagr: { value: 11.4, volume: 7.6 },
    tcccShare: { value: 31, volume: 29 },
    marketSize: 1.3,
    status: "stronghold",
  },
  {
    name: "Water, Tea & Coffee",
    category: "Traditional",
    partitionCagr: { value: 5.9, volume: 3.6 },
    tcccCagr: { value: 3.6, volume: 2.1 },
    tcccShare: { value: 4, volume: 4 },
    marketSize: 1.6,
    status: "pressure",
  },
]

const statusConfig = {
  hotspot: {
    label: "Growth Hotspot",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  stronghold: {
    label: "Stronghold",
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    dot: "bg-teal-500",
  },
  pressure: {
    label: "Under Pressure",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-500",
  },
  emerging: {
    label: "Emerging",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-500",
  },
}

type ViewType = "value" | "volume"

export function BAMMarketMap({ onNavigate }: BAMMarketMapProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [view, setView] = useState<ViewType>("value")

  const formatCagr = (value: number) => {
    const prefix = value >= 0 ? "+" : ""
    return `${prefix}${value.toFixed(1)}%`
  }

  const getShareColor = (share: number) => {
    if (share >= 60) return "bg-teal-500"
    if (share >= 40) return "bg-teal-600"
    if (share >= 25) return "bg-amber-500"
    return "bg-red-500"
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
            <p className="text-xs text-zinc-500">Market Map - TCCC Performance by Partition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[160px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
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
        <button 
          onClick={() => onNavigate?.("partitions-heatmap")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Partitions Heatmap
        </button>
        <button 
          onClick={() => onNavigate?.("partition-tree")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Partition Tree
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">
          Market Map
        </button>
        <button 
          onClick={() => onNavigate?.("key-insights")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          AI-Driven Insights
        </button>
      </div>

      {/* View Toggle + Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", config.dot)} />
              <span className="text-xs text-zinc-400">{config.label}</span>
              <span className="text-xs font-medium text-zinc-300">
                ({partitions.filter((p) => p.status === key).length})
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("value")}
            className={cn(
              "px-4 h-7 text-xs transition-colors",
              view === "value"
                ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 hover:text-teal-300"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            Value
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("volume")}
            className={cn(
              "px-4 h-7 text-xs transition-colors",
              view === "volume"
                ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 hover:text-teal-300"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            Volume
          </Button>
        </div>
      </div>

      {/* Partition Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {partitions.map((partition) => {
          const status = statusConfig[partition.status]
          const cagr = view === "value" ? partition.partitionCagr.value : partition.partitionCagr.volume
          const tcccCagr = view === "value" ? partition.tcccCagr.value : partition.tcccCagr.volume
          const share = view === "value" ? partition.tcccShare.value : partition.tcccShare.volume
          const outperforming = tcccCagr > cagr

          return (
            <Card
              key={partition.name}
              className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold text-zinc-100">
                      {partition.name}
                    </CardTitle>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{partition.category}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", status.color)}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Market Size */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Market Size</span>
                  <span className="font-medium text-zinc-300">€{partition.marketSize}B</span>
                </div>

                {/* CAGR Comparison */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Partition CAGR</span>
                    <span
                      className={cn(
                        "font-medium",
                        cagr >= 10
                          ? "text-emerald-400"
                          : cagr >= 5
                            ? "text-teal-400"
                            : cagr >= 0
                              ? "text-zinc-300"
                              : "text-red-400"
                      )}
                    >
                      {formatCagr(cagr)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">TCCC CAGR</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium",
                          tcccCagr >= 10
                            ? "text-emerald-400"
                            : tcccCagr >= 5
                              ? "text-teal-400"
                              : tcccCagr >= 0
                                ? "text-zinc-300"
                                : "text-red-400"
                        )}
                      >
                        {formatCagr(tcccCagr)}
                      </span>
                      {outperforming ? (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                          Outperforming
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded">
                          Lagging
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">TCCC Share</span>
                    <span className="font-semibold text-zinc-100">{share}%</span>
                  </div>
                  <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all",
                        getShareColor(share)
                      )}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Legend */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <span className="text-zinc-400">Share Color Legend:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-teal-500" />
                  <span className="text-zinc-400">60%+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-teal-600" />
                  <span className="text-zinc-400">40-60%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-zinc-400">25-40%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-zinc-400">{"<"}25%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-zinc-500">
              <span>
                <span className="text-emerald-400">Outperforming</span> = TCCC CAGR {">"} Partition CAGR
              </span>
              <span>
                <span className="text-red-400">Lagging</span> = TCCC CAGR {"<"} Partition CAGR
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
