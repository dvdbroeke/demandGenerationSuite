"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  TrendingUp,
  Clock,
  Zap,
  ChevronRight,
} from "lucide-react"

type GrowthCell = {
  id: string
  partition: string
  country: string
  channel: string
  type: "core" | "accelerator"
  sizeOfPrize2030: string
  sizeOfPrize2035: string
  confidence: "high" | "medium" | "emerging"
  role: "scale-now" | "prepare" | "optional"
  narrative: string
}

const growthCells: GrowthCell[] = [
  {
    id: "1",
    partition: "Cola Zero",
    country: "GB",
    channel: "AFH",
    type: "core",
    sizeOfPrize2030: "€420M",
    sizeOfPrize2035: "€580M",
    confidence: "high",
    role: "scale-now",
    narrative: "Defend and grow leadership position vs Pepsi Max",
  },
  {
    id: "2",
    partition: "Cola Zero",
    country: "DE",
    channel: "Modern Trade",
    type: "core",
    sizeOfPrize2030: "€380M",
    sizeOfPrize2035: "€520M",
    confidence: "high",
    role: "scale-now",
    narrative: "Volume-driving affordable packs in discounters",
  },
  {
    id: "3",
    partition: "Energy",
    country: "PL",
    channel: "Convenience",
    type: "core",
    sizeOfPrize2030: "€210M",
    sizeOfPrize2035: "€340M",
    confidence: "high",
    role: "scale-now",
    narrative: "Fuel growth acceleration in high-frequency occasions",
  },
  {
    id: "4",
    partition: "Advanced Hydration",
    country: "IT",
    channel: "AFH",
    type: "core",
    sizeOfPrize2030: "€95M",
    sizeOfPrize2035: "€180M",
    confidence: "medium",
    role: "prepare",
    narrative: "Build presence in sports and wellness occasions",
  },
  {
    id: "5",
    partition: "Nutrition/Protein",
    country: "GB",
    channel: "Convenience",
    type: "accelerator",
    sizeOfPrize2030: "€45M",
    sizeOfPrize2035: "€150M",
    confidence: "emerging",
    role: "prepare",
    narrative: "New consumer segment; requires capability investment",
  },
  {
    id: "6",
    partition: "Coffee RTD",
    country: "FR",
    channel: "Modern Trade",
    type: "accelerator",
    sizeOfPrize2030: "€85M",
    sizeOfPrize2035: "€180M",
    confidence: "medium",
    role: "scale-now",
    narrative: "Costa expansion leveraging coffee expertise",
  },
  {
    id: "7",
    partition: "Energy",
    country: "ES",
    channel: "AFH",
    type: "core",
    sizeOfPrize2030: "€120M",
    sizeOfPrize2035: "€195M",
    confidence: "medium",
    role: "prepare",
    narrative: "On-premise energy occasion development",
  },
  {
    id: "8",
    partition: "ARTD",
    country: "DE",
    channel: "Modern Trade",
    type: "accelerator",
    sizeOfPrize2030: "€65M",
    sizeOfPrize2035: "€140M",
    confidence: "emerging",
    role: "optional",
    narrative: "Emerging category; monitor for scaling signals",
  },
]

const coreLogic = [
  "Scale proven models with high confidence",
  "Drive affordability and penetration",
  "Maximize existing capabilities",
  "Volume-led, efficiency-focused execution",
]

const acceleratorLogic = [
  "Build new business models",
  "Develop or acquire capabilities",
  "Strategic partnerships required",
  "Investment horizon 3-5 years",
]

export function GrowthCellsScreen() {
  const coreGrowthCells = growthCells.filter(cell => cell.type === "core")
  const acceleratorCells = growthCells.filter(cell => cell.type === "accelerator")

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-semibold text-zinc-100">
            Growth Cells — Where to Play
          </h1>
        </div>
        <div className="max-w-4xl">
          <p className="text-lg text-zinc-300 leading-relaxed">
            Europe as a portfolio of explicit where-to-play choices. 
            Each growth cell combines consumer partition, country, and channel 
            with a clear strategic role.
          </p>
        </div>
      </div>

      {/* Core vs Accelerator Logic */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-5 bg-zinc-900/50 border-zinc-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-medium text-zinc-100">Core Growth Logic</h3>
          </div>
          <ul className="space-y-2">
            {coreLogic.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                <ChevronRight className="h-3 w-3 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 bg-zinc-900/50 border-zinc-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-medium text-zinc-100">Accelerator Logic</h3>
          </div>
          <ul className="space-y-2">
            {acceleratorLogic.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                <ChevronRight className="h-3 w-3 text-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Core Growth Cells */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Core Growth Cells
          </h2>
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            {coreGrowthCells.length} cells
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {coreGrowthCells.map((cell) => (
            <GrowthCellCard key={cell.id} cell={cell} />
          ))}
        </div>
      </div>

      {/* Accelerator Cells */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Accelerator Cells
          </h2>
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400">
            {acceleratorCells.length} cells
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {acceleratorCells.map((cell) => (
            <GrowthCellCard key={cell.id} cell={cell} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GrowthCellCard({ cell }: { cell: GrowthCell }) {
  return (
    <Card className={`p-5 bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors ${
      cell.type === "accelerator" ? "border-l-2 border-l-amber-500/50" : ""
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-100">{cell.partition}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{cell.country}</span>
            <span className="text-zinc-700">•</span>
            <span>{cell.channel}</span>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs ${
            cell.role === "scale-now" 
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : cell.role === "prepare"
              ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
              : "border-zinc-600/30 bg-zinc-700/10 text-zinc-400"
          }`}
        >
          {cell.role === "scale-now" ? "Scale Now" : cell.role === "prepare" ? "Prepare" : "Optional"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-zinc-600 mb-1">Size of Prize 2030</p>
          <p className="text-lg font-semibold text-zinc-100">{cell.sizeOfPrize2030}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-600 mb-1">Size of Prize 2035</p>
          <p className="text-lg font-semibold text-amber-400">{cell.sizeOfPrize2035}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-zinc-600">Confidence:</span>
        <div className="flex items-center gap-1">
          {cell.confidence === "high" && (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </>
          )}
          {cell.confidence === "medium" && (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </>
          )}
          {cell.confidence === "emerging" && (
            <>
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </>
          )}
          <span className="text-xs text-zinc-500 ml-1 capitalize">{cell.confidence}</span>
        </div>
      </div>

      <p className="text-sm text-zinc-400">{cell.narrative}</p>
    </Card>
  )
}
