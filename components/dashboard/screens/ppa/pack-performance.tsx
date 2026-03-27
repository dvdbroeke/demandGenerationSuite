"use client"

import { useState, useMemo, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

// Re-export the type from new canonical location
export type { PPAScreen } from "./price-incentive"
import type { PPAScreen } from "./price-incentive"

interface Props { onNavigate?: (screen: PPAScreen) => void }

const tabs: { id: PPAScreen; label: string }[] = [
  { id: "price-incentive", label: "Price Incentive" },
  { id: "pack-role-margin", label: "Pricing Diagnostics" },
  { id: "simulate-forecast", label: "Simulate & Forecast" },
]

import { skuMaster, allSkuNames, allBrands, brandColors, retailerOptions as sharedRetailers } from "../shared-sku-data"

// Map skuMaster to chart data
const skuData = skuMaster.map(s => ({
  sku: s.sku, brand: s.brand, packMl: s.packMl, ppl: s.ppl, velocity: s.velocity,
  distribution: s.distribution, revM: s.revM, role: s.role, priceIndex: s.priceIndex, margin: s.gpMargin,
}))

const allSkus = allSkuNames
const retailers = [...sharedRetailers]
const brandOptions = ["All Brands", ...allBrands]
const retailerMult: Record<string, number> = { Esselunga: 1.0, Conad: 1.02, "Coop Italia": 0.96, "Carrefour IT": 0.98, Eurospin: 0.88, "Lidl IT": 0.90, PAM: 1.04, Despar: 0.95 }

// Tooltip component
function ChartTooltip({ x, y, sku, lines, visible }: { x: number; y: number; sku: string; lines: string[]; visible: boolean }) {
  if (!visible) return null
  const boxW = 220
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

// Observation marker on chart
function ObsMarker({ x, y, num }: { x: number; y: number; num: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={10} fill="#18181b" stroke="#dc2626" strokeWidth="1.5" />
      <text textAnchor="middle" dy="3.5" className="fill-red-400 text-[9px] font-bold">{num}</text>
    </g>
  )
}

export function PPAPackPerformance({ onNavigate }: Props) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedSkus, setSelectedSkus] = useState<string[]>([])
  const [activeChart, setActiveChart] = useState<"price-incentive" | "push-pull">("price-incentive")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [hoveredObs, setHoveredObs] = useState<number | null>(null)

  // Filter data
  const filtered = useMemo(() => {
    let data = [...skuData]
    if (selectedBrand !== "All Brands") data = data.filter(d => d.brand === selectedBrand)
    if (selectedSkus.length > 0) data = data.filter(d => selectedSkus.includes(d.sku))
    if (selectedRetailer !== "All Retailers") {
      const m = retailerMult[selectedRetailer] ?? 1
      data = data.map(d => ({
        ...d,
        ppl: +(d.ppl * m).toFixed(2),
        velocity: +(d.velocity * (1 + (m - 1) * 0.6)).toFixed(1),
        distribution: Math.min(95, Math.round(d.distribution * (1 + (m - 1) * 0.3))),
      }))
    }
    return data
  }, [selectedBrand, selectedRetailer, selectedSkus])

  // Available SKU options for filter
  const availableSkuOptions = useMemo(() => {
    if (selectedBrand !== "All Brands") return skuData.filter(d => d.brand === selectedBrand).map(d => d.sku)
    return allSkus
  }, [selectedBrand])

  // Chart dimensions
  const W = 760, H = 420, pad = { top: 40, right: 30, bottom: 55, left: 60 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  // Price Incentive helpers
  const minMl = 0, maxMl = 1800
  const pplVals = filtered.length > 0 ? filtered.map(d => d.ppl) : [1, 5]
  const minPpl = Math.floor(Math.min(...pplVals, 1) * 10) / 10
  const maxPpl = Math.ceil(Math.max(...pplVals, 5) * 10) / 10

  const toX_pic = (ml: number) => pad.left + (ml / maxMl) * plotW
  const toY_pic = (ppl: number) => pad.top + plotH - ((ppl - minPpl) / (maxPpl - minPpl)) * plotH

  const curvePoints = Array.from({ length: 40 }, (_, i) => {
    const ml = 80 + (i / 39) * 1700
    const ppl = 12 * Math.pow(ml, -0.35)
    return { ml, ppl }
  })

  const tiers = [
    { ml: 250, label: "Single Serve" },
    { ml: 500, label: "On-the-Go" },
    { ml: 1500, label: "Multi Serve" },
    { ml: 5000, label: "Multipack" },
  ]

  // Push-Pull helpers
  const dVals = filtered.length > 0 ? filtered.map(d => d.distribution) : [30, 90]
  const vVals = filtered.length > 0 ? filtered.map(d => d.velocity) : [0, 10]
  const minD = Math.max(0, Math.floor((Math.min(...dVals) - 10) / 10) * 10)
  const maxD = Math.min(100, Math.ceil((Math.max(...dVals) + 10) / 10) * 10)
  const minV = 0
  const maxV = Math.ceil(Math.max(...vVals) + 2)

  const toX_pp = (d: number) => pad.left + ((d - minD) / (maxD - minD)) * plotW
  const toY_pp = (v: number) => pad.top + plotH - ((v - minV) / (maxV - minV)) * plotH

  const dMed = [...dVals].sort((a, b) => a - b)[Math.floor(dVals.length / 2)] || 60
  const vMed = [...vVals].sort((a, b) => a - b)[Math.floor(vVals.length / 2)] || 4

  // Observations with positions on chart
  const priceObs = useMemo(() => {
    const above = filtered.filter(d => d.ppl > 12 * Math.pow(d.packMl, -0.35) * 1.08)
    const below = filtered.filter(d => d.ppl < 12 * Math.pow(d.packMl, -0.35) * 0.92)
    const avg330 = filtered.filter(d => d.packMl === 330)
    const avg500 = filtered.filter(d => d.packMl === 500)
    const gap = (avg330.reduce((s, d) => s + d.ppl, 0) / Math.max(1, avg330.length)) - (avg500.reduce((s, d) => s + d.ppl, 0) / Math.max(1, avg500.length))

    const obs: { text: string; skuRef: typeof filtered[0] | null; color: string }[] = []
    if (above.length > 0) {
      obs.push({ text: `${above.map(d => d.sku).join(", ")} priced above expected curve -- premium positioning may limit volume in price-sensitive channels.`, skuRef: above[0], color: "#f59e0b" })
    }
    if (below.length > 0) {
      obs.push({ text: `${below.map(d => d.sku).join(", ")} priced below expected value -- potential margin leakage of ~${(below.length * 2.1).toFixed(0)}% GP.`, skuRef: below[0], color: "#ef4444" })
    }
    if (avg330.length > 0 && avg500.length > 0) {
      obs.push({ text: `330ml-to-500ml price step-down averages ${gap.toFixed(2)}/L -- ${gap > 0.5 ? "strong incentive to upsize" : "narrow gap may cannibalize single-serve"}.`, skuRef: avg330[0], color: "#22c55e" })
    }
    if (obs.length === 0) obs.push({ text: "All SKUs are well-positioned on the price incentive curve.", skuRef: filtered[0] || null, color: "#22c55e" })
    return obs
  }, [filtered])

  const pushObs = useMemo(() => {
    const stars = filtered.filter(d => d.velocity >= vMed && d.distribution >= dMed)
    const underDist = filtered.filter(d => d.velocity >= vMed && d.distribution < dMed)
    const overDist = filtered.filter(d => d.velocity < vMed && d.distribution >= dMed)

    const obs: { text: string; skuRef: typeof filtered[0] | null; color: string }[] = []
    if (stars.length > 0) {
      obs.push({ text: `Star performers: ${stars.map(d => d.sku).join(", ")} -- high velocity and high distribution. Protect shelf space and pricing.`, skuRef: stars[0], color: "#22c55e" })
    }
    if (underDist.length > 0) {
      obs.push({ text: `Distribution opportunity: ${underDist.map(d => d.sku).join(", ")} -- high velocity but under-distributed. Expanding WD +10pts could unlock ~${(underDist.length * 1.8).toFixed(1)}M incremental volume.`, skuRef: underDist[0], color: "#f59e0b" })
    }
    if (overDist.length > 0) {
      obs.push({ text: `Shelf efficiency risk: ${overDist.map(d => d.sku).join(", ")} -- widely distributed but low velocity. Consider range rationalization.`, skuRef: overDist[0], color: "#ef4444" })
    }
    if (obs.length === 0) obs.push({ text: "All SKUs are performing well across velocity and distribution.", skuRef: filtered[0] || null, color: "#22c55e" })
    return obs
  }, [filtered, vMed, dMed])

  const observations = activeChart === "price-incentive" ? priceObs : pushObs

  // Get marker position for observation on chart
  const getObsPos = (obs: { skuRef: typeof filtered[0] | null }, chartType: "price-incentive" | "push-pull") => {
    if (!obs.skuRef) return null
    if (chartType === "price-incentive") {
      return { x: toX_pic(obs.skuRef.packMl), y: toY_pic(obs.skuRef.ppl) - 22 }
    }
    return { x: toX_pp(obs.skuRef.distribution), y: toY_pp(obs.skuRef.velocity) - 22 }
  }

  // Bubble radius from revenue
  const maxRev = Math.max(...filtered.map(d => d.revM), 1)
  const getR = (rev: number) => 8 + (rev / maxRev) * 22

  // Get unique brands in filtered data for legend (no duplicates)
  const visibleBrands = [...new Set(filtered.map(d => d.brand))]

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
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

        {/* SKU multi-select as add chips */}
        {availableSkuOptions.filter(s => !selectedSkus.includes(s)).length > 0 && selectedSkus.length < availableSkuOptions.length && (
          <Select value="" onValueChange={(v) => { if (v) setSelectedSkus(prev => [...prev, v]) }}>
            <SelectTrigger className="h-7 w-[170px] bg-zinc-900 border-zinc-800 text-zinc-400 text-[10px]">
              <span className="text-zinc-500">{selectedSkus.length === 0 ? "All SKUs shown" : "+ Add SKU filter"}</span>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {availableSkuOptions.filter(s => !selectedSkus.includes(s)).map(s => <SelectItem key={s} value={s} className="text-zinc-200 text-xs">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {selectedSkus.map(sku => (
          <button key={sku} onClick={() => setSelectedSkus(prev => prev.filter(s => s !== sku))} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-zinc-600 text-zinc-100 bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors[skuData.find(d => d.sku === sku)?.brand || ""] || "#888" }} />
            {sku}
            <span className="text-zinc-500 ml-0.5">x</span>
          </button>
        ))}
        {selectedSkus.length > 0 && (
          <button onClick={() => setSelectedSkus([])} className="text-[10px] text-zinc-500 hover:text-zinc-300 underline">Clear all</button>
        )}

        {/* Chart toggle */}
        <div className="ml-auto flex items-center gap-2">
          {(["price-incentive", "push-pull"] as const).map(v => (
            <button key={v} onClick={() => setActiveChart(v)} className={cn("px-3 py-1.5 rounded text-[10px] font-medium border transition-colors", activeChart === v ? "bg-red-500/15 text-red-300 border-red-500/30" : "text-zinc-500 border-zinc-800 hover:text-zinc-300")}>
              {v === "price-incentive" ? "Price Incentive Curve" : "Velocity vs Availability"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart + Observations */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            {/* Title */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-zinc-100">
                {activeChart === "price-incentive" ? "Price Incentive Curve" : "Velocity vs Availability (Push-Pull Analysis)"}
              </h3>
              <p className="text-[10px] text-zinc-500">
                {activeChart === "price-incentive"
                  ? "Price per Litre (\u20ac/L) vs Pack Size (mL) -- bubble size = revenue contribution"
                  : "Channel Velocity (Units per WD%) vs TT Weighted Distribution (%) -- bubble size = revenue"}
              </p>
            </div>

            {/* Legend - only visible brands, no duplicates */}
            <div className="flex items-center gap-3 mb-3 text-[10px] text-zinc-500 flex-wrap">
              {visibleBrands.map(b => (
                <span key={b} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brandColors[b] }} />
                  {b}
                </span>
              ))}
              {activeChart === "price-incentive" && (
                <>
                  <span className="w-px h-3 bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#71717a" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                    Expected curve
                  </span>
                </>
              )}
              <span className="w-px h-3 bg-zinc-700" />
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full border-[1.5px] border-red-500 flex items-center justify-center text-[7px] font-bold text-red-400">1</span>
                Observation marker
              </span>
            </div>

            {/* SVG Chart */}
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 380 }}>
              {/* Background */}
              <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#0a0a0a" rx={2} />

              {activeChart === "price-incentive" ? (
                <>
                  {/* Horizontal grid + Y labels */}
                  {Array.from({ length: 7 }, (_, i) => {
                    const ppl = minPpl + (i / 6) * (maxPpl - minPpl)
                    return (
                      <g key={`yg${i}`}>
                        <line x1={pad.left} x2={W - pad.right} y1={toY_pic(ppl)} y2={toY_pic(ppl)} stroke="#27272a" strokeWidth="0.5" />
                        <text x={pad.left - 8} y={toY_pic(ppl) + 3} textAnchor="end" className="fill-zinc-500 text-[10px]">{ppl.toFixed(1)}</text>
                      </g>
                    )
                  })}
                  {/* Vertical grid + X labels */}
                  {[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800].map(ml => (
                    <g key={`xg${ml}`}>
                      <line x1={toX_pic(ml)} x2={toX_pic(ml)} y1={pad.top} y2={pad.top + plotH} stroke="#27272a" strokeWidth="0.5" />
                      <text x={toX_pic(ml)} y={pad.top + plotH + 18} textAnchor="middle" className="fill-zinc-500 text-[10px]">{ml}</text>
                    </g>
                  ))}

                  {/* Axis titles */}
                  <text x={W / 2} y={H - 6} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium">Pack Size (mL)</text>
                  <text x={16} y={H / 2} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium" transform={`rotate(-90,16,${H / 2})`}>{`Price per Litre (\u20ac/L)`}</text>

                  {/* Expected price curve */}
                  <path
                    d={curvePoints.filter(p => p.ppl >= minPpl && p.ppl <= maxPpl).map((p, i) => `${i === 0 ? "M" : "L"}${toX_pic(p.ml).toFixed(1)},${toY_pic(p.ppl).toFixed(1)}`).join(" ")}
                    fill="none" stroke="#71717a" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5"
                  />

                  {/* Price tier vertical lines */}
                  {tiers.map(t => (
                    <g key={t.ml}>
                      <line x1={toX_pic(t.ml)} x2={toX_pic(t.ml)} y1={pad.top} y2={pad.top + plotH} stroke="#dc2626" strokeWidth="1" opacity="0.3" />
                      <text x={toX_pic(t.ml)} y={pad.top - 6} textAnchor="middle" className="fill-red-400/70 text-[9px] font-medium">{t.label}</text>
                    </g>
                  ))}

                  {/* SKU bubbles */}
                  {filtered.map((d, i) => {
                    const r = getR(d.revM)
                    const cx = toX_pic(d.packMl)
                    const cy = toY_pic(d.ppl)
                    const isHovered = hoveredIdx === i
                    return (
                      <g key={d.sku} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: "pointer" }}>
                        <circle cx={cx} cy={cy} r={r} fill={brandColors[d.brand] || "#888"} opacity={isHovered ? 0.85 : 0.5} stroke={isHovered ? "#fff" : brandColors[d.brand] || "#888"} strokeWidth={isHovered ? 2 : 1.5} />
                        <text x={cx} y={cy - r - 5} textAnchor="middle" className="fill-zinc-300 text-[9px] font-medium" style={{ pointerEvents: "none" }}>{d.sku.replace(d.brand + " ", "")}</text>
                        {isHovered && (
                          <ChartTooltip x={cx} y={cy - r - 10} sku={d.sku} visible lines={[
                            `Pack: ${d.packMl}mL  |  Price/L: \u20ac${d.ppl.toFixed(2)}`,
                            `Revenue: \u20ac${d.revM}M  |  Margin: ${d.margin}%`,
                            `Expected: \u20ac${(12 * Math.pow(d.packMl, -0.35)).toFixed(2)}/L  |  ${d.ppl > 12 * Math.pow(d.packMl, -0.35) * 1.05 ? "Above curve" : d.ppl < 12 * Math.pow(d.packMl, -0.35) * 0.95 ? "Below curve" : "On curve"}`,
                          ]} />
                        )}
                      </g>
                    )
                  })}

                  {/* Observation markers on chart */}
                  {observations.map((obs, i) => {
                    const pos = getObsPos(obs, "price-incentive")
                    if (!pos) return null
                    return <ObsMarker key={i} x={pos.x + 18} y={pos.y - 4} num={i + 1} />
                  })}

                  {/* Revenue callout */}
                  <rect x={W - pad.right - 110} y={pad.top + 6} width={106} height={36} rx={4} fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
                  <text x={W - pad.right - 57} y={pad.top + 22} textAnchor="middle" className="fill-zinc-400 text-[9px]">Total RSV</text>
                  <text x={W - pad.right - 57} y={pad.top + 36} textAnchor="middle" className="fill-zinc-100 text-[12px] font-bold">{"\u20ac"}{filtered.reduce((s, d) => s + d.revM, 0).toFixed(1)}M</text>
                </>
              ) : (
                <>
                  {/* Horizontal grid + Y labels */}
                  {Array.from({ length: 7 }, (_, i) => {
                    const v = minV + (i / 6) * (maxV - minV)
                    return (
                      <g key={`yg${i}`}>
                        <line x1={pad.left} x2={W - pad.right} y1={toY_pp(v)} y2={toY_pp(v)} stroke="#27272a" strokeWidth="0.5" />
                        <text x={pad.left - 8} y={toY_pp(v) + 3} textAnchor="end" className="fill-zinc-500 text-[10px]">{v.toFixed(1)}</text>
                      </g>
                    )
                  })}
                  {/* Vertical grid + X labels */}
                  {Array.from({ length: 8 }, (_, i) => {
                    const d = minD + (i / 7) * (maxD - minD)
                    return (
                      <g key={`xg${i}`}>
                        <line x1={toX_pp(d)} x2={toX_pp(d)} y1={pad.top} y2={pad.top + plotH} stroke="#27272a" strokeWidth="0.5" />
                        <text x={toX_pp(d)} y={pad.top + plotH + 18} textAnchor="middle" className="fill-zinc-500 text-[10px]">{Math.round(d)}%</text>
                      </g>
                    )
                  })}

                  {/* Axis titles */}
                  <text x={W / 2} y={H - 6} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium">TT Weighted Distribution (%)</text>
                  <text x={16} y={H / 2} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium" transform={`rotate(-90,16,${H / 2})`}>Channel Velocity (Units per WD%)</text>

                  {/* Quadrant dividers */}
                  <line x1={toX_pp(dMed)} x2={toX_pp(dMed)} y1={pad.top} y2={pad.top + plotH} stroke="#52525b" strokeWidth="1" strokeDasharray="5 4" opacity="0.5" />
                  <line x1={pad.left} x2={W - pad.right} y1={toY_pp(vMed)} y2={toY_pp(vMed)} stroke="#52525b" strokeWidth="1" strokeDasharray="5 4" opacity="0.5" />

                  {/* Quadrant labels */}
                  <text x={pad.left + 10} y={pad.top + 18} className="fill-zinc-600 text-[10px] font-medium">Niche</text>
                  <text x={W - pad.right - 10} y={pad.top + 18} textAnchor="end" className="fill-emerald-500/50 text-[10px] font-bold">Stars</text>
                  <text x={pad.left + 10} y={pad.top + plotH - 8} className="fill-red-400/50 text-[10px] font-medium">Rationalize</text>
                  <text x={W - pad.right - 10} y={pad.top + plotH - 8} textAnchor="end" className="fill-amber-400/50 text-[10px] font-medium">Over-distributed</text>

                  {/* SKU bubbles */}
                  {filtered.map((d, i) => {
                    const r = getR(d.revM)
                    const cx = toX_pp(d.distribution)
                    const cy = toY_pp(d.velocity)
                    const isHovered = hoveredIdx === i
                    return (
                      <g key={d.sku} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: "pointer" }}>
                        <circle cx={cx} cy={cy} r={r} fill={brandColors[d.brand] || "#888"} opacity={isHovered ? 0.85 : 0.5} stroke={isHovered ? "#fff" : brandColors[d.brand] || "#888"} strokeWidth={isHovered ? 2 : 1.5} />
                        <text x={cx} y={cy - r - 5} textAnchor="middle" className="fill-zinc-300 text-[9px] font-medium" style={{ pointerEvents: "none" }}>{d.sku.replace(d.brand + " ", "")}</text>
                        {isHovered && (
                          <ChartTooltip x={cx} y={cy - r - 10} sku={d.sku} visible lines={[
                            `Velocity: ${d.velocity} units/WD%  |  Distribution: ${d.distribution}%`,
                            `Revenue: \u20ac${d.revM}M  |  Role: ${d.role}`,
                            `Quadrant: ${d.velocity >= vMed && d.distribution >= dMed ? "Star" : d.velocity >= vMed ? "Niche / Under-distributed" : d.distribution >= dMed ? "Over-distributed" : "Rationalize"}`,
                          ]} />
                        )}
                      </g>
                    )
                  })}

                  {/* Observation markers */}
                  {observations.map((obs, i) => {
                    const pos = getObsPos(obs, "push-pull")
                    if (!pos) return null
                    return <ObsMarker key={i} x={pos.x + 18} y={pos.y - 4} num={i + 1} />
                  })}

                  {/* Revenue callout */}
                  <rect x={pad.left + 6} y={pad.top + 6} width={106} height={36} rx={4} fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
                  <text x={pad.left + 59} y={pad.top + 22} textAnchor="middle" className="fill-zinc-400 text-[9px]">Total RSV</text>
                  <text x={pad.left + 59} y={pad.top + 36} textAnchor="middle" className="fill-zinc-100 text-[12px] font-bold">{"\u20ac"}{filtered.reduce((s, d) => s + d.revM, 0).toFixed(1)}M</text>
                </>
              )}
            </svg>
          </CardContent>
        </Card>

        {/* Observations panel */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Observations</h3>
            </div>
            <div className="space-y-3">
              {observations.map((obs, i) => (
                <div
                  key={i}
                  className={cn("p-3 rounded-lg border transition-colors cursor-default", hoveredObs === i ? "border-red-500/50 bg-zinc-800/60" : "border-zinc-800/50 bg-zinc-900/30")}
                  onMouseEnter={() => setHoveredObs(i)}
                  onMouseLeave={() => setHoveredObs(null)}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ borderColor: obs.color, color: obs.color }}>{i + 1}</span>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">{obs.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[9px] text-zinc-600">Hover over bubbles on the chart for detailed SKU metrics. Observation markers indicate key findings.</p>
          </CardContent>
        </Card>
      </div>

      {/* Detail table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">SKU Performance Detail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["SKU", "Brand", "Pack", "Role", "Price/L", "Velocity", "Distribution", "Revenue", "Price Idx", "Margin"].map(h => (
                    <th key={h} className="py-2 px-2 text-left text-zinc-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-2 px-2 text-zinc-200 font-medium">{d.sku}</td>
                    <td className="py-2 px-2"><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors[d.brand] }} /><span className="text-zinc-300">{d.brand}</span></span></td>
                    <td className="py-2 px-2 text-zinc-400 font-mono">{d.packMl}ml</td>
                    <td className="py-2 px-2"><Badge className={cn("text-[8px] py-0 h-4", d.role === "Premium" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : d.role === "Traffic" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-zinc-700/40 text-zinc-300 border-zinc-700")}>{d.role}</Badge></td>
                    <td className="py-2 px-2 text-zinc-300 font-mono">{"\u20ac"}{d.ppl.toFixed(2)}</td>
                    <td className="py-2 px-2 font-mono text-zinc-300">{d.velocity.toFixed(1)}</td>
                    <td className="py-2 px-2 font-mono text-zinc-300">{d.distribution}%</td>
                    <td className="py-2 px-2 font-mono text-zinc-200 font-medium">{"\u20ac"}{d.revM.toFixed(1)}M</td>
                    <td className={cn("py-2 px-2 font-mono font-bold", d.priceIndex >= 110 ? "text-red-400" : d.priceIndex >= 105 ? "text-amber-400" : "text-emerald-400")}>{d.priceIndex}</td>
                    <td className="py-2 px-2 font-mono text-zinc-300">{d.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
