"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AssortmentScreen } from "../assortment/coverage-analysis"
import { skuMaster, allSkuNames, allBrands, brandColors, retailerOptions as sharedRetailers } from "../shared-sku-data"

const tabs: { id: AssortmentScreen; label: string }[] = [
  { id: "mix-performance", label: "Mix Performance" },
  { id: "mix-levers", label: "Mix Levers" },
  { id: "coverage-analysis", label: "Coverage Analysis" },
  { id: "push-pull", label: "Push-Pull" },
  { id: "whitespace-gaps", label: "Whitespace & Gaps" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

interface Props { onNavigate?: (screen: AssortmentScreen) => void }

const skuData = skuMaster.map(s => ({
  sku: s.sku, brand: s.brand, packMl: s.packMl, ppl: s.ppl, velocity: s.velocity,
  distribution: s.distribution, revM: s.revM, role: s.role, priceIndex: s.priceIndex, margin: s.gpMargin,
  volGrowth: s.volGrowth, tier: s.tier,
}))

const allSkus = allSkuNames
const retailers = [...sharedRetailers]
const brandOptions = ["All Brands", ...allBrands]
const retailerMult: Record<string, number> = { Esselunga: 1.0, Conad: 1.02, "Coop Italia": 0.96, "Carrefour IT": 0.98, Eurospin: 0.88, "Lidl IT": 0.90, PAM: 1.04, Despar: 0.95 }

// Tooltip
function ChartTooltip({ x, y, sku, lines, visible }: { x: number; y: number; sku: string; lines: string[]; visible: boolean }) {
  if (!visible) return null
  const boxW = 240
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

function ObsMarker({ x, y, num }: { x: number; y: number; num: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={10} fill="#18181b" stroke="#dc2626" strokeWidth="1.5" />
      <text textAnchor="middle" dy="3.5" className="fill-red-400 text-[9px] font-bold">{num}</text>
    </g>
  )
}

export function PPAPushPullAnalysis({ onNavigate }: Props) {
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedRetailer, setSelectedRetailer] = useState("All Retailers")
  const [selectedSkus, setSelectedSkus] = useState<string[]>([])
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [hoveredObs, setHoveredObs] = useState<number | null>(null)

  const filtered = useMemo(() => {
    let data = [...skuData]
    if (selectedBrand !== "All Brands") data = data.filter(d => d.brand === selectedBrand)
    if (selectedSkus.length > 0) data = data.filter(d => selectedSkus.includes(d.sku))
    if (selectedRetailer !== "All Retailers") {
      const m = retailerMult[selectedRetailer] ?? 1
      data = data.map(d => ({
        ...d,
        velocity: +(d.velocity * (1 + (m - 1) * 0.6)).toFixed(1),
        distribution: Math.min(98, Math.round(d.distribution * (1 + (m - 1) * 0.3))),
      }))
    }
    return data
  }, [selectedBrand, selectedRetailer, selectedSkus])

  const availableSkuOptions = useMemo(() => {
    if (selectedBrand !== "All Brands") return skuData.filter(d => d.brand === selectedBrand).map(d => d.sku)
    return allSkus
  }, [selectedBrand])

  // Chart dimensions
  const W = 760, H = 440, pad = { top: 40, right: 30, bottom: 55, left: 60 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const dVals = filtered.length > 0 ? filtered.map(d => d.distribution) : [30, 90]
  const vVals = filtered.length > 0 ? filtered.map(d => d.velocity) : [0, 10]
  const minD = Math.max(0, Math.floor((Math.min(...dVals) - 10) / 10) * 10)
  const maxD = Math.min(100, Math.ceil((Math.max(...dVals) + 10) / 10) * 10)
  const minV = 0
  const maxV = Math.ceil(Math.max(...vVals) + 2)

  const toX = (d: number) => pad.left + ((d - minD) / (maxD - minD)) * plotW
  const toY = (v: number) => pad.top + plotH - ((v - minV) / (maxV - minV)) * plotH

  const dMed = [...dVals].sort((a, b) => a - b)[Math.floor(dVals.length / 2)] || 60
  const vMed = [...vVals].sort((a, b) => a - b)[Math.floor(vVals.length / 2)] || 4

  const maxRev = Math.max(...filtered.map(d => d.revM), 1)
  const getR = (rev: number) => 6 + (rev / maxRev) * 20

  // Observations
  const observations = useMemo(() => {
    const stars = filtered.filter(d => d.velocity >= vMed && d.distribution >= dMed)
    const underDist = filtered.filter(d => d.velocity >= vMed && d.distribution < dMed)
    const overDist = filtered.filter(d => d.velocity < vMed && d.distribution >= dMed)
    const rationalize = filtered.filter(d => d.velocity < vMed && d.distribution < dMed)

    const obs: { text: string; skuRef: typeof filtered[0] | null; color: string }[] = []
    if (stars.length > 0) {
      obs.push({ text: `Star performers: ${stars.slice(0, 4).map(d => d.sku).join(", ")}${stars.length > 4 ? ` (+${stars.length - 4} more)` : ""} -- high velocity and distribution. Protect shelf space and pricing.`, skuRef: stars[0], color: "#22c55e" })
    }
    if (underDist.length > 0) {
      obs.push({ text: `Distribution opportunity: ${underDist.slice(0, 3).map(d => d.sku).join(", ")}${underDist.length > 3 ? ` (+${underDist.length - 3} more)` : ""} -- high velocity but under-distributed. Expanding WD +10pts could unlock ~\u20ac${(underDist.length * 0.6).toFixed(1)}M incremental volume.`, skuRef: underDist[0], color: "#f59e0b" })
    }
    if (overDist.length > 0) {
      obs.push({ text: `Shelf efficiency risk: ${overDist.slice(0, 3).map(d => d.sku).join(", ")}${overDist.length > 3 ? ` (+${overDist.length - 3} more)` : ""} -- widely distributed but low velocity. Consider range rationalization in bottom-performing stores.`, skuRef: overDist[0], color: "#ef4444" })
    }
    if (rationalize.length > 0) {
      obs.push({ text: `Rationalize candidates: ${rationalize.slice(0, 3).map(d => d.sku).join(", ")}${rationalize.length > 3 ? ` (+${rationalize.length - 3} more)` : ""} -- low on both axes. Review for potential delist or reposition.`, skuRef: rationalize[0], color: "#a855f7" })
    }
    if (obs.length === 0) obs.push({ text: "All SKUs are performing well across velocity and distribution.", skuRef: filtered[0] || null, color: "#22c55e" })
    return obs
  }, [filtered, vMed, dMed])

  const getObsPos = (obs: { skuRef: typeof filtered[0] | null }) => {
    if (!obs.skuRef) return null
    return { x: toX(obs.skuRef.distribution), y: toY(obs.skuRef.velocity) - 22 }
  }

  const visibleBrands = [...new Set(filtered.map(d => d.brand))]

  // Quadrant assignment
  const getQuadrant = (d: typeof filtered[0]) => {
    if (d.velocity >= vMed && d.distribution >= dMed) return "Star"
    if (d.velocity >= vMed) return "Niche / Under-distributed"
    if (d.distribution >= dMed) return "Over-distributed"
    return "Rationalize"
  }

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Nav tabs */}
      <div className="flex items-center border-b border-zinc-800">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "push-pull" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedSkus([]) }}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{brandOptions.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
          <SelectTrigger className="h-7 w-[140px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">{retailers.map(o => <SelectItem key={o} value={o} className="text-zinc-200 text-xs">{o}</SelectItem>)}</SelectContent>
        </Select>
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
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors[skuData.find(d => d.sku === sku)?.brand || ""] || "#888" }} />
            {sku}
            <span className="text-zinc-500 ml-0.5">x</span>
          </button>
        ))}
        {selectedSkus.length > 0 && (
          <button onClick={() => setSelectedSkus([])} className="text-[10px] text-zinc-500 hover:text-zinc-300 underline">Clear all</button>
        )}
      </div>

      {/* Chart + Observations */}
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-zinc-100">Velocity vs Availability (Push-Pull Analysis)</h3>
              <p className="text-[10px] text-zinc-500">Channel Velocity (Units per WD%) vs TT Weighted Distribution (%) -- bubble size = revenue</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mb-3 text-[10px] text-zinc-500 flex-wrap">
              {visibleBrands.map(b => (
                <span key={b} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brandColors[b] }} />
                  {b}
                </span>
              ))}
              <span className="w-px h-3 bg-zinc-700" />
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full border-[1.5px] border-red-500 flex items-center justify-center text-[7px] font-bold text-red-400">1</span>
                Observation marker
              </span>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 400 }}>
              <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="#0a0a0a" rx={2} />

              {/* Grid */}
              {Array.from({ length: 8 }, (_, i) => {
                const v = minV + (i / 7) * (maxV - minV)
                return (
                  <g key={`yg${i}`}>
                    <line x1={pad.left} x2={W - pad.right} y1={toY(v)} y2={toY(v)} stroke="#27272a" strokeWidth="0.5" />
                    <text x={pad.left - 8} y={toY(v) + 3} textAnchor="end" className="fill-zinc-500 text-[10px]">{v.toFixed(1)}</text>
                  </g>
                )
              })}
              {Array.from({ length: 8 }, (_, i) => {
                const d = minD + (i / 7) * (maxD - minD)
                return (
                  <g key={`xg${i}`}>
                    <line x1={toX(d)} x2={toX(d)} y1={pad.top} y2={pad.top + plotH} stroke="#27272a" strokeWidth="0.5" />
                    <text x={toX(d)} y={pad.top + plotH + 18} textAnchor="middle" className="fill-zinc-500 text-[10px]">{Math.round(d)}%</text>
                  </g>
                )
              })}

              <text x={W / 2} y={H - 6} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium">TT Weighted Distribution (%)</text>
              <text x={16} y={H / 2} textAnchor="middle" className="fill-zinc-400 text-[11px] font-medium" transform={`rotate(-90,16,${H / 2})`}>Channel Velocity (Units per WD%)</text>

              {/* Quadrant dividers */}
              <line x1={toX(dMed)} x2={toX(dMed)} y1={pad.top} y2={pad.top + plotH} stroke="#52525b" strokeWidth="1" strokeDasharray="5 4" opacity="0.5" />
              <line x1={pad.left} x2={W - pad.right} y1={toY(vMed)} y2={toY(vMed)} stroke="#52525b" strokeWidth="1" strokeDasharray="5 4" opacity="0.5" />

              {/* Quadrant labels */}
              <text x={pad.left + 10} y={pad.top + 18} className="fill-zinc-600 text-[10px] font-medium">Niche</text>
              <text x={W - pad.right - 10} y={pad.top + 18} textAnchor="end" className="fill-emerald-500/50 text-[10px] font-bold">Stars</text>
              <text x={pad.left + 10} y={pad.top + plotH - 8} className="fill-red-400/50 text-[10px] font-medium">Rationalize</text>
              <text x={W - pad.right - 10} y={pad.top + plotH - 8} textAnchor="end" className="fill-amber-400/50 text-[10px] font-medium">Over-distributed</text>

              {/* Bubbles */}
              {filtered.map((d, i) => {
                const r = getR(d.revM)
                const cx = toX(d.distribution)
                const cy = toY(d.velocity)
                const isHovered = hoveredIdx === i
                return (
                  <g key={d.sku} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} style={{ cursor: "pointer" }}>
                    <circle cx={cx} cy={cy} r={r} fill={brandColors[d.brand] || "#888"} opacity={isHovered ? 0.85 : 0.5} stroke={isHovered ? "#fff" : brandColors[d.brand] || "#888"} strokeWidth={isHovered ? 2 : 1.5} />
                    <text x={cx} y={cy - r - 5} textAnchor="middle" className="fill-zinc-300 text-[9px] font-medium" style={{ pointerEvents: "none" }}>{d.sku.replace(d.brand + " ", "")}</text>
                    {isHovered && (
                      <ChartTooltip x={cx} y={cy - r - 10} sku={d.sku} visible lines={[
                        `Velocity: ${d.velocity} units/WD%  |  Distribution: ${d.distribution}%`,
                        `Revenue: \u20ac${d.revM}M  |  Role: ${d.role}`,
                        `Quadrant: ${getQuadrant(d)}`,
                      ]} />
                    )}
                  </g>
                )
              })}

              {/* Observation markers */}
              {observations.map((obs, i) => {
                const pos = getObsPos(obs)
                if (!pos) return null
                return <ObsMarker key={i} x={pos.x + 18} y={pos.y - 4} num={i + 1} />
              })}

              {/* Revenue callout */}
              <rect x={pad.left + 6} y={pad.top + 6} width={106} height={36} rx={4} fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
              <text x={pad.left + 59} y={pad.top + 22} textAnchor="middle" className="fill-zinc-400 text-[9px]">Total RSV</text>
              <text x={pad.left + 59} y={pad.top + 36} textAnchor="middle" className="fill-zinc-100 text-[12px] font-bold">{"\u20ac"}{filtered.reduce((s, d) => s + d.revM, 0).toFixed(1)}M</text>
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
            <p className="mt-4 text-[9px] text-zinc-600">Hover over bubbles for detailed metrics. Observation markers flag key findings.</p>
          </CardContent>
        </Card>
      </div>

      {/* SKU Performance Detail Table */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">SKU Performance Detail</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["SKU", "Brand", "Tier", "Role", "Velocity", "Distribution", "Revenue", "Price Idx", "Vol Growth", "Quadrant"].map(h => (
                    <th key={h} className="py-2 px-2 text-left text-zinc-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const q = getQuadrant(d)
                  return (
                    <tr key={i} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors">
                      <td className="py-2 px-2 text-zinc-200 font-medium">{d.sku}</td>
                      <td className="py-2 px-2">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors[d.brand] }} />
                          <span className="text-zinc-300">{d.brand}</span>
                        </span>
                      </td>
                      <td className="py-2 px-2 text-zinc-400">{d.tier}</td>
                      <td className="py-2 px-2">
                        <Badge className={cn("text-[8px] py-0 h-4", d.role === "Premium" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : d.role === "Traffic" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" : "bg-zinc-700/40 text-zinc-300 border-zinc-700")}>{d.role}</Badge>
                      </td>
                      <td className="py-2 px-2 font-mono text-zinc-300">{d.velocity.toFixed(1)}</td>
                      <td className="py-2 px-2 font-mono text-zinc-300">{d.distribution}%</td>
                      <td className="py-2 px-2 font-mono text-zinc-200 font-medium">{"\u20ac"}{d.revM.toFixed(1)}M</td>
                      <td className={cn("py-2 px-2 font-mono font-bold", d.priceIndex >= 110 ? "text-red-400" : d.priceIndex >= 105 ? "text-amber-400" : "text-emerald-400")}>{d.priceIndex}</td>
                      <td className={cn("py-2 px-2 font-mono font-bold", d.volGrowth >= 3 ? "text-emerald-400" : d.volGrowth >= 0 ? "text-zinc-300" : "text-red-400")}>{d.volGrowth > 0 ? "+" : ""}{d.volGrowth}%</td>
                      <td className="py-2 px-2">
                        <Badge className={cn("text-[8px] py-0 h-4",
                          q === "Star" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                          q === "Niche / Under-distributed" ? "bg-amber-500/15 text-amber-300 border-amber-500/30" :
                          q === "Over-distributed" ? "bg-blue-500/15 text-blue-300 border-blue-500/30" :
                          "bg-red-500/15 text-red-300 border-red-500/30"
                        )}>{q}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
