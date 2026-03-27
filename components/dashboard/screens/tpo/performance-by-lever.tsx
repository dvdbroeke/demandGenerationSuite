"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TPOScreen } from "./promo-effectiveness"
import { allBrands, allSkuNames, retailerOptions as sharedRetailers, mechanicOptions as sharedMechanics } from "../shared-sku-data"

interface PerformanceByLeverProps {
  onNavigate?: (screen: TPOScreen) => void
}

// ---------- Data definitions ----------

const performerLabels = ["Avg", "Top Perf", "Worst Perf"] as const

// Mechanics dimension
const mechanicSegments = [
  { label: "Cut price (no leaflet)", color: "#6b8e8e" },
  { label: "Leaflet cut price", color: "#b8a95e" },
  { label: "Leaflet cut fidelity", color: "#8b9e5e" },
  { label: "Extras display", color: "#4a6e4a" },
  { label: "Leaflet multibuy", color: "#a1a1aa" },
]
const mechanicData: Record<string, number[]> = {
  "Avg":        [13, 57, 22, 5, 3],
  "Top Perf":   [27, 49, 20, 3, 1],
  "Worst Perf": [75, 10, 10, 3, 2],
}

// Cut Price (discount depth) dimension - STORYLINE: 30%+ price cuts perform best
const cutPriceSegments = [
  { label: "<5%", color: "#3f3f46" },
  { label: "5-10%", color: "#52525b" },
  { label: "10-15%", color: "#6b7280" },
  { label: "15-20%", color: "#8b9e5e" },
  { label: "20-25%", color: "#b8a95e" },
  { label: "25-30%", color: "#6b8e8e" },
  { label: "30-35%", color: "#22c55e" }, // Green - best performing
  { label: "35-40%", color: "#16a34a" }, // Darker green - also good
  { label: "40%+", color: "#ef4444" },   // Red - too deep, forward buying
]
// STORYLINE: Top performers cluster at 30-35% price cut, worst at 10-15%
const cutPriceData: Record<string, number[]> = {
  "Avg":        [8, 12, 18, 20, 16, 12, 8, 4, 2],
  "Top Perf":   [2, 5, 8, 10, 12, 18, 28, 15, 2],   // Top performers at 30-35%
  "Worst Perf": [15, 22, 32, 18, 8, 3, 1, 1, 0],    // Worst at 10-15% shallow cuts
}

// FWD Buy dimension
const fwdBuySegments = [
  { label: "<10%", color: "#4a6e4a" },
  { label: "10-50%", color: "#6b8e8e" },
  { label: "50%+", color: "#b8a95e" },
]
const fwdBuyData: Record<string, number[]> = {
  "Avg":        [14, 47, 39],
  "Top Perf":   [25, 54, 21],
  "Worst Perf": [22, 72, 6],
}

// Pack size dimension
const packSizeSegments = [
  { label: "66clx1ct", color: "#ef4444" },
  { label: "33clx3ct", color: "#b8a95e" },
  { label: "50clx1ct", color: "#8b9e5e" },
  { label: "Can", color: "#6b8e8e" },
  { label: "66clx6ct", color: "#3b82f6" },
  { label: "33clx6ct", color: "#4a6e4a" },
  { label: "33clx1ct", color: "#a1a1aa" },
  { label: "Other", color: "#71717a" },
]
const packSizeData: Record<string, number[]> = {
  "Avg":        [18, 17, 27, 24, 6, 4, 3, 1],
  "Top Perf":   [33, 48, 8, 5, 3, 2, 1, 0],
  "Worst Perf": [10, 11, 20, 20, 11, 11, 10, 7],
}

// Sub-brand dimension
const subBrandSegments = [
  { label: "A", color: "#4a4a3e" },
  { label: "B", color: "#52525b" },
  { label: "C", color: "#6b7280" },
  { label: "D", color: "#8b9e5e" },
  { label: "E", color: "#a1a1aa" },
  { label: "F", color: "#3f3f46" },
]
const subBrandData: Record<string, number[]> = {
  "Avg":        [17, 49, 33, 0, 1, 0],
  "Top Perf":   [32, 33, 9, 17, 6, 3],
  "Worst Perf": [9, 52, 19, 9, 8, 3],
}

// Quarter dimension
const quarterSegments = [
  { label: "Q1", color: "#4a6e4a" },
  { label: "Q2", color: "#3b82f6" },
  { label: "Q3", color: "#b8a95e" },
  { label: "Q4", color: "#ef4444" },
]
const quarterData: Record<string, number[]> = {
  "Avg":        [19, 32, 31, 18],
  "Top Perf":   [19, 52, 16, 13],
  "Worst Perf": [19, 45, 17, 19],
}

// Key insights (callout boxes under each row) - STORYLINE aligned
const insightCallouts = [
  { text: "Avoid cut price without leaflet and display - Diet Coke over-indexes here", color: "bg-red-500/10 border-red-500/20 text-red-400" },
  { text: "Price cut 30-35% is optimal - drives lift without excessive forward buying", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  { text: "Control forward buying (<50%) is critical - Diet Coke promos show 72% FWD buy", color: "bg-red-500/10 border-red-500/20 text-red-400" },
]

// Seeded random for filter variations
function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}
function hashStr(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function applyFilterVariation(baseData: Record<string, number[]>, numSegments: number, filterSeed: number): Record<string, number[]> {
  if (filterSeed === 0) return baseData
  const rng = seededRandom(filterSeed)
  const result: Record<string, number[]> = {}
  for (const key of Object.keys(baseData)) {
    const base = baseData[key]
    const noisy = base.map(v => Math.max(0, Math.round(v + (rng() - 0.5) * 8)))
    const sum = noisy.reduce((a, b) => a + b, 0) || 1
    result[key] = noisy.map(v => Math.round((v / sum) * 100))
    // Normalize to exactly 100
    const diff = 100 - result[key].reduce((a, b) => a + b, 0)
    if (result[key].length > 0) result[key][0] += diff
  }
  return result
}

// ---------- Stacked Bar Chart ----------

interface StackedBarGroupProps {
  title: string
  segments: { label: string; color: string }[]
  data: Record<string, number[]>
  showInsight?: { text: string; color: string }
}

function StackedBarGroup({ title, segments, data, showInsight }: StackedBarGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-zinc-100">{title}</h3>
      {/* Legend */}
      <div className="flex items-center gap-2 flex-wrap text-[9px] text-zinc-400">
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>
      {/* Bars */}
      <div className="flex items-end gap-5">
        {performerLabels.map(perf => {
          const values = data[perf] || []
          return (
            <div key={perf} className="flex flex-col items-center gap-1.5" style={{ width: 90 }}>
              <div className="flex flex-col w-full rounded overflow-hidden" style={{ height: 220 }}>
                {values.map((pct, si) => {
                  if (pct === 0) return null
                  const h = (pct / 100) * 220
                  return (
                    <div
                      key={si}
                      className="w-full flex items-center justify-center"
                      style={{
                        height: h,
                        backgroundColor: segments[si]?.color || "#888",
                        minHeight: pct > 0 ? 10 : 0,
                      }}
                    >
                      {pct >= 6 && (
                        <span className="text-[10px] font-mono text-white font-bold">{pct}%</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">{perf}</span>
            </div>
          )
        })}
      </div>
      {/* Callout insight */}
      {showInsight && (
        <div className={cn("p-2 rounded-lg border text-[10px] font-medium", showInsight.color)}>
          {showInsight.text}
        </div>
      )}
    </div>
  )
}

// ---------- AI Insights - STORYLINE: Highlight optimal promo structure ----------

const aiInsights = [
  { type: "positive" as const, text: "Top performers cluster at 30-35% price cut depth (43% of top promos). This is the 'sweet spot' - deep enough to drive trial, not so deep it triggers excessive forward buying.", highlight: true },
  { type: "negative" as const, text: "Worst performers show 54% of promos with shallow cuts (10-15%). Diet Coke's average 15% cut is in this danger zone - insufficient to drive incremental lift.", highlight: true },
  { type: "warning" as const, text: "Avoid 40%+ price cuts - these trigger forward buying above 50%, destroying true incrementality. Keep price cuts in the 30-35% optimal range." },
  { type: "positive" as const, text: "Recommendation: Navigate to Promotion Optimizer to simulate Diet Coke SKUs with 30-35% price cuts and shorter 2-week durations." },
]

// ---------- Main Component ----------

export function TPOPerformanceByLever({ onNavigate }: PerformanceByLeverProps) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedMechanic, setSelectedMechanic] = useState("All Mechanics")
  const [selectedSku, setSelectedSku] = useState("All SKUs")

  const brandOptions = ["All Brands", ...allBrands]
  const skuOptions = ["All SKUs", ...allSkuNames]
  const retailerOptions = [...sharedRetailers]
  const mechanicOptionsList = [...sharedMechanics]

  const filterSeed = useMemo(
    () => hashStr(selectedBrand + selectedRetailer + selectedMechanic + selectedSku),
    [selectedBrand, selectedRetailer, selectedMechanic, selectedSku]
  )
  const isFiltered = selectedBrand !== "All Brands" || selectedRetailer !== "All Retailers" || selectedMechanic !== "All Mechanics" || selectedSku !== "All SKUs"

  const mechDataF = useMemo(() => applyFilterVariation(mechanicData, mechanicSegments.length, filterSeed), [filterSeed])
  const cutPriceDataF = useMemo(() => applyFilterVariation(cutPriceData, cutPriceSegments.length, filterSeed + 1), [filterSeed])
  const fwdBuyDataF = useMemo(() => applyFilterVariation(fwdBuyData, fwdBuySegments.length, filterSeed + 2), [filterSeed])
  const packSizeDataF = useMemo(() => applyFilterVariation(packSizeData, packSizeSegments.length, filterSeed + 3), [filterSeed])
  const subBrandDataF = useMemo(() => applyFilterVariation(subBrandData, subBrandSegments.length, filterSeed + 4), [filterSeed])
  const quarterDataF = useMemo(() => applyFilterVariation(quarterData, quarterSegments.length, filterSeed + 5), [filterSeed])

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button onClick={() => onNavigate?.("promo-evolution")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Evolution</button>
        <button onClick={() => onNavigate?.("promo-performance")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Performance</button>
        <button onClick={() => onNavigate?.("trade-client-matrix")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Trade vs Client Matrix</button>
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">Performance by Lever</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">{"Promotion Optimizer"}</button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-zinc-100">What are drivers and common features of successful promotion initiatives?</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Distribution charts comparing Avg vs Top vs Worst performers across mechanics, discount depth, forward buying, pack size, sub-brand, and quarter.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{brandOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedSku} onValueChange={setSelectedSku}>
          <SelectTrigger className="h-7 w-[160px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">{skuOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{retailerOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{mechanicOptionsList.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        {isFiltered && (
          <div className="flex items-center gap-1 ml-2">
            <span className="text-[9px] text-zinc-500">Active:</span>
            {selectedBrand !== "All Brands" && <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[8px] py-0 h-4">{selectedBrand}</Badge>}
            {selectedSku !== "All SKUs" && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] py-0 h-4">{selectedSku}</Badge>}
            {selectedRetailer !== "All Retailers" && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] py-0 h-4">{selectedRetailer}</Badge>}
            {selectedMechanic !== "All Mechanics" && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[8px] py-0 h-4">{selectedMechanic}</Badge>}
          </div>
        )}
      </div>

      {/* Row 1: Mechanic + Cut Price + FWD Buy */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="grid grid-cols-3 gap-6">
            <StackedBarGroup
              title="Mechanic"
              segments={mechanicSegments}
              data={mechDataF}
              showInsight={insightCallouts[0]}
            />
            <StackedBarGroup
              title="Cut Price"
              segments={cutPriceSegments}
              data={cutPriceDataF}
              showInsight={insightCallouts[1]}
            />
            <StackedBarGroup
              title="FWD Buy"
              segments={fwdBuySegments}
              data={fwdBuyDataF}
              showInsight={insightCallouts[2]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Pack size + Sub-brand + Quarter */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="grid grid-cols-3 gap-6">
            <StackedBarGroup
              title="Pack size"
              segments={packSizeSegments}
              data={packSizeDataF}
            />
            <StackedBarGroup
              title="Sub-brand"
              segments={subBrandSegments}
              data={subBrandDataF}
            />
            <StackedBarGroup
              title="Quarter"
              segments={quarterSegments}
              data={quarterDataF}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Performance Insights</h3>
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
