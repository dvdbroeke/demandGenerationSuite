"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { 
  Info,
  ChevronDown,
  Zap,
  Eye,
  Pencil,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FuelightLogo } from "@/components/ui/platform-logos"

interface PerformanceDashboardProps {
  onNavigateToWaterfall: (brand: string) => void
  onNavigateToPartitions: () => void
  onNavigateToOptimizer?: () => void
  onNavigateToComparison?: () => void
  onNavigateToTrend?: (driver?: string) => void
  onNavigateToEdit?: () => void
}

// Currency conversion rates (relative to TRY base)
const currencyRates: Record<string, { symbol: string; rate: number; code: string }> = {
  TRY: { symbol: "₺", rate: 1, code: "TRY" },
  USD: { symbol: "$", rate: 0.029, code: "USD" },
  EUR: { symbol: "€", rate: 0.027, code: "EUR" },
  GBP: { symbol: "\u00a3", rate: 0.023, code: "GBP" },
}

// Base values in TRY (millions)
const baseKpiData = {
  sellOutVolume: { value: 108, unit: "MUC", change: "+8%", trend: "up" },
  systemNSR: { value: 32840, change: "+35%", trend: "up" },
  systemGP: { value: 10245, change: "+78%", trend: "up" },
}

const baseInvestmentData = {
  total: 820,
  totalChange: "+18%",
  inPeriodROI: "1.3x",
  longTermROI: "2.1x",
  digital: { spend: 290, change: "+22%", roi: "1.4x", longTermRoi: "2.2x" },
  traditional: { spend: 530, change: "+12%", roi: "1.2x", longTermRoi: "2.4x" },
}

const baseBrandPerformance = [
  { 
    name: "Coca-Cola", 
    volume: "62 MUC", 
    volumeChange: "+9%", 
    nsr: 19180, 
    nsrChange: "+7%",
    hasIssue: false
  },
  { 
    name: "Fanta", 
    volume: "18 MUC", 
    volumeChange: "+6%", 
    nsr: 4430, 
    nsrChange: "+5%",
    hasIssue: false
  },
  { 
    name: "Cappy", 
    volume: "9 MUC", 
    volumeChange: "+4%", 
    nsr: 2745, 
    nsrChange: "+3%",
    hasIssue: false
  },
  { 
    name: "Coca-Cola Zero", 
    volume: "14 MUC", 
    volumeChange: "-4%", 
    nsr: 4650, 
    nsrChange: "-3%",
    hasIssue: true,
    issueNote: "Underperforming vs. expectation"
  },
]

function formatCurrency(value: number, currency: string): string {
  const { symbol, rate } = currencyRates[currency]
  const converted = value * rate
  if (converted >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(converted >= 10000 ? 0 : 1)}B`
  }
  return `${symbol}${converted.toFixed(0)}M`
}

export function FuelightPerformanceDashboard({ onNavigateToWaterfall, onNavigateToPartitions, onNavigateToOptimizer, onNavigateToComparison, onNavigateToTrend, onNavigateToEdit }: PerformanceDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("dec-2024")
  const [selectedFunding, setSelectedFunding] = useState("system")
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [activeTab, setActiveTab] = useState<"summary" | "details">("summary")

  const currencyInfo = currencyRates[selectedCurrency]

  return (
    <div className="p-8 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <FuelightLogo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Fuelight</h1>
            <p className="text-xs text-zinc-500">Optimization View</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View/Edit/Optimize Navigation */}
          <div className="flex items-center gap-1 mr-4">
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-emerald-500 text-emerald-400 bg-emerald-500/10"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
            <button 
              onClick={onNavigateToEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button 
              onClick={onNavigateToOptimizer}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Optimize
            </button>
          </div>
          <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-1">
            IT
          </Badge>
          
          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
                <span>{currencyInfo.symbol} - {currencyInfo.code}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              {Object.entries(currencyRates).map(([code, { symbol }]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setSelectedCurrency(code)}
                  className={cn(
                    "text-zinc-300 cursor-pointer",
                    selectedCurrency === code && "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {symbol} - {code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-1">
            360
          </Badge>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="dec-2024" className="text-zinc-100 text-xs">Dec 29, 2024 - Jul 6, 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFunding} onValueChange={setSelectedFunding}>
            <SelectTrigger className="w-[140px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="system" className="text-zinc-100 text-xs">System Funding</SelectItem>
              <SelectItem value="tccc" className="text-zinc-100 text-xs">TCCC Funding</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 px-3 py-1">
            Coca-Cola Zero
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("summary")}
          className={cn("px-6 py-3 text-sm font-medium transition-colors", activeTab === "summary" ? "text-zinc-100 border-b-2 border-emerald-500" : "text-zinc-500 hover:text-zinc-300")}
        >
          Summary
        </button>
        <button 
          onClick={() => onNavigateToWaterfall("Coca-Cola")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Waterfall
        </button>
        <button onClick={() => onNavigateToComparison?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Comparison
        </button>
        <button onClick={() => onNavigateToTrend?.()} className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300">
          Trend
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={cn("px-6 py-3 text-sm font-medium transition-colors cursor-pointer", activeTab === "details" ? "text-zinc-100 border-b-2 border-emerald-500" : "text-zinc-500 hover:text-zinc-300")}
        >
          Details
        </button>
      </div>

      {/* Details Tab Content */}
      {activeTab === "details" && (
        <DetailsTable currencyInfo={currencyRates[selectedCurrency]} />
      )}

      {/* Summary Tab Content */}
      {activeTab === "summary" && <>

      {/* Business Performance */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Business Performance</h2>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Sell-out Volume</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">{baseKpiData.sellOutVolume.value} {baseKpiData.sellOutVolume.unit}</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1">
              vs same period last year
              <span className="ml-2 font-semibold">{baseKpiData.sellOutVolume.change}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">System NSR</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">{formatCurrency(baseKpiData.systemNSR.value, selectedCurrency)}</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1">
              vs same period last year
              <span className="ml-2 font-semibold">{baseKpiData.systemNSR.change}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">System GP</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">{formatCurrency(baseKpiData.systemGP.value, selectedCurrency)}</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1">
              vs same period last year
              <span className="ml-2 font-semibold">{baseKpiData.systemGP.change}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-800/50">
        <div>
          <p className="text-sm text-zinc-500 mb-1">Consumer (Paid) Investment</p>
          <span className="text-xl font-bold text-zinc-100">
            {formatCurrency(baseInvestmentData.total, selectedCurrency)} ({baseInvestmentData.totalChange})
          </span>
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-1">{baseInvestmentData.inPeriodROI} In-Period Sell-out Volume ROI</p>
          <span className="text-xs text-zinc-400">Per 100 {currencyInfo.code}</span>
        </div>
        <div>
          <p className="text-sm text-zinc-500 mb-1">{baseInvestmentData.longTermROI} Long-Term Sell-out Volume ROI</p>
          <span className="text-xs text-zinc-400">Per 100 {currencyInfo.code}</span>
        </div>
      </div>

      {/* Media Breakdown */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-6 py-3 border-b border-zinc-800/30">
          <span className="text-sm text-zinc-400">Digital Media</span>
          <span className="text-sm text-zinc-300">
            {formatCurrency(baseInvestmentData.digital.spend, selectedCurrency)} ({baseInvestmentData.digital.change})
          </span>
          <span className="text-sm text-zinc-300">{baseInvestmentData.digital.roi}</span>
          <span className="text-sm text-zinc-300">{baseInvestmentData.digital.longTermRoi}</span>
        </div>
        <div className="grid grid-cols-4 gap-6 py-3">
          <span className="text-sm text-zinc-400">Traditional Media</span>
          <span className="text-sm text-zinc-300">
            {formatCurrency(baseInvestmentData.traditional.spend, selectedCurrency)} ({baseInvestmentData.traditional.change})
          </span>
          <span className="text-sm text-zinc-300">{baseInvestmentData.traditional.roi}</span>
          <span className="text-sm text-zinc-300">{baseInvestmentData.traditional.longTermRoi}</span>
        </div>
      </div>

      {/* Brand Performance Snapshot */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">Brand Performance Snapshot</h2>
          <Select defaultValue="variance">
            <SelectTrigger className="w-[160px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="variance" className="text-zinc-100 text-xs">Largest Variance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {baseBrandPerformance.map((brand) => (
            <button
              key={brand.name}
              onClick={() => onNavigateToWaterfall(brand.name)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                brand.hasIssue 
                  ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                  : "bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-100">{brand.name}</h3>
                {brand.hasIssue && (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px]">
                    Needs Review
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mb-1">Total (vs same period last year)</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Sell-out Volume</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    brand.volumeChange.startsWith("-") ? "text-red-400" : "text-emerald-400"
                  )}>
                    {brand.volume} ({brand.volumeChange})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">System NSR</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    brand.nsrChange.startsWith("-") ? "text-red-400" : "text-emerald-400"
                  )}>
                    {formatCurrency(brand.nsr, selectedCurrency)} ({brand.nsrChange})
                  </span>
                </div>
              </div>
              {brand.hasIssue && brand.issueNote && (
                <div className="mt-3 pt-3 border-t border-red-500/20">
                  <p className="text-[10px] text-red-400 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {brand.issueNote}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Adjust Filters CTA */}
      <div className="text-center py-4">
        <p className="text-sm text-zinc-500">
          Adjust the brand filters.
        </p>
      </div>
      </>}
    </div>
  )
}

// Details table with Table Settings panel
function DetailsTable({ currencyInfo }: { currencyInfo: { symbol: string; rate: number; code: string } }) {
  const [showSettings, setShowSettings] = useState(false)
  const [viewBeforeOpt, setViewBeforeOpt] = useState(false)
  const [viewVsPriorYear, setViewVsPriorYear] = useState(true)
  const [viewByPercentage, setViewByPercentage] = useState(false)
  const [viewInThousands, setViewInThousands] = useState(false)

  const weeks = ["7/6 – 7/12", "7/13 – 7/19", "7/20 – 7/26", "7/27 – 8/2", "8/3 – 8/9", "8/10 – 8/16", "8/17 – 8/23", "8/24 – 8/30"]
  const rows = [
    { label: "Meta",       values: [1.8, 2.0, 2.0, 2.0, 1.5, 0.7, 0.7, 0.7] },
    { label: "TikTok",     values: [1.1, 1.3, 1.3, 1.3, 0.9, 0.5, 0.5, 0.5] },
    { label: "Snapchat",   values: [0.0, 0.0, 0.0, 0.0, 0.0, null, null, null] },
    { label: "Other",      values: [null, null, null, null, null, null, null, null] },
    { label: "X (Twitter)",values: [null, null, null, null, null, null, null, null] },
  ]

  return (
    <div className="relative">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Social</h2>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
            <span>All Drivers</span>
            <span>›</span><span>Consumer (Paid)</span>
            <span>›</span><span>Digital Media</span>
            <span>›</span><span className="text-zinc-300">Social</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Zap className="h-3 w-3 text-emerald-400" /> Values with Optimization
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Table Settings
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium w-36">2024</th>
                {weeks.map(w => (
                  <th key={w} className="text-right py-3 px-3 text-zinc-400 font-medium whitespace-nowrap">
                    <span className="flex items-center justify-end gap-1">
                      <svg className="h-3 w-3 text-zinc-600" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zM5 4h2v4H5V4zm0-2h2v1.5H5V2z"/></svg>
                      {w}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                  <td className="py-4 px-4 text-zinc-300">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="py-4 px-3 text-right text-zinc-300">
                      {v === null ? <span className="text-zinc-600">--</span> : v.toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Settings Panel */}
        {showSettings && (
          <div className="w-72 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shrink-0 space-y-5">
            <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
              <Settings className="h-4 w-4" /> Table Settings
            </h3>

            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Values</p>
              <div className="space-y-3">
                {[
                  { label: "View before optimization", state: viewBeforeOpt, set: setViewBeforeOpt },
                  { label: "View vs. Prior Year", state: viewVsPriorYear, set: setViewVsPriorYear },
                  { label: "View by percentage", state: viewByPercentage, set: setViewByPercentage },
                  { label: "View in thousands", state: viewInThousands, set: setViewInThousands },
                ].map(({ label, state, set }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">{label}</span>
                    <button
                      onClick={() => set(!state)}
                      className={cn("w-10 h-5 rounded-full transition-colors relative", state ? "bg-emerald-500" : "bg-zinc-700")}
                    >
                      <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", state ? "translate-x-5" : "translate-x-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Dimensions</p>
              <div className="space-y-3">
                {[
                  { label: "Input Metric", default: "Input Metric" },
                  { label: "Output Metric", default: "Sell-out Volume, System NSR" },
                  { label: "Measurement View", default: "Measurement View" },
                ].map(({ label, default: def }) => (
                  <div key={label}>
                    <p className="text-xs text-zinc-500 mb-1">{label}</p>
                    <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none">
                      <option>{def}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">View Level</p>
              <div className="space-y-2">
                {["All Drivers", "Consumer (Paid)", "Digital Media", "Social"].map((level, i) => (
                  <div key={level} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 flex items-center justify-center">{i + 1}</span>
                    {i === 0 ? (
                      <span className="text-sm text-zinc-300">{level}</span>
                    ) : (
                      <select className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm text-zinc-300 outline-none">
                        <option>{level}</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <button onClick={() => setShowSettings(false)} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">Cancel</button>
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-400 transition-colors">Update</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
