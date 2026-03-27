"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Play, Sparkles, TrendingUp, CheckCircle2, Link2, Plus, Target, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PAMScreen } from "./assortment-productivity"
import { allSkuNames, retailerOptions as sharedRetailers } from "../shared-sku-data"

interface SimulateForecastProps {
  onNavigate?: (screen: PAMScreen) => void
  onLaunchInitiative?: () => void
}

const tabs: { id: PAMScreen; label: string }[] = [
  { id: "assortment-productivity", label: "Assortment Productivity" },
  { id: "adjacency-whitespace", label: "Adjacency & Whitespace" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

const scenarioTypes = [
  { value: "delist", label: "SKU Delist / Rationalisation" },
  { value: "mix-shift", label: "Channel Mix Shift" },
  { value: "new-listing", label: "New SKU Listing" },
  { value: "assort-reset", label: "Full Assortment Reset" },
  { value: "facing-realloc", label: "Facing Reallocation" },
]
const skuOptions = allSkuNames
const channelOptions = ["All Channels","Convenience","Modern Trade","Ecommerce","On-Premise"]
const retailerOptions = [...sharedRetailers] as string[]
const periodOptions = [{ value: "q2-2026", label: "Q2 2026" },{ value: "q3-2026", label: "Q3 2026" },{ value: "q4-2026", label: "Q4 2026" },{ value: "h2-2026", label: "H2 2026" },{ value: "fy-2027", label: "FY 2027" }]

type ResultRow = { sku: string; action: string; volDelta: string; revDelta: string; gpDelta: string; mixImpact: string; confidence: string; recommendation: string }

const mockResults: ResultRow[] = [
  { sku: "Brand C 500ml", action: "Delist (bottom 30%)", volDelta: "-4.2K L", revDelta: "-\u00a3180K", gpDelta: "-\u00a350K", mixImpact: "+0.3pp margin", confidence: "High", recommendation: "Delist from bottom 30% stores -- reallocate facing to Brand D 330ml" },
  { sku: "Brand A Zero 2L", action: "Expand to 70% dist.", volDelta: "+14.6%", revDelta: "+\u00a3310K", gpDelta: "+\u00a362K", mixImpact: "-0.1pp margin", confidence: "Medium", recommendation: "Only 58% WD -- convenience gap addressable with targeted listing" },
  { sku: "Brand D 330ml", action: "Expand to 85% dist.", volDelta: "+9.2K L", revDelta: "+\u00a3680K", gpDelta: "+\u00a3240K", mixImpact: "+0.4pp margin", confidence: "Medium", recommendation: "Strong ROS justifies distribution push in convenience" },
  { sku: "Brand B 500ml", action: "Reduce facing by 1", volDelta: "-2.8%", revDelta: "-\u00a3120K", gpDelta: "-\u00a338K", mixImpact: "+0.1pp margin", confidence: "Low", recommendation: "Facing reallocation to Brand A Zero 500ml yields net +\u00a352K GP" },
  { sku: "Brand A Classic 2L", action: "Maintain dist.", volDelta: "+1.2%", revDelta: "+\u00a3140K", gpDelta: "+\u00a325K", mixImpact: "-0.2pp margin", confidence: "Medium", recommendation: "Hold distribution at 85% -- heavy cannib on 1.5L if expanded" },
  { sku: "Brand A Classic 6x330ml", action: "Increase facing +1", volDelta: "+8.4%", revDelta: "+\u00a3720K", gpDelta: "+\u00a3202K", mixImpact: "+0.2pp margin", confidence: "High", recommendation: "Multipack demand growing +3.4% -- capture weekend bulk-buy occasion" },
  { sku: "Brand D Orange 2L", action: "Review (low velocity)", volDelta: "-3.2%", revDelta: "-\u00a364K", gpDelta: "-\u00a312K", mixImpact: "+0.1pp margin", confidence: "Low", recommendation: "Lowest GP/store in Brand D range -- consider rationalisation in bottom 20% stores" },
  { sku: "Brand B 1.5L", action: "Delist (low stores)", volDelta: "-6.8K L", revDelta: "-\u00a3200K", gpDelta: "-\u00a340K", mixImpact: "+0.2pp margin", confidence: "Medium", recommendation: "Declining -3% with 16% cannib -- shift facings to Brand A Zero 1.5L" },
  { sku: "Brand C 1.5L", action: "Delist (bottom 40%)", volDelta: "-3.2K L", revDelta: "-\u00a396K", gpDelta: "-\u00a321K", mixImpact: "+0.1pp margin", confidence: "Medium", recommendation: "Weakest GP/store -- reallocate to Brand D 2L or multipack launch" },
  { sku: "Brand A Zero 6x330ml", action: "Add to conv. range", volDelta: "+5.2K L", revDelta: "+\u00a3280K", gpDelta: "+\u00a3108K", mixImpact: "+0.3pp margin", confidence: "High", recommendation: "Strong growth (8.2%) -- list in top 60% convenience stores" },
  { sku: "Brand D 6x330ml", action: "New listing", volDelta: "+8.8K L", revDelta: "+\u00a3420K", gpDelta: "+\u00a3145K", mixImpact: "+0.2pp margin", confidence: "Medium", recommendation: "Multipack whitespace -- address bulk-buy occasion in MT" },
]

const existingInitiatives = ["Assortment Reset Q3 2026", "Convenience Range Review", "Pricing Realignment Wave 2"]

// ---------- Component ----------

export function PAMSimulateForecast({ onNavigate, onLaunchInitiative }: SimulateForecastProps) {
  const [scenario, setScenario] = useState("delist")
  const [selectedSkus, setSelectedSkus] = useState<string[]>(["Brand A Zero 330ml", "Brand A Classic 500ml", "Brand C 500ml"])
  const [channel, setChannel] = useState("All Channels")
  const [retailer, setRetailer] = useState("All Retailers")
  const [period, setPeriod] = useState("q3-2026")
  const [priceAdj, setPriceAdj] = useState("")
  const [hasRun, setHasRun] = useState(false)
  const [showInitPanel, setShowInitPanel] = useState(false)

  const toggleSku = (s: string) => setSelectedSkus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  // Waterfall chart data
  const waterfallItems = [
    { label: "Baseline GP", value: 12.4, type: "base" as const },
    { label: "Price changes", value: 0.47, type: "positive" as const },
    { label: "Delist savings", value: 0.12, type: "positive" as const },
    { label: "Dist. expansion", value: 0.24, type: "positive" as const },
    { label: "Cannibalization", value: -0.18, type: "negative" as const },
    { label: "Volume loss", value: -0.09, type: "negative" as const },
    { label: "New GP", value: 12.96, type: "total" as const },
  ]
  const chartW = 600, chartH = 180, pad = 50
  const barW = 55, barGap = 25
  const maxVal = 14
  const toY = (v: number) => chartH - pad - (v / maxVal) * (chartH - 2 * pad)

  // Cumulative for waterfall
  let cum = 0
  const waterfallBars = waterfallItems.map(item => {
    if (item.type === "base") { cum = item.value; return { ...item, y0: 0, y1: item.value } }
    if (item.type === "total") { return { ...item, y0: 0, y1: item.value } }
    const y0 = cum; cum += item.value; return { ...item, y0, y1: cum }
  })

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav tabs */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "simulate-forecast" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Config */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-5 w-5 text-red-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100">Assortment & Mix Scenario Simulator</h2>
              <p className="text-[10px] text-zinc-500">Simulate SKU listings, delistings, facing changes, and channel mix shifts to optimize portfolio structure and shelf productivity</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Left: scenario + filters */}
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Scenario Type</Label>
                {scenarioTypes.map(s => (
                  <button key={s.value} onClick={() => setScenario(s.value)} className={cn("w-full text-left px-3 py-2 rounded-lg text-xs mb-1.5 border transition-colors", scenario === s.value ? "bg-red-500/10 text-red-300 border-red-500/30" : "text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700")}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Channel</Label>
                  <Select value={channel} onValueChange={setChannel}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">{channelOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Retailer</Label>
                  <Select value={retailer} onValueChange={setRetailer}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">{retailerOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Middle: SKU selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Select SKUs ({selectedSkus.length})</Label>
                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {skuOptions.map(s => (
                    <button key={s} onClick={() => toggleSku(s)} className={cn("px-2.5 py-1.5 rounded text-[10px] font-medium border transition-colors text-left", selectedSkus.includes(s) ? "bg-red-500/10 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {(scenario === "facing-realloc") && (
                <div>
                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Facing Change (+/-)</Label>
                  <Input placeholder="e.g. +1 or -2 facings" value={priceAdj} onChange={e => setPriceAdj(e.target.value)} className="bg-zinc-900 border-zinc-800 text-xs text-zinc-200" />
                </div>
              )}
            </div>

            {/* Right: summary + run */}
            <div className="flex flex-col justify-between">
              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 space-y-3">
                <p className="text-[10px] text-zinc-400">Configuration Summary</p>
                <div className="text-[10px] space-y-1">
                  <p className="text-zinc-300"><span className="text-zinc-500">Scenario:</span> {scenarioTypes.find(s => s.value === scenario)?.label}</p>
                  <p className="text-zinc-300"><span className="text-zinc-500">SKUs:</span> {selectedSkus.length} selected</p>
                  <p className="text-zinc-300"><span className="text-zinc-500">Channel:</span> {channel}</p>
                  <p className="text-zinc-300"><span className="text-zinc-500">Retailer:</span> {retailer}</p>
                  <p className="text-zinc-300"><span className="text-zinc-500">Period:</span> {periodOptions.find(p => p.value === period)?.label}</p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">{periodOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}</SelectContent>
                </Select>
                <Button onClick={() => setHasRun(true)} className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <Play className="h-4 w-4 mr-2" /> Run Simulation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasRun && (
        <>
          {/* Waterfall */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">GP Impact Waterfall</h3>
                  <p className="text-[10px] text-zinc-500">Decomposition of gross profit change from scenario actions</p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]">Net: +{"\u00a3"}0.56M GP</Badge>
              </div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-[180px]">
                {[0, 4, 8, 12].map(v => <g key={v}><line x1={pad} x2={chartW - pad} y1={toY(v)} y2={toY(v)} stroke="#27272a" strokeWidth="0.5" /><text x={pad - 4} y={toY(v) + 3} textAnchor="end" className="fill-zinc-600 text-[8px]">{"\u00a3"}{v}M</text></g>)}
                {waterfallBars.map((bar, i) => {
                  const x = pad + i * (barW + barGap)
                  const topY = toY(Math.max(bar.y0, bar.y1))
                  const botY = toY(Math.min(bar.y0, bar.y1))
                  const h = botY - topY
                  const fill = bar.type === "base" ? "#3b82f6" : bar.type === "total" ? "#3b82f6" : bar.type === "positive" ? "#22c55e" : "#ef4444"
                  return (
                    <g key={i}>
                      <rect x={x} y={topY} width={barW} height={Math.max(h, 2)} fill={fill} rx="2" opacity="0.7" />
                      <text x={x + barW / 2} y={topY - 4} textAnchor="middle" className="fill-zinc-300 text-[8px] font-mono">
                        {bar.type === "base" || bar.type === "total" ? `\u00a3${bar.value.toFixed(1)}M` : `${bar.value > 0 ? "+" : ""}\u00a3${bar.value.toFixed(2)}M`}
                      </text>
                      <text x={x + barW / 2} y={chartH - pad + 12} textAnchor="middle" className="fill-zinc-500 text-[7px]">{bar.label}</text>
                    </g>
                  )
                })}
              </svg>
            </CardContent>
          </Card>

          {/* SKU results table */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-3">SKU-Level Impact & Recommendations</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead><tr className="border-b border-zinc-800">
                    {["SKU","Action","Vol \u0394","Rev \u0394","GP \u0394","Mix Impact","Conf.","Recommendation"].map(h => (
                      <th key={h} className="py-2 px-2 text-left text-zinc-500 font-medium">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {mockResults.map((r, i) => (
                      <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20">
                        <td className="py-2 px-2 text-zinc-200 font-medium">{r.sku}</td>
                        <td className="py-2 px-2 text-zinc-300">{r.action}</td>
                        <td className={cn("py-2 px-2 font-mono", r.volDelta.startsWith("+") || r.volDelta.includes("+") ? "text-emerald-400" : "text-red-400")}>{r.volDelta}</td>
                        <td className={cn("py-2 px-2 font-mono", r.revDelta.startsWith("+") ? "text-emerald-400" : "text-red-400")}>{r.revDelta}</td>
                        <td className={cn("py-2 px-2 font-mono font-bold", r.gpDelta.startsWith("+") ? "text-emerald-400" : "text-red-400")}>{r.gpDelta}</td>
                        <td className={cn("py-2 px-2 font-mono", r.mixImpact.startsWith("+") ? "text-emerald-400" : "text-amber-400")}>{r.mixImpact}</td>
                        <td className="py-2 px-2"><Badge className={cn("text-[8px] py-0 h-4", r.confidence === "High" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : r.confidence === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-red-500/15 text-red-300 border-red-500/30")}>{r.confidence}</Badge></td>
                        <td className="py-2 px-2 text-zinc-400 max-w-[200px]">{r.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Initiative linking */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-semibold text-zinc-100">Link to Initiative</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => setShowInitPanel(!showInitPanel)}>
                    <Link2 className="h-3.5 w-3.5 mr-1.5" /> Link Existing
                  </Button>
                  <Button size="sm" className="text-xs bg-red-600 hover:bg-red-700 text-white" onClick={onLaunchInitiative}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> New Initiative
                  </Button>
                </div>
              </div>
              {showInitPanel && (
                <div className="mt-3 space-y-1.5">
                  {existingInitiatives.map(init => (
                    <button key={init} className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-300 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />{init}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
