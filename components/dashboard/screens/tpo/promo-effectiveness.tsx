"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { allSkuNames, allTiers, retailerOptions as sharedRetailers, mechanicOptions as sharedMechanics, skuColors as sharedSkuColors } from "../shared-sku-data"

export type TPOScreen = "promo-evolution" | "promo-performance" | "trade-client-matrix" | "performance-by-lever" | "simulate-forecast"

interface PromoEffectivenessProps {
  onNavigate?: (screen: TPOScreen) => void
}

// ---------- Constants ----------

const allSkusList = allSkuNames
const packOptions = ["All Packs", ...allTiers]
const mechanicOptions = [...sharedMechanics]
const retailerOptions = [...sharedRetailers]
const timeGranularities = [{ value: "week", label: "Weekly" }, { value: "month", label: "Monthly" }]
const metricOptions = [{ value: "roi", label: "ROI (x)" }, { value: "incremental", label: "Incremental Sales %" }, { value: "volume", label: "Incremental Volume (K L)" }]

// Deterministic seed per config so filter changes produce stable, different data
function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

function hashStr(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

interface DataPoint { period: string; value: number; promoCount: number }

function generateSkuData(sku: string, metric: string, granularity: string, retailer: string, mechanic: string, pack: string): DataPoint[] {
  const periods = granularity === "week"
    ? Array.from({ length: 26 }, (_, i) => `W${(i + 1).toString().padStart(2, "0")}`)
    : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const seed = hashStr(sku + retailer + mechanic + pack)
  const rng = seededRandom(seed)

  const skuBase: Record<string, Record<string, number>> = {
    "Brand A Classic 330ml":   { roi: 1.42, incremental: 38, volume: 52 },
    "Brand A Classic 500ml":   { roi: 1.28, incremental: 32, volume: 44 },
    "Brand A Classic 1.5L":    { roi: 0.98, incremental: 22, volume: 36 },
    "Brand A Classic 2L":      { roi: 0.85, incremental: 18, volume: 30 },
    "Brand A Classic 8x330ml": { roi: 1.32, incremental: 34, volume: 46 },
    "Brand A Zero 330ml":      { roi: 1.72, incremental: 48, volume: 62 },
    "Brand A Zero 500ml":      { roi: 1.35, incremental: 35, volume: 42 },
    "Brand A Zero 1.5L":       { roi: 1.05, incremental: 24, volume: 28 },
    "Brand A Zero 2L":         { roi: 0.78, incremental: 16, volume: 24 },
    "Brand A Zero 8x330ml":    { roi: 1.28, incremental: 32, volume: 40 },
    "Brand B 330ml":    { roi: 1.18, incremental: 28, volume: 34 },
    "Brand B 500ml":    { roi: 0.92, incremental: 18, volume: 26 },
    "Brand B 1.5L":     { roi: 0.72, incremental: 14, volume: 20 },
    "Brand C Orange 330ml": { roi: 1.55, incremental: 42, volume: 48 },
    "Brand C Orange 500ml": { roi: 1.22, incremental: 30, volume: 38 },
    "Brand C Orange 2L":    { roi: 0.82, incremental: 16, volume: 22 },
    "Brand D 330ml":       { roi: 1.08, incremental: 25, volume: 30 },
    "Brand D 500ml":       { roi: 0.88, incremental: 15, volume: 22 },
    "Brand D 1.5L":        { roi: 0.68, incremental: 12, volume: 18 },
  }
  const base = skuBase[sku]?.[metric] ?? (metric === "roi" ? 1.2 : metric === "incremental" ? 30 : 40)

  const retailerMult: Record<string, number> = { "Retailer A": 1.1, "Retailer B": 1.05, "Retailer C": 0.96, "Retailer D": 0.98, "Retailer E": 0.88, "Retailer F": 0.90, "Retailer G": 1.04, "Retailer H": 0.95 }
  const rMult = retailer !== "All Retailers" ? (retailerMult[retailer] ?? 1) : 1

  const mechMult: Record<string, number> = { "TPR": 1.0, "Multibuy": 1.12, "BOGOF": 0.85, "Meal Deal": 0.95, "\u20ac1 PMP": 0.78, "Display Only": 1.08 }
  const mMult = mechanic !== "All Mechanics" ? (mechMult[mechanic] ?? 1) : 1

  return periods.map((p, i) => {
    const seasonal = Math.sin((i / periods.length) * Math.PI * 2) * 0.12
    const noise = (rng() - 0.5) * 0.3
    const val = base * rMult * mMult * (1 + seasonal + noise)
    return { period: p, value: parseFloat(val.toFixed(2)), promoCount: Math.floor(2 + rng() * 6) }
  })
}

const localSkuColors = sharedSkuColors

const retailerColors: Record<string, string> = {
  "Retailer A": "#3b82f6", "Retailer B": "#f97316", "Retailer C": "#22c55e",
  "Retailer D": "#eab308", "Retailer E": "#06b6d4", "Retailer F": "#8b5cf6", "Retailer G": "#ec4899", "Retailer H": "#14b8a6",
}

const mechanicColors: Record<string, string> = {
  "TPR": "#14b8a6", "Multibuy": "#f59e0b", "BOGOF": "#ef4444",
  "Meal Deal": "#8b5cf6", "\u20ac1 PMP": "#ec4899", "Display Only": "#06b6d4",
}

const aiInsights = [
  { type: "positive" as const, text: "Brand A Zero 330ml TPR at Retailer A delivers 1.72x ROI -- 28% above portfolio average. Consider scaling to Retailer B." },
  { type: "warning" as const, text: "BOGOF mechanics on 1.5L packs show declining incrementality (was 42%, now 31%). Multibuy outperforms by 18pp." },
  { type: "positive" as const, text: "Summer weeks (W22-W30) show 35% higher promo ROI vs. average. Align major promotions with this window." },
  { type: "negative" as const, text: "PAM Meal Deal promos on Brand B 500ml have negative incremental margin. Review pricing or exit mechanic." },
]

// ---------- Component ----------

export function TPOPromoEffectiveness({ onNavigate }: PromoEffectivenessProps) {
  const [selectedSku, setSelectedSku] = useState("Brand A Classic 330ml")
  const [selectedPack, setSelectedPack] = useState("All Packs")
  const [selectedMechanic, setSelectedMechanic] = useState("All Mechanics")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [granularity, setGranularity] = useState("month")
  const [metric, setMetric] = useState("roi")

  // Simultaneous compare: SKUs, retailers, and mechanics can all be active at once
  const [compareSkus, setCompareSkus] = useState<string[]>([])
  const [compareRetailers, setCompareRetailers] = useState<string[]>([])
  const [compareMechanics, setCompareMechanics] = useState<string[]>([])

  const toggleItem = (list: string[], item: string, setter: (v: string[]) => void, max = 3) => {
    setter(list.includes(item) ? list.filter(s => s !== item) : list.length >= max ? list : [...list, item])
  }

  // Primary series
  const primaryData = useMemo(
    () => generateSkuData(selectedSku, metric, granularity, selectedRetailer, selectedMechanic, selectedPack),
    [selectedSku, metric, granularity, selectedRetailer, selectedMechanic, selectedPack]
  )

  // All overlays combined -- SKU overlays + retailer overlays + mechanic overlays
  const overlays = useMemo(() => {
    const skuOverlays = compareSkus.map(sku => ({
      key: `sku:${sku}`,
      label: sku,
      color: localSkuColors[sku] || "#888",
      dash: "none" as const,
      data: generateSkuData(sku, metric, granularity, selectedRetailer, selectedMechanic, selectedPack),
    }))
    const retOverlays = compareRetailers.map(ret => ({
      key: `ret:${ret}`,
      label: `@ ${ret}`,
      color: retailerColors[ret] || "#888",
      dash: "6 3" as const,
      data: generateSkuData(selectedSku, metric, granularity, ret, selectedMechanic, selectedPack),
    }))
    const mechOverlays = compareMechanics.map(mech => ({
      key: `mech:${mech}`,
      label: `[${mech}]`,
      color: mechanicColors[mech] || "#888",
      dash: "2 2" as const,
      data: generateSkuData(selectedSku, metric, granularity, selectedRetailer, mech, selectedPack),
    }))
    return [...skuOverlays, ...retOverlays, ...mechOverlays]
  }, [compareSkus, compareRetailers, compareMechanics, selectedSku, metric, granularity, selectedRetailer, selectedMechanic, selectedPack])

  const availableSkus = allSkusList.filter(s => s !== selectedSku && !compareSkus.includes(s))
  const availableRetailers = retailerOptions.filter(r => r !== "All Retailers" && r !== selectedRetailer && !compareRetailers.includes(r))
  const availableMechanics = mechanicOptions.filter(m => m !== "All Mechanics" && m !== selectedMechanic && !compareMechanics.includes(m))

  // Chart dimensions
  const chartW = 900, chartH = 260, padL = 55, padR = 20, padT = 15, padB = 30
  const plotW = chartW - padL - padR, plotH = chartH - padT - padB

  const allValues = [
    ...primaryData.map(d => d.value),
    ...overlays.flatMap(o => o.data.map(d => d.value)),
  ]
  const minV = Math.min(...allValues) * 0.85
  const maxV = Math.max(...allValues) * 1.1
  const rangeV = maxV - minV || 1

  const toX = (i: number) => padL + (i / (primaryData.length - 1)) * plotW
  const toY = (v: number) => padT + plotH - ((v - minV) / rangeV) * plotH

  const mainPath = primaryData.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.value).toFixed(1)}`).join(" ")
  const areaPath = mainPath + ` L${toX(primaryData.length - 1).toFixed(1)},${(padT + plotH).toFixed(1)} L${padL},${(padT + plotH).toFixed(1)} Z`

  const refLineY = metric === "roi" && minV < 1 && maxV > 1 ? toY(1) : null
  const yTicks = Array.from({ length: 5 }, (_, i) => minV + (rangeV / 4) * i)

  const formatVal = (v: number) => metric === "roi" ? v.toFixed(2) + "x" : metric === "incremental" ? v.toFixed(0) + "%" : v.toFixed(0)

  // Primary label for legend
  const primaryLabel = `${selectedSku}${selectedRetailer !== "All Retailers" ? ` @ ${selectedRetailer}` : ""}${selectedMechanic !== "All Mechanics" ? ` [${selectedMechanic}]` : ""}`

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">Promo Effectiveness</button>
        <button onClick={() => onNavigate?.("cross-over")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Cross-over</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promotion Optimizer</button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-zinc-100">Promo Effectiveness</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">Time-series view of promotion ROI and incrementality. Compare across SKUs, retailers, or mechanics.</p>
      </div>

      {/* Global Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={selectedSku} onValueChange={(v) => { setSelectedSku(v); setCompareSkus(prev => prev.filter(s => s !== v)) }}>
          <SelectTrigger className="h-7 w-auto min-w-[150px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {allSkusList.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedPack} onValueChange={setSelectedPack}>
          <SelectTrigger className="h-7 w-auto min-w-[110px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {packOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedMechanic} onValueChange={(v) => { setSelectedMechanic(v); setCompareMechanics(prev => prev.filter(m => m !== v)) }}>
          <SelectTrigger className="h-7 w-auto min-w-[120px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {mechanicOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedRetailer} onValueChange={(v) => { setSelectedRetailer(v); setCompareRetailers(prev => prev.filter(r => r !== v)) }}>
          <SelectTrigger className="h-7 w-auto min-w-[120px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {retailerOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="w-px h-5 bg-zinc-800" />
        <Select value={granularity} onValueChange={setGranularity}>
          <SelectTrigger className="h-7 w-[100px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {timeGranularities.map(g => <SelectItem key={g.value} value={g.value} className="text-zinc-200 text-xs">{g.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="h-7 w-[180px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {metricOptions.map(m => <SelectItem key={m.value} value={m.value} className="text-zinc-200 text-xs">{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Chart Card */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          {/* Compare controls -- all three dimensions at once */}
          <div className="space-y-2 mb-4">
            {/* SKU compare row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-500 w-16 flex-shrink-0">+ SKU</span>
              {availableSkus.length > 0 && (
                <Select value="" onValueChange={(v) => { if (v) toggleItem(compareSkus, v, setCompareSkus) }}>
                  <SelectTrigger className="h-6 w-[170px] bg-zinc-900 border-zinc-800 text-zinc-400 text-[10px]">
                    <span className="text-zinc-500">Add SKU overlay...</span>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {availableSkus.map(s => <SelectItem key={s} value={s} className="text-zinc-200 text-xs">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {compareSkus.map(item => (
                <button key={item} onClick={() => toggleItem(compareSkus, item, setCompareSkus)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-zinc-600 text-zinc-100 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: localSkuColors[item] || "#888" }} />
                  {item} <span className="text-zinc-500 ml-0.5">x</span>
                </button>
              ))}
              {compareSkus.length >= 3 && <span className="text-[9px] text-zinc-600">Max 3</span>}
            </div>

            {/* Retailer compare row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-500 w-16 flex-shrink-0">+ Retailer</span>
              {availableRetailers.length > 0 && (
                <Select value="" onValueChange={(v) => { if (v) toggleItem(compareRetailers, v, setCompareRetailers) }}>
                  <SelectTrigger className="h-6 w-[170px] bg-zinc-900 border-zinc-800 text-zinc-400 text-[10px]">
                    <span className="text-zinc-500">Add Retailer overlay...</span>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {availableRetailers.map(s => <SelectItem key={s} value={s} className="text-zinc-200 text-xs">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {compareRetailers.map(item => (
                <button key={item} onClick={() => toggleItem(compareRetailers, item, setCompareRetailers)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-zinc-600 text-zinc-100 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: retailerColors[item] || "#888" }} />
                  {item} <span className="text-zinc-500 ml-0.5">x</span>
                </button>
              ))}
              {compareRetailers.length >= 3 && <span className="text-[9px] text-zinc-600">Max 3</span>}
            </div>

            {/* Mechanic compare row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-500 w-16 flex-shrink-0">+ Mechanic</span>
              {availableMechanics.length > 0 && (
                <Select value="" onValueChange={(v) => { if (v) toggleItem(compareMechanics, v, setCompareMechanics) }}>
                  <SelectTrigger className="h-6 w-[170px] bg-zinc-900 border-zinc-800 text-zinc-400 text-[10px]">
                    <span className="text-zinc-500">Add Mechanic overlay...</span>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {availableMechanics.map(s => <SelectItem key={s} value={s} className="text-zinc-200 text-xs">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {compareMechanics.map(item => (
                <button key={item} onClick={() => toggleItem(compareMechanics, item, setCompareMechanics)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border border-zinc-600 text-zinc-100 bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mechanicColors[item] || "#888" }} />
                  {item} <span className="text-zinc-500 ml-0.5">x</span>
                </button>
              ))}
              {compareMechanics.length >= 3 && <span className="text-[9px] text-zinc-600">Max 3</span>}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-3 text-[10px] text-zinc-500 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-emerald-500 rounded" />
              {selectedSku} {selectedRetailer !== "All Retailers" ? `@ ${selectedRetailer}` : ""} {selectedMechanic !== "All Mechanics" ? `[${selectedMechanic}]` : ""}
            </span>
            {overlays.map(o => (
              <span key={o.key} className="flex items-center gap-1.5">
                <svg width="16" height="2"><line x1="0" y1="1" x2="16" y2="1" stroke={o.color} strokeWidth="1.5" strokeDasharray={o.dash === "none" ? undefined : o.dash} /></svg>
                {o.label}
              </span>
            ))}
            {refLineY !== null && (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0 border-t border-dashed border-zinc-500" />
                Break-even (1.0x)
              </span>
            )}
            {overlays.length > 0 && (
              <>
                <span className="w-px h-3 bg-zinc-700" />
                <span className="text-[9px] text-zinc-600">Solid = SKU | Dashed = Retailer | Dotted = Mechanic</span>
              </>
            )}
          </div>

          {/* SVG Chart */}
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            {yTicks.map((t, i) => (
              <g key={i}>
                <line x1={padL} y1={toY(t)} x2={chartW - padR} y2={toY(t)} stroke="#27272a" strokeWidth="0.5" />
                <text x={padL - 6} y={toY(t) + 3} textAnchor="end" fill="#71717a" fontSize="9">{formatVal(t)}</text>
              </g>
            ))}
            {primaryData.map((d, i) => {
              const show = primaryData.length <= 12 || i % Math.ceil(primaryData.length / 12) === 0
              return show ? <text key={i} x={toX(i)} y={chartH - 4} textAnchor="middle" fill="#71717a" fontSize="8">{d.period}</text> : null
            })}
            {refLineY !== null && <line x1={padL} y1={refLineY} x2={chartW - padR} y2={refLineY} stroke="#71717a" strokeWidth="0.7" strokeDasharray="4 3" />}
            <path d={areaPath} fill="url(#areaGradEff)" />
            <path d={mainPath} fill="none" stroke="#10b981" strokeWidth="2" />
            <defs>
              <linearGradient id="areaGradEff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {primaryData.map((d, i) => (
              <circle key={i} cx={toX(i)} cy={toY(d.value)} r="3" fill="#10b981" stroke="#09090b" strokeWidth="1.5">
                <title>{`${d.period}: ${formatVal(d.value)} (${d.promoCount} promos)`}</title>
              </circle>
            ))}
            {overlays.map((overlay) => {
              const path = overlay.data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.value).toFixed(1)}`).join(" ")
              return (
                <g key={overlay.key}>
                  <path d={path} fill="none" stroke={overlay.color} strokeWidth="1.5" strokeDasharray={overlay.dash === "none" ? undefined : overlay.dash} opacity="0.85" />
                  {overlay.data.map((d, i) => (
                    <circle key={i} cx={toX(i)} cy={toY(d.value)} r="2" fill={overlay.color} opacity="0.85">
                      <title>{`${overlay.label} | ${d.period}: ${formatVal(d.value)}`}</title>
                    </circle>
                  ))}
                </g>
              )
            })}
          </svg>
        </CardContent>
      </Card>

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
              <div key={i} className={cn("p-3 rounded-lg border", insight.type === "positive" ? "bg-emerald-500/5 border-emerald-500/20" : insight.type === "warning" ? "bg-amber-500/5 border-amber-500/20" : "bg-red-500/5 border-red-500/20")}>
                <div className="flex items-start gap-2">
                  {insight.type === "positive" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" /> : insight.type === "warning" ? <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" /> : <TrendingDown className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />}
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
