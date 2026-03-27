"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TPOScreen } from "./promo-effectiveness"
import { allBrands, brandColors } from "../shared-sku-data"

interface PromoEvolutionProps {
  onNavigate?: (screen: TPOScreen) => void
}

// ---------- Data Generation ----------

const years = ["2022", "2023", "2024"] as const
const yearColors: Record<string, { bar: string; label: string }> = {
  "2022": { bar: "#a1a1aa", label: "text-zinc-400" },
  "2023": { bar: "#ef4444", label: "text-red-400" },
  "2024": { bar: "#991b1b", label: "text-red-700" },
}

const geographies = [
  { value: "all", label: "All Geographies" },
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "gb", label: "Great Britain" },
]

// Categories matching pricing-performance
const categories = [
  { id: "all", label: "All Categories" },
  { id: "cola-regular", label: "Category A" },
  { id: "cola-diet", label: "Category B" },
  { id: "cola-zero", label: "Category C" },
  { id: "citrus-fruity", label: "Category D" },
  { id: "citrus-zero", label: "Category E" },
  { id: "bold", label: "Category F" },
]

// Brand to category mapping
const brandCategoryMap: Record<string, string> = {
  "Brand A": "cola-regular",
  "Brand B": "cola-zero",
  "Brand C": "cola-diet",
  "Brand D": "citrus-fruity",
  "Brand E": "citrus-fruity",
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

// Brand Owner promo data [2022, 2023, 2024]
interface BrandPromoData {
  category: string
  promoIntensity: number[]
  priceCut: number[]
  promoPressure: number[]
}

const portfolioBrandData: Record<string, BrandPromoData> = {
  "Brand A": { category: "cola-regular", promoIntensity: [48, 55, 62], priceCut: [20, 28, 32], promoPressure: [10, 15, 18] },
  "Brand B": { category: "cola-zero", promoIntensity: [39, 51, 58], priceCut: [15, 26, 30], promoPressure: [6, 13, 16] },
  "Brand C": { category: "cola-diet", promoIntensity: [68, 73, 78], priceCut: [30, 35, 38], promoPressure: [21, 25, 28] },
  "Brand D": { category: "citrus-fruity", promoIntensity: [42, 48, 54], priceCut: [22, 26, 29], promoPressure: [13, 16, 19] },
  "Brand E": { category: "citrus-fruity", promoIntensity: [44, 50, 56], priceCut: [24, 28, 31], promoPressure: [15, 18, 21] },
}

// Competitor promo data with portfolio grouping
interface CompetitorPromoData {
  name: string
  portfolio: string // Parent company/portfolio
  category: string
  color: string
  promoIntensity: number[]
  priceCut: number[]
  promoPressure: number[]
}

// STORYLINE: Competitor X is doing LESS promos (lower intensity) but HIGHER price cuts (promo depth)
const competitorData: CompetitorPromoData[] = [
  // Competitor X Portfolio - Lower intensity, higher price cuts
  { name: "Competitor X Regular", portfolio: "Competitor X", category: "cola-regular", color: "#2563eb", promoIntensity: [52, 48, 42], priceCut: [24, 32, 38], promoPressure: [14, 16, 18] },
  { name: "Competitor X Max", portfolio: "Competitor X", category: "cola-zero", color: "#1d4ed8", promoIntensity: [42, 38, 32], priceCut: [18, 28, 35], promoPressure: [10, 12, 14] },
  { name: "Competitor X Diet", portfolio: "Competitor X", category: "cola-diet", color: "#3b82f6", promoIntensity: [62, 55, 48], priceCut: [28, 36, 42], promoPressure: [18, 20, 22] },
  { name: "Competitor Y", portfolio: "Competitor X", category: "citrus-fruity", color: "#16a34a", promoIntensity: [48, 44, 38], priceCut: [26, 32, 38], promoPressure: [16, 18, 20] },
  { name: "Competitor Y Free", portfolio: "Competitor X", category: "citrus-zero", color: "#22c55e", promoIntensity: [36, 32, 28], priceCut: [18, 26, 32], promoPressure: [10, 12, 14] },
  { name: "Competitor Z Orange", portfolio: "Competitor X", category: "citrus-fruity", color: "#ea580c", promoIntensity: [50, 45, 40], priceCut: [28, 34, 40], promoPressure: [18, 20, 22] },
  { name: "Competitor X Cherry", portfolio: "Competitor X", category: "bold", color: "#dc2626", promoIntensity: [48, 42, 36], priceCut: [24, 30, 36], promoPressure: [14, 16, 18] },
  // Alternative Portfolio
  { name: "Alternative Regular", portfolio: "Alternative", category: "cola-regular", color: "#7c3aed", promoIntensity: [45, 52, 58], priceCut: [22, 28, 32], promoPressure: [12, 16, 20] },
  { name: "Alternative Zero", portfolio: "Alternative", category: "cola-zero", color: "#6d28d9", promoIntensity: [38, 46, 52], priceCut: [16, 22, 26], promoPressure: [8, 12, 16] },
  { name: "Alternative Cherry", portfolio: "Alternative", category: "bold", color: "#be185d", promoIntensity: [50, 56, 62], priceCut: [26, 30, 34], promoPressure: [16, 20, 24] },
  { name: "Alternative Orange", portfolio: "Alternative", category: "citrus-fruity", color: "#f97316", promoIntensity: [46, 52, 58], priceCut: [24, 28, 32], promoPressure: [14, 18, 22] },
  // Other
  { name: "Budget Cola", portfolio: "Budget Cola", category: "cola-regular", color: "#4338ca", promoIntensity: [58, 64, 72], priceCut: [28, 34, 40], promoPressure: [18, 24, 30] },
  // Private Label
  { name: "Private Label", portfolio: "Private Label", category: "all", color: "#6b7280", promoIntensity: [9, 15, 22], priceCut: [-6, 5, 12], promoPressure: [-1, 1, 4] },
]

// Portfolio colors for the portfolio view
const portfolioColors: Record<string, string> = {
  "Competitor X": "#2563eb",
  "Alternative": "#7c3aed",
  "Budget Cola": "#4338ca",
  "Private Label": "#6b7280",
}

// Get unique portfolios
const competitorPortfolios = ["Competitor X", "Alternative", "Budget Cola", "Private Label"]

interface BrandMetricData {
  brand: string
  values: number[]
  isCompetitor?: boolean
  color?: string
}

// AI Insights generator - STORYLINE: Highlight Competitor X's strategy shift
function generateInsights(portfolioAvg: number[], competitorAvg: number[], selectedCategory: string) {
  const insights: { type: "positive" | "warning" | "negative"; text: string; highlight?: boolean }[] = []
  
  // STORYLINE KEY INSIGHT: Competitor X doing less promos but higher price cuts
  insights.push({ 
    type: "warning", 
    text: "Competitor X has reduced promo intensity from 52% to 42% (-10pp since 2022) but increased price cut depth from 24% to 38% (+14pp). Their 'fewer, deeper' strategy is showing better ROI performance.",
    highlight: true
  })
  
  // Compare Portfolio vs competitors
  const portfolio2024 = portfolioAvg[2]
  const comp2024 = competitorAvg[2]
  const diff = portfolio2024 - comp2024
  
  if (diff > 5) {
    insights.push({ type: "negative", text: `Portfolio promo intensity (${portfolio2024}%) exceeds competitors (${comp2024}%) by ${diff.toFixed(0)}pp -- risk of promotion dependency while competitors optimize.` })
  } else if (diff < -5) {
    insights.push({ type: "positive", text: `Portfolio maintains lower promo intensity (${portfolio2024}%) vs competitors (${comp2024}%) -- healthier promotional posture.` })
  } else {
    insights.push({ type: "warning", text: `Portfolio promo intensity (${portfolio2024}%) is at parity with competitors (${comp2024}%) -- consider Competitor X's 'fewer, deeper' approach.` })
  }
  
  // YoY trend
  const portfolioGrowth = portfolioAvg[2] - portfolioAvg[0]
  if (portfolioGrowth > 10) {
    insights.push({ type: "negative", text: `Promo intensity increased +${portfolioGrowth.toFixed(0)}pp since 2022 while Competitor X reduced theirs -- evaluate if higher frequency is driving diminishing returns.` })
  } else if (portfolioGrowth < 5) {
    insights.push({ type: "positive", text: `Promo intensity well-controlled (+${portfolioGrowth.toFixed(0)}pp since 2022) -- maintain promotional discipline.` })
  }
  
  insights.push({ type: "warning", text: "Recommendation: Navigate to Promo Performance to evaluate if shifting to 'fewer, deeper' promos could improve our ROI." })
  
  return insights.slice(0, 4)
}

// ---------- Section Renderer ----------

interface PortfolioMetricData {
  portfolio: string
  values: number[]
  color: string
}

interface MetricSectionProps {
  label: string
  subtitle: string
  iconColor: string
  portfolioData: BrandMetricData[]
  competitorData: BrandMetricData[]
  portfolioAvg: number[]
  marketAvg: number[]
  competitorPortfolios: PortfolioMetricData[]
  selectedYears: string[]
  showCompetitors: boolean
  isPortfolioView: boolean
}

function MetricSection({ label, subtitle, iconColor, portfolioData, competitorData, portfolioAvg, marketAvg, competitorPortfolios, selectedYears, showCompetitors, isPortfolioView }: MetricSectionProps) {
  // Build groups based on view mode
  const allGroups: { label: string; values: number[]; isPortfolio: boolean; isAvg: boolean; isMarket?: boolean; color?: string }[] = []
  
  if (isPortfolioView) {
    // Portfolio view - show Brand Owner, Market, and competitor portfolios
    allGroups.push({ 
      label: "Brand Portfolio", 
      values: portfolioAvg, 
      isPortfolio: true, 
      isAvg: true,
      color: "#ef4444" 
    })
    
    // Market-wide average
    allGroups.push({ 
      label: "Market Avg", 
      values: marketAvg, 
      isPortfolio: false, 
      isAvg: true,
      isMarket: true,
      color: "#a1a1aa" 
    })
    
    if (showCompetitors) {
      // Add each competitor portfolio
      competitorPortfolios.forEach(p => {
        allGroups.push({ 
          label: p.portfolio, 
          values: p.values, 
          isPortfolio: false, 
          isAvg: false, 
          color: p.color 
        })
      })
    }
  } else {
    // Brand view - show specific brand vs relevant individual competitors
    if (portfolioData.length > 0) {
      allGroups.push(
        ...portfolioData.map(b => ({ label: b.brand, values: b.values, isPortfolio: true, isAvg: false, color: brandColors[b.brand] || "#ef4444" }))
      )
    }
    
    if (showCompetitors) {
      // Add individual competitors (filtered to same category)
      allGroups.push(
        ...competitorData.map(b => ({ label: b.brand, values: b.values, isPortfolio: false, isAvg: false, color: b.color })),
      )
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", iconColor)}>
          <BarChart3 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-100">{label}</h3>
          <p className="text-[10px] text-zinc-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {allGroups.map((group, gi) => {
          const isCompetitorSection = !group.isPortfolio && gi > 0 && allGroups[gi - 1]?.isPortfolio
          return (
            <div key={group.label} className={cn(
              "flex-shrink-0",
              isCompetitorSection && "ml-3 pl-3 border-l border-zinc-700/60",
              group.isAvg && "ml-2 pl-2 border-l border-zinc-700/40"
            )}>
              <p className={cn(
                "text-[9px] font-semibold mb-2 text-center whitespace-nowrap truncate max-w-[80px]",
                group.isPortfolio ? "text-zinc-300" : "text-zinc-500"
              )} title={group.label}>
                {group.label}
              </p>
              <div className="flex items-end gap-0.5 justify-center" style={{ height: 100 }}>
                {years.map((yr, yi) => {
                  if (!selectedYears.includes(yr)) return null
                  const val = group.values[yi]
                  const maxH = 90
                  const h = Math.max(6, Math.abs(val) / 80 * maxH)
                  const isNeg = val < 0
                  const isHatched = yr === "2022"
                  const barColor = group.isAvg 
                    ? (group.isPortfolio ? "#ef4444" : "#6366f1")
                    : (group.color || yearColors[yr].bar)

                  return (
                    <div key={yr} className="flex flex-col items-center" style={{ width: 22 }}>
                      <span className={cn(
                        "text-[9px] font-mono font-semibold mb-0.5",
                        group.isPortfolio ? yearColors[yr].label : "text-zinc-500"
                      )}>{val}%</span>
                      <div className="relative" style={{ height: h }}>
                        {isHatched && !group.isAvg ? (
                          <svg width={22} height={h}>
                            <defs>
                              <pattern id={`hatch-${label.replace(/\s/g, "")}-${gi}-${yi}`} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="4" stroke={barColor} strokeWidth="1.5" />
                              </pattern>
                            </defs>
                            <rect width={22} height={h} fill={`url(#hatch-${label.replace(/\s/g, "")}-${gi}-${yi})`} rx={2} opacity={isNeg ? 0.4 : 0.6} />
                          </svg>
                        ) : (
                          <div
                            className="rounded-sm"
                            style={{
                              width: 22,
                              height: h,
                              backgroundColor: barColor,
                              opacity: group.isPortfolio ? (isNeg ? 0.4 : 0.85) : (isNeg ? 0.3 : 0.5),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Main Component ----------

export function TPOPromoEvolution({ onNavigate }: PromoEvolutionProps) {
  const [selectedYears, setSelectedYears] = useState<string[]>(["2022", "2023", "2024"])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedGeo, setSelectedGeo] = useState("all")
  const [showCompetitors, setShowCompetitors] = useState(true)

  const toggleYear = (yr: string) => {
    setSelectedYears(prev => prev.includes(yr) ? prev.filter(y => y !== yr) : [...prev, yr])
  }

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

  // Get portfolio data for display - only show individual brand when specific brand selected
  const portfolioDisplayData = useMemo(() => {
    if (selectedBrand !== "all") {
      const data = portfolioBrandData[selectedBrand]
      if (!data) return []
      return [{ brand: selectedBrand, ...data }]
    }
    // When "All Brands" selected, return empty array (we'll only show the average)
    return []
  }, [selectedBrand])

  // Get competitor data for display - filter by brand's category when specific brand selected
  const competitorDisplayData = useMemo(() => {
    if (selectedBrand !== "all") {
      // When specific brand selected, only show competitors in the same category
      const brandCategory = portfolioBrandData[selectedBrand]?.category
      if (brandCategory) {
        return competitorData.filter(c => c.category === brandCategory)
      }
    }
    if (selectedCategory !== "all") {
      return competitorData.filter(c => c.category === selectedCategory)
    }
    return competitorData
  }, [selectedBrand, selectedCategory])

  // Compute averages
  const geoSeed = useMemo(() => hashStr(selectedGeo), [selectedGeo])
  const geoMult = useMemo(() => {
    const rng = seededRandom(geoSeed)
    return 0.9 + rng() * 0.2
  }, [geoSeed])

  // Portfolio averages - calculated from filteredPortfolioBrands (all brands in selected category)
  const portfolioAvgIntensity = useMemo(() => {
    const brandsToAvg = selectedBrand !== "all" 
      ? [selectedBrand] 
      : filteredPortfolioBrands
    if (brandsToAvg.length === 0) return [0, 0, 0]
    return years.map((_, yi) => {
      const avg = brandsToAvg.reduce((s, b) => s + (portfolioBrandData[b]?.promoIntensity[yi] || 0), 0) / brandsToAvg.length
      return Math.round(avg * geoMult)
    })
  }, [selectedBrand, filteredPortfolioBrands, geoMult])

  const portfolioAvgPriceCut = useMemo(() => {
    const brandsToAvg = selectedBrand !== "all" 
      ? [selectedBrand] 
      : filteredPortfolioBrands
    if (brandsToAvg.length === 0) return [0, 0, 0]
    return years.map((_, yi) => {
      const avg = brandsToAvg.reduce((s, b) => s + (portfolioBrandData[b]?.priceCut[yi] || 0), 0) / brandsToAvg.length
      return Math.round(avg * geoMult)
    })
  }, [selectedBrand, filteredPortfolioBrands, geoMult])

  const portfolioAvgPressure = useMemo(() => {
    const brandsToAvg = selectedBrand !== "all" 
      ? [selectedBrand] 
      : filteredPortfolioBrands
    if (brandsToAvg.length === 0) return [0, 0, 0]
    return years.map((_, yi) => {
      const avg = brandsToAvg.reduce((s, b) => s + (portfolioBrandData[b]?.promoPressure[yi] || 0), 0) / brandsToAvg.length
      return Math.round(avg * geoMult)
    })
  }, [selectedBrand, filteredPortfolioBrands, geoMult])

  // Market-wide averages (Portfolio + all competitors)
  const marketAvgIntensity = useMemo(() => {
    const portfolioBrands = Object.values(portfolioBrandData)
    const allData = [...portfolioBrands.map(d => d.promoIntensity), ...competitorData.map(d => d.promoIntensity)]
    return years.map((_, yi) => {
      const avg = allData.reduce((s, d) => s + d[yi], 0) / allData.length
      return Math.round(avg * geoMult)
    })
  }, [geoMult])

  const marketAvgPriceCut = useMemo(() => {
    const portfolioBrands = Object.values(portfolioBrandData)
    const allData = [...portfolioBrands.map(d => d.priceCut), ...competitorData.map(d => d.priceCut)]
    return years.map((_, yi) => {
      const avg = allData.reduce((s, d) => s + d[yi], 0) / allData.length
      return Math.round(avg * geoMult)
    })
  }, [geoMult])

  const marketAvgPressure = useMemo(() => {
    const portfolioBrands = Object.values(portfolioBrandData)
    const allData = [...portfolioBrands.map(d => d.promoPressure), ...competitorData.map(d => d.promoPressure)]
    return years.map((_, yi) => {
      const avg = allData.reduce((s, d) => s + d[yi], 0) / allData.length
      return Math.round(avg * geoMult)
    })
  }, [geoMult])

  // Competitor portfolio averages (for portfolio view)
  const portfolioIntensityData = useMemo(() => {
    return competitorPortfolios.map(portfolio => {
      const portfolioBrands = competitorData.filter(c => c.portfolio === portfolio)
      const values = years.map((_, yi) => {
        if (portfolioBrands.length === 0) return 0
        const avg = portfolioBrands.reduce((s, d) => s + d.promoIntensity[yi], 0) / portfolioBrands.length
        return Math.round(avg * geoMult)
      })
      return { portfolio, values, color: portfolioColors[portfolio] || "#6b7280" }
    })
  }, [geoMult])

  const portfolioPriceCutData = useMemo(() => {
    return competitorPortfolios.map(portfolio => {
      const portfolioBrands = competitorData.filter(c => c.portfolio === portfolio)
      const values = years.map((_, yi) => {
        if (portfolioBrands.length === 0) return 0
        const avg = portfolioBrands.reduce((s, d) => s + d.priceCut[yi], 0) / portfolioBrands.length
        return Math.round(avg * geoMult)
      })
      return { portfolio, values, color: portfolioColors[portfolio] || "#6b7280" }
    })
  }, [geoMult])

  const portfolioPressureData = useMemo(() => {
    return competitorPortfolios.map(portfolio => {
      const portfolioBrands = competitorData.filter(c => c.portfolio === portfolio)
      const values = years.map((_, yi) => {
        if (portfolioBrands.length === 0) return 0
        const avg = portfolioBrands.reduce((s, d) => s + d.promoPressure[yi], 0) / portfolioBrands.length
        return Math.round(avg * geoMult)
      })
      return { portfolio, values, color: portfolioColors[portfolio] || "#6b7280" }
    })
  }, [geoMult])

  // AI Insights
  const aiInsights = useMemo(() => 
    generateInsights(portfolioAvgIntensity, marketAvgIntensity, selectedCategory),
    [portfolioAvgIntensity, marketAvgIntensity, selectedCategory]
  )

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">Promo Evolution</button>
        <button onClick={() => onNavigate?.("promo-performance")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Performance</button>
        <button onClick={() => onNavigate?.("trade-client-matrix")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Trade vs Client Matrix</button>
        <button onClick={() => onNavigate?.("performance-by-lever")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Performance by Lever</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">{"Promotion Optimizer"}</button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-zinc-100">Promo Pressure, Promo Intensity and Price Cut Evolution</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">Year-over-year promo evolution by brand and total category. Filter by year, brand, and geography.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Year toggles */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-zinc-500 mr-1">Year</span>
          {years.map(yr => (
            <button
              key={yr}
              onClick={() => toggleYear(yr)}
              className={cn(
                "px-2.5 py-1 rounded text-[10px] font-medium border transition-colors",
                selectedYears.includes(yr)
                  ? yr === "2022"
                    ? "bg-zinc-600/20 text-zinc-300 border-zinc-500/40"
                    : yr === "2023"
                    ? "bg-red-500/15 text-red-400 border-red-500/30"
                    : "bg-red-900/30 text-red-300 border-red-800/50"
                  : "text-zinc-600 border-zinc-800 hover:text-zinc-400"
              )}
            >
              {yr}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-zinc-800" />

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

        {/* Geography filter */}
        <Select value={selectedGeo} onValueChange={setSelectedGeo}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {geographies.map(g => (
              <SelectItem key={g.value} value={g.value} className="text-zinc-200 text-xs">{g.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-px h-5 bg-zinc-800" />

        {/* Competitor toggle */}
        <button
          onClick={() => setShowCompetitors(!showCompetitors)}
          className={cn(
            "px-3 py-1 rounded text-[10px] font-medium border transition-colors",
            showCompetitors
              ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
              : "text-zinc-600 border-zinc-800 hover:text-zinc-400"
          )}
        >
          {showCompetitors ? "Hide Competitors" : "Show Competitors"}
        </button>

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Portfolio Brands
          </span>
          {showCompetitors && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 opacity-50" />
              Competitors
            </span>
          )}
          <span className="w-px h-3 bg-zinc-700" />
          <span className="flex items-center gap-1.5">
            <svg width="14" height="10">
              <defs>
                <pattern id="legend-hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="4" stroke="#a1a1aa" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="14" height="10" fill="url(#legend-hatch)" rx={1} />
            </svg>
            2022
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-2.5 rounded-sm bg-red-500" />
            2023
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-2.5 rounded-sm bg-red-900" />
            2024
          </span>
        </div>
      </div>

      {/* Three stacked metric sections */}
      <div className="space-y-3">
        <MetricSection
          label="Promo Intensity"
          subtitle="(%, Promo Vol./Tot. Vol)"
          iconColor="bg-red-600"
          portfolioData={portfolioDisplayData.map(d => ({ brand: d.brand, values: d.promoIntensity.map(v => Math.round(v * geoMult)) }))}
          competitorData={competitorDisplayData.map(d => ({ brand: d.name, values: d.promoIntensity.map(v => Math.round(v * geoMult)), color: d.color }))}
          portfolioAvg={portfolioAvgIntensity}
          marketAvg={marketAvgIntensity}
          competitorPortfolios={portfolioIntensityData}
          selectedYears={selectedYears}
          showCompetitors={showCompetitors}
          isPortfolioView={selectedBrand === "all"}
        />

        <MetricSection
          label="Price Cut"
          subtitle="(% avg discount depth)"
          iconColor="bg-red-700"
          portfolioData={portfolioDisplayData.map(d => ({ brand: d.brand, values: d.priceCut.map(v => Math.round(v * geoMult)) }))}
          competitorData={competitorDisplayData.map(d => ({ brand: d.name, values: d.priceCut.map(v => Math.round(v * geoMult)), color: d.color }))}
          portfolioAvg={portfolioAvgPriceCut}
          marketAvg={marketAvgPriceCut}
          competitorPortfolios={portfolioPriceCutData}
          selectedYears={selectedYears}
          showCompetitors={showCompetitors}
          isPortfolioView={selectedBrand === "all"}
        />

        <MetricSection
          label="Promo Pressure"
          subtitle="(% weeks/SKUs on promo)"
          iconColor="bg-red-800"
          portfolioData={portfolioDisplayData.map(d => ({ brand: d.brand, values: d.promoPressure.map(v => Math.round(v * geoMult)) }))}
          competitorData={competitorDisplayData.map(d => ({ brand: d.name, values: d.promoPressure.map(v => Math.round(v * geoMult)), color: d.color }))}
          portfolioAvg={portfolioAvgPressure}
          marketAvg={marketAvgPressure}
          competitorPortfolios={portfolioPressureData}
          selectedYears={selectedYears}
          showCompetitors={showCompetitors}
          isPortfolioView={selectedBrand === "all"}
        />
      </div>

      {/* AI Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
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
