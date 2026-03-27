"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Rocket,
  Target,
  Lightbulb,
  Clock,
  MapPin,
  Wrench,
  ChevronRight,
  TrendingUp,
} from "lucide-react"

type BigBet = {
  id: string
  name: string
  tagline: string
  whyAttractive: string[]
  whereToPlay: {
    partitions: string[]
    markets: string[]
    channels: string[]
  }
  howToWin: string[]
  timeHorizon: string
  investment: "high" | "medium" | "moderate"
  status: "scaling" | "building" | "exploring"
}

const bigBets: BigBet[] = [
  {
    id: "cola-zero",
    name: "Cola Zero Leadership",
    tagline: "Win the zero-sugar cola battle across Europe",
    whyAttractive: [
      "Structural shift away from full-sugar accelerating",
      "Pepsi Max gaining share in key AFH occasions",
      "Consumer perception of taste parity now achieved",
    ],
    whereToPlay: {
      partitions: ["Cola Zero", "Cherry Zero"],
      markets: ["GB", "DE", "FR", "PL"],
      channels: ["AFH", "Convenience"],
    },
    howToWin: [
      "Outspend in AFH visibility and availability",
      "Recruit younger consumers through cultural relevance",
      "Price architecture that drives trial",
    ],
    timeHorizon: "2025-2030",
    investment: "high",
    status: "scaling",
  },
  {
    id: "fuel-uplift",
    name: "Fuel / Uplift",
    tagline: "Own the everyday energy occasion",
    whyAttractive: [
      "Energy category growing +8% annually",
      "Occasion expansion beyond traditional energy users",
      "Portfolio strength with Coca-Cola Energy + Monster",
    ],
    whereToPlay: {
      partitions: ["Energy", "Functional Cola"],
      markets: ["PL", "GB", "ES"],
      channels: ["Convenience", "AFH"],
    },
    howToWin: [
      "Clear brand roles: Monster for intensity, Coke Energy for mainstream",
      "Expand distribution in underserved convenience",
      "Drive affordability with multi-packs",
    ],
    timeHorizon: "2025-2030",
    investment: "high",
    status: "scaling",
  },
  {
    id: "nutrition-protein",
    name: "Nutrition / Protein RTD",
    tagline: "Capture the protein-seeking consumer",
    whyAttractive: [
      "Protein RTD growing +15% annually",
      "New consumer segment currently not reached",
      "Aligns with health and wellness megatrend",
    ],
    whereToPlay: {
      partitions: ["Nutrition", "Functional Hydration"],
      markets: ["GB", "DE"],
      channels: ["Convenience", "Gym/Fitness"],
    },
    howToWin: [
      "Partnership or acquisition for capability",
      "Leverage Fairlife brand equity",
      "Distribution through non-traditional channels",
    ],
    timeHorizon: "2027-2035",
    investment: "medium",
    status: "building",
  },
  {
    id: "artd",
    name: "ARTD (Ready-to-Drink Alcohol)",
    tagline: "Participate in alcohol moderation trend",
    whyAttractive: [
      "RTD alcohol fastest-growing alcohol segment",
      "TCCC brand assets transferable (Jack & Coke)",
      "Moderation trend driving category growth",
    ],
    whereToPlay: {
      partitions: ["ARTD", "Mixers"],
      markets: ["GB", "DE", "ES"],
      channels: ["Modern Trade", "AFH"],
    },
    howToWin: [
      "Strategic partnerships with spirits companies",
      "Premium positioning aligned with brand equity",
      "Build AFH activation capabilities",
    ],
    timeHorizon: "2026-2032",
    investment: "medium",
    status: "building",
  },
  {
    id: "coffee",
    name: "Coffee",
    tagline: "Scale Costa RTD across Europe",
    whyAttractive: [
      "RTD coffee growing +12% annually",
      "Costa brand acquisition underutilized",
      "Occasion synergies with core portfolio",
    ],
    whereToPlay: {
      partitions: ["Coffee RTD"],
      markets: ["GB", "FR", "PL"],
      channels: ["Modern Trade", "Convenience"],
    },
    howToWin: [
      "Leverage Costa brand and formulation expertise",
      "Premium positioning vs competitors",
      "Multi-format strategy (cans, bottles, chilled)",
    ],
    timeHorizon: "2025-2030",
    investment: "moderate",
    status: "scaling",
  },
  {
    id: "vms",
    name: "VMS-Fortified Solutions",
    tagline: "Vitamins, minerals, supplements in beverages",
    whyAttractive: [
      "Functional beverage demand increasing",
      "Consumer interest in proactive health",
      "Adjacent to existing hydration portfolio",
    ],
    whereToPlay: {
      partitions: ["Functional Hydration", "Wellness"],
      markets: ["DE", "IT", "GB"],
      channels: ["Pharmacy", "Health retail"],
    },
    howToWin: [
      "Partner with supplement brands",
      "Science-backed claims and formulations",
      "Distribution through health-focused channels",
    ],
    timeHorizon: "2028-2035",
    investment: "moderate",
    status: "exploring",
  },
]

export function BigBetsScreen() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-semibold text-zinc-100">
            Big Bets & Accelerators
          </h1>
        </div>
        <div className="max-w-4xl">
          <p className="text-lg text-zinc-300 leading-relaxed">
            What Europe is betting on — and why. Each Big Bet represents a deliberate 
            strategic choice with clear investment thesis and success criteria.
          </p>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-zinc-500">Scaling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-zinc-500">Building</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs text-zinc-500">Exploring</span>
        </div>
      </div>

      {/* Big Bets Grid */}
      <div className="space-y-6">
        {bigBets.map((bet) => (
          <Card 
            key={bet.id}
            className="p-6 bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-zinc-100">{bet.name}</h2>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      bet.status === "scaling" 
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : bet.status === "building"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400">{bet.tagline}</p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs text-zinc-600">Time Horizon</p>
                  <p className="text-sm font-medium text-zinc-300">{bet.timeHorizon}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600">Investment</p>
                  <p className={`text-sm font-medium ${
                    bet.investment === "high" 
                      ? "text-amber-400" 
                      : bet.investment === "medium"
                      ? "text-zinc-300"
                      : "text-zinc-400"
                  }`}>
                    {bet.investment.charAt(0).toUpperCase() + bet.investment.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Why Attractive */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Why Attractive
                  </h3>
                </div>
                <ul className="space-y-2">
                  {bet.whyAttractive.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <TrendingUp className="h-3 w-3 text-zinc-600 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Where to Play */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Where to Play
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-zinc-600 mb-1">Partitions</p>
                    <div className="flex flex-wrap gap-1">
                      {bet.whereToPlay.partitions.map((p) => (
                        <span key={p} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-600 mb-1">Markets</p>
                    <div className="flex flex-wrap gap-1">
                      {bet.whereToPlay.markets.map((m) => (
                        <span key={m} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-600 mb-1">Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {bet.whereToPlay.channels.map((c) => (
                        <span key={c} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Win */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    How to Win
                  </h3>
                </div>
                <ul className="space-y-2">
                  {bet.howToWin.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <ChevronRight className="h-3 w-3 text-zinc-600 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="pt-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600 italic">
          This view is designed for investment committee thinking. Each Big Bet 
          represents explicit resource allocation decisions with clear accountability.
        </p>
      </div>
    </div>
  )
}
