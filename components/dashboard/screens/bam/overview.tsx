"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DollarSign,
  Package,
  Percent,
  Flame,
  TrendingUp
} from "lucide-react"
import { BAMLogo } from "@/components/ui/platform-logos"
import { cn } from "@/lib/utils"

interface BAMOverviewProps {
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

const years = ["2025", "2024", "2023", "2022", "2021", "2020"]

export function BAMOverview({ onNavigate }: BAMOverviewProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")

  const marketName = markets.find(m => m.code === selectedMarket)?.name || "Great Britain"

  const kpis = [
    { 
      label: "Market Value", 
      value: "$12.4B", 
      change: "+5.2% CAGR",
      icon: DollarSign,
      iconColor: "text-emerald-400"
    },
    { 
      label: "Market Volume", 
      value: "847M Units", 
      change: "+1.8% CAGR",
      icon: Package,
      iconColor: "text-teal-400"
    },
    { 
      label: "Enterprise Share", 
      value: "47%", 
      subtitle: "Market leadership position",
      icon: Percent,
      iconColor: "text-red-400"
    },
    { 
      label: "Growth Hotspots", 
      value: "6", 
      subtitle: "Partitions driving growth",
      icon: Flame,
      iconColor: "text-amber-400"
    },
  ]

  const growthHotspots = [
    { name: "Segment A Premium", growth: "+16%" },
    { name: "Segment A Value", growth: "+19%" },
    { name: "Segment B Core", growth: "+11%" },
    { name: "Segment C Specialty", growth: "+13%" },
    { name: "Segment D Large Format", growth: "+21%" },
    { name: "Segment E Innovation", growth: "+14%" },
  ]

  const priorityInsights = [
    {
      type: "market",
      impact: "High Impact",
      title: "Market Growing in Value, Flat in Volume",
      description: "$12.4B market growing ~5.2% CAGR in value but slower in volume. Growth driven by premiumization and strategic pricing."
    },
    {
      type: "partition",
      impact: "High Impact",
      title: "Premium Segments Driving Growth",
      description: "Segment A and Segment C driving 115% of volume growth. Brand A trailing Competitor B in high-growth premium partition."
    },
    {
      type: "brand",
      impact: "High Impact",
      title: "Brand A Loyalty Gap",
      description: "Brand A has inferior loyalty metrics vs. Competitor B (4.8 vs 14.2 index). Brand A Classic consumers switching to Competitor B rather than Brand A Premium."
    },
    {
      type: "action",
      impact: "High Impact",
      title: "Emerging Segment: Route to Play Needed",
      description: "Secular growth in Segment D driven by Competitor X & Competitor Y. Enterprise has limited owned portfolio, needs clear route to play."
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "market": return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "partition": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "brand": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "action": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
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
          {/* Market Selector */}
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

          {/* Year Selector (Backward looking) */}
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
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-zinc-100 mt-1">{kpi.value}</p>
                  {kpi.change && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">{kpi.change}</span>
                    </div>
                  )}
                  {kpi.subtitle && (
                    <p className="text-xs text-zinc-500 mt-1">{kpi.subtitle}</p>
                  )}
                </div>
                <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Summary */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-zinc-100">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Market Reality */}
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Market Reality</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>$12.4B market facing headwinds, growing ~5.2% CAGR in value but slower in volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>Enterprise leads with ~47% share albeit under competitive pressure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>Volume growth driven mostly by value pack and multi-unit configurations</span>
                </li>
              </ul>
            </div>

            {/* Growth Hotspots */}
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Growth Hotspots</h3>
              <div className="flex flex-wrap gap-2">
                {growthHotspots.map((hotspot) => (
                  <Badge 
                    key={hotspot.name}
                    className="bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs"
                  >
                    {hotspot.name} {hotspot.growth}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Insights */}
      <div>
        <h2 className="text-sm font-medium text-zinc-300 mb-4">Priority Insights</h2>
        <div className="grid grid-cols-2 gap-4">
          {priorityInsights.map((insight, idx) => (
            <Card key={idx} className="bg-zinc-900/50 border-zinc-800/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getTypeColor(insight.type)}>
                    {insight.type}
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {insight.impact}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">{insight.title}</h3>
                <p className="text-xs text-zinc-400">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
