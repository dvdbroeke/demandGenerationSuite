"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TPOScreen } from "./promo-effectiveness"
import { allSkuNames, allTiers, retailerOptions as sharedRetailers, mechanicOptions as sharedMechanics, skuMaster, brandColors } from "../shared-sku-data"

interface CrossOverProps { onNavigate?: (screen: TPOScreen) => void }

const allSkusList = allSkuNames
const packOptions = ["All Packs", ...allTiers]
const mechanicOptions = [...sharedMechanics]
const retailerOptions = [...sharedRetailers]
const viewModes = [{ value: "sku", label: "By SKU" }, { value: "brand", label: "By Brand" }]

const sourceLabels = ["Category Expansion", "Competitor Switching", "Internal Brand Switching", "Pull Forward", "Loyalty / Repeat"]
const sourceColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

function seededRandom(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }
function hashStr(str: string): number { let h = 0; for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0; return Math.abs(h) }

interface CannibalFlow { sku: string; volume: number; pct: number }
interface SkuSource { sku: string; brand: string; pack: string; totalIncremental: number; sources: number[]; cannibalizedFrom: CannibalFlow[]; cannibalizedTo: CannibalFlow[] }

const baseSkuData: SkuSource[] = skuMaster.map(s => {
  const r = () => { let x = 0; for (let i = 0; i < s.sku.length; i++) x = ((x << 5) - x + s.sku.charCodeAt(i)) | 0; return Math.abs(x) }
  const seed = r()
  const sources = [
    Math.round(15 + (seed % 25)),
    Math.round(15 + ((seed >> 3) % 30)),
    Math.round(10 + ((seed >> 6) % 25)),
    Math.round(5 + ((seed >> 9) % 25)),
    0
  ]
  sources[4] = Math.max(3, 100 - sources.slice(0, 4).reduce((a, b) => a + b, 0))
  const total = sources.reduce((a, b) => a + b, 0)
  const normSources = sources.map(v => Math.round(v / total * 100))
  normSources[4] = 100 - normSources.slice(0, 4).reduce((a, b) => a + b, 0)

  const otherSkus = skuMaster.filter(o => o.sku !== s.sku && o.brand !== s.brand).slice(0, 2)
  const sameSkus = skuMaster.filter(o => o.sku !== s.sku && o.brand === s.brand).slice(0, 1)
  const totalIncr = Math.round(30 + (s.revM * 8) + (seed % 40))
  return {
    sku: s.sku, brand: s.brand, pack: s.tier,
    totalIncremental: totalIncr,
    sources: normSources,
    cannibalizedFrom: otherSkus.map((o, i) => ({ sku: o.sku, volume: Math.round(3 + (seed >> (i * 2)) % 15), pct: +(3 + ((seed >> (i * 3)) % 18)).toFixed(1) })),
    cannibalizedTo: sameSkus.map((o, i) => ({ sku: o.sku, volume: Math.round(2 + (seed >> (i * 4)) % 10), pct: +(2 + ((seed >> (i * 5)) % 12)).toFixed(1) })),
  }
})

const tierPackMap: Record<string, string[]> = { "Single Serve": ["150ml","250ml","330ml"], "On-the-Go": ["500ml"], "Multi Serve": ["1.25L","1.5L","1.75L","2L"], "Multipack": ["8x330ml","18x330ml","24x330ml"] }
const retailerMult: Record<string, number> = { "Retailer A":1.08,"Retailer B":1.04,"Retailer C":0.96,"Retailer D":0.98,"Retailer E":0.88,"Retailer F":0.90,"Retailer G":1.04,"Retailer H":0.95 }
const mechMult: Record<string, number> = { "TPR":1.0,"Multibuy":1.1,"BOGOF":0.88,"Meal Deal":0.92,"\u20ac1 PMP":0.78,"Display Only":1.06 }

const insightTemplates = [
  { type: "negative" as const, cond: (r: string) => r === "All Retailers", text: "Brand A 1.5L has 35% pull-forward -- highest in portfolio. Promotion is borrowing from future sales, not creating genuine incrementality." },
  { type: "positive" as const, cond: (r: string) => r === "All Retailers", text: "Brand B 330ml drives 42% volume from competitor switching -- the strongest conquest SKU. Prioritize competitive pack formats." },
  { type: "warning" as const, cond: (r: string) => r === "All Retailers", text: "Brand C 330ml loses 28% of promo volume to Brand B and Brand A -- internal cannibalization exceeds competitive gains." },
  { type: "positive" as const, cond: (r: string) => r === "All Retailers", text: "Brand D 330ml achieves 38% category expansion -- the highest net-new volume in portfolio. Ideal for Display + TPR." },
  { type: "negative" as const, cond: () => true, text: "Brand E 500ml suffers 21% same-brand size switching from 330ml. Avoid running promos on both sizes simultaneously." },
  { type: "positive" as const, cond: (r: string) => r === "Retailer A", text: "Retailer A delivers 8% higher incremental volume across all SKUs vs. portfolio average -- premium shopper profile." },
  { type: "warning" as const, cond: (r: string) => r === "Retailer D", text: "Retailer D shows 4% lower category expansion -- promotional overlap with competitor activity is higher." },
  { type: "positive" as const, cond: (r: string) => r === "Retailer B", text: "Retailer B delivers 12% higher competitor switching. Strong local shopper profile aligns well with Brand B." },
  { type: "negative" as const, cond: (r: string) => r === "Retailer H", text: "Retailer H promos show high pull-forward (32%) and low competitor switching. Volume is primarily own-brand redistribution." },
]

export function TPOCrossOver({ onNavigate }: CrossOverProps) {
  const [selectedSku, setSelectedSku] = useState("All SKUs")
  const [selectedPack, setSelectedPack] = useState("All Packs")
  const [selectedMechanic, setSelectedMechanic] = useState("All Mechanics")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [viewMode, setViewMode] = useState("sku")
  const [expandedSku, setExpandedSku] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    const rMul = selectedRetailer !== "All Retailers" ? (retailerMult[selectedRetailer] ?? 1) : 1
    const mMul = selectedMechanic !== "All Mechanics" ? (mechMult[selectedMechanic] ?? 1) : 1
    const seed = hashStr(selectedRetailer + selectedMechanic + selectedPack)
    const rng = seededRandom(seed)
    let items = baseSkuData
    if (selectedSku !== "All SKUs") items = items.filter(s => s.sku === selectedSku)
    if (selectedPack !== "All Packs") { const sizes = tierPackMap[selectedPack] || []; if (sizes.length) items = items.filter(s => sizes.some(sz => s.sku.toLowerCase().includes(sz.toLowerCase()))); else items = items.filter(s => s.pack === selectedPack) }
    return items.map(item => {
      const noise = 0.9 + rng() * 0.2, mult = rMul * mMul * noise
      const newTotal = Math.round(item.totalIncremental * mult)
      const srcN = item.sources.map(() => 0.85 + rng() * 0.3)
      const srcS = item.sources.reduce((a, b, i) => a + b * srcN[i], 0)
      const newSrc = item.sources.map((s, i) => Math.round((s * srcN[i] / srcS) * 100))
      newSrc[0] += 100 - newSrc.reduce((a, b) => a + b, 0)
      const scaleF = (flows: CannibalFlow[]) => flows.map(f => ({ ...f, volume: Math.max(1, Math.round(f.volume * mult)), pct: parseFloat((f.pct * rMul * mMul).toFixed(1)) }))
      return { ...item, totalIncremental: newTotal, sources: newSrc, cannibalizedFrom: scaleF(item.cannibalizedFrom), cannibalizedTo: scaleF(item.cannibalizedTo) }
    })
  }, [selectedSku, selectedPack, selectedMechanic, selectedRetailer])

  const displayData = useMemo(() => {
    if (viewMode === "sku") return filteredData
    const m = new Map<string, SkuSource>()
    filteredData.forEach(item => { const e = m.get(item.brand); if (!e) m.set(item.brand, { ...item, sku: item.brand }); else { e.totalIncremental += item.totalIncremental; e.sources = e.sources.map((s, i) => s + item.sources[i]); e.cannibalizedFrom = [...e.cannibalizedFrom, ...item.cannibalizedFrom]; e.cannibalizedTo = [...e.cannibalizedTo, ...item.cannibalizedTo] } })
    return Array.from(m.values()).map(item => { const t = item.sources.reduce((a, b) => a + b, 0) || 1; return { ...item, sources: item.sources.map(s => Math.round((s / t) * 100)) } })
  }, [filteredData, viewMode])

  const activeInsights = useMemo(() => insightTemplates.filter(t => t.cond(selectedRetailer)).slice(0, 5), [selectedRetailer])
  const maxTotal = Math.max(...displayData.map(s => s.totalIncremental), 1)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-1 border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        <button onClick={() => onNavigate?.("promo-effectiveness")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">Promo Effectiveness</button>
        <button className="px-5 py-2.5 text-xs font-medium text-zinc-100 border-b-2 border-emerald-500">Cross-over</button>
        <button onClick={() => onNavigate?.("simulate-forecast")} className="px-5 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">{"Promotion Optimizer"}</button>
      </div>

      <div>
        <h1 className="text-lg font-bold text-zinc-100">Incremental Volume Source (Cross-Over by SKU)</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">Where does incremental volume come from -- and which SKUs are cannibalizing each other? Filters update all data.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={selectedSku} onValueChange={(v) => { setSelectedSku(v); setExpandedSku(null) }}>
          <SelectTrigger className="h-7 w-auto min-w-[140px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="All SKUs" className="text-zinc-200 text-xs">All SKUs</SelectItem>
            {allSkusList.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}
          </SelectContent>
        </Select>
        {[{val:selectedPack,set:setSelectedPack,opts:packOptions},{val:selectedMechanic,set:setSelectedMechanic,opts:mechanicOptions},{val:selectedRetailer,set:setSelectedRetailer,opts:retailerOptions}].map((f,fi) => (
          <Select key={fi} value={f.val} onValueChange={f.set}>
            <SelectTrigger className="h-7 w-auto min-w-[120px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">{f.opts.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
          </Select>
        ))}
        <div className="w-px h-5 bg-zinc-800" />
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="h-7 w-[110px] bg-zinc-900 border-zinc-800 text-zinc-200 text-[11px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{viewModes.map(m => <SelectItem key={m.value} value={m.value} className="text-zinc-200 text-xs">{m.label}</SelectItem>)}</SelectContent>
        </Select>
        {(selectedSku !== "All SKUs" || selectedPack !== "All Packs" || selectedMechanic !== "All Mechanics" || selectedRetailer !== "All Retailers") && (
          <div className="flex items-center gap-1 ml-2">
            <span className="text-[9px] text-zinc-500">Active:</span>
            {selectedSku !== "All SKUs" && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] py-0 h-4">{selectedSku}</Badge>}
            {selectedPack !== "All Packs" && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] py-0 h-4">{selectedPack}</Badge>}
            {selectedMechanic !== "All Mechanics" && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[8px] py-0 h-4">{selectedMechanic}</Badge>}
            {selectedRetailer !== "All Retailers" && <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[8px] py-0 h-4">{selectedRetailer}</Badge>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {sourceLabels.map((label, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span className="w-3 h-2 rounded-sm" style={{ backgroundColor: sourceColors[i] }} />{label}
          </span>
        ))}
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          {displayData.length === 0 ? (
            <div className="py-12 text-center"><p className="text-sm text-zinc-500">No data matches the current filters.</p></div>
          ) : (
            <div className="space-y-1">
              {displayData.map(item => {
                const isExp = expandedSku === item.sku
                const bw = (item.totalIncremental / maxTotal) * 100
                return (
                  <div key={item.sku}>
                    <button onClick={() => setExpandedSku(isExp ? null : item.sku)} className="w-full flex items-center gap-3 py-2 px-2 rounded hover:bg-zinc-800/20 transition-colors">
                      <div className="w-36 text-right flex-shrink-0"><span className="text-[11px] text-zinc-300 font-medium">{item.sku}</span></div>
                      <div className="flex-1 relative">
                        <div className="h-6 rounded overflow-hidden flex" style={{ width: `${bw}%` }}>
                          {item.sources.map((pct, si) => <div key={si} className="h-full" style={{ width: `${pct}%`, backgroundColor: sourceColors[si] }} title={`${sourceLabels[si]}: ${pct}%`} />)}
                        </div>
                      </div>
                      <div className="w-20 text-right flex-shrink-0"><span className="text-xs font-mono text-zinc-200">{item.totalIncremental}K L</span></div>
                      <ChevronRight className={cn("h-3 w-3 text-zinc-600 transition-transform", isExp && "rotate-90")} />
                    </button>
                    {isExp && (
                      <div className="ml-[156px] mr-8 mb-3 mt-1 p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/50">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-2">Volume Source Breakdown</p>
                            <div className="space-y-1.5">
                              {sourceLabels.map((label, si) => (
                                <div key={si} className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: sourceColors[si] }} />
                                  <span className="text-[10px] text-zinc-400 flex-1">{label}</span>
                                  <span className="text-[10px] font-mono text-zinc-200">{item.sources[si]}%</span>
                                  <span className="text-[10px] font-mono text-zinc-500">{Math.round(item.totalIncremental * item.sources[si] / 100)}K L</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-2">Cannibalization Flow</p>
                            {item.cannibalizedFrom.length > 0 && (
                              <div className="mb-2">
                                <p className="text-[9px] text-emerald-400 mb-1">Volume gained from (other SKUs losing):</p>
                                {item.cannibalizedFrom.map((c, ci) => (
                                  <div key={ci} className="flex items-center gap-2 py-0.5">
                                    <span className="text-[10px] text-zinc-500">{c.sku}</span>
                                    <ArrowRight className="h-2.5 w-2.5 text-emerald-500" />
                                    <span className="text-[10px] text-zinc-200 font-mono">{c.volume}K L</span>
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] py-0 h-3.5">{c.pct}%</Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                            {item.cannibalizedTo.length > 0 && (
                              <div>
                                <p className="text-[9px] text-red-400 mb-1">Volume lost to (other SKUs gaining):</p>
                                {item.cannibalizedTo.map((c, ci) => (
                                  <div key={ci} className="flex items-center gap-2 py-0.5">
                                    <span className="text-[10px] text-zinc-500">{item.sku}</span>
                                    <ArrowRight className="h-2.5 w-2.5 text-red-500" />
                                    <span className="text-[10px] text-zinc-200">{c.sku}</span>
                                    <span className="text-[10px] text-zinc-200 font-mono">{c.volume}K L</span>
                                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[8px] py-0 h-3.5">{c.pct}%</Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                            {item.cannibalizedTo.length === 0 && item.cannibalizedFrom.length === 0 && <p className="text-[10px] text-zinc-600">No significant cannibalization detected</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Cannibalization Insights</h3>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px]">{activeInsights.length} findings</Badge>
            {selectedRetailer !== "All Retailers" && <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px]">Filtered: {selectedRetailer}</Badge>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {activeInsights.map((insight, i) => (
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
