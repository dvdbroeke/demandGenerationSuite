"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { BAMLogo } from "@/components/ui/platform-logos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, ChevronRight, AlertCircle } from "lucide-react"

interface SkuHeatmapProps {
  onBack: () => void
  onNavigate?: (screen: string) => void
  onNavigateToFuelight?: () => void
  onNavigateToInitiative?: () => void
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

// Brand A Zero SKU data
const cokeSkuLabels = [
  "Brand A Zero Pet 1.5Lt",
  "Brand A Zero Pet 1.25Lt",
  "Brand A Zero+Cherry Pb 1.25L",
  "Brand A Zero Pet 1.75Lt",
  "Brand A Zero Pet 2Lt",
  "Brand A Zero+Cherry Pet 2Lt",
]

// Competitor B Max SKU data
const pepsiSkuLabels = [
  "Comp B Max S/F Cherry Pt 1.5Lt",
  "Comp B Max S/F Pet 1.5Lt",
  "Comp B Max S/F Pet 1.25Lt",
  "Comp B Max S/F Cherry Pt 1.25Lt",
  "Comp B Max S/F Pet 2Lt",
  "Comp B Max S/F Cherry Pt 2Lt",
]

// Brand A overlap data
const cokeOverlapData: (number | null)[][] = [
  [null, 13.9, 7.9, 16.2, 5.7, 6.5],
  [13.9, null, 9.2, 2.0, 6.7, 3.5],
  [7.9, 9.2, null, 2.7, 2.3, 9.9],
  [16.2, 2.0, 2.7, null, 3.6, 4.3],
  [5.7, 6.7, 2.3, 3.6, null, 5.7],
  [6.5, 3.5, 9.9, 4.3, 5.7, null],
]

// Competitor B overlap data
const pepsiOverlapData: (number | null)[][] = [
  [null, 8.1, 2.3, 4.8, 2.4, 2.9],
  [8.1, null, 36.0, 12.3, 2.7, 6.1],
  [2.3, 36.0, null, 5.5, 3.6, 2.0],
  [4.8, 12.3, 5.5, null, 2.7, 3.5],
  [2.4, 2.7, 3.6, 2.7, null, 7.9],
  [2.9, 6.1, 2.0, 3.5, 7.9, null],
]

// Cross-brand overlap data (Brand A rows x Comp B cols)
const crossOverlapData: (number | null)[][] = [
  [2.5, 8.1, 2.3, 4.5, 2.7, 6.1],
  [2.3, 4.8, 5.5, 2.3, 2.2, 1.9],
  [1.9, 2.2, 1.9, 5.2, 1.7, 3.5],
  [4.8, 16.2, 2.0, 2.7, 3.0, 8.0],
  [1.8, 2.3, 2.3, 1.8, 3.6, 6.7],
  [6.7, 2.2, 7.6, 2.7, 4.3, 5.7],
]

const getOverlapColor = (value: number | null): string => {
  if (value === null) return "bg-zinc-800/30"
  if (value >= 10) return "bg-teal-500"
  if (value >= 6) return "bg-teal-600"
  if (value >= 4) return "bg-teal-700"
  if (value >= 2) return "bg-teal-800"
  return "bg-teal-900/50"
}

export function BAMSkuHeatmap({ onBack, onNavigate, onNavigateToFuelight, onNavigateToInitiative }: SkuHeatmapProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [showBrandA, setShowBrandA] = useState(true)
  const [showCompB, setShowCompB] = useState(false)

  // Build combined matrix based on selection
  const buildMatrix = () => {
    if (showBrandA && showCompB) {
      // Combined matrix: Brand A rows + Comp B rows, Brand A cols + Comp B cols
      const combinedRows = [...cokeSkuLabels, ...pepsiSkuLabels]
      const combinedCols = [...cokeSkuLabels.map(l => l.replace("Brand A Zero", "BAZ").replace("+Cherry", "+Ch")), ...pepsiSkuLabels.map(l => l.replace("Comp B Max S/F", "CBM").replace("Cherry Pt", "Ch"))]
      
      const combinedData: (number | null)[][] = []
      // Brand A-Brand A quadrant
      for (let i = 0; i < 6; i++) {
        const row: (number | null)[] = [...cokeOverlapData[i], ...crossOverlapData[i]]
        combinedData.push(row)
      }
      // Comp B-Brand A (transpose of cross) and Comp B-Comp B quadrant
      for (let i = 0; i < 6; i++) {
        const row: (number | null)[] = []
        for (let j = 0; j < 6; j++) {
          row.push(crossOverlapData[j][i]) // transpose
        }
        row.push(...pepsiOverlapData[i])
        combinedData.push(row)
      }
      return { rows: combinedRows, cols: combinedCols, data: combinedData }
    } else if (showBrandA) {
      return { 
        rows: cokeSkuLabels, 
        cols: cokeSkuLabels.map(l => l.replace("Brand A Zero", "BAZ").replace("+Cherry", "+Ch")),
        data: cokeOverlapData 
      }
    } else if (showCompB) {
      return { 
        rows: pepsiSkuLabels, 
        cols: pepsiSkuLabels.map(l => l.replace("Comp B Max S/F", "CBM").replace("Cherry Pt", "Ch")),
        data: pepsiOverlapData 
      }
    }
    return { rows: [], cols: [], data: [] }
  }

  const { rows, cols, data } = buildMatrix()
  
  // Find the index of "Brand A Zero Pet 2Lt" for highlighting
  const pet2LtIndex = rows.findIndex(r => r === "Brand A Zero Pet 2Lt")

  const getTitle = () => {
    if (showBrandA && showCompB) return "Brand A Zero & Competitor B Max >1L"
    if (showBrandA) return "Brand A Zero >1L"
    if (showCompB) return "Competitor B Max >1L"
    return "Select a brand"
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
        <button onClick={() => onNavigate?.("overview")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Overview</button>
        <button onClick={onBack} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Partitions Heatmap</button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">SKU Heatmap</button>
        <button onClick={() => onNavigate?.("partition-tree")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Partition Tree</button>
        <button onClick={() => onNavigate?.("market-map")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Market Map</button>
        <button onClick={() => onNavigate?.("key-insights")} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">AI-Driven Insights</button>
      </div>

      {/* Back button + Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 text-sm mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Partitions Heatmap
          </button>
          <h2 className="text-lg font-semibold text-zinc-100">
            SKU-level partitions heatmap - {getTitle()}
          </h2>
          <p className="text-sm text-zinc-500">Consumer crossover between SKUs in the large pack segment.</p>
        </div>

        {/* Brand Checkboxes */}
        <div className="flex items-center gap-6 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <span className="text-xs text-zinc-500">Show brands:</span>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="brandA" 
              checked={showBrandA} 
              onCheckedChange={(checked) => setShowBrandA(checked === true)}
              className="border-red-500 data-[state=checked]:bg-red-500"
            />
            <label htmlFor="brandA" className="text-sm text-zinc-300 cursor-pointer">Brand A Zero</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="compB" 
              checked={showCompB} 
              onCheckedChange={(checked) => setShowCompB(checked === true)}
              className="border-blue-500 data-[state=checked]:bg-blue-500"
            />
            <label htmlFor="compB" className="text-sm text-zinc-300 cursor-pointer">Competitor B Max</label>
          </div>
        </div>
      </div>

      {/* SKU Heatmap */}
      {rows.length > 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="h-24">
                    <th className="p-1 text-left text-zinc-500 font-normal w-40 align-bottom"></th>
                    {cols.map((header, idx) => (
                      <th key={idx} className="p-1 text-center text-zinc-400 font-normal min-w-[40px] align-bottom relative">
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -rotate-45 origin-bottom-left whitespace-nowrap text-[8px]">
                          {header}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((rowCat, rowIdx) => {
                    const isPet2Lt = rowCat === "Brand A Zero Pet 2Lt"
                    return (
                      <tr key={rowIdx}>
                        <td className={cn(
                          "p-1 text-right font-normal pr-2 whitespace-nowrap text-[9px]",
                          isPet2Lt ? "text-amber-400" : "text-zinc-400"
                        )}>
                          <div className="flex items-center justify-end gap-2">
                            {isPet2Lt && (
                              <button 
                                onClick={onNavigateToInitiative}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-all"
                                title="View ongoing initiative"
                              >
                                <AlertCircle className="h-3 w-3 text-amber-400" />
                                <span className="text-[8px] text-amber-400">Initiative</span>
                              </button>
                            )}
                            {rowCat}
                          </div>
                        </td>
                        {data[rowIdx].map((value, colIdx) => (
                          <td key={colIdx} className="p-0.5">
                            <div 
                              className={cn(
                                "w-full h-7 flex items-center justify-center rounded-sm text-[9px] font-medium",
                                getOverlapColor(value),
                                value === null ? "text-zinc-600" : "text-zinc-200"
                              )}
                            >
                              {value !== null ? value.toFixed(1) : "1"}
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-6 text-[10px] text-zinc-500">
              <span className="font-medium">Overlap Index:</span>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-teal-900/50" /><span>Low (0-2)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-teal-800" /><span>2-4</span></div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-teal-700" /><span>4-6</span></div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-teal-600" /><span>6-10</span></div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-teal-500" /><span>High (10+)</span></div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-12 text-center">
            <p className="text-zinc-500">Please select at least one brand to view the heatmap</p>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      {showBrandA && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-6">
            <h4 className="text-base font-semibold text-zinc-100 mb-4">Key Observations</h4>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 mt-0.5">High</Badge>
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold">1.5Lt and 1.75Lt</span> show highest overlap (16.2) - consumers see these as interchangeable
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-teal-600/10 text-teal-400 border-teal-600/20 mt-0.5">Moderate</Badge>
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold">1.5Lt and 1.25Lt</span> have strong overlap (13.9) - similar consumption occasions
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mt-0.5">Action</Badge>
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold">2Lt Pet</span> has ongoing initiative to improve perceived affordability vs competition
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-0.5">Strategy</Badge>
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold">Cherry variants</span> attract distinct consumers with moderate cross-purchase
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation to Fuelight */}
      {onNavigateToFuelight && showBrandA && (
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <button onClick={onNavigateToFuelight} className="w-full p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-sm font-medium text-emerald-300">View Brand A Zero Performance in Artemis</span>
                  <p className="text-xs text-emerald-400/70">Analyze sales drivers and media effectiveness</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
