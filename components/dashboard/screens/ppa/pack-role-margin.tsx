"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PPAScreen } from "./price-incentive"
import { skuMaster, allBrands, brandColors } from "../shared-sku-data"

interface PricingDiagnosticsProps {
  onNavigate?: (screen: PPAScreen) => void
}

const tabs: { id: PPAScreen; label: string }[] = [
  { id: "price-incentive", label: "Price Incentive" },
  { id: "pack-role-margin", label: "Pricing Diagnostics" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

// ---------- Competitor pricing data by brand / pack size ----------

interface CompetitorSku {
  sku: string
  brand: string
  competitor: string
  packMl: number
  rsp: number
  ppl: number
  marketShare: number
}

const competitorPricing: CompetitorSku[] = [
  // vs Brand A Classic
  { sku: "Competitor X 330ml", brand: "Competitor X", competitor: "Competitor Corp", packMl: 330, rsp: 1.20, ppl: 3.64, marketShare: 18 },
  { sku: "Competitor X 500ml", brand: "Competitor X", competitor: "Competitor Corp", packMl: 500, rsp: 1.69, ppl: 3.38, marketShare: 14 },
  { sku: "Competitor X 1.5L", brand: "Competitor X", competitor: "Competitor Corp", packMl: 1500, rsp: 1.89, ppl: 1.26, marketShare: 12 },
  { sku: "Competitor X 2L", brand: "Competitor X", competitor: "Competitor Corp", packMl: 2000, rsp: 2.00, ppl: 1.00, marketShare: 10 },
  // vs Brand A Zero / Brand B
  { sku: "Competitor X Max 330ml", brand: "Competitor X Max", competitor: "Competitor Corp", packMl: 330, rsp: 1.25, ppl: 3.79, marketShare: 12 },
  { sku: "Competitor X Max 500ml", brand: "Competitor X Max", competitor: "Competitor Corp", packMl: 500, rsp: 1.79, ppl: 3.58, marketShare: 9 },
  { sku: "Competitor X Max 1.5L", brand: "Competitor X Max", competitor: "Competitor Corp", packMl: 1500, rsp: 1.99, ppl: 1.33, marketShare: 7 },
  // vs Brand C
  { sku: "Competitor Y Orange 330ml", brand: "Competitor Y", competitor: "Competitor Corp B", packMl: 330, rsp: 1.60, ppl: 4.85, marketShare: 8 },
  { sku: "Competitor Y Orange 500ml", brand: "Competitor Y", competitor: "Competitor Corp B", packMl: 500, rsp: 1.90, ppl: 3.80, marketShare: 5 },
  { sku: "Competitor Z Lemon 330ml", brand: "Competitor Z", competitor: "Competitor Corp C", packMl: 330, rsp: 1.40, ppl: 4.24, marketShare: 6 },
  // vs Brand D
  { sku: "Competitor W 330ml", brand: "Competitor W", competitor: "Competitor Corp", packMl: 330, rsp: 1.10, ppl: 3.33, marketShare: 5 },
  { sku: "Competitor W 500ml", brand: "Competitor W", competitor: "Competitor Corp", packMl: 500, rsp: 1.49, ppl: 2.98, marketShare: 4 },
  { sku: "Competitor V Lemon 330ml", brand: "Competitor V", competitor: "Competitor Corp D", packMl: 330, rsp: 1.35, ppl: 4.09, marketShare: 3 },
  // PL
  { sku: "PL Cola 330ml", brand: "Private Label", competitor: "Retailer PL", packMl: 330, rsp: 0.79, ppl: 2.39, marketShare: 22 },
  { sku: "PL Cola 1.5L", brand: "Private Label", competitor: "Retailer PL", packMl: 1500, rsp: 0.99, ppl: 0.66, marketShare: 18 },
  { sku: "PL Cola 2L", brand: "Private Label", competitor: "Retailer PL", packMl: 2000, rsp: 1.19, ppl: 0.60, marketShare: 15 },
]

const compBrandColors: Record<string, string> = {
  "Competitor X": "#2563eb", "Competitor X Max": "#1e40af", "Competitor Y": "#dc2626",
  "Competitor Z": "#d97706", "Competitor W": "#16a34a", "Competitor V": "#ca8a04",
  "Private Label": "#71717a",
}

// Pack size tier groupings for comparison
const packTiers = [
  { label: "Single Serve (150-330ml)", min: 100, max: 400 },
  { label: "On-the-Go (500ml)", min: 400, max: 700 },
  { label: "Multi Serve (1-1.5L)", min: 700, max: 1600 },
  { label: "Take Home (2L)", min: 1600, max: 2500 },
  { label: "Multipack (6x)", min: 1900, max: 2100 },
]

const brandFilterOptions = ["All Brands", ...allBrands]
const geographies = ["Italy", "Spain", "Germany", "France", "UK"]

// Price elasticity data by SKU
// <1 = inelastic (low sensitivity, safe to raise prices)
// >1 = elastic (high sensitivity, caution on price increases)
const skuElasticity: Record<string, number> = {
  "Brand A Classic 150ml": 0.4,
  "Brand A Classic 330ml": 0.7,
  "Brand A Classic 500ml": 1.2,
  "Brand A Classic 1.5L": 1.5,
  "Brand A Classic 2L": 1.8,
  "Brand A Zero 330ml": 0.5,
  "Brand A Zero 500ml": 0.8,
  "Brand A Zero 1.5L": 1.1,
  "Brand A Zero 2L": 1.4,
  "Brand B 330ml": 0.6,
  "Brand B 500ml": 0.9,
  "Brand B 1.5L": 1.3,
  "Brand C Orange 330ml": 0.8,
  "Brand C Orange 500ml": 1.1,
  "Brand C Orange 2L": 0.9,
  "Brand D 330ml": 0.9,
  "Brand D 500ml": 1.3,
  "Brand D 1.5L": 1.6,
  "Brand A Classic 8x330ml": 0.3,
  "Brand A Zero 8x330ml": 0.3,
  "Brand C Orange 8x330ml": 0.5,
}

// Elasticity interpretation helper
// <1 = inelastic (safe), >1 = elastic (caution)
const getElasticityLabel = (e: number) => {
  if (e <= 0.4) return { label: "Very Inelastic", color: "text-emerald-400", bg: "bg-emerald-500/15" }
  if (e <= 0.7) return { label: "Inelastic", color: "text-emerald-300", bg: "bg-emerald-500/10" }
  if (e <= 1.0) return { label: "Unit Elastic", color: "text-amber-400", bg: "bg-amber-500/10" }
  if (e <= 1.4) return { label: "Elastic", color: "text-red-400", bg: "bg-red-500/10" }
  return { label: "Very Elastic", color: "text-red-500", bg: "bg-red-500/15" }
}

const aiInsights = [
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Brand A Zero 8x330ml and Brand A Classic 8x330ml show very low elasticity (0.3). A +3% price increase would yield ~\u20ac0.4M incremental GP with less than 1% volume loss. Multipacks are the safest pricing lever." },
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Brand A Classic 150ml has elasticity of 0.4 (very inelastic). Impulse singles are price-protected by occasion urgency -- recommend +5% increase in convenience and petrol channels." },
  { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Brand A Classic 500ml shows elasticity of 1.2 and is priced +11.8% vs Competitor X 500ml. Price increases here risk volume loss -- hold current price and focus margin growth on less elastic SKUs." },
  { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", text: "Brand A Classic 2L (1.8) and Brand D 1.5L (1.6) are highly elastic take-home packs. Price increases will trigger significant switching to Private Label. Recommend holding or tactical promo support." },
  { icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10", text: "Brand C 2L shows unusually low elasticity (0.9) for its tier due to no direct competitor. A +5% increase could yield \u20ac0.3M GP with minimal volume risk -- favourable trade-off." },
]

// ---------- Component ----------

export function PPAPackRoleMargin({ onNavigate }: PricingDiagnosticsProps) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedGeo, setSelectedGeo] = useState("Italy")
  const [showAI, setShowAI] = useState(false)

  // Our SKU data with elasticity
  const ownSkus = useMemo(() => {
    let data = skuMaster.map(s => ({
      sku: s.sku, brand: s.brand, packMl: s.packMl, rsp: +(s.ppl * s.packMl / 1000).toFixed(2),
      ppl: s.ppl, revM: s.revM, gpMargin: s.gpMargin, priceIndex: s.priceIndex, growth: s.volGrowth, role: s.role,
      elasticity: skuElasticity[s.sku] || 1.0, // default to unit elastic if not specified
    }))
    if (selectedBrand !== "All Brands") data = data.filter(d => d.brand === selectedBrand)
    return data
  }, [selectedBrand])

  // Match own SKUs to competitors by pack size for comparison table
  const comparisonRows = useMemo(() => {
    const rows: Array<{
      own: typeof ownSkus[0]
      competitors: Array<CompetitorSku & { priceDelta: number; pplDelta: number }>
    }> = []

    for (const own of ownSkus) {
      const matchingComps = competitorPricing
        .filter(c => Math.abs(c.packMl - own.packMl) < 100)
        .map(c => ({
          ...c,
          priceDelta: +((own.rsp - c.rsp) / c.rsp * 100).toFixed(1),
          pplDelta: +((own.ppl - c.ppl) / c.ppl * 100).toFixed(1),
        }))
      if (matchingComps.length > 0) {
        rows.push({ own, competitors: matchingComps })
      }
    }
    return rows
  }, [ownSkus])

  // Category-level price position summary
  const categoryPricing = useMemo(() => {
    return packTiers.slice(0, 4).map(tier => {
      const ownInTier = ownSkus.filter(s => s.packMl >= tier.min && s.packMl < tier.max)
      const compInTier = competitorPricing.filter(c => c.packMl >= tier.min && c.packMl < tier.max)
      const avgOwn = ownInTier.length > 0 ? ownInTier.reduce((s, d) => s + d.ppl, 0) / ownInTier.length : 0
      const avgComp = compInTier.length > 0 ? compInTier.reduce((s, d) => s + d.ppl, 0) / compInTier.length : 0
      const avgCompExPL = compInTier.filter(c => c.brand !== "Private Label")
      const avgBrandedComp = avgCompExPL.length > 0 ? avgCompExPL.reduce((s, d) => s + d.ppl, 0) / avgCompExPL.length : 0
      const gap = avgBrandedComp > 0 ? +((avgOwn - avgBrandedComp) / avgBrandedComp * 100).toFixed(1) : 0
      return {
        tier: tier.label,
        ownCount: ownInTier.length,
        compCount: compInTier.length,
        avgOwnPpl: +avgOwn.toFixed(2),
        avgCompPpl: +avgBrandedComp.toFixed(2),
        gap,
        ownSkus: ownInTier,
        compSkus: compInTier,
      }
    })
  }, [ownSkus])

  // Brand-level price index summary
  const brandPricing = useMemo(() => {
    return allBrands.map(brand => {
      const brandSkus = skuMaster.filter(s => s.brand === brand)
      const avgPpl = brandSkus.length > 0 ? brandSkus.reduce((s, d) => s + d.ppl, 0) / brandSkus.length : 0
      const avgMargin = brandSkus.length > 0 ? brandSkus.reduce((s, d) => s + d.gpMargin, 0) / brandSkus.length : 0
      const avgIndex = brandSkus.length > 0 ? brandSkus.reduce((s, d) => s + d.priceIndex, 0) / brandSkus.length : 0
      const totalRev = brandSkus.reduce((s, d) => s + d.revM, 0)
      return {
        brand,
        skuCount: brandSkus.length,
        avgPpl: +avgPpl.toFixed(2),
        avgMargin: +avgMargin.toFixed(1),
        avgIndex: +avgIndex.toFixed(0),
        totalRev: +totalRev.toFixed(1),
      }
    })
  }, [])

  // SVG: Category price position chart
  const chartW = 700, chartH = 200, pad = { left: 170, right: 30, top: 20, bottom: 30 }
  const plotW = chartW - pad.left - pad.right
  const maxPpl = 6
  const barH = 28, barGap = 14

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav tabs */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "pack-role-margin" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{brandFilterOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedGeo} onValueChange={setSelectedGeo}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{geographies.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {/* Brand-level price index cards */}
      <div className="grid grid-cols-5 gap-3">
        {brandPricing.map(bp => (
          <Card key={bp.brand} className={cn("bg-zinc-900/50 border-zinc-800/50 cursor-pointer transition-colors", selectedBrand === bp.brand && "border-red-500/50 bg-red-500/5")} onClick={() => setSelectedBrand(bp.brand === selectedBrand ? "All Brands" : bp.brand)}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColors[bp.brand] }} />
                <span className="text-[11px] font-semibold text-zinc-100">{bp.brand}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-center">
                <div>
                  <p className="text-sm font-bold text-zinc-100">{bp.avgIndex}</p>
                  <p className="text-[8px] text-zinc-500">Price Index</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">{"\u20ac"}{bp.avgPpl}</p>
                  <p className="text-[8px] text-zinc-500">Avg PPL</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">{bp.avgMargin}%</p>
                  <p className="text-[8px] text-zinc-500">GP Margin</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">{"\u20ac"}{bp.totalRev}M</p>
                  <p className="text-[8px] text-zinc-500">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Elasticity Summary */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Price Elasticity Overview</h3>
              <p className="text-[10px] text-zinc-500">SKU sensitivity to price changes -- lower absolute values indicate safer price increase opportunities</p>
            </div>
            <div className="flex items-center gap-4 text-[9px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{"<0.5 Inelastic (safe)"}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />{"0.5-0.7 Low"}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />{"0.7-1.0 Unit"}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />{">1.0 Elastic (caution)"}</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {ownSkus.slice(0, 14).map(sku => {
              const e = getElasticityLabel(sku.elasticity)
              const dotColor = sku.elasticity <= 0.4 ? "bg-emerald-500" :
                               sku.elasticity <= 0.7 ? "bg-emerald-400" :
                               sku.elasticity <= 1.0 ? "bg-amber-400" : "bg-red-400"
              return (
                <div key={sku.sku} className="bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-800/50">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", dotColor)} />
                    <span className="text-[9px] text-zinc-300 font-medium truncate">{sku.sku}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className={cn("text-base font-bold font-mono", e.color)}>{sku.elasticity.toFixed(1)}</span>
                    <span className={cn("text-[8px]", e.color)}>{e.label}</span>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-zinc-700/50 grid grid-cols-2 gap-1 text-[8px]">
                    <div>
                      <span className="text-zinc-500">GP%</span>
                      <span className="text-zinc-300 ml-1">{sku.gpMargin}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Rev</span>
                      <span className="text-zinc-300 ml-1">{"\u20ac"}{sku.revM}M</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Price Position by Pack Tier */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-zinc-100">Price Position by Pack Tier vs Competitors</h3>
              <p className="text-[10px] text-zinc-500">Average price per litre: Portfolio vs branded competitors (excl. Private Label)</p>
            </div>
            <div className="flex items-center gap-4 mb-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-red-500" />Portfolio</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-zinc-500" />Branded Competitors</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-zinc-700" />Private Label</span>
            </div>
            <svg viewBox={`0 0 ${chartW} ${categoryPricing.length * (barH * 2 + barGap + 16) + pad.top + pad.bottom}`} className="w-full" style={{ height: categoryPricing.length * (barH * 2 + barGap + 16) + pad.top + pad.bottom }}>
              {/* X-axis ticks */}
              {[0, 1, 2, 3, 4, 5, 6].map(v => (
                <g key={v}>
                  <line x1={pad.left + (v / maxPpl) * plotW} x2={pad.left + (v / maxPpl) * plotW} y1={pad.top} y2={categoryPricing.length * (barH * 2 + barGap + 16) + pad.top} stroke="#27272a" strokeWidth="0.5" />
                  <text x={pad.left + (v / maxPpl) * plotW} y={categoryPricing.length * (barH * 2 + barGap + 16) + pad.top + 14} textAnchor="middle" className="fill-zinc-500 text-[9px]">{"\u20ac"}{v.toFixed(0)}/L</text>
                </g>
              ))}

              {categoryPricing.map((tier, ti) => {
                const tierY = pad.top + ti * (barH * 2 + barGap + 16)
                const ownW = (tier.avgOwnPpl / maxPpl) * plotW
                const compW = (tier.avgCompPpl / maxPpl) * plotW
                const plComps = tier.compSkus.filter(c => c.brand === "Private Label")
                const avgPL = plComps.length > 0 ? plComps.reduce((s, d) => s + d.ppl, 0) / plComps.length : 0
                const plW = (avgPL / maxPpl) * plotW

                return (
                  <g key={tier.tier}>
                    <text x={pad.left - 8} y={tierY + 10} textAnchor="end" className="fill-zinc-300 text-[10px] font-medium">{tier.tier}</text>
                    {/* Portfolio bar */}
                    <rect x={pad.left} y={tierY + 16} width={Math.max(ownW, 2)} height={barH * 0.7} fill="#ef4444" rx={3} opacity={0.8} />
                    <text x={pad.left + ownW + 6} y={tierY + 16 + barH * 0.35 + 3} className="fill-zinc-200 text-[10px] font-mono font-semibold">{"\u20ac"}{tier.avgOwnPpl.toFixed(2)}/L</text>
                    {/* Competitor bar */}
                    <rect x={pad.left} y={tierY + 16 + barH * 0.7 + 3} width={Math.max(compW, 2)} height={barH * 0.7} fill="#71717a" rx={3} opacity={0.6} />
                    <text x={pad.left + compW + 6} y={tierY + 16 + barH * 0.7 + 3 + barH * 0.35 + 3} className="fill-zinc-400 text-[10px] font-mono">{"\u20ac"}{tier.avgCompPpl.toFixed(2)}/L</text>
                    {/* PL bar (if data exists) */}
                    {avgPL > 0 && (
                      <>
                        <rect x={pad.left} y={tierY + 16 + barH * 1.4 + 6} width={Math.max(plW, 2)} height={barH * 0.5} fill="#3f3f46" rx={2} opacity={0.5} />
                        <text x={pad.left + plW + 6} y={tierY + 16 + barH * 1.4 + 6 + barH * 0.25 + 3} className="fill-zinc-500 text-[9px] font-mono">{"\u20ac"}{avgPL.toFixed(2)}/L (PL)</text>
                      </>
                    )}
                    {/* Gap badge */}
                    <g transform={`translate(${chartW - pad.right - 55}, ${tierY + 20})`}>
                      <rect width={50} height={20} rx={4} fill={tier.gap > 0 ? "#22c55e15" : "#ef444415"} stroke={tier.gap > 0 ? "#22c55e40" : "#ef444440"} strokeWidth={1} />
                      <text x={25} y={13} textAnchor="middle" className={cn("text-[9px] font-bold font-mono", tier.gap > 0 ? "fill-emerald-400" : "fill-red-400")}>{tier.gap > 0 ? "+" : ""}{tier.gap}%</text>
                    </g>
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
              <Sparkles className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-semibold text-zinc-100">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {aiInsights.map((ins, i) => {
                const Icon = ins.icon
                return (
                  <div key={i} className={cn("p-3 rounded-lg border border-zinc-800/50", ins.bg)}>
                    <div className="flex items-start gap-2">
                      <Icon className={cn("h-3.5 w-3.5 mt-0.5 flex-shrink-0", ins.color)} />
                      <p className="text-[10px] text-zinc-300 leading-relaxed">{ins.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed SKU vs Competitor comparison table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">SKU-Level Price Comparison vs Competitors</h3>
              <p className="text-[10px] text-zinc-500">Own SKU RSP and Price/L indexed against nearest competitor SKUs at comparable pack sizes</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Own SKU</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Brand</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">RSP</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">PPL</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">GP%</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Elasticity</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Competitor</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Comp. RSP</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Comp. PPL</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Price Gap</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">PPL Gap</th>
                  <th className="py-2 px-2 text-left text-zinc-500 font-medium">Comp. Share</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, ri) => (
                  row.competitors.map((comp, ci) => (
                    <tr key={`${ri}-${ci}`} className={cn("border-b border-zinc-800/30 hover:bg-zinc-800/20", ci === 0 && ri > 0 && "border-t border-zinc-700/50")}>
                      {ci === 0 ? (
                        <>
                          <td className="py-2 px-2 text-zinc-200 font-medium" rowSpan={row.competitors.length}>{row.own.sku}</td>
                          <td className="py-2 px-2" rowSpan={row.competitors.length}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors[row.own.brand] }} />
                              <span className="text-zinc-300">{row.own.brand}</span>
                            </span>
                          </td>
                          <td className="py-2 px-2 text-zinc-200 font-mono font-semibold" rowSpan={row.competitors.length}>{"\u20ac"}{row.own.rsp.toFixed(2)}</td>
                          <td className="py-2 px-2 text-zinc-200 font-mono" rowSpan={row.competitors.length}>{"\u20ac"}{row.own.ppl.toFixed(2)}</td>
                          <td className="py-2 px-2 text-zinc-200 font-mono" rowSpan={row.competitors.length}>{row.own.gpMargin}%</td>
                          <td className="py-2 px-2" rowSpan={row.competitors.length}>
                            {(() => {
                              const e = getElasticityLabel(row.own.elasticity)
                              return (
                                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium", e.bg, e.color)}>
                                  {row.own.elasticity.toFixed(1)}
                                  <span className="text-[8px] opacity-70">{e.label}</span>
                                </span>
                              )
                            })()}
                          </td>
                        </>
                      ) : null}
                      <td className="py-2 px-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: compBrandColors[comp.brand] || "#666" }} />
                          <span className="text-zinc-400">{comp.sku}</span>
                        </span>
                      </td>
                      <td className="py-2 px-2 text-zinc-400 font-mono">{"\u20ac"}{comp.rsp.toFixed(2)}</td>
                      <td className="py-2 px-2 text-zinc-400 font-mono">{"\u20ac"}{comp.ppl.toFixed(2)}</td>
                      <td className="py-2 px-2">
                        <span className={cn("font-mono font-semibold inline-flex items-center gap-0.5", comp.priceDelta > 0 ? "text-emerald-400" : "text-red-400")}>
                          {comp.priceDelta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {comp.priceDelta > 0 ? "+" : ""}{comp.priceDelta}%
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className={cn("font-mono", comp.pplDelta > 0 ? "text-emerald-400" : "text-red-400")}>
                          {comp.pplDelta > 0 ? "+" : ""}{comp.pplDelta}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-zinc-400 font-mono">{comp.marketShare}%</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
