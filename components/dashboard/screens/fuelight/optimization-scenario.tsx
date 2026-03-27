"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Eye,
  Pencil,
  ChevronLeft,
  Download,
  Settings2,
  ChevronDown,
  X
} from "lucide-react"
import { ArtemisLogo } from "@/components/ui/platform-logos"
import { cn } from "@/lib/utils"

interface OptimizationScenarioProps {
  brand: string
  dateRange: string
  fundingAmount: string
  onBack: () => void
  onLaunchInitiative: () => void
  onNavigateToView?: () => void
  onNavigateToEdit?: () => void
  onNavigateToRGMPricing?: () => void
  onNavigateToAssortmentMix?: () => void
  isRGMImport?: boolean // True when optimization was imported from RGM tools
}

type ResultTab = "summary" | "waterfall" | "comparison" | "trend" | "details"
type InvestmentArea = "consumer-paid" | "all-areas"

export function FuelightOptimizationScenario({ 
  brand, 
  dateRange, 
  fundingAmount,
  onBack,
  onLaunchInitiative,
  onNavigateToView,
  onNavigateToEdit,
  onNavigateToRGMPricing,
  onNavigateToAssortmentMix,
  isRGMImport = false,
}: OptimizationScenarioProps) {
  const [activeTab, setActiveTab] = useState<ResultTab>("summary")
  const [showTableSettings, setShowTableSettings] = useState(false)
  const [viewBeforeOptimization, setViewBeforeOptimization] = useState(false)
  const [viewVsPriorYear, setViewVsPriorYear] = useState(true)
  const [viewByPercentage, setViewByPercentage] = useState(true)
  const [viewInThousands, setViewInThousands] = useState(true)
  const [investmentArea, setInvestmentArea] = useState<InvestmentArea>("all-areas")
  const [hoveredWaterfallBar, setHoveredWaterfallBar] = useState<string | null>(null)

  const tabs: { id: ResultTab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "waterfall", label: "Waterfall" },
    { id: "comparison", label: "Comparison" },
    { id: "trend", label: "Trend" },
    { id: "details", label: "Details" },
  ]

  // Mock optimization results data
  const results = {
    totalInvestment: 780,
    investmentChange: 0,
    sellOutVolume: { value: 85, unit: "MUC", change: 8, prePre: 78.7 },
    systemNSR: { value: 21643.55, unit: "M", change: 8, pre: 20040.32 },
    systemGP: { value: 10844.30, unit: "M", change: 8, pre: 10040.09 },
    consumerInvestment: {
      total: 780,
      change: 0,
      breakdown: [
        { name: "Digital Media", value: 325, change: 50, pre: 216.7 },
        { name: "Traditional Media", value: 455, change: 20, pre: 379.2 },
      ]
    },
    inPeriodROI: { value: 1.6, change: 0 },
    longTermROI: { value: 2.6, change: 0 },
    brandPerformance: [
      { brand: "Brand A", sellOutVolume: 85, change: 8 }
    ]
  }

  // Details table data
  const detailsData = [
    { platform: "Meta", investment: 85, impressions: 2800, sellOutVolume: 0.7, systemNSR: 178.241 },
    { platform: "TikTok", investment: 40, impressions: 3550, sellOutVolume: 0.6, systemNSR: 152.778 },
    { platform: "Snapchat", investment: 18, impressions: null, sellOutVolume: 0.1, systemNSR: 25.463 },
    { platform: "Other", investment: 0, impressions: null, sellOutVolume: null, systemNSR: null },
    { platform: "X (Twitter)", investment: 0, impressions: null, sellOutVolume: null, systemNSR: null },
  ]

  // Waterfall data - different for each investment area
  // Labels change based on whether this is an RGM import or native Fuelight optimization
  const waterfallDataConsumerPaid = [
    { label: isRGMImport ? "Previous\nOptimization" : "Pre-\nOptimization", value: 78.7, type: "start" },
    { label: "Digital Media", value: 3.2, type: "increase" },
    { label: "Traditional Media", value: 2.1, type: "increase" },
    { label: "Efficiency Gains", value: 1.0, type: "increase" },
    { label: "Post-Optimization", value: 85.0, type: "end" },
  ]

  // All Investment Areas waterfall data - includes pricing and promo
  const waterfallDataAllAreas = [
    { id: "base", label: "Constant sales\n& other factors", value: 85, type: "start", displayValue: "85%" },
    { id: "macro", label: "Macro\neconomics", value: -8, type: "decrease", displayValue: "-8%" },
    { id: "pricing", label: "Pricing", value: 4, type: "increase", displayValue: "+4%", clickable: true, tooltip: "Increase price index from 101 to 103", linkTo: "pricing" },
    { id: "distribution", label: "Distribution", value: 6, type: "increase", displayValue: "+6%" },
    { id: "consumer-paid", label: "Consumer\n(Paid)", value: 8, type: "increase", displayValue: "+8%" },
    { id: "assortment", label: "Assortment\n& Mix", value: 3, type: "increase", displayValue: "+3%", clickable: true, tooltip: "Over-indexed on low-margin pack types, underweight in high-velocity formats", linkTo: "assortment" },
    { id: "total", label: "Optimized\nOutcome", value: 98, type: "end", displayValue: "98%" },
  ]

  const waterfallData = investmentArea === "all-areas" ? waterfallDataAllAreas : waterfallDataConsumerPaid

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <ArtemisLogo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h1 className="text-xl font-bold text-zinc-100">
                {isRGMImport ? "RGM Imported Optimization" : "Demo Optimization"}
              </h1>
              {isRGMImport ? (
                <Badge variant="outline" className="bg-amber-500/20 border-amber-500/30 text-amber-400 text-xs">
                  Imported from RGM
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-400 text-xs">
                  Optimization
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Latest available data as of: {isRGMImport ? "03/15/2026" : "00/00/0000"}</span>
              <span>|</span>
              <span>Outcomes actualized through: {isRGMImport ? "03/17/2026" : "00/00/0000"}</span>
            </div>
          </div>
        </div>
        
        {/* View/Edit/Optimize Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateToView}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-emerald-500 text-emerald-400 bg-emerald-500/10"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          <button 
            onClick={onNavigateToEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-emerald-500 text-emerald-400">
            <Zap className="h-4 w-4" />
            Optimize
          </button>
          <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">DE</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">EUR</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">360</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">Dec 28, 2025 - Jul 4, 2026</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">Brand A</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">TCCC Funding</Badge>
        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-3 py-1">Maximize Sell-out Volume</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">Total Funding: EUR780,000,000</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">Optimize total funding ≤ EUR780,000,000</Badge>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-zinc-100 border-zinc-100"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Business Performance Header */}
          <h2 className="text-xl font-semibold text-zinc-100">Business Performance</h2>

          {/* Total Recommended Investment */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-100">Total Recommended Investment</p>
                  <p className="text-xs text-zinc-500">across ALL activation types</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">EUR{results.totalInvestment}M</p>
                  <p className="text-sm text-zinc-500">{results.investmentChange}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-300">Sell-out Volume</p>
              <p className="text-xs text-emerald-400">{isRGMImport ? "vs Previous Optimization Results" : "vs Pre-Optimization"}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-zinc-100">{results.sellOutVolume.value} {results.sellOutVolume.unit}</span>
              </div>
              <p className="text-sm text-emerald-400">+{results.sellOutVolume.change}%</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-300">System NSR</p>
              <p className="text-xs text-emerald-400">{isRGMImport ? "vs Previous Optimization Results" : "vs Pre-Optimization"}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-zinc-100">EUR{results.systemNSR.value.toLocaleString()}{results.systemNSR.unit}</span>
              </div>
              <p className="text-sm text-emerald-400">+{results.systemNSR.change}%</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-300">System GP</p>
              <p className="text-xs text-emerald-400">{isRGMImport ? "vs Previous Optimization Results" : "vs Pre-Optimization"}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-zinc-100">EUR{results.systemGP.value.toLocaleString()}{results.systemGP.unit}</span>
              </div>
              <p className="text-sm text-emerald-400">+{results.systemGP.change}%</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Consumer Investment Breakdown */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-zinc-300">Consumer (Paid) Investment</p>
                <p className="text-xl font-semibold text-zinc-100 mt-1">
                  EUR{results.consumerInvestment.total}M (+{results.consumerInvestment.change}%)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400">1.6x In-Period Sell-out Volume ROI</p>
                <p className="text-xs text-zinc-500">Per 100 EUR</p>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400">2.6x Long-Term Sell-out Volume ROI</p>
                <p className="text-xs text-zinc-500">Per 100 EUR</p>
              </div>
            </div>

            {/* Investment Breakdown Table */}
            <div className="bg-zinc-900/30 rounded-lg overflow-hidden">
              {results.consumerInvestment.breakdown.map((item, index) => (
                <div key={item.name} className={`flex items-center justify-between p-4 ${index > 0 ? 'border-t border-zinc-800' : ''}`}>
                  <span className="text-sm text-zinc-400 pl-4">{item.name}</span>
                  <div className="flex items-center gap-12">
                    <span className="text-sm text-zinc-100">EUR{item.value}M (+{item.change}%)</span>
                    <span className="text-sm text-zinc-400">1.7x</span>
                    <span className="text-sm text-zinc-400">2.6x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Performance Snapshot */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-zinc-100">Brand Performance Snapshot</h3>
              <select className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-300">
                <option>Largest Variance</option>
                <option>Alphabetical</option>
              </select>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-100">Brand A</span>
                    <span className="text-sm text-zinc-500">Total (vs same period last year)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Sell-out Volume</span>
                    <span className="text-sm text-emerald-400">85 MUC (+8%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer hint */}
          <p className="text-center text-sm text-zinc-500 pt-4">
            Click the &ldquo;Details&rdquo; tab to view pre- and post-optimization metrics.
          </p>
        </div>
      )}

      {activeTab === "waterfall" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Investment Waterfall Analysis</h2>
              <p className="text-sm text-zinc-500">Sell-out Volume impact {isRGMImport ? "compared with previous optimization results" : "from pre-optimization to post-optimization"}</p>
            </div>
            {/* Investment Area Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Investment Area:</span>
              <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                <button
                  onClick={() => setInvestmentArea("consumer-paid")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    investmentArea === "consumer-paid" 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  Consumer (Paid)
                </button>
                <button
                  onClick={() => setInvestmentArea("all-areas")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    investmentArea === "all-areas" 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  All Investment Areas
                </button>
              </div>
            </div>
          </div>
          
          {/* Waterfall Chart */}
          <div className="bg-zinc-900/30 rounded-lg p-6">
            <div className="flex items-end justify-between h-80 gap-3">
              {waterfallData.map((item, index) => {
                const maxValue = 100
                const isStart = item.type === "start"
                const isEnd = item.type === "end"
                const isIncrease = item.type === "increase"
                const isDecrease = item.type === "decrease"
                const isClickable = 'clickable' in item && item.clickable
                const isHovered = hoveredWaterfallBar === ('id' in item ? item.id : item.label)
                
                // Calculate cumulative position for waterfall effect
                let cumulativeBase = 0
                if (index > 0 && !isEnd) {
                  cumulativeBase = waterfallData.slice(0, index).reduce((sum, d) => {
                    if (d.type === "start") return d.value
                    if (d.type === "increase") return sum + d.value
                    if (d.type === "decrease") return sum + d.value
                    return sum
                  }, 0)
                }
                
                const handleClick = () => {
                  if (isClickable && 'linkTo' in item) {
                    if (item.linkTo === "pricing" && onNavigateToRGMPricing) {
                      onNavigateToRGMPricing()
                    } else if (item.linkTo === "assortment" && onNavigateToAssortmentMix) {
                      onNavigateToAssortmentMix()
                    }
                  }
                }
                
                return (
                  <div 
                    key={'id' in item ? item.id : item.label} 
                    className="flex-1 flex flex-col items-center gap-2 relative"
                    onMouseEnter={() => setHoveredWaterfallBar('id' in item ? item.id : item.label)}
                    onMouseLeave={() => setHoveredWaterfallBar(null)}
                  >
                    <div className="relative w-full h-64 flex items-end justify-center">
                      {(isStart || isEnd) ? (
                        <div 
                          className={cn(
                            "w-full max-w-16 rounded-t-lg transition-all",
                            isStart ? "bg-zinc-600" : "bg-emerald-500",
                            isHovered && "ring-2 ring-white/30"
                          )}
                          style={{ height: `${(item.value / maxValue) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-zinc-100 whitespace-nowrap">
                            {'displayValue' in item ? item.displayValue : `${item.value} MUC`}
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <button 
                            onClick={handleClick}
                            disabled={!isClickable}
                            className={cn(
                              "absolute w-full max-w-16 left-1/2 -translate-x-1/2 rounded-t-lg transition-all",
                              isDecrease ? "bg-red-500/80" : "bg-emerald-500/80",
                              isClickable && "cursor-pointer hover:ring-2 hover:ring-amber-400",
                              isHovered && isClickable && "ring-2 ring-amber-400"
                            )}
                            style={{ 
                              height: `${(Math.abs(item.value) / maxValue) * 100}%`,
                              bottom: `${((isDecrease ? cumulativeBase + item.value : cumulativeBase) / maxValue) * 100}%`
                            }}
                          >
                            <div className={cn(
                              "absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium whitespace-nowrap",
                              isDecrease ? "text-red-400" : "text-emerald-400"
                            )}>
                              {'displayValue' in item ? item.displayValue : (item.value > 0 ? `+${item.value}` : item.value)}
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 text-center whitespace-pre-line leading-tight">
                      {item.label}
                    </span>
                    {isClickable && (
                      <span className="text-[8px] text-amber-400">Click to explore</span>
                    )}
                    
                    {/* Tooltip on hover for clickable items */}
                    {isHovered && isClickable && 'tooltip' in item && (
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 border border-amber-500/30 rounded-lg p-3 shadow-xl min-w-[220px]">
                        <p className="text-xs text-amber-300 font-medium mb-1">AI Recommendation</p>
                        <p className="text-[10px] text-zinc-300">{item.tooltip}</p>
                        <p className="text-[9px] text-amber-400 mt-2">
                          {'linkTo' in item && item.linkTo === "assortment" 
                            ? "Click to go to Assortment & Mix tool" 
                            : "Click to go to RGM Pricing tool"}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">{isRGMImport ? "Previous Optimization" : "Pre-Optimization"}</p>
                <p className="text-2xl font-bold text-zinc-100">{investmentArea === "all-areas" ? "85%" : "78.7 MUC"}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">Total Uplift</p>
                <p className="text-2xl font-bold text-emerald-400">{investmentArea === "all-areas" ? "+13%" : "+6.3 MUC"}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">Post-Optimization</p>
                <p className="text-2xl font-bold text-emerald-400">{investmentArea === "all-areas" ? "98%" : "85.0 MUC"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Cross-link to RGM when in All Areas mode */}
          {investmentArea === "all-areas" && (
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={onNavigateToRGMPricing}
                className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-300">Pricing Opportunity</span>
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[9px]">+4% uplift</Badge>
                </div>
                <p className="text-xs text-amber-400/80">
                  Increase price index from 101 to 103 on Citrus/Fruity SKUs. Click to explore in RGM Pricing tool.
                </p>
              </button>
              <button
                onClick={onNavigateToAssortmentMix}
                className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-300">Assortment & Mix</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[9px]">+3% uplift</Badge>
                </div>
                <p className="text-xs text-blue-400/80">
                  Over-indexed on low-margin pack types, underweight in high-velocity formats. Click to explore.
                </p>
              </button>
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-300">Consumer (Paid) Optimization</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px]">+8% uplift</Badge>
                </div>
                <p className="text-xs text-emerald-400/80">
                  Optimized media mix allocation across digital and traditional channels.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "comparison" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Pre vs Post Optimization Comparison</h2>
          
          {/* Comparison Grid */}
          <div className="grid grid-cols-2 gap-6">
{/* Pre/Previous Optimization Results Column */}
  <Card className="bg-zinc-900/50 border-zinc-800">
  <CardContent className="p-6">
  <h3 className="text-lg font-medium text-zinc-400 mb-6">{isRGMImport ? "Previous Optimization Results" : "Pre-Optimization"}</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-zinc-500">Sell-out Volume</p>
                    <p className="text-2xl font-bold text-zinc-100">78.7 MUC</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">System NSR</p>
                    <p className="text-2xl font-bold text-zinc-100">EUR 20,040.32M</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">System GP</p>
                    <p className="text-2xl font-bold text-zinc-100">EUR 10,040.09M</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-sm text-zinc-500">Digital Media Investment</p>
                    <p className="text-xl font-semibold text-zinc-100">EUR 216.7M</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Traditional Media Investment</p>
                    <p className="text-xl font-semibold text-zinc-100">EUR 379.2M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post-Optimization Column */}
            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-emerald-400 mb-6">Post-Optimization</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-zinc-500">Sell-out Volume</p>
                    <p className="text-2xl font-bold text-zinc-100">85.0 MUC <span className="text-emerald-400 text-sm">+8%</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">System NSR</p>
                    <p className="text-2xl font-bold text-zinc-100">EUR 21,643.55M <span className="text-emerald-400 text-sm">+8%</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">System GP</p>
                    <p className="text-2xl font-bold text-zinc-100">EUR 10,844.30M <span className="text-emerald-400 text-sm">+8%</span></p>
                  </div>
                  <div className="pt-4 border-t border-emerald-500/20">
                    <p className="text-sm text-zinc-500">Digital Media Investment</p>
                    <p className="text-xl font-semibold text-zinc-100">EUR 325M <span className="text-emerald-400 text-sm">+50%</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Traditional Media Investment</p>
                    <p className="text-xl font-semibold text-zinc-100">EUR 455M <span className="text-emerald-400 text-sm">+20%</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "trend" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-100">Performance Trend Analysis</h2>
          <p className="text-sm text-zinc-500">Historical and projected performance with optimization impact</p>
          
          {/* Trend Chart Area */}
          <div className="bg-zinc-900/30 rounded-lg p-6">
            <div className="h-80 flex items-end gap-2">
              {/* Mock trend bars */}
              {["Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25 (Opt)", "Q4'25 (Opt)"].map((quarter, i) => {
                const isOptimized = quarter.includes("Opt")
                const baseHeight = 40 + i * 5
                const height = isOptimized ? baseHeight + 15 : baseHeight
                return (
                  <div key={quarter} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={cn(
                        "w-full rounded-t-lg transition-all",
                        isOptimized ? "bg-emerald-500" : "bg-zinc-600"
                      )}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-zinc-500">{quarter.replace(" (Opt)", "")}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-zinc-600 rounded" />
              <span className="text-sm text-zinc-400">Historical Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded" />
              <span className="text-sm text-zinc-400">Optimized Projection</span>
            </div>
          </div>

          {/* Trend Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">Avg. Growth (Pre)</p>
                <p className="text-xl font-bold text-zinc-100">+3.2%</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">Avg. Growth (Post)</p>
                <p className="text-xl font-bold text-emerald-400">+8.0%</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">Growth Uplift</p>
                <p className="text-xl font-bold text-emerald-400">+4.8%</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm text-zinc-400">Projected Q4'25</p>
                <p className="text-xl font-bold text-emerald-400">92.3 MUC</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">Social</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                  <Settings2 className="h-4 w-4" />
                  <span>All Drivers</span>
                  <ChevronLeft className="h-3 w-3 rotate-180" />
                  <span>Consumer (Paid)</span>
                  <ChevronLeft className="h-3 w-3 rotate-180" />
                  <span>Digital Media</span>
                  <ChevronLeft className="h-3 w-3 rotate-180" />
                  <span>Social</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 flex items-center gap-1">
                  <Zap className="h-3 w-3 text-emerald-400" />
                  Values with Optimization
                </span>
                <button 
                  onClick={() => setShowTableSettings(!showTableSettings)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 hover:bg-zinc-700 transition-colors"
                >
                  <Settings2 className="h-4 w-4" />
                  Table Settings
                </button>
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-zinc-900/30 rounded-lg overflow-hidden border border-zinc-800">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-sm font-medium text-zinc-400 w-48"></th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">
                      Investment (MEUR) <Zap className="h-3 w-3 inline text-emerald-400" />
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400">
                      Impressions (M) <Zap className="h-3 w-3 inline text-emerald-400" />
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400 bg-zinc-800/30">
                      <div className="text-xs text-zinc-500 mb-1">Selected Combination</div>
                      Sell-out Volume (MUC) <Zap className="h-3 w-3 inline text-emerald-400" />
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-zinc-400 bg-zinc-800/30">
                      System NSR (EURM) <Zap className="h-3 w-3 inline text-emerald-400" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailsData.map((row, index) => (
                    <tr key={row.platform} className={index < detailsData.length - 1 ? "border-b border-zinc-800" : ""}>
                      <td className="p-4 text-sm text-zinc-300">{row.platform}</td>
                      <td className="p-4 text-sm text-zinc-100 text-right">{row.investment}</td>
                      <td className="p-4 text-sm text-zinc-100 text-right">{row.impressions ?? "--"}</td>
                      <td className="p-4 text-sm text-zinc-100 text-right bg-zinc-800/20">{row.sellOutVolume ?? "--"}</td>
                      <td className="p-4 text-sm text-zinc-100 text-right bg-zinc-800/20">{row.systemNSR ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Settings Panel */}
          {showTableSettings && (
            <div className="w-80 bg-zinc-900 border border-zinc-800 rounded-lg p-5 h-fit">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-zinc-400" />
                  <h3 className="font-semibold text-zinc-100">Table Settings</h3>
                </div>
                <button onClick={() => setShowTableSettings(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Values Section */}
              <div className="space-y-4 mb-6">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Values</p>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">View before optimization</span>
                  <button 
                    onClick={() => setViewBeforeOptimization(!viewBeforeOptimization)}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      viewBeforeOptimization ? "bg-emerald-500" : "bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                      viewBeforeOptimization ? "translate-x-5" : "translate-x-1"
                    )} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">View vs. Prior Year</span>
                  <button 
                    onClick={() => setViewVsPriorYear(!viewVsPriorYear)}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      viewVsPriorYear ? "bg-emerald-500" : "bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                      viewVsPriorYear ? "translate-x-5" : "translate-x-1"
                    )} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">View by percentage</span>
                  <button 
                    onClick={() => setViewByPercentage(!viewByPercentage)}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      viewByPercentage ? "bg-emerald-500" : "bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                      viewByPercentage ? "translate-x-5" : "translate-x-1"
                    )} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-zinc-300">View in thousands</span>
                  <button 
                    onClick={() => setViewInThousands(!viewInThousands)}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      viewInThousands ? "bg-emerald-500" : "bg-zinc-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                      viewInThousands ? "translate-x-5" : "translate-x-1"
                    )} />
                  </button>
                </label>
              </div>

              {/* Dimensions Section */}
              <div className="space-y-4 mb-6">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Dimensions</p>
                
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Input Metric</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
                    <option>Input Metric</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Output Metric</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
                    <option>Sell-out Volume, System NSR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Measurement View</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
                    <option>Measurement View</option>
                  </select>
                </div>
              </div>

              {/* View Level Section */}
              <div className="space-y-4 mb-6">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">View Level</p>
                
                <div className="space-y-2">
                  {["All Drivers", "Consumer (Paid)", "Digital Media", "Social"].map((level, index) => (
                    <div key={level} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                        {index + 1}
                      </div>
                      {index < 3 ? (
                        <select className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
                          <option>{level}</option>
                        </select>
                      ) : (
                        <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100">
                          {level}
                        </div>
                      )}
                      {index > 0 && (
                        <button className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300">
                          −
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button 
                  onClick={() => setShowTableSettings(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
