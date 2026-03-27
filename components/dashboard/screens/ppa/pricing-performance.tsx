"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Minus, Info, Sparkles, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type PPAScreen = "pricing-performance" | "price-incentive" | "simulate-forecast"

interface Props { 
  onNavigate?: (screen: PPAScreen) => void 
  highlightCitrusFruity?: boolean
}

// Price type options
const priceTypeOptions = [
  { id: "overall", label: "Average Price" },
  { id: "promo", label: "Promo Price" },
  { id: "no-promo", label: "Non-Promo Price" },
]

// Years
const years = ["2023", "2024", "2025"]

// Pack sizes for filter
const packSizeOptions = [
  { id: "all", label: "All Pack Sizes" },
  { id: "330ml", label: "330ml Can" },
  { id: "500ml", label: "500ml PET" },
  { id: "1.5L", label: "1.5L PET" },
  { id: "2L", label: "2L PET" },
]

// Categories
const categories = [
  { id: "cola-regular", label: "Category A" },
  { id: "cola-diet", label: "Category B" },
  { id: "cola-zero", label: "Category C" },
  { id: "citrus-fruity", label: "Category D" },
  { id: "citrus-zero", label: "Category E" },
  { id: "bold", label: "Category F" },
]

// Portfolio Brand data with yearly pricing
interface BrandYearlyData {
  category: string
  yearly: {
    "2023": { overall: number; promo: number; noPromo: number; volume: number }
    "2024": { overall: number; promo: number; noPromo: number; volume: number }
    "2025": { overall: number; promo: number; noPromo: number; volume: number }
  }
}

// Brand Owner data with more realistic promo/non-promo spreads
const tcccBrandData: Record<string, BrandYearlyData> = {
  "Brand A": {
    category: "cola-regular",
    yearly: {
      "2023": { overall: 100, promo: 82, noPromo: 122, volume: 118.2 },
      "2024": { overall: 102, promo: 84, noPromo: 125, volume: 121.5 },
      "2025": { overall: 104, promo: 86, noPromo: 128, volume: 124.4 },
    }
  },
  "Brand B": {
    category: "cola-zero",
    yearly: {
      "2023": { overall: 98, promo: 80, noPromo: 120, volume: 82.1 },
      "2024": { overall: 99, promo: 81, noPromo: 122, volume: 86.3 },
      "2025": { overall: 100, promo: 82, noPromo: 124, volume: 90.4 },
    }
  },
  "Brand C": {
    category: "cola-diet",
    yearly: {
      "2023": { overall: 102, promo: 85, noPromo: 125, volume: 52.8 },
      "2024": { overall: 103, promo: 86, noPromo: 128, volume: 54.6 },
      "2025": { overall: 104, promo: 87, noPromo: 130, volume: 56.4 },
    }
  },
  "Brand D": {
    category: "citrus-fruity",
    yearly: {
      "2023": { overall: 92, promo: 75, noPromo: 115, volume: 62.5 },
      "2024": { overall: 93, promo: 76, noPromo: 118, volume: 64.8 },
      "2025": { overall: 94, promo: 77, noPromo: 120, volume: 67.2 },
    }
  },
  "Brand E": {
    category: "citrus-fruity",
    yearly: {
      "2023": { overall: 94, promo: 76, noPromo: 116, volume: 48.5 },
      "2024": { overall: 95, promo: 77, noPromo: 118, volume: 50.4 },
      "2025": { overall: 96, promo: 78, noPromo: 120, volume: 52.3 },
    }
  },
}

// Competitor portfolio data with yearly pricing
interface CompetitorPortfolioData {
  name: string
  color: string
  yearly: {
    "2023": { overall: number; promo: number; noPromo: number; volume: number }
    "2024": { overall: number; promo: number; noPromo: number; volume: number }
    "2025": { overall: number; promo: number; noPromo: number; volume: number }
  }
  // Category-level data
  categories: Record<string, {
    yearly: {
      "2023": { overall: number; promo: number; noPromo: number; volume: number }
      "2024": { overall: number; promo: number; noPromo: number; volume: number }
      "2025": { overall: number; promo: number; noPromo: number; volume: number }
    }
  }>
}

// Market competitors
const competitorPortfolios: CompetitorPortfolioData[] = [
  {
    name: "Competitor X",
    color: "#2563eb",
    yearly: {
      "2023": { overall: 94, promo: 78, noPromo: 112, volume: 185.4 },
      "2024": { overall: 96, promo: 79, noPromo: 115, volume: 192.2 },
      "2025": { overall: 97, promo: 80, noPromo: 118, volume: 198.5 },
    },
    categories: {
      "cola-regular": { yearly: { "2023": { overall: 95, promo: 79, noPromo: 114, volume: 72.5 }, "2024": { overall: 96, promo: 80, noPromo: 116, volume: 75.8 }, "2025": { overall: 97, promo: 81, noPromo: 118, volume: 78.5 } } },
      "cola-zero": { yearly: { "2023": { overall: 93, promo: 76, noPromo: 112, volume: 58.2 }, "2024": { overall: 94, promo: 77, noPromo: 114, volume: 62.5 }, "2025": { overall: 95, promo: 78, noPromo: 116, volume: 67.5 } } },
      "cola-diet": { yearly: { "2023": { overall: 92, promo: 75, noPromo: 110, volume: 25.2 }, "2024": { overall: 93, promo: 76, noPromo: 112, volume: 26.8 }, "2025": { overall: 94, promo: 77, noPromo: 114, volume: 28.2 } } },
      "citrus-fruity": { yearly: { "2023": { overall: 91, promo: 74, noPromo: 108, volume: 88.5 }, "2024": { overall: 92, promo: 75, noPromo: 110, volume: 94.2 }, "2025": { overall: 93, promo: 76, noPromo: 112, volume: 100.3 } } },
      "citrus-zero": { yearly: { "2023": { overall: 94, promo: 78, noPromo: 112, volume: 12.2 }, "2024": { overall: 95, promo: 79, noPromo: 114, volume: 13.5 }, "2025": { overall: 96, promo: 80, noPromo: 116, volume: 14.5 } } },
      "bold": { yearly: { "2023": { overall: 99, promo: 82, noPromo: 118, volume: 15.5 }, "2024": { overall: 100, promo: 83, noPromo: 120, volume: 16.8 }, "2025": { overall: 101, promo: 84, noPromo: 122, volume: 17.8 } } },
    }
  },
  {
    name: "Competitor Y",
    color: "#0891b2",
    yearly: {
      "2023": { overall: 88, promo: 72, noPromo: 108, volume: 145.5 },
      "2024": { overall: 89, promo: 73, noPromo: 110, volume: 152.8 },
      "2025": { overall: 90, promo: 74, noPromo: 112, volume: 160.6 },
    },
    categories: {
      "cola-regular": { yearly: { "2023": { overall: 86, promo: 70, noPromo: 106, volume: 28.2 }, "2024": { overall: 87, promo: 71, noPromo: 108, volume: 30.5 }, "2025": { overall: 88, promo: 72, noPromo: 110, volume: 32.5 } } },
      "citrus-fruity": { yearly: { "2023": { overall: 84, promo: 68, noPromo: 104, volume: 65.8 }, "2024": { overall: 85, promo: 69, noPromo: 106, volume: 70.2 }, "2025": { overall: 86, promo: 70, noPromo: 108, volume: 74.5 } } },
      "bold": { yearly: { "2023": { overall: 92, promo: 76, noPromo: 112, volume: 12.2 }, "2024": { overall: 93, promo: 77, noPromo: 114, volume: 13.2 }, "2025": { overall: 94, promo: 78, noPromo: 116, volume: 14.2 } } },
    }
  },
  {
    name: "Competitor Z",
    color: "#eab308",
    yearly: {
      "2023": { overall: 108, promo: 88, noPromo: 132, volume: 78.5 },
      "2024": { overall: 110, promo: 90, noPromo: 135, volume: 82.2 },
      "2025": { overall: 112, promo: 92, noPromo: 138, volume: 86.4 },
    },
    categories: {
      "citrus-fruity": { yearly: { "2023": { overall: 106, promo: 86, noPromo: 130, volume: 42.5 }, "2024": { overall: 108, promo: 88, noPromo: 132, volume: 45.2 }, "2025": { overall: 110, promo: 90, noPromo: 135, volume: 48.4 } } },
      "citrus-zero": { yearly: { "2023": { overall: 112, promo: 92, noPromo: 138, volume: 18.0 }, "2024": { overall: 114, promo: 94, noPromo: 140, volume: 19.0 }, "2025": { overall: 116, promo: 96, noPromo: 142, volume: 20.0 } } },
      "bold": { yearly: { "2023": { overall: 115, promo: 95, noPromo: 142, volume: 18.0 }, "2024": { overall: 117, promo: 97, noPromo: 145, volume: 18.0 }, "2025": { overall: 119, promo: 99, noPromo: 148, volume: 18.0 } } },
    }
  },
  {
    name: "Competitor W",
    color: "#16a34a",
    yearly: {
      "2023": { overall: 118, promo: 98, noPromo: 145, volume: 42.5 },
      "2024": { overall: 120, promo: 100, noPromo: 148, volume: 45.2 },
      "2025": { overall: 122, promo: 102, noPromo: 152, volume: 48.4 },
    },
    categories: {
      "citrus-fruity": { yearly: { "2023": { overall: 115, promo: 95, noPromo: 142, volume: 32.5 }, "2024": { overall: 117, promo: 97, noPromo: 145, volume: 35.2 }, "2025": { overall: 119, promo: 99, noPromo: 148, volume: 38.4 } } },
      "bold": { yearly: { "2023": { overall: 122, promo: 102, noPromo: 150, volume: 10.0 }, "2024": { overall: 124, promo: 104, noPromo: 152, volume: 10.0 }, "2025": { overall: 126, promo: 106, noPromo: 155, volume: 10.0 } } },
    }
  },
  {
    name: "Private Label",
    color: "#6b7280",
    yearly: {
      "2023": { overall: 68, promo: 58, noPromo: 82, volume: 298.5 },
      "2024": { overall: 69, promo: 59, noPromo: 84, volume: 312.4 },
      "2025": { overall: 70, promo: 60, noPromo: 86, volume: 328.1 },
    },
    categories: {
      "cola-regular": { yearly: { "2023": { overall: 66, promo: 56, noPromo: 80, volume: 78.5 }, "2024": { overall: 67, promo: 57, noPromo: 82, volume: 82.2 }, "2025": { overall: 68, promo: 58, noPromo: 84, volume: 85.2 } } },
      "cola-zero": { yearly: { "2023": { overall: 68, promo: 58, noPromo: 82, volume: 32.5 }, "2024": { overall: 69, promo: 59, noPromo: 84, volume: 34.2 }, "2025": { overall: 70, promo: 60, noPromo: 86, volume: 35.8 } } },
      "cola-diet": { yearly: { "2023": { overall: 67, promo: 57, noPromo: 81, volume: 25.8 }, "2024": { overall: 68, promo: 58, noPromo: 82, volume: 27.2 }, "2025": { overall: 69, promo: 59, noPromo: 84, volume: 28.4 } } },
      "citrus-fruity": { yearly: { "2023": { overall: 69, promo: 59, noPromo: 83, volume: 75.2 }, "2024": { overall: 70, promo: 60, noPromo: 84, volume: 78.5 }, "2025": { overall: 71, promo: 61, noPromo: 86, volume: 81.3 } } },
      "citrus-zero": { yearly: { "2023": { overall: 71, promo: 61, noPromo: 85, volume: 10.5 }, "2024": { overall: 72, promo: 62, noPromo: 86, volume: 11.5 }, "2025": { overall: 73, promo: 63, noPromo: 88, volume: 12.4 } } },
    }
  },
]

// Calculate Portfolio portfolio totals
const getPortfolioPortfolioData = () => {
  const result: Record<string, { overall: number; promo: number; noPromo: number; volume: number }> = {}
  years.forEach(year => {
    const brands = Object.values(tcccBrandData)
    const totalVol = brands.reduce((s, b) => s + b.yearly[year as keyof typeof b.yearly].volume, 0)
    const avgOverall = Math.round(brands.reduce((s, b) => s + b.yearly[year as keyof typeof b.yearly].overall * b.yearly[year as keyof typeof b.yearly].volume, 0) / totalVol)
    const avgPromo = Math.round(brands.reduce((s, b) => s + b.yearly[year as keyof typeof b.yearly].promo * b.yearly[year as keyof typeof b.yearly].volume, 0) / totalVol)
    const avgNoPromo = Math.round(brands.reduce((s, b) => s + b.yearly[year as keyof typeof b.yearly].noPromo * b.yearly[year as keyof typeof b.yearly].volume, 0) / totalVol)
    result[year] = { overall: avgOverall, promo: avgPromo, noPromo: avgNoPromo, volume: totalVol }
  })
  return result
}

// Calculate Portfolio category data
const getPortfolioCategoryData = (category: string) => {
  const result: Record<string, { overall: number; promo: number; noPromo: number; volume: number }> = {}
  years.forEach(year => {
    const brands = Object.entries(tcccBrandData).filter(([_, b]) => b.category === category)
    if (brands.length === 0) {
      result[year] = { overall: 0, promo: 0, noPromo: 0, volume: 0 }
      return
    }
    const totalVol = brands.reduce((s, [_, b]) => s + b.yearly[year as keyof typeof b.yearly].volume, 0)
    const avgOverall = Math.round(brands.reduce((s, [_, b]) => s + b.yearly[year as keyof typeof b.yearly].overall * b.yearly[year as keyof typeof b.yearly].volume, 0) / totalVol)
    const avgPromo = Math.round(brands.reduce((s, [_, b]) => s + b.yearly[year as keyof typeof b.yearly].promo * b.yearly[year as keyof typeof b.yearly].volume, 0) / totalVol)
    const avgNoPromo = Math.round(brands.reduce((s, [_, b]) => s + b.yearly[year as keyof typeof b.yearly].noPromo * b.yearly[year as keyof typeof b.yearly].volume, 0) / totalVol)
    result[year] = { overall: avgOverall, promo: avgPromo, noPromo: avgNoPromo, volume: totalVol }
  })
  return result
}

export function PricingPerformance({ onNavigate, highlightCitrusFruity = true }: Props) {
  const [priceType, setPriceType] = useState("overall")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedPackSize, setSelectedPackSize] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Get price index based on type
  const getPriceIndex = (data: { overall: number; promo: number; noPromo: number }) => {
    if (priceType === "promo") return data.promo
    if (priceType === "no-promo") return data.noPromo
    return data.overall
  }

  // Portfolio portfolio data
  const tcccPortfolio = useMemo(() => getPortfolioPortfolioData(), [])

  // Chart 1: Brand-level yearly data (Portfolio vs competitors over time)
  const brandYearlyData = useMemo(() => {
    const data: { year: string; tccc: { index: number; volume: number }; competitors: { name: string; index: number; volume: number; color: string }[] }[] = []
    
    years.forEach(year => {
      const tcccData = tcccPortfolio[year]
      const competitorData = competitorPortfolios.map(c => ({
        name: c.name,
        index: getPriceIndex(c.yearly[year as keyof typeof c.yearly]),
        volume: c.yearly[year as keyof typeof c.yearly].volume,
        color: c.color,
      }))
      
      data.push({
        year,
        tccc: { index: getPriceIndex(tcccData), volume: tcccData.volume },
        competitors: competitorData,
      })
    })
    
    return data
  }, [priceType, tcccPortfolio])

  // Chart 2: Category-level data for selected year (filtered by selectedCategory)
  const categoryData = useMemo(() => {
    const data: { 
      category: string; 
      label: string;
      tccc: { index: number; volume: number } | null; 
      competitors: { name: string; index: number; volume: number; color: string }[] 
    }[] = []
    
    const catsToShow = selectedCategory === "all" ? categories : categories.filter(c => c.id === selectedCategory)
    
    catsToShow.forEach(cat => {
      const tcccCatData = getPortfolioCategoryData(cat.id)[selectedYear]
      const competitorCatData: { name: string; index: number; volume: number; color: string }[] = []
      
      competitorPortfolios.forEach(comp => {
        const catData = comp.categories[cat.id]
        if (catData) {
          const yearData = catData.yearly[selectedYear as keyof typeof catData.yearly]
          competitorCatData.push({
            name: comp.name,
            index: getPriceIndex(yearData),
            volume: yearData.volume,
            color: comp.color,
          })
        }
      })
      
      data.push({
        category: cat.id,
        label: cat.label,
        tccc: tcccCatData.volume > 0 ? { index: getPriceIndex(tcccCatData), volume: tcccCatData.volume } : null,
        competitors: competitorCatData,
      })
    })
    
    return data
  }, [priceType, selectedYear, selectedCategory])

  // Calculate bubble size (normalize to reasonable pixel sizes - COMPACT for single-page viewing)
  const getBubbleSize = (volume: number, maxVolume: number) => {
    const minSize = 14
    const maxSize = 28
    return minSize + (volume / maxVolume) * (maxSize - minSize)
  }

  // Find max volume for scaling
  const maxBrandVolume = useMemo(() => {
    let max = 0
    brandYearlyData.forEach(d => {
      max = Math.max(max, d.tccc.volume)
      d.competitors.forEach(c => { max = Math.max(max, c.volume) })
    })
    return max
  }, [brandYearlyData])

  const maxCategoryVolume = useMemo(() => {
    let max = 0
    categoryData.forEach(d => {
      if (d.tccc) max = Math.max(max, d.tccc.volume)
      d.competitors.forEach(c => { max = Math.max(max, c.volume) })
    })
    return max
  }, [categoryData])

  // KPI Summary
  const kpiSummary = useMemo(() => {
    const currentYear = tcccPortfolio["2025"]
    const prevYear = tcccPortfolio["2024"]
    const indexChange = getPriceIndex(currentYear) - getPriceIndex(prevYear)
    
    // Competitor average
    const compAvg = Math.round(competitorPortfolios.reduce((s, c) => s + getPriceIndex(c.yearly["2025"]), 0) / competitorPortfolios.length)
    const vsComp = getPriceIndex(currentYear) - compAvg
    
    return {
      currentIndex: getPriceIndex(currentYear),
      indexChange,
      vsCompetitors: vsComp,
      totalVolume: currentYear.volume,
    }
  }, [priceType, tcccPortfolio])

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 overflow-auto">
      {/* Header */}
      <div className="px-6 pt-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Price</h1>
            <p className="text-zinc-500 text-sm">Pricing Co-Pilot</p>
          </div>
        </div>
      </div>
      
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 px-6">
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-red-500">Pricing Performance</button>
        <button onClick={() => onNavigate?.("price-incentive")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Price Incentive Curve</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Simulate & Forecast</button>
      </div>

      {/* Content - COMPACT spacing */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">

        {/* AI Insight Banner - Citrus/Fruity underpricing */}
        {highlightCitrusFruity && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-amber-300">AI Insight: Pricing Opportunity Detected</span>
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px]">High Confidence</Badge>
                </div>
                <p className="text-xs text-amber-400/90 mb-2">
                  Category D (Brand D, Brand C) is underpriced vs. competitors by 8-12%. 
                  Price index at 94-96 vs. competitor average of 105-110. Opportunity to increase margin without volume loss.
                </p>
                <button 
                  onClick={() => onNavigate?.("price-incentive")}
                  className="text-[10px] text-amber-300 underline hover:text-amber-200"
                >
                  View Price Incentive Curve for details
                </button>
              </div>
              <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
            </div>
          </div>
        )}

        {/* KPI Summary - COMPACT */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <p className="text-[10px] text-zinc-500 mb-0.5">Portfolio Price Index</p>
              <p className="text-lg font-bold text-zinc-100">{kpiSummary.currentIndex}</p>
              <p className="text-[10px] text-zinc-500">vs parity (100)</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <p className="text-[10px] text-zinc-500 mb-0.5">YoY Change</p>
              <div className="flex items-center gap-1.5">
                <p className={cn("text-lg font-bold", kpiSummary.indexChange > 0 ? "text-emerald-400" : kpiSummary.indexChange < 0 ? "text-red-400" : "text-zinc-100")}>
                  {kpiSummary.indexChange > 0 ? "+" : ""}{kpiSummary.indexChange}
                </p>
                {kpiSummary.indexChange > 0 ? <TrendingUp className="h-4 w-4 text-emerald-400" /> : kpiSummary.indexChange < 0 ? <TrendingDown className="h-4 w-4 text-red-400" /> : <Minus className="h-4 w-4 text-zinc-400" />}
              </div>
              <p className="text-[10px] text-zinc-500">pts vs 2024</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <p className="text-[10px] text-zinc-500 mb-0.5">vs Competitors Avg</p>
              <div className="flex items-center gap-1.5">
                <p className={cn("text-lg font-bold", kpiSummary.vsCompetitors > 0 ? "text-emerald-400" : kpiSummary.vsCompetitors < 0 ? "text-red-400" : "text-zinc-100")}>
                  {kpiSummary.vsCompetitors > 0 ? "+" : ""}{kpiSummary.vsCompetitors}
                </p>
              </div>
              <p className="text-[10px] text-zinc-500">pts premium</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-3">
              <p className="text-[10px] text-zinc-500 mb-0.5">Total Volume</p>
              <p className="text-lg font-bold text-zinc-100">{kpiSummary.totalVolume.toFixed(1)}M</p>
              <p className="text-[10px] text-zinc-500">liters (2025)</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Charts - COMPACT spacing */}
        <div className="grid grid-cols-2 gap-4">
          {/* Chart 1: Brand-level over time with promo/non-promo/avg dots */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                Portfolio Price Index Over Time
                <Info className="h-3 w-3 text-zinc-500" />
              </CardTitle>
              <p className="text-[10px] text-zinc-500">All players: Promo / Avg / Non-Promo prices by year</p>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {/* Chart Area - increased height for better spacing */}
              <div className="relative h-56 mt-2">
                {/* Y-axis labels - positioned outside chart area */}
                <div className="absolute left-0 top-0 bottom-10 w-8 flex flex-col justify-between text-[9px] text-zinc-500 pr-1">
                  <span className="text-right">130</span>
                  <span className="text-right">115</span>
                  <span className="text-right">100</span>
                  <span className="text-right">85</span>
                  <span className="text-right">70</span>
                </div>
                
                {/* Chart grid and dots */}
                <div className="absolute left-10 right-2 top-0 bottom-10">
                  {/* Parity line */}
                  <div className="absolute left-0 right-0 border-t-2 border-dashed border-zinc-600" style={{ top: `${((130 - 100) / 60) * 100}%` }}>
                    <span className="absolute -right-1 -top-3 text-[9px] text-zinc-500">Parity</span>
                  </div>
                  
                  {/* Grid lines */}
                  {[130, 115, 100, 85, 70].map(val => (
                    <div key={val} className="absolute left-0 right-0 border-t border-zinc-800" style={{ top: `${((130 - val) / 60) * 100}%` }} />
                  ))}
                  
                  {/* X-axis labels - Years - positioned below chart area */}
                  <div className="absolute left-0 right-0 top-full mt-2 flex">
                    {years.map((year) => (
                      <div key={year} className="flex-1 flex justify-center">
                        <span className="text-[10px] text-zinc-300 font-semibold">{year}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Player dots with connected lines - Brand colors with tints for promo/avg/non-promo */}
                  {/* Portfolio (Red brand color with tints) */}
                  {years.map((year, yi) => {
                    const xPos = (yi + 0.5) / years.length * 100
                    const yearData = tcccPortfolio[year]
                    const promoY = ((130 - yearData.promo) / 60) * 100
                    const avgY = ((130 - yearData.overall) / 60) * 100
                    const noPromoY = ((130 - yearData.noPromo) / 60) * 100
                    const spreadPct = ((yearData.noPromo - yearData.promo) / yearData.overall * 100).toFixed(1)
                    
                    // Red brand color tints: light (promo), medium (avg), dark (non-promo)
                    const promoColor = "#fca5a5" // red-300 (lighter tint)
                    const avgColor = "#ef4444" // red-500 (main brand)
                    const noPromoColor = "#991b1b" // red-800 (darker tint)
                    
                    return (
                      <div key={`tccc-${year}`} className="group">
                        {/* Dotted line connecting promo -> avg -> non-promo */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                          <line 
                            x1={`${xPos}%`} y1={`${promoY}%`} 
                            x2={`${xPos}%`} y2={`${noPromoY}%`} 
                            stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" 
                          />
                        </svg>
                        {/* Promo dot (lighter tint) */}
                        <div 
                          className="absolute w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 hover:z-50 transition-transform z-10 border border-white/30"
                          style={{ left: `${xPos}%`, top: `${promoY}%`, backgroundColor: promoColor }}
                          title={`Portfolio ${year}\nPromo Price Index: ${yearData.promo}\nVolume: ${yearData.volume.toFixed(1)}M L\nSpread vs Non-Promo: ${spreadPct}%`}
                        />
                        {/* Avg dot (main brand color, larger) */}
                        <div 
                          className="absolute w-3.5 h-3.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 hover:z-50 transition-transform z-20 border-2 border-white/40"
                          style={{ left: `${xPos}%`, top: `${avgY}%`, backgroundColor: avgColor }}
                          title={`Portfolio ${year}\nAverage Price Index: ${yearData.overall}\nVolume: ${yearData.volume.toFixed(1)}M L\nPromo-NonPromo Spread: ${spreadPct}%`}
                        />
                        {/* Non-promo dot (darker tint) */}
                        <div 
                          className="absolute w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 hover:z-50 transition-transform z-10 border border-white/20"
                          style={{ left: `${xPos}%`, top: `${noPromoY}%`, backgroundColor: noPromoColor }}
                          title={`Portfolio ${year}\nNon-Promo Price Index: ${yearData.noPromo}\nVolume: ${yearData.volume.toFixed(1)}M L\nPremium vs Promo: +${spreadPct}%`}
                        />
                      </div>
                    )
                  })}
                  
                  {/* Competitor dots - each brand has its own color with tints */}
                  {competitorPortfolios.map((comp, ci) => {
                    // Generate tints from brand color
                    const hex = comp.color.replace('#', '')
                    const r = parseInt(hex.substring(0, 2), 16)
                    const g = parseInt(hex.substring(2, 4), 16)
                    const b = parseInt(hex.substring(4, 6), 16)
                    // Lighter tint for promo
                    const promoColor = `rgb(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)})`
                    // Main color for avg
                    const avgColor = comp.color
                    // Darker tint for non-promo
                    const noPromoColor = `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`
                    
                    return years.map((year, yi) => {
                      const baseXPos = (yi + 0.5) / years.length * 100
                      // Offset each competitor slightly to avoid overlap
                      const xOffset = (ci - competitorPortfolios.length / 2 + 0.5) * 4
                      const xPos = baseXPos + xOffset
                      const yearData = comp.yearly[year as keyof typeof comp.yearly]
                      const promoY = ((130 - yearData.promo) / 60) * 100
                      const avgY = ((130 - yearData.overall) / 60) * 100
                      const noPromoY = ((130 - yearData.noPromo) / 60) * 100
                      const spreadPct = ((yearData.noPromo - yearData.promo) / yearData.overall * 100).toFixed(1)
                      
                      return (
                        <div key={`${comp.name}-${year}`}>
                          {/* Dotted line connecting promo -> avg -> non-promo */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                            <line 
                              x1={`${xPos}%`} y1={`${promoY}%`} 
                              x2={`${xPos}%`} y2={`${noPromoY}%`} 
                              stroke={comp.color} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" 
                            />
                          </svg>
                          {/* Promo dot (lighter tint) */}
                          <div 
                            className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 hover:z-50 transition-transform z-10 border border-white/20"
                            style={{ left: `${xPos}%`, top: `${promoY}%`, backgroundColor: promoColor }}
                            title={`${comp.name} ${year}\nPromo Price Index: ${yearData.promo}\nVolume: ${yearData.volume.toFixed(1)}M L\nSpread vs Non-Promo: ${spreadPct}%`}
                          />
                          {/* Avg dot (main brand color, larger) */}
                          <div 
                            className="absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 hover:z-50 transition-transform z-20 border border-white/30"
                            style={{ left: `${xPos}%`, top: `${avgY}%`, backgroundColor: avgColor }}
                            title={`${comp.name} ${year}\nAverage Price Index: ${yearData.overall}\nVolume: ${yearData.volume.toFixed(1)}M L\nPromo-NonPromo Spread: ${spreadPct}%`}
                          />
                          {/* Non-promo dot (darker tint) */}
                          <div 
                            className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 hover:z-50 transition-transform z-10 border border-white/10"
                            style={{ left: `${xPos}%`, top: `${noPromoY}%`, backgroundColor: noPromoColor }}
                            title={`${comp.name} ${year}\nNon-Promo Price Index: ${yearData.noPromo}\nVolume: ${yearData.volume.toFixed(1)}M L\nPremium vs Promo: +${spreadPct}%`}
                          />
                        </div>
                      )
                    })
                  })}
                </div>
              </div>
              
              {/* Dot legend - Brand color tints explanation */}
              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-zinc-800 text-[9px] text-zinc-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-300 border border-white/30" />
                  <span className="text-zinc-400">Promo (light)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white/40" />
                  <span className="text-zinc-400">Average</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-800 border border-white/20" />
                  <span className="text-zinc-400">Non-Promo (dark)</span>
                </div>
                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-zinc-700">
                  <svg width="12" height="2"><line x1="0" y1="1" x2="12" y2="1" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" /></svg>
                  <span>Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Category breakdown */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    Price Index by Category ({selectedYear})
                    <Info className="h-3 w-3 text-zinc-500" />
                  </CardTitle>
                  <p className="text-[10px] text-zinc-500">All categories with Portfolio and competitor positions</p>
                </div>
              </div>
              {/* Filters inside chart card */}
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-zinc-800 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">Price:</span>
                  <Select value={priceType} onValueChange={setPriceType}>
                    <SelectTrigger className="w-24 h-6 text-[10px] bg-zinc-800 border-zinc-700 px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceTypeOptions.map(opt => (
                        <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">Category:</span>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-28 h-6 text-[10px] bg-zinc-800 border-zinc-700 px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">Year:</span>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-16 h-6 text-[10px] bg-zinc-800 border-zinc-700 px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(y => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">Pack:</span>
                  <Select value={selectedPackSize} onValueChange={setSelectedPackSize}>
                    <SelectTrigger className="w-24 h-6 text-[10px] bg-zinc-800 border-zinc-700 px-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packSizeOptions.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
  <CardContent className="pt-0 pb-4">
              {/* Chart Area - increased height for better spacing */}
              <div className="relative h-48 mt-2">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-[10px] text-zinc-500">
                  <span>130</span>
                  <span>115</span>
                  <span>100</span>
                  <span>85</span>
                  <span>70</span>
                </div>
                
                {/* Chart grid and bubbles */}
                <div className="absolute left-10 right-2 top-0 bottom-8">
                  {/* Parity line */}
                  <div className="absolute left-0 right-0 border-t-2 border-dashed border-zinc-600" style={{ top: `${((130 - 100) / 60) * 100}%` }}>
                    <span className="absolute -right-1 -top-3 text-[10px] text-zinc-500">Parity</span>
                  </div>
                  
                  {/* Grid lines */}
                  {[130, 115, 100, 85, 70].map(val => (
                    <div key={val} className="absolute left-0 right-0 border-t border-zinc-800" style={{ top: `${((130 - val) / 60) * 100}%` }} />
                  ))}
                  
                  {/* X-axis labels - Categories - positioned below chart */}
                  <div className="absolute left-0 right-0 top-full mt-1 flex">
                    {categoryData.map((cat) => (
                      <div key={cat.category} className="flex-1 flex justify-center px-0.5">
                        <span className="text-[7px] text-zinc-300 font-medium text-center leading-tight">
                          {cat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bubbles by category - all bubbles for same category on same x-axis */}
                  {categoryData.map((cat, ci) => {
                    const xPos = (ci + 0.5) / categoryData.length * 100
                    const isCitrusFruity = cat.category === "citrus-fruity"
                    const shouldHighlight = highlightCitrusFruity && isCitrusFruity
                    
                    return (
                      <div key={cat.category}>
                        {/* Highlight ring for Citrus/Fruity */}
                        {shouldHighlight && cat.tccc && (
                          <div 
                            className="absolute rounded-full border-2 border-amber-400 border-dashed animate-pulse transform -translate-x-1/2 -translate-y-1/2 z-5"
                            style={{ 
                              left: `${xPos}%`, 
                              top: `${((130 - cat.tccc.index) / 60) * 100}%`,
                              width: getBubbleSize(cat.tccc.volume, maxCategoryVolume) + 12,
                              height: getBubbleSize(cat.tccc.volume, maxCategoryVolume) + 12,
                            }}
                          />
                        )}
                        {/* Portfolio bubble */}
                        {cat.tccc && (
                          <div 
                            className={cn(
                              "absolute rounded-full bg-red-500 flex items-center justify-center text-white text-[8px] font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:ring-2 hover:ring-red-300 transition-all z-10",
                              shouldHighlight && "ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-900"
                            )}
                            style={{ 
                              left: `${xPos}%`, 
                              top: `${((130 - cat.tccc.index) / 60) * 100}%`,
                              width: getBubbleSize(cat.tccc.volume, maxCategoryVolume),
                              height: getBubbleSize(cat.tccc.volume, maxCategoryVolume),
                            }}
                            title={`Portfolio ${cat.label}: ${cat.tccc.index} (${cat.tccc.volume.toFixed(0)}M L)${shouldHighlight ? " - UNDERPRICED vs competitors" : ""}`}
                          >
                            {cat.tccc.index}
                          </div>
                        )}
                        {/* AI Insight label for Citrus/Fruity */}
                        {shouldHighlight && cat.tccc && (
                          <div 
                            className="absolute flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 rounded px-1.5 py-0.5 transform -translate-x-1/2 z-20"
                            style={{ 
                              left: `${xPos}%`, 
                              top: `${((130 - cat.tccc.index) / 60) * 100 + 8}%`,
                            }}
                          >
                            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                            <span className="text-[7px] text-amber-300 font-medium whitespace-nowrap">Underpriced</span>
                          </div>
                        )}
                        
                        {/* Competitor bubbles - same x position, different y based on price index */}
                        {cat.competitors.map((comp) => {
                          const compYPos = ((130 - comp.index) / 60) * 100
                          const compSize = getBubbleSize(comp.volume, maxCategoryVolume)
                          
                          return (
                            <div 
                              key={comp.name}
                              className="absolute rounded-full flex items-center justify-center text-white text-[6px] font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                              style={{ 
                                left: `${xPos}%`, 
                                top: `${compYPos}%`,
                                width: compSize,
                                height: compSize,
                                backgroundColor: comp.color,
                              }}
                              title={`${comp.name} ${cat.label}: ${comp.index} (${comp.volume.toFixed(0)}M L)`}
                            >
                              {comp.index}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend - COMPACT */}
        <div className="flex items-center justify-center gap-4 pt-1 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[10px] text-zinc-400">Portfolio</span>
          </div>
          {competitorPortfolios.map(c => (
            <div key={c.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-[10px] text-zinc-400">{c.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <div className="w-4 h-0.5 border-t border-dashed border-zinc-500" />
            <span className="text-[10px] text-zinc-400">Parity (100)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <Info className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-400">Hover dots for details</span>
          </div>
        </div>
      </div>
    </div>
  )
}
