"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Calculator, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Target,
  DollarSign,
  Percent,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InvestmentAllocation {
  lever: string
  allocation: number
  color: string
}

export function ScenariosInvestmentScreen() {
  const [growthTarget, setGrowthTarget] = useState([4])
  
  const baseInvestment = 100 // €100M base
  const targetMultiplier = growthTarget[0] / 2 // 2% = 1x, 6% = 3x
  const totalInvestment = Math.round(baseInvestment * targetMultiplier)

  const allocations: InvestmentAllocation[] = [
    { lever: "Media & Brand", allocation: 35, color: "bg-purple-500" },
    { lever: "Trade & Execution", allocation: 30, color: "bg-blue-500" },
    { lever: "Innovation & NPD", allocation: 20, color: "bg-emerald-500" },
    { lever: "Capability Building", allocation: 15, color: "bg-amber-500" },
  ]

  const outcomes = [
    { metric: "Value Share Gain", value: `+${(growthTarget[0] * 0.4).toFixed(1)}pp`, direction: "up" },
    { metric: "Volume Growth", value: `+${(growthTarget[0] * 0.8).toFixed(1)}%`, direction: "up" },
    { metric: "Margin Impact", value: `${growthTarget[0] > 4 ? "-" : "+"}${Math.abs(growthTarget[0] - 4) * 0.3}pp`, direction: growthTarget[0] > 4 ? "down" : "up" },
    { metric: "Portfolio Health", value: growthTarget[0] > 3 ? "Improving" : "Stable", direction: "up" },
  ]

  const risks = [
    { risk: "Execution capacity constraints in key markets", severity: growthTarget[0] > 4 ? "high" : "medium" },
    { risk: "Competitive response in energy category", severity: "medium" },
    { risk: "Supply chain readiness for Zero variants", severity: growthTarget[0] > 5 ? "high" : "low" },
  ]

  const costPerGrowthPoint = Math.round(totalInvestment / growthTarget[0])

  return (
    <div className="p-8 space-y-8">
      {/* Header with Disclaimer */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Scenarios & Investment</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Target-based scenario exploration — required investment envelopes, trade-offs and sensitivities
        </p>
        <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-400">Directional & Exploratory</p>
              <p className="text-xs text-zinc-400 mt-1">
                This is NOT a financial commitment or budget request. Scenarios are indicative, for leadership discussion and strategic alignment. 
                Investment figures are illustrative ranges based on historical benchmarks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scenario Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Target Slider */}
        <Card className="lg:col-span-1 bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              Growth Ambition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-end justify-between mb-4">
                <span className="text-5xl font-bold text-amber-400">{growthTarget[0]}%</span>
                <span className="text-sm text-zinc-500">CAGR Target</span>
              </div>
              <Slider
                value={growthTarget}
                onValueChange={setGrowthTarget}
                min={2}
                max={6}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-zinc-600">Conservative (2%)</span>
                <span className="text-[10px] text-zinc-600">Aggressive (6%)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Required Investment</span>
                <span className="text-lg font-bold text-zinc-100">€{totalInvestment}M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Cost per Growth Point</span>
                <span className="text-sm font-medium text-zinc-300">€{costPerGrowthPoint}M / pp</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Allocation */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Investment Allocation (Illustrative)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allocations.map((item) => (
                <div key={item.lever} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">{item.lever}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-100">
                        €{Math.round(totalInvestment * item.allocation / 100)}M
                      </span>
                      <span className="text-xs text-zinc-500">({item.allocation}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", item.color)}
                      style={{ width: `${item.allocation}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <div className="grid grid-cols-4 gap-4">
                {outcomes.map((outcome) => (
                  <div key={outcome.metric} className="text-center">
                    <p className={cn(
                      "text-lg font-bold",
                      outcome.direction === "up" ? "text-emerald-400" : "text-red-400"
                    )}>
                      {outcome.value}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">{outcome.metric}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade-offs & Sensitivities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-400" />
              Key Trade-offs at {growthTarget[0]}% Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-300">Core vs Accelerator Balance</span>
                  <Badge variant="outline" className="text-[10px] border-zinc-600 text-zinc-400">
                    {growthTarget[0] > 4 ? "Accelerator-heavy" : "Balanced"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-amber-500/30 rounded-full" />
                  <span className="text-[10px] text-zinc-500">{growthTarget[0] > 4 ? "40/60" : "60/40"}</span>
                  <div className="flex-1 h-2 bg-teal-500/30 rounded-full" />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-amber-400">Core</span>
                  <span className="text-[10px] text-teal-400">Accelerator</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-300">Short vs Long Term</span>
                  <Badge variant="outline" className="text-[10px] border-zinc-600 text-zinc-400">
                    {growthTarget[0] > 4 ? "Future-weighted" : "Near-term focus"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  {growthTarget[0] > 4 
                    ? "Higher targets require accepting near-term margin pressure for future category positions"
                    : "Conservative targets prioritize current profitability over category expansion"
                  }
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-300">System Resource Allocation</span>
                  <Badge variant="outline" className="text-[10px] border-zinc-600 text-zinc-400">
                    {growthTarget[0] > 5 ? "Stretched" : "Manageable"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  {growthTarget[0] > 5 
                    ? "Requires significant bottler capacity expansion and capability acceleration"
                    : "Within current System capacity with selective prioritization"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Risks & Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {risks.map((item, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "p-4 rounded-lg border",
                    item.severity === "high" 
                      ? "bg-red-500/5 border-red-500/20"
                      : item.severity === "medium"
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-zinc-800/30 border-zinc-700/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn(
                      "h-4 w-4 mt-0.5",
                      item.severity === "high" ? "text-red-400" :
                      item.severity === "medium" ? "text-amber-400" : "text-zinc-500"
                    )} />
                    <div>
                      <p className="text-sm text-zinc-300">{item.risk}</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] mt-2",
                          item.severity === "high" ? "border-red-500/30 text-red-400" :
                          item.severity === "medium" ? "border-amber-500/30 text-amber-400" : 
                          "border-zinc-600 text-zinc-500"
                        )}
                      >
                        {item.severity} risk at this target
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
              <p className="text-xs text-zinc-500 mb-2">Key Dependencies</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <ArrowRight className="h-3 w-3 text-zinc-600" />
                  Bottler alignment on investment priorities
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <ArrowRight className="h-3 w-3 text-zinc-600" />
                  Supply chain capacity for Zero expansion
                </li>
                <li className="flex items-center gap-2 text-xs text-zinc-400">
                  <ArrowRight className="h-3 w-3 text-zinc-600" />
                  Regulatory environment for ARTD category
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison (Optional) */}
      <Card className="bg-zinc-900/30 border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-400">Quick Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: "Conservative", target: 2, investment: 100 },
              { name: "Base Case", target: 4, investment: 200 },
              { name: "Aggressive", target: 6, investment: 300 },
            ].map((scenario) => (
              <div 
                key={scenario.name}
                className={cn(
                  "p-4 rounded-lg border text-center transition-all cursor-pointer",
                  growthTarget[0] === scenario.target 
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600"
                )}
                onClick={() => setGrowthTarget([scenario.target])}
              >
                <p className="text-sm font-medium text-zinc-300">{scenario.name}</p>
                <p className="text-2xl font-bold text-amber-400 my-2">{scenario.target}%</p>
                <p className="text-xs text-zinc-500">~€{scenario.investment}M investment</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
