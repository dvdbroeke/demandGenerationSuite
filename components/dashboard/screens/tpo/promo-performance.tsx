"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Target, DollarSign, CheckCircle, XCircle, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TPOScreen } from "./promo-effectiveness"
import { allBrands, brandColors } from "../shared-sku-data"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface PromoPerformanceProps {
  onNavigate?: (screen: TPOScreen) => void
}

// Categories matching pricing-performance
const categories = [
  { id: "all", label: "All Categories" },
  { id: "cola-regular", label: "Cola - Regular Calorie" },
  { id: "cola-diet", label: "Cola - Diet" },
  { id: "cola-zero", label: "Cola - Zero" },
  { id: "citrus-fruity", label: "Citrus/Fruity" },
  { id: "citrus-zero", label: "Citrus/Fruity - No Calorie" },
  { id: "bold", label: "Bold" },
]

// Pack sizes
const packSizes = [
  { id: "all", label: "All Pack Sizes" },
  { id: "330ml", label: "330ml Can" },
  { id: "500ml", label: "500ml PET" },
  { id: "1.5L", label: "1.5L PET" },
  { id: "2L", label: "2L PET" },
]

// Brand to category mapping
const brandCategoryMap: Record<string, string> = {
  "Brand A Classic": "cola-regular",
  "Brand A Zero": "cola-zero",
  "Brand B": "cola-diet",
  "Brand C": "citrus-fruity",
  "Brand C Zero": "citrus-zero",
  "Brand D": "citrus-fruity",
  "Brand D Zero": "citrus-zero",
  "Brand A Cherry": "bold",
  "Brand A Vanilla": "bold",
}

// Seeded random
function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
function hashStr(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Brand Owner promo performance data
interface BrandPerformanceData {
  category: string
  roi: number
  roiChange: number
  totalPromos: number
  goodPromos: number
  badPromos: number
  avgLift: number
  avgDiscount: number
  incrementalRevenue: number
}

// STORYLINE: Brand B category showing declining ROI over last 3 months
const portfolioBrandData: Record<string, BrandPerformanceData> = {
  "Brand A Classic": { category: "cola-regular", roi: 1.42, roiChange: 0.08, totalPromos: 156, goodPromos: 98, badPromos: 32, avgLift: 38, avgDiscount: 22, incrementalRevenue: 4.2 },
  "Brand A Zero": { category: "cola-zero", roi: 1.68, roiChange: 0.12, totalPromos: 124, goodPromos: 86, badPromos: 18, avgLift: 45, avgDiscount: 18, incrementalRevenue: 3.8 },
  // STORYLINE: Brand B has significantly declining ROI - key problem area
  "Brand B": { category: "cola-diet", roi: 0.92, roiChange: -0.28, totalPromos: 142, goodPromos: 48, badPromos: 72, avgLift: 18, avgDiscount: 15, incrementalRevenue: 1.4 },
  "Brand C": { category: "citrus-fruity", roi: 1.35, roiChange: 0.04, totalPromos: 98, goodPromos: 62, badPromos: 22, avgLift: 34, avgDiscount: 20, incrementalRevenue: 2.1 },
  "Brand C Zero": { category: "citrus-zero", roi: 1.48, roiChange: 0.10, totalPromos: 72, goodPromos: 52, badPromos: 12, avgLift: 42, avgDiscount: 16, incrementalRevenue: 1.6 },
  "Brand D": { category: "citrus-fruity", roi: 1.28, roiChange: 0.02, totalPromos: 88, goodPromos: 54, badPromos: 24, avgLift: 32, avgDiscount: 21, incrementalRevenue: 1.9 },
  "Brand D Zero": { category: "citrus-zero", roi: 1.52, roiChange: 0.08, totalPromos: 64, goodPromos: 46, badPromos: 10, avgLift: 40, avgDiscount: 15, incrementalRevenue: 1.4 },
  "Brand A Cherry": { category: "bold", roi: 1.22, roiChange: -0.02, totalPromos: 56, goodPromos: 32, badPromos: 16, avgLift: 30, avgDiscount: 24, incrementalRevenue: 0.9 },
  "Brand A Vanilla": { category: "bold", roi: 1.18, roiChange: 0.01, totalPromos: 48, goodPromos: 28, badPromos: 14, avgLift: 28, avgDiscount: 22, incrementalRevenue: 0.8 },
}

// Generate time series data for promo performance
interface TimeSeriesPoint {
  period: string
  roi: number
  lift: number
  promoCount: number
}

const generateTimeSeriesData = (brand: string, timeGranularity: "week" | "month", seed: number): TimeSeriesPoint[] => {
  const rng = seededRandom(seed)
  const baseData = portfolioBrandData[brand] || { roi: 1.3, avgLift: 35, totalPromos: 100 }
  const periods = timeGranularity === "week" ? 12 : 12
  const data: TimeSeriesPoint[] = []
  
  for (let i = 0; i < periods; i++) {
    const periodLabel = timeGranularity === "week" 
      ? `W${i + 1}` 
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]
    
    // Add variance to create realistic fluctuations
    const roiVariance = (rng() - 0.5) * 0.6
    const liftVariance = (rng() - 0.5) * 20
    const promoVariance = Math.floor(rng() * 8) - 4
    
    // Seasonal patterns: higher in summer (Jun-Aug) and holidays (Nov-Dec)
    const seasonalBoost = timeGranularity === "month" 
      ? (i >= 5 && i <= 7 ? 0.15 : i >= 10 ? 0.1 : 0)
      : 0
    
    data.push({
      period: periodLabel,
      roi: Math.max(0.8, baseData.roi + roiVariance + seasonalBoost),
      lift: Math.max(15, baseData.avgLift + liftVariance),
      promoCount: Math.max(2, Math.floor(baseData.totalPromos / periods) + promoVariance),
    })
  }
  
  return data
}

const tabs: { id: TPOScreen; label: string }[] = [
  { id: "promo-evolution", label: "Promo Evolution" },
  { id: "promo-performance", label: "Promo Performance" },
  { id: "trade-client-matrix", label: "Trade vs Client Matrix" },
  { id: "performance-by-lever", label: "Performance by Lever" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

export function TPOPromoPerformance({ onNavigate }: PromoPerformanceProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedPackSize, setSelectedPackSize] = useState("all")
  const [timeGranularity, setTimeGranularity] = useState<"week" | "month">("month")
  const [dateRange, setDateRange] = useState({ start: "2025-01", end: "2025-12" })

  // Filter portfolio brands by category
  const filteredPortfolioBrands = useMemo(() => {
    const brands = Object.keys(portfolioBrandData)
    if (selectedCategory === "all") return brands
    return brands.filter(b => portfolioBrandData[b].category === selectedCategory)
  }, [selectedCategory])

  // Brand options based on category
  const brandOptions = useMemo(() => {
    return ["all", ...filteredPortfolioBrands]
  }, [filteredPortfolioBrands])

  // Reset brand when category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat)
    setSelectedBrand("all")
  }

  // Get portfolio data for display
  const portfolioDisplayData = useMemo(() => {
    if (selectedBrand !== "all") {
      const data = portfolioBrandData[selectedBrand]
      if (!data) return []
      return [{ brand: selectedBrand, ...data }]
    }
    return filteredPortfolioBrands.map(brand => ({ brand, ...portfolioBrandData[brand] }))
  }, [selectedBrand, filteredPortfolioBrands])

  // Calculate aggregates
  const portfolioAvgROI = useMemo(() => {
    if (portfolioDisplayData.length === 0) return 0
    return portfolioDisplayData.reduce((s, d) => s + d.roi, 0) / portfolioDisplayData.length
  }, [portfolioDisplayData])

  const totalPromos = useMemo(() => {
    return portfolioDisplayData.reduce((s, d) => s + d.totalPromos, 0)
  }, [portfolioDisplayData])

  const totalGood = useMemo(() => {
    return portfolioDisplayData.reduce((s, d) => s + d.goodPromos, 0)
  }, [portfolioDisplayData])

  const totalBad = useMemo(() => {
    return portfolioDisplayData.reduce((s, d) => s + d.badPromos, 0)
  }, [portfolioDisplayData])

  const totalIncremental = useMemo(() => {
    return portfolioDisplayData.reduce((s, d) => s + d.incrementalRevenue, 0)
  }, [portfolioDisplayData])

  // Generate time series data based on filters
  const timeSeriesData = useMemo(() => {
    const seed = hashStr(selectedCategory + selectedBrand + selectedPackSize + dateRange.start + dateRange.end)
    
    if (selectedBrand !== "all") {
      return [{
        brand: selectedBrand,
        color: brandColors[selectedBrand] || "#ef4444",
        data: generateTimeSeriesData(selectedBrand, timeGranularity, seed),
      }]
    }
    
    // Show top 3-4 brands when "all" is selected
    const topBrands = filteredPortfolioBrands.slice(0, 4)
    return topBrands.map((brand, idx) => ({
      brand,
      color: brandColors[brand] || ["#ef4444", "#f97316", "#eab308", "#22c55e"][idx % 4],
      data: generateTimeSeriesData(brand, timeGranularity, seed + idx * 100),
    }))
  }, [selectedBrand, selectedCategory, selectedPackSize, timeGranularity, dateRange, filteredPortfolioBrands])

  // AI Insights - STORYLINE: Highlight Brand B declining ROI
  const aiInsights = useMemo(() => {
    const insights: { type: "positive" | "warning" | "negative"; text: string; highlight?: boolean }[] = []
    
    // STORYLINE KEY INSIGHT: Brand B ROI declining
    insights.push({ 
      type: "negative", 
      text: "Cola - Diet category showing severe ROI decline: Brand B ROI dropped from 1.20x to 0.92x (-0.28x) over the last 3 months. 72 of 142 promos underperforming.",
      highlight: true
    })
    
    insights.push({
      type: "warning",
      text: "Brand B promos have low discount depth (avg 15%) and long durations. Competitor's 'fewer, deeper' approach suggests increasing price cut to 30%+ may improve performance.",
      highlight: true
    })

    const badRate = totalBad / totalPromos * 100
    if (badRate > 25) {
      insights.push({ type: "negative", text: `${badRate.toFixed(0)}% of promotions underperforming (${totalBad} of ${totalPromos}) -- Brand B driving majority of underperformers.` })
    } else if (badRate > 15) {
      insights.push({ type: "warning", text: `${badRate.toFixed(0)}% of promotions underperforming -- review mechanics of ${totalBad} low-ROI promos.` })
    }

    insights.push({ type: "warning", text: "Recommendation: Navigate to Trade vs Client Matrix to identify which specific Brand B promo events are dragging performance." })

    return insights.slice(0, 4)
  }, [totalBad, totalPromos])

  // Calculate chart min/max for Y-axis
  const chartYAxis = useMemo(() => {
    let minROI = 999, maxROI = 0
    timeSeriesData.forEach(series => {
      series.data.forEach(point => {
        minROI = Math.min(minROI, point.roi)
        maxROI = Math.max(maxROI, point.roi)
      })
    })
    return {
      min: Math.floor((minROI - 0.1) * 10) / 10,
      max: Math.ceil((maxROI + 0.1) * 10) / 10,
    }
  }, [timeSeriesData])

  return (
    <div className="space-y-4">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button onClick={() => onNavigate?.("promo-evolution")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Evolution</button>
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">Promo Performance</button>
        <button onClick={() => onNavigate?.("trade-client-matrix")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Trade vs Client Matrix</button>
        <button onClick={() => onNavigate?.("performance-by-lever")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Performance by Lever</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promotion Optimizer</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category filter */}
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-7 w-[180px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id} className="text-zinc-200 text-xs">{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand filter */}
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {brandOptions.map(b => (
              <SelectItem key={b} value={b} className="text-zinc-200 text-xs">
                {b === "all" ? "All Brands" : b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pack Size filter */}
        <Select value={selectedPackSize} onValueChange={setSelectedPackSize}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue placeholder="All Pack Sizes" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {packSizes.map(p => (
              <SelectItem key={p.id} value={p.id} className="text-zinc-200 text-xs">{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-zinc-800" />

        {/* Time Granularity */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-500">View:</span>
          <div className="flex rounded overflow-hidden border border-zinc-700">
            <button
              onClick={() => setTimeGranularity("week")}
              className={cn(
                "px-2 py-1 text-[10px] font-medium transition-colors",
                timeGranularity === "week" 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
              )}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeGranularity("month")}
              className={cn(
                "px-2 py-1 text-[10px] font-medium transition-colors",
                timeGranularity === "month" 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
              )}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px] gap-1.5">
              <Calendar className="h-3 w-3" />
              {dateRange.start} - {dateRange.end}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-zinc-900 border-zinc-800 p-3 w-auto" align="start">
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 font-medium">Select Date Range</div>
              <div className="flex items-center gap-2">
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">From</label>
                  <input 
                    type="month" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 w-32"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 block mb-1">To</label>
                  <input 
                    type="month" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 w-32"
                  />
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-[10px] bg-zinc-800 border-zinc-700"
                  onClick={() => setDateRange({ start: "2025-01", end: "2025-03" })}
                >
                  Q1 2025
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-[10px] bg-zinc-800 border-zinc-700"
                  onClick={() => setDateRange({ start: "2025-01", end: "2025-06" })}
                >
                  H1 2025
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-6 text-[10px] bg-zinc-800 border-zinc-700"
                  onClick={() => setDateRange({ start: "2025-01", end: "2025-12" })}
                >
                  Full Year
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
Portfolio Brands
          </span>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-red-400" />
              <span className="text-xs text-zinc-400">Avg ROI</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{portfolioAvgROI.toFixed(2)}x</div>
            <div className="text-xs text-zinc-500 mt-1">Target: 1.2x</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-zinc-400">Total Promos</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalPromos}</div>
            <div className="text-xs text-zinc-500 mt-1">YTD 2025</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-zinc-400">Good Promos</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{totalGood}</div>
            <div className="text-xs text-zinc-500 mt-1">{(totalGood / totalPromos * 100).toFixed(0)}% of total</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-xs text-zinc-400">Underperforming</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{totalBad}</div>
            <div className="text-xs text-zinc-500 mt-1">{(totalBad / totalPromos * 100).toFixed(0)}% of total</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-zinc-400">Incremental Rev</span>
            </div>
            <div className="text-2xl font-bold text-zinc-100">{totalIncremental.toFixed(1)}M</div>
            <div className="text-xs text-zinc-500 mt-1">From promotions</div>
          </CardContent>
        </Card>
      </div>

      {/* Promo Performance Timeline Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Promo ROI Performance Over Time
          </CardTitle>
          <p className="text-xs text-zinc-500">
            {timeGranularity === "week" ? "Weekly" : "Monthly"} ROI trend for selected brands ({dateRange.start} - {dateRange.end})
          </p>
        </CardHeader>
        <CardContent>
          {/* Line Chart */}
          <div className="relative h-64 mt-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-[10px] text-zinc-500">
              <span>{chartYAxis.max.toFixed(1)}x</span>
              <span>{((chartYAxis.max + chartYAxis.min) / 2).toFixed(1)}x</span>
              <span>{chartYAxis.min.toFixed(1)}x</span>
            </div>
            
            {/* Chart area */}
            <div className="absolute left-12 right-4 top-0 bottom-8">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[0, 0.5, 1].map((pct, i) => (
                  <div 
                    key={i} 
                    className="absolute left-0 right-0 border-t border-zinc-800"
                    style={{ top: `${pct * 100}%` }}
                  />
                ))}
                {/* 1.0x reference line */}
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-zinc-600"
                  style={{ top: `${((chartYAxis.max - 1.0) / (chartYAxis.max - chartYAxis.min)) * 100}%` }}
                >
                  <span className="absolute -right-2 -top-3 text-[9px] text-zinc-500">1.0x</span>
                </div>
              </div>
              
              {/* Lines and points */}
              <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                {timeSeriesData.map((series) => {
                  const points = series.data.map((point, i) => {
                    const x = (i / (series.data.length - 1)) * 100
                    const y = ((chartYAxis.max - point.roi) / (chartYAxis.max - chartYAxis.min)) * 100
                    return { x, y, ...point }
                  })
                  
                  // Create path
                  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ')
                  
                  return (
                    <g key={series.brand}>
                      {/* Line */}
                      <path 
                        d={pathD} 
                        fill="none" 
                        stroke={series.color} 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Points */}
                      {points.map((p, i) => (
                        <g key={i}>
                          <circle
                            cx={`${p.x}%`}
                            cy={`${p.y}%`}
                            r="4"
                            fill={series.color}
                            stroke="#18181b"
                            strokeWidth="2"
                            className="cursor-pointer hover:r-6 transition-all"
                          />
                          <title>{`${series.brand} - ${p.period}\nROI: ${p.roi.toFixed(2)}x\nLift: +${p.lift.toFixed(0)}%\nPromos: ${p.promoCount}`}</title>
                        </g>
                      ))}
                    </g>
                  )
                })}
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute left-0 right-0 top-full mt-2 flex justify-between">
                {timeSeriesData[0]?.data.map((point, i) => (
                  <span key={i} className="text-[10px] text-zinc-400">{point.period}</span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800">
            {timeSeriesData.map((series) => (
              <div key={series.brand} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: series.color }} />
                <span className="text-xs text-zinc-300">{series.brand}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Performance Table */}
      {selectedBrand === "all" && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Brand Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-8 gap-3 text-xs font-medium text-zinc-400 pb-2 border-b border-zinc-800">
                <div className="col-span-2">Brand</div>
                <div className="text-center">ROI</div>
                <div className="text-center">Promos</div>
                <div className="text-center">Good</div>
                <div className="text-center">Bad</div>
                <div className="text-center">Avg Lift</div>
                <div className="text-center">Incr. Rev</div>
              </div>

              {/* Brand rows */}
              {portfolioDisplayData.map((item) => (
                <div 
                  key={item.brand}
                  onClick={() => setSelectedBrand(item.brand)}
                  className="grid grid-cols-8 gap-3 py-2 border-b border-zinc-800/50 items-center hover:bg-zinc-800/30 cursor-pointer rounded transition-colors"
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors[item.brand] || "#ef4444" }} />
                    <span className="font-medium text-zinc-100">{item.brand}</span>
                  </div>
                  <div className="text-center">
                    <span className={cn(
                      "font-bold",
                      item.roi >= 1.5 ? "text-emerald-400" : item.roi >= 1.2 ? "text-amber-400" : "text-red-400"
                    )}>
                      {item.roi.toFixed(2)}x
                    </span>
                  </div>
                  <div className="text-center text-zinc-300">{item.totalPromos}</div>
                  <div className="text-center text-emerald-400">{item.goodPromos}</div>
                  <div className="text-center text-red-400">{item.badPromos}</div>
                  <div className="text-center text-zinc-300">+{item.avgLift}%</div>
                  <div className="text-center text-zinc-300">{item.incrementalRevenue.toFixed(1)}M</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Insights</h3>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px]">{aiInsights.length} findings</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {aiInsights.map((insight, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg border",
                  insight.type === "positive" ? "bg-emerald-500/5 border-emerald-500/20" :
                  insight.type === "warning" ? "bg-amber-500/5 border-amber-500/20" :
                  "bg-red-500/5 border-red-500/20"
                )}
              >
                <div className="flex items-start gap-2">
                  {insight.type === "positive" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> :
                   insight.type === "warning" ? <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" /> :
                   <TrendingDown className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
                  <p className="text-[11px] text-zinc-300 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
