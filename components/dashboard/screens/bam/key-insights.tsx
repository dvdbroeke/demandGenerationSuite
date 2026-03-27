"use client"

import React from "react"
import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  Layers,
  Users,
  Zap
} from "lucide-react"
import { BAMLogo } from "@/components/ui/platform-logos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BAMKeyInsightsProps {
  onNavigate?: (screen: string) => void
}

const markets = [
  { code: "sp", name: "Spain" },
  { code: "de", name: "Germany" },
  { code: "gb", name: "Great Britain" },
  { code: "fr", name: "France" },
  { code: "be", name: "Belgium" },
  { code: "nl", name: "Netherlands" },
  { code: "it", name: "Italy" },
  { code: "pl", name: "Poland" },
  { code: "ro", name: "Romania" },
  { code: "ch", name: "Switzerland" },
  { code: "at", name: "Austria" },
  { code: "gr", name: "Greece" },
  { code: "rs", name: "Serbia" },
]

const years = ["2025", "2024", "2023", "2022", "2021", "2020"]

interface Insight {
  impact: "High Impact" | "Medium Impact"
  title: string
  description: string
}

interface InsightSection {
  icon: React.ElementType
  title: string
  insights: Insight[]
}

const insightSections: InsightSection[] = [
  {
    icon: TrendingUp,
    title: "Market Insights",
    insights: [
      {
        impact: "High Impact",
        title: "Market Growing in Value, Slower in Volume",
        description: "$12.4B market growing ~5.2% CAGR in value but slower in volume. Growth driven by premiumization and strategic pricing."
      }
    ]
  },
  {
    icon: Layers,
    title: "Partition Insights",
    insights: [
      {
        impact: "High Impact",
        title: "Premium Segments Driving Growth",
        description: "Segment A2 and Segment C driving 115% of volume growth. Brand A trailing Competitor B in premium partition."
      },
      {
        impact: "Medium Impact",
        title: "Specialty Segment Fast Growing",
        description: "Specialty segments emerging as fast-growing partition (~$680M) with Competitor B winning; Competitor C close second."
      }
    ]
  },
  {
    icon: Users,
    title: "Brand Insights",
    insights: [
      {
        impact: "High Impact",
        title: "Brand A Loyalty Gap",
        description: "Brand A has inferior loyalty metrics vs. Competitor B (4.8 vs 14.2 index). Brand A Classic consumers switching to Competitor B rather than Brand A Premium."
      },
      {
        impact: "Medium Impact",
        title: "Classic Segment Skews Older",
        description: "Brand A Classic consumers tend to be >50 years old. Need to defend partition with older generations while capturing migration to premium."
      }
    ]
  },
  {
    icon: Zap,
    title: "Action Insights",
    insights: [
      {
        impact: "High Impact",
        title: "Emerging Segment: Route to Play Needed",
        description: "Secular growth in Segment D driven by Competitor X & Competitor Y. Enterprise has limited owned portfolio, needs clear route to play."
      }
    ]
  }
]

export function BAMKeyInsights({ onNavigate }: BAMKeyInsightsProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")

  const getImpactColor = (impact: string) => {
    if (impact === "High Impact") {
      return "bg-red-500/20 text-red-400 border-red-500/30"
    }
    return "bg-amber-500/20 text-amber-400 border-amber-500/30"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <BAMLogo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Brand Accelerator Model</h1>
            <p className="text-xs text-zinc-500">Strategic Market Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
              {markets.map((market) => (
                <SelectItem key={market.code} value={market.code} className="text-zinc-100 text-xs">
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {years.map((year) => (
                <SelectItem key={year} value={year} className="text-zinc-100 text-xs">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button 
          onClick={() => onNavigate?.("overview")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Overview
        </button>
        <button 
          onClick={() => onNavigate?.("partitions-heatmap")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Partitions Heatmap
        </button>
        <button 
          onClick={() => onNavigate?.("partition-tree")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Partition Tree
        </button>
        <button 
          onClick={() => onNavigate?.("market-map")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Market Map
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">
          AI-Driven Insights
        </button>
      </div>

      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">AI-Driven Insights & Observations</h2>
        <p className="text-sm text-zinc-500">Critical findings from the Brand Accelerator Model analysis</p>
      </div>

      {/* Insight Sections */}
      <div className="space-y-8">
        {insightSections.map((section) => (
          <div key={section.title} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <section.icon className="h-4 w-4 text-teal-400" />
              <h2 className="text-sm font-semibold text-zinc-200">{section.title}</h2>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-2 gap-4">
              {section.insights.map((insight, idx) => (
                <Card key={idx} className="bg-zinc-900/50 border-zinc-800/50">
                  <CardContent className="p-4">
                    <Badge className={`${getImpactColor(insight.impact)} mb-2`}>
                      {insight.impact}
                    </Badge>
                    <h3 className="text-sm font-semibold text-zinc-100 mb-2">{insight.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
