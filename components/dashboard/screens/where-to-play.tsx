"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  TrendingUp, 
  Minus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface GrowthCell {
  id: string
  partition: string
  market: string
  channel: string
  sizeOfPrize: string
  sizeValue: number
  strategicRole: "scale-now" | "prepare" | "optional"
  classification: "core" | "accelerator"
  tcccShare: number
  growthRate: string
  rationale: string
}

const growthCells: GrowthCell[] = [
  {
    id: "1",
    partition: "Cola Zero",
    market: "Germany",
    channel: "Modern Trade",
    sizeOfPrize: "€420M",
    sizeValue: 420,
    strategicRole: "scale-now",
    classification: "core",
    tcccShare: 52,
    growthRate: "+8.2%",
    rationale: "Largest Zero opportunity in Europe; strong brand equity; capacity available"
  },
  {
    id: "2",
    partition: "Fuel & Uplift",
    market: "GB",
    channel: "Convenience",
    sizeOfPrize: "€380M",
    sizeValue: 380,
    strategicRole: "scale-now",
    classification: "accelerator",
    tcccShare: 18,
    growthRate: "+12.4%",
    rationale: "Monster momentum strong; execution capability proven; high margin"
  },
  {
    id: "3",
    partition: "Adult Refreshment",
    market: "France",
    channel: "On-Premise",
    sizeOfPrize: "€240M",
    sizeValue: 240,
    strategicRole: "prepare",
    classification: "accelerator",
    tcccShare: 4,
    growthRate: "+18.7%",
    rationale: "Category emerging; need distribution partnerships before scaling"
  },
  {
    id: "4",
    partition: "Coffee RTD",
    market: "Poland",
    channel: "Convenience",
    sizeOfPrize: "€85M",
    sizeValue: 85,
    strategicRole: "prepare",
    classification: "accelerator",
    tcccShare: 12,
    growthRate: "+22.3%",
    rationale: "Costa brand building; supply chain not yet optimized for volume"
  },
  {
    id: "5",
    partition: "Classic Core",
    market: "Spain",
    channel: "Traditional Trade",
    sizeOfPrize: "€520M",
    sizeValue: 520,
    strategicRole: "scale-now",
    classification: "core",
    tcccShare: 68,
    growthRate: "+1.2%",
    rationale: "Defend position; optimize efficiency; fund growth elsewhere"
  },
  {
    id: "6",
    partition: "Hydration",
    market: "Italy",
    channel: "HORECA",
    sizeOfPrize: "€145M",
    sizeValue: 145,
    strategicRole: "optional",
    classification: "core",
    tcccShare: 8,
    growthRate: "-2.1%",
    rationale: "Low share in competitive market; not differentiated; deprioritize"
  },
]

const deprioritized = [
  { partition: "Traditional Juice", market: "Nordics", reason: "Private label dominance; margin erosion" },
  { partition: "Flavored Water", market: "Eastern Europe", reason: "Low consumer pull; no differentiated play" },
  { partition: "Sports Drinks", market: "Southern Europe", reason: "Powerade repositioning incomplete; hold" },
]

const roleConfig = {
  "scale-now": { 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    label: "Scale Now",
    icon: TrendingUp
  },
  "prepare": { 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    label: "Prepare",
    icon: AlertCircle
  },
  "optional": { 
    color: "text-zinc-400", 
    bg: "bg-zinc-500/10", 
    border: "border-zinc-500/20",
    label: "Optional",
    icon: Minus
  },
}

export function WhereToPlayScreen() {
  const scaleNow = growthCells.filter(c => c.strategicRole === "scale-now")
  const prepare = growthCells.filter(c => c.strategicRole === "prepare")
  const optional = growthCells.filter(c => c.strategicRole === "optional")

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Where to Play</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Priority partitions, markets, and channels — Core vs Accelerator logic with explicit deprioritisation
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">{scaleNow.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Scale Now</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400/30" />
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              €{(scaleNow.reduce((acc, c) => acc + c.sizeValue, 0) / 1000).toFixed(1)}B total opportunity
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{prepare.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Prepare</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-400/30" />
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              Building capabilities for future scale
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800/50 border-zinc-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-zinc-400">{deprioritized.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Deprioritized</p>
              </div>
              <XCircle className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-500 mt-3">
              Explicit choices not to pursue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Classification Legend */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-zinc-300">Core</span>
          <span className="text-xs text-zinc-500 ml-1">— Protect & optimize existing strength</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-sm text-zinc-300">Accelerator</span>
          <span className="text-xs text-zinc-500 ml-1">— Growth bets requiring investment</span>
        </div>
      </div>

      {/* Scale Now Section */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Scale Now — Immediate Investment
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scaleNow.map((cell) => (
            <GrowthCellCard key={cell.id} cell={cell} />
          ))}
        </div>
      </div>

      {/* Prepare Section */}
      <div>
        <h2 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Prepare — Building for Future Scale
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {prepare.map((cell) => (
            <GrowthCellCard key={cell.id} cell={cell} />
          ))}
        </div>
      </div>

      {/* Optional / Deprioritized Section */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-400 mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          Explicit Deprioritisation
        </h2>
        <Card className="bg-zinc-900/30 border-zinc-800/50">
          <CardContent className="pt-6">
            <p className="text-xs text-zinc-500 mb-4">
              These spaces have been explicitly deprioritized — not by accident, but by strategic choice.
            </p>
            <div className="space-y-3">
              {deprioritized.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                  <XCircle className="h-4 w-4 text-zinc-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-300">{item.partition}</span>
                      <span className="text-xs text-zinc-600">in</span>
                      <span className="text-sm text-zinc-400">{item.market}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function GrowthCellCard({ cell }: { cell: GrowthCell }) {
  const config = roleConfig[cell.strategicRole]
  const RoleIcon = config.icon
  
  return (
    <Card className={cn("bg-zinc-900/50 border transition-all hover:border-zinc-700", config.border)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-100">
              {cell.partition}
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              {cell.market} • {cell.channel}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px]",
              cell.classification === "core" 
                ? "border-amber-500/30 text-amber-400" 
                : "border-teal-500/30 text-teal-400"
            )}
          >
            {cell.classification === "core" ? "Core" : "Accelerator"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className="text-lg font-bold text-zinc-100">{cell.sizeOfPrize}</p>
            <p className="text-[10px] text-zinc-500">Size of Prize</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className="text-lg font-bold text-zinc-100">{cell.tcccShare}%</p>
            <p className="text-[10px] text-zinc-500">TCCC Share</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-zinc-800/50">
            <p className={cn("text-lg font-bold", cell.growthRate.startsWith("+") ? "text-emerald-400" : "text-red-400")}>
              {cell.growthRate}
            </p>
            <p className="text-[10px] text-zinc-500">Growth</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn("px-2 py-1 rounded flex items-center gap-1.5", config.bg)}>
            <RoleIcon className={cn("h-3 w-3", config.color)} />
            <span className={cn("text-xs font-medium", config.color)}>{config.label}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-800/50">
          <p className="text-[11px] text-zinc-500 mb-1">Rationale</p>
          <p className="text-xs text-zinc-300">{cell.rationale}</p>
        </div>

        <button className="w-full flex items-center justify-center gap-1 text-xs text-amber-400 hover:text-amber-300 pt-2">
          View initiatives <ArrowRight className="h-3 w-3" />
        </button>
      </CardContent>
    </Card>
  )
}
