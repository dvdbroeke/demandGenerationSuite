"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TPOScreen } from "./promo-effectiveness"
import { allBrands, allSkuNames, retailerOptions as sharedRetailers, mechanicOptions as sharedMechanics, brandColors } from "../shared-sku-data"

interface TradeClientMatrixProps {
  onNavigate?: (screen: TPOScreen) => void
}

// ---------- Quadrant config ----------

const quadrants = [
  { id: "top-left",     label: "Avg. performer 1",  sublabel: "CCH win",         color: "#3b82f6", bgColor: "#3b82f620" }, // blue — high trade, low client = CCH wins
  { id: "top-right",    label: "Top performer",      sublabel: "Win-win",         color: "#0d9488", bgColor: "#0d948830" }, // teal
  { id: "bottom-left",  label: "Worst performer",    sublabel: "Lose-lose",       color: "#a1a1aa", bgColor: "#a1a1aa20" }, // gray
  { id: "bottom-right", label: "Avg. performer 2",   sublabel: "Retailer win",    color: "#eab308", bgColor: "#eab30830" }, // yellow — low trade, high client = Retailer wins
]

const geographies = [
  { value: "all", label: "All Geographies" },
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "gb", label: "Great Britain" },
]

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

interface PromoEvent {
  id: string
  sku: string
  brand: string
  retailer: string
  mechanic: string
  clientKPI: number     // X-axis
  tradeKPI: number      // Y-axis
  investment: number    // bubble size
  quadrant: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  period: string
  discountDepth: number
  incrVolume: number
}

// Build a lookup from SKU name to brand using the master data
import { skuMaster } from "../shared-sku-data"

const skuBrandMap: Record<string, string> = Object.fromEntries(
  skuMaster.map(s => [s.sku, s.brand])
)

const periodLabels = ["Jan-Mar 2024", "Apr-Jun 2024", "Jul-Sep 2024", "Oct-Dec 2024", "Jan-Mar 2025"]

function generateEvents(filterSeed: number, selectedBrand: string, selectedSku: string, selectedRetailer: string, selectedMechanic: string): PromoEvent[] {
  const rng = seededRandom(filterSeed)
  const events: PromoEvent[] = []

  const skus = selectedSku !== "All SKUs" ? [selectedSku] : allSkuNames
  const retailers = selectedRetailer !== "All Retailers" ? [selectedRetailer] : ["Esselunga", "Conad", "Coop Italia", "Carrefour IT", "Eurospin"]
  const mechanics = selectedMechanic !== "All Mechanics" ? [selectedMechanic] : ["TPR", "Multibuy", "BOGOF", "Display Only"]

  let id = 0
  let brandBGoodPerformerCount = 0 // Track to limit to 2 good performers for Brand B
  
  for (const sku of skus) {
    const brand = skuBrandMap[sku] || "Brand A Classic"
    if (selectedBrand !== "All Brands" && brand !== selectedBrand) continue
    for (const ret of retailers) {
      for (const mech of mechanics) {
        if (rng() > 0.35) continue // not every combination has an event
        
        // STORYLINE: Brand B has mostly BAD promo performance
        // Most events should be in lose-lose quadrant with shallow discounts
        // Only 1-2 good performers with 30-45% price cuts and shorter duration
        const isBrandB = brand === "Brand B"
        
        let clientKPI: number
        let tradeKPI: number
        let discountDepth: number
        let incrVolume: number
        
        if (isBrandB) {
          // Brand B: More realistic distribution
          // ~60% lose-lose (spread within quadrant), ~15% CCH win, ~15% Retailer win, ~10% win-win
          const quadrantRoll = rng()
          
          if (quadrantRoll < 0.10 && brandBGoodPerformerCount < 2) {
            // Win-win quadrant (top-right): 10%, max 2 - good performers with 30-45% price cut
            brandBGoodPerformerCount++
            clientKPI = 60 + rng() * 200 // 60-260
            tradeKPI = 50 + rng() * 180 // 50-230
            discountDepth = Math.round(30 + rng() * 15) // 30-45%
            incrVolume = Math.round(35 + rng() * 65) // 35-100%
          } else if (quadrantRoll < 0.25) {
            // CCH win quadrant (top-left): ~15% - good for CCH, bad for retailer
            clientKPI = -180 + rng() * 140 // -180 to -40
            tradeKPI = 30 + rng() * 150 // 30-180
            discountDepth = Math.round(12 + rng() * 18) // 12-30%
            incrVolume = Math.round(5 + rng() * 35) // 5-40%
          } else if (quadrantRoll < 0.40) {
            // Retailer win quadrant (bottom-right): ~15% - good for retailer, bad for CCH
            clientKPI = 40 + rng() * 160 // 40-200
            tradeKPI = -200 + rng() * 160 // -200 to -40
            discountDepth = Math.round(8 + rng() * 15) // 8-23%
            incrVolume = Math.round(-5 + rng() * 30) // -5 to 25%
          } else {
            // Lose-lose quadrant (bottom-left): ~60% - spread within the quadrant
            // Vary the position within the quadrant for more realistic spread
            const spreadFactor = rng()
            if (spreadFactor < 0.3) {
              // Deep in lose-lose (far bottom-left)
              clientKPI = -280 + rng() * 100 // -280 to -180
              tradeKPI = -280 + rng() * 100 // -280 to -180
            } else if (spreadFactor < 0.6) {
              // Mid lose-lose
              clientKPI = -180 + rng() * 120 // -180 to -60
              tradeKPI = -200 + rng() * 140 // -200 to -60
            } else {
              // Near the axes (close to 0)
              clientKPI = -120 + rng() * 110 // -120 to -10
              tradeKPI = -150 + rng() * 140 // -150 to -10
            }
            discountDepth = Math.round(5 + rng() * 15) // 5-20% (shallow)
            incrVolume = Math.round(-25 + rng() * 35) // -25 to 10%
          }
        } else {
          // Other brands: normal distribution
          clientKPI = -300 + rng() * 700
          tradeKPI = -300 + rng() * 700
          discountDepth = Math.round(5 + rng() * 35)
          incrVolume = Math.round(-20 + rng() * 120)
        }
        
        const investment = 5 + rng() * 95
        const period = periodLabels[Math.floor(rng() * periodLabels.length)]

        let quadrant: PromoEvent["quadrant"]
        if (tradeKPI >= 0 && clientKPI >= 0) quadrant = "top-right"
        else if (tradeKPI >= 0 && clientKPI < 0) quadrant = "top-left"
        else if (tradeKPI < 0 && clientKPI >= 0) quadrant = "bottom-right"
        else quadrant = "bottom-left"

        events.push({
          id: `evt-${id++}`,
          sku,
          brand: brand as string,
          retailer: ret,
          mechanic: mech,
          clientKPI,
          tradeKPI,
          investment,
          quadrant,
          period,
          discountDepth,
          incrVolume,
        })
      }
    }
  }

  return events
}

// Quadrant summary
interface QuadrantSummary {
  id: string
  label: string
  sublabel: string
  color: string
  bgColor: string
  eventCount: number
  eventPct: number
  investmentTotal: number
  investmentPct: number
  avgIncrDM: string
  avgIncrMargin: string
}

function computeSummaries(events: PromoEvent[]): QuadrantSummary[] {
  const totalEvents = events.length || 1
  const totalInvestment = events.reduce((s, e) => s + e.investment, 0) || 1

  return quadrants.map(q => {
    const qEvents = events.filter(e => e.quadrant === q.id)
    const inv = qEvents.reduce((s, e) => s + e.investment, 0)
    return {
      ...q,
      eventCount: qEvents.length,
      eventPct: Math.round((qEvents.length / totalEvents) * 100),
      investmentTotal: Math.round(inv),
      investmentPct: Math.round((inv / totalInvestment) * 100),
      avgIncrDM: `${(qEvents.length > 0 ? (qEvents.reduce((s, e) => s + e.clientKPI, 0) / qEvents.length / 10).toFixed(1) : "0")} M`,
      avgIncrMargin: `${(qEvents.length > 0 ? (qEvents.reduce((s, e) => s + e.tradeKPI, 0) / qEvents.length / 10).toFixed(1) : "0")} M`,
    }
  })
}

// ---------- AI Insights - STORYLINE: Highlight Brand B bad performers ----------
const aiInsights = [
  { type: "negative" as const, text: "Brand B SKUs dominate the Lose-Lose quadrant (bottom-left): 18 of 24 events are Brand B with long promo duration (4+ weeks) and shallow price cuts (<15%). These are destroying value.", highlight: true },
  { type: "negative" as const, text: "Brand B 500ml and 1.5L show worst Trade KPI (-180 to -220) with average Client KPI. Long promo windows causing forward buying without incremental lift.", highlight: true },
  { type: "warning" as const, text: "Compare with Brand A Zero in Win-Win quadrant: shorter durations (2 weeks), deeper cuts (25-30%), and display support driving both Trade and Client KPI positive." },
  { type: "warning" as const, text: "Recommendation: Navigate to Performance by Lever to understand what promo mechanics and depths drive success, then optimize Brand B promos accordingly." },
]

// ---------- Main Component ----------

export function TPOTradeClientMatrix({ onNavigate }: TradeClientMatrixProps) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedSku, setSelectedSku] = useState("All SKUs")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedMechanic, setSelectedMechanic] = useState("All Mechanics")
  const [selectedGeo, setSelectedGeo] = useState("all")
  const [hoveredEvent, setHoveredEvent] = useState<PromoEvent | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const brandOptions = ["All Brands", ...allBrands]
  const skuOptions = ["All SKUs", ...allSkuNames]
  const retailerOptions = [...sharedRetailers]
  const mechanicOptionsList = [...sharedMechanics]

  const filterSeed = useMemo(
    () => hashStr(selectedBrand + selectedSku + selectedRetailer + selectedMechanic + selectedGeo),
    [selectedBrand, selectedSku, selectedRetailer, selectedMechanic, selectedGeo]
  )

  const events = useMemo(
    () => generateEvents(filterSeed, selectedBrand, selectedSku, selectedRetailer, selectedMechanic),
    [filterSeed, selectedBrand, selectedSku, selectedRetailer, selectedMechanic]
  )

  const summaries = useMemo(() => computeSummaries(events), [events])

  // Chart dimensions
  const W = 700, H = 500
  const pad = { top: 30, right: 30, bottom: 45, left: 55 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const minKPI = -350, maxKPI = 450
  const rangeKPI = maxKPI - minKPI

  const toX = (v: number) => pad.left + ((v - minKPI) / rangeKPI) * plotW
  const toY = (v: number) => pad.top + plotH - ((v - minKPI) / rangeKPI) * plotH
  const midX = toX(0)
  const midY = toY(0)

  const maxInv = Math.max(...events.map(e => e.investment), 1)
  const getR = (inv: number) => 4 + (inv / maxInv) * 18

  const handleMouseMove = (e: React.MouseEvent, event: PromoEvent) => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    setHoveredEvent(event)
  }

  // Stacked bar data for side panels
  const eventBarData = summaries.map(s => ({ label: s.label, pct: s.eventPct, color: s.color }))
  const investBarData = summaries.map(s => ({ label: s.label, pct: s.investmentPct, color: s.color }))

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button onClick={() => onNavigate?.("promo-evolution")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Evolution</button>
        <button onClick={() => onNavigate?.("promo-performance")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Performance</button>
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">Trade vs Client Matrix</button>
        <button onClick={() => onNavigate?.("performance-by-lever")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Performance by Lever</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">{"Promotion Optimizer"}</button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-zinc-100">Trade Promo Performance KPI vs Client Promo KPI</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Bubble chart: each bubble = one promo event (SKU x customer x period). X = Client Promo KPI, Y = Trade Promo KPI. Bubble size = investment.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={selectedGeo} onValueChange={setSelectedGeo}>
          <SelectTrigger className="h-7 w-[150px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{geographies.map(g => <SelectItem key={g.value} value={g.value} className="text-zinc-200 text-xs">{g.label}</SelectItem>)}</SelectContent>
        </Select>
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
      </div>

      {/* Main content: chart + side panels */}
      <div className="grid grid-cols-[1fr_200px] gap-4">
        {/* Bubble Chart */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5 relative">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
              {/* Quadrant backgrounds */}
              {/* Top-left: blue (CCH win - high trade, low client) */}
              <rect x={pad.left} y={pad.top} width={midX - pad.left} height={midY - pad.top} fill={quadrants[0].bgColor} />
              {/* Top-right: teal (win-win) */}
              <rect x={midX} y={pad.top} width={W - pad.right - midX} height={midY - pad.top} fill={quadrants[1].bgColor} />
              {/* Bottom-left: gray (lose-lose) */}
              <rect x={pad.left} y={midY} width={midX - pad.left} height={H - pad.bottom - midY} fill={quadrants[2].bgColor} />
              {/* Bottom-right: yellow (Retailer win - low trade, high client) */}
              <rect x={midX} y={midY} width={W - pad.right - midX} height={H - pad.bottom - midY} fill={quadrants[3].bgColor} />

              {/* Grid lines */}
              {[-300, -200, -100, 0, 100, 200, 300, 400].map(v => (
                <g key={`grid-${v}`}>
                  <line x1={toX(v)} y1={pad.top} x2={toX(v)} y2={H - pad.bottom} stroke="#27272a" strokeWidth="0.5" opacity={v === 0 ? 0 : 0.5} />
                  <line x1={pad.left} y1={toY(v)} x2={W - pad.right} y2={toY(v)} stroke="#27272a" strokeWidth="0.5" opacity={v === 0 ? 0 : 0.5} />
                </g>
              ))}

              {/* Axis lines (at 0) */}
              <line x1={midX} y1={pad.top} x2={midX} y2={H - pad.bottom} stroke="#52525b" strokeWidth="1.5" />
              <line x1={pad.left} y1={midY} x2={W - pad.right} y2={midY} stroke="#52525b" strokeWidth="1.5" />

              {/* Axis labels */}
              {[-300, -200, -100, 0, 100, 200, 300, 400].map(v => (
                <g key={`label-${v}`}>
                  <text x={toX(v)} y={H - pad.bottom + 16} textAnchor="middle" className="fill-zinc-500 text-[8px]">{v}</text>
                  <text x={pad.left - 8} y={toY(v) + 3} textAnchor="end" className="fill-zinc-500 text-[8px]">{v}</text>
                </g>
              ))}

              {/* Axis titles */}
              <text x={W / 2} y={H - 4} textAnchor="middle" className="fill-zinc-400 text-[10px] font-medium">Client Promo KPI</text>
              <text x={12} y={H / 2} textAnchor="middle" className="fill-zinc-400 text-[10px] font-medium" transform={`rotate(-90,12,${H / 2})`}>Trade Promo Performance</text>

              {/* Quadrant labels */}
              <text x={pad.left + 8} y={pad.top + 18} className="fill-zinc-300 text-[9px] font-bold">Avg. performer 1</text>
              <text x={pad.left + 8} y={pad.top + 30} className="fill-blue-400 text-[8px]">CCH win</text>

              <text x={W - pad.right - 8} y={pad.top + 18} textAnchor="end" className="fill-zinc-300 text-[9px] font-bold">Top performer</text>
              <text x={W - pad.right - 8} y={pad.top + 30} textAnchor="end" className="fill-teal-400 text-[8px]">Win-win</text>

              <text x={pad.left + 8} y={H - pad.bottom - 10} className="fill-zinc-300 text-[9px] font-bold">Worst performer</text>
              <text x={pad.left + 8} y={H - pad.bottom - 0} className="fill-red-400 text-[8px]">Lose-lose</text>

              <text x={W - pad.right - 8} y={H - pad.bottom - 10} textAnchor="end" className="fill-zinc-300 text-[9px] font-bold">Avg. performer 2</text>
              <text x={W - pad.right - 8} y={H - pad.bottom - 0} textAnchor="end" className="fill-yellow-400 text-[8px]">Retailer win</text>

              {/* Bubbles */}
              {events.map(evt => {
                const cx = toX(evt.clientKPI)
                const cy = toY(evt.tradeKPI)
                const r = getR(evt.investment)
                const qc = quadrants.find(q => q.id === evt.quadrant)
                const bColor = brandColors[evt.brand] || qc?.color || "#888"
                return (
                  <circle
                    key={evt.id}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={bColor}
                    opacity={hoveredEvent?.id === evt.id ? 0.95 : 0.55}
                    stroke={hoveredEvent?.id === evt.id ? "#fff" : "transparent"}
                    strokeWidth={hoveredEvent?.id === evt.id ? 2 : 0}
                    onMouseMove={(e) => handleMouseMove(e, evt)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    style={{ cursor: "pointer", transition: "opacity 150ms" }}
                  />
                )
              })}
            </svg>

            {/* Tooltip overlay */}
            {hoveredEvent && (
              <div
                className="absolute pointer-events-none z-10 bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 shadow-xl"
                style={{
                  left: Math.min(tooltipPos.x + 16, W - 120),
                  top: Math.max(tooltipPos.y - 60, 8),
                  maxWidth: 300,
                  minWidth: 240,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: brandColors[hoveredEvent.brand] || "#888" }} />
                  <p className="text-[11px] font-semibold text-zinc-100">{hoveredEvent.sku}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-2">
                  <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">{hoveredEvent.brand}</span>
                  <span>{"@"} {hoveredEvent.retailer}</span>
                </div>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 py-2 border-t border-zinc-800">
                  <div>
                    <p className="text-[9px] text-zinc-500">Mechanic</p>
                    <p className="text-[10px] font-medium text-zinc-200">{hoveredEvent.mechanic}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Period</p>
                    <p className="text-[10px] font-medium text-zinc-200">{hoveredEvent.period}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Discount Depth</p>
                    <p className="text-[10px] font-mono text-zinc-200">{hoveredEvent.discountDepth}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Client KPI</p>
                    <p className="text-[10px] font-mono text-zinc-200">{hoveredEvent.clientKPI.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Trade KPI</p>
                    <p className="text-[10px] font-mono text-zinc-200">{hoveredEvent.tradeKPI.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Investment</p>
                    <p className="text-[10px] font-mono text-zinc-200">{hoveredEvent.investment.toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500">Incr. Volume</p>
                    <p className={cn("text-[10px] font-mono", hoveredEvent.incrVolume >= 0 ? "text-emerald-400" : "text-red-400")}>{hoveredEvent.incrVolume > 0 ? "+" : ""}{hoveredEvent.incrVolume}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] text-zinc-500">Quadrant</p>
                    <p className="text-[10px] font-medium" style={{ color: quadrants.find(q => q.id === hoveredEvent.quadrant)?.color }}>{quadrants.find(q => q.id === hoveredEvent.quadrant)?.sublabel}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side panels: stacked bars */}
        <div className="space-y-3">
          {/* Events breakdown */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-3">
              <p className="text-[10px] text-zinc-500 font-medium mb-2">% of Events</p>
              <div className="flex flex-col rounded overflow-hidden" style={{ height: 200 }}>
                {eventBarData.map((seg, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center"
                    style={{
                      height: `${seg.pct}%`,
                      backgroundColor: seg.color,
                      minHeight: seg.pct > 0 ? 16 : 0,
                      opacity: 0.7,
                    }}
                  >
                    {seg.pct >= 8 && (
                      <div className="text-center">
                        <span className="text-[8px] text-white font-bold block">{seg.label.split(" ").slice(0, 2).join(" ")}</span>
                        <span className="text-[9px] text-white font-bold">({seg.pct}%)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-zinc-600 text-center mt-1"># events</p>
            </CardContent>
          </Card>

          {/* Investment breakdown */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-3">
              <p className="text-[10px] text-zinc-500 font-medium mb-2">% of Investment</p>
              <div className="flex flex-col rounded overflow-hidden" style={{ height: 200 }}>
                {investBarData.map((seg, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center"
                    style={{
                      height: `${seg.pct}%`,
                      backgroundColor: seg.color,
                      minHeight: seg.pct > 0 ? 16 : 0,
                      opacity: 0.7,
                    }}
                  >
                    {seg.pct >= 8 && (
                      <div className="text-center">
                        <span className="text-[8px] text-white font-bold block">{seg.label.split(" ").slice(0, 2).join(" ")}</span>
                        <span className="text-[9px] text-white font-bold">({seg.pct}%)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-zinc-600 text-center mt-1">Investment share</p>
            </CardContent>
          </Card>

          {/* Quadrant summary detail */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-3 space-y-2">
              <p className="text-[10px] text-zinc-500 font-medium">Quadrant Summary</p>
              {summaries.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px]">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-zinc-300 flex-1 truncate">{s.sublabel}</span>
                  <span className="text-zinc-400 font-mono">{s.eventPct}%</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-zinc-400 font-mono">{s.investmentPct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Trade Performance Insights</h3>
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
