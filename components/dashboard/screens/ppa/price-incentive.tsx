"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Eye, EyeOff, AlertTriangle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { skuMaster, allSkuNames, allBrands, brandColors, retailerOptions as sharedRetailers } from "../shared-sku-data"

export type PPAScreen = "pricing-performance" | "price-incentive" | "simulate-forecast"

interface Props { onNavigate?: (screen: PPAScreen) => void }

const tabs: { id: PPAScreen; label: string }[] = [
  { id: "pricing-performance", label: "Pricing Performance" },
  { id: "price-incentive", label: "Price Incentive Curve" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

// Competitor SKUs mapped by brand -- market competitors
const competitorSkus: Record<string, Array<{ sku: string; brand: string; packMl: number; ppl: number; revM: number }>> = {
  "Brand A Classic": [
    { sku: "Competitor X 150ml",       brand: "Competitor X",    packMl: 150,  ppl: 6.00, revM: 0.4 },
    { sku: "Competitor X 330ml",       brand: "Competitor X",    packMl: 330,  ppl: 3.64, revM: 4.2 },
    { sku: "Competitor X 500ml",       brand: "Competitor X",    packMl: 500,  ppl: 3.38, revM: 3.1 },
    { sku: "Competitor X 1.5L",        brand: "Competitor X",    packMl: 1500, ppl: 1.26, revM: 2.8 },
    { sku: "Competitor X 2L",          brand: "Competitor X",    packMl: 2000, ppl: 1.00, revM: 1.9 },
  ],
  "Brand A Zero": [
    { sku: "Competitor X Max 150ml",   brand: "Competitor X Max", packMl: 150,  ppl: 6.33, revM: 0.3 },
    { sku: "Competitor X Max 330ml",   brand: "Competitor X Max", packMl: 330,  ppl: 3.79, revM: 3.0 },
    { sku: "Competitor X Max 500ml",   brand: "Competitor X Max", packMl: 500,  ppl: 3.58, revM: 2.2 },
    { sku: "Competitor X Max 1.5L",    brand: "Competitor X Max", packMl: 1500, ppl: 1.33, revM: 1.8 },
    { sku: "Competitor X Max 2L",      brand: "Competitor X Max", packMl: 2000, ppl: 1.05, revM: 1.2 },
  ],
  "Brand B": [
    { sku: "Competitor X Max 330ml",   brand: "Competitor X Max", packMl: 330,  ppl: 3.79, revM: 3.0 },
    { sku: "Competitor X Max 500ml",   brand: "Competitor X Max", packMl: 500,  ppl: 3.58, revM: 2.2 },
    { sku: "Competitor X Max 1.5L",    brand: "Competitor X Max", packMl: 1500, ppl: 1.33, revM: 1.8 },
  ],
  "Brand C": [
    { sku: "Competitor Y Orange 330ml", brand: "Competitor Y", packMl: 330,  ppl: 4.85, revM: 1.6 },
    { sku: "Competitor Y Orange 500ml", brand: "Competitor Y", packMl: 500,  ppl: 3.80, revM: 1.0 },
    { sku: "Competitor Y Orange 1.25L", brand: "Competitor Y", packMl: 1250, ppl: 2.00, revM: 0.6 },
    { sku: "Competitor Z Lemon 330ml",  brand: "Competitor Z", packMl: 330,  ppl: 4.24, revM: 1.2 },
  ],
  "Brand D": [
    { sku: "Competitor W 330ml",         brand: "Competitor W",  packMl: 330,  ppl: 3.33, revM: 1.4 },
    { sku: "Competitor W 500ml",         brand: "Competitor W",  packMl: 500,  ppl: 2.98, revM: 0.9 },
    { sku: "Competitor W 1.5L",          brand: "Competitor W",  packMl: 1500, ppl: 1.13, revM: 0.8 },
    { sku: "Competitor V Lemon 330ml",   brand: "Competitor V",  packMl: 330,  ppl: 4.09, revM: 0.7 },
  ],
}

const compBrandColors: Record<string, string> = {
  "Competitor X": "#2563eb", "Competitor X Max": "#1e40af", "Competitor Y": "#dc2626",
  "Competitor Z": "#d97706", "Competitor W": "#16a34a", "Competitor V": "#ca8a04",
  "Competitors": "#6366f1",
}

// Add Portfolio Avg to brandColors for consolidated view
const extendedBrandColors: Record<string, string> = {
  ...brandColors,
  "Portfolio Avg": "#ef4444", // Red for Portfolio average
}

const skuData = skuMaster.map(s => ({
  sku: s.sku, brand: s.brand, packMl: s.packMl, ppl: s.ppl, velocity: s.velocity,
  distribution: s.distribution, revM: s.revM, role: s.role, priceIndex: s.priceIndex, margin: s.gpMargin,
}))

const allSkus = allSkuNames
const retailers = [...sharedRetailers]
const brandOptions = ["All Brands", ...allBrands]
const retailerMult: Record<string, number> = { "Retailer A": 1.0, "Retailer B": 1.02, "Retailer C": 0.96, "Retailer D": 0.98, "Retailer E": 0.88, "Retailer F": 0.90, "Retailer G": 1.04, "Retailer H": 0.95 }

// Tooltip component
function ChartTooltip({ x, y, sku, lines, visible }: { x: number; y: number; sku: string; lines: string[]; visible: boolean }) {
  if (!visible) return null
  const boxW = 260
  return (
    <g transform={`translate(${x},${y})`} style={{ pointerEvents: "none" }}>
      <rect x={8} y={-40} width={boxW} height={28 + lines.length * 14} rx={4} fill="#18181b" stroke="#3f3f46" strokeWidth="1" opacity="0.96" />
      <text x={16} y={-22} className="fill-zinc-100 text-[10px] font-semibold">{sku}</text>
      {lines.map((l, i) => (
        <text key={i} x={16} y={-8 + i * 14} className="fill-zinc-400 text-[9px]">{l}</text>
      ))}
    </g>
  )
}

// Tooltip for average lines (All Brands view)
function AverageLineTooltip({ x, y, label, lines, visible }: { x: number; y: number; label: string; lines: string[]; visible: boolean }) {
  if (!visible) return null
  const boxW = 280
  return (
    <g transform={`translate(${x},${y})`} style={{ pointerEvents: "none" }}>
      <rect x={-boxW/2} y={-55} width={boxW} height={28 + lines.length * 14} rx={4} fill="#18181b" stroke="#3f3f46" strokeWidth="1" opacity="0.98" />
      <text x={-boxW/2 + 10} y={-38} className="fill-zinc-100 text-[10px] font-semibold">{label}</text>
      {lines.map((l, i) => (
        <text key={i} x={-boxW/2 + 10} y={-24 + i * 14} className="fill-zinc-400 text-[9px]">{l}</text>
      ))}
    </g>
  )
}

function ObsMarker({ x, y, num }: { x: number; y: number; num: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={10} fill="#18181b" stroke="#dc2626" strokeWidth="1.5" />
      <text textAnchor="middle" dy="3.5" className="fill-red-400 text-[9px] font-bold">{num}</text>
    </g>
  )
}

export function PPAPriceIncentive({ onNavigate }: Props) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedSkus, setSelectedSkus] = useState<string[]>([])
  const [showCompetitors, setShowCompetitors] = useState(true)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [hoveredComp, setHoveredComp] = useState<number | null>(null)
  const [hoveredObs, setHoveredObs] = useState<number | null>(null)
  const [hoveredAvgLine, setHoveredAvgLine] = useState<"ours" | "competitors" | null>(null)

  // Filter own data - consolidate by pack size when "All Brands" selected
  const filtered = useMemo(() => {
    let data = [...skuData]
    if (selectedBrand !== "All Brands") {
      data = data.filter(d => d.brand === selectedBrand)
      if (selectedSkus.length > 0) data = data.filter(d => selectedSkus.includes(d.sku))
      if (selectedRetailer !== "All Retailers") {
        const m = retailerMult[selectedRetailer] ?? 1
        data = data.map(d => ({ ...d, ppl: +(d.ppl * m).toFixed(2) }))
      }
      return data
    }
    
    // When "All Brands" is selected, consolidate by pack size
    if (selectedRetailer !== "All Retailers") {
      const m = retailerMult[selectedRetailer] ?? 1
      data = data.map(d => ({ ...d, ppl: +(d.ppl * m).toFixed(2) }))
    }
    
    // Group by pack size and calculate averages
    const packSizeGroups: Record<number, typeof data> = {}
    data.forEach(d => {
      if (!packSizeGroups[d.packMl]) packSizeGroups[d.packMl] = []
      packSizeGroups[d.packMl].push(d)
    })
    
    // Create consolidated entries for each pack size
    const consolidated = Object.entries(packSizeGroups).map(([packMl, items]) => {
      const avgPpl = items.reduce((s, d) => s + d.ppl, 0) / items.length
      const totalRev = items.reduce((s, d) => s + d.revM, 0)
      const avgMargin = items.reduce((s, d) => s + d.margin, 0) / items.length
      return {
        sku: `Avg ${packMl}ml (${items.length} SKUs)`,
        brand: "Portfolio Avg",
        packMl: Number(packMl),
        ppl: +avgPpl.toFixed(2),
        velocity: items.reduce((s, d) => s + d.velocity, 0) / items.length,
        distribution: items.reduce((s, d) => s + d.distribution, 0) / items.length,
        revM: +totalRev.toFixed(1),
        role: "core" as const,
        priceIndex: Math.round(items.reduce((s, d) => s + d.priceIndex, 0) / items.length),
        margin: +avgMargin.toFixed(1),
      }
    })
    
    return consolidated.sort((a, b) => a.packMl - b.packMl)
  }, [selectedBrand, selectedRetailer, selectedSkus])

  // Competitor data - consolidate by pack size when "All Brands" selected
  const compData = useMemo(() => {
    if (!showCompetitors) return []
    if (selectedBrand !== "All Brands") return competitorSkus[selectedBrand] || []
    
    // When "All Brands", consolidate competitors by pack size too
    const allCompSkus = Object.values(competitorSkus).flat()
    const packSizeGroups: Record<number, typeof allCompSkus> = {}
    allCompSkus.forEach(d => {
      if (!packSizeGroups[d.packMl]) packSizeGroups[d.packMl] = []
      packSizeGroups[d.packMl].push(d)
    })
    
    return Object.entries(packSizeGroups).map(([packMl, items]) => {
      const avgPpl = items.reduce((s, d) => s + d.ppl, 0) / items.length
      const totalRev = items.reduce((s, d) => s + d.revM, 0)
      return {
        sku: `Competitor Avg ${packMl}ml`,
        brand: "Competitors",
        packMl: Number(packMl),
        ppl: +avgPpl.toFixed(2),
        revM: +totalRev.toFixed(1),
      }
    }).sort((a, b) => a.packMl - b.packMl)
  }, [selectedBrand, showCompetitors])

  const availableSkuOptions = useMemo(() => {
    if (selectedBrand !== "All Brands") return skuData.filter(d => d.brand === selectedBrand).map(d => d.sku)
    return allSkus
  }, [selectedBrand])

  // Chart dimensions - COMPACT for single-page viewing
  const W = 600, H = 320, pad = { top: 40, right: 30, bottom: 45, left: 50 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const allPpls = [...filtered.map(d => d.ppl), ...compData.map(d => d.ppl)]
  const allMls = [...filtered.map(d => d.packMl), ...compData.map(d => d.packMl)]
  const minMl = 0
  const maxMl = Math.max(2200, ...allMls.map(v => v + 200))
  // Add padding to Y axis to keep bubbles within plot area
  const rawMinPpl = Math.min(...(allPpls.length > 0 ? allPpls : [1]), 0.8)
  const rawMaxPpl = Math.max(...(allPpls.length > 0 ? allPpls : [5]), 5)
  const pplPadding = (rawMaxPpl - rawMinPpl) * 0.1
  const minPpl = Math.floor((rawMinPpl - pplPadding) * 10) / 10
  const maxPpl = Math.ceil((rawMaxPpl + pplPadding) * 10) / 10

  const toX = (ml: number) => pad.left + (ml / maxMl) * plotW
  // Clamp Y values to stay within plot area
  const toY = (ppl: number) => {
    const y = pad.top + plotH - ((ppl - minPpl) / (maxPpl - minPpl)) * plotH
    return Math.max(pad.top + 15, Math.min(pad.top + plotH - 15, y))
  }

  // Calculate portfolio average by pack size (consistent across all brands)
  const portfolioAvgByPackSize = useMemo(() => {
    const packGroups: Record<number, number[]> = {}
    skuData.forEach(d => {
      if (!packGroups[d.packMl]) packGroups[d.packMl] = []
      packGroups[d.packMl].push(d.ppl)
    })
    return Object.entries(packGroups).map(([ml, prices]) => ({
      ml: Number(ml),
      ppl: prices.reduce((s, p) => s + p, 0) / prices.length
    })).sort((a, b) => a.ml - b.ml)
  }, [])

  // Fit a power curve to portfolio averages: ppl = a * ml^b
  const curveFit = useMemo(() => {
    if (portfolioAvgByPackSize.length < 2) return { a: 12, b: -0.35 }
    // Log-linear regression: ln(ppl) = ln(a) + b * ln(ml)
    const n = portfolioAvgByPackSize.length
    const sumLnMl = portfolioAvgByPackSize.reduce((s, d) => s + Math.log(d.ml), 0)
    const sumLnPpl = portfolioAvgByPackSize.reduce((s, d) => s + Math.log(d.ppl), 0)
    const sumLnMlLnPpl = portfolioAvgByPackSize.reduce((s, d) => s + Math.log(d.ml) * Math.log(d.ppl), 0)
    const sumLnMl2 = portfolioAvgByPackSize.reduce((s, d) => s + Math.log(d.ml) ** 2, 0)
    const b = (n * sumLnMlLnPpl - sumLnMl * sumLnPpl) / (n * sumLnMl2 - sumLnMl ** 2)
    const lnA = (sumLnPpl - b * sumLnMl) / n
    return { a: Math.exp(lnA), b }
  }, [portfolioAvgByPackSize])

  // Generate curve points using fitted portfolio average
  const curvePoints = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const ml = 80 + (i / 49) * (maxMl - 80)
      const ppl = curveFit.a * Math.pow(ml, curveFit.b)
      return { ml, ppl }
    })
  }, [maxMl, curveFit])

  // Calculate competitor average by pack size (for All Brands view)
  const competitorAvgByPackSize = useMemo(() => {
    const allCompSkus = Object.values(competitorSkus).flat()
    const packGroups: Record<number, number[]> = {}
    allCompSkus.forEach(d => {
      if (!packGroups[d.packMl]) packGroups[d.packMl] = []
      packGroups[d.packMl].push(d.ppl)
    })
    return Object.entries(packGroups).map(([ml, prices]) => ({
      ml: Number(ml),
      ppl: prices.reduce((s, p) => s + p, 0) / prices.length
    })).sort((a, b) => a.ml - b.ml)
  }, [])

  // Fit competitor curve
  const compCurveFit = useMemo(() => {
    if (competitorAvgByPackSize.length < 2) return { a: 12, b: -0.35 }
    const n = competitorAvgByPackSize.length
    const sumLnMl = competitorAvgByPackSize.reduce((s, d) => s + Math.log(d.ml), 0)
    const sumLnPpl = competitorAvgByPackSize.reduce((s, d) => s + Math.log(d.ppl), 0)
    const sumLnMlLnPpl = competitorAvgByPackSize.reduce((s, d) => s + Math.log(d.ml) * Math.log(d.ppl), 0)
    const sumLnMl2 = competitorAvgByPackSize.reduce((s, d) => s + Math.log(d.ml) ** 2, 0)
    const b = (n * sumLnMlLnPpl - sumLnMl * sumLnPpl) / (n * sumLnMl2 - sumLnMl ** 2)
    const lnA = (sumLnPpl - b * sumLnMl) / n
    return { a: Math.exp(lnA), b }
  }, [competitorAvgByPackSize])

  // Generate competitor curve points
  const compCurvePoints = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const ml = 80 + (i / 49) * (maxMl - 80)
      const ppl = compCurveFit.a * Math.pow(ml, compCurveFit.b)
      return { ml, ppl }
    })
  }, [maxMl, compCurveFit])

  // Calculate comparison stats for tooltip
  const comparisonStats = useMemo(() => {
    const ourAvgPpl = portfolioAvgByPackSize.reduce((s, d) => s + d.ppl, 0) / portfolioAvgByPackSize.length
    const compAvgPpl = competitorAvgByPackSize.reduce((s, d) => s + d.ppl, 0) / competitorAvgByPackSize.length
    const diffPct = ((ourAvgPpl - compAvgPpl) / compAvgPpl * 100)
    return {
      ourAvg: ourAvgPpl,
      compAvg: compAvgPpl,
      diffPct,
      ourPackSizes: portfolioAvgByPackSize.length,
      compPackSizes: competitorAvgByPackSize.length
    }
  }, [portfolioAvgByPackSize, competitorAvgByPackSize])

  // Category definitions for price curve analysis
  const categoryDefs = [
    { id: "cola", label: "Cola", brands: ["Brand A Classic", "Brand A Zero", "Brand B"], color: "#ef4444", compBrands: ["Competitor X", "Competitor X Max"] },
    { id: "citrus", label: "Citrus/Fruity", brands: ["Brand D", "Brand C"], color: "#22c55e", compBrands: ["Competitor W", "Competitor Y"] },
  ]

  // Calculate category-level curves for Portfolio
  const categoryCurves = useMemo(() => {
    return categoryDefs.map(cat => {
      const catSkus = skuData.filter(d => cat.brands.includes(d.brand))
      if (catSkus.length < 2) return null
      
      // Group by pack size
      const packGroups: Record<number, number[]> = {}
      catSkus.forEach(d => {
        if (!packGroups[d.packMl]) packGroups[d.packMl] = []
        packGroups[d.packMl].push(d.ppl)
      })
      
      const avgByPack = Object.entries(packGroups).map(([ml, prices]) => ({
        ml: Number(ml),
        ppl: prices.reduce((s, p) => s + p, 0) / prices.length
      })).sort((a, b) => a.ml - b.ml)
      
      if (avgByPack.length < 2) return null
      
      // Fit power curve
      const n = avgByPack.length
      const sumLnMl = avgByPack.reduce((s, d) => s + Math.log(d.ml), 0)
      const sumLnPpl = avgByPack.reduce((s, d) => s + Math.log(d.ppl), 0)
      const sumLnMlLnPpl = avgByPack.reduce((s, d) => s + Math.log(d.ml) * Math.log(d.ppl), 0)
      const sumLnMl2 = avgByPack.reduce((s, d) => s + Math.log(d.ml) ** 2, 0)
      const b = (n * sumLnMlLnPpl - sumLnMl * sumLnPpl) / (n * sumLnMl2 - sumLnMl ** 2)
      const lnA = (sumLnPpl - b * sumLnMl) / n
      
      const curvePoints = Array.from({ length: 50 }, (_, i) => {
        const ml = 80 + (i / 49) * (maxMl - 80)
        const ppl = Math.exp(lnA) * Math.pow(ml, b)
        return { ml, ppl }
      })
      
      const avgPpl = avgByPack.reduce((s, d) => s + d.ppl, 0) / avgByPack.length
      
      return { ...cat, curvePoints, avgPpl, skuCount: catSkus.length }
    }).filter(Boolean)
  }, [maxMl])

  // Calculate category-level curves for competitors
  const compCategoryCurves = useMemo(() => {
    return categoryDefs.map(cat => {
      const allCompSkus = Object.values(competitorSkus).flat()
      const catSkus = allCompSkus.filter(d => cat.compBrands.includes(d.brand))
      if (catSkus.length < 2) return null
      
      // Group by pack size
      const packGroups: Record<number, number[]> = {}
      catSkus.forEach(d => {
        if (!packGroups[d.packMl]) packGroups[d.packMl] = []
        packGroups[d.packMl].push(d.ppl)
      })
      
      const avgByPack = Object.entries(packGroups).map(([ml, prices]) => ({
        ml: Number(ml),
        ppl: prices.reduce((s, p) => s + p, 0) / prices.length
      })).sort((a, b) => a.ml - b.ml)
      
      if (avgByPack.length < 2) return null
      
      // Fit power curve
      const n = avgByPack.length
      const sumLnMl = avgByPack.reduce((s, d) => s + Math.log(d.ml), 0)
      const sumLnPpl = avgByPack.reduce((s, d) => s + Math.log(d.ppl), 0)
      const sumLnMlLnPpl = avgByPack.reduce((s, d) => s + Math.log(d.ml) * Math.log(d.ppl), 0)
      const sumLnMl2 = avgByPack.reduce((s, d) => s + Math.log(d.ml) ** 2, 0)
      const b = (n * sumLnMlLnPpl - sumLnMl * sumLnPpl) / (n * sumLnMl2 - sumLnMl ** 2)
      const lnA = (sumLnPpl - b * sumLnMl) / n
      
      const curvePoints = Array.from({ length: 50 }, (_, i) => {
        const ml = 80 + (i / 49) * (maxMl - 80)
        const ppl = Math.exp(lnA) * Math.pow(ml, b)
        return { ml, ppl }
      })
      
      const avgPpl = avgByPack.reduce((s, d) => s + d.ppl, 0) / avgByPack.length
      
      return { ...cat, curvePoints, avgPpl, skuCount: catSkus.length, isCompetitor: true }
    }).filter(Boolean)
  }, [maxMl])

  // State for hovered category curve
  const [hoveredCatCurve, setHoveredCatCurve] = useState<string | null>(null)

  // Helper to get expected price at a given pack size (using portfolio average curve)
  const getExpectedPpl = (ml: number) => curveFit.a * Math.pow(ml, curveFit.b)

  const tiers = [
    { ml: 250, label: "Single Serve", yOffset: 0 },
    { ml: 500, label: "On-the-Go", yOffset: 12 },
    { ml: 1500, label: "Multi Serve", yOffset: 0 },
  ]

  const maxRev = Math.max(...filtered.map(d => d.revM), ...compData.map(d => d.revM), 1)
  // COMPACT bubble sizing for single-page view
  const getR = (rev: number) => 5 + (rev / maxRev) * 14

  // Concrete price ladder anomaly notifications
  interface PriceAlert {
    id: string
    type: "anomaly" | "opportunity" | "risk"
    title: string
    detail: string
    sku?: string
    packMl?: number
    gap?: string
    actionable: boolean
  }

  const priceAlerts = useMemo((): PriceAlert[] => {
    const alerts: PriceAlert[] = []
    
    // Check for Single Serve Brand C underpricing (key storyline item)
    // Brand C 330ml at ppl 2.73 vs expected ~4.0 for 330ml = -32% below ladder
    const sprite330 = skuData.find(d => d.sku.toLowerCase().includes("sprite") && d.packMl === 330)
    if (sprite330) {
      const expectedPpl = getExpectedPpl(330)
      const actualPpl = sprite330.ppl
      const gap = ((actualPpl - expectedPpl) / expectedPpl * 100)
      // This should trigger since Brand C 330ml is at 2.73 vs expected ~4.0 = -32%
      if (gap < -15) {
        alerts.push({
          id: "sprite-330",
          type: "anomaly",
          title: "Price ladder anomaly for Single Serve Brand C",
          detail: `Brand C 330ml priced at \u20ac${actualPpl.toFixed(2)}/L vs. portfolio avg \u20ac${expectedPpl.toFixed(2)}/L. ${Math.abs(gap).toFixed(0)}% below pack-size expectation - significantly underpriced vs pack ladder.`,
          sku: sprite330.sku,
          packMl: 330,
          gap: `${gap.toFixed(0)}%`,
          actionable: true
        })
      }
    }
    
    // Check for Citrus/Fruity category underpricing vs competitors
    if (showCompetitors) {
      const citrusBrands = ["Brand C", "Brand D"]
      const citrusSkus = skuData.filter(d => citrusBrands.some(b => d.brand.includes(b)))
      const citrusCompSkus = Object.values(competitorSkus).flat().filter(d => 
        ["7Up", "SanPellegrino", "Schweppes"].some(b => d.brand.includes(b))
      )
      
      if (citrusSkus.length > 0 && citrusCompSkus.length > 0) {
        const citrusAvg = citrusSkus.reduce((s, d) => s + d.ppl, 0) / citrusSkus.length
        const citrusCompAvg = citrusCompSkus.reduce((s, d) => s + d.ppl, 0) / citrusCompSkus.length
        const gap = ((citrusAvg - citrusCompAvg) / citrusCompAvg * 100)
        
        if (gap < -10) {
          alerts.push({
            id: "citrus-underpriced",
            type: "opportunity",
            title: "Citrus/Fruity category underpriced vs. competitors",
            detail: `Brand D & Brand C avg \u20ac${citrusAvg.toFixed(2)}/L vs. competitor avg \u20ac${citrusCompAvg.toFixed(2)}/L. ${Math.abs(gap).toFixed(0)}% margin opportunity.`,
            gap: `${gap.toFixed(0)}%`,
            actionable: true
          })
        }
      }
    }
    
    // Check for price ladder gaps (missing price points)
    const packSizes = [...new Set(filtered.map(d => d.packMl))].sort((a, b) => a - b)
    if (packSizes.length >= 3) {
      for (let i = 1; i < packSizes.length; i++) {
        const smallPpl = filtered.find(d => d.packMl === packSizes[i-1])?.ppl || 0
        const largePpl = filtered.find(d => d.packMl === packSizes[i])?.ppl || 0
        const expectedSmallPpl = getExpectedPpl(packSizes[i-1])
        const expectedLargePpl = getExpectedPpl(packSizes[i])
        const expectedStep = expectedSmallPpl - expectedLargePpl
        const actualStep = smallPpl - largePpl
        
        if (actualStep < expectedStep * 0.5 && i < 3) {
          alerts.push({
            id: `ladder-${packSizes[i-1]}-${packSizes[i]}`,
            type: "risk",
            title: `Compressed price step: ${packSizes[i-1]}ml to ${packSizes[i]}ml`,
            detail: `Only \u20ac${actualStep.toFixed(2)}/L step vs. expected \u20ac${expectedStep.toFixed(2)}/L. May cause pack-size cannibalization.`,
            actionable: false
          })
        }
      }
    }
    
    return alerts.slice(0, 4) // Limit to 4 alerts
  }, [filtered, showCompetitors, getExpectedPpl])

  const getObsPos = (obs: { skuRef: typeof filtered[0] | null }) => {
    if (!obs.skuRef) return null
    return { x: toX(obs.skuRef.packMl), y: toY(obs.skuRef.ppl) - 22 }
  }

  const visibleBrands = [...new Set(filtered.map(d => d.brand))]
  const visibleCompBrands = [...new Set(compData.map(d => d.brand))]

  return (
    <div className="p-4 space-y-3 max-w-[1200px] mx-auto">
      {/* Nav tabs */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "price-incentive" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedSkus([]) }}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{brandOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{retailers.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>

        {/* SKU multi-select */}
        {availableSkuOptions.filter(s => !selectedSkus.includes(s)).length > 0 && selectedSkus.length < availableSkuOptions.length && (
          <Select value="" onValueChange={(v) => { if (v) setSelectedSkus(prev => [...prev, v]) }}>
            <SelectTrigger className="h-7 w-[170px] bg-zinc-900 border-zinc-800 text-zinc-400 text-[10px]">
              <span className="text-zinc-500">{selectedSkus.length === 0 ? "All SKUs shown" : "+ Add SKU filter"}</span>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
              {availableSkuOptions.filter(s => !selectedSkus.includes(s)).map(s => <SelectItem key={s} value={s} className="text-zinc-200 text-xs">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {selectedSkus.map(sku => (
          <button key={sku} onClick={() => setSelectedSkus(prev => prev.filter(s => s !== sku))} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-zinc-600 text-zinc-100 bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: extendedBrandColors[skuData.find(d => d.sku === sku)?.brand || ""] || brandColors[skuData.find(d => d.sku === sku)?.brand || ""] || "#888" }} />
            {sku}
            <span className="text-zinc-500 ml-0.5">x</span>
          </button>
        ))}
        {selectedSkus.length > 0 && (
          <button onClick={() => setSelectedSkus([])} className="text-[10px] text-zinc-500 hover:text-zinc-300 underline">Clear all</button>
        )}

        {/* Competitor toggle */}
        <div className="ml-auto">
          <button
            onClick={() => setShowCompetitors(!showCompetitors)}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-medium border transition-colors",
              showCompetitors ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}
          >
            {showCompetitors ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Competitors
          </button>
        </div>
      </div>

      {/* Chart + Observations - COMPACT */}
      <div className="grid grid-cols-[1fr_260px] gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <div className="mb-1">
              <h3 className="text-xs font-semibold text-zinc-100">Price Incentive Curve</h3>
              <p className="text-[10px] text-zinc-500">{"Price per Litre (\u20ac/L) vs Pack Size (mL) -- bubble size = revenue contribution"}</p>
            </div>

            {/* Legend - COMPACT */}
            <div className="flex items-center gap-2 mb-2 text-[9px] text-zinc-500 flex-wrap">
              {visibleBrands.map(b => (
                <span key={b} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: extendedBrandColors[b] || brandColors[b] }} />
                  {b}
                </span>
              ))}
              {showCompetitors && selectedBrand !== "All Brands" && visibleCompBrands.map(b => (
                <span key={`comp-${b}`} className="flex items-center gap-1 opacity-70">
                  <span className="w-2 h-2 rounded-full border border-dashed" style={{ borderColor: compBrandColors[b] || "#666", backgroundColor: "transparent" }} />
                  {b}
                </span>
              ))}
              <span className="w-px h-2 bg-zinc-700" />
              <span className="flex items-center gap-1">
                <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 2" /></svg>
                Portfolio Avg
              </span>
              {selectedBrand === "All Brands" && showCompetitors && (
                <span className="flex items-center gap-1">
                  <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#6366f1" strokeWidth="2" strokeDasharray="2 2" /></svg>
                  Competitor Avg
                </span>
              )}
              {selectedBrand === "All Brands" && (
                <>
                  <span className="w-px h-2 bg-zinc-700" />
                  <span className="flex items-center gap-1">
                    <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                    Cola
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                    Citrus
                  </span>
                  {showCompetitors && (
                    <>
                      <span className="flex items-center gap-1 opacity-60">
                        <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 3" /></svg>
                        Comp Cola
                      </span>
                      <span className="flex items-center gap-1 opacity-60">
                        <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="2 3" /></svg>
                        Comp Citrus
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* SVG Chart */}
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 280 }}>
              <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#0a0a0a" rx={2} />

              {/* Grid */}
              {Array.from({ length: 8 }, (_, i) => {
                const ppl = minPpl + (i / 7) * (maxPpl - minPpl)
                return (
                  <g key={`yg${i}`}>
                    <line x1={pad.left} x2={W - pad.right} y1={toY(ppl)} y2={toY(ppl)} stroke="#27272a" strokeWidth="0.5" />
                    <text x={pad.left - 8} y={toY(ppl) + 3} textAnchor="end" className="fill-zinc-500 text-[10px]">{ppl.toFixed(1)}</text>
                  </g>
                )
              })}
              {Array.from({ length: 10 }, (_, i) => {
                const ml = Math.round((i / 9) * maxMl)
                return (
                  <g key={`xg${ml}`}>
                    <line x1={toX(ml)} x2={toX(ml)} y1={pad.top} y2={pad.top + plotH} stroke="#27272a" strokeWidth="0.5" />
                    <text x={toX(ml)} y={pad.top + plotH + 18} textAnchor="middle" className="fill-zinc-500 text-[10px]">{ml}</text>
                  </g>
                )
              })}

              {/* Axis titles */}
              <text x={W / 2} y={H - 6} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium">Pack Size (mL)</text>
              <text x={16} y={H / 2} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium" transform={`rotate(-90,16,${H / 2})`}>{`Price per Litre (\u20ac/L)`}</text>

              {/* Brand Portfolio Average Curve */}
              <g 
                onMouseEnter={() => setHoveredAvgLine("ours")} 
                onMouseLeave={() => setHoveredAvgLine(null)}
                style={{ cursor: selectedBrand === "All Brands" ? "pointer" : "default" }}
              >
                <path
                  d={curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth={hoveredAvgLine === "ours" ? "2.5" : "2"} 
                  strokeDasharray="6 4" 
                  opacity={hoveredAvgLine === "ours" ? "0.9" : "0.7"}
                />
                {/* Invisible thicker line for easier hover */}
                <path
                  d={curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                  fill="none" 
                  stroke="transparent" 
                  strokeWidth="12"
                />
                {/* Tooltip for portfolio avg line in All Brands view */}
                {hoveredAvgLine === "ours" && selectedBrand === "All Brands" && (
                  <AverageLineTooltip 
                    x={toX(800)} 
                    y={toY(curvePoints.find(p => p.ml >= 800)?.ppl || 3)} 
                    label="Brand Portfolio Average" 
                    visible 
                    lines={[
                      `Avg Price/L: \u20ac${comparisonStats.ourAvg.toFixed(2)}`,
                      `${comparisonStats.diffPct > 0 ? "+" : ""}${comparisonStats.diffPct.toFixed(1)}% vs competitor avg`,
                      comparisonStats.diffPct > 5 ? "Premium positioning across portfolio" : comparisonStats.diffPct < -3 ? "Value positioning - margin opportunity" : "Competitive pricing position"
                    ]} 
                  />
                )}
              </g>

              {/* Competitor Average Curve (only in All Brands view with competitors enabled) */}
              {selectedBrand === "All Brands" && showCompetitors && (
                <g 
                  onMouseEnter={() => setHoveredAvgLine("competitors")} 
                  onMouseLeave={() => setHoveredAvgLine(null)}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={compCurvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth={hoveredAvgLine === "competitors" ? "2.5" : "2"} 
                    strokeDasharray="4 3" 
                    opacity={hoveredAvgLine === "competitors" ? "0.9" : "0.6"}
                  />
                  {/* Invisible thicker line for easier hover */}
                  <path
                    d={compCurvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                    fill="none" 
                    stroke="transparent" 
                    strokeWidth="12"
                  />
                  {/* Tooltip for competitor avg line */}
                  {hoveredAvgLine === "competitors" && (
                    <AverageLineTooltip 
                      x={toX(1200)} 
                      y={toY(compCurvePoints.find(p => p.ml >= 1200)?.ppl || 2)} 
                      label="Competitor Portfolio Average" 
                      visible 
                      lines={[
                        `Avg Price/L: \u20ac${comparisonStats.compAvg.toFixed(2)}`,
                        `${comparisonStats.diffPct > 0 ? "" : "+"}${(-comparisonStats.diffPct).toFixed(1)}% vs portfolio avg`,
                        `Includes: Pepsi, 7Up, SanPellegrino, Schweppes`
                      ]} 
                    />
                  )}
                </g>
              )}

              {/* Category-level curves for portfolio (only in All Brands view) */}
              {selectedBrand === "All Brands" && categoryCurves.map((cat: { id: string; label: string; color: string; curvePoints: Array<{ml: number; ppl: number}>; avgPpl: number; skuCount: number } | null) => {
                if (!cat) return null
                const isHovered = hoveredCatCurve === `tccc-${cat.id}`
                return (
                  <g 
                    key={`tccc-cat-${cat.id}`}
                    onMouseEnter={() => setHoveredCatCurve(`tccc-${cat.id}`)} 
                    onMouseLeave={() => setHoveredCatCurve(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d={cat.curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                      fill="none" 
                      stroke={cat.color} 
                      strokeWidth={isHovered ? "2" : "1.5"} 
                      strokeDasharray="4 2" 
                      opacity={isHovered ? "0.9" : "0.5"}
                    />
                    <path
                      d={cat.curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                      fill="none" 
                      stroke="transparent" 
                      strokeWidth="10"
                    />
                    {isHovered && (
                      <AverageLineTooltip 
                        x={toX(600)} 
                        y={toY(cat.curvePoints.find(p => p.ml >= 600)?.ppl || 3)} 
                        label={`Portfolio ${cat.label}`} 
                        visible 
                        lines={[
                          `Avg Price/L: \u20ac${cat.avgPpl.toFixed(2)}`,
                          `${cat.skuCount} SKUs in category`,
                          `Brands: ${categoryDefs.find(c => c.id === cat.id)?.brands.join(", ")}`
                        ]} 
                      />
                    )}
                  </g>
                )
              })}

              {/* Category-level curves for Competitors (only in All Brands view with competitors enabled) */}
              {selectedBrand === "All Brands" && showCompetitors && compCategoryCurves.map((cat: { id: string; label: string; color: string; curvePoints: Array<{ml: number; ppl: number}>; avgPpl: number; skuCount: number } | null) => {
                if (!cat) return null
                const isHovered = hoveredCatCurve === `comp-${cat.id}`
                // Use a lighter/different shade for competitor category curves
                const compColor = cat.id === "cola" ? "#3b82f6" : "#a3e635"
                return (
                  <g 
                    key={`comp-cat-${cat.id}`}
                    onMouseEnter={() => setHoveredCatCurve(`comp-${cat.id}`)} 
                    onMouseLeave={() => setHoveredCatCurve(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d={cat.curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                      fill="none" 
                      stroke={compColor} 
                      strokeWidth={isHovered ? "2" : "1.5"} 
                      strokeDasharray="2 3" 
                      opacity={isHovered ? "0.9" : "0.4"}
                    />
                    <path
                      d={cat.curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.ml).toFixed(1)},${toY(p.ppl).toFixed(1)}`).join(" ")}
                      fill="none" 
                      stroke="transparent" 
                      strokeWidth="10"
                    />
                    {isHovered && (
                      <AverageLineTooltip 
                        x={toX(900)} 
                        y={toY(cat.curvePoints.find(p => p.ml >= 900)?.ppl || 2.5)} 
                        label={`Competitor ${cat.label}`} 
                        visible 
                        lines={[
                          `Avg Price/L: \u20ac${cat.avgPpl.toFixed(2)}`,
                          `${cat.skuCount} SKUs tracked`,
                          `Brands: ${categoryDefs.find(c => c.id === cat.id)?.compBrands.join(", ")}`
                        ]} 
                      />
                    )}
                  </g>
                )
              })}

              {/* Tier lines - staggered labels to prevent overlap */}
              {tiers.map(t => (
                <g key={t.ml}>
                  <line x1={toX(t.ml)} x2={toX(t.ml)} y1={pad.top} y2={pad.top + plotH} stroke="#dc2626" strokeWidth="1" opacity="0.3" />
                  <text x={toX(t.ml)} y={pad.top - 6 - t.yOffset} textAnchor="middle" className="fill-red-400/70 text-[8px] font-medium">{t.label}</text>
                </g>
              ))}

              {/* Competitor bubbles (only show when specific brand selected, not in All Brands view) */}
              {showCompetitors && selectedBrand !== "All Brands" && compData.map((d, i) => {
                const r = getR(d.revM)
                const cx = toX(d.packMl)
                const cy = toY(d.ppl)
                const isHovered = hoveredComp === i
                const color = compBrandColors[d.brand] || "#666"
                return (
                  <g key={`comp-${d.sku}`} onMouseEnter={() => setHoveredComp(i)} onMouseLeave={() => setHoveredComp(null)} style={{ cursor: "pointer" }}>
                    <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={color} strokeWidth={isHovered ? 2.5 : 1.5} strokeDasharray="4 2" opacity={isHovered ? 0.9 : 0.5} />
                    {isHovered && (
                      <ChartTooltip x={cx} y={cy - r - 10} sku={`${d.sku} (Competitor)`} visible lines={[
                        `Pack: ${d.packMl}mL  |  Price/L: \u20ac${d.ppl.toFixed(2)}`,
                        `Revenue: \u20ac${d.revM}M`,
                        `Portfolio Avg: \u20ac${getExpectedPpl(d.packMl).toFixed(2)}/L`,
                      ]} />
                    )}
                  </g>
                )
              })}

              {/* Own SKU bubbles - only show when specific brand selected, not in All Brands view */}
              {selectedBrand !== "All Brands" && filtered.map((d, i) => {
                const r = getR(d.revM)
                const cx = toX(d.packMl)
                const cy = toY(d.ppl)
                const isHovered = hoveredIdx === i
                // Shorten label for cleaner display
                const shortLabel = d.sku.includes("Avg") ? d.sku.split(" ")[1] : d.packMl + "ml"
                return (
                  <g key={d.sku} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: "pointer" }}>
                    <circle cx={cx} cy={cy} r={r} fill={extendedBrandColors[d.brand] || brandColors[d.brand] || "#888"} opacity={isHovered ? 0.85 : 0.6} stroke={isHovered ? "#fff" : extendedBrandColors[d.brand] || brandColors[d.brand] || "#888"} strokeWidth={isHovered ? 2 : 1.5} />
                    {/* Only show label inside bubble or on hover */}
                    {r > 12 && (
                      <text x={cx} y={cy + 3} textAnchor="middle" className="fill-white text-[8px] font-medium" style={{ pointerEvents: "none" }}>{shortLabel}</text>
                    )}
                    {isHovered && (
                      <ChartTooltip x={cx} y={cy - r - 10} sku={d.sku} visible lines={[
                        `Pack: ${d.packMl}mL  |  Price/L: \u20ac${d.ppl.toFixed(2)}`,
                        `Revenue: \u20ac${d.revM}M  |  Margin: ${d.margin}%`,
                        `Portfolio Avg: \u20ac${getExpectedPpl(d.packMl).toFixed(2)}/L  |  ${d.ppl > getExpectedPpl(d.packMl) * 1.05 ? "Above avg" : d.ppl < getExpectedPpl(d.packMl) * 0.95 ? "Below avg" : "At avg"}`,
                      ]} />
                    )}
                  </g>
                )
              })}

              {/* Alert markers on chart for anomalies */}
              {priceAlerts.filter(a => a.packMl).map((alert, i) => {
                const x = toX(alert.packMl!)
                const sku = filtered.find(d => d.packMl === alert.packMl)
                if (!sku) return null
                const y = toY(sku.ppl)
                return (
                  <g key={alert.id} transform={`translate(${x + 18},${y - 4})`}>
                    <circle r={10} fill="#18181b" stroke={alert.type === "anomaly" ? "#ef4444" : "#f59e0b"} strokeWidth="1.5" />
                    <text textAnchor="middle" dy="3.5" className={alert.type === "anomaly" ? "fill-red-400 text-[9px] font-bold" : "fill-amber-400 text-[9px] font-bold"}>!</text>
                  </g>
                )
              })}

              {/* Revenue callout */}
              <rect x={W - pad.right - 110} y={pad.top + 6} width={106} height={36} rx={4} fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
              <text x={W - pad.right - 57} y={pad.top + 22} textAnchor="middle" className="fill-zinc-400 text-[9px]">Total RSV</text>
              <text x={W - pad.right - 57} y={pad.top + 36} textAnchor="middle" className="fill-zinc-100 text-[12px] font-bold">{"\u20ac"}{filtered.reduce((s, d) => s + d.revM, 0).toFixed(1)}M</text>
            </svg>
          </CardContent>
        </Card>

        {/* Price Alerts panel - COMPACT */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3 w-3 text-amber-400" />
              <h3 className="text-[11px] font-semibold text-zinc-100">Price Alerts</h3>
            </div>
            <div className="space-y-2">
              {priceAlerts.map((alert, i) => (
                <button
                  key={alert.id}
                  onClick={() => alert.actionable && onNavigate?.("simulate-forecast")}
                  className={cn(
                    "w-full text-left p-2.5 rounded-lg border transition-all",
                    alert.type === "anomaly" ? "bg-red-500/10 border-red-500/20 hover:border-red-500/40" :
                    alert.type === "opportunity" ? "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40" :
                    "bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600",
                    hoveredObs === i && "ring-1 ring-white/20"
                  )}
                  onMouseEnter={() => setHoveredObs(i)}
                  onMouseLeave={() => setHoveredObs(null)}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      alert.type === "anomaly" ? "bg-red-500/20" :
                      alert.type === "opportunity" ? "bg-amber-500/20" : "bg-zinc-700"
                    )}>
                      {alert.type === "anomaly" ? (
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                      ) : alert.type === "opportunity" ? (
                        <Sparkles className="h-3 w-3 text-amber-400" />
                      ) : (
                        <span className="text-[9px] text-zinc-400">{i + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={cn(
                          "text-[10px] font-semibold",
                          alert.type === "anomaly" ? "text-red-300" :
                          alert.type === "opportunity" ? "text-amber-300" : "text-zinc-200"
                        )}>
                          {alert.title}
                        </span>
                        {alert.gap && (
                          <Badge className={cn(
                            "text-[8px] py-0 h-4",
                            alert.type === "anomaly" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                            "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          )}>
                            {alert.gap}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[9px] text-zinc-400 leading-relaxed">{alert.detail}</p>
                      {alert.actionable && (
                        <div className="flex items-center gap-1 mt-1.5 text-[8px] text-amber-400">
                          <span>Simulate price change</span>
                          <ChevronRight className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {priceAlerts.length === 0 && (
                <div className="p-3 text-center">
                  <p className="text-[10px] text-zinc-500">No price alerts detected for current selection.</p>
                </div>
              )}
            </div>
            <p className="mt-2 text-[8px] text-zinc-600">Click an alert to simulate the recommended price change.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
