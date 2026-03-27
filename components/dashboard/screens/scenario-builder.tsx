"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  ArrowLeft, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Megaphone,
  Store,
  Package,
  Sparkles,
  BarChart3
} from "lucide-react"

interface ScenarioBuilderProps {
  partition: {
    id: string
    name: string
    color: string
  }
  actionId: string
  onBack: () => void
}

interface ActionScenario {
  title: string
  description: string
  baselineGrowth: number
  maxGrowth: number
  investments: {
    media: { baseline: number; perPoint: number }
    trade: { baseline: number; perPoint: number }
    execution: { baseline: number; perPoint: number }
    innovation: { baseline: number; perPoint: number }
  }
  outcomes: string[]
  risks: string[]
  dependencies: string[]
}

const actionScenarios: Record<string, ActionScenario> = {
  "mental-availability": {
    title: "Increase mental availability vs Pepsi Max in AFH",
    description: "Accelerate brand presence and visibility to capture share from Pepsi Max",
    baselineGrowth: 3,
    maxGrowth: 12,
    investments: {
      media: { baseline: 15, perPoint: 8 },
      trade: { baseline: 5, perPoint: 3 },
      execution: { baseline: 10, perPoint: 2 },
      innovation: { baseline: 0, perPoint: 0 }
    },
    outcomes: [
      "Expected +2-3pp share gain in AFH channel",
      "Mental availability parity with Pepsi Max in 18-35 cohort",
      "Improved brand salience in key consumption moments"
    ],
    risks: [
      "Pepsi Max may respond with increased investment",
      "Media effectiveness depends on creative execution",
      "AFH recovery pace uncertain post-COVID"
    ],
    dependencies: [
      "Requires aligned bottler investment in AFH execution",
      "Creative refresh needed for Zero-specific messaging",
      "Coordination with On-Premise team on visibility assets"
    ]
  },
  "distribution-gaps": {
    title: "Close distribution gaps in 2L Zero in Convenience",
    description: "Expand availability of family-size Zero to capture At-Home recruitment",
    baselineGrowth: 2,
    maxGrowth: 8,
    investments: {
      media: { baseline: 0, perPoint: 0 },
      trade: { baseline: 10, perPoint: 5 },
      execution: { baseline: 20, perPoint: 8 },
      innovation: { baseline: 0, perPoint: 0 }
    },
    outcomes: [
      "Expected +5% volume in Convenience channel",
      "Close 80% of identified distribution gaps",
      "Improved household penetration among families"
    ],
    risks: [
      "Shelf space competition from private label",
      "Bottler prioritization required",
      "Promotional intensity may be required initially"
    ],
    dependencies: [
      "Bottler agreement on priority coverage",
      "Retailer alignment on planogram space",
      "Supply chain readiness for increased demand"
    ]
  },
  "media-reallocation": {
    title: "Reallocate media from Cola Regular to Cola Zero",
    description: "Shift investment to follow consumer migration in priority markets",
    baselineGrowth: 1,
    maxGrowth: 6,
    investments: {
      media: { baseline: 25, perPoint: 12 },
      trade: { baseline: 0, perPoint: 0 },
      execution: { baseline: 0, perPoint: 0 },
      innovation: { baseline: 5, perPoint: 2 }
    },
    outcomes: [
      "Accelerate category shift momentum",
      "Improved ROI on media investment",
      "Stronger Zero brand equity building"
    ],
    risks: [
      "Cola Regular may decline faster than planned",
      "Internal stakeholder resistance",
      "Brand team capability to manage transition"
    ],
    dependencies: [
      "Leadership alignment on portfolio strategy",
      "Brand team readiness for Zero-first approach",
      "Creative assets for increased Zero activity"
    ]
  },
  "impulse-recruitment": {
    title: "Accelerate Zero recruitment in Impulse occasions",
    description: "Target single-serve chilled availability for on-the-go recruitment",
    baselineGrowth: 4,
    maxGrowth: 15,
    investments: {
      media: { baseline: 5, perPoint: 2 },
      trade: { baseline: 15, perPoint: 6 },
      execution: { baseline: 25, perPoint: 10 },
      innovation: { baseline: 5, perPoint: 1 }
    },
    outcomes: [
      "Expected +8% impulse transactions",
      "Improved chilled availability in top outlets",
      "New consumer recruitment from Impulse entry point"
    ],
    risks: [
      "Cooler space competition intense",
      "Execution consistency across markets",
      "Price perception in impulse occasions"
    ],
    dependencies: [
      "Cooler investment program funded",
      "Bottler execution discipline",
      "Clear pricing architecture for impulse"
    ]
  },
  "premium-innovation": {
    title: "Launch premium Zero SKU for On-Premise",
    description: "Develop differentiated premium Zero for craft/premium competition",
    baselineGrowth: 1,
    maxGrowth: 5,
    investments: {
      media: { baseline: 10, perPoint: 4 },
      trade: { baseline: 20, perPoint: 8 },
      execution: { baseline: 15, perPoint: 5 },
      innovation: { baseline: 30, perPoint: 15 }
    },
    outcomes: [
      "Price/mix improvement +3%",
      "Differentiated positioning vs craft sodas",
      "Premium perception uplift for Zero portfolio"
    ],
    risks: [
      "Innovation execution timeline",
      "On-Premise recovery uncertainty",
      "Premium positioning credibility"
    ],
    dependencies: [
      "R&D pipeline acceleration",
      "Premium packaging development",
      "On-Premise team capability"
    ]
  }
}

const defaultScenario: ActionScenario = {
  title: "Growth Acceleration",
  description: "Strategic initiative to drive volume growth",
  baselineGrowth: 2,
  maxGrowth: 10,
  investments: {
    media: { baseline: 10, perPoint: 5 },
    trade: { baseline: 10, perPoint: 5 },
    execution: { baseline: 10, perPoint: 5 },
    innovation: { baseline: 10, perPoint: 5 }
  },
  outcomes: [
    "Volume growth acceleration",
    "Market share improvement",
    "Brand equity building"
  ],
  risks: [
    "Competitive response",
    "Execution challenges",
    "Market conditions"
  ],
  dependencies: [
    "Resource availability",
    "Organizational alignment",
    "Market conditions"
  ]
}

export function ScenarioBuilderScreen({ partition, actionId, onBack }: ScenarioBuilderProps) {
  const scenario = actionScenarios[actionId] || defaultScenario
  const [targetGrowth, setTargetGrowth] = useState([scenario.baselineGrowth + 2])

  const growthDelta = targetGrowth[0] - scenario.baselineGrowth
  
  const calculateInvestment = (category: keyof typeof scenario.investments) => {
    const { baseline, perPoint } = scenario.investments[category]
    return baseline + (growthDelta * perPoint)
  }

  const totalInvestment = 
    calculateInvestment("media") + 
    calculateInvestment("trade") + 
    calculateInvestment("execution") + 
    calculateInvestment("innovation")

  const investmentIntensity = totalInvestment > 80 ? "High" : totalInvestment > 40 ? "Medium" : "Low"

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-zinc-400 hover:text-zinc-100 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Actions
        </Button>
        
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full ${partition.color}`} />
          <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-400">
            Scenario Builder
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-100">
          {scenario.title}
        </h1>
        <p className="text-lg text-zinc-400 max-w-3xl">
          {scenario.description}
        </p>
      </div>

      {/* Executive Guardrail */}
      <Card className="p-4 bg-amber-500/5 border-amber-500/20 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-amber-400">Indicative scenario — for leadership discussion</span>
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            This is directional and strategic, not a financial forecast. Final investment choices are made at System level.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Column - Target & Investment */}
        <div className="col-span-3 space-y-6">
          {/* Target Definition */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800/50">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-teal-400" />
              <h2 className="text-base font-medium text-zinc-100">Target Definition</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-400">Target volume growth</span>
                  <span className="text-2xl font-semibold text-teal-400">+{targetGrowth[0]}%</span>
                </div>
                <Slider
                  value={targetGrowth}
                  onValueChange={setTargetGrowth}
                  min={scenario.baselineGrowth}
                  max={scenario.maxGrowth}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                  <span>Baseline: +{scenario.baselineGrowth}%</span>
                  <span>Maximum: +{scenario.maxGrowth}%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Incremental growth vs baseline</span>
                  <span className={`text-lg font-medium ${growthDelta > 0 ? "text-emerald-400" : "text-zinc-500"}`}>
                    +{growthDelta} points
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Investment Allocation */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                <h2 className="text-base font-medium text-zinc-100">Required Investments</h2>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  investmentIntensity === "High" 
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : investmentIntensity === "Medium"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {investmentIntensity} intensity vs today
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Media */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-pink-400" />
                  <span className="text-sm text-zinc-300">Media</span>
                </div>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, calculateInvestment("media"))}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm text-zinc-400">
                  €{calculateInvestment("media")}M
                </span>
              </div>

              {/* Trade */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2">
                  <Store className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-zinc-300">Trade</span>
                </div>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, calculateInvestment("trade"))}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm text-zinc-400">
                  €{calculateInvestment("trade")}M
                </span>
              </div>

              {/* Execution */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-zinc-300">Execution</span>
                </div>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, calculateInvestment("execution"))}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm text-zinc-400">
                  €{calculateInvestment("execution")}M
                </span>
              </div>

              {/* Innovation */}
              <div className="flex items-center gap-4">
                <div className="w-24 flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-zinc-300">Innovation</span>
                </div>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, calculateInvestment("innovation"))}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm text-zinc-400">
                  €{calculateInvestment("innovation")}M
                </span>
              </div>

              {/* Total */}
              <div className="pt-4 mt-4 border-t border-zinc-800/50 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">Total Investment</span>
                <span className="text-xl font-semibold text-zinc-100">€{totalInvestment}M</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Outcomes & Risks */}
        <div className="col-span-2 space-y-6">
          {/* What This Enables */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800/50">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <h2 className="text-base font-medium text-zinc-100">What This Enables</h2>
            </div>
            <ul className="space-y-3">
              {scenario.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{outcome}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Risks & Dependencies */}
          <Card className="p-6 bg-zinc-900/50 border-zinc-800/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-medium text-zinc-100">Risks & Dependencies</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Key Risks</p>
                <ul className="space-y-2">
                  {scenario.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-sm text-zinc-400">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-800/50">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Dependencies</p>
                <ul className="space-y-2">
                  {scenario.dependencies.map((dep, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-zinc-400">{dep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Summary Card */}
          <Card className="p-6 bg-gradient-to-br from-teal-500/10 to-transparent border-teal-500/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              <h3 className="text-sm font-medium text-zinc-100">Scenario Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Target growth</span>
                <span className="text-sm font-medium text-teal-400">+{targetGrowth[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Total investment</span>
                <span className="text-sm font-medium text-zinc-100">€{totalInvestment}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-400">Cost per growth point</span>
                <span className="text-sm font-medium text-zinc-100">
                  €{growthDelta > 0 ? Math.round((totalInvestment - 40) / growthDelta) : 0}M
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
        <p className="text-xs text-zinc-500 italic">
          This is not a commitment. Scenarios are for leadership discussion and strategic planning.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Export Scenario
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-500 text-white">
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  )
}
