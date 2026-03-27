"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Lightbulb, 
  Megaphone,
  Truck,
  Package,
  DollarSign,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StrategicPlay {
  id: string
  name: string
  lever: "demand" | "execution" | "portfolio" | "pricing" | "capability"
  description: string
  applicablePartitions: string[]
  businessModel: string
  capabilityImplications: string[]
  expectedImpact: string
  status: "active" | "piloting" | "planned"
}

const strategicPlays: StrategicPlay[] = [
  {
    id: "1",
    name: "Zero Sugar Leadership",
    lever: "portfolio",
    description: "Accelerate portfolio shift to zero-sugar variants across all sparkling brands, with reformulation roadmap and marketing investment reallocation",
    applicablePartitions: ["Brand B Zero", "Brand C Zero", "Brand D Zero"],
    businessModel: "Premium pricing with category expansion focus",
    capabilityImplications: [
      "Sweetener R&D capability expansion",
      "Consumer taste testing infrastructure",
      "Marketing creative for health positioning"
    ],
    expectedImpact: "+2.5pp sparkling share by 2027",
    status: "active"
  },
  {
    id: "2",
    name: "Energy Convenience Domination",
    lever: "execution",
    description: "Win the impulse occasion through superior in-store visibility, cold availability, and checkout placement in convenience and petrol channels",
    applicablePartitions: ["Fuel & Uplift", "Energy Drinks"],
    businessModel: "High-margin impulse with trade investment ROI focus",
    capabilityImplications: [
      "Cooler fleet expansion and maintenance",
      "Sales force incentive realignment",
      "Real-time execution tracking"
    ],
    expectedImpact: "+15% energy volume in convenience",
    status: "active"
  },
  {
    id: "3",
    name: "ARTD Category Creation",
    lever: "demand",
    description: "Build the adult refreshment category through targeted awareness, trial generation, and occasion education in on-premise and social occasions",
    applicablePartitions: ["Adult Refreshment", "Topo Chico Hard Seltzer"],
    businessModel: "Category builder with premium positioning; accept lower near-term margins",
    capabilityImplications: [
      "On-premise relationship building",
      "Experiential marketing team",
      "Social media and influencer capability"
    ],
    expectedImpact: "Category worth €800M by 2028",
    status: "piloting"
  },
  {
    id: "4",
    name: "Value Architecture Defense",
    lever: "pricing",
    description: "Protect core business margins while offering value tiers to compete with private label in price-sensitive segments",
    applicablePartitions: ["Classic Core", "Value Sparkling"],
    businessModel: "Tiered pricing with clear good-better-best architecture",
    capabilityImplications: [
      "Revenue growth management analytics",
      "Pack-price optimization tools",
      "Trade negotiation guidelines"
    ],
    expectedImpact: "Defend -0.5pp share loss to PL",
    status: "active"
  },
  {
    id: "5",
    name: "Coffee Ecosystem Build",
    lever: "capability",
    description: "Integrate coffee assets into System with RTD focus, leveraging retail presence for brand building and supply chain for RTD distribution",
    applicablePartitions: ["Coffee RTD", "Coffee Retail"],
    businessModel: "Cross-subsidized ecosystem; retail funds RTD expansion",
    capabilityImplications: [
      "Cold chain for coffee RTD",
      "Barista training integration",
      "Joint business planning with retail"
    ],
    expectedImpact: "€300M RTD revenue by 2027",
    status: "planned"
  },
]

const leverConfig = {
  demand: { icon: Megaphone, color: "text-purple-400", bg: "bg-purple-500/10", label: "Demand Generation" },
  execution: { icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10", label: "Execution Excellence" },
  portfolio: { icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Portfolio Strategy" },
  pricing: { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", label: "Pricing & RGM" },
  capability: { icon: Users, color: "text-teal-400", bg: "bg-teal-500/10", label: "Capability Building" },
}

const statusConfig = {
  active: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  piloting: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  planned: { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
}

export function HowToWinScreen() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">How to Win</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Strategic plays and levers — differentiated business models and capability implications
        </p>
      </div>

      {/* Lever Summary */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(leverConfig).map(([key, config]) => {
          const Icon = config.icon
          const count = strategicPlays.filter(p => p.lever === key).length
          return (
            <div 
              key={key}
              className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", config.bg)}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
              <span className="text-sm text-zinc-300">{config.label}</span>
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 ml-1">
                {count}
              </Badge>
            </div>
          )
        })}
      </div>

      {/* Strategic Plays */}
      <div className="space-y-6">
        {strategicPlays.map((play) => {
          const leverConf = leverConfig[play.lever]
          const statusConf = statusConfig[play.status]
          const LeverIcon = leverConf.icon
          
          return (
            <Card key={play.id} className={cn("bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 transition-all")}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", leverConf.bg)}>
                      <LeverIcon className={cn("h-5 w-5", leverConf.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={cn("text-[10px]", leverConf.color, "border-current/20")}>
                          {leverConf.label}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px]", statusConf.color, statusConf.border)}>
                          {play.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-zinc-100">
                        {play.name}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Expected Impact</p>
                    <p className="text-sm font-semibold text-emerald-400">{play.expectedImpact}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {play.description}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
                  {/* Applicable Partitions */}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Applicable Partitions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {play.applicablePartitions.map((p, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Business Model */}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Business Model</p>
                    <p className="text-xs text-zinc-300">{play.businessModel}</p>
                  </div>

                  {/* Capability Implications */}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Capability Implications</p>
                    <ul className="space-y-1">
                      {play.capabilityImplications.map((cap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-400">
                          <CheckCircle2 className="h-3 w-3 text-zinc-600 mt-0.5 flex-shrink-0" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
                    View linked initiatives <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
