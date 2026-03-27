"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GitBranch, 
  Building2,
  ArrowRight,
  CheckCircle2,
  Users,
  Truck,
  Megaphone,
  Package,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Ownership {
  area: string
  tccc: string[]
  bottlers: string[]
  joint: string[]
}

const ownershipMatrix: Ownership[] = [
  {
    area: "Brand & Marketing",
    tccc: ["Brand strategy", "Global creative", "Consumer insights", "Media planning"],
    bottlers: ["Local activation", "In-store execution", "Trade marketing"],
    joint: ["Campaign measurement", "Market-specific adaptation"]
  },
  {
    area: "Commercial & Sales",
    tccc: ["Pricing strategy", "Trade terms framework", "Channel strategy"],
    bottlers: ["Customer relationships", "Order management", "Route-to-market", "Sales execution"],
    joint: ["Key account planning", "Revenue growth management"]
  },
  {
    area: "Supply Chain",
    tccc: ["Concentrate supply", "Quality standards", "Innovation pipeline"],
    bottlers: ["Manufacturing", "Distribution", "Cold drink equipment", "Local sourcing"],
    joint: ["Demand planning", "Capacity planning"]
  },
  {
    area: "Portfolio & Innovation",
    tccc: ["Portfolio architecture", "NPD pipeline", "Reformulation"],
    bottlers: ["Local variants", "Pack formats", "Production feasibility"],
    joint: ["Launch execution", "Performance tracking"]
  },
]

interface ExecutionHandoff {
  from: string
  to: string
  trigger: string
  artifact: string
}

const executionHandoffs: ExecutionHandoff[] = [
  {
    from: "TCCC Strategy",
    to: "Bottler Commercial",
    trigger: "Strategic choice approved at SteerCo",
    artifact: "Growth Cell brief with investment envelope"
  },
  {
    from: "TCCC Marketing",
    to: "Bottler Trade Marketing",
    trigger: "Campaign creative approved",
    artifact: "Activation toolkit and media plan"
  },
  {
    from: "Bottler Sales",
    to: "TCCC Analytics",
    trigger: "Execution complete",
    artifact: "Performance data and market feedback"
  },
  {
    from: "TCCC Innovation",
    to: "Bottler Supply Chain",
    trigger: "NPD approved for launch",
    artifact: "Product specs and volume forecast"
  },
]

interface CapabilityOwner {
  capability: string
  owner: "TCCC" | "Bottlers" | "Shared"
  maturity: "strong" | "building" | "gap"
  notes: string
}

const capabilities: CapabilityOwner[] = [
  { capability: "Consumer Insights & Analytics", owner: "TCCC", maturity: "strong", notes: "Centralized data platform" },
  { capability: "Revenue Growth Management", owner: "Shared", maturity: "building", notes: "Joint analytics team in place" },
  { capability: "Execution Excellence Tracking", owner: "Bottlers", maturity: "building", notes: "New tools rolling out" },
  { capability: "Digital Commerce", owner: "Shared", maturity: "gap", notes: "Capability acceleration needed" },
  { capability: "Sustainability & ESG", owner: "Shared", maturity: "building", notes: "Joint roadmap in progress" },
  { capability: "Cold Drink Equipment", owner: "Bottlers", maturity: "strong", notes: "Core bottler competency" },
]

const maturityConfig = {
  strong: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Strong" },
  building: { color: "text-amber-400", bg: "bg-amber-500/10", label: "Building" },
  gap: { color: "text-red-400", bg: "bg-red-500/10", label: "Gap" },
}

const ownerConfig = {
  "TCCC": { color: "text-red-400", bg: "bg-red-500/10" },
  "Bottlers": { color: "text-blue-400", bg: "bg-blue-500/10" },
  "Shared": { color: "text-purple-400", bg: "bg-purple-500/10" },
}

export function SystemWiringScreen() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">System Wiring</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Who decides what (TCCC vs Bottlers), execution handoffs, and capability ownership
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-zinc-300">TCCC</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-zinc-300">Bottlers (CCEP, CCH)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-sm text-zinc-300">Joint/Shared</span>
        </div>
      </div>

      {/* Ownership Matrix */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-400" />
            Responsibility Matrix — Who Decides What
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {ownershipMatrix.map((area, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                <h4 className="text-sm font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  {area.area === "Brand & Marketing" && <Megaphone className="h-4 w-4 text-purple-400" />}
                  {area.area === "Commercial & Sales" && <DollarSign className="h-4 w-4 text-emerald-400" />}
                  {area.area === "Supply Chain" && <Truck className="h-4 w-4 text-blue-400" />}
                  {area.area === "Portfolio & Innovation" && <Package className="h-4 w-4 text-amber-400" />}
                  {area.area}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs font-medium text-red-400">TCCC Leads</span>
                    </div>
                    <ul className="space-y-1">
                      {area.tccc.map((item, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-zinc-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-medium text-blue-400">Bottlers Lead</span>
                    </div>
                    <ul className="space-y-1">
                      {area.bottlers.map((item, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-zinc-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-xs font-medium text-purple-400">Joint</span>
                    </div>
                    <ul className="space-y-1">
                      {area.joint.map((item, i) => (
                        <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-zinc-600 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution Handoffs */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-teal-400" />
            Execution Handoffs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {executionHandoffs.map((handoff, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-400">
                      {handoff.from}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-zinc-600" />
                    <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                      {handoff.to}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mb-1">
                    <span className="text-zinc-400">Trigger:</span> {handoff.trigger}
                  </p>
                  <p className="text-xs text-zinc-500">
                    <span className="text-zinc-400">Artifact:</span> {handoff.artifact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Capability Ownership */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            Capability Ownership & Maturity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {capabilities.map((cap, idx) => {
              const matConfig = maturityConfig[cap.maturity]
              const ownConfig = ownerConfig[cap.owner]
              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-100 min-w-[200px]">{cap.capability}</span>
                    <Badge variant="outline" className={cn("text-[10px]", ownConfig.color, ownConfig.bg)}>
                      {cap.owner}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-500">{cap.notes}</span>
                    <Badge variant="outline" className={cn("text-[10px]", matConfig.color, matConfig.bg)}>
                      {matConfig.label}
                    </Badge>
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
