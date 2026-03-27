"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MixScreen } from "./mix-performance"

interface Props { onNavigate?: (screen: MixScreen) => void }

const tabs: { id: MixScreen; label: string }[] = [
  { id: "mix-performance", label: "Mix Performance" },
  { id: "mix-levers", label: "Mix Levers" },
  { id: "market-opportunities", label: "Market Opportunities" },
  { id: "portfolio-quality", label: "Portfolio Quality" },
  { id: "whitespace-gaps", label: "Whitespace & Gaps" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Mix levers and their impact
const mixLevers = [
  {
    lever: "Pack Size Trade-Up",
    description: "Shift consumers from multi-serve (1.5L/2L) to single-serve (330ml/500ml) for higher PPL",
    currentState: "Multi-serve is 48% of volume but only 32% of revenue",
    targetState: "Reduce multi-serve to 42% volume, grow single-serve to 58%",
    impactOnPPL: "+\u20ac0.12/L",
    impactOnGP: "+\u20ac0.8M",
    impactOnMix: "+2.1pp Premium",
    difficulty: "Medium" as const,
    actions: [
      { action: "Reduce promotional depth on 1.5L and 2L formats", impact: "-3pp multi-serve volume, +\u20ac0.4M GP" },
      { action: "Increase single-serve facing by +1 in convenience", impact: "+2pp single-serve volume, +\u20ac0.2M GP" },
      { action: "Launch 250ml slim can at checkout for impulse", impact: "+0.6pp volume at \u20ac2.80/L PPL" },
    ],
  },
  {
    lever: "Channel Mix Optimisation",
    description: "Shift volume towards higher-margin channels (Convenience, On-Premise) vs Modern Trade",
    currentState: "MT is 65% of volume at \u20ac1.20 avg PPL; Convenience is 25% at \u20ac1.85 PPL",
    targetState: "Grow Convenience to 30% and On-Premise to 10% of total volume",
    impactOnPPL: "+\u20ac0.08/L",
    impactOnGP: "+\u20ac0.6M",
    impactOnMix: "+1.4pp Premium",
    difficulty: "High" as const,
    actions: [
      { action: "Expand Brand B 330ml to 85% WD in convenience (from 72%)", impact: "+1.2pp convenience volume" },
      { action: "Launch on-premise 200ml glass for restaurant chains", impact: "+0.5pp on-premise at \u20ac3.40/L PPL" },
      { action: "Reduce MT promotional frequency by 15%", impact: "Prevents further MT volume pull at low margin" },
    ],
  },
  {
    lever: "Brand-Up Migration",
    description: "Drive consumers from Brand D/Brand E towards Brand A/Brand B for higher revenue per transaction",
    currentState: "Brand A and B are 62% of revenue; Brand D/Brand E at 38% with lower PPL",
    targetState: "Brand A and B to 66% of revenue through targeted activation",
    impactOnPPL: "+\u20ac0.06/L",
    impactOnGP: "+\u20ac0.4M",
    impactOnMix: "+0.8pp Premium",
    difficulty: "Low" as const,
    actions: [
      { action: "Co-promote Brand B with Brand A as 'taste upgrade' bundle", impact: "+0.4pp Brand A/B volume share" },
      { action: "Increase Brand B media spend by 20% in digital", impact: "+0.3pp trial rate for health-conscious segment" },
      { action: "Position Brand A premium glass in impulse zone", impact: "+\u20ac0.15/unit margin uplift" },
    ],
  },
  {
    lever: "Promotional Mix Discipline",
    description: "Reduce deep-discount promotions that drag mix down; shift to value-add mechanics",
    currentState: "28% of volume sold on >25% discount; promo cannibalises 18% of base volume",
    targetState: "Reduce deep-promo volume to 20%; shift to meal-deal and multipack mechanics",
    impactOnPPL: "+\u20ac0.10/L",
    impactOnGP: "+\u20ac0.5M",
    impactOnMix: "+1.6pp Premium",
    difficulty: "Medium" as const,
    actions: [
      { action: "Cap maximum discount at 20% on single-serve SKUs", impact: "Protects \u20ac0.3M GP currently lost to deep discount" },
      { action: "Replace BOGOF with meal-deal mechanics in MT", impact: "Maintains foot traffic while improving effective PPL by 12%" },
      { action: "Limit promo duration to 2 weeks max (from current 3-4)", impact: "Reduces promo overlap and base-volume erosion" },
    ],
  },
]

const difficultyColor = {
  Low: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  Medium: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  High: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
}

const aiInsights = [
  { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Pack Size Trade-Up and Promotional Discipline together can shift +3.7pp of revenue towards Premium tier, adding \u20ac1.3M in GP. These two levers have the best effort-to-impact ratio." },
  { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Channel Mix is the highest-impact lever long-term but requires distribution investment. Start with convenience expansion for Brand B 330ml which has proven velocity at 85%+ stores." },
  { icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", text: "Current promotional depth is eroding mix at -1.4pp/year. Without intervention, the portfolio will shift further towards Traffic tier -- costing \u20ac0.8M in annual GP." },
]

export function MixLevers({ onNavigate }: Props) {
  const [selectedLever, setSelectedLever] = useState(0)

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "mix-levers" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Total PPL Uplift Potential</p>
            <p className="text-2xl font-bold text-emerald-400">+{"\u20ac"}0.36/L</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Total GP Opportunity</p>
            <p className="text-2xl font-bold text-emerald-400">+{"\u20ac"}2.3M</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Premium Mix Shift</p>
            <p className="text-2xl font-bold text-zinc-100">+5.9pp</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">Across all levers</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Active Levers</p>
            <p className="text-2xl font-bold text-zinc-100">{mixLevers.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lever cards + detail */}
      <div className="grid grid-cols-3 gap-4">
        {/* Lever selector */}
        <div className="space-y-2">
          {mixLevers.map((lever, i) => {
            const dc = difficultyColor[lever.difficulty]
            return (
              <button key={i} onClick={() => setSelectedLever(i)} className={cn("w-full text-left p-4 rounded-lg border transition-all", selectedLever === i ? "bg-zinc-800/50 border-zinc-700" : "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700")}>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-zinc-200">{lever.lever}</h4>
                  <Badge className={cn("text-[8px] py-0 h-4", dc.bg, dc.text, dc.border)}>{lever.difficulty}</Badge>
                </div>
                <p className="text-[9px] text-zinc-500 mb-2">{lever.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">{lever.impactOnGP}</span>
                  <span className="text-[9px] text-zinc-500">{lever.impactOnMix} mix shift</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected lever detail */}
        <div className="col-span-2 space-y-4">
          {(() => {
            const lever = mixLevers[selectedLever]
            const dc = difficultyColor[lever.difficulty]
            return (
              <>
                <Card className="bg-zinc-900/50 border-zinc-800/50">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-zinc-100">{lever.lever}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-[8px] py-0 h-4", dc.bg, dc.text, dc.border)}>Difficulty: {lever.difficulty}</Badge>
                      </div>
                    </div>

                    {/* Current vs Target */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                        <p className="text-[9px] text-zinc-500 font-semibold uppercase mb-1">Current State</p>
                        <p className="text-[10px] text-zinc-300">{lever.currentState}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <p className="text-[9px] text-emerald-400 font-semibold uppercase mb-1">Target State</p>
                        <p className="text-[10px] text-zinc-300">{lever.targetState}</p>
                      </div>
                    </div>

                    {/* Impact metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-center">
                        <p className="text-[9px] text-zinc-500 mb-1">PPL Impact</p>
                        <p className="text-sm font-bold font-mono text-emerald-400">{lever.impactOnPPL}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-center">
                        <p className="text-[9px] text-zinc-500 mb-1">GP Impact</p>
                        <p className="text-sm font-bold font-mono text-emerald-400">{lever.impactOnGP}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-center">
                        <p className="text-[9px] text-zinc-500 mb-1">Mix Shift</p>
                        <p className="text-sm font-bold font-mono text-zinc-100">{lever.impactOnMix}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-2">Recommended Actions</p>
                      <div className="space-y-2">
                        {lever.actions.map((a, i) => (
                          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[8px] text-zinc-400 font-bold">{i + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-zinc-200">{a.action}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <ArrowRight className="h-2.5 w-2.5 text-emerald-400" />
                                <span className="text-[9px] text-emerald-400">{a.impact}</span>
                              </div>
                            </div>
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
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
