"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { skuMaster, allBrands, allRoles } from "../shared-sku-data"

// PAM sub-navigation type
export type PAMScreen = "assortment-productivity" | "adjacency-whitespace" | "simulate-forecast"

interface Props { onNavigate?: (screen: PAMScreen) => void }

const tabs: { id: PAMScreen; label: string }[] = [
  { id: "assortment-productivity", label: "Assortment Productivity" },
  { id: "adjacency-whitespace", label: "Adjacency & Whitespace" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

// ---------- Derived data ----------

const geographyOptions = ["Italy", "France", "Spain", "Germany", "UK"]
const brandOptions = ["All Brands", ...allBrands]
const tierOptions = ["All Tiers", ...allRoles]
const channelOptions = ["All Channels", "Convenience", "Modern Trade"]
const retailerOptions = ["All Retailers", "Esselunga", "Conad", "Coop Italia", "Carrefour IT", "Eurospin"]

// Price tiers
const priceTiers = ["Premium", "Core", "Traffic"] as const
type PriceTier = (typeof priceTiers)[number]

// Assign each SKU a classification based on revenue rank
function classifySku(skus: typeof skuMaster) {
  const sorted = [...skus].sort((a, b) => b.revM - a.revM)
  const total = sorted.length
  return sorted.map((s, i) => {
    const rank = i / total
    const classification = rank < 0.2 ? "Top 20%" : rank < 0.8 ? "Middle 60%" : "Bottom 20%"
    return { ...s, classification }
  })
}

const aiInsights = [
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Premium tier delivers 45% of revenue on only 25% of units -- highest margin density. Focus distribution expansion on premium single-serve SKUs where current weighted distribution is below 50%." },
  { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Traffic tier contributes 20% of revenue but accounts for 30% of units -- margin dilution risk. Consider rationalizing multi-serve 1.75L packs across Brand D and Brand E where velocity is below 1.0 units/WD%." },
  { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", text: "Bottom 20% of SKUs generate only 7% of total revenue. Delisting lowest-velocity traffic packs (18x330ml across brands) could free 12% of shelf space for high-performing core and premium SKUs." },
  { icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10", text: "Brand A and Brand B single-serve formats (150ml, 250ml) show 8-15% volume growth YoY with cannibalization under 4%. These are the strongest candidates for expanded distribution and increased shelf allocation." },
]

// ---------- Component ----------

export function PAMAssortmentProductivity({ onNavigate }: Props) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedTier, setSelectedTier] = useState("All Tiers")
  const [selectedChannel, setSelectedChannel] = useState("All Channels")
  const [selectedGeography, setSelectedGeography] = useState("Italy")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [metricView, setMetricView] = useState<"revenue" | "units" | "margin">("revenue")
  const [sortCol, setSortCol] = useState<"revM" | "units" | "gpMargin" | "gpPerStore" | "distribution">("revM")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filtered = useMemo(() => {
    let data = [...skuMaster]
    if (selectedBrand !== "All Brands") data = data.filter(d => d.brand === selectedBrand)
    if (selectedTier !== "All Tiers") data = data.filter(d => d.role === selectedTier)
    if (selectedChannel !== "All Channels") data = data.filter(d => selectedChannel === "Convenience" ? d.distribution >= 76 : d.distribution < 90)
    return data
  }, [selectedBrand, selectedTier, selectedChannel])

  const classified = useMemo(() => classifySku(filtered), [filtered])

  const sortedSkus = useMemo(() => {
    const data = [...classified]
    data.sort((a, b) => {
      const aVal = sortCol === "units" ? a.velocity * a.distribution : (a as never)[sortCol]
      const bVal = sortCol === "units" ? b.velocity * b.distribution : (b as never)[sortCol]
      return sortDir === "desc" ? bVal - aVal : aVal - bVal
    })
    return data
  }, [classified, sortCol, sortDir])

  // Category performance by price tier
  const categoryPerf = useMemo(() => {
    const totRev = filtered.reduce((s, d) => s + d.revM, 0)
    const totUnits = filtered.reduce((s, d) => s + d.velocity * d.distribution, 0)
    const totMarginWeighted = filtered.reduce((s, d) => s + d.gpMargin * d.revM, 0)

    return priceTiers.map(tier => {
      const tierSkus = filtered.filter(d => d.role === tier)
      const rev = tierSkus.reduce((s, d) => s + d.revM, 0)
      const units = tierSkus.reduce((s, d) => s + d.velocity * d.distribution, 0)
      const marginW = tierSkus.length > 0 ? tierSkus.reduce((s, d) => s + d.gpMargin * d.revM, 0) / (rev || 1) : 0
      return {
        tier,
        revPct: totRev > 0 ? Math.round((rev / totRev) * 100) : 0,
        unitsPct: totUnits > 0 ? Math.round((units / totUnits) * 100) : 0,
        marginPct: Math.round(marginW),
        revM: rev,
        skuCount: tierSkus.length,
      }
    })
  }, [filtered])

  // SKU performance distribution
  const skuDistribution = useMemo(() => {
    const total = classified.reduce((s, d) => s + d.revM, 0)
    const groups = [
      { label: "Top 20%", color: "#dc2626", items: classified.filter(d => d.classification === "Top 20%") },
      { label: "Middle 60%", color: "#52525b", items: classified.filter(d => d.classification === "Middle 60%") },
      { label: "Bottom 20%", color: "#a1a1aa", items: classified.filter(d => d.classification === "Bottom 20%") },
    ]
    return groups.map(g => ({
      ...g,
      pct: total > 0 ? Math.round((g.items.reduce((s, d) => s + d.revM, 0) / total) * 100) : 0,
      count: g.items.length,
    }))
  }, [classified])

  function handleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortCol(col); setSortDir("desc") }
  }

  const classColor: Record<string, { dot: string; bg: string; text: string }> = {
    "Top 20%": { dot: "bg-red-500", bg: "bg-red-500/15", text: "text-red-300" },
    "Middle 60%": { dot: "bg-zinc-500", bg: "bg-zinc-500/15", text: "text-zinc-300" },
    "Bottom 20%": { dot: "bg-zinc-600", bg: "bg-zinc-600/15", text: "text-zinc-400" },
  }

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "assortment-productivity" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {[
          { val: selectedGeography, set: setSelectedGeography, opts: geographyOptions, label: "Geography" },
          { val: selectedBrand, set: setSelectedBrand, opts: brandOptions, label: "Brand" },
          { val: selectedTier, set: setSelectedTier, opts: tierOptions, label: "Tier" },
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

      {/* Category Performance + SKU Performance Distribution */}
      <div className="grid grid-cols-3 gap-4">
        {/* Category Performance card */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 col-span-2">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">Category Performance</h3>
            <p className="text-[10px] text-zinc-500 mb-5">Revenue, units, and margin by price tier</p>

            <h4 className="text-xs font-semibold text-zinc-300 mb-4">Performance by Category</h4>
            <div className="space-y-6">
              {categoryPerf.map(t => (
                <div key={t.tier}>
                  <p className="text-xs font-semibold text-zinc-200 mb-0.5">{t.tier}</p>
                  <p className="text-[9px] text-zinc-500 mb-2">{t.skuCount} SKUs</p>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Revenue */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-red-400">Revenue</span>
                        <span className="text-[10px] font-mono text-zinc-300">{t.revPct}%</span>
                      </div>
                      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${t.revPct}%` }} />
                      </div>
                    </div>
                    {/* Units */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-zinc-400">Units</span>
                        <span className="text-[10px] font-mono text-zinc-300">{t.unitsPct}%</span>
                      </div>
                      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-500 rounded-full transition-all" style={{ width: `${t.unitsPct}%` }} />
                      </div>
                    </div>
                    {/* Margin */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-zinc-500">Margin</span>
                        <span className="text-[10px] font-mono text-zinc-300">{t.marginPct}%</span>
                      </div>
                      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-600 rounded-full transition-all" style={{ width: `${t.marginPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SKU Performance Distribution */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">SKU Performance Distribution</h3>
            <p className="text-[10px] text-zinc-500 mb-5">Revenue contribution by SKU performance tier</p>

            <h4 className="text-xs font-semibold text-zinc-300 mb-4">Revenue Distribution</h4>
            <div className="space-y-4">
              {skuDistribution.map(g => (
                <div key={g.label} className="flex items-center gap-3">
                  <span className={cn("w-3 h-3 rounded-full flex-shrink-0")} style={{ backgroundColor: g.color }} />
                  <span className="text-[11px] text-zinc-300 flex-1">{g.label}</span>
                  <span className="text-[11px] font-mono font-semibold text-zinc-200">{g.pct}%</span>
                </div>
              ))}
            </div>

            {/* Mini stacked bar */}
            <div className="mt-6 h-4 bg-zinc-800 rounded-full overflow-hidden flex">
              {skuDistribution.map(g => (
                <div key={g.label} className="h-full transition-all" style={{ width: `${g.pct}%`, backgroundColor: g.color }} />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-zinc-500">{filtered.length} SKUs total</span>
              <span className="text-[9px] text-zinc-500">{"\u20AC"}{filtered.reduce((s, d) => s + d.revM, 0).toFixed(1)}M total revenue</span>
            </div>

            {/* Metric toggle */}
            <div className="mt-5 border-t border-zinc-800 pt-4">
              <p className="text-[10px] text-zinc-500 mb-2">View by</p>
              <div className="flex gap-1">
                {(["revenue", "units", "margin"] as const).map(m => (
                  <button key={m} onClick={() => setMetricView(m)} className={cn("px-2.5 py-1 rounded text-[10px] font-medium border transition-colors", metricView === m ? "bg-red-500/15 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
                    {m === "revenue" ? "Revenue" : m === "units" ? "Units" : "Margin"}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SKU Detail Table + AI Insights */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50 col-span-2">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-1">SKU Classification Detail</h3>
            <p className="text-[10px] text-zinc-500 mb-3">All SKUs with revenue, units, margin contribution, and performance classification</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">SKU</th>
                    <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Brand</th>
                    <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Tier</th>
                    <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Classification</th>
                    <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("revM")}>
                      <span className="flex items-center gap-0.5">Revenue {"\u20AC"}M <ArrowUpDown className="h-2.5 w-2.5" /></span>
                    </th>
                    <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("units")}>
                      <span className="flex items-center gap-0.5">Units (vel{"\u00D7"}dist) <ArrowUpDown className="h-2.5 w-2.5" /></span>
                    </th>
                    <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("gpMargin")}>
                      <span className="flex items-center gap-0.5">GP Margin % <ArrowUpDown className="h-2.5 w-2.5" /></span>
                    </th>
                    <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("gpPerStore")}>
                      <span className="flex items-center gap-0.5">GP/Store <ArrowUpDown className="h-2.5 w-2.5" /></span>
                    </th>
                    <th className="py-2 px-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={() => handleSort("distribution")}>
                      <span className="flex items-center gap-0.5">Distrib. % <ArrowUpDown className="h-2.5 w-2.5" /></span>
                    </th>
                    <th className="py-2 px-1.5 text-left text-zinc-500 font-medium">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSkus.map((d, i) => {
                    const cc = classColor[d.classification] || classColor["Middle 60%"]
                    const unitProxy = Math.round(d.velocity * d.distribution)
                    return (
                      <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20">
                        <td className="py-2 px-1.5 text-zinc-200 font-medium whitespace-nowrap">{d.sku}</td>
                        <td className="py-2 px-1.5 text-zinc-400">{d.brand}</td>
                        <td className="py-2 px-1.5">
                          <Badge className={cn("text-[8px] py-0 h-4", d.role === "Premium" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : d.role === "Core" ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-zinc-500/15 text-zinc-300 border-zinc-500/30")}>{d.role}</Badge>
                        </td>
                        <td className="py-2 px-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={cn("w-2 h-2 rounded-full", cc.dot)} />
                            <Badge className={cn("text-[8px] py-0 h-4", cc.bg, cc.text)}>{d.classification}</Badge>
                          </div>
                        </td>
                        <td className="py-2 px-1.5 text-zinc-200 font-mono font-bold">{"\u20AC"}{d.revM.toFixed(1)}M</td>
                        <td className="py-2 px-1.5 text-zinc-300 font-mono">{unitProxy.toLocaleString()}</td>
                        <td className="py-2 px-1.5 text-zinc-300 font-mono">{d.gpMargin}%</td>
                        <td className="py-2 px-1.5 text-zinc-200 font-mono">{"\u20AC"}{d.gpPerStore.toLocaleString()}</td>
                        <td className="py-2 px-1.5 text-zinc-300 font-mono">{d.distribution}%</td>
                        <td className={cn("py-2 px-1.5 font-mono", d.volGrowth >= 0 ? "text-emerald-400" : "text-red-400")}>{d.volGrowth > 0 ? "+" : ""}{d.volGrowth}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-red-400" /><h3 className="text-sm font-semibold text-zinc-100">AI Insights</h3></div>
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
    </div>
  )
}
