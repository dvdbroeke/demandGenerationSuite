"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Zap, Play, CheckCircle2, Link2, Plus, Target, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Database, Lock, Shield, X, Check, ChevronRight, Info, Upload, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { PPAScreen } from "./price-incentive"
import { allSkuNames } from "../shared-sku-data"

interface SimulateForecastProps {
  onNavigate?: (screen: PPAScreen) => void
  onLaunchInitiative?: () => void
  onNavigateToFuelight?: () => void
  onNavigateToAssortmentMix?: () => void
  onNavigateToPromotion?: () => void
}

const tabs: { id: PPAScreen; label: string }[] = [
  { id: "pricing-performance", label: "Pricing Performance" },
  { id: "price-incentive", label: "Price Incentive Curve" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

const scenarioTypes = [
  { value: "reprice", label: "Price Repositioning" },
  { value: "price-increase", label: "Price Increase" },
  { value: "price-decrease", label: "Price Decrease" },
  { value: "ladder", label: "Price Ladder Redesign" },
]

// All SKUs available for simulation - includes Category D
const skuOptions = allSkuNames
const channelOptions = ["All Channels", "Convenience", "Modern Trade", "Ecommerce", "On-Premise"]
const periodOptions = [{ value: "q2-2026", label: "Q2 2026" }, { value: "q3-2026", label: "Q3 2026" }, { value: "q4-2026", label: "Q4 2026" }]

// Action items with adjustable price values
interface PriceActionItem {
  id: string
  sku: string
  currentPrice: number
  suggestedPrice: number
  minPrice: number
  maxPrice: number
  elasticity: number // volume change per 1% price change
  confidence: "High" | "Medium" | "Low"
}

// Category D focused price actions for storyline
const citrusFruityPriceActions: PriceActionItem[] = [
  { id: "brand-d-330", sku: "Brand D 330ml", currentPrice: 1.10, suggestedPrice: 1.25, minPrice: 1.05, maxPrice: 1.35, elasticity: -0.25, confidence: "High" },
  { id: "brand-d-500", sku: "Brand D 500ml", currentPrice: 1.48, suggestedPrice: 1.59, minPrice: 1.40, maxPrice: 1.70, elasticity: -0.35, confidence: "High" },
  { id: "brand-e-330", sku: "Brand E 330ml", currentPrice: 1.12, suggestedPrice: 1.22, minPrice: 1.05, maxPrice: 1.35, elasticity: -0.30, confidence: "High" },
  { id: "brand-e-500", sku: "Brand E 500ml", currentPrice: 1.55, suggestedPrice: 1.65, minPrice: 1.45, maxPrice: 1.79, elasticity: -0.40, confidence: "Medium" },
]

const basePriceActions: PriceActionItem[] = [
  { id: "1", sku: "Brand A 330ml", currentPrice: 1.35, suggestedPrice: 1.39, minPrice: 1.25, maxPrice: 1.49, elasticity: -0.3, confidence: "High" },
  { id: "2", sku: "Brand B 330ml", currentPrice: 1.39, suggestedPrice: 1.45, minPrice: 1.29, maxPrice: 1.55, elasticity: -0.15, confidence: "High" },
  { id: "3", sku: "Brand A 500ml", currentPrice: 1.89, suggestedPrice: 1.79, minPrice: 1.59, maxPrice: 1.99, elasticity: -1.2, confidence: "Medium" },
  { id: "4", sku: "Brand A 8x330ml", currentPrice: 4.00, suggestedPrice: 3.75, minPrice: 3.50, maxPrice: 4.50, elasticity: -2.5, confidence: "Medium" },
]

// Calculate impact based on price values
function calculatePriceImpact(actions: { id: string; newPrice: number }[]) {
  let totalVol = 0, totalRev = 0, totalGP = 0
  
  actions.forEach(a => {
    const base = basePriceActions.find(b => b.id === a.id)
    if (!base) return
    
    const priceChangePercent = ((a.newPrice - base.currentPrice) / base.currentPrice) * 100
    const volumeChange = priceChangePercent * base.elasticity // negative elasticity means price up = volume down
    const baseVolume = 100 // arbitrary base
    const newVolume = baseVolume * (1 + volumeChange / 100)
    
    const revChange = (a.newPrice * newVolume) - (base.currentPrice * baseVolume)
    const gpMargin = 0.35 // 35% GP margin
    const gpChange = revChange * gpMargin
    
    totalVol += volumeChange
    totalRev += revChange * 10 // scale to thousands
    totalGP += gpChange * 10
  })
  
  return { totalVol, totalRev, totalGP }
}

// Impact on other items (cannibalization)
interface PriceImpactItem {
  sku: string
  impact: string
  direction: "positive" | "negative" | "neutral"
  detail: string
  cannibRate: string
}

const otherPriceImpacts: PriceImpactItem[] = [
  { sku: "Brand A 1.5L", impact: "-3.2% volume", direction: "negative", cannibRate: "8.4%", detail: "Price cut on 500ml draws take-home buyers" },
  { sku: "Brand C 330ml", impact: "+1.5% volume", direction: "positive", cannibRate: "2.1%", detail: "Price increase on Brand A 330ml shifts some demand" },
  { sku: "Competitor X Regular 330ml", impact: "+2.8% volume", direction: "negative", cannibRate: "-", detail: "Competitor gains from our price increase" },
  { sku: "Brand B 500ml", impact: "No change", direction: "neutral", cannibRate: "0%", detail: "Different pack size occasion" },
]

const existingInitiatives = ["Price Ladder Review Q3", "Premium SKU Price Increase"]

// Competitor Reaction Simulation Data
interface CompetitorReaction {
  competitor: string
  likelyAction: string
  probability: string
  impactOnUs: string
  timing: string
  recommendation: string
}

const competitorReactions: CompetitorReaction[] = [
  { competitor: "Competitor X", likelyAction: "Match price reduction on comparable SKUs", probability: "72%", impactOnUs: "-8% volume vs. baseline", timing: "1-2 weeks", recommendation: "Consider shorter promo window or exclusive retailer deal" },
  { competitor: "Private Label", likelyAction: "Maintain current pricing (margin focus)", probability: "85%", impactOnUs: "Neutral", timing: "N/A", recommendation: "Good opportunity for brand switching capture" },
  { competitor: "Alternative", likelyAction: "Increase promotional frequency", probability: "54%", impactOnUs: "-3% volume in flavor segment", timing: "2-4 weeks", recommendation: "Monitor and adjust Brand C/Brand D promos accordingly" },
]

// Data Clean Room entities
const dcrEntities = [
  { id: "region-1", name: "Regional Partner Europe", region: "Europe" },
  { id: "region-2", name: "Regional Partner West", region: "Western Europe" },
  { id: "region-3", name: "Regional Partner APAC", region: "Asia Pacific" },
  { id: "region-4", name: "Regional Partner Africa", region: "Africa" },
]

export function PPASimulateForecast({ onNavigate, onLaunchInitiative, onNavigateToFuelight, onNavigateToAssortmentMix, onNavigateToPromotion }: SimulateForecastProps) {
  const [scenario, setScenario] = useState("price-increase")
  const [selectedSkus, setSelectedSkus] = useState<string[]>(["Brand D 330ml", "Brand D 500ml", "Brand C 330ml", "Brand C 500ml"])
  const [channel, setChannel] = useState("All Channels")
  const [period, setPeriod] = useState("q3-2026")
  const [hasRun, setHasRun] = useState(false) // Results appear after clicking "Run Simulation"
  const [showInitPanel, setShowInitPanel] = useState(false)
  
  // Data Clean Room state
  const [showDCRModal, setShowDCRModal] = useState(false)
  const [dcrEntity, setDcrEntity] = useState("")
  const [dcrAuthStep, setDcrAuthStep] = useState<"select" | "auth" | "loading" | "success">("select")
  const [dcrPassword, setDcrPassword] = useState("")
  
  // Fuelight Import Modal state
  const [showFuelightImportModal, setShowFuelightImportModal] = useState(false)
  const [fuelightImportStep, setFuelightImportStep] = useState<"review" | "add-another">("review")
  
  // Use Citrus/Fruity actions for the storyline
  const activeActions = citrusFruityPriceActions
  
  // Adjustable price values (stored as cents to avoid floating point issues)
  const [priceValues, setPriceValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    activeActions.forEach(a => { initial[a.id] = Math.round(a.suggestedPrice * 100) })
    return initial
  })

  const toggleSku = (s: string) => setSelectedSkus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const updatePriceValue = (id: string, cents: number) => {
    setPriceValues(prev => ({ ...prev, [id]: cents }))
  }

  // Calculate totals based on current slider values - use active actions
  const impact = useMemo(() => {
    const actionsWithValues = activeActions.map(a => ({ 
      id: a.id, 
      newPrice: (priceValues[a.id] || Math.round(a.suggestedPrice * 100)) / 100,
      currentPrice: a.currentPrice,
      elasticity: a.elasticity
    }))
    // Custom calculation for Citrus/Fruity
    let totalVol = 0, totalRev = 0, totalGP = 0
    actionsWithValues.forEach(a => {
      const priceChangePercent = ((a.newPrice - a.currentPrice) / a.currentPrice) * 100
      const volumeChange = priceChangePercent * a.elasticity
      const baseVolume = 100
      const newVolume = baseVolume * (1 + volumeChange / 100)
      const revChange = (a.newPrice * newVolume) - (a.currentPrice * baseVolume)
      const gpMargin = 0.38 // Higher margin for Citrus
      const gpChange = revChange * gpMargin
      totalVol += volumeChange
      totalRev += revChange * 12
      totalGP += gpChange * 12
    })
    return { totalVol, totalRev, totalGP }
  }, [priceValues, activeActions])

  const formatPrice = (cents: number) => `\u20ac${(cents / 100).toFixed(2)}`
  
  const getPriceChangeLabel = (action: PriceActionItem) => {
    const newPrice = (priceValues[action.id] || Math.round(action.suggestedPrice * 100)) / 100
    const diff = newPrice - action.currentPrice
    if (Math.abs(diff) < 0.01) return "No change"
    return diff > 0 ? `+\u20ac${diff.toFixed(2)}` : `-\u20ac${Math.abs(diff).toFixed(2)}`
  }

  const handleImportToFuelight = () => {
    setShowFuelightImportModal(true)
    setFuelightImportStep("review")
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
              <h2 className="text-base font-bold text-zinc-100">Pricing Simulator</h2>
              <p className="text-[10px] text-zinc-500">Simulate price changes and see real-time impact on volume, revenue and profit</p>
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
              <Label className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1.5 block">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">{periodOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setHasRun(true)} className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Play className="h-4 w-4 mr-2" /> Run Simulation
              </Button>
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
        </CardContent>
      </Card>

      {/* Results */}
      {hasRun && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left: PRICE ACTIONS with sliders */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-zinc-100">Recommended Price Actions</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-3 w-3 text-zinc-500" />
                  <span className="text-[9px] text-zinc-500">Prices shown are <span className="text-emerald-400 font-medium">Sell-out Prices</span></span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 mb-4">Adjust the sell-out price sliders to see how changes affect projected volume, revenue and profit</p>
              
              {/* Price type indicator */}
              <div className="flex items-center gap-4 mb-4 p-2 rounded-lg bg-zinc-800/30 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] text-zinc-400"><span className="text-zinc-200 font-medium">Sell-out Price:</span> Consumer-facing shelf price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-[10px] text-zinc-400"><span className="text-zinc-200 font-medium">Trade Margin:</span> No-promo margin %</span>
                </div>
              </div>

              <div className="space-y-5">
                {activeActions.map(action => {
                  const currentCents = priceValues[action.id] || Math.round(action.suggestedPrice * 100)
                  return (
                    <div key={action.id} className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs font-medium text-zinc-200">{action.sku}</span>
                          <Badge className={cn("ml-2 text-[8px] py-0 h-4", action.confidence === "High" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : action.confidence === "Medium" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-red-500/15 text-red-300 border-red-500/30")}>{action.confidence}</Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500">Current Sell-out: {"\u20ac"}{action.currentPrice.toFixed(2)}</span>
                          <span className="text-xs font-mono text-emerald-400 ml-2">{getPriceChangeLabel(action)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-2 text-[9px]">
                        <span className="text-cyan-400">No-Promo Trade Margin: {(20 + Math.random() * 10).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-500 w-12">{formatPrice(Math.round(action.minPrice * 100))}</span>
                        <Slider
                          value={[currentCents]}
                          onValueChange={([v]) => updatePriceValue(action.id, v)}
                          min={Math.round(action.minPrice * 100)}
                          max={Math.round(action.maxPrice * 100)}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-[10px] text-zinc-500 w-12 text-right">{formatPrice(Math.round(action.maxPrice * 100))}</span>
                      </div>
                      <div className="flex justify-center mt-1">
                        <span className="text-sm font-bold font-mono text-zinc-100">{formatPrice(currentCents)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Summary KPIs */}
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <h4 className="text-[10px] text-zinc-500 uppercase tracking-wide mb-3">Projected Total Impact</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className={cn("text-sm font-bold font-mono", impact.totalVol >= 0 ? "text-emerald-400" : "text-red-400")}>{impact.totalVol >= 0 ? "+" : ""}{impact.totalVol.toFixed(1)}%</p>
                    <p className="text-[9px] text-zinc-500">Volume</p>
                  </div>
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className={cn("text-sm font-bold font-mono", impact.totalRev >= 0 ? "text-emerald-400" : "text-red-400")}>{impact.totalRev >= 0 ? "+" : ""}{"\u20ac"}{impact.totalRev.toFixed(0)}K</p>
                    <p className="text-[9px] text-zinc-500">Revenue</p>
                  </div>
                  <div className="text-center p-2 rounded bg-zinc-800/50">
                    <p className={cn("text-sm font-bold font-mono", impact.totalGP >= 0 ? "text-emerald-400" : "text-red-400")}>{impact.totalGP >= 0 ? "+" : ""}{"\u20ac"}{impact.totalGP.toFixed(0)}K</p>
                    <p className="text-[9px] text-zinc-500">Gross Profit</p>
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
                <h3 className="text-sm font-semibold text-zinc-100">Cannibalization & Competitive Impact</h3>
              </div>
              <p className="text-[10px] text-zinc-500 mb-4">How price changes affect other SKUs and competitors</p>

              <div className="space-y-3">
                {otherPriceImpacts.map((item, i) => (
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
                    <div className="text-right">
                      <span className={cn("text-xs font-mono", item.direction === "positive" ? "text-emerald-400" : item.direction === "negative" ? "text-red-400" : "text-zinc-500")}>
                        {item.impact}
                      </span>
                      {item.cannibRate !== "-" && (
                        <p className="text-[9px] text-zinc-500">Cannib: {item.cannibRate}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Clean Room button */}
              <div className="mt-5 pt-4 border-t border-zinc-800">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDCRModal(true)}
                  className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Check Trade Terms in Data Clean Room
                  <Lock className="h-3 w-3 ml-2 opacity-60" />
                </Button>
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
                
                {/* Import to Fuelight button */}
                <Button 
                  onClick={handleImportToFuelight}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 hover:border-amber-500/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Simulation into Fuelight
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

      {/* Competitor Reaction Simulation (shown after running simulation) */}
      {hasRun && (
        <Card className="bg-zinc-900/50 border-zinc-800/50 mt-4">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Competitor Reaction Simulation
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Predicted competitor responses to your price changes</p>
              </div>
              <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400 bg-amber-500/5">AI-Powered Forecast</Badge>
            </div>
            
            <div className="space-y-3">
              {competitorReactions.map((cr, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-zinc-200">{cr.competitor}</span>
                      <Badge className={cn("text-[8px] py-0 h-4", parseInt(cr.probability) >= 70 ? "bg-red-500/15 text-red-300 border-red-500/30" : parseInt(cr.probability) >= 50 ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-zinc-700 text-zinc-400 border-zinc-600")}>
                        {cr.probability} likelihood
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400">{cr.likelyAction}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500">Impact on us</p>
                    <p className={cn("text-xs font-medium", cr.impactOnUs === "Neutral" ? "text-zinc-400" : "text-amber-400")}>{cr.impactOnUs}</p>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="text-[10px] text-zinc-500">Timing</p>
                    <p className="text-xs text-zinc-300">{cr.timing}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-[11px] text-amber-300"><strong>Recommendation:</strong> Given high probability of Competitor X price matching, consider exclusive retailer partnerships or shorter promotion windows to minimize competitive response time.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Clean Room Modal */}
      {showDCRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Data Clean Room Access</h3>
              </div>
              <button onClick={() => { setShowDCRModal(false); setDcrAuthStep("select"); setDcrEntity(""); setDcrPassword(""); }} className="text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              {dcrAuthStep === "select" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-400 mb-3">Select the entity to access trade terms and margin data:</p>
                    <div className="space-y-2">
                      {dcrEntities.map(entity => (
                        <button
                          key={entity.id}
                          onClick={() => setDcrEntity(entity.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left",
                            dcrEntity === entity.id ? "bg-cyan-500/10 border-cyan-500/30" : "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700"
                          )}
                        >
                          <div>
                            <span className="text-xs font-medium text-zinc-200">{entity.name}</span>
                            <span className="text-[10px] text-zinc-500 ml-2">({entity.region})</span>
                          </div>
                          {dcrEntity === entity.id && <Check className="h-4 w-4 text-cyan-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    disabled={!dcrEntity} 
                    onClick={() => setDcrAuthStep("auth")}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
                  >
                    Continue to Authentication
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
              
              {dcrAuthStep === "auth" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-amber-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-amber-300">Proprietary Data Access</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Trade terms and margin data are confidential. Authentication required.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-zinc-400">Entity</Label>
                      <div className="mt-1 px-3 py-2 rounded-lg bg-zinc-800 text-sm text-zinc-200">
                        {dcrEntities.find(e => e.id === dcrEntity)?.name || ""}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">Email / SSO ID</Label>
                      <Input placeholder="your.email@company.com" className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-400">Password / Token</Label>
                      <Input 
                        type="password" 
                        value={dcrPassword}
                        onChange={(e) => setDcrPassword(e.target.value)}
                        placeholder="Enter your credentials" 
                        className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-100" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setDcrAuthStep("select")} className="flex-1 border-zinc-700 text-zinc-400">
                      Back
                    </Button>
                    <Button 
                      onClick={() => { setDcrAuthStep("loading"); setTimeout(() => setDcrAuthStep("success"), 1500); }}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Authenticate
                    </Button>
                  </div>
                </div>
              )}
              
              {dcrAuthStep === "loading" && (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-zinc-300">Authenticating and fetching trade terms...</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Connecting to secure Data Clean Room</p>
                </div>
              )}
              
              {dcrAuthStep === "success" && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <Check className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-zinc-100">Successfully Connected</p>
                    <p className="text-[10px] text-zinc-500 mt-1">Trade terms data now available in simulation</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Available Data</p>
                    <div className="space-y-1.5">
                      {["Retailer trade margins by SKU", "Volume-based rebate tiers", "Promotional funding rates", "Payment terms by channel"].map(item => (
                        <div key={item} className="flex items-center gap-2 text-xs text-zinc-300">
                          <Check className="h-3 w-3 text-emerald-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => { setShowDCRModal(false); setDcrAuthStep("select"); }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Apply to Simulation
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fuelight Import Modal */}
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
              {fuelightImportStep === "review" && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">Import your pricing simulation into Fuelight for comprehensive optimization across all investment areas.</p>
                  
                  {/* Simulation Summary */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-300">Pricing</span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px]">Active Simulation</Badge>
                      </div>
                      <p className="text-[10px] text-zinc-400">Citrus/Fruity price increase: Brand C & Brand D SKUs (+{Math.abs(impact.totalVol).toFixed(1)}% volume impact, +{"\u20ac"}{impact.totalRev.toFixed(0)}K revenue)</p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowFuelightImportModal(false)
                        onNavigateToAssortmentMix?.()
                      }}
                      className="w-full p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 border-dashed hover:border-zinc-600 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-zinc-600" />
                          <span className="text-sm text-zinc-400">Assortment & Mix</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">Not configured</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowFuelightImportModal(false)
                        onNavigateToPromotion?.()
                      }}
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
                      onClick={() => setFuelightImportStep("add-another")}
                      className="flex-1 border-zinc-700 text-zinc-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another
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
              )}
              
              {fuelightImportStep === "add-another" && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">Select another investment area to add to your Fuelight scenario:</p>
                  
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setShowFuelightImportModal(false)
                        onNavigateToAssortmentMix?.()
                      }}
                      className="w-full p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-zinc-200">Assortment & Mix</span>
                          <p className="text-[10px] text-zinc-500 mt-0.5">SKU optimization, portfolio mix, pack architecture</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowFuelightImportModal(false)
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
                    
                    <button className="w-full p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-zinc-200">Consumer (Paid)</span>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Media investment, digital/traditional mix</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-500" />
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setFuelightImportStep("review")}
                      className="flex-1 border-zinc-700 text-zinc-300"
                    >
                      Back
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
