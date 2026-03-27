"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronDown, Settings, Zap, ChevronRight, Eye, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { ArtemisLogo } from "@/components/ui/platform-logos"

interface ComparisonViewProps {
  brand: string
  onBack: () => void
  onNavigateToSummary?: () => void
  onNavigateToWaterfall?: () => void
  onNavigateToTrend?: (driver: string) => void
  onNavigateToOptimizer?: () => void
  onNavigateToEdit?: () => void
}

const currencyRates: Record<string, { symbol: string; rate: number; code: string }> = {
  TRY: { symbol: "\u20BA", rate: 1, code: "TRY" },
  USD: { symbol: "$", rate: 0.029, code: "USD" },
  EUR: { symbol: "\u20AC", rate: 0.027, code: "EUR" },
  GBP: { symbol: "\u00A3", rate: 0.023, code: "GBP" },
}

// Hierarchical driver tree
type DriverNode = {
  id: string
  label: string
  investment: number   // in millions (TRY base)
  volumePerInvested: number  // sell-out volume per 100 currency invested
  totalVolume: number  // sell-out volume (MUC)
  color: string
  children?: DriverNode[]
}

const driverTree: DriverNode = {
  id: "consumer-paid",
  label: "Consumer (Paid)",
  investment: 820,
  volumePerInvested: 1.42,
  totalVolume: 4.8,
  color: "#a78bfa",
  children: [
    {
      id: "traditional",
      label: "Traditional Media",
      investment: 530,
      volumePerInvested: 1.28,
      totalVolume: 4.62,
      color: "#a78bfa",
      children: [
        { id: "tv", label: "TV", investment: 380, volumePerInvested: 1.35, totalVolume: 5.1, color: "#818cf8" },
        { id: "ooh", label: "OOH", investment: 90, volumePerInvested: 1.12, totalVolume: 3.8, color: "#6366f1" },
        { id: "print", label: "Print", investment: 40, volumePerInvested: 0.82, totalVolume: 2.4, color: "#4f46e5" },
        { id: "radio", label: "Radio", investment: 20, volumePerInvested: 1.05, totalVolume: 3.2, color: "#4338ca" },
      ],
    },
    {
      id: "digital",
      label: "Digital Media",
      investment: 290,
      volumePerInvested: 1.62,
      totalVolume: 3.98,
      color: "#fbbf24",
      children: [
        {
          id: "social",
          label: "Social",
          investment: 120,
          volumePerInvested: 1.78,
          totalVolume: 4.2,
          color: "#f59e0b",
          children: [
            { id: "meta", label: "Meta", investment: 65, volumePerInvested: 1.92, totalVolume: 4.6, color: "#f97316" },
            { id: "tiktok", label: "TikTok", investment: 35, volumePerInvested: 1.68, totalVolume: 3.9, color: "#ef4444" },
            { id: "twitter", label: "X (Twitter)", investment: 20, volumePerInvested: 1.45, totalVolume: 3.4, color: "#a1a1aa" },
          ],
        },
        {
          id: "search",
          label: "Search",
          investment: 80,
          volumePerInvested: 1.55,
          totalVolume: 3.7,
          color: "#34d399",
          children: [
            { id: "google-search", label: "Google Search", investment: 55, volumePerInvested: 1.62, totalVolume: 3.9, color: "#10b981" },
            { id: "bing", label: "Bing", investment: 25, volumePerInvested: 1.38, totalVolume: 3.2, color: "#059669" },
          ],
        },
        {
          id: "video",
          label: "Video",
          investment: 60,
          volumePerInvested: 1.48,
          totalVolume: 3.5,
          color: "#f472b6",
          children: [
            { id: "youtube", label: "YouTube", investment: 45, volumePerInvested: 1.55, totalVolume: 3.8, color: "#ec4899" },
            { id: "olv", label: "OLV", investment: 15, volumePerInvested: 1.28, totalVolume: 2.8, color: "#db2777" },
          ],
        },
        { id: "display", label: "Display", investment: 30, volumePerInvested: 1.22, totalVolume: 2.9, color: "#8b5cf6" },
      ],
    },
  ],
}

function findNode(node: DriverNode, id: string): DriverNode | null {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, id)
      if (found) return found
    }
  }
  return null
}

function getAncestors(node: DriverNode, targetId: string, path: DriverNode[] = []): DriverNode[] | null {
  if (node.id === targetId) return [...path, node]
  if (node.children) {
    for (const child of node.children) {
      const result = getAncestors(child, targetId, [...path, node])
      if (result) return result
    }
  }
  return null
}

export function FuelightComparisonView({
  brand,
  onBack,
  onNavigateToSummary,
  onNavigateToWaterfall,
  onNavigateToTrend,
  onNavigateToOptimizer,
  onNavigateToEdit,
}: ComparisonViewProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [selectedPeriod, setSelectedPeriod] = useState("dec-2024")
  const [selectedFunding, setSelectedFunding] = useState("system")
  const [currentNodeId, setCurrentNodeId] = useState("consumer-paid")
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null)

  const currencyInfo = currencyRates[selectedCurrency]
  const currentNode = findNode(driverTree, currentNodeId)
  const breadcrumb = getAncestors(driverTree, currentNodeId) || []
  const bubbles = currentNode?.children || (currentNode ? [currentNode] : [])
  const hasChildren = (id: string) => {
    const n = findNode(driverTree, id)
    return n?.children && n.children.length > 0
  }

  // Chart calculations
  const chartData = useMemo(() => {
    if (!bubbles.length) return { minX: 0, maxX: 2, minY: 0, maxY: 6, maxR: 100 }
    const xs = bubbles.map(b => b.volumePerInvested)
    const ys = bubbles.map(b => b.totalVolume)
    const maxR = Math.max(...bubbles.map(b => b.investment))
    const padX = (Math.max(...xs) - Math.min(...xs)) * 0.25 || 0.3
    const padY = (Math.max(...ys) - Math.min(...ys)) * 0.25 || 0.5
    return {
      minX: Math.max(0, Math.min(...xs) - padX),
      maxX: Math.max(...xs) + padX,
      minY: Math.max(0, Math.min(...ys) - padY),
      maxY: Math.max(...ys) + padY,
      maxR,
    }
  }, [bubbles])

  // COMPACT chart for single-page viewing
  const chartW = 420
  const chartH = 160
  const pad = { top: 25, right: 40, bottom: 40, left: 55 }
  const plotW = chartW - pad.left - pad.right
  const plotH = chartH - pad.top - pad.bottom

  const scaleX = (v: number) => pad.left + ((v - chartData.minX) / (chartData.maxX - chartData.minX)) * plotW
  const scaleY = (v: number) => pad.top + plotH - ((v - chartData.minY) / (chartData.maxY - chartData.minY)) * plotH
  // COMPACT bubble sizing for single-page view
  const scaleR = (inv: number) => 8 + (inv / chartData.maxR) * 18

  // Y-axis ticks
  const yRange = chartData.maxY - chartData.minY
  const yStep = yRange <= 2 ? 0.25 : yRange <= 5 ? 0.5 : 1
  const yTicks: number[] = []
  for (let v = Math.ceil(chartData.minY / yStep) * yStep; v <= chartData.maxY; v += yStep) {
    yTicks.push(Math.round(v * 100) / 100)
  }

  // X-axis ticks
  const xRange = chartData.maxX - chartData.minX
  const xStep = xRange <= 1 ? 0.1 : 0.2
  const xTicks: number[] = []
  for (let v = Math.ceil(chartData.minX / xStep) * xStep; v <= chartData.maxX; v += xStep) {
    xTicks.push(Math.round(v * 100) / 100)
  }

  function formatCurrency(value: number): string {
    const converted = value * currencyInfo.rate
    if (converted >= 1000) return `${currencyInfo.symbol}${(converted / 1000).toFixed(1)}B`
    return `${currencyInfo.symbol}${converted.toFixed(0)}M`
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <ArtemisLogo size="md" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">{brand}</h1>
              <p className="text-xs text-zinc-500">Comparison View</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-1">GB</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
                <span>{currencyInfo.symbol} - {currencyInfo.code}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              {Object.entries(currencyRates).map(([code, { symbol }]) => (
                <DropdownMenuItem key={code} onClick={() => setSelectedCurrency(code)} className={cn("text-zinc-300 cursor-pointer", selectedCurrency === code && "bg-emerald-500/10 text-emerald-400")}>
                  {symbol} - {code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-1">360</Badge>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="dec-2024" className="text-zinc-100 text-xs">Dec 29, 2024 - Jul 6, 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFunding} onValueChange={setSelectedFunding}>
            <SelectTrigger className="w-[140px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="system" className="text-zinc-100 text-xs">System Funding</SelectItem>
              <SelectItem value="tccc" className="text-zinc-100 text-xs">TCCC Funding</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-3 py-1">Product A Zero</Badge>
          <div className="flex items-center gap-1 ml-2">
            <button onClick={() => onNavigateToSummary?.()} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
              <Eye className="h-4 w-4" /> View
            </button>
            <button onClick={onNavigateToEdit} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button onClick={onNavigateToOptimizer} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
              <Zap className="h-4 w-4" /> Optimize
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button onClick={() => onNavigateToSummary?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Summary</button>
        <button onClick={() => onNavigateToWaterfall?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Waterfall</button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-emerald-500">Comparison</button>
        <button onClick={() => onNavigateToTrend?.(currentNodeId)} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Trend</button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Details</button>
      </div>

      {/* Title and Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-semibold text-zinc-100">{currentNode?.label || "Consumer (Paid)"}</h2>
            {breadcrumb.length > 1 && (
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs">1 Brand</Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <button onClick={() => setCurrentNodeId("consumer-paid")} className="hover:text-zinc-300 transition-colors">All Drivers</button>
            {breadcrumb.map((node, i) => (
              <span key={node.id} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                <button
                  onClick={() => setCurrentNodeId(node.id)}
                  className={cn(
                    "hover:text-zinc-300 transition-colors",
                    i === breadcrumb.length - 1 && "text-zinc-300 font-medium"
                  )}
                >
                  {node.label}
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500">Size of the bubble indicates investment</span>
          <span className="text-xs text-zinc-500">Figures in millions</span>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent text-xs h-8">
            <Settings className="h-3.5 w-3.5 mr-1.5" />Chart Settings
          </Button>
        </div>
      </div>

      {/* Bubble Chart */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} className="overflow-visible">
            {/* Grid lines */}
            {yTicks.map(v => (
              <g key={`y-${v}`}>
                <line x1={pad.left} y1={scaleY(v)} x2={chartW - pad.right} y2={scaleY(v)} stroke="#27272a" strokeWidth={1} />
                <text x={pad.left - 12} y={scaleY(v) + 4} textAnchor="end" className="fill-zinc-500 text-[11px]">{v.toFixed(v % 1 === 0 ? 0 : 2)}</text>
              </g>
            ))}
            {xTicks.map(v => (
              <g key={`x-${v}`}>
                <line x1={scaleX(v)} y1={pad.top} x2={scaleX(v)} y2={chartH - pad.bottom} stroke="#27272a" strokeWidth={1} />
                <text x={scaleX(v)} y={chartH - pad.bottom + 20} textAnchor="middle" className="fill-zinc-500 text-[11px]">{v.toFixed(1)}</text>
              </g>
            ))}

            {/* Axis labels */}
            <text x={chartW / 2} y={chartH - 8} textAnchor="middle" className="fill-zinc-400 text-[12px]">
              Sell-out Volume per 100{currencyInfo.code} Invested
            </text>
            <text x={16} y={chartH / 2} textAnchor="middle" className="fill-zinc-400 text-[12px]" transform={`rotate(-90, 16, ${chartH / 2})`}>
              Sell-out Volume (MUC)
            </text>

            {/* Bubbles */}
            {bubbles.map(b => {
              const cx = scaleX(b.volumePerInvested)
              const cy = scaleY(b.totalVolume)
              const r = scaleR(b.investment)
              const isHovered = hoveredBubble === b.id
              const clickable = hasChildren(b.id)

              return (
                <g
                  key={b.id}
                  onMouseEnter={() => setHoveredBubble(b.id)}
                  onMouseLeave={() => setHoveredBubble(null)}
                  onClick={() => clickable && setCurrentNodeId(b.id)}
                  className={cn(clickable && "cursor-pointer")}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={b.color}
                    fillOpacity={isHovered ? 0.85 : 0.65}
                    stroke={isHovered ? "#fff" : b.color}
                    strokeWidth={isHovered ? 2 : 0}
                    className="transition-all duration-200"
                  />
                  {/* Label */}
                  <text x={cx} y={cy - r - 8} textAnchor="middle" className="fill-zinc-200 text-[12px] font-medium pointer-events-none">
                    {b.label}
                  </text>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <g>
                      <rect x={cx + r + 8} y={cy - 52} width={200} height={90} rx={8} fill="#18181b" stroke="#3f3f46" strokeWidth={1} />
                      <text x={cx + r + 18} y={cy - 32} className="fill-zinc-200 text-[12px] font-semibold">{b.label}</text>
                      <text x={cx + r + 18} y={cy - 14} className="fill-zinc-400 text-[11px]">Investment: {formatCurrency(b.investment)}</text>
                      <text x={cx + r + 18} y={cy + 2} className="fill-zinc-400 text-[11px]">Volume/100{currencyInfo.code}: {b.volumePerInvested.toFixed(2)}</text>
                      <text x={cx + r + 18} y={cy + 18} className="fill-zinc-400 text-[11px]">Total Volume: {b.totalVolume.toFixed(2)} MUC</text>
                      {clickable && (
                        <text x={cx + r + 18} y={cy + 34} className="fill-emerald-400 text-[10px]">Click to drill down</text>
                      )}
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </CardContent>
      </Card>

      {/* Hint */}
      <div className="text-center">
        <p className="text-sm text-zinc-500">
          {currentNode?.children
            ? "Click a bubble to drill down into sub-drivers. When ready, switch to the Trend tab to see time-series data."
            : "You are at the deepest level. Navigate back using the breadcrumb or switch to the Trend tab."}
        </p>
      </div>
    </div>
  )
}
