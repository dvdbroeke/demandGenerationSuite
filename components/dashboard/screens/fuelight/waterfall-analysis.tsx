"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  ChevronRight,
  Settings,
  Zap,
  Eye,
  Pencil
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FuelightLogo } from "@/components/ui/platform-logos"

interface WaterfallAnalysisProps {
  brand: string
  onBack: () => void
  onDrillDown: (driver: string) => void
  onNavigateToSummary?: () => void
  onNavigateToOptimizer?: () => void
  onNavigateToEdit?: () => void
  onNavigateToComparison?: () => void
  onNavigateToTrend?: (driver?: string) => void
  onNavigateToRGMPricing?: () => void
  onNavigateToRGMPromotion?: () => void
}

interface WaterfallBar {
  id: string
  label: string
  value: number
  isBase?: boolean
  isTotal?: boolean
  category?: "base" | "in-store" | "activation"
  clickable?: boolean
  drillDownType?: "pricing" | "media"
  displayValue?: string
}

// Waterfall data - represents cumulative changes (percentages from actual data)
const waterfallData: WaterfallBar[] = [
  { id: "base", label: "Constant sales\nand other\nfactors", value: 85, isBase: true, category: "base", displayValue: "85%" },
  { id: "weather", label: "Weather", value: -2, category: "base", displayValue: "-2%" },
  { id: "macro", label: "Macro\neconomics", value: -18, category: "base", displayValue: "-18%" },
  { id: "holidays", label: "Holidays", value: 6, category: "base", displayValue: "+6%" },
  { id: "world-events", label: "World Events", value: -4, category: "base", displayValue: "-4%" },
  { id: "competitor-media", label: "Competitor\nMedia", value: -2, category: "base", displayValue: "-2%" },
  { id: "competitor-execution", label: "Competitor\nExecution", value: -4, category: "base", displayValue: "-4%" },
  { id: "distribution", label: "Distribution", value: 17, category: "in-store", displayValue: "+17%" },
  { id: "pricing", label: "Pricing", value: -4, category: "in-store", clickable: true, drillDownType: "pricing", displayValue: "-4%" },
  { id: "customer", label: "Customer", value: 12, category: "activation", clickable: true, drillDownType: "pricing", displayValue: "+12%" },
  { id: "customer-paid", label: "Consumer\n(Paid)", value: 9, category: "activation", clickable: true, drillDownType: "media", displayValue: "+9%" },
  { id: "consumer-owned", label: "Consumer\n(Owned)", value: 0, category: "activation", displayValue: "0%" },
  { id: "total", label: "12/29/24 -\n07/06/25", value: 100, isTotal: true, displayValue: "100%" },
]

const categoryColors = {
  base: "bg-zinc-500",
  "in-store": "bg-blue-500",
  activation: "bg-emerald-500",
}

export function FuelightWaterfallAnalysis({ brand, onBack, onDrillDown, onNavigateToSummary, onNavigateToOptimizer, onNavigateToEdit, onNavigateToComparison, onNavigateToTrend, onNavigateToRGMPricing, onNavigateToRGMPromotion }: WaterfallAnalysisProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  // Calculate cumulative positions for waterfall
  const calculateWaterfallPositions = () => {
    let runningTotal = 0
    const positions: { id: string; start: number; end: number; value: number }[] = []
    
    waterfallData.forEach((bar, index) => {
      if (bar.isBase) {
        positions.push({ id: bar.id, start: 0, end: bar.value, value: bar.value })
        runningTotal = bar.value
      } else if (bar.isTotal) {
        positions.push({ id: bar.id, start: 0, end: bar.value, value: bar.value })
      } else {
        const start = runningTotal
        const end = runningTotal + bar.value
        positions.push({ id: bar.id, start: Math.min(start, end), end: Math.max(start, end), value: bar.value })
        runningTotal = end
      }
    })
    return positions
  }

  const positions = calculateWaterfallPositions()
  const maxValue = 100 // Fixed max for scale (percentages)
  const chartHeight = 280

  const getYPosition = (value: number) => chartHeight - (value / maxValue) * chartHeight

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Summary
          </Button>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <FuelightLogo size="md" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">{brand}</h1>
              <p className="text-xs text-zinc-500">Waterfall Analysis</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={() => onNavigateToSummary?.() || onBack()} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
            <Eye className="h-4 w-4" /> View
          </button>
          <button onClick={onNavigateToEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button onClick={onNavigateToOptimizer} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
            <Zap className="h-4 w-4" /> Optimize
          </button>
        </div>
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent ml-2">
          <Settings className="h-4 w-4 mr-2" />
          Chart Settings
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button 
          onClick={() => onNavigateToSummary?.() || onBack()}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Summary
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-emerald-500">
          Waterfall
        </button>
        <button onClick={() => onNavigateToComparison?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Comparison
        </button>
        <button onClick={() => onNavigateToTrend?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Trend
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Details
        </button>
      </div>

      {/* KPI Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">{brand}</h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-zinc-400">Total Sell-out Volume</span>
            <span className="text-2xl font-bold text-zinc-100">62 MUC</span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              +9% vs. Prior Year
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
            All Drivers
          </Badge>
        </div>
      </div>

      {/* Waterfall Chart */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          {/* Figures label */}
          <div className="flex justify-end mb-4">
            <span className="text-xs text-zinc-500">Figures in millions</span>
          </div>

          {/* Chart Container */}
          <div className="relative">
            {/* Section Headers above chart */}
            <div className="ml-14 flex mb-2">
              {/* Base section - 7 bars */}
              <div className="flex-[7] text-sm font-semibold text-zinc-300">Base</div>
              {/* In Store section - 2 bars */}
              <div className="flex-[2] text-sm font-semibold text-zinc-300">In Store</div>
              {/* Activation section - 4 bars (including total) */}
              <div className="flex-[4] text-sm font-semibold text-zinc-300">Activation</div>
            </div>
            
            {/* Y-axis */}
            <div className="absolute left-0 top-8 w-12 flex flex-col justify-between text-xs text-zinc-500" style={{ height: `${chartHeight}px` }}>
              <span>70 M</span>
              <span>60 M</span>
              <span>50 M</span>
              <span>40 M</span>
              <span>30 M</span>
              <span>20 M</span>
              <span>10 M</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="ml-14 relative mt-8" style={{ height: `${chartHeight}px` }}>
              {/* Grid lines */}
              {[0, 10, 20, 30, 40, 50, 60, 70].map(val => (
                <div 
                  key={val} 
                  className="absolute w-full border-t border-zinc-800/50" 
                  style={{ top: `${getYPosition(val)}px` }} 
                />
              ))}

              {/* Waterfall Bars */}
              <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
                {waterfallData.map((bar, index) => {
                  const pos = positions[index]
                  const isNegative = bar.value < 0
                  const barHeight = (Math.abs(pos.end - pos.start) / maxValue) * chartHeight
                  const barBottom = (Math.min(pos.start, pos.end) / maxValue) * chartHeight
                  const isClickable = bar.clickable
                  const isCustomer = bar.id === "customer"
                  const isCustomerPaid = bar.id === "customer-paid"
                  
                  const getBarColor = () => {
                    if (bar.isBase || bar.isTotal) return "bg-zinc-600"
                    if (isNegative) return "bg-red-500"
                    return "bg-emerald-500"
                  }
                  
                  return (
                    <div
                      key={bar.id}
                      className="flex flex-col items-center flex-1 relative"
                      style={{ height: `${chartHeight}px` }}
                      onMouseEnter={() => setHoveredBar(bar.id)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Connection line for waterfall effect */}
                      {!bar.isBase && !bar.isTotal && index > 0 && (
                        <div 
                          className="absolute w-full border-t border-dashed border-zinc-600"
                          style={{ 
                            bottom: `${(positions[index - 1].end / maxValue) * chartHeight}px`,
                            left: '-50%',
                            width: '50%'
                          }}
                        />
                      )}

                      {/* Bar */}
                      {isClickable ? (
                        <button
                          onClick={() => onDrillDown(bar.drillDownType || bar.id)}
                          className={cn(
                            "absolute w-8 rounded-sm transition-all cursor-pointer",
                            getBarColor(),
                            "hover:opacity-80",
                            (isCustomer || isCustomerPaid) && "ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-900"
                          )}
                          style={{ 
                            height: `${barHeight}px`,
                            bottom: `${barBottom}px`
                          }}
                        />
                      ) : (
                        <div
                          className={cn(
                            "absolute w-8 rounded-sm",
                            getBarColor()
                          )}
                          style={{ 
                            height: `${barHeight}px`,
                            bottom: `${barBottom}px`
                          }}
                        />
                      )}

                      {/* Value Label */}
                      <div 
                        className="absolute text-[10px] font-medium whitespace-nowrap"
                        style={{ 
                          bottom: `${barBottom + barHeight + 4}px`
                        }}
                      >
                        <span className={isNegative ? "text-red-400" : bar.isBase || bar.isTotal ? "text-zinc-300" : "text-emerald-400"}>
                          {bar.displayValue || (bar.isBase || bar.isTotal ? bar.value : (bar.value > 0 ? `+${bar.value}` : bar.value))}
                        </span>
                      </div>

                      {/* Label */}
                      <p className="absolute bottom-[-48px] text-[9px] text-zinc-500 text-center whitespace-pre-line leading-tight w-full">
                        {bar.label}
                      </p>

                      {/* Click indicator for interactive bars */}
                      {isClickable && (
                        <div className="absolute bottom-[-70px] text-[8px] text-amber-400 flex items-center gap-0.5">
                          <span>Click to explore</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Clickable areas callout */}
          <div className="mt-20 grid grid-cols-2 gap-4">
            <button
              onClick={() => onDrillDown("pricing")}
              className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-300">Customer (Pricing / Promotion)</span>
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-xs text-amber-400/80">
                Explore why promo-driven volume may be cannibalizing across brands
              </p>
            </button>
            
            <button
              onClick={() => onDrillDown("media")}
              className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-300">Customer (Paid) - Media</span>
                <ChevronRight className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-xs text-amber-400/80">
                Explore high-ROI channels to shift investment for Coke Zero
              </p>
            </button>
          </div>

          {/* RGM Cross-links */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {onNavigateToRGMPricing && (
              <button
                onClick={onNavigateToRGMPricing}
                className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-red-300">RGM: Pricing Deep-dive</span>
                  <ChevronRight className="h-3.5 w-3.5 text-red-400" />
                </div>
                <p className="text-[10px] text-red-400/70">
                  Explore price indices, elasticity, and pricing strategy in the RGM module
                </p>
              </button>
            )}
            {onNavigateToRGMPromotion && (
              <button
                onClick={onNavigateToRGMPromotion}
                className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-red-300">RGM: Promotion Deep-dive</span>
                  <ChevronRight className="h-3.5 w-3.5 text-red-400" />
                </div>
                <p className="text-[10px] text-red-400/70">
                  Analyze promo ROI, incrementality, and cannibalization in the RGM module
                </p>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-sm text-zinc-500">
          Click the highlighted bars or cards above to explore driver-specific insights.
        </p>
      </div>
    </div>
  )
}
