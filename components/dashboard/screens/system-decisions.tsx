"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GitBranch,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Bell,
  Scale,
} from "lucide-react"

type Decision = {
  id: string
  title: string
  description: string
  status: "taken" | "pending" | "escalated"
  date: string
  owner: string
  impact: string
  tradeOff?: string
}

const decisionsTaken: Decision[] = [
  {
    id: "1",
    title: "Reallocate media from Core SSD to Cola Zero",
    description: "Shift 15% of Core SSD media spend to Cola Zero in GB, DE, FR to accelerate zero-sugar transition.",
    status: "taken",
    date: "Jan 15, 2026",
    owner: "CMO Europe",
    impact: "Expected +2pp Cola Zero share by Q4",
  },
  {
    id: "2",
    title: "Prioritize AFH recovery investment in IT, ES",
    description: "Allocate incremental €20M to on-premise activation in recovering tourism markets.",
    status: "taken",
    date: "Jan 8, 2026",
    owner: "VP Commercial",
    impact: "Target 90% pre-pandemic distribution by summer",
  },
  {
    id: "3",
    title: "Pause VMS-Fortified expansion",
    description: "Hold further investment pending regulatory clarity on health claims.",
    status: "taken",
    date: "Dec 20, 2025",
    owner: "VP Innovation",
    impact: "Resources redirected to Protein RTD",
  },
]

const decisionsPending: Decision[] = [
  {
    id: "4",
    title: "Nutrition/Protein capability decision",
    description: "Leadership decision required: Build internal formulation capability, acquire existing player, or pursue strategic partnership.",
    status: "pending",
    date: "Due: Feb 15, 2026",
    owner: "Strategy Committee",
    impact: "Determines 2027-2030 Protein RTD trajectory",
    tradeOff: "Build slower but more control vs. Acquire faster but integration risk vs. Partner flexible but margin share",
  },
  {
    id: "5",
    title: "Energy portfolio architecture",
    description: "Define clear brand roles between Brand A Energy and Brand E to avoid cannibalization.",
    status: "pending",
    date: "Due: Feb 28, 2026",
    owner: "Brand Council",
    impact: "Affects PL, GB, ES market plans",
    tradeOff: "Distinct positioning limits scale vs. Overlap drives category but internal competition",
  },
  {
    id: "6",
    title: "FR system alignment intervention",
    description: "France diverging from agreed playbook on pricing strategy. Intervention decision needed.",
    status: "escalated",
    date: "Due: Jan 30, 2026",
    owner: "President Europe",
    impact: "System credibility at stake",
    tradeOff: "Enforce alignment risks local engagement vs. Allow flexibility risks precedent",
  },
]

const tradeOffsSurfaced = [
  {
    title: "Volume vs Value",
    context: "Aggressive affordability drive may protect volume but erode category value perception.",
    status: "monitoring",
  },
  {
    title: "Core vs Accelerator Resource Allocation",
    context: "Accelerator investments showing promise but drawing resources from high-confidence core bets.",
    status: "monitoring",
  },
  {
    title: "Speed vs System Alignment",
    context: "Fast-moving markets want autonomy; coordinated approach may slow local responsiveness.",
    status: "active-discussion",
  },
]

const signals = [
  {
    type: "increase",
    title: "Cola Zero confidence increased",
    detail: "GB Q4 results exceed expectations; model confidence now HIGH across all 4 focus markets.",
    date: "2 days ago",
  },
  {
    type: "decrease",
    title: "Energy margin confidence decreased",
    detail: "Promotional intensity signals suggest sustained price pressure. Margin outlook revised.",
    date: "5 days ago",
  },
  {
    type: "new",
    title: "New signal: Protein RTD acceleration",
    detail: "Competitor M&A activity suggests category may scale faster than modeled.",
    date: "1 week ago",
  },
]

export function SystemDecisionsScreen() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <GitBranch className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-semibold text-zinc-100">
            System Decisions
          </h1>
        </div>
        <div className="max-w-4xl">
          <p className="text-lg text-zinc-300 leading-relaxed">
            Turn strategy into a living operating model. Track decisions taken, 
            pending choices, and emerging trade-offs that require leadership attention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Decisions */}
        <div className="col-span-2 space-y-6">
          {/* Decisions Taken */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                Decisions Taken
              </h2>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                {decisionsTaken.length} this cycle
              </Badge>
            </div>
            <div className="space-y-3">
              {decisionsTaken.map((decision) => (
                <Card key={decision.id} className="p-4 bg-zinc-900/50 border-zinc-800/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-zinc-100">{decision.title}</h3>
                        <span className="text-xs text-zinc-600">{decision.date}</span>
                      </div>
                      <p className="text-sm text-zinc-400 mb-2">{decision.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-zinc-600">Owner: <span className="text-zinc-400">{decision.owner}</span></span>
                        <span className="text-zinc-600">Impact: <span className="text-emerald-400">{decision.impact}</span></span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Decisions Pending */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                Decisions Pending
              </h2>
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
                {decisionsPending.length} awaiting
              </Badge>
            </div>
            <div className="space-y-3">
              {decisionsPending.map((decision) => (
                <Card 
                  key={decision.id} 
                  className={`p-4 bg-zinc-900/50 border-l-2 ${
                    decision.status === "escalated" 
                      ? "border-l-red-500 border-zinc-800/50" 
                      : "border-l-amber-500 border-zinc-800/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      decision.status === "escalated" ? "bg-red-500/10" : "bg-amber-500/10"
                    }`}>
                      {decision.status === "escalated" 
                        ? <AlertTriangle className="h-4 w-4 text-red-400" />
                        : <Clock className="h-4 w-4 text-amber-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-zinc-100">{decision.title}</h3>
                          {decision.status === "escalated" && (
                            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                              Escalated
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-amber-400">{decision.date}</span>
                      </div>
                      <p className="text-sm text-zinc-400 mb-2">{decision.description}</p>
                      <div className="flex items-center gap-4 text-xs mb-2">
                        <span className="text-zinc-600">Owner: <span className="text-zinc-400">{decision.owner}</span></span>
                        <span className="text-zinc-600">Impact: <span className="text-zinc-300">{decision.impact}</span></span>
                      </div>
                      {decision.tradeOff && (
                        <div className="mt-3 p-2 rounded bg-zinc-800/50 border border-zinc-700/50">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Scale className="h-3 w-3 text-zinc-500" />
                            <span className="text-xs text-zinc-500">Trade-off</span>
                          </div>
                          <p className="text-xs text-zinc-400">{decision.tradeOff}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trade-offs Surfaced */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Trade-offs Surfaced
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {tradeOffsSurfaced.map((tradeoff, index) => (
                <Card key={index} className="p-4 bg-zinc-900/50 border-zinc-800/50">
                  <div className="flex items-start gap-2 mb-2">
                    <Scale className="h-4 w-4 text-zinc-500 mt-0.5" />
                    <h3 className="text-sm font-medium text-zinc-100">{tradeoff.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{tradeoff.context}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      tradeoff.status === "active-discussion"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-zinc-600/30 bg-zinc-700/10 text-zinc-400"
                    }`}
                  >
                    {tradeoff.status === "active-discussion" ? "Active Discussion" : "Monitoring"}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Signals */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Always-On Insights
            </h2>
          </div>
          <Card className="p-4 bg-zinc-900/50 border-zinc-800/50">
            <div className="space-y-4">
              {signals.map((signal, index) => (
                <div 
                  key={index} 
                  className={`pb-4 ${index < signals.length - 1 ? "border-b border-zinc-800/50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      signal.type === "increase" 
                        ? "bg-emerald-500/10" 
                        : signal.type === "decrease"
                        ? "bg-red-500/10"
                        : "bg-blue-500/10"
                    }`}>
                      {signal.type === "increase" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                      {signal.type === "decrease" && <TrendingDown className="h-3 w-3 text-red-400" />}
                      {signal.type === "new" && <Lightbulb className="h-3 w-3 text-blue-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-zinc-100 mb-1">{signal.title}</h4>
                      <p className="text-xs text-zinc-400 mb-1">{signal.detail}</p>
                      <span className="text-xs text-zinc-600">{signal.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary Stats */}
          <Card className="p-4 bg-gradient-to-b from-amber-500/5 to-transparent border-amber-500/20">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              This Cycle Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Decisions taken</span>
                <span className="text-sm font-medium text-emerald-400">{decisionsTaken.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Decisions pending</span>
                <span className="text-sm font-medium text-amber-400">{decisionsPending.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Trade-offs surfaced</span>
                <span className="text-sm font-medium text-zinc-300">{tradeOffsSurfaced.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">New signals</span>
                <span className="text-sm font-medium text-blue-400">{signals.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
