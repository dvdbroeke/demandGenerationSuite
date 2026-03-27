"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { skuMaster, allBrands, allRoles } from "../shared-sku-data"

// Mix sub-navigation type (Assortment & Mix screens only)
export type MixScreen = "market-opportunities" | "portfolio-quality" | "assortment-share" | "simulate-forecast"

const geographyOptions = ["Italy", "France", "Spain", "Germany", "UK"]
const brandOptions = ["All Brands", ...allBrands]
const channelOptions = ["All Channels", "Convenience", "Modern Trade"]
const retailerOptions = ["All Retailers", "Esselunga", "Conad", "Coop Italia", "Carrefour IT", "Eurospin"]

const priceTiers = ["Premium", "Core", "Traffic"] as const

const aiInsights = [
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Premium tier delivers 45% of revenue from 25% of units -- highest margin density. Shifting just 3pp of volume from Traffic to Premium would add \u20ac1.2M in GP annually." },
  { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Traffic tier is over-indexed on volume (30% units) vs revenue (20%). Revenue-per-litre in Traffic is \u20ac0.65 vs \u20ac1.82 in Premium -- a 2.8x margin gap." },
  { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", text: "Mix has shifted -1.4pp towards Traffic in last 6 months driven by promotional depth on multi-serve. Reducing promo frequency on 1.75L/2L would stabilise mix." },
  { icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10", text: "Brand A Zero and Brand A Classic single-serve show 8-15% growth with premium PPL. These are the strongest mix-upgrade candidates: promoting single-serve in convenience drives +0.8pp premium mix shift." },
]

export function MixPerformance({ onNavigate }: Props) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedChannel, setSelectedChannel] = useState("All Channels")
  const [selectedGeography, setSelectedGeography] = useState("Italy")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [sortCol, setSortCol] = useState<"revM" | "gpMargin" | "ppl" | "distribution">("revM")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filtered = useMemo(() => {
    let data = [...skuMaster]
    if (selectedBrand !== "All Brands") data = data.filter(d => d.brand === selectedBrand)
    if (selectedChannel !== "All Channels") data = data.filter(d => selectedChannel === "Convenience" ? d.distribution >= 76 : d.distribution < 90)
    return data
  }, [selectedBrand, selectedChannel])

  // Revenue mix by price tier
  const tierMix = useMemo(() => {
    const totRev = filtered.reduce((s, d) => s + d.revM, 0)
    const totUnits = filtered.reduce((s, d) => s + d.velocity * d.distribution, 0)
    return priceTiers.map(tier => {
      const tierSkus = filtered.filter(d => d.role === tier)
      const rev = tierSkus.reduce((s, d) => s + d.revM, 0)
      const units = tierSkus.reduce((s, d) => s + d.velocity * d.distribution, 0)
      const avgPPL = tierSkus.length > 0 ? tierSkus.reduce((s, d) => s + d.ppl * d.revM, 0) / (rev || 1) : 0
      const avgMargin = tierSkus.length > 0 ? tierSkus.reduce((s, d) => s + d.gpMargin * d.revM, 0) / (rev || 1) : 0
      return {
        tier,
        revPct: totRev > 0 ? Math.round((rev / totRev) * 100) : 0,
        unitsPct: totUnits > 0 ? Math.round((units / totUnits) * 100) : 0,
        avgPPL: Math.round(avgPPL * 100) / 100,
        avgMargin: Math.round(avgMargin),
        revM: rev,
        skuCount: tierSkus.length,
        // Mix shift vs prior period (mock)
        mixShift: tier === "Premium" ? -0.8 : tier === "Core" ? 0.4 : 0.4,
      }
    })
  }, [filtered])

  // SKU sorted for the mix contribution table
  const sortedSkus = useMemo(() => {
    const data = filtered.map(d => ({
      ...d,
      revContrib: filtered.reduce((s, f) => s + f.revM, 0) > 0 ? (d.revM / filtered.reduce((s, f) => s + f.revM, 0)) * 100 : 0,
    }))
    data.sort((a, b) => {
      const aVal = sortCol === "ppl" ? a.ppl : (a as never)[sortCol]
      const bVal = sortCol === "ppl" ? b.ppl : (b as never)[sortCol]
      return sortDir === "desc" ? bVal - aVal : aVal - bVal
    })
    return data
  }, [filtered, sortCol, sortDir])

  function handleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortCol(col); setSortDir("desc") }
  }

  const totalRev = filtered.reduce((s, d) => s + d.revM, 0)
  const weightedPPL = totalRev > 0 ? filtered.reduce((s, d) => s + d.ppl * d.revM, 0) / totalRev : 0
  const weightedMargin = totalRev > 0 ? filtered.reduce((s, d) => s + d.gpMargin * d.revM, 0) / totalRev : 0

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "mix-performance" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { val: selectedGeography, set: setSelectedGeography, opts: geographyOptions, label: "Geography" },
          { val: selectedBrand, set: setSelectedBrand, opts: brandOptions, label: "Brand" },
          { val: selectedChannel, set: setSelectedChannel, opts: channelOptions, label: "Channel" },
          { val: selectedRetailer, set: setSelectedRetailer, opts: retailerOptions, label: "Retailer" },
        ].map((f, fi) => (
          <div key={fi} className="flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500 font-medium">{f.label}</span>
            <Select value={f.val} onValueChange={f.set}>
              <SelectTrigger className="h-7 w-[130px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">{f.opts.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Weighted Avg PPL</p>
            <p className="text-2xl font-bold text-zinc-100">{"\u20ac"}{weightedPPL.toFixed(2)}</p>
            <p className="text-[9px] text-amber-400 mt-0.5">-\u20ac0.04 vs prior period</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Weighted Avg Margin</p>
            <p className="text-2xl font-bold text-zinc-100">{Math.round(weightedMargin)}%</p>
            <p className="text-[9px] text-red-400 mt-0.5">-0.3pp vs prior period</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Premium Mix Share</p>
            <p className="text-2xl font-bold text-zinc-100">{tierMix.find(t => t.tier === "Premium")?.revPct || 0}%</p>
            <p className="text-[9px] text-red-400 mt-0.5">-0.8pp mix shift</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Mix Upgrade Opportunity</p>
            <p className="text-2xl font-bold text-emerald-400">{"\u20ac"}1.2M</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">If +3pp shift to Premium</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier mix breakdown + AI */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50 col-span-2">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Revenue Mix by Price Tier</h3>
            <p className="text-[10px] text-zinc-500 mb-5">Revenue share, unit share, PPL and margin by tier -- track mix shift over time</p>

            <div className="space-y-6">
              {tierMix.map(t => (
                <div key={t.tier}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-zinc-200">{t.tier}</p>
                      <span className="text-[9px] text-zinc-500">{t.skuCount} SKUs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-zinc-500">{"\u20ac"}{t.avgPPL}/L</span>
                      <span className="text-[9px] text-zinc-500">{t.avgMargin}% margin</span>
                      <Badge className={cn("text-[8px] py-0 h-4", t.mixShift > 0 ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-red-500/15 text-red-300 border-red-500/30")}>
                        {t.mixShift > 0 ? "+" : ""}{t.mixShift}pp
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Revenue share */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-red-400">Revenue Share</span>
                        <span className="text-[10px] font-mono text-zinc-300">{t.revPct}%</span>
                      </div>
                      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${t.revPct}%` }} />
                      </div>
                    </div>
                    {/* Unit share */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-zinc-400">Unit Share</span>
                        <span className="text-[10px] font-mono text-zinc-300">{t.unitsPct}%</span>
                      </div>
                      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-500 rounded-full transition-all" style={{ width: `${t.unitsPct}%` }} />
                      </div>
                    </div>
                  </div>
                  {/* Revenue vs Unit gap */}
                  <div className="mt-1">
                    <p className="text-[9px] text-zinc-500">
                      {t.revPct > t.unitsPct
                        ? `Revenue-led: earns ${t.revPct - t.unitsPct}pp more revenue share than volume -- high-value tier`
                        : t.revPct < t.unitsPct
                        ? `Volume-led: ${t.unitsPct - t.revPct}pp more volume than revenue -- margin dilution`
                        : "Balanced: revenue and volume share aligned"
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stacked mix bar */}
            <div className="mt-6 pt-4 border-t border-zinc-800/50">
              <p className="text-[10px] text-zinc-500 mb-2">Revenue Mix Composition</p>
              <div className="h-6 bg-zinc-800 rounded-full overflow-hidden flex">
                {tierMix.map((t, i) => (
                  <div key={t.tier} className="h-full transition-all flex items-center justify-center" style={{
                    width: `${t.revPct}%`,
                    backgroundColor: i === 0 ? "#dc2626" : i === 1 ? "#3b82f6" : "#52525b",
                  }}>
                    {t.revPct > 10 && <span className="text-[8px] text-white font-bold">{t.tier} {t.revPct}%</span>}
                  </div>
                ))}
              </div>
            </div>
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

      {/* SKU Mix contribution table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-1">SKU Mix Contribution</h3>
          <p className="text-[10px] text-zinc-500 mb-3">Revenue contribution, price-per-litre, and margin by SKU -- sorted to identify mix upgrade opportunities</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">SKU</th>
                  <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Brand</th>
                  <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Tier</th>
                  <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("revM")}>
                    <span className="flex items-center gap-0.5">Revenue {"\u20ac"}M <ArrowUpDown className="h-2.5 w-2.5" /></span>
                  </th>
                  <th className="py-2 px-1.5 text-zinc-500 font-medium">Rev Mix %</th>
                  <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("ppl")}>
                    <span className="flex items-center gap-0.5">PPL {"\u20ac"} <ArrowUpDown className="h-2.5 w-2.5" /></span>
                  </th>
                  <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("gpMargin")}>
                    <span className="flex items-center gap-0.5">GP Margin % <ArrowUpDown className="h-2.5 w-2.5" /></span>
                  </th>
                  <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("distribution")}>
                    <span className="flex items-center gap-0.5">Distrib. % <ArrowUpDown className="h-2.5 w-2.5" /></span>
                  </th>
                  <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Growth</th>
                  <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Mix Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedSkus.slice(0, 20).map((d, i) => {
                  const mixAction = d.role === "Premium" && d.distribution < 70 ? "Expand distribution" :
                    d.role === "Traffic" && d.gpMargin < 32 ? "Reduce promo depth" :
                    d.role === "Core" && d.volGrowth > 5 ? "Upgrade to Premium" :
                    d.role === "Premium" ? "Maintain / grow" : "Monitor"
                  return (
                    <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20">
                      <td className="py-2 px-1.5 text-zinc-200 font-medium whitespace-nowrap">{d.sku}</td>
                      <td className="py-2 px-1.5 text-zinc-400">{d.brand}</td>
                      <td className="py-2 px-1.5">
                        <Badge className={cn("text-[8px] py-0 h-4", d.role === "Premium" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : d.role === "Core" ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-zinc-500/15 text-zinc-300 border-zinc-500/30")}>{d.role}</Badge>
                      </td>
                      <td className="py-2 px-1.5 text-zinc-200 font-mono font-bold">{"\u20ac"}{d.revM.toFixed(1)}M</td>
                      <td className="py-2 px-1.5 text-zinc-300 font-mono">{d.revContrib.toFixed(1)}%</td>
                      <td className="py-2 px-1.5 text-zinc-200 font-mono">{"\u20ac"}{d.ppl.toFixed(2)}</td>
                      <td className="py-2 px-1.5 text-zinc-300 font-mono">{d.gpMargin}%</td>
                      <td className="py-2 px-1.5 text-zinc-300 font-mono">{d.distribution}%</td>
                      <td className={cn("py-2 px-1.5 font-mono", d.volGrowth >= 0 ? "text-emerald-400" : "text-red-400")}>{d.volGrowth > 0 ? "+" : ""}{d.volGrowth}%</td>
                      <td className="py-2 px-1.5">
                        <Badge className={cn("text-[7px] py-0 h-3.5",
                          mixAction === "Expand distribution" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                          mixAction === "Reduce promo depth" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
                          mixAction === "Upgrade to Premium" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" :
                          mixAction === "Maintain / grow" ? "bg-blue-500/15 text-blue-300 border-blue-500/30" :
                          "bg-zinc-500/15 text-zinc-300 border-zinc-500/30"
                        )}>{mixAction}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
