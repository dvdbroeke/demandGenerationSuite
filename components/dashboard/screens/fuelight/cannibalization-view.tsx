"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CannibalizationViewProps {
  onBack: () => void
  onNavigateToOpportunity: () => void
  onLaunchInitiative: () => void
  onNavigateToRGMPromotion?: () => void
}

const promoSourceData = {
  productARegular: {
    name: "Product A Regular",
    sources: [
      { brand: "Product A Regular", percentage: 94, color: "bg-red-600" },
      { brand: "Product A", percentage: 2, color: "bg-zinc-500" },
      { brand: "Product A Diet", percentage: 2, color: "bg-zinc-500" },
      { brand: "Product A Zero", percentage: 2, color: "bg-zinc-500" },
    ],
    promoSpend: "2",
    netROI: "0.2"
  },
  productADiet: {
    name: "Product A Diet",
    sources: [
      { brand: "Product A Regular", percentage: 52, color: "bg-zinc-500" },
      { brand: "Product A Zero", percentage: 37, color: "bg-red-600", highlighted: true, annotation: "When Diet is on promo, 37% of volume is sourced from Product A Zero" },
      { brand: "Product A Diet", percentage: 9, color: "bg-zinc-500" },
      { brand: "Others", percentage: 1, color: "bg-zinc-500" },
    ],
    promoSpend: "30",
    netROI: "0.2"
  },
  productAZero: {
    name: "Product A Zero",
    sources: [
      { brand: "Product A Zero", percentage: 90, color: "bg-red-600" },
      { brand: "Product A Regular", percentage: 1, color: "bg-zinc-500" },
      { brand: "Product A", percentage: 5, color: "bg-zinc-500" },
      { brand: "Others", percentage: 3, color: "bg-zinc-500" },
    ],
    promoSpend: "36",
    netROI: "0.5"
  }
}

// Helper function to get color based on value
const getValueColor = (value: number): string => {
  if (value >= 14) return "bg-red-600"
  if (value >= 8) return "bg-orange-500"
  if (value >= 6) return "bg-yellow-500"
  if (value >= 3) return "bg-yellow-600"
  return "bg-zinc-700"
}

const fanBaseData = {
  categories: ["Regular", "Diet", "Zero"],
  columns: [
    { category: "Regular", brands: ["Brand A Regular", "Brand B"] },
    { category: "Diet", brands: ["Brand A Diet", "Brand B Diet"] },
    { category: "Zero", brands: ["Brand A Zero", "Brand B Max"] },
  ],
  rows: [
    { category: "Regular", brand: "Brand A Regular", values: [6.6, 3.7, 3.7, 0.8, 1.8, 1.0] },
    { category: "Regular", brand: "Brand B", values: [3.7, 8.4, 0.9, 2.4, 1.2, 1.8] },
    { category: "Diet", brand: "Brand A Diet", values: [3.7, 0.9, 14.1, 3.4, 3.3, 7.5] },
    { category: "Diet", brand: "Brand B Diet", values: [0.8, 2.4, 3.4, 7.3, 3.0, 4.6] },
    { category: "Zero", brand: "Brand A Zero", values: [1.8, 1.2, 3.3, 3.0, 5.5, 3.7], highlightCol: 4 },
    { category: "Zero", brand: "Brand B Max", values: [1.0, 1.8, 7.5, 4.6, 3.7, 15.9] },
  ]
}

const fanBaseMatrix = fanBaseData.rows.map((row) => ({
  row: row.category,
  brands: row.brands,
  values: row.values.map((value, idx) => ({
    value,
    color: getValueColor(value),
    highlighted: idx === fanBaseData.columns.find((col) => col.category === row.category)?.highlightCol
  }))
}));

export function FuelightCannibalizationView({ onBack, onNavigateToOpportunity, onLaunchInitiative, onNavigateToRGMPromotion }: CannibalizationViewProps) {
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
            Back to Waterfall
          </Button>
          <div className="h-6 w-px bg-zinc-800" />
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Root Cause Analysis</h1>
            <p className="text-sm text-zinc-500">Product A Diet → Product A Zero Cannibalization</p>
          </div>
        </div>
      </div>

      {/* Main Insight */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardContent className="p-6">
          {/* Launch Initiative CTA at top */}
          <button
            onClick={onLaunchInitiative}
            className="w-full mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-amber-300">Launch Initiative</span>
                <p className="text-xs text-amber-400/70">Shift Media Investment from Product A Diet to Product A Zero - GB</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-zinc-100 mb-2">
                Given inferior fan bases of Product A Zero, we see large own cannibalization when Product A Diet is on promo
              </h2>
              <p className="text-sm text-zinc-400 mb-4">
                When Product A Diet runs promotions, 37% of the triggered volume comes from consumers who would otherwise buy Product A Zero. 
                This creates internal cannibalization rather than category growth.
              </p>
              <div className="flex items-center gap-4">
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                  High Cannibalization Risk
                </Badge>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                  Investment Inefficiency
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo Source Charts */}
      <div className="grid grid-cols-3 gap-6">
        {Object.values(promoSourceData).map((brand) => (
          <Card key={brand.name} className="bg-zinc-900/50 border-zinc-800/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-zinc-100">{brand.name}</CardTitle>
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">A</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500">
                Share of {brand.name}'s promotion triggered volume by source, 2024 full year
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {brand.sources.map((source, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-zinc-400 w-20 truncate">{source.brand}</span>
                      <span className={cn(
                        "text-xs font-semibold",
                        source.highlighted ? "text-red-400" : "text-zinc-300"
                      )}>
                        {source.percentage}%
                      </span>
                    </div>
                    <div className="h-6 bg-zinc-800 rounded overflow-hidden relative">
                      <div 
                        className={cn(
                          "h-full rounded transition-all",
                          source.color,
                          source.highlighted && "ring-2 ring-red-400 ring-dashed"
                        )}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    {source.highlighted && source.annotation && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-300">
                        {source.annotation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Retail promo spend</span>
                  <span className="text-zinc-300">{brand.promoSpend} <span className="text-zinc-500">(in EUR M)</span></span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Net ROI</span>
                  <span className="text-zinc-300">{brand.netROI} <span className="text-zinc-500">(in UC/EUR spend)</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fan Base Matrix */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-zinc-100">
                Brand A Zero with inferior fan base vs. Brand A Diet and Brand B Max
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-1">
                Brand loyalty index - All ages. Higher values indicate stronger exclusive preference.
              </p>
            </div>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              Fan Base Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Category Headers */}
              <thead>
                <tr>
                  <th rowSpan={2} className="text-left p-3 text-xs text-zinc-500 font-medium bg-zinc-800/30 border border-zinc-700/50 w-40">
                    <div>BRANDS</div>
                    <div className="text-zinc-600 font-normal">All ages</div>
                  </th>
                  <th colSpan={2} className="text-center p-2 text-xs font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50">
                    Regular
                  </th>
                  <th colSpan={2} className="text-center p-2 text-xs font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50">
                    Diet
                  </th>
                  <th colSpan={2} className="text-center p-2 text-xs font-semibold text-zinc-300 bg-zinc-800/50 border border-zinc-700/50">
                    Zero
                  </th>
                </tr>
                <tr>
                  <th className="text-center p-2 text-[11px] text-zinc-400 font-normal bg-zinc-800/20 border border-zinc-700/50 min-w-[90px]">Brand A Regular</th>
                  <th className="text-center p-2 text-[11px] text-zinc-400 font-normal bg-zinc-800/20 border border-zinc-700/50 min-w-[90px]">Brand B</th>
                  <th className="text-center p-2 text-[11px] text-zinc-400 font-normal bg-zinc-800/20 border border-zinc-700/50 min-w-[90px]">Brand A Diet</th>
                  <th className="text-center p-2 text-[11px] text-zinc-400 font-normal bg-zinc-800/20 border border-zinc-700/50 min-w-[90px]">Brand B Diet</th>
                  <th className="text-center p-2 text-[11px] text-zinc-400 font-normal bg-zinc-800/20 border border-zinc-700/50 min-w-[90px]">Brand A Zero</th>
                  <th className="text-center p-2 text-[11px] text-zinc-400 font-normal bg-zinc-800/20 border border-zinc-700/50 min-w-[90px]">Brand B Max</th>
                </tr>
              </thead>
              <tbody>
                {fanBaseData.rows.map((row, rowIdx) => {
                  const isFirstInCategory = rowIdx === 0 || fanBaseData.rows[rowIdx - 1]?.category !== row.category
                  const categoryRowSpan = fanBaseData.rows.filter(r => r.category === row.category).length
                  
                  return (
                    <tr key={rowIdx}>
                      {isFirstInCategory && (
                        <td 
                          rowSpan={categoryRowSpan}
                          className="p-0 border border-zinc-700/50 bg-zinc-800/20"
                        >
                          <div className="flex h-full">
                            <div className="w-16 flex items-center justify-center border-r border-zinc-700/50 bg-zinc-800/40">
                              <span className="text-[11px] text-zinc-500 font-medium -rotate-0">{row.category}</span>
                            </div>
                            <div className="flex-1 flex flex-col">
                              {fanBaseData.rows
                                .filter(r => r.category === row.category)
                                .map((r, i) => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "flex-1 flex items-center px-3 py-2 text-xs text-zinc-300",
                                      i > 0 && "border-t border-zinc-700/50"
                                    )}
                                  >
                                    {r.brand}
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </td>
                      )}
                      {!isFirstInCategory && null}
                      {row.values.map((value, colIdx) => {
                        const isHighlighted = row.highlightCol === colIdx
                        return (
                          <td key={colIdx} className="p-1 border border-zinc-700/50">
                            <div className={cn(
                              "py-2 px-3 text-center text-sm font-semibold text-zinc-100 rounded-sm",
                              getValueColor(value),
                              isHighlighted && "ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-900"
                            )}>
                              {value}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-[10px] text-zinc-500">
            <span className="font-medium">Score Legend:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-zinc-700" />
              <span>{"< 3"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-yellow-600" />
              <span>3-6</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-yellow-500" />
              <span>6-8</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-orange-500" />
              <span>8-14</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-sm bg-red-600" />
              <span>{">= 14"}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Brand A Zero has a fan base score of only <strong>5.5</strong> compared to Brand A Diet&apos;s <strong>14.1</strong> and Brand B Max&apos;s <strong>15.9</strong>. 
                This makes Brand A Zero vulnerable to competitive and internal cannibalization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={onNavigateToOpportunity}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          What should we do instead?
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
        {onNavigateToRGMPromotion && (
          <Button
            variant="outline"
            onClick={onNavigateToRGMPromotion}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Optimize Promotions in RGM
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
