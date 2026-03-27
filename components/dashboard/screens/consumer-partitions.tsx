"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  Repeat,
  Lightbulb,
  Bell,
  Globe,
  AlertTriangle,
  MapPin
} from "lucide-react"
import { PartitionDetailPanel } from "./partition-detail-panel"

export interface Partition {
  id: string
  name: string
  size: string
  trend: string
  overlap: string[]
  color: string
  hasActions?: boolean
  actionCount?: number
}

interface ConsumerPartitionsScreenProps {
  onNavigateToActions?: (partition: Partition) => void
  onNavigateToCountry?: (countryCode: string) => void
}

const partitions: Partition[] = [
  { 
    id: "cola-regular", 
    name: "Cola Regular", 
    size: "Large",
    trend: "declining",
    overlap: ["cola-zero", "cherry-bold"],
    color: "bg-red-500",
    hasActions: true,
    actionCount: 2
  },
  { 
    id: "cola-zero", 
    name: "Cola Zero / Light", 
    size: "Large",
    trend: "growing",
    overlap: ["cola-regular", "energy"],
    color: "bg-zinc-600",
    hasActions: true,
    actionCount: 5
  },
  { 
    id: "cherry-bold", 
    name: "Cherry & Bold Flavors", 
    size: "Medium",
    trend: "stable",
    overlap: ["cola-regular", "cola-zero"],
    color: "bg-pink-500",
  },
  { 
    id: "energy", 
    name: "Energy", 
    size: "Large",
    trend: "growing",
    overlap: ["cola-zero", "advanced-hydration"],
    color: "bg-green-500",
    hasActions: true,
    actionCount: 2
  },
  { 
    id: "advanced-hydration", 
    name: "Advanced Hydration", 
    size: "Medium",
    trend: "growing",
    overlap: ["energy", "nutrition"],
    color: "bg-blue-500",
  },
  { 
    id: "nutrition", 
    name: "Nutrition & Protein", 
    size: "Small",
    trend: "emerging",
    overlap: ["advanced-hydration"],
    color: "bg-amber-500",
  },
]

const countries = [
  { code: "sp", name: "Spain", flag: "SP", highlight: "Price & promotion drive incrementality" },
  { code: "de", name: "Germany", flag: "DE", highlight: "Brand loyalty drives incrementality" },
  { code: "gb", name: "Great Britain", flag: "GB", highlight: "Flavour drives incrementality" },
  { code: "fr", name: "France", flag: "FR", highlight: "Health positioning drives incrementality" },
  { code: "be", name: "Belgium", flag: "BE", highlight: "Pack format drives incrementality" },
  { code: "nl", name: "Netherlands", flag: "NL", highlight: "Value positioning drives incrementality" },
  { code: "it", name: "Italy", flag: "IT", highlight: "Pack size drives incrementality" },
  { code: "pl", name: "Poland", flag: "PL", highlight: "Price sensitivity drives incrementality" },
  { code: "ro", name: "Romania", flag: "RO", highlight: "Availability drives incrementality" },
  { code: "ch", name: "Switzerland", flag: "CH", highlight: "Premium positioning drives incrementality" },
  { code: "at", name: "Austria", flag: "AT", highlight: "Brand heritage drives incrementality" },
  { code: "gr", name: "Greece", flag: "GR", highlight: "Occasion-based drivers incrementality" },
  { code: "rs", name: "Serbia", flag: "RS", highlight: "Distribution drives incrementality" },
]

const insightCards = [
  {
    type: "growing",
    title: "Cola Zero accelerating",
    insight: "Recruiting from both traditional cola AND energy consumers. Key battleground vs Pepsi Max in AFH.",
    markets: ["GB", "DE", "FR"],
  },
  {
    type: "declining",
    title: "Cola Regular in structural decline",
    insight: "Sugar concerns driving permanent migration to zero-sugar alternatives. Not cyclical.",
    markets: ["All Europe"],
  },
  {
    type: "shifting",
    title: "Energy-Hydration convergence",
    insight: "Consumers increasingly seeing these as interchangeable occasions. Opportunity for functional positioning.",
    markets: ["DE", "PL", "IT"],
  },
  {
    type: "emerging",
    title: "Protein RTD gaining traction",
    insight: "New consumer segment emerging. Requires capability investment but high long-term potential.",
    markets: ["GB", "DE"],
  },
]

export function ConsumerPartitionsScreen({ onNavigateToActions, onNavigateToCountry }: ConsumerPartitionsScreenProps) {
  const [selectedPartition, setSelectedPartition] = useState<Partition | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countryClickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handlePartitionClick = (partition: Partition) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }

    clickTimeoutRef.current = setTimeout(() => {
      setSelectedPartition(partition)
      setShowDetailPanel(true)
    }, 250)
  }

  const handlePartitionDoubleClick = (partition: Partition) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }

    if (onNavigateToActions) {
      onNavigateToActions(partition)
    }
  }

  const handleCountryClick = (countryCode: string) => {
    if (countryClickTimeoutRef.current) {
      clearTimeout(countryClickTimeoutRef.current)
    }

    countryClickTimeoutRef.current = setTimeout(() => {
      setSelectedCountry(countryCode)
    }, 250)
  }

  const handleCountryDoubleClick = (countryCode: string) => {
    if (countryClickTimeoutRef.current) {
      clearTimeout(countryClickTimeoutRef.current)
      countryClickTimeoutRef.current = null
    }

    if (onNavigateToCountry) {
      onNavigateToCountry(countryCode)
    }
  }

  const handleClosePanel = () => {
    setShowDetailPanel(false)
    setSelectedPartition(null)
  }

  const handleTakeAction = () => {
    if (selectedPartition && onNavigateToActions) {
      setShowDetailPanel(false)
      onNavigateToActions(selectedPartition)
    }
  }

  const partitionsWithActions = partitions.filter(p => p.hasActions)

  return (
    <div className="relative">
      <div className={`p-8 space-y-8 max-w-7xl mx-auto transition-all ${showDetailPanel ? "mr-[480px]" : ""}`}>
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl font-semibold text-zinc-100">
              Consumer & Partitions
            </h1>
          </div>
          <div className="max-w-4xl">
            <p className="text-lg text-zinc-300 leading-relaxed">
              How consumers actually see the category — beyond Nielsen segments. 
              Understanding interchangeability and overlap is key to de-averaging Europe.
            </p>
          </div>
        </div>

        {/* Europe Is Not One Market Banner */}
        <Card className="p-6 bg-gradient-to-r from-amber-500/5 via-amber-500/5 to-transparent border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-zinc-100 mb-2">
                Europe Is Not One Market
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Europe-wide partitions reveal common growth patterns — but the drivers of incrementality 
                differ materially by country. Strategy requires de-averaging Europe.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <Globe className="h-3.5 w-3.5" />
                <span>Double-click on a country below to see how partitions actually behave in that market</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Country Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Country-Specific Drivers
            </h2>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                Click to highlight
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Double-click for deep-dive
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {countries.map((country) => (
              <Card 
                key={country.code}
                className={`p-4 cursor-pointer select-none transition-all ${
                  selectedCountry === country.code
                    ? "bg-teal-500/5 border-teal-500/30 ring-1 ring-teal-500/20"
                    : "bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700"
                }`}
                onClick={() => handleCountryClick(country.code)}
                onDoubleClick={() => handleCountryDoubleClick(country.code)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-400">{country.flag}</span>
                </div>
                <h3 className="text-sm font-medium text-zinc-100 mb-1">{country.name}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{country.highlight}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Country Highlight */}
        {selectedCountry && (
          <Card className="p-4 bg-teal-500/5 border-teal-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span className="text-sm text-zinc-300">
                  <span className="font-medium text-zinc-100">
                    {countries.find(c => c.code === selectedCountry)?.name}
                  </span>
                  {" — "}
                  {countries.find(c => c.code === selectedCountry)?.highlight}
                </span>
              </div>
              <button 
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
                onClick={() => onNavigateToCountry?.(selectedCountry)}
              >
                View full deep-dive
              </button>
            </div>
          </Card>
        )}

        {/* Global Action Notification */}
        {partitionsWithActions.length > 0 && (
          <Card className="p-4 bg-teal-500/5 border-teal-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  {partitionsWithActions.length} growth partitions require leadership action
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  New actions identified to accelerate volume growth
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-teal-500/30 bg-teal-500/10 text-teal-400">
              Decision Ready
            </Badge>
          </Card>
        )}

        {/* Interaction Hint */}
        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-zinc-600" />
            Click partition to see why
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            Double-click partition for actions
          </span>
        </div>

        {/* Partition Map */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Europe Consumer Partition Map
          </h2>
          <Card className="p-6 bg-zinc-900/50 border-zinc-800/50">
            {/* Visual indicator that partitions behave differently */}
            <div className="mb-4 pb-4 border-b border-zinc-800/50 flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs text-amber-500/80">
                Similar partitions behave differently across markets — select a country above to see local drivers
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {partitions.map((partition) => (
                <div 
                  key={partition.id}
                  className={`group relative p-4 rounded-xl bg-zinc-800/50 border transition-all cursor-pointer select-none ${
                    selectedPartition?.id === partition.id 
                      ? "border-teal-500/50 ring-1 ring-teal-500/20" 
                      : "border-zinc-700/50 hover:border-zinc-600"
                  }`}
                  onClick={() => handlePartitionClick(partition)}
                  onDoubleClick={() => handlePartitionDoubleClick(partition)}
                >
                  {/* Action Notification Badge */}
                  {partition.hasActions && (
                    <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-teal-500/20 border border-teal-500/30">
                      <Bell className="h-3 w-3 text-teal-400" />
                      <span className="text-[10px] font-medium text-teal-400">{partition.actionCount}</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-3 h-3 rounded-full ${partition.color}`} />
                    {partition.trend === "growing" && (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    )}
                    {partition.trend === "declining" && (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    {partition.trend === "stable" && (
                      <Minus className="h-4 w-4 text-zinc-500" />
                    )}
                    {partition.trend === "emerging" && (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0">
                        New
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-100 mb-1">{partition.name}</h3>
                  <p className="text-xs text-zinc-500 mb-3">Size: {partition.size}</p>
                  
                  {/* Overlap indicator */}
                  <div className="flex items-center gap-1.5">
                    <Repeat className="h-3 w-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600">
                      Overlaps with {partition.overlap.length} partitions
                    </span>
                  </div>

                  {/* Hover state - show overlaps */}
                  <div className="absolute inset-0 rounded-xl bg-zinc-900/95 border border-zinc-600 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center pointer-events-none">
                    <p className="text-xs text-zinc-400 mb-2">Consumer overlap with:</p>
                    <div className="space-y-1">
                      {partition.overlap.map((id) => {
                        const overlapping = partitions.find(p => p.id === id)
                        return overlapping ? (
                          <div key={id} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${overlapping.color}`} />
                            <span className="text-xs text-zinc-300">{overlapping.name}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                    {partition.hasActions && (
                      <p className="text-[10px] text-teal-400 mt-3">
                        Double-click to see {partition.actionCount} actions
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs text-zinc-500">Growing</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs text-zinc-500">Declining</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500">Stable</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0">
                  New
                </Badge>
                <span className="text-xs text-zinc-500">Emerging</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Bell className="h-3.5 w-3.5 text-teal-400" />
                <span className="text-xs text-zinc-500">Actions identified</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Partition Insight Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Partition Insights
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {insightCards.map((card, index) => (
              <Card 
                key={index}
                className={`p-5 bg-zinc-900/50 border-l-2 ${
                  card.type === "growing" 
                    ? "border-l-emerald-500 border-zinc-800/50"
                    : card.type === "declining"
                    ? "border-l-red-500 border-zinc-800/50"
                    : card.type === "shifting"
                    ? "border-l-blue-500 border-zinc-800/50"
                    : "border-l-amber-500 border-zinc-800/50"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      card.type === "growing" 
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : card.type === "declining"
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : card.type === "shifting"
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-zinc-100 mb-2">{card.title}</h3>
                <p className="text-sm text-zinc-400 mb-3">{card.insight}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600">Key markets:</span>
                  <div className="flex items-center gap-1">
                    {card.markets.map((market) => (
                      <span key={market} className="text-xs text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Narrative Panel */}
        <Card className="p-6 bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-100 mb-2">
                Why This Matters for Penetration & Recruitment
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Traditional category definitions miss how consumers actually make choices. 
                Understanding partition overlap reveals recruitment pathways — for example, 
                Cola Zero recruits from Energy occasions, not just traditional cola. 
                This de-averaged view is essential for targeted growth strategies that 
                win share where it matters most.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detail Panel */}
      {showDetailPanel && selectedPartition && (
        <PartitionDetailPanel 
          partition={selectedPartition}
          onClose={handleClosePanel}
          onTakeAction={handleTakeAction}
        />
      )}
    </div>
  )
}
