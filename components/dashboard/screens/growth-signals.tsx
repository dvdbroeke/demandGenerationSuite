"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ArrowRight,
  Clock,
  Zap,
  MinusCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Signal {
  id: string
  title: string
  partition: string
  type: "emerging" | "accelerating" | "weakening" | "warning"
  change: string
  confidenceLevel: "high" | "medium" | "low"
  timeframe: string
  implication: string
  source: string
}

const signals: Signal[] = [
  {
    id: "1",
    title: "Energy drinks gaining share from traditional colas in morning occasions",
    partition: "Fuel & Uplift",
    type: "accelerating",
    change: "+2.3pp vs last cycle",
    confidenceLevel: "high",
    timeframe: "Last 6 months",
    implication: "Portfolio rebalancing opportunity in morning daypart",
    source: "Nielsen Panel + Social Listening"
  },
  {
    id: "2",
    title: "Sugar-free preference accelerating faster than forecast in DE/FR",
    partition: "Cola Zero",
    type: "accelerating",
    change: "+4.1pp penetration growth",
    confidenceLevel: "high",
    timeframe: "YTD 2024",
    implication: "Consider accelerating Zero capacity investments",
    source: "Euromonitor + Internal Sales"
  },
  {
    id: "3",
    title: "ARTD category showing early mainstream adoption signals in GB",
    partition: "Adult Refreshment",
    type: "emerging",
    change: "Trial rate +18% YoY",
    confidenceLevel: "medium",
    timeframe: "Q3-Q4 2024",
    implication: "Watch for category tipping point; prepare distribution",
    source: "Kantar Worldpanel"
  },
  {
    id: "4",
    title: "Private label gaining in value segments across Southern Europe",
    partition: "Classic Core",
    type: "weakening",
    change: "-1.8pp share loss",
    confidenceLevel: "high",
    timeframe: "Last 12 months",
    implication: "Price architecture review needed in ES/IT",
    source: "IRI Store Data"
  },
  {
    id: "5",
    title: "Hydration occasion shifting to functional waters",
    partition: "Hydration",
    type: "warning",
    change: "Traditional water -3.2% volume",
    confidenceLevel: "medium",
    timeframe: "Last 9 months",
    implication: "Smartwater positioning may need refresh",
    source: "Social + Panel Data"
  },
  {
    id: "6",
    title: "Coffee ready-to-drink showing weekend consumption growth",
    partition: "Coffee",
    type: "emerging",
    change: "+12% weekend occasions",
    confidenceLevel: "low",
    timeframe: "Last 3 months",
    implication: "Early signal; monitor before investment",
    source: "Costa App Data"
  },
]

const signalTypeConfig = {
  emerging: { 
    icon: Zap, 
    color: "text-blue-400", 
    bgColor: "bg-blue-500/10", 
    borderColor: "border-blue-500/20",
    label: "Emerging"
  },
  accelerating: { 
    icon: TrendingUp, 
    color: "text-emerald-400", 
    bgColor: "bg-emerald-500/10", 
    borderColor: "border-emerald-500/20",
    label: "Accelerating"
  },
  weakening: { 
    icon: TrendingDown, 
    color: "text-amber-400", 
    bgColor: "bg-amber-500/10", 
    borderColor: "border-amber-500/20",
    label: "Weakening"
  },
  warning: { 
    icon: AlertTriangle, 
    color: "text-red-400", 
    bgColor: "bg-red-500/10", 
    borderColor: "border-red-500/20",
    label: "Early Warning"
  },
}

const confidenceConfig = {
  high: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10" },
  low: { color: "text-zinc-400", bg: "bg-zinc-500/10" },
}

export function GrowthSignalsScreen() {
  const emergingSignals = signals.filter(s => s.type === "emerging")
  const acceleratingSignals = signals.filter(s => s.type === "accelerating")
  const weakeningSignals = signals.filter(s => s.type === "weakening" || s.type === "warning")

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Growth Signals</h1>
        <p className="text-sm text-zinc-500 mt-1">
          What has changed since last cycle — emerging vs weakening signals, early warnings & accelerations
        </p>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-zinc-300">{acceleratingSignals.length} Accelerating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-zinc-300">{emergingSignals.length} Emerging</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-zinc-300">{weakeningSignals.length} Weakening / Warning</span>
        </div>
        <div className="ml-auto text-xs text-zinc-500">
          Last updated: Jan 2024 cycle
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {signals.map((signal) => {
          const config = signalTypeConfig[signal.type]
          const confConfig = confidenceConfig[signal.confidenceLevel]
          const Icon = config.icon
          
          return (
            <Card 
              key={signal.id}
              className={cn(
                "bg-zinc-900/50 border transition-all hover:border-zinc-700 cursor-pointer",
                config.borderColor
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className={cn("p-2 rounded-lg", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", config.color, config.borderColor)}>
                    {config.label}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-medium text-zinc-100 leading-tight mt-3">
                  {signal.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">
                    {signal.partition}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px]", confConfig.color, confConfig.bg)}>
                    {signal.confidenceLevel} confidence
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="h-3 w-3 text-zinc-500" />
                    <span className={config.color}>{signal.change}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <span className="text-zinc-400">{signal.timeframe}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/50">
                  <p className="text-[11px] text-zinc-500 mb-1">Implication</p>
                  <p className="text-xs text-zinc-300">{signal.implication}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-zinc-600">{signal.source}</span>
                  <button className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300">
                    Explore <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Leadership Attention Section */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-amber-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Signals Requiring Leadership Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
              <MinusCircle className="h-4 w-4 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-100">Energy vs Cola trade-off in morning occasions</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Signal strength increasing — may require portfolio strategy discussion at next SteerCo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
              <MinusCircle className="h-4 w-4 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-100">Private label pressure in Southern Europe</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Confidence level high — pricing architecture review recommended for Q1
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
