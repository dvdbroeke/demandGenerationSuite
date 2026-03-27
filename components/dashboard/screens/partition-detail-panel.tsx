"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, Users, Building, Lightbulb, ArrowRight } from "lucide-react"

interface PartitionDetailPanelProps {
  partition: {
    id: string
    name: string
    size: string
    trend: string
    color: string
  }
  onClose: () => void
  onTakeAction: () => void
}

const partitionDetails: Record<string, {
  headline: string
  consumerDrivers: string[]
  structuralSignals: string[]
  whatThisMeans: string[]
}> = {
  "cola-zero": {
    headline: "Why Cola Zero / Light is growing",
    consumerDrivers: [
      "Reduced sugar intake becoming table stakes across demographics",
      "Health & wellness mindset accelerating (weight management, GLP-1 awareness, regulatory pressure)",
      "Migration from Regular Cola — not returning consumers",
      "Partial overlap with Energy occasions — functional benefit seekers"
    ],
    structuralSignals: [
      "Penetration growth outpacing loyalty growth — new buyers entering",
      "Not cyclical — structurally driven by permanent consumer behavior shift",
      "Stronger growth in AFH and Impulse channels than At-Home",
      "Younger cohorts over-indexing vs population average"
    ],
    whatThisMeans: [
      "Cola Zero is not a variant — it is a growth platform",
      "Winning requires differentiated strategy vs Cola Regular",
      "Priority recruitment opportunity from Energy and Functional consumers",
      "Must defend against Pepsi Max in key battleground channels"
    ]
  },
  "cola-regular": {
    headline: "Why Cola Regular is declining",
    consumerDrivers: [
      "Sugar concerns driving permanent shift away from full-sugar options",
      "Regulatory pressure on high-sugar beverages increasing",
      "Health-conscious consumers migrating to zero-sugar alternatives",
      "Younger demographics not entering the category at historical rates"
    ],
    structuralSignals: [
      "Decline is structural, not cyclical — penetration falling across markets",
      "Loyalty metrics stable but recruitment declining",
      "Premiumization opportunity within core loyalists",
      "At-Home occasions holding better than On-The-Go"
    ],
    whatThisMeans: [
      "Focus on value extraction vs volume growth",
      "Protect core loyalist base through premiumization",
      "Do not over-invest in recruitment — limited ROI",
      "Strategic role is cash generation, not growth driver"
    ]
  },
  "energy": {
    headline: "Why Energy is growing",
    consumerDrivers: [
      "Functional benefit seeking expanding beyond traditional energy users",
      "Mental performance and focus occasions growing",
      "Younger consumers adopting energy as everyday beverage",
      "Overlap with sports and hydration occasions increasing"
    ],
    structuralSignals: [
      "Category growing faster than NARTD overall",
      "Competition X and Y driving market, Brand Owner under-indexed",
      "Convenience and Impulse channels showing strongest growth",
      "Innovation driving premiumization opportunity"
    ],
    whatThisMeans: [
      "Must accelerate to capture fair share of growth",
      "Requires differentiated positioning vs established players",
      "Opportunity to leverage core brand into functional space",
      "System execution capability is current bottleneck"
    ]
  },
  "advanced-hydration": {
    headline: "Why Advanced Hydration is growing",
    consumerDrivers: [
      "Active lifestyle consumers seeking more than basic hydration",
      "Electrolyte and functional benefit awareness increasing",
      "Convergence with sports nutrition and wellness",
      "Premium positioning resonating with health-conscious consumers"
    ],
    structuralSignals: [
      "Growing across all key markets in Europe",
      "Strong performance in fitness and sports occasions",
      "Convenience channel showing highest growth rates",
      "Price elasticity lower than traditional beverages"
    ],
    whatThisMeans: [
      "High-potential growth cell requiring investment",
      "Opportunity to differentiate vs pure-play sports drinks",
      "Can leverage Powerade brand with innovation",
      "Requires capability building in functional claims"
    ]
  },
  "cherry-bold": {
    headline: "Why Cherry & Bold Flavors is stable",
    consumerDrivers: [
      "Core flavor-seeking consumers remain loyal",
      "Limited new consumer recruitment",
      "Occasions relatively fixed — treat and indulgence",
      "Not benefiting from health and wellness trends"
    ],
    structuralSignals: [
      "Volume stable but not growing",
      "Strong loyalty among existing consumer base",
      "Limited overlap with growing partitions",
      "Innovation opportunities in limited editions"
    ],
    whatThisMeans: [
      "Maintain as value extraction opportunity",
      "Do not over-invest in growth initiatives",
      "Leverage for seasonal and promotional activations",
      "Consider role in portfolio completeness vs growth"
    ]
  },
  "nutrition": {
    headline: "Why Nutrition & Protein is emerging",
    consumerDrivers: [
      "Protein and functional nutrition entering mainstream",
      "GLP-1 and weight management driving interest in satiety",
      "Active lifestyle consumers seeking RTD convenience",
      "Premium pricing acceptable for perceived benefits"
    ],
    structuralSignals: [
      "Small base but high growth rate",
      "Concentrated in key markets (GB, DE) with expansion potential",
      "Requires capability investment beyond current portfolio",
      "Competition from specialized players and private label"
    ],
    whatThisMeans: [
      "Strategic optionality — prepare to scale if trends continue",
      "Requires M&A or partnership for credibility",
      "Not core to 2035 ambition but worth watching",
      "Innovation pipeline should include test-and-learn"
    ]
  }
}

export function PartitionDetailPanel({ partition, onClose, onTakeAction }: PartitionDetailPanelProps) {
  const details = partitionDetails[partition.id] || partitionDetails["cola-zero"]

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${partition.color}`} />
            <Badge 
              variant="outline" 
              className={`text-xs ${
                partition.trend === "growing" 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : partition.trend === "declining"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : partition.trend === "emerging"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
              }`}
            >
              {partition.trend === "growing" && <TrendingUp className="h-3 w-3 mr-1" />}
              {partition.trend.charAt(0).toUpperCase() + partition.trend.slice(1)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">{partition.name}</h2>
        <p className="text-sm text-zinc-400">{details.headline}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Consumer Drivers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Consumer Drivers</h3>
          </div>
          <ul className="space-y-2">
            {details.consumerDrivers.map((driver, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span className="text-sm text-zinc-400">{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Structural Signals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">Structural Signals</h3>
          </div>
          <ul className="space-y-2">
            {details.structuralSignals.map((signal, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <span className="text-sm text-zinc-400">{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What This Means */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">What This Means</h3>
          </div>
          <Card className="p-4 bg-zinc-800/50 border-zinc-700/50">
            <ul className="space-y-2">
              {details.whatThisMeans.map((meaning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{meaning}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
        <p className="text-xs text-zinc-500 mb-4">Double-click the partition or click below to explore actions</p>
        <Button 
          onClick={onTakeAction}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white"
        >
          What should we do?
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
