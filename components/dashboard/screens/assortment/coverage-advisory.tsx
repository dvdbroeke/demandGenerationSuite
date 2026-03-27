"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, ArrowRight, CheckCircle2, Clock, AlertTriangle, TrendingUp, Lightbulb, Plus, Link2, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MixScreen } from "../mix/mix-performance"

interface Props {
  onNavigate?: (screen: MixScreen) => void
  onLaunchInitiative?: () => void
}

const tabs: { id: MixScreen; label: string }[] = [
  { id: "mix-performance", label: "Mix Performance" },
  { id: "mix-levers", label: "Mix Levers" },
  { id: "market-opportunities", label: "Market Opportunities" },
  { id: "portfolio-quality", label: "Portfolio Quality" },
  { id: "whitespace-gaps", label: "Whitespace & Gaps" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Advisory initiatives -- these are recommendations, not simulations
const advisoryInitiatives = [
  {
    id: "adv-1",
    title: "Launch Brand C & Brand D Multipack Range",
    category: "New Listing",
    needState: "Weekly Stock-Up",
    priority: "Critical" as const,
    coverageImpact: "+18pp",
    revenueImpact: "\u20ac3.2M",
    timeframe: "Q3 2026",
    status: "Recommended" as const,
    actions: [
      "Submit Brand C 6x330ml and Brand D 6x330ml to Retailer A, Retailer B, Retailer C range reviews",
      "Negotiate secondary placement in seasonal aisle (summer peak)",
      "Price at \u20ac3.49 per 6-pack (\u20ac0.58/unit) to maintain margin vs single-serve",
      "Target 65% weighted distribution in MT within 6 months",
    ],
    rationale: "Only 2 multipack SKUs (Brand A Classic & Brand A Zero) currently exist. Competitor X has 4 multipack variants. Bulk-buy occasion is growing +5% YoY and we have zero Brand C/Brand D presence.",
    risks: ["Shelf space negotiation may delay MT listing by 1 quarter", "Cannibalization on 2L PET estimated at 8-12%"],
    kpis: ["Multipack share of volume: target 15% (from 8%)", "Need-state coverage: Weekly Stock-Up from 35% to 53%", "Incremental GP: \u20ac0.9M in Year 1"],
  },
  {
    id: "adv-2",
    title: "Introduce Value-Tier Price-Marked Packs",
    category: "Value Defence",
    needState: "Value Seeker",
    priority: "Critical" as const,
    coverageImpact: "+22pp",
    revenueImpact: "\u20ac1.8M",
    timeframe: "Q2 2026",
    status: "Urgent" as const,
    actions: [
      "Create Brand C 330ml PMP at \u20ac0.89 and Brand D 330ml PMP at \u20ac0.89",
      "List in Retailer E, Retailer F, and bottom-tier convenience stores",
      "Use promotional PMP mechanic to avoid damaging mainstream pricing architecture",
      "Monitor PL share erosion monthly -- trigger if PL gains >2pp in any quarter",
    ],
    rationale: "Value tier below \u20ac1.00 is a complete whitespace. PL cola captures 14% share in this band and grew +8pp in 12 months. Every quarter of inaction risks \u20ac450K in permanent share loss.",
    risks: ["PMP pricing could create channel conflict with mainstream 330ml", "Margin dilution if volume shifts from Core to Value"],
    kpis: ["Value tier share: target 5% (from 0%)", "PL share erosion: halt at current 14%", "Need-state coverage: Value Seeker from 28% to 50%"],
  },
  {
    id: "adv-3",
    title: "Expand Zero-Sugar Flavour Portfolio",
    category: "Innovation",
    needState: "Health-Conscious Choice",
    priority: "High" as const,
    coverageImpact: "+15pp",
    revenueImpact: "\u20ac2.1M",
    timeframe: "Q3 2026",
    status: "Recommended" as const,
    actions: [
      "Launch Brand C Zero 330ml and Brand D Zero 330ml in convenience and MT",
      "Add Brand C Zero 500ml for on-the-go health-conscious occasion",
      "Position at +\u20ac0.05 vs sugared variants to capture health premium",
      "Co-promote with Brand A Zero in 'Zero Sugar Range' shelf blocking strategy",
    ],
    rationale: "Zero-sugar segment growing +12% YoY. Brand A Zero is well-positioned but Brand C Zero and Brand D Zero are absent in small formats. Cross-elasticity with sugared variants is only -0.08 to -0.12, meaning 85%+ incremental volume.",
    risks: ["Production capacity for new zero-sugar lines", "Consumer trial period may extend to 6 months before repeat purchase normalises"],
    kpis: ["Zero-sugar share of flavour brands: target 20% (from 0%)", "Need-state coverage: Health-Conscious from 72% to 87%", "Cannibalization rate: maintain below 15%"],
  },
  {
    id: "adv-4",
    title: "Rationalise Bottom-20% SKUs",
    category: "Delist",
    needState: "Portfolio Efficiency",
    priority: "Medium" as const,
    coverageImpact: "+3pp",
    revenueImpact: "\u20ac0.4M",
    timeframe: "Q4 2026",
    status: "Under Review" as const,
    actions: [
      "Identify SKUs in bottom 20% by GP/Store across all retailers",
      "Propose delist of Brand D 500ml, Brand B 1.5L, and Brand C 2L in bottom 30% stores",
      "Reallocate freed shelf space to high-performing Core and Premium SKUs",
      "Monitor volume transfer for 2 periods before confirming permanent delist",
    ],
    rationale: "Bottom 20% of SKUs generate only 7% of total revenue. Delisting weakest performers would free 12% of shelf space for better-performing variants and new listings.",
    risks: ["Retailer pushback on range reduction", "Some volume may transfer to competitor rather than internal SKUs"],
    kpis: ["Shelf space efficiency: +12% GP per facing", "SKU count reduction: -4 to -6 SKUs", "Net GP impact: +\u20ac0.4M from reallocation"],
  },
  {
    id: "adv-5",
    title: "Premium Single-Serve Expansion for Brand C",
    category: "Premiumisation",
    needState: "Premium Indulgence",
    priority: "Medium" as const,
    coverageImpact: "+8pp",
    revenueImpact: "\u20ac0.9M",
    timeframe: "Q1 2027",
    status: "Recommended" as const,
    actions: [
      "Launch Brand C 250ml glass bottle for on-premise and premium convenience",
      "Launch Brand A Zero 150ml glass for premium meal pairing occasion",
      "Partner with restaurant chains for exclusive on-premise listing",
      "Price at 40% premium vs PET equivalent to capture indulgence willingness-to-pay",
    ],
    rationale: "Only Brand A Classic 150ml glass exists in premium single-serve. Competitor Y has 6 premium SKUs in this space. Premium occasion is under-served with 65% coverage vs 92% for on-the-go.",
    risks: ["Glass distribution logistics more complex", "Higher COGS may compress margin without volume scale"],
    kpis: ["Premium tier revenue share: target 12% (from 8%)", "Need-state coverage: Premium Indulgence from 65% to 73%", "Average RSP uplift: +\u20ac0.35/unit"],
  },
]

const statusColor = {
  Urgent: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30", icon: AlertTriangle },
  Recommended: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30", icon: CheckCircle2 },
  "Under Review": { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30", icon: Clock },
}

const priorityColor = {
  Critical: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
  High: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  Medium: { bg: "bg-zinc-500/15", text: "text-zinc-300", border: "border-zinc-500/30" },
}

const existingInitiatives = ["Assortment Reset Q3 2026", "Convenience Range Review", "Value Defence Programme"]

export function AssortmentCoverageAdvisory({ onNavigate, onLaunchInitiative }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>("adv-1")
  const [showInitPanel, setShowInitPanel] = useState(false)

  const totalRevenueImpact = advisoryInitiatives.reduce((s, a) => {
    const num = parseFloat(a.revenueImpact.replace(/[^\d.]/g, ""))
    return s + num
  }, 0)

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "coverage-advisory" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">Assortment Coverage Advisory</h2>
            <p className="text-[10px] text-zinc-500">AI-generated initiatives to close coverage gaps and optimise the portfolio for consumer needs</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs py-1 px-3">
          Total Opportunity: {"\u20ac"}{totalRevenueImpact.toFixed(1)}M
        </Badge>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Recommended Initiatives</p>
            <p className="text-2xl font-bold text-zinc-100">{advisoryInitiatives.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Critical Priority</p>
            <p className="text-2xl font-bold text-red-400">{advisoryInitiatives.filter(a => a.priority === "Critical").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Projected Coverage Lift</p>
            <p className="text-2xl font-bold text-emerald-400">+16pp</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">68% to 84% overall</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Revenue Opportunity</p>
            <p className="text-2xl font-bold text-emerald-400">{"\u20ac"}{totalRevenueImpact.toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Advisory initiative cards */}
      <div className="space-y-3">
        {advisoryInitiatives.map(adv => {
          const sc = statusColor[adv.status]
          const pc = priorityColor[adv.priority]
          const StatusIcon = sc.icon
          const isExpanded = expandedId === adv.id

          return (
            <Card key={adv.id} className={cn("bg-zinc-900/50 border-zinc-800/50 transition-all", isExpanded && "border-zinc-700")}>
              <CardContent className="p-5">
                {/* Header */}
                <button onClick={() => setExpandedId(isExpanded ? null : adv.id)} className="w-full text-left">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", sc.bg)}>
                        <StatusIcon className={cn("h-4 w-4", sc.text)} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100">{adv.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-[8px] py-0 h-4", pc.bg, pc.text, pc.border)}>{adv.priority}</Badge>
                          <Badge className={cn("text-[8px] py-0 h-4", sc.bg, sc.text, sc.border)}>{adv.status}</Badge>
                          <Badge className="text-[8px] py-0 h-4 bg-zinc-800 text-zinc-400 border-zinc-700">{adv.category}</Badge>
                          <span className="text-[9px] text-zinc-500">Need-State: {adv.needState}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold font-mono text-emerald-400">{adv.revenueImpact}</p>
                        <p className="text-[9px] text-zinc-500">{adv.coverageImpact} coverage</p>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-4">
                    {/* Rationale */}
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-1">Rationale</p>
                      <p className="text-[10px] text-zinc-300 leading-relaxed">{adv.rationale}</p>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-2">Recommended Actions</p>
                      <div className="space-y-1.5">
                        {adv.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[8px] text-zinc-400 font-bold">{i + 1}</span>
                            </div>
                            <span className="text-[10px] text-zinc-300">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KPIs and Risks side by side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-2">Success KPIs</p>
                        <div className="space-y-1.5">
                          {adv.kpis.map((kpi, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Target className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="text-[10px] text-zinc-300">{kpi}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide mb-2">Key Risks</p>
                        <div className="space-y-1.5">
                          {adv.risks.map((risk, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span className="text-[10px] text-zinc-300">{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Timeframe + Link to initiative */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/30">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-[10px] text-zinc-400">Target: {adv.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-7" onClick={() => setShowInitPanel(!showInitPanel)}>
                          <Link2 className="h-3 w-3 mr-1" /> Link Existing
                        </Button>
                        <Button size="sm" className="text-xs bg-red-600 hover:bg-red-700 text-white h-7" onClick={onLaunchInitiative}>
                          <Plus className="h-3 w-3 mr-1" /> Create Initiative
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Link existing panel */}
      {showInitPanel && (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">Link to Existing Initiative</h3>
            <div className="space-y-1.5">
              {existingInitiatives.map(init => (
                <button key={init} className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-300 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />{init}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
