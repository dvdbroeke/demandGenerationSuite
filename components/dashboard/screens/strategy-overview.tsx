"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ArrowRight,
  Scale,
  Target,
  Users,
  Zap
} from "lucide-react"

const systemHealthData = [
  {
    title: "Volume Growth Trajectory",
    status: "below",
    current: "+1.2%",
    ambition: "+3.5%",
    narrative: "Current growth pace insufficient for 2035 ambition",
    icon: TrendingUp,
  },
  {
    title: "Value vs Volume Balance",
    status: "warning",
    current: "68% / 32%",
    ambition: "55% / 45%",
    narrative: "Growth remains too price-led; volume acceleration needed",
    icon: Scale,
  },
  {
    title: "Core vs Accelerator Mix",
    status: "on-track",
    current: "78% / 22%",
    ambition: "70% / 30%",
    narrative: "Accelerator portfolio scaling as planned",
    icon: Target,
  },
  {
    title: "System Alignment",
    status: "warning",
    current: "Partial",
    ambition: "Full",
    narrative: "3 markets diverging from agreed playbook",
    icon: Users,
  },
]

const attentionItems = [
  {
    priority: "urgent",
    title: "Cola Zero share erosion vs Pepsi Max",
    context: "GB, DE, FR, PL — 4 consecutive periods of share loss in AFH channel",
    implication: "Requires immediate media and activation response",
    type: "Competitive",
  },
  {
    priority: "urgent",
    title: "Nutrition/Protein acceleration blocked",
    context: "Capability gap in formulation and partnership development",
    implication: "Leadership decision needed: build, buy, or partner",
    type: "Capability",
  },
  {
    priority: "watch",
    title: "Energy segment margin pressure",
    context: "Promotional intensity increasing across all markets",
    implication: "May require portfolio and pricing strategy review",
    type: "Commercial",
  },
  {
    priority: "watch",
    title: "Advanced Hydration growth slowing",
    context: "DE, IT showing early signs of category maturity",
    implication: "Innovation pipeline acceleration may be needed",
    type: "Growth",
  },
]

export function StrategyOverviewScreen() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Moonshot Headline */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-semibold text-zinc-100">
            Is Europe Winning?
          </h1>
        </div>
        <div className="max-w-4xl">
          <p className="text-lg text-zinc-300 leading-relaxed">
            Europe's growth has been price-led. Sustainable volume growth requires 
            de-averaged, consumer-led choices executed as one System.
          </p>
        </div>
      </div>

      {/* System Health Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
          System Health
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {systemHealthData.map((item) => {
            const Icon = item.icon
            return (
              <Card 
                key={item.title}
                className="p-5 bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h3 className="text-sm font-medium text-zinc-100">{item.title}</h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      item.status === "on-track" 
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : item.status === "below"
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    }
                  >
                    {item.status === "on-track" ? "On Track" : item.status === "below" ? "Below Target" : "Watch"}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Current</p>
                      <p className="text-xl font-semibold text-zinc-100">{item.current}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600" />
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Ambition</p>
                      <p className="text-xl font-semibold text-amber-400">{item.ambition}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400">{item.narrative}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Leadership Attention Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Decisions Requiring Leadership Attention
          </h2>
          <span className="text-xs text-zinc-600">This Cycle</span>
        </div>
        <div className="space-y-3">
          {attentionItems.map((item, index) => (
            <Card 
              key={index}
              className={`p-5 bg-zinc-900/50 border-l-2 ${
                item.priority === "urgent" 
                  ? "border-l-red-500 border-zinc-800/50" 
                  : "border-l-amber-500 border-zinc-800/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.priority === "urgent" ? "bg-red-500/10" : "bg-amber-500/10"
                }`}>
                  {item.priority === "urgent" 
                    ? <AlertTriangle className="h-4 w-4 text-red-400" />
                    : <TrendingDown className="h-4 w-4 text-amber-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-medium text-zinc-100">{item.title}</h3>
                    <Badge variant="outline" className="border-zinc-700 bg-zinc-800/50 text-zinc-400 text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{item.context}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Implication:</span>
                    <span className="text-xs text-zinc-300">{item.implication}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Note */}
      <div className="pt-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600 italic">
          This view is designed for SteerCo and leadership working sessions. 
          All signals are based on the latest available data and BAM model outputs.
        </p>
      </div>
    </div>
  )
}
