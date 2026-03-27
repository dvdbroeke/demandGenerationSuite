"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Info,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ArtemisLogo } from "@/components/ui/platform-logos"

interface PartitionsMatrixProps {
  onBack: () => void
  onSelectBrand: (brand: string) => void
}

const matrixData = [
  { row: "Product A Regular", values: [
    { brand: "Product A", value: 94, overlap: "low" },
    { brand: "Product A Diet", value: 12, overlap: "low" },
    { brand: "Product A Zero", value: 8, overlap: "low" },
    { brand: "Product B", value: 15, overlap: "low" },
    { brand: "Product C", value: 10, overlap: "low" },
  ]},
  { row: "Product A Diet", values: [
    { brand: "Product A", value: 18, overlap: "low" },
    { brand: "Product A Diet", value: 85, overlap: "low" },
    { brand: "Product A Zero", value: 37, overlap: "high", highlighted: true, annotation: "High overlap - cannibalization risk" },
    { brand: "Product B", value: 8, overlap: "low" },
    { brand: "Product C", value: 5, overlap: "low" },
  ]},
  { row: "Product A Zero", values: [
    { brand: "Product A", value: 15, overlap: "low" },
    { brand: "Product A Diet", value: 42, overlap: "high", highlighted: true },
    { brand: "Product A Zero", value: 78, overlap: "low" },
    { brand: "Product B", value: 6, overlap: "low" },
    { brand: "Product C", value: 4, overlap: "low" },
  ]},
  { row: "Product B", values: [
    { brand: "Product A", value: 22, overlap: "medium" },
    { brand: "Product A Diet", value: 5, overlap: "low" },
    { brand: "Product A Zero", value: 4, overlap: "low" },
    { brand: "Product B", value: 88, overlap: "low" },
    { brand: "Product C", value: 28, overlap: "medium" },
  ]},
  { row: "Product C", values: [
    { brand: "Product A", value: 18, overlap: "low" },
    { brand: "Product A Diet", value: 4, overlap: "low" },
    { brand: "Product A Zero", value: 3, overlap: "low" },
    { brand: "Product B", value: 25, overlap: "medium" },
    { brand: "Product C", value: 90, overlap: "low" },
  ]},
]

const getOverlapColor = (value: number, overlap: string, highlighted?: boolean) => {
  if (highlighted) return "bg-red-500/80"
  if (overlap === "high") return "bg-red-500/60"
  if (overlap === "medium") return "bg-amber-500/60"
  if (value > 70) return "bg-emerald-500/60"
  return "bg-zinc-700"
}

export function FuelightPartitionsMatrix({ onBack, onSelectBrand }: PartitionsMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Performance
          </Button>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <ArtemisLogo size="md" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">Partition Interactions</h1>
              <p className="text-xs text-zinc-500">Brand overlap and cannibalization analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Summary
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Waterfall
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Comparison
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Trend
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Details
        </button>
        <button className="px-6 py-3 text-sm font-medium text-amber-400 border-b-2 border-amber-500">
          Partitions
        </button>
      </div>

      {/* Insight Banner */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-zinc-300">
              <strong className="text-amber-400">High cannibalization detected:</strong> Product A Diet and Product A Zero show 37-42% consumer overlap. 
              Click on highlighted cells to investigate.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Matrix */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-zinc-100">
              Brand Interaction Matrix
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500/60" />
                <span className="text-[10px] text-zinc-400">Own brand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500/60" />
                <span className="text-[10px] text-zinc-400">Medium overlap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500/60" />
                <span className="text-[10px] text-zinc-400">High overlap (risk)</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left text-xs text-zinc-500 font-normal w-40">
                    When this brand is on promo...
                  </th>
                  {matrixData[0].values.map((col) => (
                    <th key={col.brand} className="p-3 text-center text-xs text-zinc-400 font-medium">
                      {col.brand}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row) => (
                  <tr key={row.row}>
                    <td className="p-3 text-sm text-zinc-300 font-medium">{row.row}</td>
                    {row.values.map((cell) => (
                      <td key={`${row.row}-${cell.brand}`} className="p-2">
                        <button
                          onClick={() => cell.highlighted && onSelectBrand("Product A Zero")}
                          onMouseEnter={() => setHoveredCell(`${row.row}-${cell.brand}`)}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={cn(
                            "w-full p-4 rounded-lg text-center transition-all relative",
                            getOverlapColor(cell.value, cell.overlap, cell.highlighted),
                            cell.highlighted && "cursor-pointer ring-2 ring-red-400 ring-dashed hover:ring-red-300"
                          )}
                        >
                          <span className="text-lg font-bold text-zinc-100">{cell.value}%</span>
                          {cell.highlighted && cell.annotation && hoveredCell === `${row.row}-${cell.brand}` && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 p-2 bg-red-500/90 rounded text-[10px] text-white z-10">
                              {cell.annotation}
                            </div>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400">
                Values show the percentage of promo-triggered volume that comes from each brand's existing consumers. 
                High overlap indicates cannibalization risk where promotions shift volume within the portfolio rather than driving incremental growth.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Card */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Investigate Product A Diet ↔ Product A Zero Overlap</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Click on the highlighted cells above or use this button to open the diagnostic flow
              </p>
            </div>
            <Button
              onClick={() => onSelectBrand("Product A Zero")}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
            >
              Open Diagnostic
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
