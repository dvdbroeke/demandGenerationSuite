"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Megaphone,
  TrendingUp,
  Target,
  Lightbulb,
  Sparkles,
  Users,
  Eye,
  Heart
} from "lucide-react"
import { RGMLogo } from "@/components/ui/platform-logos"
import { cn } from "@/lib/utils"

export type MarketingScreen = "overview" | "brand-strategy" | "communication-strategy" | "communication-plan" | "initiative-development"

interface MarketingOverviewProps {
  onNavigate?: (screen: MarketingScreen) => void
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
]

const years = ["2026", "2025", "2024", "2023"]

export function MarketingOverview({ onNavigate }: MarketingOverviewProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2026")

  const kpis = [
    { 
      label: "Brand Awareness", 
      value: "87%", 
      subtitle: "+2.3pp vs. prior year",
      icon: Eye,
      iconColor: "text-blue-400"
    },
    { 
      label: "Brand Love Score", 
      value: "72", 
      subtitle: "NPS Index",
      icon: Heart,
      iconColor: "text-red-400"
    },
    { 
      label: "Media Efficiency", 
      value: "1.8x", 
      subtitle: "ROI on media spend",
      icon: TrendingUp,
      iconColor: "text-emerald-400"
    },
    { 
      label: "Active Initiatives", 
      value: "12", 
      subtitle: "4 high priority",
      icon: Sparkles,
      iconColor: "text-amber-400"
    },
  ]

  const quickActions = [
    {
      id: "brand-strategy",
      title: "Brand Strategy",
      description: "Define brand positioning, values, and target audiences",
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      id: "communication-strategy",
      title: "Communication Strategy",
      description: "Channel mix, messaging hierarchy, and creative direction",
      icon: Megaphone,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "communication-plan",
      title: "Communication Plan",
      description: "Campaign calendar, budget allocation, and media planning",
      icon: Users,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      id: "initiative-development",
      title: "Initiative Development",
      description: "Track and develop marketing initiatives across stages",
      icon: Lightbulb,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <RGMLogo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Marketing Excellence</h1>
            <p className="text-xs text-zinc-500">How to Win with Marketing</p>
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
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-blue-500">
          Overview
        </button>
        <button 
          onClick={() => onNavigate?.("brand-strategy")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Brand Strategy
        </button>
        <button 
          onClick={() => onNavigate?.("communication-strategy")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Communication Strategy
        </button>
        <button 
          onClick={() => onNavigate?.("communication-plan")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Communication Plan
        </button>
        <button 
          onClick={() => onNavigate?.("initiative-development")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Initiative Development
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
                  <p className="text-xs text-zinc-500 mt-1">{kpi.subtitle}</p>
                </div>
                <kpi.icon className={cn("h-6 w-6", kpi.iconColor)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-zinc-300 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate?.(action.id as MarketingScreen)}
              className={cn(
                "p-5 rounded-xl border text-left transition-all hover:scale-[1.01]",
                action.bgColor,
                action.borderColor,
                "hover:brightness-110"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <action.icon className={cn("h-5 w-5", action.color)} />
                <h3 className="text-sm font-semibold text-zinc-100">{action.title}</h3>
              </div>
              <p className="text-xs text-zinc-400">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights Preview */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI-Powered Marketing Insights</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <p className="text-xs text-zinc-500 mb-1">Social Media Opportunity</p>
              <p className="text-sm font-medium text-zinc-100">TikTok shows 3.5x ROI for Coke Zero vs. traditional media</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <p className="text-xs text-zinc-500 mb-1">Affordability Perception</p>
              <p className="text-sm font-medium text-zinc-100">Value messaging can improve price perception by 12%</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <p className="text-xs text-zinc-500 mb-1">Gen Z Engagement</p>
              <p className="text-sm font-medium text-zinc-100">Short-form video drives 2.8x higher engagement with 18-24</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
