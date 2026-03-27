"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Play, Sparkles, TrendingUp, ChevronRight, ArrowRight, CheckCircle2, Link2, Plus, Target, ShoppingCart, Calendar, Megaphone, Sun, Gift, ShoppingBag, Music, Trophy, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CommercialLogo } from "@/components/ui/platform-logos"
import type { TPOScreen } from "./promo-effectiveness"
import { allSkuNames, retailerOptions as sharedRetailers, mechanicOptions as sharedMechanics } from "../shared-sku-data"

interface SimulateForecastProps {
  onNavigate?: (screen: TPOScreen) => void
  onLaunchInitiative?: () => void
  onNavigateToFuelight?: () => void
}

// ---------- Config options ----------
const brands = [
  { value: "all", label: "All Brands" },
  { value: "cc-classic", label: "Coca-Cola Classic" },
  { value: "cc-zero", label: "Coca-Cola Zero" },
  { value: "diet-coke", label: "Diet Coke" },
  { value: "fanta", label: "Fanta" },
  { value: "sprite", label: "Sprite" },
]
const skuOptions = allSkuNames
const retailerOptions = [...sharedRetailers] as string[]
const mechanicOptions = [...sharedMechanics] as string[]
const periodOptions = [
  { value: "q2-2026", label: "Q2 2026 (Apr-Jun)" },
  { value: "q3-2026", label: "Q3 2026 (Jul-Sep)" },
  { value: "q4-2026", label: "Q4 2026 (Oct-Dec)" },
  { value: "h2-2026", label: "H2 2026 (Jul-Dec)" },
  { value: "fy-2027", label: "FY 2027" },
]
const objectiveOptions = [
  { value: "max-roi", label: "Maximise ROI" },
  { value: "max-volume", label: "Maximise Incremental Volume" },
  { value: "min-cannib", label: "Minimise Cannibalization" },
  { value: "balanced", label: "Balanced (ROI + Volume)" },
]
const channelOptions = [
  { value: "all", label: "All Channels" },
  { value: "modern-trade", label: "Modern Trade" },
  { value: "convenience", label: "Convenience" },
  { value: "impulse", label: "Impulse" },
]

// ---------- Simulated output ----------
interface PromoRecommendation {
  sku: string
  retailer: string
  mechanic: string
  depth: string
  weeks: string
  currentROI: number
  forecastROI: number
  incrVolume: string
  cannibPct: number
  confidence: string
}

const recommendations: PromoRecommendation[] = [
  { sku: "CC Zero 330ml", retailer: "Esselunga", mechanic: "TPR -15%", depth: "15%", weeks: "W22-W25", currentROI: 1.12, forecastROI: 1.68, incrVolume: "+42K L", cannibPct: 8.2, confidence: "High" },
  { sku: "CC Classic 500ml", retailer: "Conad", mechanic: "Multibuy 2 for \u20ac2", depth: "22%", weeks: "W24-W27", currentROI: 0.98, forecastROI: 1.45, incrVolume: "+38K L", cannibPct: 12.1, confidence: "High" },
  { sku: "Fanta Orange 330ml", retailer: "Carrefour IT", mechanic: "Display + TPR -10%", depth: "10%", weeks: "W22-W24", currentROI: 1.24, forecastROI: 1.82, incrVolume: "+31K L", cannibPct: 5.4, confidence: "High" },
  { sku: "CC Classic 1.5L", retailer: "Coop Italia", mechanic: "\u20ac1 PMP", depth: "18%", weeks: "W26-W29", currentROI: 0.88, forecastROI: 1.22, incrVolume: "+22K L", cannibPct: 18.7, confidence: "Medium" },
  { sku: "Diet Coke 500ml", retailer: "PAM", mechanic: "Meal Deal", depth: "12%", weeks: "W23-W26", currentROI: 0.72, forecastROI: 1.08, incrVolume: "+15K L", cannibPct: 22.3, confidence: "Medium" },
  { sku: "Sprite 330ml", retailer: "Despar", mechanic: "TPR -12%", depth: "12%", weeks: "W28-W30", currentROI: 0.91, forecastROI: 1.15, incrVolume: "+12K L", cannibPct: 14.5, confidence: "Medium" },
  { sku: "CC Zero 1.5L", retailer: "Eurospin", mechanic: "BOGOF", depth: "50%", weeks: "W25-W26", currentROI: 0.65, forecastROI: 0.92, incrVolume: "+8K L", cannibPct: 28.1, confidence: "Low" },
  { sku: "CC Classic 2L", retailer: "Carrefour IT", mechanic: "TPR -12%", depth: "12%", weeks: "W23-W26", currentROI: 0.82, forecastROI: 1.18, incrVolume: "+18K L", cannibPct: 14.2, confidence: "Medium" },
  { sku: "CC Classic 6x330ml", retailer: "Esselunga", mechanic: "Multibuy 2 for \u20ac7", depth: "12.5%", weeks: "W24-W28", currentROI: 1.08, forecastROI: 1.52, incrVolume: "+28K L", cannibPct: 10.0, confidence: "High" },
  { sku: "CC Zero 6x330ml", retailer: "Conad", mechanic: "Display + TPR -10%", depth: "10%", weeks: "W22-W25", currentROI: 0.95, forecastROI: 1.38, incrVolume: "+22K L", cannibPct: 15.2, confidence: "Medium" },
  { sku: "Fanta Orange 2L", retailer: "Coop Italia", mechanic: "\u20ac1 PMP", depth: "20%", weeks: "W26-W29", currentROI: 0.78, forecastROI: 1.12, incrVolume: "+14K L", cannibPct: 12.0, confidence: "Medium" },
  { sku: "Diet Coke 1.5L", retailer: "Lidl IT", mechanic: "TPR -10%", depth: "10%", weeks: "W24-W27", currentROI: 0.68, forecastROI: 0.98, incrVolume: "+10K L", cannibPct: 16.0, confidence: "Low" },
  { sku: "Sprite 1.5L", retailer: "Carrefour IT", mechanic: "Multibuy 2 for \u20ac3", depth: "16%", weeks: "W25-W28", currentROI: 0.72, forecastROI: 1.05, incrVolume: "+8K L", cannibPct: 14.0, confidence: "Low" },
]

// Forecast ROI over weeks
const forecastWeeks = ["W21","W22","W23","W24","W25","W26","W27","W28","W29","W30"]
const forecastBaseline = [1.02, 1.02, 1.02, 1.02, 1.02, 1.02, 1.02, 1.02, 1.02, 1.02]
const forecastOptimized = [1.02, 1.28, 1.52, 1.61, 1.55, 1.48, 1.42, 1.38, 1.22, 1.08]

// ---------- Component ----------
export function TPOSimulateForecast({ onNavigate, onLaunchInitiative, onNavigateToFuelight }: SimulateForecastProps) {
  const [hasRun, setHasRun] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState("diet-coke") // STORYLINE: Pre-select Diet Coke
  // STORYLINE: Pre-select the bad performing Diet Coke SKUs from Trade v Client Matrix
  const [selectedSkus, setSelectedSkus] = useState<string[]>([
    "Diet Coke 330ml",
    "Diet Coke 500ml", 
    "Diet Coke 1.25L",
    "Diet Coke 1.5L",
    "Diet Coke 1.75L",
    "Diet Coke 2L"
  ])
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>(["All Retailers"])
  const [selectedMechanic, setSelectedMechanic] = useState("Price Cut") // STORYLINE: Price Cut mechanic
  const [selectedPeriod, setSelectedPeriod] = useState("q3-2026")
  const [objective, setObjective] = useState("max-roi")
  const [channel, setChannel] = useState("all")
  const [budgetCap, setBudgetCap] = useState("180")
  const [minROI, setMinROI] = useState("1.2")
  const [initiativeMode, setInitiativeMode] = useState<"new" | "existing" | null>(null)
  
  // Fuelight Import Modal state
  const [showFuelightImportModal, setShowFuelightImportModal] = useState(false)

  const toggleSku = (sku: string) => {
    setSelectedSkus(prev => prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku])
  }
  const toggleRetailer = (r: string) => {
    if (r === "All Retailers") { setSelectedRetailers(["All Retailers"]); return }
    setSelectedRetailers(prev => {
      const next = prev.filter(x => x !== "All Retailers")
      return next.includes(r) ? next.filter(x => x !== r) : [...next, r]
    })
  }

  // Chart dims
  const cW = 700, cH = 200, pL = 50, pR = 15, pT = 12, pB = 25
  const plotW = cW - pL - pR, plotH = cH - pT - pB
  const minY = 0.5, maxY = 1.8, rangeY = maxY - minY
  const toX = (i: number) => pL + (i / (forecastWeeks.length - 1)) * plotW
  const toY = (v: number) => pT + plotH - ((v - minY) / rangeY) * plotH

  const baselinePath = forecastBaseline.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ")
  const optimizedPath = forecastOptimized.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ")
  const optimizedArea = optimizedPath + ` L${toX(forecastWeeks.length - 1).toFixed(1)},${toY(minY).toFixed(1)} L${pL},${toY(minY).toFixed(1)} Z`

  const yTicks = [0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8]

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button onClick={() => onNavigate?.("promo-evolution")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Evolution</button>
        <button onClick={() => onNavigate?.("promo-performance")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Performance</button>
        <button onClick={() => onNavigate?.("trade-client-matrix")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Trade vs Client Matrix</button>
        <button onClick={() => onNavigate?.("performance-by-lever")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Performance by Lever</button>
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">{"Promotion Optimizer"}</button>
      </div>

      {!hasRun ? (
        /* ===== CONFIG VIEW (Fuelight optimizer style) ===== */
        <div className="flex flex-col items-center pt-4">
          <div className="max-w-2xl w-full space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                  <CommercialLogo size="md" />
                </div>
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold text-zinc-100">Promotion Simulator & Optimizer</h1>
              <p className="text-xs text-zinc-500 mt-1">Configure simulation parameters to find the optimal promo plan by SKU, retailer, and mechanic</p>
            </div>

            {/* Config Card */}
            <Card className="bg-zinc-900/50 border-zinc-800/50">
              <CardContent className="p-6 space-y-5">
                {/* Row 1: Brand + Period + Objective */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Brand</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">{brands.map(b => <SelectItem key={b.value} value={b.value} className="text-zinc-200 text-xs">{b.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Planning Period</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">{periodOptions.map(p => <SelectItem key={p.value} value={p.value} className="text-zinc-200 text-xs">{p.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Objective</Label>
                    <Select value={objective} onValueChange={setObjective}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">{objectiveOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: SKUs multi-select */}
                <div>
                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">SKUs to Optimize ({selectedSkus.length} selected)</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {skuOptions.map(sku => (
                      <button key={sku} onClick={() => toggleSku(sku)} className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border", selectedSkus.includes(sku) ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-700")}>
                        {sku}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 3: Retailers multi-select */}
                <div>
                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Retailers ({selectedRetailers.join(", ")})</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {retailerOptions.map(r => (
                      <button key={r} onClick={() => toggleRetailer(r)} className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors border", selectedRetailers.includes(r) ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-700")}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 4: Mechanic + Channel + Budget + Min ROI */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Mechanic Preference</Label>
                    <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">{mechanicOptions.map(m => <SelectItem key={m} value={m} className="text-zinc-200 text-xs">{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Channel</Label>
                    <Select value={channel} onValueChange={setChannel}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">{channelOptions.map(c => <SelectItem key={c.value} value={c.value} className="text-zinc-200 text-xs">{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Budget Cap (€K)</Label>
                    <Input value={budgetCap} onChange={e => setBudgetCap(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs h-9" />
                  </div>
                  <div>
                    <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Min ROI Threshold</Label>
                    <Input value={minROI} onChange={e => setMinROI(e.target.value)} className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs h-9" />
                  </div>
                </div>

                {/* Run button */}
                <Button onClick={() => setHasRun(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 text-sm font-semibold mt-2">
                  <Play className="h-4 w-4 mr-2" />
                  Run Promotion Simulation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* ===== RESULTS VIEW ===== */
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-zinc-100">Simulation Results</h1>
              <p className="text-[10px] text-zinc-500 mt-0.5">{selectedSkus.length} SKUs -- {selectedRetailers.join(", ")} -- {periodOptions.find(p => p.value === selectedPeriod)?.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setHasRun(false)} className="px-3 py-1.5 rounded text-[10px] font-medium text-zinc-400 border border-zinc-800 hover:text-zinc-200 transition-colors">Edit Parameters</button>
            </div>
          </div>

          {/* KPI summary cards */}
          <div className="grid grid-cols-4 gap-3">
            {[{ label: "Portfolio ROI", value: "1.42x", sub: "+0.34x vs current", positive: true },
              { label: "Total Incr. Volume", value: "+168K L", sub: "across 7 promos", positive: true },
              { label: "Avg Cannibalization", value: "15.6%", sub: "-3.2pp vs last period", positive: true },
              { label: "Est. Budget Required", value: "€218K", sub: "within €250K cap", positive: true }].map((kpi, i) => (
              <Card key={i} className="bg-zinc-900/50 border-zinc-800/50">
                <CardContent className="p-3">
                  <p className="text-[10px] text-zinc-500">{kpi.label}</p>
                  <p className="text-lg font-bold text-zinc-100 mt-0.5">{kpi.value}</p>
                  <p className={cn("text-[10px] mt-0.5", kpi.positive ? "text-emerald-400" : "text-red-400")}>{kpi.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Forecasted ROI chart */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Forecasted ROI Trajectory</h3>
                <div className="ml-auto flex items-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-zinc-600 rounded" /> Current baseline</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 rounded" /> Optimized plan</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {yTicks.map(t => (
                  <g key={t}>
                    <line x1={pL} y1={toY(t)} x2={cW - pR} y2={toY(t)} stroke="#27272a" strokeWidth="0.5" />
                    <text x={pL - 6} y={toY(t) + 3} textAnchor="end" fill="#71717a" fontSize="9">{t.toFixed(1)}x</text>
                  </g>
                ))}
                {forecastWeeks.map((w, i) => <text key={i} x={toX(i)} y={cH - 5} textAnchor="middle" fill="#71717a" fontSize="8">{w}</text>)}
                {/* 1.0 ref line */}
                <line x1={pL} y1={toY(1.0)} x2={cW - pR} y2={toY(1.0)} stroke="#71717a" strokeWidth="0.7" strokeDasharray="4 3" />
                {/* Optimized area */}
                <defs>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={optimizedArea} fill="url(#optGrad)" />
                {/* Baseline */}
                <path d={baselinePath} fill="none" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" />
                {/* Optimized */}
                <path d={optimizedPath} fill="none" stroke="#10b981" strokeWidth="2" />
                {forecastOptimized.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#10b981" stroke="#09090b" strokeWidth="1.5" />)}
              </svg>
            </CardContent>
          </Card>

          {/* Recommendations table */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Recommended Promotions</h3>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px]">{recommendations.length} promos</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {["SKU", "Retailer", "Mechanic", "Weeks", "Current ROI", "Forecast ROI", "Incr. Volume", "Cannib %", "Confidence"].map(h => (
                        <th key={h} className="py-2 px-2 text-left text-zinc-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((r, i) => (
                      <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/10 transition-colors">
                        <td className="py-2.5 px-2 text-zinc-200 font-medium">{r.sku}</td>
                        <td className="py-2.5 px-2 text-zinc-300">{r.retailer}</td>
                        <td className="py-2.5 px-2 text-zinc-300">{r.mechanic}</td>
                        <td className="py-2.5 px-2 text-zinc-400 font-mono">{r.weeks}</td>
                        <td className="py-2.5 px-2">
                          <span className={cn("font-mono", r.currentROI >= 1 ? "text-emerald-400" : "text-red-400")}>{r.currentROI.toFixed(2)}x</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={cn("font-mono font-semibold", r.forecastROI >= 1.2 ? "text-emerald-400" : r.forecastROI >= 1 ? "text-amber-400" : "text-red-400")}>{r.forecastROI.toFixed(2)}x</span>
                          <span className="text-emerald-500 ml-1 text-[9px]">+{(r.forecastROI - r.currentROI).toFixed(2)}</span>
                        </td>
                        <td className="py-2.5 px-2 text-emerald-400 font-mono">{r.incrVolume}</td>
                        <td className="py-2.5 px-2">
                          <span className={cn("font-mono", r.cannibPct < 10 ? "text-emerald-400" : r.cannibPct < 20 ? "text-amber-400" : "text-red-400")}>{r.cannibPct}%</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <Badge className={cn("text-[8px] py-0 h-4", r.confidence === "High" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : r.confidence === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-red-500/15 text-red-300 border-red-500/30")}>{r.confidence}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI summary */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">AI Optimization Summary</h3>
              </div>
              <div className="space-y-2 text-[11px] text-zinc-300 leading-relaxed">
                <p>The optimized promo plan delivers a <span className="text-emerald-400 font-semibold">1.42x portfolio ROI</span> vs. the 1.08x current baseline, generating <span className="text-emerald-400 font-semibold">+168K L incremental volume</span> within the <span className="text-zinc-100 font-semibold">€218K</span> budget (vs. €250K cap).</p>
                <p>Key recommendations: Lead with <span className="text-zinc-100">CC Zero 330ml TPR at Esselunga</span> (highest confidence, 1.68x ROI) and <span className="text-zinc-100">Fanta Orange 330ml Display+TPR at Carrefour IT</span> (strongest category expansion at 38%). Avoid BOGOF on CC Zero 1.5L at Eurospin where cannibalization reaches 28% and ROI stays below 1.0x.</p>
                <p>Timing-wise, concentrate promos in W22-W27 to align with the summer media campaign window for maximum synergy lift.</p>
              </div>
            </CardContent>
          </Card>

          {/* Media Calendar Timeline */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Optimal Moments for Promotion Activation</h3>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px]">Q3 2026</Badge>
              </div>
              <p className="text-[10px] text-zinc-500 mb-4">Align promotions with media flights, seasonal peaks, and cultural moments to maximise effectiveness</p>

              {/* Timeline */}
              {(() => {
                const weeks = ["W22","W23","W24","W25","W26","W27","W28","W29","W30"]
                const months = [
                  { label: "June", start: 0, span: 4 },
                  { label: "July", start: 4, span: 5 },
                ]

                // Media flight windows
                const mediaFlights = [
                  { label: "Summer Campaign TV + Digital", start: 0, end: 4, color: "bg-blue-500", textColor: "text-blue-300", borderColor: "border-blue-500/40" },
                  { label: "CC Zero Social Push", start: 2, end: 5, color: "bg-cyan-500", textColor: "text-cyan-300", borderColor: "border-cyan-500/40" },
                  { label: "Fanta Festival Activation", start: 5, end: 7, color: "bg-orange-500", textColor: "text-orange-300", borderColor: "border-orange-500/40" },
                ]

                // Cultural / seasonal events
                const events = [
                  { label: "Euro 2026 Knockout", week: 1, icon: Trophy, color: "text-amber-400", bgColor: "bg-amber-500/15" },
                  { label: "Summer Solstice", week: 2, icon: Sun, color: "text-yellow-400", bgColor: "bg-yellow-500/15" },
                  { label: "Festa della Repubblica", week: 0, icon: Gift, color: "text-red-400", bgColor: "bg-red-500/15" },
                  { label: "Back-to-Beach Peak", week: 4, icon: ShoppingBag, color: "text-emerald-400", bgColor: "bg-emerald-500/15" },
                  { label: "Music Festivals", week: 6, icon: Music, color: "text-purple-400", bgColor: "bg-purple-500/15" },
                ]

                // Recommended promo activations (from simulation results)
                const promoActivations = [
                  { sku: "CC Zero 330ml", retailer: "Esselunga", start: 0, end: 3, roi: 1.68, color: "bg-emerald-500" },
                  { sku: "CC Classic 500ml", retailer: "Conad", start: 2, end: 5, roi: 1.45, color: "bg-emerald-500" },
                  { sku: "Fanta Orange 330ml", retailer: "Carrefour IT", start: 0, end: 2, roi: 1.82, color: "bg-emerald-500" },
                  { sku: "CC Classic 1.5L", retailer: "Coop Italia", start: 4, end: 7, roi: 1.22, color: "bg-amber-500" },
                  { sku: "Diet Coke 500ml", retailer: "PAM", start: 1, end: 4, roi: 1.08, color: "bg-amber-500" },
                ]

                // Synergy score per week (how well promos align with media + events)
                const synergyScores = [78, 92, 95, 88, 72, 68, 74, 60, 52]

                const colW = `${100 / weeks.length}%`

                return (
                  <div className="space-y-3">
                    {/* Week headers with month grouping */}
                    <div className="relative">
                      {/* Month labels */}
                      <div className="flex mb-1">
                        {months.map(m => (
                          <div key={m.label} style={{ width: `${(m.span / weeks.length) * 100}%`, marginLeft: m.start === 0 ? "0" : undefined }} className="text-[9px] font-medium text-zinc-400 text-center">
                            {m.label}
                          </div>
                        ))}
                      </div>
                      {/* Week columns */}
                      <div className="flex">
                        {weeks.map(w => (
                          <div key={w} style={{ width: colW }} className="text-center text-[9px] font-mono text-zinc-500 py-1 border-b border-zinc-800">
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 1: Synergy Score Heatmap */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wide w-28">Synergy Score</span>
                      </div>
                      <div className="flex gap-0.5">
                        {synergyScores.map((score, i) => (
                          <div
                            key={i}
                            style={{ width: colW }}
                            className={cn(
                              "h-7 rounded-sm flex items-center justify-center text-[10px] font-bold transition-colors",
                              score >= 90 ? "bg-emerald-500/30 text-emerald-300" :
                              score >= 75 ? "bg-emerald-500/15 text-emerald-400" :
                              score >= 60 ? "bg-amber-500/15 text-amber-400" :
                              "bg-zinc-800/50 text-zinc-500"
                            )}
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 2: Media Flights */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Megaphone className="h-3 w-3 text-blue-400" />
                        <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wide">Media Flights</span>
                      </div>
                      <div className="space-y-1">
                        {mediaFlights.map((flight, i) => (
                          <div key={i} className="relative h-6 flex">
                            {weeks.map((_, wi) => (
                              <div key={wi} style={{ width: colW }} className="h-full" />
                            ))}
                            <div
                              className={cn("absolute h-6 rounded border flex items-center px-2 overflow-hidden", flight.borderColor)}
                              style={{
                                left: `${(flight.start / weeks.length) * 100}%`,
                                width: `${((flight.end - flight.start + 1) / weeks.length) * 100}%`,
                                background: `linear-gradient(90deg, ${flight.color.replace("bg-", "").replace("-500", "")}15, ${flight.color.replace("bg-", "").replace("-500", "")}08)`,
                              }}
                            >
                              <span className={cn("text-[9px] font-medium whitespace-nowrap", flight.textColor)}>{flight.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Row 3: Cultural / Seasonal Events */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Gift className="h-3 w-3 text-red-400" />
                        <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wide">Cultural & Seasonal Moments</span>
                      </div>
                      <div className="relative h-7 flex">
                        {weeks.map((_, wi) => (
                          <div key={wi} style={{ width: colW }} className="h-full" />
                        ))}
                        {events.map((evt, i) => {
                          const Icon = evt.icon
                          return (
                            <div
                              key={i}
                              className={cn("absolute top-0 flex items-center gap-1 rounded-full px-2 py-0.5 border border-zinc-800", evt.bgColor)}
                              style={{ left: `${(evt.week / weeks.length) * 100 + 100 / weeks.length / 4}%` }}
                            >
                              <Icon className={cn("h-2.5 w-2.5 flex-shrink-0", evt.color)} />
                              <span className={cn("text-[8px] font-medium whitespace-nowrap", evt.color)}>{evt.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Row 4: Recommended Promo Activations */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Target className="h-3 w-3 text-emerald-400" />
                        <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wide">Recommended Promo Windows</span>
                      </div>
                      <div className="space-y-1">
                        {promoActivations.map((promo, i) => (
                          <div key={i} className="relative h-7 flex">
                            {weeks.map((_, wi) => (
                              <div key={wi} style={{ width: colW }} className="h-full border-r border-zinc-800/20" />
                            ))}
                            <div
                              className={cn("absolute h-7 rounded flex items-center px-2 gap-1.5 overflow-hidden border",
                                promo.roi >= 1.4 ? "border-emerald-500/30" : "border-amber-500/30"
                              )}
                              style={{
                                left: `${(promo.start / weeks.length) * 100}%`,
                                width: `${((promo.end - promo.start + 1) / weeks.length) * 100}%`,
                                background: promo.roi >= 1.4
                                  ? "linear-gradient(90deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))"
                                  : "linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
                              }}
                            >
                              <span className="text-[9px] text-zinc-200 font-medium whitespace-nowrap">{promo.sku}</span>
                              <span className="text-[8px] text-zinc-500 whitespace-nowrap">@ {promo.retailer}</span>
                              <span className={cn("text-[8px] font-bold ml-auto whitespace-nowrap", promo.roi >= 1.4 ? "text-emerald-400" : "text-amber-400")}>{promo.roi.toFixed(2)}x</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-3 rounded-sm bg-emerald-500/30" />
                        <span className="text-[9px] text-zinc-500">High synergy (90+)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-3 rounded-sm bg-emerald-500/15" />
                        <span className="text-[9px] text-zinc-500">Good synergy (75-89)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-3 rounded-sm bg-amber-500/15" />
                        <span className="text-[9px] text-zinc-500">Moderate (60-74)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-3 rounded-sm bg-zinc-800/50" />
                        <span className="text-[9px] text-zinc-500">{'Low (<60)'}</span>
                      </div>
                      <div className="ml-auto text-[9px] text-zinc-500 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        AI-recommended windows based on media overlap + seasonal demand
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Initiative Actions */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Convert to Initiative</h3>
                <p className="text-[10px] text-zinc-500">Launch as a tracked initiative or link to an existing one</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => { setInitiativeMode("new"); onLaunchInitiative?.() }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Create New Initiative
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setInitiativeMode("existing")}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs h-9"
                >
                  <Link2 className="h-3.5 w-3.5 mr-1.5" />
                  Link to Existing Initiative
                </Button>
                {initiativeMode === "existing" && (
                  <div className="flex items-center gap-2 ml-2">
                    <Select defaultValue="init-1">
                      <SelectTrigger className="h-8 w-[220px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="init-1" className="text-zinc-200 text-xs">Summer Promo Activation 2026</SelectItem>
                        <SelectItem value="init-2" className="text-zinc-200 text-xs">CC Zero Growth Plan Q3</SelectItem>
                        <SelectItem value="init-3" className="text-zinc-200 text-xs">Fanta Relaunch Modern Trade</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] h-7 px-3">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Link
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Import to Fuelight */}
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <Button 
                  onClick={() => setShowFuelightImportModal(true)}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 hover:border-amber-500/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Simulation into Fuelight
                  <Sparkles className="h-3 w-3 ml-2 text-amber-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fuelight Import Modal - Shows all 3 simulations */}
      {showFuelightImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Import to Fuelight</h3>
              </div>
              <button onClick={() => setShowFuelightImportModal(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">Import all RGM simulations into Fuelight for comprehensive optimization across all investment areas.</p>
                
                {/* All 3 Simulations Summary */}
                <div className="space-y-3">
                  {/* Pricing Simulation */}
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">Pricing</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5">Ready</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Citrus/Fruity price increase: Sprite & Fanta SKUs (+4% revenue impact)</p>
                  </div>
                  
                  {/* Assortment & Mix Simulation */}
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">Assortment & Mix</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5">Ready</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Delist tail SKUs, expand 330ml in Convenience, HoReCa coverage (+3% volume)</p>
                  </div>
                  
                  {/* Promotion Simulation - Current */}
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">Promotion</span>
                      </div>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">Active Simulation</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Diet Coke promo optimization: 30%+ price cuts, 2-week duration (+0.50x ROI uplift)</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-amber-300 font-medium">All 3 RGM simulations ready for Fuelight</p>
                      <p className="text-[9px] text-zinc-400 mt-0.5">Combined impact: +4% pricing, +3% mix optimization, +8% promo ROI improvement</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFuelightImportModal(false)}
                    className="flex-1 border-zinc-700 text-zinc-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowFuelightImportModal(false)
                      onNavigateToFuelight?.()
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Continue to Fuelight
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
