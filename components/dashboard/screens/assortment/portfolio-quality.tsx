"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MixScreen } from "../mix/mix-performance"

interface Props { onNavigate?: (screen: MixScreen) => void }

const tabs: { id: MixScreen; label: string }[] = [
  { id: "market-opportunities", label: "Overview" },
  { id: "portfolio-quality", label: "Portfolio Quality Analysis" },
  { id: "assortment-share", label: "Assortment Share" },
  { id: "simulate-forecast", label: "Simulate & Optimise" },
]

// Slicers
const countryOptions = [
  { value: "all", label: "All Countries" },
  { value: "italy", label: "Italy" },
  { value: "france", label: "France" },
  { value: "spain", label: "Spain" },
  { value: "germany", label: "Germany" },
  { value: "uk", label: "UK" },
]

const channelOptions = [
  { value: "all", label: "All Channels" },
  { value: "hypermarkets", label: "Hypermarkets" },
  { value: "supermarkets", label: "Supermarkets" },
  { value: "convenience", label: "Convenience" },
  { value: "discounters", label: "Discounters" },
  { value: "horeca", label: "HoReCa" },
]

const customerOptions = [
  { value: "all", label: "All Customers" },
  { value: "esselunga", label: "Esselunga" },
  { value: "conad", label: "Conad" },
  { value: "coop", label: "Coop Italia" },
  { value: "carrefour", label: "Carrefour" },
  { value: "eurospin", label: "Eurospin" },
]

// SKU data for velocity vs availability
interface SKUData {
  sku: string
  brand: string
  packSize: string
  availability: number // % of stores stocking
  velocity: number // units/store/week
  revenue: number // millions EUR
  margin: number // GP %
  color: string
}

// Seeded random for consistent data
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

function generateSKUData(country: string, channel: string, customer: string): SKUData[] {
  const seed = (country.charCodeAt(0) || 65) * 1000 + (channel.charCodeAt(0) || 65) * 10 + (customer.charCodeAt(0) || 65)
  const rng = seededRandom(seed)
  
  const skus = [
    { sku: "Brand A 330ml", brand: "Brand A", packSize: "330ml", baseAvail: 95, baseVel: 42, baseRev: 8.2, margin: 38 },
    { sku: "Brand A 500ml", brand: "Brand A", packSize: "500ml", baseAvail: 92, baseVel: 35, baseRev: 6.8, margin: 36 },
    { sku: "Brand A 1.5L", brand: "Brand A", packSize: "1.5L", baseAvail: 88, baseVel: 28, baseRev: 5.4, margin: 32 },
    { sku: "Brand A 2L", brand: "Brand A", packSize: "2L", baseAvail: 82, baseVel: 22, baseRev: 4.1, margin: 30 },
    { sku: "Brand B 330ml", brand: "Brand B", packSize: "330ml", baseAvail: 90, baseVel: 32, baseRev: 5.8, margin: 40 },
    { sku: "Brand B 500ml", brand: "Brand B", packSize: "500ml", baseAvail: 85, baseVel: 26, baseRev: 4.5, margin: 38 },
    { sku: "Brand B 1.5L", brand: "Brand B", packSize: "1.5L", baseAvail: 78, baseVel: 18, baseRev: 3.2, margin: 35 },
    { sku: "Brand B 330ml", brand: "Brand B", packSize: "330ml", baseAvail: 75, baseVel: 20, baseRev: 3.0, margin: 42 },
    { sku: "Brand B 500ml", brand: "Brand B", packSize: "500ml", baseAvail: 70, baseVel: 15, baseRev: 2.4, margin: 40 },
    { sku: "Brand C 330ml", brand: "Brand C", packSize: "330ml", baseAvail: 85, baseVel: 28, baseRev: 4.8, margin: 36 },
    { sku: "Brand C 500ml", brand: "Brand C", packSize: "500ml", baseAvail: 80, baseVel: 22, baseRev: 3.8, margin: 34 },
    { sku: "Brand C 1.5L", brand: "Brand C", packSize: "1.5L", baseAvail: 72, baseVel: 16, baseRev: 2.6, margin: 30 },
    { sku: "Brand D 330ml", brand: "Brand D", packSize: "330ml", baseAvail: 82, baseVel: 24, baseRev: 4.2, margin: 35 },
    { sku: "Brand D 500ml", brand: "Brand D", packSize: "500ml", baseAvail: 75, baseVel: 18, baseRev: 3.1, margin: 33 },
    { sku: "Brand D 1.5L", brand: "Brand D", packSize: "1.5L", baseAvail: 65, baseVel: 12, baseRev: 2.0, margin: 28 },
    { sku: "Brand A 6x330ml", brand: "Brand A", packSize: "6x330ml", baseAvail: 60, baseVel: 8, baseRev: 1.8, margin: 28 },
    { sku: "Brand B 6x330ml", brand: "Brand B", packSize: "6x330ml", baseAvail: 55, baseVel: 6, baseRev: 1.4, margin: 30 },
    { sku: "Brand E 200ml", brand: "Brand E", packSize: "200ml", baseAvail: 45, baseVel: 10, baseRev: 1.2, margin: 45 },
  ]
  
  const brandColors: Record<string, string> = {
    "Brand A": "#ef4444",
    "Brand B": "#000000",
    "Brand B": "#dc2626",
    "Brand C": "#f97316",
    "Brand D": "#22c55e",
    "Brand E": "#eab308",
  }
  
  // Apply multipliers based on slicers
  const countryMult = country === "all" ? 1 : 0.7 + rng() * 0.6
  const channelMult = channel === "all" ? 1 : 0.6 + rng() * 0.8
  const customerMult = customer === "all" ? 1 : 0.5 + rng() * 1.0
  
  return skus.map(s => ({
    sku: s.sku,
    brand: s.brand,
    packSize: s.packSize,
    availability: Math.min(99, Math.round(s.baseAvail * countryMult * (0.9 + rng() * 0.2))),
    velocity: Math.round(s.baseVel * channelMult * customerMult * (0.8 + rng() * 0.4) * 10) / 10,
    revenue: Math.round(s.baseRev * countryMult * channelMult * customerMult * (0.7 + rng() * 0.6) * 10) / 10,
    margin: s.margin + Math.round((rng() - 0.5) * 6),
    color: brandColors[s.brand] || "#6b7280",
  }))
}

// Quadrant classification
function getQuadrant(avail: number, vel: number, avgAvail: number, avgVel: number): string {
  if (avail >= avgAvail && vel >= avgVel) return "stars" // High avail, high velocity
  if (avail >= avgAvail && vel < avgVel) return "sleepers" // High avail, low velocity
  if (avail < avgAvail && vel >= avgVel) return "hidden-gems" // Low avail, high velocity
  return "underperformers" // Low avail, low velocity
}

export function PortfolioQuality({ onNavigate }: Props) {
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState("all")
  const [hoveredSku, setHoveredSku] = useState<string | null>(null)

  const skuData = useMemo(() => 
    generateSKUData(selectedCountry, selectedChannel, selectedCustomer),
    [selectedCountry, selectedChannel, selectedCustomer]
  )

  const avgAvailability = useMemo(() => 
    Math.round(skuData.reduce((s, d) => s + d.availability, 0) / skuData.length),
    [skuData]
  )
  
  const avgVelocity = useMemo(() => 
    Math.round(skuData.reduce((s, d) => s + d.velocity, 0) / skuData.length * 10) / 10,
    [skuData]
  )

  // Quadrant counts
  const quadrantCounts = useMemo(() => {
    const counts = { stars: 0, sleepers: 0, "hidden-gems": 0, underperformers: 0 }
    skuData.forEach(d => {
      const q = getQuadrant(d.availability, d.velocity, avgAvailability, avgVelocity)
      counts[q as keyof typeof counts]++
    })
    return counts
  }, [skuData, avgAvailability, avgVelocity])

  // SVG dimensions
  const w = 700, h = 450
  const pad = { top: 30, right: 30, bottom: 50, left: 60 }
  const plotW = w - pad.left - pad.right
  const plotH = h - pad.top - pad.bottom
  
  const maxAvail = 100
  const minAvail = 30
  const maxVel = Math.max(...skuData.map(d => d.velocity)) * 1.1
  const minVel = 0

  const toX = (avail: number) => pad.left + ((avail - minAvail) / (maxAvail - minAvail)) * plotW
  const toY = (vel: number) => pad.top + plotH - ((vel - minVel) / (maxVel - minVel)) * plotH

  // AI Insights
  const hiddenGems = skuData.filter(d => getQuadrant(d.availability, d.velocity, avgAvailability, avgVelocity) === "hidden-gems")
  const sleepers = skuData.filter(d => getQuadrant(d.availability, d.velocity, avgAvailability, avgVelocity) === "sleepers")
  const underperformers = skuData.filter(d => getQuadrant(d.availability, d.velocity, avgAvailability, avgVelocity) === "underperformers")

  // AI insights aligned with the storyline
  const aiInsights = [
    { 
      icon: TrendingDown, 
      color: "text-red-400", 
      bg: "bg-red-500/10",
      text: `8 Underperformers identified in the bottom-left quadrant, with Brand B 1.5L and Brand B 500ml flagged as delist candidates. These SKUs have low velocity and limited distribution.`,
      highlight: true
    },
    { 
      icon: AlertTriangle, 
      color: "text-amber-400", 
      bg: "bg-amber-500/10",
      text: `1 Sleeper detected: Brand B 330ml with high availability but low velocity, dragging down the mix index. Consider promotional activation or range review.`,
      highlight: true
    },
    { 
      icon: Zap, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      text: `0 Hidden Gems identified - the opportunity is about pruning the tail, not pushing new SKUs. Navigate to Assortment Share to quantify the shelf impact.`,
      highlight: false
    },
    { 
      icon: TrendingUp, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10",
      text: `Portfolio average: ${avgAvailability}% availability, ${avgVelocity} units/store/week. ${quadrantCounts.stars} SKUs are Stars (top-right quadrant).`
    },
  ]

  return (
    <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Nav */}
      <div className="flex items-center border-b border-zinc-800 -mx-6 px-6 -mt-2 mb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => onNavigate?.(t.id)} className={cn("px-5 py-2.5 text-xs font-medium transition-colors", t.id === "portfolio-quality" ? "text-zinc-100 border-b-2 border-red-500" : "text-zinc-500 hover:text-zinc-300")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Header and Filters */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-100">Portfolio Quality Analysis</h2>
          <p className="text-[10px] text-zinc-500">Velocity vs Availability curve -- identify distribution opportunities and portfolio efficiency</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500 font-medium">Country</span>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="h-7 w-[130px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {countryOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500 font-medium">Channel</span>
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="h-7 w-[130px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {channelOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-zinc-500 font-medium">Customer</span>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="h-7 w-[130px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {customerOptions.map(o => <SelectItem key={o.value} value={o.value} className="text-zinc-200 text-xs">{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Stars</p>
            <p className="text-2xl font-bold text-emerald-400">{quadrantCounts.stars}</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">High velocity + availability</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Hidden Gems</p>
            <p className="text-2xl font-bold text-blue-400">{quadrantCounts["hidden-gems"]}</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">High velocity, low distribution</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Sleepers</p>
            <p className="text-2xl font-bold text-amber-400">{quadrantCounts.sleepers}</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">High distribution, low velocity</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-500 mb-1">Underperformers</p>
            <p className="text-2xl font-bold text-red-400">{quadrantCounts.underperformers}</p>
            <p className="text-[9px] text-zinc-500 mt-0.5">Review for optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Velocity vs Availability chart */}
        <Card className="col-span-2 bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">Velocity vs Availability</h3>
            <svg width={w} height={h} className="overflow-visible">
              {/* Quadrant backgrounds */}
              <rect x={toX(avgAvailability)} y={pad.top} width={toX(maxAvail) - toX(avgAvailability)} height={toY(avgVelocity) - pad.top} fill="#22c55e" fillOpacity={0.05} />
              <rect x={pad.left} y={pad.top} width={toX(avgAvailability) - pad.left} height={toY(avgVelocity) - pad.top} fill="#3b82f6" fillOpacity={0.05} />
              <rect x={toX(avgAvailability)} y={toY(avgVelocity)} width={toX(maxAvail) - toX(avgAvailability)} height={pad.top + plotH - toY(avgVelocity)} fill="#f59e0b" fillOpacity={0.05} />
              <rect x={pad.left} y={toY(avgVelocity)} width={toX(avgAvailability) - pad.left} height={pad.top + plotH - toY(avgVelocity)} fill="#ef4444" fillOpacity={0.05} />
              
              {/* Quadrant labels */}
              <text x={toX((avgAvailability + maxAvail) / 2)} y={pad.top + 15} textAnchor="middle" className="text-[9px] fill-emerald-400/60">Stars</text>
              <text x={toX((minAvail + avgAvailability) / 2)} y={pad.top + 15} textAnchor="middle" className="text-[9px] fill-blue-400/60">Hidden Gems</text>
              <text x={toX((avgAvailability + maxAvail) / 2)} y={pad.top + plotH - 10} textAnchor="middle" className="text-[9px] fill-amber-400/60">Sleepers</text>
              <text x={toX((minAvail + avgAvailability) / 2)} y={pad.top + plotH - 10} textAnchor="middle" className="text-[9px] fill-red-400/60">Underperformers</text>
              
              {/* Grid lines */}
              {[40, 50, 60, 70, 80, 90, 100].map(v => (
                <g key={v}>
                  <line x1={toX(v)} y1={pad.top} x2={toX(v)} y2={pad.top + plotH} stroke="#27272a" strokeWidth={1} />
                  <text x={toX(v)} y={pad.top + plotH + 15} textAnchor="middle" className="text-[9px] fill-zinc-500">{v}%</text>
                </g>
              ))}
              {[0, 10, 20, 30, 40, 50].filter(v => v <= maxVel).map(v => (
                <g key={v}>
                  <line x1={pad.left} y1={toY(v)} x2={pad.left + plotW} y2={toY(v)} stroke="#27272a" strokeWidth={1} />
                  <text x={pad.left - 8} y={toY(v) + 3} textAnchor="end" className="text-[9px] fill-zinc-500">{v}</text>
                </g>
              ))}
              
              {/* Average lines */}
              <line x1={toX(avgAvailability)} y1={pad.top} x2={toX(avgAvailability)} y2={pad.top + plotH} stroke="#71717a" strokeWidth={1} strokeDasharray="4 2" />
              <line x1={pad.left} y1={toY(avgVelocity)} x2={pad.left + plotW} y2={toY(avgVelocity)} stroke="#71717a" strokeWidth={1} strokeDasharray="4 2" />
              
              {/* Axis labels */}
              <text x={pad.left + plotW / 2} y={h - 8} textAnchor="middle" className="text-[10px] fill-zinc-400">Availability (%)</text>
              <text x={12} y={pad.top + plotH / 2} textAnchor="middle" transform={`rotate(-90, 12, ${pad.top + plotH / 2})`} className="text-[10px] fill-zinc-400">Velocity (units/store/week)</text>
              
              {/* Data points */}
              {skuData.map((d, i) => {
                const cx = toX(d.availability)
                const cy = toY(d.velocity)
                const r = Math.max(6, Math.min(18, Math.sqrt(d.revenue) * 5))
                const isHovered = hoveredSku === d.sku
                
                return (
                  <g key={d.sku}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={d.color}
                      fillOpacity={isHovered ? 0.9 : 0.6}
                      stroke={isHovered ? "#fff" : d.color}
                      strokeWidth={isHovered ? 2 : 1}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredSku(d.sku)}
                      onMouseLeave={() => setHoveredSku(null)}
                    />
                    {isHovered && (
                      <g>
                        <rect x={cx + 12} y={cy - 45} width={150} height={75} rx={4} fill="#18181b" stroke="#3f3f46" />
                        <text x={cx + 18} y={cy - 28} className="text-[10px] fill-zinc-100 font-semibold">{d.sku}</text>
                        <text x={cx + 18} y={cy - 14} className="text-[9px] fill-zinc-400">Availability: {d.availability}%</text>
                        <text x={cx + 18} y={cy} className="text-[9px] fill-zinc-400">Velocity: {d.velocity} units/wk</text>
                        <text x={cx + 18} y={cy + 14} className="text-[9px] fill-zinc-400">Revenue: €{d.revenue}M</text>
                        <text x={cx + 18} y={cy + 28} className="text-[9px] fill-zinc-400">Margin: {d.margin}%</text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-[9px] text-zinc-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" />Brand A</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-black border border-zinc-600" />Brand B</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" />Brand C</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" />Brand D</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" />Brand E</span>
              <span className="w-px h-3 bg-zinc-700" />
              <span>Bubble size = Revenue</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-red-400" />
              <h3 className="text-sm font-semibold text-zinc-100">AI Insights</h3>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-[9px]">4 insights</Badge>
            </div>
            <div className="space-y-3">
              {aiInsights.map((ins, i) => {
                const Icon = ins.icon
                return (
                  <div key={i} className={cn("p-3 rounded-lg border", ins.bg, 'highlight' in ins && ins.highlight ? "border-amber-500/30 ring-1 ring-amber-500/20" : "border-zinc-800/50")}>
                    <div className="flex items-start gap-2">
                      <Icon className={cn("h-3.5 w-3.5 mt-0.5 flex-shrink-0", ins.color)} />
                      <p className="text-[10px] text-zinc-300 leading-relaxed">{ins.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Action Button */}
            <button 
              onClick={() => onNavigate?.("assortment-share")}
              className="mt-4 w-full px-4 py-2.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2"
            >
              Quantify Shelf Impact in Assortment Share
              <TrendingUp className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
