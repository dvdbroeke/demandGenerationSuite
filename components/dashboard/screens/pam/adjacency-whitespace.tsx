"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, AlertTriangle, Search, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PAMScreen } from "./assortment-productivity"

interface Props { onNavigate?: (screen: PAMScreen) => void }

const tabs: { id: PAMScreen; label: string }[] = [
  { id: "assortment-productivity", label: "Assortment Productivity" },
  { id: "adjacency-whitespace", label: "Adjacency & Whitespace" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

// ---------- Price Tier Partition Data ----------

type PriceTier = { tier: string; rangeMin: number; rangeMax: number; skuCount: number; skus: string[]; shareOfShelf: number; revShare: number; status: "Gap" | "Crowded" | "Balanced"; insight: string }

const priceTiers: PriceTier[] = [
  { tier: "Value (<\u20ac1.00)", rangeMin: 0.60, rangeMax: 0.99, skuCount: 0, skus: [], shareOfShelf: 0, revShare: 0, status: "Gap", insight: "No presence in value tier -- \u20ac1.8M addressable market from price-sensitive shoppers trading to PL" },
  { tier: "Mainstream (\u20ac1.00-\u20ac1.29)", rangeMin: 1.00, rangeMax: 1.29, skuCount: 4, skus: ["Brand C 330ml (\u20ac1.19)","Brand D 330ml (\u20ac1.25)","Brand B 330ml (\u20ac1.29)","Brand A 330ml (\u20ac1.35)"], shareOfShelf: 35, revShare: 32, status: "Crowded", insight: "4 SKUs competing within \u20ac0.16 band -- high internal overlap. Brand A & Brand B at parity encourages unintended switching" },
  { tier: "Mid (\u20ac1.30-\u20ac1.69)", rangeMin: 1.30, rangeMax: 1.69, skuCount: 5, skus: ["Brand B 330ml (\u20ac1.39)","Brand C 500ml (\u20ac1.65)","Brand D 500ml (\u20ac1.69)","Brand C 1.5L (\u20ac1.79)","Brand B 500ml (\u20ac1.79)"], shareOfShelf: 22, revShare: 24, status: "Balanced", insight: "Adequate coverage -- Brand B well-positioned as trading-up option from Mainstream. Brand C 500ml underperforms at this tier" },
  { tier: "Upper Mid (\u20ac1.70-\u20ac1.99)", rangeMin: 1.70, rangeMax: 1.99, skuCount: 5, skus: ["Brand A 500ml (\u20ac1.89)","Brand D 2L (\u20ac1.89)","Brand B 500ml (\u20ac1.95)","Brand B 1.5L (\u20ac1.99)","Brand A 1.5L (\u20ac2.15)"], shareOfShelf: 28, revShare: 26, status: "Crowded", insight: "5 SKUs in tight range. Brand B 1.5L & Brand D 2L weakest performers -- 2L PET cannibalised by 1.5L at similar price point" },
  { tier: "Take Home (\u20ac2.00-\u20ac2.29)", rangeMin: 2.00, rangeMax: 2.29, skuCount: 4, skus: ["Brand B 1.5L (\u20ac2.19)","Brand A 2L (\u20ac2.19)","Brand B 2L (\u20ac2.15)","Brand A 1.5L (\u20ac2.15)"], shareOfShelf: 12, revShare: 14, status: "Balanced", insight: "Take-home tier is well-spaced, but Brand B 2L at only 58% distribution represents an expansion opportunity" },
  { tier: "Multipack (>\u20ac3.50)", rangeMin: 3.50, rangeMax: 5.00, skuCount: 2, skus: ["Brand A 6x330ml (\u20ac4.00)","Brand B 6x330ml (\u20ac4.20)"], shareOfShelf: 8, revShare: 12, status: "Gap", insight: "Only 2 multipack SKUs -- whitespace for Brand D/Brand C 6x330ml or 12-pack formats to capture \u20ac3.2M bulk-buy occasion" },
]

// ---------- Cross-Elasticity Matrix ----------

type XElasticity = { from: string; to: string; elasticity: number }

const crossElasticities: XElasticity[] = [
  { from: "Brand A 330ml", to: "Brand B 330ml", elasticity: -0.22 },
  { from: "Brand A 330ml", to: "Brand B 330ml", elasticity: -0.15 },
  { from: "Brand A 330ml", to: "Competitor X 330ml", elasticity: -0.35 },
  { from: "Brand A 500ml", to: "Brand A 330ml", elasticity: -0.18 },
  { from: "Brand A 500ml", to: "Brand A 1.5L", elasticity: -0.14 },
  { from: "Brand A 500ml", to: "Competitor X 500ml", elasticity: -0.30 },
  { from: "Brand A 1.5L", to: "Brand A 2L", elasticity: -0.32 },
  { from: "Brand A 2L", to: "Brand A 1.5L", elasticity: -0.28 },
  { from: "Brand A 2L", to: "Competitor X 2L", elasticity: -0.38 },
  { from: "Brand A 6x330ml", to: "Brand A 330ml", elasticity: -0.24 },
  { from: "Brand A 6x330ml", to: "Competitor X 6-pack", elasticity: -0.32 },
  { from: "Brand B 330ml", to: "Brand B 330ml", elasticity: -0.42 },
  { from: "Brand B 330ml", to: "Brand A 330ml", elasticity: -0.12 },
  { from: "Brand B 330ml", to: "Competitor X Max 330ml", elasticity: -0.28 },
  { from: "Brand B 500ml", to: "Brand B 500ml", elasticity: -0.32 },
  { from: "Brand B 1.5L", to: "Brand A 1.5L", elasticity: -0.22 },
  { from: "Brand B 2L", to: "Brand B 1.5L", elasticity: -0.26 },
  { from: "Brand B 2L", to: "Brand A 2L", elasticity: -0.18 },
  { from: "Brand B 6x330ml", to: "Brand B 330ml", elasticity: -0.20 },
  { from: "Brand B 6x330ml", to: "Brand A 6x330ml", elasticity: -0.15 },
  { from: "Brand B 330ml", to: "Brand B 330ml", elasticity: -0.38 },
  { from: "Brand B 330ml", to: "Competitor X Max 330ml", elasticity: -0.25 },
  { from: "Brand B 500ml", to: "Brand B 500ml", elasticity: -0.32 },
  { from: "Brand B 500ml", to: "Brand A 500ml", elasticity: -0.10 },
  { from: "Brand B 1.5L", to: "Brand B 1.5L", elasticity: -0.30 },
  { from: "Brand B 1.5L", to: "Brand A 1.5L", elasticity: -0.16 },
  { from: "Brand D 330ml", to: "Brand D 330ml", elasticity: -0.20 },
  { from: "Brand D 330ml", to: "Competitor Y (Comp)", elasticity: -0.15 },
  { from: "Brand D 500ml", to: "Brand D 330ml", elasticity: -0.18 },
  { from: "Brand D 2L", to: "Brand D 500ml", elasticity: -0.24 },
  { from: "Brand D 2L", to: "Competitor Z 2L (Comp)", elasticity: -0.20 },
  { from: "Brand D 330ml", to: "Brand D 330ml", elasticity: -0.18 },
  { from: "Brand D 500ml", to: "Brand D 500ml", elasticity: -0.22 },
  { from: "Brand D 1.5L", to: "Brand D 500ml", elasticity: -0.16 },
  { from: "Brand D 1.5L", to: "Competitor W 1.5L (Comp)", elasticity: -0.28 },
]

const retailerOptions = ["All Retailers","Esselunga","Conad","Coop Italia","Carrefour IT","Eurospin","Lidl IT","PAM","Despar"]
const channelOptions = ["All Channels","Convenience","Modern Trade"]

const aiInsights = [
  { icon: Search, color: "text-blue-400", bg: "bg-blue-500/10", text: "Value tier (\u003c\u20ac1.00) is a complete whitespace -- PL colas capture 14% share in this band. A \u20ac0.89 PMP 330ml Brand D or Brand C would address \u20ac1.8M opportunity without cannibalising core." },
  { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Mainstream tier is over-crowded: 4 SKUs within \u20ac0.10. Brand A 330ml and Brand B 330ml at identical \u20ac1.29 creates -0.15 cross-elasticity. Recommend \u20ac0.10 separation." },
  { icon: Layers, color: "text-purple-400", bg: "bg-purple-500/10", text: "Multipack tier is severely under-represented: only Brand A & Brand B 6x330ml. Brand D/Brand C 6x330ml or 12-pack formats would capture \u20ac3.2M addressable bulk-buy occasion." },
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Cross-elasticity shows Brand B \u2192 Brand B substitution is -0.42, the strongest internal pair. Pricing Brand B \u20ac0.10 below Brand B would reduce cannib by ~8pp and protect both tiers." },
]

// ---------- Component ----------

export function PAMAdjacencyWhitespace({ onNavigate }: Props) {
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedChannel, setSelectedChannel] = useState("All Channels")
  const [viewMode, setViewMode] = useState<"tiers" | "matrix">("tiers")

  // Filter cross-elasticity by internal vs competitor
  const [xeFilter, setXeFilter] = useState<"all" | "internal" | "competitor">("all")
  const filteredXE = useMemo(() => {
    const compKeywords = ["Competitor X", "Comp", "PL", "Monster"]
    if (xeFilter === "internal") return crossElasticities.filter(x => !compKeywords.some(k => x.to.includes(k)))
    if (xeFilter === "competitor") return crossElasticities.filter(x => compKeywords.some(k => x.to.includes(k)))
    return crossElasticities
  }, [xeFilter])

  // Retailer multipliers for tier data
  const retMult: Record<string, number> = { Esselunga: 1.0, Conad: 1.02, "Coop Italia": 0.96, "Carrefour IT": 0.98, Eurospin: 0.88, "Lidl IT": 0.90, PAM: 1.04, Despar: 0.95 }
  const mult = selectedRetailer !== "All Retailers" ? (retMult[selectedRetailer] ?? 1) : 1

  const adjustedTiers = useMemo(() => {
    return priceTiers.map(t => ({
      ...t,
      shareOfShelf: Math.round(t.shareOfShelf * (mult > 1 ? 1 + (mult - 1) * 0.3 : 1 - (1 - mult) * 0.3)),
      revShare: Math.round(t.revShare * mult),
    }))
  }, [mult])

  const statusColor: Record<string, { bg: string; text: string; border: string }> = {
    Gap: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
    Crowded: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
    Balanced: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  }

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "adjacency-whitespace" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{retailerOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{channelOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          {(["tiers", "matrix"] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)} className={cn("px-3 py-1 rounded text-[10px] font-medium border transition-colors", viewMode === m ? "bg-red-500/15 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
              {m === "tiers" ? "Price Tier Map" : "Cross-Elasticity Matrix"}
            </button>
          ))}
        </div>
      </div>

      {/* Tier summary cards */}
      <div className="grid grid-cols-5 gap-3">
        {adjustedTiers.map(t => {
          const sc = statusColor[t.status]
          return (
            <Card key={t.tier} className={cn("border-zinc-800/50", sc.bg)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={cn("text-[8px] py-0 h-4", sc.bg, sc.text, sc.border)}>{t.status}</Badge>
                  <span className="text-lg font-bold text-zinc-100">{t.skuCount}</span>
                </div>
                <p className="text-[10px] text-zinc-300 font-medium mb-1">{t.tier}</p>
                <div className="flex items-center gap-3 text-[9px] text-zinc-500">
                  <span>{t.shareOfShelf}% shelf</span>
                  <span>{t.revShare}% rev</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {viewMode === "tiers" ? (
        <>
          {/* Price tier ladder visual */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-4">Price Tier Partition Analysis</h3>
              <div className="space-y-3">
                {adjustedTiers.map(t => {
                  const sc = statusColor[t.status]
                  return (
                    <div key={t.tier} className="flex items-start gap-4">
                      <div className="w-[160px] flex-shrink-0 text-right">
                        <p className="text-[10px] text-zinc-300 font-medium">{t.tier}</p>
                        <p className="text-[9px] text-zinc-600">{"\u20ac"}{t.rangeMin.toFixed(2)} - {"\u20ac"}{t.rangeMax.toFixed(2)}</p>
                      </div>
                      <div className="flex-1">
                        {/* Share of shelf bar */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex-1 h-6 bg-zinc-800/30 rounded relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 rounded transition-all" style={{ width: `${t.shareOfShelf}%`, backgroundColor: t.status === "Gap" ? "#ef4444" : t.status === "Crowded" ? "#f59e0b" : "#22c55e", opacity: 0.4 }} />
                            {t.skus.length > 0 ? (
                              <div className="absolute inset-0 flex items-center px-2 gap-2 overflow-x-auto">
                                {t.skus.map(s => (
                                  <span key={s} className="text-[9px] text-zinc-300 whitespace-nowrap bg-zinc-800/60 px-1.5 py-0.5 rounded">{s}</span>
                                ))}
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] text-red-400/60 font-medium">WHITESPACE</span>
                              </div>
                            )}
                          </div>
                          <Badge className={cn("text-[8px] py-0 h-4 flex-shrink-0", sc.bg, sc.text, sc.border)}>{t.shareOfShelf}%</Badge>
                        </div>
                        <p className="text-[9px] text-zinc-500 leading-relaxed">{t.insight}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-[9px] text-zinc-500">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-red-500/40" />Gap / Whitespace</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-amber-500/40" />Crowded</span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-500/40" />Balanced</span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Cross-elasticity matrix */}
          <Card className="bg-zinc-900/50 border-zinc-800/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Cross-Elasticity Patterns</h3>
                  <p className="text-[10px] text-zinc-500">How a price increase on SKU A shifts volume to SKU B (negative = substitution)</p>
                </div>
                <div className="flex items-center gap-2">
                  {(["all","internal","competitor"] as const).map(f => (
                    <button key={f} onClick={() => setXeFilter(f)} className={cn("px-2.5 py-1 rounded text-[10px] font-medium border transition-colors", xeFilter === f ? "bg-red-500/15 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
                      {f === "all" ? "All Pairs" : f === "internal" ? "Internal Only" : "vs Competitors"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead><tr className="border-b border-zinc-800">
                    <th className="py-2 px-2 text-left text-zinc-500 font-medium">If price rises on...</th>
                    <th className="py-2 px-2 text-left text-zinc-500 font-medium">Volume shifts to...</th>
                    <th className="py-2 px-2 text-left text-zinc-500 font-medium">Cross-Elasticity</th>
                    <th className="py-2 px-2 text-left text-zinc-500 font-medium">Severity</th>
                    <th className="py-2 px-2 text-left text-zinc-500 font-medium">Interpretation</th>
                  </tr></thead>
                  <tbody>
                    {filteredXE.sort((a, b) => a.elasticity - b.elasticity).map((x, i) => {
                      const sev = Math.abs(x.elasticity) >= 0.35 ? "High" : Math.abs(x.elasticity) >= 0.20 ? "Moderate" : "Low"
                      const sevC = sev === "High" ? "bg-red-500/15 text-red-300 border-red-500/30" : sev === "Moderate" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      const isInternal = !["Competitor X","Comp","PL","Monster"].some(k => x.to.includes(k))
                      return (
                        <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20">
                          <td className="py-2 px-2 text-zinc-200 font-medium">{x.from}</td>
                          <td className="py-2 px-2 text-zinc-300">
                            {x.to}
                            {!isInternal && <Badge className="ml-1.5 text-[7px] py-0 h-3.5 bg-zinc-700/50 text-zinc-400 border-zinc-600">COMP</Badge>}
                          </td>
                          <td className={cn("py-2 px-2 font-mono font-bold", Math.abs(x.elasticity) >= 0.35 ? "text-red-400" : Math.abs(x.elasticity) >= 0.20 ? "text-amber-400" : "text-emerald-400")}>
                            {x.elasticity.toFixed(2)}
                          </td>
                          <td className="py-2 px-2"><Badge className={cn("text-[8px] py-0 h-4", sevC)}>{sev}</Badge></td>
                          <td className="py-2 px-2 text-zinc-400">
                            {Math.abs(x.elasticity) >= 0.35 ? "Strong substitution -- pricing must be coordinated" : Math.abs(x.elasticity) >= 0.20 ? "Moderate overlap -- monitor during price changes" : "Low risk -- independent demand"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[9px] text-zinc-500">
                <span>More negative = stronger substitution when source SKU price rises</span>
                <span className="flex items-center gap-1"><Badge className="bg-red-500/15 text-red-300 border-red-500/30 text-[8px] py-0 h-3.5">High</Badge> |x| {">="} 0.35</span>
                <span className="flex items-center gap-1"><Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30 text-[8px] py-0 h-3.5">Mod</Badge> |x| {">="} 0.20</span>
                <span className="flex items-center gap-1"><Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[8px] py-0 h-3.5">Low</Badge> |x| {"<"} 0.20</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* AI Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-red-400" /><h3 className="text-sm font-semibold text-zinc-100">AI Insights -- Whitespace & Overlap</h3></div>
          <div className="grid grid-cols-2 gap-3">
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
  )
}
