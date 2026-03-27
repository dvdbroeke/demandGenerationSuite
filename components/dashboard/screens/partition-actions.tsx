"use client"

import React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Target, 
  Megaphone, 
  Store, 
  Package, 
  DollarSign,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle
} from "lucide-react"

interface PartitionActionsProps {
  partition: {
    id: string
    name: string
    color: string
  }
  onBack: () => void
  onSelectAction: (action: string) => void
}

type ActionLever = "Demand" | "Execution" | "Portfolio" | "Pricing" | "Media"
type Confidence = "High" | "Medium"
type TimeHorizon = "Near-term" | "Mid-term"

interface Action {
  id: string
  title: string
  description: string
  lever: ActionLever
  confidence: Confidence
  timeHorizon: TimeHorizon
  impact: string
}

const partitionActions: Record<string, Action[]> = {
  "cola-zero": [
    {
      id: "mental-availability",
      title: "Increase mental availability vs Pepsi Max in AFH",
      description: "Accelerate brand presence and visibility in Away From Home channel to capture share from Pepsi Max in key battleground occasions.",
      lever: "Media",
      confidence: "High",
      timeHorizon: "Near-term",
      impact: "+2-3pp share in AFH channel"
    },
    {
      id: "distribution-gaps",
      title: "Close distribution gaps in 2L Zero in Convenience & Symbols",
      description: "Expand availability of family-size Zero in high-frequency convenience stores to capture At-Home recruitment occasions.",
      lever: "Execution",
      confidence: "High",
      timeHorizon: "Near-term",
      impact: "+5% volume in Convenience"
    },
    {
      id: "media-reallocation",
      title: "Reallocate media from Cola Regular to Cola Zero in priority markets",
      description: "Shift media investment to follow consumer migration. Prioritize GB, DE, FR where Zero growth is strongest.",
      lever: "Media",
      confidence: "Medium",
      timeHorizon: "Mid-term",
      impact: "Accelerate category shift"
    },
    {
      id: "impulse-recruitment",
      title: "Accelerate Zero recruitment in Impulse occasions",
      description: "Target single-serve chilled availability and visibility in on-the-go occasions to recruit new consumers.",
      lever: "Execution",
      confidence: "High",
      timeHorizon: "Near-term",
      impact: "+8% impulse transactions"
    },
    {
      id: "premium-innovation",
      title: "Launch premium Zero SKU for On-Premise",
      description: "Develop differentiated premium Zero variant for On-Premise to compete with craft and premium soft drinks.",
      lever: "Portfolio",
      confidence: "Medium",
      timeHorizon: "Mid-term",
      impact: "Price/mix improvement +3%"
    }
  ],
  "cola-regular": [
    {
      id: "premium-variants",
      title: "Premiumize core through limited editions",
      description: "Extract value from loyal base through premium positioning and seasonal limited editions.",
      lever: "Portfolio",
      confidence: "High",
      timeHorizon: "Near-term",
      impact: "Revenue/case +5%"
    },
    {
      id: "protect-at-home",
      title: "Defend At-Home multipacks",
      description: "Focus execution on protecting share in At-Home occasions where loyalty is strongest.",
      lever: "Execution",
      confidence: "High",
      timeHorizon: "Near-term",
      impact: "Stabilize volume decline"
    }
  ],
  "energy": [
    {
      id: "brand-extension",
      title: "Launch Coke Energy 2.0 with differentiated positioning",
      description: "Re-enter energy with credible functional positioning leveraging Coke brand equity.",
      lever: "Portfolio",
      confidence: "Medium",
      timeHorizon: "Mid-term",
      impact: "+€200M revenue opportunity"
    },
    {
      id: "distribution-expansion",
      title: "Expand energy distribution in Convenience",
      description: "Close distribution gaps vs Monster and Red Bull in high-frequency channels.",
      lever: "Execution",
      confidence: "High",
      timeHorizon: "Near-term",
      impact: "+15% distribution points"
    }
  ]
}

// Default actions for partitions without specific data
const defaultActions: Action[] = [
  {
    id: "assess-opportunity",
    title: "Assess growth opportunity",
    description: "Conduct detailed analysis of size of prize and investment requirements.",
    lever: "Demand",
    confidence: "Medium",
    timeHorizon: "Near-term",
    impact: "Inform strategic choice"
  }
]

const leverIcons: Record<ActionLever, React.ReactNode> = {
  "Demand": <Target className="h-4 w-4" />,
  "Execution": <Store className="h-4 w-4" />,
  "Portfolio": <Package className="h-4 w-4" />,
  "Pricing": <DollarSign className="h-4 w-4" />,
  "Media": <Megaphone className="h-4 w-4" />
}

const leverColors: Record<ActionLever, string> = {
  "Demand": "text-purple-400 bg-purple-500/10 border-purple-500/30",
  "Execution": "text-blue-400 bg-blue-500/10 border-blue-500/30",
  "Portfolio": "text-amber-400 bg-amber-500/10 border-amber-500/30",
  "Pricing": "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  "Media": "text-pink-400 bg-pink-500/10 border-pink-500/30"
}

export function PartitionActionsScreen({ partition, onBack, onSelectAction }: PartitionActionsProps) {
  const actions = partitionActions[partition.id] || defaultActions

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
          Back to Partitions
        </Button>
        
        <div className="flex items-center gap-4">
          <div className={`w-5 h-5 rounded-full ${partition.color}`} />
          <h1 className="text-2xl font-semibold text-zinc-100">
            {partition.name}
          </h1>
        </div>
        <p className="text-lg text-zinc-400 max-w-3xl">
          Identified Growth Actions — strategic moves to accelerate volume growth
        </p>
      </div>

      {/* Executive Guardrail */}
      <Card className="p-4 bg-zinc-900/50 border-amber-500/20 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-zinc-300">
            <span className="font-medium text-amber-400">Decision exploration mode</span> — 
            These are strategic options for leadership discussion. Final investment choices 
            are made at System level.
          </p>
        </div>
      </Card>

      {/* Action Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
          Available Actions ({actions.length})
        </h2>
        
        <div className="grid gap-4">
          {actions.map((action) => (
            <Card 
              key={action.id}
              className="p-6 bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group"
              onClick={() => onSelectAction(action.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-zinc-100 group-hover:text-teal-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">{action.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-teal-400 transition-colors flex-shrink-0" />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3">
                    {/* Lever Badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${leverColors[action.lever]}`}
                    >
                      {leverIcons[action.lever]}
                      <span className="ml-1.5">{action.lever}</span>
                    </Badge>

                    {/* Confidence */}
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className={`h-3.5 w-3.5 ${
                        action.confidence === "High" ? "text-emerald-400" : "text-amber-400"
                      }`} />
                      <span className={`text-xs ${
                        action.confidence === "High" ? "text-emerald-400" : "text-amber-400"
                      }`}>
                        {action.confidence} confidence
                      </span>
                    </div>

                    {/* Time Horizon */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{action.timeHorizon}</span>
                    </div>

                    <div className="h-4 w-px bg-zinc-800" />

                    {/* Expected Impact */}
                    <span className="text-xs text-zinc-300 bg-zinc-800 px-2 py-1 rounded">
                      Expected: {action.impact}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="pt-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-500 italic">
          Click any action to explore scenarios and investment requirements
        </p>
      </div>
    </div>
  )
}
