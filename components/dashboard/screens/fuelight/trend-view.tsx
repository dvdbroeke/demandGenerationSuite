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
import { FuelightLogo } from "@/components/ui/platform-logos"

interface TrendViewProps {
  brand: string
  initialDriver?: string
  onBack: () => void
  onNavigateToSummary?: () => void
  onNavigateToWaterfall?: () => void
  onNavigateToComparison?: () => void
  onNavigateToOptimizer?: () => void
  onNavigateToEdit?: () => void
}

const currencyRates: Record<string, { symbol: string; rate: number; code: string }> = {
  TRY: { symbol: "\u20BA", rate: 1, code: "TRY" },
  USD: { symbol: "$", rate: 0.029, code: "USD" },
  EUR: { symbol: "\u20AC", rate: 0.027, code: "EUR" },
  GBP: { symbol: "\u00A3", rate: 0.023, code: "GBP" },
}

// Driver hierarchy with input metric names and trend data
type DriverTrend = {
  id: string
  label: string
  parentPath: string[]
  inputMetric: string
  inputUnit: string
  contributionMetric: string
  contributionUnit: string
  monthly: { month: string; input: number; contribution: number }[]
  weekly?: { week: string; input: number; contribution: number }[]
  badges: { label: string; variant: "brand" | "channel" }[]
  color: string
}

const driverTrends: DriverTrend[] = [
  {
    id: "consumer-paid",
    label: "Consumer (Paid)",
    parentPath: ["All Drivers"],
    inputMetric: "Total Consumer Paid Spend",
    inputUnit: "TRY M",
    contributionMetric: "Driver Contribution - Sell-Out Volume",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 110, contribution: 0.06 },
      { month: "February 2025", input: 125, contribution: 0.068 },
      { month: "March 2025", input: 160, contribution: 0.095 },
      { month: "April 2025", input: 140, contribution: 0.078 },
      { month: "May 2025", input: 175, contribution: 0.11 },
      { month: "June 2025", input: 165, contribution: 0.105 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }],
    color: "#a78bfa",
  },
  {
    id: "traditional",
    label: "Traditional Media",
    parentPath: ["All Drivers", "Consumer (Paid)"],
    inputMetric: "Traditional Media Spend",
    inputUnit: "TRY M",
    contributionMetric: "Driver Contribution - Sell-Out Volume",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 75, contribution: 0.042 },
      { month: "February 2025", input: 82, contribution: 0.048 },
      { month: "March 2025", input: 105, contribution: 0.065 },
      { month: "April 2025", input: 95, contribution: 0.055 },
      { month: "May 2025", input: 110, contribution: 0.072 },
      { month: "June 2025", input: 98, contribution: 0.062 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }],
    color: "#a78bfa",
  },
  {
    id: "digital",
    label: "Digital Media",
    parentPath: ["All Drivers", "Consumer (Paid)"],
    inputMetric: "Digital Media Spend",
    inputUnit: "TRY M",
    contributionMetric: "Driver Contribution - Sell-Out Volume",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 35, contribution: 0.022 },
      { month: "February 2025", input: 43, contribution: 0.028 },
      { month: "March 2025", input: 55, contribution: 0.038 },
      { month: "April 2025", input: 45, contribution: 0.03 },
      { month: "May 2025", input: 65, contribution: 0.045 },
      { month: "June 2025", input: 62, contribution: 0.042 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }],
    color: "#fbbf24",
  },
  {
    id: "social",
    label: "Social",
    parentPath: ["All Drivers", "Consumer (Paid)", "Digital Media"],
    inputMetric: "Social Spend",
    inputUnit: "TRY M",
    contributionMetric: "Driver Contribution - Sell-Out Volume",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 14, contribution: 0.008 },
      { month: "February 2025", input: 18, contribution: 0.012 },
      { month: "March 2025", input: 24, contribution: 0.018 },
      { month: "April 2025", input: 19, contribution: 0.013 },
      { month: "May 2025", input: 28, contribution: 0.022 },
      { month: "June 2025", input: 26, contribution: 0.02 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }, { label: "1 Social", variant: "channel" }],
    color: "#f59e0b",
  },
  {
    id: "meta",
    label: "Meta",
    parentPath: ["All Drivers", "Consumer (Paid)", "Digital Media", "Social"],
    inputMetric: "Driver Input - Meta (Impression M)",
    inputUnit: "Impression M",
    contributionMetric: "Driver Contribution - Sell-Out Volume (MUC)",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 200, contribution: 0.05 },
      { month: "February 2025", input: 280, contribution: 0.065 },
      { month: "March 2025", input: 450, contribution: 0.1 },
      { month: "April 2025", input: 350, contribution: 0.078 },
      { month: "May 2025", input: 720, contribution: 0.16 },
      { month: "June 2025", input: 650, contribution: 0.14 },
    ],
    weekly: [
      { week: "W1 Jan", input: 42, contribution: 0.01 },
      { week: "W2 Jan", input: 48, contribution: 0.012 },
      { week: "W3 Jan", input: 55, contribution: 0.014 },
      { week: "W4 Jan", input: 55, contribution: 0.014 },
      { week: "W1 Feb", input: 62, contribution: 0.015 },
      { week: "W2 Feb", input: 68, contribution: 0.016 },
      { week: "W3 Feb", input: 72, contribution: 0.017 },
      { week: "W4 Feb", input: 78, contribution: 0.017 },
      { week: "W1 Mar", input: 95, contribution: 0.02 },
      { week: "W2 Mar", input: 110, contribution: 0.025 },
      { week: "W3 Mar", input: 120, contribution: 0.027 },
      { week: "W4 Mar", input: 125, contribution: 0.028 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }, { label: "1 Social", variant: "channel" }],
    color: "#f97316",
  },
  {
    id: "tiktok",
    label: "TikTok",
    parentPath: ["All Drivers", "Consumer (Paid)", "Digital Media", "Social"],
    inputMetric: "Driver Input - TikTok (Impression M)",
    inputUnit: "Impression M",
    contributionMetric: "Driver Contribution - Sell-Out Volume (MUC)",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 120, contribution: 0.03 },
      { month: "February 2025", input: 160, contribution: 0.04 },
      { month: "March 2025", input: 280, contribution: 0.065 },
      { month: "April 2025", input: 220, contribution: 0.05 },
      { month: "May 2025", input: 340, contribution: 0.08 },
      { month: "June 2025", input: 310, contribution: 0.072 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }, { label: "1 Social", variant: "channel" }],
    color: "#ef4444",
  },
  {
    id: "tv",
    label: "TV",
    parentPath: ["All Drivers", "Consumer (Paid)", "Traditional Media"],
    inputMetric: "Driver Input - TV (GRP)",
    inputUnit: "GRP",
    contributionMetric: "Driver Contribution - Sell-Out Volume (MUC)",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 520, contribution: 0.032 },
      { month: "February 2025", input: 580, contribution: 0.038 },
      { month: "March 2025", input: 750, contribution: 0.052 },
      { month: "April 2025", input: 680, contribution: 0.045 },
      { month: "May 2025", input: 800, contribution: 0.058 },
      { month: "June 2025", input: 720, contribution: 0.05 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }],
    color: "#818cf8",
  },
  {
    id: "search",
    label: "Search",
    parentPath: ["All Drivers", "Consumer (Paid)", "Digital Media"],
    inputMetric: "Search Spend",
    inputUnit: "TRY M",
    contributionMetric: "Driver Contribution - Sell-Out Volume",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 10, contribution: 0.006 },
      { month: "February 2025", input: 12, contribution: 0.008 },
      { month: "March 2025", input: 16, contribution: 0.012 },
      { month: "April 2025", input: 14, contribution: 0.01 },
      { month: "May 2025", input: 18, contribution: 0.014 },
      { month: "June 2025", input: 17, contribution: 0.013 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }],
    color: "#34d399",
  },
  {
    id: "youtube",
    label: "YouTube",
    parentPath: ["All Drivers", "Consumer (Paid)", "Digital Media", "Video"],
    inputMetric: "Driver Input - YouTube (View M)",
    inputUnit: "View M",
    contributionMetric: "Driver Contribution - Sell-Out Volume (MUC)",
    contributionUnit: "MUC",
    monthly: [
      { month: "January 2025", input: 85, contribution: 0.015 },
      { month: "February 2025", input: 110, contribution: 0.02 },
      { month: "March 2025", input: 180, contribution: 0.035 },
      { month: "April 2025", input: 140, contribution: 0.025 },
      { month: "May 2025", input: 210, contribution: 0.042 },
      { month: "June 2025", input: 190, contribution: 0.038 },
    ],
    badges: [{ label: "1 Brand", variant: "brand" }, { label: "1 Video", variant: "channel" }],
    color: "#ec4899",
  },
]

const allDriverIds = driverTrends.map(d => d.id)

export function FuelightTrendView({
  brand,
  initialDriver = "meta",
  onBack,
  onNavigateToSummary,
  onNavigateToWaterfall,
  onNavigateToComparison,
  onNavigateToOptimizer,
  onNavigateToEdit,
}: TrendViewProps) {
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [selectedPeriod, setSelectedPeriod] = useState("dec-2024")
  const [selectedFunding, setSelectedFunding] = useState("system")
  const [currentDriverId, setCurrentDriverId] = useState(initialDriver)
  const [timeframe, setTimeframe] = useState<"month" | "week">("month")
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const currencyInfo = currencyRates[selectedCurrency]
  const driver = driverTrends.find(d => d.id === currentDriverId) || driverTrends[0]
  const data = timeframe === "week" && driver.weekly ? driver.weekly : driver.monthly
  const xLabels = data.map(d => "month" in d ? (d as { month: string }).month : (d as { week: string }).week)
  const inputValues = data.map(d => d.input)
  const contribValues = data.map(d => d.contribution)

  // Chart dimensions - COMPACT for single-page viewing
  const chartW = 440
  const chartH = 150
  const pad = { top: 20, right: 55, bottom: 45, left: 55 }
  const plotW = chartW - pad.left - pad.right
  const plotH = chartH - pad.top - pad.bottom

  // Scales
  const inputMax = Math.max(...inputValues) * 1.15
  const contribMax = Math.max(...contribValues) * 1.15
  const scaleInputY = (v: number) => pad.top + plotH - (v / inputMax) * plotH
  const scaleContribY = (v: number) => pad.top + plotH - (v / contribMax) * plotH
  const scaleX = (i: number) => pad.left + (i / (data.length - 1)) * plotW

  // Input Y ticks
  const inputStep = inputMax <= 100 ? 20 : inputMax <= 500 ? 100 : 200
  const inputTicks: number[] = []
  for (let v = 0; v <= inputMax; v += inputStep) inputTicks.push(Math.round(v))

  // Contribution Y ticks
  const contribStep = contribMax <= 0.05 ? 0.01 : contribMax <= 0.2 ? 0.02 : 0.05
  const contribTicks: number[] = []
  for (let v = 0; v <= contribMax; v += contribStep) contribTicks.push(Math.round(v * 1000) / 1000)

  // Build polyline points
  const inputLine = data.map((_, i) => `${scaleX(i)},${scaleInputY(inputValues[i])}`).join(" ")
  const contribLine = data.map((_, i) => `${scaleX(i)},${scaleContribY(contribValues[i])}`).join(" ")

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
              <FuelightLogo size="md" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">{brand}</h1>
              <p className="text-xs text-zinc-500">Trend View</p>
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
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-3 py-1">Coca-Cola Zero</Badge>
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
        <button onClick={() => onNavigateToComparison?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Comparison</button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-emerald-500">Trend</button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">Details</button>
        <button className="hidden">{/* Optimizer removed - use top nav */}
        </button>
      </div>

      {/* Title, Badges, Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-lg font-semibold text-zinc-100">{driver.label}</h2>
            {driver.badges.map(b => (
              <Badge
                key={b.label}
                variant="outline"
                className={cn(
                  "text-xs",
                  b.variant === "brand" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                )}
              >
                {b.label}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            {driver.parentPath.map((seg, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span>{seg}</span>
              </span>
            ))}
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-300 font-medium">{driver.label}</span>
          </div>
        </div>
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent text-xs h-8">
          <Settings className="h-3.5 w-3.5 mr-1.5" />Chart Settings
        </Button>
      </div>

      {/* Driver Selector */}
      <div className="flex flex-wrap gap-2">
        {allDriverIds.map(id => {
          const d = driverTrends.find(t => t.id === id)!
          return (
            <button
              key={id}
              onClick={() => setCurrentDriverId(id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                currentDriverId === id
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
              )}
            >
              {d.label}
            </button>
          )
        })}
      </div>

      {/* Chart */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: driver.color }} />
              <span className="text-xs text-zinc-300">{driver.inputMetric}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-zinc-300">{driver.contributionMetric}</span>
            </div>
          </div>

          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} className="overflow-visible">
            {/* Grid */}
            {inputTicks.map(v => (
              <line key={`ig-${v}`} x1={pad.left} y1={scaleInputY(v)} x2={chartW - pad.right} y2={scaleInputY(v)} stroke="#27272a" strokeWidth={1} />
            ))}

            {/* Left Y-axis labels (input) */}
            {inputTicks.map(v => (
              <text key={`il-${v}`} x={pad.left - 12} y={scaleInputY(v) + 4} textAnchor="end" className="fill-zinc-500 text-[11px]">{v}</text>
            ))}
            <text x={14} y={chartH / 2} textAnchor="middle" className="fill-zinc-400 text-[10px]" transform={`rotate(-90, 14, ${chartH / 2})`}>
              {driver.inputMetric.length > 40 ? driver.inputUnit : driver.inputMetric}
            </text>

            {/* Right Y-axis labels (contribution) */}
            {contribTicks.map(v => (
              <text key={`cl-${v}`} x={chartW - pad.right + 12} y={scaleContribY(v) + 4} textAnchor="start" className="fill-zinc-500 text-[11px]">{v.toFixed(2)}</text>
            ))}
            <text x={chartW - 14} y={chartH / 2} textAnchor="middle" className="fill-zinc-400 text-[10px]" transform={`rotate(90, ${chartW - 14}, ${chartH / 2})`}>
              {driver.contributionUnit}
            </text>

            {/* X-axis labels */}
            {xLabels.map((label, i) => (
              <text key={i} x={scaleX(i)} y={chartH - pad.bottom + 22} textAnchor="middle" className="fill-zinc-500 text-[11px]">
                {label}
              </text>
            ))}

            {/* Input line (driver color) */}
            <polyline points={inputLine} fill="none" stroke={driver.color} strokeWidth={2.5} strokeLinejoin="round" />
            {data.map((_, i) => (
              <circle
                key={`ip-${i}`}
                cx={scaleX(i)}
                cy={scaleInputY(inputValues[i])}
                r={hoveredPoint === i ? 6 : 4}
                fill={driver.color}
                stroke="#18181b"
                strokeWidth={2}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              />
            ))}

            {/* Contribution line (emerald) */}
            <polyline points={contribLine} fill="none" stroke="#34d399" strokeWidth={2.5} strokeLinejoin="round" />
            {data.map((_, i) => (
              <circle
                key={`cp-${i}`}
                cx={scaleX(i)}
                cy={scaleContribY(contribValues[i])}
                r={hoveredPoint === i ? 6 : 4}
                fill="#34d399"
                stroke="#18181b"
                strokeWidth={2}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              />
            ))}

            {/* Hover tooltip */}
            {hoveredPoint !== null && (
              <g>
                {/* Vertical line */}
                <line x1={scaleX(hoveredPoint)} y1={pad.top} x2={scaleX(hoveredPoint)} y2={pad.top + plotH} stroke="#52525b" strokeWidth={1} strokeDasharray="4,4" />

                {/* Tooltip box */}
                <rect x={scaleX(hoveredPoint) + 12} y={pad.top + 10} width={220} height={72} rx={8} fill="#18181b" stroke="#3f3f46" strokeWidth={1} />
                <text x={scaleX(hoveredPoint) + 22} y={pad.top + 30} className="fill-zinc-200 text-[11px] font-semibold">{xLabels[hoveredPoint]}</text>
                <circle cx={scaleX(hoveredPoint) + 28} cy={pad.top + 46} r={4} fill={driver.color} />
                <text x={scaleX(hoveredPoint) + 38} y={pad.top + 50} className="fill-zinc-400 text-[10px]">
                  {driver.inputUnit}: {inputValues[hoveredPoint].toLocaleString()}
                </text>
                <circle cx={scaleX(hoveredPoint) + 28} cy={pad.top + 64} r={4} fill="#34d399" />
                <text x={scaleX(hoveredPoint) + 38} y={pad.top + 68} className="fill-zinc-400 text-[10px]">
                  {driver.contributionUnit}: {contribValues[hoveredPoint].toFixed(3)}
                </text>
              </g>
            )}
          </svg>

          {/* Timeframe toggle */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-zinc-500">Timeframe</span>
            <button
              onClick={() => setTimeframe("month")}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all",
                timeframe === "month" ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe("week")}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all",
                timeframe === "week"
                  ? "bg-zinc-700 text-zinc-100"
                  : driver.weekly
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-700 cursor-not-allowed"
              )}
              disabled={!driver.weekly}
            >
              Week
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Footer hint */}
      <div className="text-center">
        <p className="text-sm text-zinc-500">
          Hover over key areas to reveal more information. When ready, click on the "Details" tab.
        </p>
      </div>
    </div>
  )
}
