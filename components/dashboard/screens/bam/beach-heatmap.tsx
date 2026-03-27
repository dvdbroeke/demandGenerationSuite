"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BAMLogo } from "@/components/ui/platform-logos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertTriangle, ArrowLeft, ArrowRight, ChevronRight, Zap } from "lucide-react"

interface BeachHeatmapProps {
  onBack: () => void
  onNavigateToFuelight: () => void
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

const ageGroups = [
  { id: "all", name: "All Ages" },
  { id: "genz", name: "Gen Z / Alpha (13-29y)" },
  { id: "millennials", name: "Millennials (30-44y)" },
  { id: "genx", name: "Gen X (45-59y)" },
  { id: "boomers", name: "Boomers+ (60+)" },
]

// Cola brand data by age group (BEACH data)
const colaBrandDataByAge: Record<string, { categories: string[], data: number[][] }> = {
  all: {
    categories: ["Regular", "Diet", "Zero"],
    data: [
      [4.9, 1.9, 1.4],
      [1.9, 10.3, 4.1],
      [1.4, 4.1, 4.7],
    ]
  },
  genz: {
    categories: ["Regular", "Diet", "Zero"],
    data: [
      [4.8, 3.4, 1.8],
      [3.4, 9.8, 5.8],
      [1.8, 5.8, 5.9],
    ]
  },
  millennials: {
    categories: ["Regular", "Diet", "Zero"],
    data: [
      [5.2, 2.1, 1.6],
      [2.1, 10.8, 4.5],
      [1.6, 4.5, 5.1],
    ]
  },
  genx: {
    categories: ["Regular", "Diet", "Zero"],
    data: [
      [4.6, 1.5, 1.2],
      [1.5, 11.2, 3.6],
      [1.2, 3.6, 4.2],
    ]
  },
  boomers: {
    categories: ["Regular", "Diet", "Zero"],
    data: [
      [4.3, 1.2, 0.9],
      [1.2, 12.1, 2.8],
      [0.9, 2.8, 3.5],
    ]
  },
}

const getColaBrandColor = (value: number): string => {
  if (value >= 9) return "bg-teal-500"
  if (value >= 5) return "bg-teal-600"
  if (value >= 3) return "bg-teal-700"
  return "bg-teal-800"
}

export function BAMBeachHeatmap({ onBack, onNavigateToFuelight }: BeachHeatmapProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all")

  const currentColaBrandData = colaBrandDataByAge[selectedAgeGroup] || colaBrandDataByAge.all
  const isGenZ = selectedAgeGroup === "genz"

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

      {/* Back Navigation */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-zinc-400 hover:text-zinc-100 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Partitions Heatmap
      </Button>

      {/* Insight Alert - At Top */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-6">
          {/* Action CTA at top */}
          <button
            onClick={onNavigateToFuelight}
            className="w-full mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <ArrowRight className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-emerald-300">View Coke Zero Performance in Fuelight</span>
                <p className="text-xs text-emerald-400/70">Analyze investment efficiency and optimization opportunities</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                Strategic Insight: Cola Sub-Brand Positioning
              </h2>
              <p className="text-sm text-zinc-400 mb-4">
                Younger generations (Gen Z) show significantly higher cross-consumption between Diet and Zero variants. 
                The Diet-Zero overlap increases from 4.1 (all ages) to 5.8 (Gen Z), indicating these sub-brands 
                are increasingly perceived as interchangeable by younger consumers.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                  Brand Differentiation Risk
                </Badge>
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                  Gen Z Priority
                </Badge>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                <p className="text-sm text-zinc-100 font-medium">
                  <span className="text-amber-400 underline">Implication:</span> Today, each Coca-Cola sub-brand must be treated as a standalone asset with distinct positioning to capture Gen Z loyalty.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">BEACH Data - Cola Brand Overlap by Age</h2>
        <p className="text-sm text-zinc-500">Consumer crossover between Regular, Diet, and Zero cola variants by age cohort</p>
      </div>

      {/* Age Group Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">Age Group:</span>
        <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
          <SelectTrigger className="w-[200px] h-9 bg-zinc-900 border-zinc-800 text-zinc-100 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {ageGroups.map((group) => (
              <SelectItem key={group.id} value={group.id} className="text-zinc-100 text-sm">
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-8">
        {/* Heatmap */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-6">
            <div className={cn(
              "mb-4 px-4 py-2 rounded-lg text-center text-sm font-semibold uppercase tracking-wide",
              isGenZ ? "bg-amber-600 text-white" : "bg-zinc-700 text-zinc-200"
            )}>
              {isGenZ ? "Gen Z Analysis" : `Category - ${ageGroups.find(g => g.id === selectedAgeGroup)?.name || "All Ages"}`}
            </div>
            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-xs text-zinc-500 font-medium bg-zinc-800/30 border border-zinc-700/50 w-28">
                    <div className="text-[10px] leading-tight">
                      CATEGORY<br/>
                      <span className="text-zinc-600">{ageGroups.find(g => g.id === selectedAgeGroup)?.name || "All ages"}</span>
                    </div>
                  </th>
                  {currentColaBrandData.categories.map((cat, idx) => (
                    <th key={idx} className="p-3 text-center text-sm font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50 min-w-[100px]">
                      {cat}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentColaBrandData.categories.map((rowCat, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className={cn(
                      "p-3 text-sm font-medium border border-zinc-700/50",
                      rowCat === "Regular" && "bg-red-500/20 text-red-300",
                      rowCat === "Diet" && "bg-zinc-700/50 text-zinc-300",
                      rowCat === "Zero" && "bg-emerald-500/20 text-emerald-300"
                    )}>
                      {rowCat}
                    </td>
                    {currentColaBrandData.data[rowIdx].map((value, colIdx) => (
                      <td key={colIdx} className="p-1 border border-zinc-700/50">
                        <div className={cn(
                          "py-4 px-4 text-center text-lg font-bold text-zinc-900 rounded-sm",
                          getColaBrandColor(value)
                        )}>
                          {value.toFixed(1)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Annotations */}
            <div className="mt-4 space-y-2">
              {selectedAgeGroup === "all" && (
                <>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-amber-400 font-bold">↑</span>
                    <span>Over-indexed on younger consumers (13-39 drive ~60% consumption)</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-amber-400 font-bold">↓</span>
                    <span>Over-indexed on older consumers (40+ drive ~70% consumption)</span>
                  </div>
                </>
              )}
              {isGenZ && (
                <div className="flex items-start gap-2 text-xs text-amber-400">
                  <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Gen Z shows higher cross-brand consumption: Diet-Zero overlap increases from 4.1 to 5.8</span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-[10px] text-zinc-500">
              <span className="font-medium">Overlap Index:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-800" />
                <span>{"< 3"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-700" />
                <span>3-5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-600" />
                <span>5-9</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-sm bg-teal-500" />
                <span>{">= 9"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Observations */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-6">
            <h4 className="text-base font-semibold text-zinc-100 border-b border-zinc-700 pb-3 mb-4">Key Observations</h4>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">1</div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Across brands, <span className="text-amber-400 font-semibold">Cola Regular, Diet and Zero attract distinct consumers</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Diagonal values (4.9, 10.3, 4.7) indicate strong brand-specific loyalty</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">2</div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="text-red-400 font-semibold">Younger generations are more indifferent</span> between Diet and Zero, and consume more across categories
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Gen Z Diet-Zero overlap: 5.8 vs All Ages: 4.1 (+41%)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300">3</div>
                <div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Zero has weaker brand loyalty</span> compared to Diet across all age groups
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Zero diagonal (4.7) vs Diet diagonal (10.3) shows 2x weaker retention</p>
                </div>
              </div>
            </div>

            {/* Implication Box */}
            <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-sm text-amber-300 font-medium leading-relaxed">
                <span className="underline">Implication:</span> Today, each Coca-Cola sub-brand must be treated as a standalone asset with distinct positioning, media investment, and consumer targeting strategy.
              </p>
            </div>

            {/* Recommended Actions */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-zinc-100 mb-3">Recommended Next Steps</h5>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Review Coke Zero media investment efficiency in Fuelight</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Assess cannibalization risk from Diet Coke promotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Develop Gen Z-specific brand positioning strategy</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
