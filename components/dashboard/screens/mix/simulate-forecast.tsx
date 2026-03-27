"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Zap, Play, CheckCircle2, Link2, Plus, Target, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Upload, Sparkles, X, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MixScreen } from "./mix-performance"
import { allSkuNames, retailerOptions as sharedRetailers } from "../shared-sku-data"

interface SimulateForecastProps {
  onNavigate?: (screen: MixScreen) => void
  onLaunchInitiative?: () => void
  onNavigateToArtemis?: () => void
  onNavigateToPromotion?: () => void
}

const tabs: { id: MixScreen; label: string }[] = [
  { id: "market-opportunities", label: "Overview" },
  { id: "portfolio-quality", label: "Portfolio Quality Analysis" },
  { id: "assortment-share", label: "Assortment Share" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

const scenarioTypes = [
  { value: "mix-shift", label: "Channel Mix Shift" },
  { value: "pack-trade-up", label: "Pack Size Trade-Up" },
  { value: "facing-realloc", label: "Facing Reallocation" },
  { value: "delist", label: "SKU Rationalisation" },
]

// ALL SKUs available for selection
const skuOptions = allSkuNames

// Pre-selected SKUs based on storyline findings:
// - 8 underperformers from PQA (Brand B 1.5L, Brand C 500ml, etc.)
// - Brand A 500ml to 330ml shift opportunity
const storylinePreselectedSkus = [
  // Underperformers flagged for delist
  "Brand B 1.5L",
  "Brand C 500ml", 
  "Brand C 1.25L",
  "Brand C 1.75L",
  "Brand D 1.25L",
  "Brand D 1.75L",
  "Brand E 1.75L",
  "Brand E 2L",
  // Brand A pack size shift opportunity
  "Brand A 500ml",
  "Brand A 330ml",
]

const channelOptions = ["All Channels", "Convenience", "Modern Trade", "Ecommerce", "On-Premise"]
const retailerOptions = [...sharedRetailers] as string[]
const periodOptions = [{ value: "q2-2026", label: "Q2 2026" }, { value: "q3-2026", label: "Q3 2026" }, { value: "q4-2026", label: "Q4 2026" }]

// Action items with adjustable values
interface ActionItem {
  id: string
  sku: string
  actionType: "expand" | "reduce" | "add-facing" | "delist"
  metric: string
  baseValue: number
  minValue: number
  maxValue: number
  unit: string
  confidence: "High" | "Medium" | "Low"
}

// Storyline-aligned actions based on PQA findings
const baseActions: ActionItem[] = [
  // Pack size shift: reduce 500ml, expand 330ml in Convenience
  { id: "1", sku: "Brand A 330ml", actionType: "expand", metric: "WD in Convenience", baseValue: 15, minValue: 0, maxValue: 25, unit: "%", confidence: "High" },
  { id: "2", sku: "Brand A 500ml", actionType: "reduce", metric: "Facing reduction", baseValue: 2, minValue: 0, maxValue: 4, unit: " facings", confidence: "High" },
  // Delist underperformers
  { id: "3", sku: "Brand B 1.5L", actionType: "delist", metric: "Delist from bottom stores", baseValue: 30, minValue: 0, maxValue: 50, unit: "%", confidence: "High" },
  { id: "4", sku: "Brand C 500ml", actionType: "delist", metric: "Delist from bottom stores", baseValue: 25, minValue: 0, maxValue: 40, unit: "%", confidence: "Medium" },
  { id: "5", sku: "Brand D 1.75L", actionType: "delist", metric: "Delist from bottom stores", baseValue: 40, minValue: 0, maxValue: 60, unit: "%", confidence: "High" },
  { id: "6", sku: "Brand C 330ml", actionType: "add-facing", metric: "Add facings (Sleeper activation)", baseValue: 1, minValue: 0, maxValue: 3, unit: "", confidence: "Medium" },
]

// Calculate impact based on action values - aligned to storyline
function calculateImpact(actions: { id: string; value: number }[]) {
  let totalVol = 0, totalRev = 0, totalGP = 0, pplChange = 0
  
  actions.forEach(a => {
    const base = baseActions.find(b => b.id === a.id)
    if (!base) return
    const ratio = a.value / (base.baseValue || 1)
    
    if (base.actionType === "expand") {
      // 330ml expansion in Convenience drives volume and margin
      totalVol += ratio * 8.5
      totalRev += ratio * 380
      totalGP += ratio * 145
      pplChange += ratio * 0.12
    } else if (base.actionType === "add-facing") {
      // Adding facings to sleepers activates volume
      totalVol += ratio * 5.2
      totalRev += ratio * 210
      totalGP += ratio * 78
      pplChange += ratio * 0.04
    } else if (base.actionType === "reduce") {
      // Reducing facings on 500ml frees shelf space
      totalVol -= ratio * 2.8
      totalRev -= ratio * 95
      totalGP += ratio * 22 // Margin improves due to mix shift
      pplChange += ratio * 0.08
    } else if (base.actionType === "delist") {
      // Delisting underperformers improves mix quality
      totalVol -= ratio * 1.2
      totalRev -= ratio * 45
      totalGP += ratio * 35 // Margin improves significantly
      pplChange += ratio * 0.06
    }
  })
  
  return { totalVol, totalRev, totalGP, pplChange }
}

// Impact on other items
interface ImpactItem {
  sku: string
  impact: string
  direction: "positive" | "negative" | "neutral"
  detail: string
}

// Storyline-aligned impacts on other SKUs
const otherImpacts: ImpactItem[] = [
  { sku: "Brand A 500ml", impact: "-4.2% volume", direction: "negative", detail: "Facing reduction & cannibalization from 330ml expansion" },
  { sku: "Brand A 330ml", impact: "+8.5% volume", direction: "positive", detail: "Distribution expansion in Convenience captures 500ml demand" },
  { sku: "Brand B 330ml", impact: "+2.1% volume", direction: "positive", detail: "Halo effect from improved shelf presence" },
  { sku: "Brand A 1.5L", impact: "+1.2% volume", direction: "positive", detail: "Multi-serve benefits from cleaner assortment" },
  { sku: "Brand C 330ml", impact: "+3.8% volume", direction: "positive", detail: "Sleeper activation from added facings" },
  { sku: "Brand D 330ml", impact: "No change", direction: "neutral", detail: "Different brand, separate consumption occasion" },
]

const existingInitiatives = ["Mix Upgrade Programme Q3 2026", "Promo Discipline Wave 2"]

export function MixSimulateForecast({ onNavigate, onLaunchInitiative, onNavigateToArtemis, onNavigateToPromotion }: SimulateForecastProps) {
  const [scenario, setScenario] = useState("mix-shift")
  const [selectedSkus, setSelectedSkus] = useState<string[]>(storylinePreselectedSkus)
  const [channel, setChannel] = useState("Convenience")
  const [retailer, setRetailer] = useState("All Retailers")
  const [period, setPeriod] = useState("q3-2026")
  const [hasRun, setHasRun] = useState(false) // Results only appear after clicking "Run Simulation"
  const [showInitPanel, setShowInitPanel] = useState(false)
  
  // Artemis Import Modal state
  const [showArtemisImportModal, setShowArtemisImportModal] = useState(false)
  const [fuelightImportStep, setArtemisImportStep] = useState<"review" | "add-another">("review")
  
  // Adjustable action values
  const [actionValues, setActionValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    baseActions.forEach(a => { initial[a.id] = a.baseValue })
    return initial
  })

  const toggleSku = (s: string) => setSelectedSkus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const updateActionValue = (id: string, value: number) => {
    setActionValues(prev => ({ ...prev, [id]: value }))
  }

  // Calculate totals based on current slider values
  const impact = useMemo(() => {
    const actionsWithValues = baseActions.map(a => ({ id: a.id, value: actionValues[a.id] || a.baseValue }))
    return calculateImpact(actionsWithValues)
  }, [actionValues])

  const getActionLabel = (action: ActionItem) => {
    const value = actionValues[action.id] || action.baseValue
    switch (action.actionType) {
      case "expand": return `+${value}${action.unit} WD expansion`
      case "add-facing": return `+${value} facing${value > 1 ? "s" : ""}`
      case "reduce": return `-${value}${action.unit}`
      case "delist": return `Delist from ${value}% of stores`
      default: return ""
    }
  }

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
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-red-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100">Mix Optimiser</h2>
              <p className="text-[10px] text-zinc-500">Simulate assortment changes and see real-time impact</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Scenario</Label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">{scenarioTypes.map(s => <SelectItem key={s.value} value={s.value} className="text-zinc-200 text-xs">{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
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
            <div>
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">{periodOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Select SKUs</Label>
            <div className="flex flex-wrap gap-1.5">
              {skuOptions.map(s => (
                <button key={s} onClick={() => toggleSku(s)} className={cn("px-2.5 py-1 rounded text-[10px] font-medium border transition-colors", selectedSkus.includes(s) ? "bg-red-500/10 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => setHasRun(true)} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
            <Play className="h-4 w-4 mr-2" /> Run Optimisation
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {hasRun && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left: ACTIONS with sliders */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Recommended Actions</h3>
              </div>
              <p className="text-[10px] text-zinc-500 mb-4">Adjust the sliders to see how changes affect the projected impact</p>

              <div className="space-y-5">
                {baseActions.map(action => (
                  <div key={action.id} className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-medium text-zinc-200">{action.sku}</span>
                        <Badge className={cn("ml-2 text-[8px] py-0 h-4", action.confidence === "High" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : action.confidence === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-red-500/15 text-red-300 border-red-500/30")}>{action.confidence}</Badge>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">{getActionLabel(action)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-zinc-500 w-8">{action.minValue}</span>
                      <Slider
                        value={[actionValues[action.id] || action.baseValue]}
                        onValueChange={([v]) => updateActionValue(action.id, v)}
                        min={action.minValue}
                        max={action.maxValue}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-[10px] text-zinc-500 w-8 text-right">{action.maxValue}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary KPIs */}
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <h4 className="text-[10px] text-zinc-500 uppercase tracking-wide mb-3">Projected Total Impact</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className={cn("text-sm font-bold font-mono", impact.totalVol >= 0 ? "text-emerald-400" : "text-red-400")}>{impact.totalVol >= 0 ? "+" : ""}{impact.totalVol.toFixed(1)}%</p>
                    <p className="text-[9px] text-zinc-500">Volume</p>
                  </div>
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className="text-sm font-bold font-mono text-emerald-400">+{"\u00a3"}{impact.totalRev.toFixed(0)}K</p>
                    <p className="text-[9px] text-zinc-500">Revenue</p>
                  </div>
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className="text-sm font-bold font-mono text-emerald-400">+{"\u00a3"}{impact.totalGP.toFixed(0)}K</p>
                    <p className="text-[9px] text-zinc-500">Gross Profit</p>
                  </div>
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className="text-sm font-bold font-mono text-emerald-400">+{"\u20ac"}{impact.pplChange.toFixed(2)}</p>
                    <p className="text-[9px] text-zinc-500">PPL Change</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: IMPACT on other items */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Impact on Other SKUs</h3>
              </div>
              <p className="text-[10px] text-zinc-500 mb-4">How your actions affect the rest of the portfolio</p>

              <div className="space-y-3">
                {otherImpacts.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                    <div className="flex items-center gap-3">
                      {item.direction === "positive" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      ) : item.direction === "negative" ? (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-zinc-500" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-zinc-200">{item.sku}</p>
                        <p className="text-[10px] text-zinc-500">{item.detail}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs font-mono", item.direction === "positive" ? "text-emerald-400" : item.direction === "negative" ? "text-red-400" : "text-zinc-500")}>
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>

              {/* Initiative linking */}
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-zinc-300">Link to Initiative</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-[10px] h-7 border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => setShowInitPanel(!showInitPanel)}>
                      <Link2 className="h-3 w-3 mr-1" /> Link Existing
                    </Button>
                    <Button size="sm" className="text-[10px] h-7 bg-red-600 hover:bg-red-700 text-white" onClick={onLaunchInitiative}>
                      <Plus className="h-3 w-3 mr-1" /> New Initiative
                    </Button>
                  </div>
                </div>
                
                {/* Import to Artemis button */}
                <Button 
                  onClick={() => setShowArtemisImportModal(true)}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 hover:border-amber-500/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Simulation into Artemis
                  <Sparkles className="h-3 w-3 ml-2 text-amber-400" />
                </Button>
                
                {showInitPanel && (
                  <div className="mt-3 space-y-1.5">
                    {existingInitiatives.map(init => (
                      <button key={init} className="w-full text-left px-3 py-2 rounded-lg text-[10px] text-zinc-300 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-zinc-500" />{init}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Artemis Import Modal */}
      {showArtemisImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Import to Artemis</h3>
              </div>
              <button onClick={() => setShowArtemisImportModal(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              {fuelightImportStep === "review" && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">Import your simulations into Artemis for comprehensive optimization across all investment areas.</p>
                  
                  {/* Simulation Summary - Shows both Pricing AND Assortment */}
                  <div className="space-y-3">
                    {/* Pricing Simulation - from previous session */}
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-300">Pricing</span>
                        </div>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-2 py-0.5">Imported</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Citrus/Fruity price increase: Brand C & Brand D SKUs (+4% revenue impact)</p>
                    </div>
                    
                    {/* Assortment & Mix Simulation - current */}
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-300">Assortment & Mix</span>
                        </div>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">Active Simulation</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Mix shift: Delist tail SKUs, reallocate to 330ml Convenience, expand HoReCa (+{impact.totalVol.toFixed(1)}% volume, +{"\u00a3"}{impact.totalRev.toFixed(0)}K revenue)</p>
                    </div>
                    
                    {/* Promotion - not configured yet */}
                    <button 
                      onClick={() => setArtemisImportStep("add-another")}
                      className="w-full p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 border-dashed hover:border-zinc-600 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-zinc-600" />
                          <span className="text-sm text-zinc-400">Promotion</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">Not configured</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setArtemisImportStep("add-another")}
                      className="flex-1 border-zinc-700 text-zinc-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowArtemisImportModal(false)
                        onNavigateToArtemis?.()
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Continue to Artemis
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              
              {fuelightImportStep === "add-another" && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">Select another investment area to add to your Artemis scenario:</p>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setShowArtemisImportModal(false)
                        onNavigateToPromotion?.()
                      }}
                      className="w-full p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-zinc-200">Promotion</span>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Trade promotion optimization, ROI analysis</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    </button>
                    
                    <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">Pricing</span>
                        <span className="text-[9px] text-zinc-500 ml-auto">Already configured</span>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-300">Assortment & Mix</span>
                        <span className="text-[9px] text-zinc-500 ml-auto">Already configured</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setArtemisImportStep("review")}
                      className="flex-1 border-zinc-700 text-zinc-300"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowArtemisImportModal(false)
                        onNavigateToArtemis?.()
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Continue to Artemis
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
