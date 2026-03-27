"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Package,
  BarChart3,
  Crown,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const kpiData = [
  {
    title: "Market Value",
    value: "€11.1B",
    change: "+5.9%",
    changeLabel: "CAGR",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Market Volume",
    value: "1,323M",
    subValue: "UC",
    change: "+1.3%",
    changeLabel: "CAGR",
    trend: "up",
    icon: Package,
  },
  {
    title: "Enterprise Share",
    value: "50%",
    change: "Market Leader",
    changeLabel: "",
    trend: "neutral",
    icon: Crown,
  },
  {
    title: "Growth Hotspots",
    value: "7",
    change: "High-growth",
    changeLabel: "partitions",
    trend: "up",
    icon: Flame,
  },
]

const executiveSummary = [
  {
    text: "Total NARTD market growing at +5.9% value CAGR, outpacing volume growth (+1.3%)",
    trend: "up",
  },
  {
    text: "Enterprise maintains 50% market share with strong positioning in core Cola segments",
    trend: "neutral",
  },
  {
    text: "Zero Sugar variants driving significant growth (+12.4% CAGR), representing premiumization opportunity",
    trend: "up",
  },
  {
    text: "Energy segment expanding rapidly but Enterprise share remains under-indexed at 23%",
    trend: "down",
  },
  {
    text: "Cherry/Dark Fruit emerging as flavor innovation hotspot with +8.7% growth",
    trend: "up",
  },
]

const growthHotspots = [
  { name: "Zero Cola 500ml+", growth: "+12.4%", color: "bg-teal-500" },
  { name: "Energy Drinks", growth: "+15.2%", color: "bg-amber-500" },
  { name: "Cherry/Dark Fruit", growth: "+8.7%", color: "bg-rose-500" },
  { name: "Large Format PET", growth: "+6.8%", color: "bg-violet-500" },
  { name: "Citrus Zero", growth: "+9.1%", color: "bg-lime-500" },
  { name: "On-The-Go 330ml", growth: "+5.4%", color: "bg-sky-500" },
  { name: "Multi-Pack Value", growth: "+4.9%", color: "bg-orange-500" },
]

const priorityInsights = [
  {
    type: "Market",
    title: "Premiumization Accelerating",
    insight:
      "Value growth outpacing volume by 4.6pp suggests consumers trading up to premium formats and sugar-free variants.",
    impact: "High",
  },
  {
    type: "Brand",
    title: "Zero Portfolio Momentum",
    insight:
      "Brand A Zero capturing 68% of zero-segment growth. Opportunity to extend zero positioning to Brand C and Brand D.",
    impact: "High",
  },
  {
    type: "Partition",
    title: "Energy Gap Closure",
    insight:
      "Competitor X and Competitor Y dominating energy with 77% combined share. Brand E RTD and energy hybrids represent entry vector.",
    impact: "High",
  },
  {
    type: "Market",
    title: "Convenience Channel Surge",
    insight:
      "Immediate consumption occasions +18% YoY. On-the-go formats in petrol and convenience showing strongest velocity.",
    impact: "Medium",
  },
]

const typeColors: Record<string, string> = {
  Market: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Brand: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  Partition: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export function OverviewScreen() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card
              key={kpi.title}
              className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">{kpi.title}</p>
                    <p className="text-2xl font-semibold text-zinc-100">
                      {kpi.value}
                      {kpi.subValue && (
                        <span className="text-sm text-zinc-500 ml-1">
                          {kpi.subValue}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {kpi.trend === "up" && (
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      {kpi.trend === "down" && (
                        <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          kpi.trend === "up"
                            ? "text-emerald-400"
                            : kpi.trend === "down"
                              ? "text-red-400"
                              : "text-zinc-400"
                        }`}
                      >
                        {kpi.change}
                      </span>
                      {kpi.changeLabel && (
                        <span className="text-xs text-zinc-500">
                          {kpi.changeLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 bg-zinc-800 rounded-lg">
                    <Icon className="h-5 w-5 text-zinc-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Executive Summary */}
        <Card className="col-span-2 bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-zinc-100 text-base font-semibold">
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {executiveSummary.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-1 p-1 rounded ${
                      item.trend === "up"
                        ? "bg-emerald-500/10"
                        : item.trend === "down"
                          ? "bg-red-500/10"
                          : "bg-zinc-800"
                    }`}
                  >
                    {item.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : item.trend === "down" ? (
                      <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    ) : (
                      <BarChart3 className="h-3.5 w-3.5 text-zinc-500" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Growth Hotspots */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-zinc-100 text-base font-semibold">
                Growth Hotspots
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {growthHotspots.map((hotspot) => (
                <div
                  key={hotspot.name}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full border border-zinc-700/50"
                >
                  <div className={`w-2 h-2 rounded-full ${hotspot.color}`} />
                  <span className="text-sm text-zinc-200">{hotspot.name}</span>
                  <span className="text-xs font-medium text-emerald-400">
                    {hotspot.growth}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-zinc-100 text-base font-semibold">
            Priority Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {priorityInsights.map((insight, i) => (
              <div
                key={i}
                className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={typeColors[insight.type]}
                  >
                    {insight.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      insight.impact === "High"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : "bg-zinc-700/50 text-zinc-400 border-zinc-600"
                    }`}
                  >
                    {insight.impact} impact
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-zinc-100 mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {insight.insight}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
