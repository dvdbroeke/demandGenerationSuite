"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

// Assortment sub-navigation type (kept for backwards compat, now part of Mix)
export type AssortmentScreen = "mix-performance" | "mix-levers" | "market-opportunities" | "portfolio-quality" | "whitespace-gaps" | "coverage-advisory" | "simulate-forecast"

interface Props { onNavigate?: (screen: AssortmentScreen) => void }

const tabs: { id: AssortmentScreen; label: string }[] = [
  { id: "mix-performance", label: "Mix Performance" },
  { id: "mix-levers", label: "Mix Levers" },
  { id: "market-opportunities", label: "Market Opportunities" },
  { id: "portfolio-quality", label: "Portfolio Quality" },
  { id: "whitespace-gaps", label: "Whitespace & Gaps" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Categories (consumption occasions)
const categories = [
  { id: "all", label: "All Categories" },
  { id: "impulse-singles", label: "Impulse Singles" },
  { id: "personal-refresh", label: "Personal Refresh" },
  { id: "take-home", label: "Take-Home" },
  { id: "family-share", label: "Family Share" },
  { id: "multipack", label: "Multipack" },
]

const geographyOptions = ["All Markets", "Italy", "France", "Spain", "Germany", "UK"]

// Channel data with market size and CAGR
interface ChannelData {
  channel: string
  marketSize: number // in millions EUR
  cagr: number // percentage
  tcccCoverage: number // percentage
  competitors: { name: string; coverage: number; color: string }[]
}

// Seeded random for consistent data
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

function generateChannelData(category: string, geography: string): ChannelData[] {
  const seed = (category.charCodeAt(0) || 65) * 100 + (geography.charCodeAt(0) || 65)
  const rng = seededRandom(seed)
  
  const channels = [
    { name: "Hypermarkets", baseSize: 180, baseCagr: 2.1 },
    { name: "Supermarkets", baseSize: 240, baseCagr: 3.4 },
    { name: "Convenience", baseSize: 85, baseCagr: 6.2 },
    { name: "Discounters", baseSize: 120, baseCagr: 8.5 },
    { name: "Gas Stations", baseSize: 45, baseCagr: 4.8 },
    { name: "HoReCa", baseSize: 95, baseCagr: 5.1 },
    { name: "Vending", baseSize: 35, baseCagr: 1.2 },
    { name: "E-commerce", baseSize: 28, baseCagr: 12.4 },
  ]
  
  const categoryMultipliers: Record<string, number> = {
    "all": 1,
    "impulse-singles": 0.35,
    "personal-refresh": 0.25,
    "take-home": 0.18,
    "family-share": 0.12,
    "multipack": 0.10,
  }
  const catMult = categoryMultipliers[category] || 1
  
  const geoMultipliers: Record<string, number> = {
    "All Markets": 5,
    "Italy": 1,
    "France": 1.2,
    "Spain": 0.85,
    "Germany": 1.5,
    "UK": 1.1,
  }
  const geoMult = geoMultipliers[geography] || 1
  
  return channels.map(ch => {
    const tcccBase = category === "impulse-singles" ? 72 : category === "personal-refresh" ? 68 : 55
    const tcccCoverage = Math.min(95, Math.round((tcccBase + rng() * 20) * (0.9 + rng() * 0.2)))
    
    return {
      channel: ch.name,
      marketSize: Math.round(ch.baseSize * catMult * geoMult * (0.8 + rng() * 0.4)),
      cagr: Math.round((ch.baseCagr + (rng() - 0.5) * 4) * 10) / 10,
      tcccCoverage,
      competitors: [
        { name: "Pepsi", coverage: Math.min(92, Math.round((tcccCoverage - 8 + rng() * 12) * (0.85 + rng() * 0.3))), color: "#2563eb" },
        { name: "Dr Pepper", coverage: Math.min(85, Math.round((tcccCoverage - 20 + rng() * 15) * (0.7 + rng() * 0.4))), color: "#7c3aed" },
        { name: "Private Label", coverage: Math.min(98, Math.round((60 + rng() * 35) * (0.9 + rng() * 0.2))), color: "#6b7280" },
      ]
    }
  })
}

// Calculate opportunity score
function getOpportunityScore(ch: ChannelData): number {
  const sizeScore = Math.min(ch.marketSize / 50, 5) // 0-5 based on size
  const growthScore = Math.max(0, ch.cagr) / 3 // 0-5 based on CAGR
  const gapScore = (100 - ch.tcccCoverage) / 20 // 0-5 based on coverage gap
  return Math.round((sizeScore + growthScore * 1.5 + gapScore) * 10) / 10
}

export function AssortmentCoverageAnalysis({ onNavigate }: Props) {
  const [selectedGeography, setSelectedGeography] = useState("Italy")
  const [selectedChannel, setSelectedChannel] = useState("All Channels")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")

  const assortmentData = useMemo(() => generateAssortmentData(selectedGeography, selectedChannel), [selectedGeography, selectedChannel])
  const columnTotals = useMemo(() => computeTotals(assortmentData), [assortmentData])
  const rowTotals = useMemo(() => computeRowTotals(assortmentData), [assortmentData])

  // Grand total
  const grandTotal = useMemo(() => {
    let value = 0, pct = 0
    Object.values(rowTotals).forEach(rt => { value += rt.value; pct += rt.pct })
    return { value: Math.round(value * 10) / 10, pct: Math.round(pct * 10) / 10 }
  }, [rowTotals])

  // Count all columns for colSpan calculations
  const totalCols = packTypeGroups.reduce((sum, g) => sum + g.sizes.length, 0)

  return (
    <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "coverage-analysis" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Header and Filters */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-100">Market Assortment Mapping</h2>
          <p className="text-[10px] text-zinc-500">Sales value (€M) and channel share (%) by brand variant and pack type</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { val: selectedGeography, set: setSelectedGeography, opts: geographyOptions, label: "Geography" },
            { val: selectedChannel, set: setSelectedChannel, opts: channelOptions, label: "Channel" },
            { val: selectedRetailer, set: setSelectedRetailer, opts: retailerOptions, label: "Retailer" },
          ].map((f, fi) => (
            <div key={fi} className="flex flex-col gap-0.5">
              <span className="text-[9px] text-zinc-500 font-medium">{f.label}</span>
              <Select value={f.val} onValueChange={f.set}>
                <SelectTrigger className="h-7 w-[130px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">{f.opts.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[9px] text-zinc-400 border border-zinc-800/50 rounded-lg p-2 bg-zinc-900/30">
        <div className="flex items-center gap-1.5">
          <Info className="h-3 w-3 text-zinc-500" />
          <span className="font-medium">Key:</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-300 font-mono">XX</span>
          <span>Sales value (€M)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-red-400 font-mono">(X%)</span>
          <span>% channel sales</span>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-teal-600/40" /><span>{">"}10% share</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-600/30" /><span>5-10% share</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-zinc-700/50" /><span>2-5% share</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-zinc-800/30" /><span>{"<"}2% / empty</span></div>
        </div>
      </div>

      {/* Main Assortment Matrix */}
      <Card className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[10px]">
              {/* Header row 1: Pack Type Groups */}
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="sticky left-0 z-10 bg-zinc-900 p-2 text-left font-semibold text-zinc-400 w-28 border-r border-zinc-800">Variant</th>
                  {packTypeGroups.map(group => (
                    <th 
                      key={group.name} 
                      colSpan={group.sizes.length}
                      className={cn("p-2 text-center font-semibold text-zinc-200 border-r border-zinc-700", group.color)}
                    >
                      {group.name}
                    </th>
                  ))}
                  <th className="p-2 text-center font-semibold text-zinc-200 bg-zinc-800/50 border-r border-zinc-700" rowSpan={2}>Total</th>
                  <th className="p-2 text-center font-semibold text-zinc-200 bg-zinc-800/30" rowSpan={2}>CAGR<br/><span className="text-[8px] text-zinc-500 font-normal">{"('"}22-{"'"}24)</span></th>
                </tr>
                {/* Header row 2: Sizes */}
                <tr className="border-b border-zinc-700">
                  <th className="sticky left-0 z-10 bg-zinc-900 p-2 text-left font-normal text-zinc-500 border-r border-zinc-800"></th>
                  {packTypeGroups.map(group => (
                    group.sizes.map((sizeObj, si) => (
                      <th 
                        key={`${group.name}-${sizeObj.size}`}
                        className={cn(
                          "p-2 text-center font-medium text-zinc-300 border-r border-zinc-800/50",
                          si === group.sizes.length - 1 ? "border-r-zinc-700" : ""
                        )}
                      >
                        <div>{sizeObj.size}</div>
                        <div className="text-[8px] text-zinc-500 font-normal">{sizeObj.subLabel}</div>
                      </th>
                    ))
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Data rows */}
                {variants.map((variant, vi) => {
                  const rowTotal = rowTotals[variant]
                  return (
                    <tr key={variant} className={cn("border-b border-zinc-800/50", vi % 2 === 0 ? "bg-zinc-900/20" : "")}>
                      <td className="sticky left-0 z-10 bg-zinc-900 p-2 font-semibold text-zinc-200 border-r border-zinc-800 whitespace-nowrap">
                        {variant}
                      </td>
                      {packTypeGroups.map(group => (
                        group.sizes.map((sizeObj, si) => {
                          const key = `${group.name}-${sizeObj.size}`
                          const cell = assortmentData[variant][key]
                          return (
                            <td 
                              key={key}
                              className={cn(
                                "p-2 text-center border-r border-zinc-800/30",
                                si === group.sizes.length - 1 ? "border-r-zinc-700/50" : "",
                                getCellBg(cell?.pct)
                              )}
                            >
                              {cell ? (
                                <div>
                                  <div className="font-bold text-zinc-100">{cell.value.toFixed(1)}</div>
                                  <div className="text-red-400 text-[9px]">({cell.pct.toFixed(1)}%)</div>
                                </div>
                              ) : (
                                <span className="text-zinc-600">-</span>
                              )}
                            </td>
                          )
                        })
                      ))}
                      {/* Row total */}
                      <td className="p-2 text-center bg-zinc-800/40 border-r border-zinc-700/50">
                        <div className="font-bold text-zinc-100">{rowTotal.value.toFixed(1)}</div>
                        <div className="text-red-400 text-[9px]">({rowTotal.pct.toFixed(1)}%)</div>
                      </td>
                      {/* Row CAGR */}
                      <td className="p-2 text-center bg-zinc-800/20">
                        <span className={cn("font-mono font-medium", rowTotal.cagr >= 0 ? "text-emerald-400" : "text-red-400")}>
                          {rowTotal.cagr >= 0 ? "+" : ""}{rowTotal.cagr.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {/* Totals row */}
                <tr className="border-t-2 border-zinc-600 bg-zinc-800/30">
                  <td className="sticky left-0 z-10 bg-zinc-800 p-2 font-bold text-zinc-100 border-r border-zinc-700">Total</td>
                  {packTypeGroups.map(group => (
                    group.sizes.map((sizeObj, si) => {
                      const key = `${group.name}-${sizeObj.size}`
                      const total = columnTotals[key]
                      return (
                        <td 
                          key={key}
                          className={cn(
                            "p-2 text-center border-r border-zinc-700/50",
                            si === group.sizes.length - 1 ? "border-r-zinc-600" : ""
                          )}
                        >
                          <div className="font-bold text-zinc-100">{total.value.toFixed(1)}</div>
                          <div className="text-red-400 text-[9px]">({total.pct.toFixed(1)}%)</div>
                        </td>
                      )
                    })
                  ))}
                  <td className="p-2 text-center bg-zinc-700/50 border-r border-zinc-600">
                    <div className="font-bold text-zinc-100">{grandTotal.value.toFixed(1)}</div>
                    <div className="text-red-400 text-[9px]">({grandTotal.pct.toFixed(1)}%)</div>
                  </td>
                  <td className="p-2 text-center bg-zinc-800/40">
                    <span className="text-zinc-400 text-[9px]">-</span>
                  </td>
                </tr>

                {/* CAGR row */}
                <tr className="bg-zinc-900/50">
                  <td className="sticky left-0 z-10 bg-zinc-900 p-2 font-medium text-zinc-400 border-r border-zinc-800 text-[9px]">
                    CAGR<br/>{"('"}22-{"'"}24)
                  </td>
                  {packTypeGroups.map(group => (
                    group.sizes.map((sizeObj, si) => {
                      const key = `${group.name}-${sizeObj.size}`
                      const total = columnTotals[key]
                      return (
                        <td 
                          key={key}
                          className={cn(
                            "p-2 text-center border-r border-zinc-800/30",
                            si === group.sizes.length - 1 ? "border-r-zinc-700/50" : ""
                          )}
                        >
                          <span className={cn("font-mono text-[9px]", total.cagr >= 0 ? "text-emerald-400" : "text-red-400")}>
                            {total.cagr >= 0 ? "+" : ""}{total.cagr.toFixed(1)}%
                          </span>
                        </td>
                      )
                    })
                  ))}
                  <td className="p-2" colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Insights</h3>
            <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-[9px]">4 insights</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {aiInsights.map((ins, i) => {
              const Icon = ins.icon
              return (
                <div key={i} className={cn("p-3 rounded-lg border border-zinc-800/50", ins.bg)}>
                  <div className="flex items-start gap-2">
                    <Icon className={cn("h-3.5 w-3.5 mt-0.5 flex-shrink-0", ins.color)} />
                    <p className="text-[10px] text-zinc-300 leading-relaxed">{ins.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
