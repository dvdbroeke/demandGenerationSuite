"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Play,
  Users,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InitiativeDetailProps {
  onBack: () => void
}

// Affordability data for the charts
const affordabilityData13_29 = [
  { year: "2021", cokeZero: 18, dietCoke: 17 },
  { year: "2022", cokeZero: 7, dietCoke: 4 },
  { year: "2023", cokeZero: 11, dietCoke: 10 },
  { year: "2024", cokeZero: 2, dietCoke: 1 },
  { year: "2025", cokeZero: -3, dietCoke: 1 },
]

const affordabilityData30Plus = [
  { year: "2021", cokeZero: 6, dietCoke: 4 },
  { year: "2022", cokeZero: 6, dietCoke: 3 },
  { year: "2023", cokeZero: 5, dietCoke: 2 },
  { year: "2024", cokeZero: 4, dietCoke: 2 },
  { year: "2025", cokeZero: 6, dietCoke: 3 },
]

const priceIndexData = [
  { 
    size: "500ML PET", 
    grocery: { cokeZero: 108, dietCoke: 108 },
    impulse: { cokeZero: 110, dietCoke: 109 }
  },
  { 
    size: "1.25L PET", 
    grocery: { cokeZero: 105, dietCoke: 106 },
    impulse: { cokeZero: 121, dietCoke: 116 }
  },
  { 
    size: "2L PET", 
    grocery: { cokeZero: 98, dietCoke: 98 },
    impulse: { cokeZero: 109, dietCoke: 113 },
    highlight: true
  },
]

export function InitiativeDetailScreen({ onBack }: InitiativeDetailProps) {
  const maxBarValue = 20

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Initiatives Portfolio
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Play className="h-5 w-5 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">In Execution</Badge>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">Improve Perceived Affordability of Brand B 2L</h1>
            <p className="text-sm text-zinc-500 mt-2">
              Strategic initiative to close the affordability perception gap versus Competitor B in the 2L format
            </p>
          </div>
          <Button variant="outline" className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Export Report
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-zinc-500">Objective</span>
            </div>
            <p className="text-sm text-zinc-300">Close affordability gap vs Pepsi Max 2L</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-zinc-500">Owner</span>
            </div>
            <p className="text-sm text-zinc-300">CCEP - RGM Director GB</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-zinc-500">Timeline</span>
            </div>
            <p className="text-sm text-zinc-300">Jan 2026 - Price mark pack launch</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-zinc-500">Size of Prize</span>
            </div>
            <p className="text-sm font-semibold text-emerald-400">Close perception gap</p>
          </CardContent>
        </Card>
      </div>

      {/* Execution Progress */}
      <Card className="bg-emerald-500/5 border-emerald-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Execution on Track</p>
                <p className="text-xs text-emerald-400/70">Price mark pack rollout scheduled for Jan 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-emerald-500 rounded-full" />
              </div>
              <span className="text-sm font-medium text-emerald-400">65%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">Supporting Evidence</h2>
        <p className="text-sm text-zinc-500">Data from BEACH consumer research and Nielsen price tracking</p>
      </div>

      {/* Chart 1: Perceived Affordability */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Perceived affordability is shaped by habits and consistency</h3>
              <p className="text-sm text-zinc-500 mt-1">Perceived affordability in %p. difference vs. Pmax, all packs</p>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Source: BEACH</Badge>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Age 13-29 Chart */}
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-4">Perceived affordability vs Pmax, age range 13-29</h4>
              <div className="space-y-3">
                {affordabilityData13_29.map((item) => (
                  <div key={item.year} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-12">{item.year}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 flex-1">
                        <div 
                          className={cn(
                            "h-6 rounded-sm flex items-center justify-end pr-1",
                            item.cokeZero >= 0 ? "bg-red-500" : "bg-red-500/50"
                          )}
                          style={{ width: `${Math.abs(item.cokeZero) / maxBarValue * 100}%`, minWidth: item.cokeZero !== 0 ? '20px' : '2px' }}
                        >
                          <span className="text-[10px] text-white font-medium">{item.cokeZero}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <div 
                          className="h-6 bg-zinc-500 rounded-sm flex items-center justify-end pr-1"
                          style={{ width: `${Math.abs(item.dietCoke) / maxBarValue * 100}%`, minWidth: '20px' }}
                        >
                          <span className="text-[10px] text-white font-medium">{item.dietCoke}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-red-500" />
                  <span className="text-xs text-zinc-500">Coke Zero</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-zinc-500" />
                  <span className="text-xs text-zinc-500">Diet Coke</span>
                </div>
              </div>
            </div>

            {/* Age 30+ Chart */}
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-4">Perceived affordability vs Pmax, age range {">"}30</h4>
              <div className="space-y-3">
                {affordabilityData30Plus.map((item) => (
                  <div key={item.year} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-12">{item.year}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex items-center gap-1 flex-1">
                        <div 
                          className="h-6 bg-red-500 rounded-sm flex items-center justify-end pr-1"
                          style={{ width: `${item.cokeZero / maxBarValue * 100}%`, minWidth: '20px' }}
                        >
                          <span className="text-[10px] text-white font-medium">{item.cokeZero}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <div 
                          className="h-6 bg-zinc-500 rounded-sm flex items-center justify-end pr-1"
                          style={{ width: `${item.dietCoke / maxBarValue * 100}%`, minWidth: '20px' }}
                        >
                          <span className="text-[10px] text-white font-medium">{item.dietCoke}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Insight */}
          <div className="mt-6 p-4 rounded-lg bg-red-500/5 border-l-4 border-red-500">
            <p className="text-sm text-zinc-300">
              <span className="font-semibold text-red-400">Key Finding:</span> We have closed the perceived affordability gap vs. Pmax in age range 13-29 for both brands, while the gap, although small, still persists in age range {">"}30. Habits and consistency are key for perceived affordability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Price Index Comparison */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-zinc-100">We are more affordable in 2L PET in total grocery</h3>
              <p className="text-sm text-zinc-500 mt-1">Average price indexed to Pmax, 2025 L26W</p>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Source: Nielsen</Badge>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {priceIndexData.map((item) => (
              <div 
                key={item.size} 
                className={cn(
                  "p-4 rounded-lg",
                  item.highlight ? "bg-red-500/10 border-2 border-red-500/30" : "bg-zinc-800/30"
                )}
              >
                <h4 className={cn(
                  "text-sm font-semibold mb-4",
                  item.highlight ? "text-red-400" : "text-zinc-300"
                )}>
                  Avg. price {item.size}
                </h4>
                
                {/* Grocery */}
                <div className="mb-4">
                  <p className="text-xs text-zinc-500 mb-2">Total Grocery (~80% of AH PET)</p>
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-400 mb-1">{item.grocery.cokeZero}</span>
                      <div className="w-12 bg-red-500 rounded-t-sm" style={{ height: `${item.grocery.cokeZero - 90}px` }} />
                      <span className="text-[10px] text-zinc-500 mt-1">CZ</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-400 mb-1">{item.grocery.dietCoke}</span>
                      <div className="w-12 bg-zinc-500 rounded-t-sm" style={{ height: `${item.grocery.dietCoke - 90}px` }} />
                      <span className="text-[10px] text-zinc-500 mt-1">DC</span>
                    </div>
                  </div>
                  <div className="mt-2 border-t border-dashed border-zinc-600 pt-1">
                    <span className="text-[10px] text-zinc-500">100 = Pmax</span>
                  </div>
                </div>

                {/* Impulse */}
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Total Impulse (~20% of AH PET)</p>
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-400 mb-1">{item.impulse.cokeZero}</span>
                      <div className="w-12 bg-red-500 rounded-t-sm" style={{ height: `${item.impulse.cokeZero - 90}px` }} />
                      <span className="text-[10px] text-zinc-500 mt-1">CZ</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-zinc-400 mb-1">{item.impulse.dietCoke}</span>
                      <div className="w-12 bg-zinc-500 rounded-t-sm" style={{ height: `${item.impulse.dietCoke - 90}px` }} />
                      <span className="text-[10px] text-zinc-500 mt-1">DC</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Insight */}
          <div className="mt-6 p-4 rounded-lg bg-red-500/5 border-l-4 border-red-500">
            <p className="text-sm text-zinc-300">
              <span className="font-semibold text-red-400">Key Finding:</span> We are more affordable for 2L PET in total Grocery. Across smaller SKUs and within Impulse there are smaller affordability gaps (will be addressed in ongoing work starting Jan 2026) which might impact overall perceived affordability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-400" />
            Next Steps & Milestones
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-zinc-900/50">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-2">Completed</Badge>
              <p className="text-sm text-zinc-300">Consumer research validation</p>
              <p className="text-xs text-zinc-500 mt-1">Dec 2025</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/50">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-2">In Progress</Badge>
              <p className="text-sm text-zinc-300">Price mark pack development</p>
              <p className="text-xs text-zinc-500 mt-1">Jan 2026</p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/50">
              <Badge className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 mb-2">Upcoming</Badge>
              <p className="text-sm text-zinc-300">Q1 Performance Review</p>
              <p className="text-xs text-zinc-500 mt-1">Mar 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
