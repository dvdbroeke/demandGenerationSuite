"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MixScreen } from "../mix/mix-performance"
import { Store, Eye, ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Camera, BarChart3, Package, ShoppingCart, Sparkles, AlertTriangle, ArrowRight } from "lucide-react"

interface Props { onNavigate?: (screen: MixScreen) => void }

const tabs: { id: MixScreen; label: string }[] = [
  { id: "market-opportunities", label: "Overview" },
  { id: "portfolio-quality", label: "Portfolio Quality Analysis" },
  { id: "assortment-share", label: "Assortment Share" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Channel category type
type ChannelCategory = "at-home" | "away-from-home"

// Distribution channel data
interface ChannelData {
  id: string
  name: string
  category: ChannelCategory
  storeCoverage: number // % of stores/outlets covered
  marketShare: number // % market share those stores represent
  shareOfShelf: number // current share of shelf (at-home) or share of assortment (AFH)
  targetShareOfShelf: number // target SOS/SOA
  shelfAvailability: number // % available shelf/menu space
  trend: "up" | "down" | "flat"
  trendValue: number
  // Shelf/assortment composition when drilling down
  shelfComposition: {
    brand: string
    portfolio: "Brand Owner" | "Competitor" | "Alternative" | "Private Label" | "Other"
    facings: number
    shareOfShelf: number
    color: string
  }[]
}

// At-Home channels (traditional retail)
const atHomeChannels: ChannelData[] = [
  {
    id: "hypermarket",
    name: "Hypermarkets",
    category: "at-home",
    storeCoverage: 95,
    marketShare: 42,
    shareOfShelf: 38,
    targetShareOfShelf: 45,
    shelfAvailability: 12,
    trend: "up",
    trendValue: 2.3,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 24, shareOfShelf: 18, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 12, shareOfShelf: 9, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 8, shareOfShelf: 6, color: "#22c55e" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 6, shareOfShelf: 5, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 18, shareOfShelf: 14, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 10, shareOfShelf: 8, color: "#16a34a" },
      { brand: "Competitor Y", portfolio: "Competitor", facings: 8, shareOfShelf: 6, color: "#ea580c" },
      { brand: "Alternative Brand", portfolio: "Alternative", facings: 12, shareOfShelf: 9, color: "#7c3aed" },
      { brand: "Private Label", portfolio: "Private Label", facings: 20, shareOfShelf: 15, color: "#6b7280" },
      { brand: "Other", portfolio: "Other", facings: 12, shareOfShelf: 10, color: "#a1a1aa" },
    ]
  },
  {
    id: "supermarket",
    name: "Supermarkets",
    category: "at-home",
    storeCoverage: 88,
    marketShare: 31,
    shareOfShelf: 42,
    targetShareOfShelf: 48,
    shelfAvailability: 8,
    trend: "up",
    trendValue: 1.8,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 20, shareOfShelf: 20, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 10, shareOfShelf: 10, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 7, shareOfShelf: 7, color: "#22c55e" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 5, shareOfShelf: 5, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 14, shareOfShelf: 14, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 8, shareOfShelf: 8, color: "#16a34a" },
      { brand: "Alternative Brand", portfolio: "Alternative", facings: 10, shareOfShelf: 10, color: "#7c3aed" },
      { brand: "Private Label", portfolio: "Private Label", facings: 16, shareOfShelf: 16, color: "#6b7280" },
      { brand: "Other", portfolio: "Other", facings: 10, shareOfShelf: 10, color: "#a1a1aa" },
    ]
  },
  {
    id: "convenience",
    name: "Convenience Stores",
    category: "at-home",
    storeCoverage: 72,
    marketShare: 15,
    shareOfShelf: 35,
    targetShareOfShelf: 42,
    shelfAvailability: 15,
    trend: "down",
    trendValue: -1.2,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 8, shareOfShelf: 20, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 4, shareOfShelf: 10, color: "#f97316" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 2, shareOfShelf: 5, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 8, shareOfShelf: 20, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 4, shareOfShelf: 10, color: "#16a34a" },
      { brand: "Alternative Brand", portfolio: "Alternative", facings: 4, shareOfShelf: 10, color: "#7c3aed" },
      { brand: "Private Label", portfolio: "Private Label", facings: 6, shareOfShelf: 15, color: "#6b7280" },
      { brand: "Other", portfolio: "Other", facings: 4, shareOfShelf: 10, color: "#a1a1aa" },
    ]
  },
  {
    id: "discounter",
    name: "Discounters",
    category: "at-home",
    storeCoverage: 65,
    marketShare: 8,
    shareOfShelf: 28,
    targetShareOfShelf: 35,
    shelfAvailability: 5,
    trend: "flat",
    trendValue: 0.2,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 6, shareOfShelf: 15, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 3, shareOfShelf: 8, color: "#f97316" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 2, shareOfShelf: 5, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 6, shareOfShelf: 15, color: "#2563eb" },
      { brand: "Private Label", portfolio: "Private Label", facings: 18, shareOfShelf: 45, color: "#6b7280" },
      { brand: "Other", portfolio: "Other", facings: 5, shareOfShelf: 12, color: "#a1a1aa" },
    ]
  },
]

// Away-From-Home channels
const awayFromHomeChannels: ChannelData[] = [
  {
    id: "qsr",
    name: "QSR (Quick Service Restaurants)",
    category: "away-from-home",
    storeCoverage: 68,
    marketShare: 18,
    shareOfShelf: 58,
    targetShareOfShelf: 65,
    shelfAvailability: 15,
    trend: "up",
    trendValue: 4.2,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 5, shareOfShelf: 28, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 3, shareOfShelf: 15, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 2, shareOfShelf: 10, color: "#22c55e" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 1, shareOfShelf: 5, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 3, shareOfShelf: 18, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 12, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 2, shareOfShelf: 12, color: "#a1a1aa" },
    ]
  },
  {
    id: "restaurants",
    name: "Restaurants",
    category: "away-from-home",
    storeCoverage: 52,
    marketShare: 12,
    shareOfShelf: 45,
    targetShareOfShelf: 55,
    shelfAvailability: 25,
    trend: "up",
    trendValue: 2.8,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 4, shareOfShelf: 22, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 2, shareOfShelf: 12, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 2, shareOfShelf: 11, color: "#22c55e" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 4, shareOfShelf: 22, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 11, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 4, shareOfShelf: 22, color: "#a1a1aa" },
    ]
  },
  {
    id: "hotels",
    name: "Hotels",
    category: "away-from-home",
    storeCoverage: 45,
    marketShare: 8,
    shareOfShelf: 52,
    targetShareOfShelf: 60,
    shelfAvailability: 20,
    trend: "up",
    trendValue: 3.5,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 6, shareOfShelf: 30, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 3, shareOfShelf: 15, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 1, shareOfShelf: 7, color: "#22c55e" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 4, shareOfShelf: 20, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 10, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 4, shareOfShelf: 18, color: "#a1a1aa" },
    ]
  },
  {
    id: "cafe-bakery",
    name: "Cafes & Bakeries",
    category: "away-from-home",
    storeCoverage: 38,
    marketShare: 6,
    shareOfShelf: 42,
    targetShareOfShelf: 50,
    shelfAvailability: 18,
    trend: "flat",
    trendValue: 0.8,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 3, shareOfShelf: 20, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 2, shareOfShelf: 12, color: "#f97316" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 1, shareOfShelf: 10, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 3, shareOfShelf: 20, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 13, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 4, shareOfShelf: 25, color: "#a1a1aa" },
    ]
  },
  {
    id: "vending",
    name: "Vending Machines",
    category: "away-from-home",
    storeCoverage: 62,
    marketShare: 5,
    shareOfShelf: 65,
    targetShareOfShelf: 70,
    shelfAvailability: 10,
    trend: "up",
    trendValue: 1.5,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 8, shareOfShelf: 35, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 4, shareOfShelf: 18, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 2, shareOfShelf: 8, color: "#22c55e" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 1, shareOfShelf: 4, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 4, shareOfShelf: 18, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 9, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 2, shareOfShelf: 8, color: "#a1a1aa" },
    ]
  },
  {
    id: "travel",
    name: "Travel (Airports/Stations)",
    category: "away-from-home",
    storeCoverage: 78,
    marketShare: 4,
    shareOfShelf: 48,
    targetShareOfShelf: 55,
    shelfAvailability: 12,
    trend: "up",
    trendValue: 2.1,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 5, shareOfShelf: 25, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 2, shareOfShelf: 10, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 2, shareOfShelf: 8, color: "#22c55e" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 1, shareOfShelf: 5, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 4, shareOfShelf: 20, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 10, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 4, shareOfShelf: 22, color: "#a1a1aa" },
    ]
  },
  {
    id: "at-work",
    name: "At-Work (Office/Corporate)",
    category: "away-from-home",
    storeCoverage: 35,
    marketShare: 3,
    shareOfShelf: 55,
    targetShareOfShelf: 62,
    shelfAvailability: 22,
    trend: "down",
    trendValue: -0.8,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 5, shareOfShelf: 28, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 2, shareOfShelf: 12, color: "#f97316" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 2, shareOfShelf: 10, color: "#dc2626" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 1, shareOfShelf: 5, color: "#22c55e" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 4, shareOfShelf: 22, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 10, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 2, shareOfShelf: 13, color: "#a1a1aa" },
    ]
  },
  {
    id: "leisure",
    name: "Leisure (Cinema/Sports/Events)",
    category: "away-from-home",
    storeCoverage: 55,
    marketShare: 4,
    shareOfShelf: 62,
    targetShareOfShelf: 68,
    shelfAvailability: 8,
    trend: "up",
    trendValue: 3.2,
    shelfComposition: [
      { brand: "Brand A", portfolio: "Brand Owner", facings: 7, shareOfShelf: 35, color: "#ef4444" },
      { brand: "Brand D", portfolio: "Brand Owner", facings: 3, shareOfShelf: 15, color: "#f97316" },
      { brand: "Brand C", portfolio: "Brand Owner", facings: 2, shareOfShelf: 8, color: "#22c55e" },
      { brand: "Brand A Zero", portfolio: "Brand Owner", facings: 1, shareOfShelf: 4, color: "#dc2626" },
      { brand: "Competitor X", portfolio: "Competitor", facings: 4, shareOfShelf: 20, color: "#2563eb" },
      { brand: "Competitor W", portfolio: "Competitor", facings: 2, shareOfShelf: 10, color: "#16a34a" },
      { brand: "Other", portfolio: "Other", facings: 2, shareOfShelf: 8, color: "#a1a1aa" },
    ]
  },
]

// Combined channel data for when needed
const channelData: ChannelData[] = [...atHomeChannels, ...awayFromHomeChannels]

// Portfolio colors for aggregation
const portfolioColors: Record<string, string> = {
  "Brand Owner": "#ef4444",
  "Competitor": "#2563eb",
  "Alternative": "#7c3aed",
  "Private Label": "#6b7280",
  "Other": "#a1a1aa",
}

// Slicer options
const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "cola-regular", label: "Cola Regular" },
  { value: "cola-zero", label: "Cola Zero" },
  { value: "cola-diet", label: "Cola Diet" },
  { value: "citrus-fruity", label: "Citrus/Fruity" },
  { value: "citrus-zero", label: "Citrus Zero" },
  { value: "bold", label: "Bold Flavors" },
]

const brandOptions = [
  { value: "all", label: "All Brands" },
  { value: "brand-a-classic", label: "Brand A Classic" },
  { value: "brand-a-zero", label: "Brand A Zero" },
  { value: "brand-b", label: "Brand B" },
  { value: "brand-d", label: "Brand D" },
  { value: "brand-c", label: "Brand C" },
  { value: "brand-e", label: "Brand E" },
]

const yearOptions = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
]

const monthOptions = [
  { value: "all", label: "Full Year" },
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
]

export function AssortmentShare({ onNavigate }: Props) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [selectedChannelCategory, setSelectedChannelCategory] = useState<ChannelCategory>("at-home")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [showShelfAnalyzer, setShowShelfAnalyzer] = useState(false)

  // Get channels for selected category
  const currentChannels = useMemo(() => {
    return selectedChannelCategory === "at-home" ? atHomeChannels : awayFromHomeChannels
  }, [selectedChannelCategory])

  const selectedChannelData = useMemo(() => {
    return channelData.find(c => c.id === selectedChannel)
  }, [selectedChannel])

  // Check if current channel is away-from-home (for label changes)
  const isAwayFromHome = selectedChannelData?.category === "away-from-home"

  // Get the share label based on channel category
  const getShareLabel = (channel: ChannelData) => {
    return channel.category === "away-from-home" ? "Share of Assortment" : "Share of Shelf"
  }

  // Aggregate shelf composition by portfolio
  const portfolioAggregation = useMemo(() => {
    if (!selectedChannelData) return []
    const agg: Record<string, { portfolio: string; facings: number; shareOfShelf: number; color: string }> = {}
    selectedChannelData.shelfComposition.forEach(item => {
      if (!agg[item.portfolio]) {
        agg[item.portfolio] = { portfolio: item.portfolio, facings: 0, shareOfShelf: 0, color: portfolioColors[item.portfolio] }
      }
      agg[item.portfolio].facings += item.facings
      agg[item.portfolio].shareOfShelf += item.shareOfShelf
    })
    return Object.values(agg).sort((a, b) => b.shareOfShelf - a.shareOfShelf)
  }, [selectedChannelData])

  // Calculate weighted coverage for current channel category
  const weightedCoverage = useMemo(() => {
    const channels = currentChannels
    const totalSales = channels.reduce((sum, c) => sum + c.marketShare, 0)
    const weightedSOS = channels.reduce((sum, c) => sum + (c.shareOfShelf * c.marketShare / 100), 0)
    return {
      avgStoreCoverage: Math.round(channels.reduce((sum, c) => sum + c.storeCoverage, 0) / channels.length),
      weightedShareOfShelf: Math.round(weightedSOS / totalSales * 100 * 10) / 10,
      totalSalesReach: totalSales,
    }
  }, [currentChannels])

  return (
    <Card className="bg-zinc-900/70 border-zinc-800 shadow-xl">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Assortment & Mix</h2>
            <p className="text-xs text-zinc-500">Share of Shelf Feasibility Analysis</p>
          </div>
        </div>
        
        {/* Slicers Row */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
            >
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
            >
              {brandOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
            >
              {yearOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
            >
              {monthOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Country:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
            >
              <option value="all">All Countries</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </select>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => tab.id !== "assortment-share" && onNavigate?.(tab.id)}
              className={cn(
                "px-5 py-2.5 text-xs font-medium transition-colors",
                tab.id === "assortment-share"
                  ? "text-zinc-100 border-b-2 border-red-500"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* AI Insight Banner for Storyline */}
        {!selectedChannel && (
          <Card className="bg-gradient-to-r from-amber-500/10 to-emerald-500/5 border-amber-500/20 mb-4">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-amber-300">AI Insight</span>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px]">Shelf Opportunity</Badge>
                  </div>
                  <div className="space-y-2 text-xs text-zinc-300">
                    <p>
                      <span className="text-zinc-100 font-medium">Weighted SOS at 38.6%</span> - Drilling into channels: 
                      <span className="text-red-400 font-medium"> Convenience is down -1.2% vs LY</span> and 7pts below target.
                    </p>
                    <p>
                      <span className="text-amber-300 font-medium">HoReCa has the biggest gap to target</span> (52% vs 60%) with only 45% store coverage - a clear white space opportunity.
                    </p>
                    <p className="text-emerald-300">
                      Recommendation: Delist tail SKUs, reallocate shelf to 330ml in Convenience, and push HoReCa coverage.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate?.("simulate-forecast")}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  Simulate
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Channel Category Tabs */}
        {!selectedChannel && (
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedChannelCategory("at-home")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedChannelCategory === "at-home"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-300"
              )}
            >
              <Store className="w-4 h-4 inline-block mr-2" />
              At-Home
            </button>
            <button
              onClick={() => setSelectedChannelCategory("away-from-home")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedChannelCategory === "away-from-home"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-300"
              )}
            >
              <ShoppingCart className="w-4 h-4 inline-block mr-2" />
              Away-From-Home
            </button>
            <div className="ml-4 text-xs text-zinc-500">
              {selectedChannelCategory === "at-home" 
                ? "Hypermarkets, Supermarkets, Convenience, Discounters" 
                : "Travel, Vending, At-Work, Hotels, Restaurants, Cafes, Leisure, QSR"}
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left panel - Channel overview or back button */}
          <div className={cn("space-y-3", selectedChannel ? "col-span-4" : "col-span-12")}>
            {selectedChannel && (
              <button
                onClick={() => setSelectedChannel(null)}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 mb-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to all channels
              </button>
            )}

            {/* Summary KPIs */}
            {!selectedChannel && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{selectedChannelCategory === "at-home" ? "Avg Store Coverage" : "Avg Outlet Coverage"}</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-100">{weightedCoverage.avgStoreCoverage}%</div>
                  <div className="text-xs text-zinc-500">{selectedChannelCategory === "at-home" ? "of stores reached" : "of outlets reached"}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Sales Reach</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-100">{weightedCoverage.totalSalesReach}%</div>
                  <div className="text-xs text-zinc-500">of {selectedChannelCategory === "at-home" ? "at-home" : "AFH"} sales</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{selectedChannelCategory === "at-home" ? "Weighted SOS" : "Weighted SOA"}</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">{weightedCoverage.weightedShareOfShelf}%</div>
                  <div className="text-xs text-zinc-500">TCCC {selectedChannelCategory === "at-home" ? "share of shelf" : "share of assortment"}</div>
                </div>
              </div>
            )}

            {/* Channel cards */}
            <div className={cn("space-y-2", !selectedChannel && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3")}>
              {(selectedChannel ? [selectedChannelData!] : currentChannels).map(channel => (
                <div
                  key={channel.id}
                  onClick={() => !selectedChannel && setSelectedChannel(channel.id)}
                  className={cn(
                    "bg-zinc-800/50 rounded-lg p-4 border transition-all",
                    selectedChannel
                      ? "border-red-500/50 cursor-default"
                      : "border-zinc-700/50 hover:border-zinc-600 cursor-pointer hover:bg-zinc-800/70"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-zinc-100 text-sm">{channel.name}</h3>
                    {!selectedChannel && <ChevronRight className="w-4 h-4 text-zinc-500" />}
                  </div>

                  {/* Coverage vs Sales visualization */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">Store Coverage</span>
                        <span className="text-zinc-300">{channel.storeCoverage}%</span>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${channel.storeCoverage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">Market Share</span>
                        <span className="text-zinc-300">{channel.marketShare}%</span>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${channel.marketShare * 2}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-700/50">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">{getShareLabel(channel)} (TCCC)</span>
                        <div className="flex items-center gap-1">
                          <span className={cn(
                            "font-medium",
                            channel.shareOfShelf >= channel.targetShareOfShelf ? "text-emerald-400" : "text-amber-400"
                          )}>{channel.shareOfShelf}%</span>
                          <span className="text-zinc-600">/</span>
                          <span className="text-zinc-500">{channel.targetShareOfShelf}% target</span>
                        </div>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden relative">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            channel.shareOfShelf >= channel.targetShareOfShelf ? "bg-emerald-500" : "bg-amber-500"
                          )}
                          style={{ width: `${channel.shareOfShelf}%` }}
                        />
                        {/* Target marker */}
                        <div 
                          className="absolute top-0 h-full w-0.5 bg-zinc-300"
                          style={{ left: `${channel.targetShareOfShelf}%` }}
                        />
                      </div>
                    </div>

                    {/* Trend indicator */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        {channel.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        ) : channel.trend === "down" ? (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        ) : (
                          <div className="w-3 h-0.5 bg-zinc-500" />
                        )}
                        <span className={cn(
                          "text-xs",
                          channel.trend === "up" ? "text-emerald-400" :
                          channel.trend === "down" ? "text-red-400" : "text-zinc-500"
                        )}>
                          {channel.trendValue > 0 ? "+" : ""}{channel.trendValue}% vs LY
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Package className="w-3 h-3" />
                        {channel.shelfAvailability}% avail.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - Shelf composition detail */}
          {selectedChannel && selectedChannelData && (
            <div className="col-span-8 space-y-4">
              {/* Shelf/Assortment composition header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-100">{isAwayFromHome ? "Assortment Composition" : "Shelf Composition"}</h3>
                  <p className="text-xs text-zinc-500">{selectedChannelData.name} - {isAwayFromHome ? "Share of Assortment" : "Share of Shelf"} breakdown</p>
                </div>
                <button
                  onClick={() => setShowShelfAnalyzer(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  {isAwayFromHome ? "View Menu/Outlet Pictures" : "View Shelf Pictures"}
                </button>
              </div>

              {/* Visual shelf/assortment representation */}
              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <div className="text-xs text-zinc-500 mb-3">{isAwayFromHome ? "Assortment Layout Visualization" : "Shelf Layout Visualization"}</div>
                
                {/* Shelf grid - visual representation */}
                <div className="grid grid-cols-10 gap-1 mb-4">
                  {selectedChannelData.shelfComposition.flatMap((item, i) => 
                    Array(Math.max(1, Math.round(item.facings / 3))).fill(null).map((_, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="aspect-[3/4] rounded-sm flex items-end justify-center p-1 group relative"
                        style={{ backgroundColor: item.color + "40", borderColor: item.color, borderWidth: 1 }}
                      >
                        <div className="text-[8px] text-zinc-400 truncate">{item.brand.slice(0, 3)}</div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/80 rounded-sm flex items-center justify-center transition-opacity">
                          <span className="text-[10px] text-white text-center px-1">{item.brand}</span>
                        </div>
                      </div>
                    ))
                  )}
                  {/* Available shelf space */}
                  {Array(Math.round(selectedChannelData.shelfAvailability / 5)).fill(null).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-[3/4] rounded-sm border border-dashed border-zinc-600 flex items-center justify-center"
                    >
                      <span className="text-[8px] text-zinc-600">+</span>
                    </div>
                  ))}
                </div>

                {/* Portfolio breakdown bars */}
                <div className="space-y-2">
                  <div className="text-xs text-zinc-500 mb-2">Share by Portfolio</div>
                  {portfolioAggregation.map(p => (
                    <div key={p.portfolio} className="flex items-center gap-3">
                      <div className="w-24 text-xs text-zinc-400">{p.portfolio}</div>
                      <div className="flex-1 h-6 bg-zinc-700/50 rounded relative overflow-hidden">
                        <div
                          className="h-full rounded flex items-center justify-end pr-2"
                          style={{ 
                            width: `${p.shareOfShelf}%`, 
                            backgroundColor: p.color 
                          }}
                        >
                          <span className="text-xs font-medium text-white drop-shadow">{p.shareOfShelf}%</span>
                        </div>
                      </div>
                      <div className="w-16 text-xs text-zinc-500 text-right">{p.facings} facings</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand-level detail table */}
              <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/50 overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-700/50">
                  <span className="text-xs text-zinc-500">Brand Detail</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700/50 text-xs text-zinc-500">
                      <th className="text-left px-4 py-2 font-medium">Brand</th>
                      <th className="text-left px-4 py-2 font-medium">Portfolio</th>
                      <th className="text-right px-4 py-2 font-medium">{isAwayFromHome ? "SKUs" : "Facings"}</th>
                      <th className="text-right px-4 py-2 font-medium">{isAwayFromHome ? "Share of Assortment" : "Share of Shelf"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChannelData.shelfComposition.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-700/30 text-xs hover:bg-zinc-800/30">
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-zinc-200">{item.brand}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-zinc-400">{item.portfolio}</td>
                        <td className="px-4 py-2 text-right text-zinc-300">{item.facings}</td>
                        <td className="px-4 py-2 text-right">
                          <span className={cn(
                            "font-medium",
                            item.portfolio === "TCCC" ? "text-red-400" : "text-zinc-300"
                          )}>{item.shareOfShelf}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Opportunity callout */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-1">Opportunity Identified</h4>
                    <p className="text-xs text-zinc-400">
                      {selectedChannelData.shelfAvailability}% {isAwayFromHome ? "menu/assortment space" : "shelf space"} available in {selectedChannelData.name}. 
                      Current TCCC {isAwayFromHome ? "SOA" : "SOS"} ({selectedChannelData.shareOfShelf}%) is {selectedChannelData.shareOfShelf < selectedChannelData.targetShareOfShelf ? "below" : "meeting"} target ({selectedChannelData.targetShareOfShelf}%). 
                      {selectedChannelData.shelfAvailability > 10 
                        ? " High availability suggests opportunity for SKU expansion."
                        : isAwayFromHome ? " Limited availability - focus on menu placement optimization." : " Limited availability - focus on facing optimization."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shelf Analyzer Modal */}
        {showShelfAnalyzer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowShelfAnalyzer(false)}>
            <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">{isAwayFromHome ? "Outlet Analyzer" : "Shelf Analyzer"}</h3>
                  <p className="text-xs text-zinc-500">{selectedChannelData?.name} - Recent {isAwayFromHome ? "outlet" : "shelf"} captures</p>
                </div>
                <button
                  onClick={() => setShowShelfAnalyzer(false)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Placeholder shelf images */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-video bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/50 to-zinc-800/50" />
                    <div className="relative text-center">
                      <Camera className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <span className="text-xs text-zinc-500">{isAwayFromHome ? "Outlet" : "Shelf"} Image {i}</span>
                      <span className="text-[10px] text-zinc-600 block">{isAwayFromHome ? "Outlet" : "Store"} #{1000 + i * 23}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-zinc-900/80 px-2 py-1 rounded text-[10px] text-zinc-400">
                      {["2 days ago", "5 days ago", "1 week ago", "2 weeks ago"][i - 1]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-zinc-500">
                <span>Showing 4 of 128 {isAwayFromHome ? "outlet" : "shelf"} captures</span>
                <button className="text-red-400 hover:text-red-300">
                  Open Full {isAwayFromHome ? "Outlet" : "Shelf"} Analyzer Tool
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
