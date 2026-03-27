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
  { channel: "Cinema", dietCoke: 1.5, cokeZero: 1.4, drPepper: null, fanta: 1.1 },
  { channel: "Out of Home", dietCoke: 0.3, cokeZero: 0.3, drPepper: 0.1, fanta: 0.1 },
  { channel: "Flex Television", dietCoke: 0.9, cokeZero: 0.7, drPepper: null, fanta: null },
  { channel: "Meta", dietCoke: 1.7, cokeZero: 3.5, drPepper: 1.5, fanta: 2.2, cokeZeroHighlight: true },
  { channel: "Other Social", dietCoke: null, cokeZero: 0.9, drPepper: 0.6, fanta: 0.2 },
  { channel: "Pinterest", dietCoke: 1.0, cokeZero: 1.1, drPepper: null, fanta: null },
  { channel: "Snapchat", dietCoke: 0.4, cokeZero: 1.5, drPepper: 1.3, fanta: 0.8 },
  { channel: "TikTok", dietCoke: 0.2, cokeZero: 1.7, drPepper: 1.4, fanta: 0.8, cokeZeroHighlight: true, sum: "Σ = 2.2" },
  { channel: "Other Video", dietCoke: 0.9, cokeZero: 1.1, drPepper: null, fanta: 0.9 },
  { channel: "YouTube", dietCoke: 0.7, cokeZero: 1.6, drPepper: 0.6, fanta: 0.5, cokeZeroHighlight: true, sum: "Σ = 1.3" },
  { channel: "Other Display", dietCoke: 1.1, cokeZero: 1.1, drPepper: null, fanta: null },
  { channel: "YouTube (Display)", dietCoke: null, cokeZero: 0.5, drPepper: null, fanta: null },
  { channel: "The Trade Desk", dietCoke: null, cokeZero: 0.2, drPepper: null, fanta: null },
  { channel: "Other Audio", dietCoke: null, cokeZero: 0.7, drPepper: null, fanta: null },
  { channel: "Spotify", dietCoke: 0.3, cokeZero: 0.6, drPepper: null, fanta: 0.4 },
  { channel: "Netflix", dietCoke: 0.7, cokeZero: 1.2, drPepper: null, fanta: null },
  { channel: "Other Connected TV", dietCoke: 0.3, cokeZero: 0.4, drPepper: null, fanta: null },
  { channel: "Rest", dietCoke: null, cokeZero: 1.0, drPepper: null, fanta: 1.3 },
  { channel: "Promo Overall", dietCoke: 1.0, cokeZero: 0.9, drPepper: 0.8, fanta: 0.5 },
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

export function FuelightOpportunityView({ onBack, onLaunchInitiative, onRunOptimizer }: OpportunityViewProps) {
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
                  <p className="text-xs text-amber-400/70">Optimize media channel allocation for Coke Zero</p>
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
                To build mental availability for Coca-Cola Zero esp. for younger consumer, we will need to shift media into Social (esp. Meta) and Online Video (esp. YouTube)
              </h2>
              <p className="text-sm text-zinc-400 mb-4">
                The data shows significantly higher ROI for Coke Zero in digital channels compared to Diet Coke promotional spend. 
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
                  <th className="text-center p-2 text-zinc-400 w-28">Diet Coke</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Coke Zero</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Dr. Pepper</th>
                  <th className="text-center p-2 text-zinc-400 w-28">Fanta</th>
                </tr>
              </thead>
              <tbody>
                {roiByChannel.map((row, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/50">
                    <td className="p-2 text-zinc-300">{row.channel}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn("h-4 rounded", getBarColor(row.dietCoke))}
                          style={{ width: `${getBarWidth(row.dietCoke)}%` }}
                        />
                        <span className="text-zinc-400 text-[10px]">
                          {row.dietCoke ?? "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn(
                            "h-4 rounded",
                            getBarColor(row.cokeZero, row.cokeZeroHighlight),
                            row.cokeZeroHighlight && "ring-2 ring-red-400"
                          )}
                          style={{ width: `${getBarWidth(row.cokeZero)}%` }}
                        />
                        <span className={cn(
                          "text-[10px]",
                          row.cokeZeroHighlight ? "text-red-400 font-semibold" : "text-zinc-400"
                        )}>
                          {row.cokeZero ?? "N/A"}
                          {row.sum && <span className="ml-1 text-red-300">{row.sum}</span>}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn("h-4 rounded", getBarColor(row.drPepper))}
                          style={{ width: `${getBarWidth(row.drPepper)}%` }}
                        />
                        <span className="text-zinc-400 text-[10px]">
                          {row.drPepper ?? "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className={cn("h-4 rounded", getBarColor(row.fanta))}
                          style={{ width: `${getBarWidth(row.fanta)}%` }}
                        />
                        <span className="text-zinc-400 text-[10px]">
                          {row.fanta ?? "N/A"}
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
              Highest ROI channel for Coke Zero
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
                <strong>Shift</strong> Diet Coke promotional budget away from retail promo
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-4 w-4 text-emerald-400 mt-0.5" />
              <p className="text-sm text-zinc-300">
                <strong>Invest</strong> in Coke Zero mental availability via Social and Online Video
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
          Launch Initiative: Coke Zero Fan Base Expansion via Social & Online Video
        </Button>
      </div>
    </div>
  )
}
