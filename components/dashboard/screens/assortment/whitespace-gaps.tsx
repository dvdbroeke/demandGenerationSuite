"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, AlertTriangle, Search, Layers, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MixScreen } from "../mix/mix-performance"

interface Props { onNavigate?: (screen: MixScreen) => void }

const tabs: { id: MixScreen; label: string }[] = [
  { id: "market-opportunities", label: "Market Opportunities" },
  { id: "portfolio-quality", label: "Portfolio Quality" },
  { id: "assortment-share", label: "Assortment Share" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Whitespace opportunities mapped to consumer need-states
const whitespaceOpps = [
  {
    id: "ws-1",
    needState: "Weekly Stock-Up",
    gap: "Multipack formats for Fanta & Sprite",
    detail: "Only CC Classic and CC Zero 6x330ml exist. Fanta/Sprite multipacks would address bulk-buy occasion in Modern Trade.",
    addressableM: 3.2,
    effort: "Medium" as const,
    priority: "High" as const,
    packs: ["Fanta 6x330ml", "Sprite 6x330ml", "CC Classic 12x330ml"],
    channels: ["Modern Trade", "Ecommerce"],
    competitorPresence: "Pepsi has 4 multipack SKUs in this space",
  },
  {
    id: "ws-2",
    needState: "Value Seeker",
    gap: "No entry-point SKU below \u20ac1.00",
    detail: "Private label captures 14% share in value tier. A price-marked pack at \u20ac0.89 would defend against trade-down.",
    addressableM: 1.8,
    effort: "Low" as const,
    priority: "High" as const,
    packs: ["Fanta 330ml PMP", "Sprite 330ml PMP"],
    channels: ["Convenience", "Discount"],
    competitorPresence: "PL cola at \u20ac0.65-0.79 growing +8% YoY",
  },
  {
    id: "ws-3",
    needState: "Health-Conscious Choice",
    gap: "No zero-sugar Fanta or Sprite small-format",
    detail: "Zero-sugar segment growing +12% YoY. CC Zero well-positioned but Fanta Zero and Sprite Zero absent in 330ml/500ml.",
    addressableM: 2.1,
    effort: "Medium" as const,
    priority: "High" as const,
    packs: ["Fanta Zero 330ml", "Sprite Zero 330ml", "Fanta Zero 500ml"],
    channels: ["All Channels"],
    competitorPresence: "Pepsi Max flavoured variants gaining share",
  },
  {
    id: "ws-4",
    needState: "Premium Indulgence",
    gap: "Limited premium single-serve outside CC Classic",
    detail: "Only CC Classic 150ml glass available. No premium Fanta/Sprite single-serve for treat occasions.",
    addressableM: 0.9,
    effort: "High" as const,
    priority: "Medium" as const,
    packs: ["Fanta 250ml glass", "CC Zero 150ml glass"],
    channels: ["On-Premise", "Convenience"],
    competitorPresence: "San Pellegrino has 6 premium single-serve SKUs",
  },
  {
    id: "ws-5",
    needState: "Social Sharing",
    gap: "No party-size or premium multipack",
    detail: "2L PET is the only share-size option. No 8-pack or premium mixer-style packs for social occasions.",
    addressableM: 1.4,
    effort: "Medium" as const,
    priority: "Medium" as const,
    packs: ["CC Classic 8x200ml", "CC Zero 8x200ml"],
    channels: ["Modern Trade", "Ecommerce"],
    competitorPresence: "Schweppes mixer packs growing +15% in social occasion",
  },
  {
    id: "ws-6",
    needState: "Convenience Quick-Grab",
    gap: "Missing 250ml slim can for vending/checkout",
    detail: "330ml is current smallest can. 250ml slim would fit checkout and vending better with higher PPL.",
    addressableM: 0.6,
    effort: "Low" as const,
    priority: "Low" as const,
    packs: ["CC Classic 250ml slim", "CC Zero 250ml slim"],
    channels: ["Convenience", "Vending"],
    competitorPresence: "Red Bull dominates 250ml slim format",
  },
]

const aiInsights = [
  { icon: Search, color: "text-blue-400", bg: "bg-blue-500/10", text: "The 3 highest-priority whitespace gaps (multipacks, value tier, zero-sugar flavours) represent \u20ac7.1M combined addressable opportunity. Addressing all three would lift overall need-state coverage from 68% to 84%." },
  { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Value Seeker gap is the most urgent: PL share in sub-\u20ac1.00 grew +8pp in 12 months. Every quarter of inaction risks \u20ac450K in permanent share loss." },
  { icon: Layers, color: "text-purple-400", bg: "bg-purple-500/10", text: "Multipack expansion has the highest volume potential but requires Modern Trade listing negotiations. Recommend bundling Fanta 6x330ml and Sprite 6x330ml in a single range review submission to retailers." },
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Zero-sugar Fanta/Sprite launch would be a low-cannibalization play -- cross-elasticity with existing sugared variants is only -0.08 to -0.12. Net incremental volume estimated at 85%+." },
]

const retailerOptions = ["All Retailers", "Esselunga", "Conad", "Coop Italia", "Carrefour IT", "Eurospin"]
const channelOptions = ["All Channels", "Convenience", "Modern Trade"]

export function AssortmentWhitespaceGaps({ onNavigate }: Props) {
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedChannel, setSelectedChannel] = useState("All Channels")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "High" | "Medium" | "Low">("all")

  const filteredOpps = useMemo(() => {
    let data = [...whitespaceOpps]
    if (priorityFilter !== "all") data = data.filter(d => d.priority === priorityFilter)
    if (selectedChannel !== "All Channels") data = data.filter(d => d.channels.includes(selectedChannel))
    return data.sort((a, b) => b.addressableM - a.addressableM)
  }, [priorityFilter, selectedChannel])

  const totalAddressable = filteredOpps.reduce((s, o) => s + o.addressableM, 0)

  const priorityColor = {
    High: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
    Medium: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
    Low: { bg: "bg-zinc-500/15", text: "text-zinc-300", border: "border-zinc-500/30" },
  }

  const effortColor = {
    Low: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
    Medium: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
    High: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
  }

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "whitespace-gaps" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
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
          {(["all", "High", "Medium", "Low"] as const).map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)} className={cn("px-3 py-1 rounded text-[10px] font-medium border transition-colors", priorityFilter === p ? "bg-red-500/15 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
              {p === "all" ? "All Priorities" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Whitespace Opportunities</p>
            <p className="text-2xl font-bold text-zinc-100">{filteredOpps.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Total Addressable</p>
            <p className="text-2xl font-bold text-emerald-400">{"\u20ac"}{totalAddressable.toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">High Priority Gaps</p>
            <p className="text-2xl font-bold text-red-400">{whitespaceOpps.filter(o => o.priority === "High").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Whitespace cards + AI insights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-3">
          {filteredOpps.map(opp => {
            const pc = priorityColor[opp.priority]
            const ec = effortColor[opp.effort]
            return (
              <Card key={opp.id} className="bg-zinc-900/50 border-zinc-800/50">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className={cn("h-3.5 w-3.5", opp.priority === "High" ? "text-red-400" : opp.priority === "Medium" ? "text-amber-400" : "text-zinc-400")} />
                        <span className="text-sm font-semibold text-zinc-100">{opp.gap}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">Need-State: {opp.needState}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-[8px] py-0 h-4", pc.bg, pc.text, pc.border)}>{opp.priority} Priority</Badge>
                      <Badge className={cn("text-[8px] py-0 h-4", ec.bg, ec.text, ec.border)}>Effort: {opp.effort}</Badge>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-300 leading-relaxed mb-3">{opp.detail}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-500">Addressable:</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">{"\u20ac"}{opp.addressableM}M</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-500">Suggested Packs:</span>
                      {opp.packs.map(p => (
                        <Badge key={p} className="text-[7px] py-0 h-3.5 bg-zinc-800/50 text-zinc-400 border-zinc-700">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-500">Channels:</span>
                      {opp.channels.map(c => (
                        <Badge key={c} className="text-[7px] py-0 h-3.5 bg-blue-500/10 text-blue-300 border-blue-500/30">{c}</Badge>
                      ))}
                    </div>
                    <span className="text-[9px] text-zinc-600">|</span>
                    <span className="text-[9px] text-zinc-500">{opp.competitorPresence}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* AI Insights */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 h-fit">
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
    </div>
  )
}
