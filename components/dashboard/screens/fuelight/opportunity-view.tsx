"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  Play,
  Check,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OpportunityViewProps {
  onBack: () => void
  onLaunchInitiative: () => void
  onRunOptimizer?: () => void
}

const roiByChannel = [
  { channel: "Cinema", productADiet: 1.5, productAZero: 1.4, productB: null, productC: 1.1 },
  { channel: "Out of Home", productADiet: 0.3, productAZero: 0.3, productB: 0.1, productC: 0.1 },
  { channel: "Flex Television", productADiet: 0.9, productAZero: 0.7, productB: null, productC: null },
  { channel: "Meta", productADiet: 1.7, productAZero: 3.5, productB: 1.5, productC: 2.2, productAZeroHighlight: true },
  { channel: "Other Social", productADiet: null, productAZero: 0.9, productB: 0.6, productC: 0.2 },
  { channel: "Pinterest", productADiet: 1.0, productAZero: 1.1, productB: null, productC: null },
  { channel: "Snapchat", productADiet: 0.4, productAZero: 1.5, productB: 1.3, productC: 0.8 },
  { channel: "TikTok", productADiet: 0.2, productAZero: 1.7, productB: 1.4, productC: 0.8, productAZeroHighlight: true, sum: "Σ = 2.2" },
  { channel: "Other Video", productADiet: 0.9, productAZero: 1.1, productB: null, productC: 0.9 },
  { channel: "YouTube", productADiet: 0.7, productAZero: 1.6, productB: 0.6, productC: 0.5, productAZeroHighlight: true, sum: "Σ = 1.3" },
  { channel: "Other Display", productADiet: 1.1, productAZero: 1.1, productB: null, productC: null },
  { channel: "YouTube (Display)", productADiet: null, productAZero: 0.5, productB: null, productC: null },
  { channel: "The Trade Desk", productADiet: null, productAZero: 0.2, productB: null, productC: null },
  { channel: "Other Audio", productADiet: null, productAZero: 0.7, productB: null, productC: null },
  { channel: "Spotify", productADiet: 0.3, productAZero: 0.6, productB: null, productC: 0.4 },
  { channel: "Netflix", productADiet: 0.7, productAZero: 1.2, productB: null, productC: null },
  { channel: "Other Connected TV", productADiet: 0.3, productAZero: 0.4, productB: null, productC: null },
  { channel: "Rest", productADiet: null, productAZero: 1.0, productB: null, productC: 1.3 },
  { channel: "Promo Overall", productADiet: 1.0, productAZero: 0.9, productB: 0.8, productC: 0.5 },
]

const getBarWidth = (value: number | null) => {
  if (value === null) return 0
  return Math.min(value * 30, 100)
}

const getBarColor = (value: number | null, highlight?: boolean) => {
  if (value === null) return "bg-transparent"
  if (highlight) return "bg-red-500"
  if (value >= 1.5) return "bg-red-400"
  if (value >= 1.0) return "bg-red-300"
  return "bg-red-200"
}

export function ArtemisOpportunityView({ onBack, onLaunchInitiative, onRunOptimizer }: OpportunityViewProps) {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Root Cause
          </Button>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Opportunity View</h1>
            <p className="text-sm text-zinc-500">What to do instead</p>
          </div>
        </div>
      </div>

      {/* Main Insight */}
      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <CardContent className="p-6">
          {/* Run Optimizer CTA */}
          {onRunOptimizer && (
            <button
              onClick={onRunOptimizer}
              className="w-full mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-amber-300">Run Optimizer</span>
                  <p className="text-xs text-amber-400/70">Optimize media channel allocation for Product A Zero</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Lightbulb className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                To build mental availability for Product A Zero esp. for younger consumer, we will need to shift media into Social (esp. Meta) and Online Video (esp. YouTube)
              </h2>
              <p className="text-sm text-zinc-400 mb-4">
                The data shows significantly higher ROI for Product A Zero in digital channels compared to Product A Diet promotional spend. 
                Redirecting investment builds brand equity without triggering cannibalization.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  High ROI Opportunity
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Mental Availability Build
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI by Channel Matrix */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100">
            ROI by brand x channel combinations in 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-2 text-zinc-500 font-normal w-32">Channel</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Product A Diet</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Product A Zero</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Product B</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Product C</th>
                </tr>
              </thead>
              <tbody>
                {roiByChannel.map((row, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/50">
                    <td className="p-2 text-zinc-300">{row.channel}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn("h-4 rounded", getBarColor(row.productADiet))}
                          style={{ width: `${getBarWidth(row.productADiet)}%` }}
                        />
                        <span className="text-zinc-400 text-[10px]">
                          {row.productADiet ?? "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn(
                            "h-4 rounded",
                            getBarColor(row.productAZero, row.productAZeroHighlight),
                            row.productAZeroHighlight && "ring-2 ring-red-400"
                          )}
                          style={{ width: `${getBarWidth(row.productAZero)}%` }}
                        />
                        <span className={cn(
                          "text-[10px]",
                          row.productAZeroHighlight ? "text-red-400 font-semibold" : "text-zinc-400"
                        )}>
                          {row.productAZero ?? "N/A"}
                          {row.sum && <span className="ml-1 text-red-300">{row.sum}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn("h-4 rounded", getBarColor(row.productB))}
                          style={{ width: `${getBarWidth(row.productB)}%` }}
                        />
                        <span className="text-zinc-400 text-[10px]">
                          {row.productB ?? "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn("h-4 rounded", getBarColor(row.productC))}
                          style={{ width: `${getBarWidth(row.productC)}%` }}
                        />
                        <span className="text-zinc-400 text-[10px]">
                          {row.productC ?? "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Opportunities */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Meta (Social)</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">3.5x ROI</p>
            <p className="text-xs text-zinc-500 mt-1">
              Highest ROI channel for Product A Zero
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-500/20">
              <p className="text-[10px] text-zinc-400">
                Reaches younger demographic with high engagement
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">TikTok</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">Σ 2.2x ROI</p>
            <p className="text-xs text-zinc-500 mt-1">
              Strong performance in short-form video
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-500/20">
              <p className="text-[10px] text-zinc-400">
                Gen Z primary platform, brand building opportunity
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">YouTube</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">Σ 1.3x ROI</p>
            <p className="text-xs text-zinc-500 mt-1">
              Strong online video performance
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-500/20">
              <p className="text-[10px] text-zinc-400">
                Long-form storytelling, broad reach
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation Summary */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-zinc-100 mb-4">Recommended Action</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="h-4 w-4 text-emerald-400 mt-0.5" />
              <p className="text-sm text-zinc-300">
                <strong>Shift</strong> Product A Diet promotional budget away from retail promo
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-4 w-4 text-emerald-400 mt-0.5" />
              <p className="text-sm text-zinc-300">
                <strong>Invest</strong> in Product A Zero mental availability via Social and Online Video
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-4 w-4 text-emerald-400 mt-0.5" />
              <p className="text-sm text-zinc-300">
                <strong>Target</strong> younger consumers to build fan base and reduce vulnerability
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-4 w-4 text-emerald-400 mt-0.5" />
              <p className="text-sm text-zinc-300">
                <strong>Monitor</strong> cannibalization metrics monthly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Initiative CTA */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onLaunchInitiative}
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold px-8"
        >
          <Play className="h-4 w-4 mr-2" />
          Launch Initiative: Product A Zero Fan Base Expansion via Social & Online Video
        </Button>
      </div>
    </div>
  )
}
