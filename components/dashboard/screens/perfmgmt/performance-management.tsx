"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Calendar,
  Sparkles,
  ChevronRight,
  Plus,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Megaphone,
  Users,
  Radio,
  Share2
} from "lucide-react"

export type PerfMgmtScreen = "system-scorecard" | "big-bets" | "campaign-effectiveness" | "initiative-summary"

interface PerformanceManagementProps {
  activeScreen: PerfMgmtScreen
  onNavigate: (screen: PerfMgmtScreen) => void
}

const tabs: { id: PerfMgmtScreen; label: string }[] = [
  { id: "system-scorecard", label: "System Scorecard" },
  { id: "big-bets", label: "Big Bets Tracker" },
  { id: "campaign-effectiveness", label: "Campaign Effectiveness" },
  { id: "initiative-summary", label: "Initiative Summary" },
]

// ---------- System Scorecard Data ----------
const markets = [
  { value: "italy", label: "Italy" },
  { value: "spain", label: "Spain" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "gb", label: "Great Britain" },
]

const periods = [
  { value: "ytd-jan-2026", label: "YTD Jan 2026" },
  { value: "ytd-feb-2026", label: "YTD Feb 2026" },
  { value: "ytd-mar-2026", label: "YTD Mar 2026" },
  { value: "q1-2026", label: "Q1 2026" },
  { value: "q2-2026", label: "Q2 2026" },
]

const toplineKPIs = [
  { label: "sNSR", value: "€480M", vsPY: 3.8, vsBP: 1.2 },
  { label: "Volume", value: "142M UC", vsPY: 2.1, vsBP: -0.5 },
  { label: "Market Share", value: "42.8%", vsPY: 0.4, vsBP: 0.2 },
]

const sellInPerformance = [
  { metric: "NSR", actual: "€480M", vsPY: 3.8, vsBP: 1.2 },
  { metric: "Transactions", actual: "12.4M", vsPY: 2.2, vsBP: 0.8 },
  { metric: "Volume", actual: "142M UC", vsPY: 2.1, vsBP: -0.5 },
]

const sellOutMarketShare = [
  { category: "Cola Regular", volume: "58.2M", share: "48.2%", vsPY: 0.8 },
  { category: "Cola Zero", volume: "24.8M", share: "52.4%", vsPY: 1.2 },
  { category: "Cola Diet", volume: "12.1M", share: "38.6%", vsPY: -0.4 },
  { category: "Citrus/Fruity", volume: "32.4M", share: "34.8%", vsPY: 0.2 },
  { category: "Tea/Coffee", volume: "14.5M", share: "28.4%", vsPY: -0.6 },
]

const externalEnvironment = [
  { indicator: "Category Growth", value: "2.8%", trend: "up" },
  { indicator: "CPI (Beverage)", value: "4.2%", trend: "up" },
  { indicator: "Consumer Confidence", value: "102.4", trend: "down" },
  { indicator: "GDP Growth", value: "1.2%", trend: "neutral" },
]

// ---------- Big Bets Data ----------
const bigBetsData = [
  {
    id: 1,
    title: "Reignite CCOT enhancing relevance of Gen Z",
    kbis: [
      { metric: "CCOT Volume", actual: "58.2M", vsPY: 2.4, vsBP: 1.2 },
      { metric: "CCOT Volume Share", actual: "48.2%", vsPY: 0.8, vsBP: 0.4 },
      { metric: "CCOT Lead Ratio", actual: "1.42", vsPY: 0.08, vsBP: 0.02 },
      { metric: "CCOT Total Drinkers", actual: "12.4M", vsPY: 1.8, vsBP: -0.2 },
      { metric: "CCOT Gen Z Drinkers", actual: "2.8M", vsPY: 4.2, vsBP: 1.8 },
      { metric: "Brand Power (Gen Z)", actual: "68.4", vsPY: 2.1, vsBP: 0.8 },
      { metric: "HH Penetration", actual: "62.4%", vsPY: 0.4, vsBP: -0.1 },
      { metric: "Purchase Frequency", actual: "4.2x", vsPY: 0.2, vsBP: 0.1 },
      { metric: "Num Distribution Entry Pack", actual: "84.2%", vsPY: 1.2, vsBP: 0.4 },
      { metric: "SSD IPP", actual: "2.4", vsPY: 0.08, vsBP: -0.02 },
    ],
    comments: "Gen Z engagement shows strong momentum with Brand Power up +2.1pp. Digital activation driving increased frequency among younger cohort.",
  },
  {
    id: 2,
    title: "Accelerate Fuze Tea",
    kbis: [
      { metric: "Fuze Tea Volume", actual: "8.4M", vsPY: 8.2, vsBP: 2.4 },
      { metric: "Fuze Tea Volume Share", actual: "18.4%", vsPY: 2.8, vsBP: 1.2 },
      { metric: "Fuze Tea Awareness", actual: "42.8%", vsPY: 4.2, vsBP: 1.8 },
      { metric: "Fuze Tea Total Drinkers", actual: "1.8M", vsPY: 12.4, vsBP: 4.2 },
      { metric: "Fuze Tea Salience", actual: "28.4%", vsPY: 2.4, vsBP: 0.8 },
      { metric: "Fuze Tea Incidence", actual: "14.2%", vsPY: 1.8, vsBP: 0.4 },
      { metric: "Volume per Trip", actual: "1.8 UC", vsPY: 0.2, vsBP: 0.1 },
      { metric: "Num Distribution", actual: "68.4%", vsPY: 4.8, vsBP: 2.1 },
      { metric: "Share of Shelf", actual: "22.4%", vsPY: 2.2, vsBP: 0.8 },
      { metric: "Cooler Doors", actual: "42.8%", vsPY: 4.2, vsBP: 1.4 },
    ],
    comments: "Fuze Tea outperforming all KPIs. Distribution expansion driving awareness gains. Cooler placement strategy showing strong ROI.",
  },
  {
    id: 3,
    title: "Accelerate Growth in HORECA",
    kbis: [
      { metric: "HORECA Volume", actual: "24.8M", vsPY: 4.2, vsBP: 1.8 },
      { metric: "HORECA Volume Share", actual: "38.4%", vsPY: 1.2, vsBP: 0.4 },
      { metric: "HORECA Incidence", actual: "42.8%", vsPY: 2.4, vsBP: 0.8 },
      { metric: "Trips per Month", actual: "2.4x", vsPY: 0.2, vsBP: 0.1 },
      { metric: "Visited Coverage", actual: "78.4%", vsPY: 2.8, vsBP: 1.2 },
      { metric: "Num Distribution Core", actual: "82.4%", vsPY: 1.8, vsBP: 0.4 },
      { metric: "Combo Activation", actual: "28.4%", vsPY: 4.2, vsBP: 1.8 },
      { metric: "Menu Presence", actual: "68.4%", vsPY: 2.4, vsBP: 0.8 },
      { metric: "Perfect Serve", actual: "72.8%", vsPY: 1.8, vsBP: 0.4 },
      { metric: "Cooler Occupancy", actual: "84.2%", vsPY: 2.2, vsBP: 0.8 },
    ],
    comments: "HORECA recovery strong post-pandemic. Combo activation programs driving incremental occasions. Focus needed on Perfect Serve compliance.",
  },
  {
    id: 4,
    title: "Drive Premium Mix through Innovation",
    kbis: [
      { metric: "Premium Volume", actual: "18.4M", vsPY: 6.8, vsBP: 2.4 },
      { metric: "Premium Value Share", actual: "24.8%", vsPY: 1.8, vsBP: 0.8 },
      { metric: "Innovation Volume", actual: "4.2M", vsPY: 28.4, vsBP: 8.2 },
      { metric: "Innovation Distribution", actual: "48.4%", vsPY: 12.4, vsBP: 4.8 },
      { metric: "Premium PPL", actual: "€2.84", vsPY: 4.2, vsBP: 1.4 },
    ],
    comments: "Innovation pipeline delivering strong results. Premium mix shift on track. Focus on accelerating distribution for new SKUs.",
  },
  {
    id: 5,
    title: "Win in Modern Trade",
    kbis: [
      { metric: "MT Volume", actual: "68.4M", vsPY: 2.8, vsBP: 0.8 },
      { metric: "MT Value Share", actual: "44.8%", vsPY: 0.4, vsBP: 0.2 },
      { metric: "MT Weighted Distribution", actual: "94.2%", vsPY: 0.8, vsBP: 0.2 },
      { metric: "MT SOVI", actual: "48.2%", vsPY: 1.2, vsBP: 0.4 },
      { metric: "MT Promo ROI", actual: "1.32x", vsPY: 0.08, vsBP: 0.02 },
    ],
    comments: "Modern Trade performance stable. SOVI gains offsetting competitive pressure. Promo efficiency improving with fewer, deeper approach.",
  },
]

// ---------- Campaign Effectiveness Data ----------
const campaignAreas = [
  {
    area: "Touchpoints",
    metrics: [
      { metric: "% Activated touchpoints live on time", unit: "%", source: "Campaign execution tab", plan: 100, actual: 100, vsBP: 0 },
    ],
  },
  {
    area: "Campaigns",
    metrics: [
      { metric: "No. of campaigns live", unit: "#", source: "Media tracking", plan: 2, actual: 2, vsBP: 0 },
      { metric: "Experience recall", unit: "%", source: "Beach", plan: null, actual: null, vsBP: null },
      { metric: "Likability", unit: "%", source: "Beach", plan: null, actual: 37, vsBP: null },
      { metric: "Uniqueness", unit: "%", source: "Beach", plan: null, actual: 34, vsBP: null },
      { metric: "Brand interest", unit: "%", source: "Beach", plan: null, actual: 29, vsBP: null },
      { metric: "Persuasion", unit: "%", source: "Beach", plan: null, actual: 27, vsBP: null },
    ],
  },
  {
    area: "TXD",
    metrics: [
      { metric: "Number of unique users entering pincodes", unit: "# in 000", source: "Digital Dashboard", plan: 8790, actual: 9720, vsBP: 10.6 },
      { metric: "Number of codes entered", unit: "# in 000", source: "Digital Dashboard", plan: 48000, actual: 50000, vsBP: 4.2 },
      { metric: "Number of total participations", unit: "# in 000", source: "Digital Dashboard", plan: 45000, actual: 40000, vsBP: -11.1 },
      { metric: "IPPs per TXD", unit: "# in 000", source: "CCH Database", plan: 2000, actual: 2000, vsBP: 0 },
    ],
  },
  {
    area: "Sampling",
    metrics: [
      { metric: "Sampling - Number of contacts", unit: "# in 000", source: "Agency estimate", plan: 50000, actual: 50000, vsBP: 0 },
    ],
  },
  {
    area: "Influencers",
    metrics: [
      { metric: "No. of Influencers", unit: "Abs", source: "Creator IQ", plan: 11, actual: 7, vsBP: -36.4 },
      { metric: "Total Reach by Influencers", unit: "%", source: "Creator IQ", plan: 62, actual: 50, vsBP: -19.4 },
      { metric: "Avg Engagement Rate", unit: "%", source: "Creator IQ", plan: 14, actual: 12, vsBP: -14.3 },
    ],
  },
  {
    area: "Media",
    metrics: [
      { metric: "Digital Media Share per Campaign", unit: "%", source: "Lumina", plan: 50, actual: 51, vsBP: 2.0 },
      { metric: "Reach & Frequency (all media)", unit: "%", source: "Lumina/OMS", plan: 99, actual: 99, vsBP: 0 },
      { metric: "Weeks on Air (WOA)", unit: "#", source: "Lumina", plan: 10, actual: 10, vsBP: 0 },
    ],
  },
]

// ---------- Component ----------
export function PerformanceManagement({ activeScreen, onNavigate }: PerformanceManagementProps) {
  const [selectedMarket, setSelectedMarket] = useState("italy")
  const [selectedPeriod, setSelectedPeriod] = useState("ytd-jan-2026")
  const [selectedCampaign, setSelectedCampaign] = useState("summer-2026")
  const [expandedBets, setExpandedBets] = useState<number[]>([1, 2, 3])
  
  // Initiative Summary state
  const [whatIsWorking, setWhatIsWorking] = useState("")
  const [keyWatchouts, setKeyWatchouts] = useState("")
  const [plannedActions, setPlannedActions] = useState("")
  const [overallStatus, setOverallStatus] = useState("")
  const [aiSynthesis, setAiSynthesis] = useState("")
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false)

  const toggleBetExpanded = (id: number) => {
    setExpandedBets(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const generateAISynthesis = () => {
    setIsGeneratingSynthesis(true)
    setTimeout(() => {
      setAiSynthesis(
        `Executive Summary: The market shows positive momentum with ${selectedMarket === "italy" ? "Italy" : selectedMarket} performing above plan on key volume metrics. ` +
        `Key wins include strong Gen Z engagement and Fuze Tea acceleration exceeding targets. ` +
        `Primary watchouts center on HORECA recovery pace and competitive promotional pressure in Modern Trade. ` +
        `Recommended actions focus on accelerating distribution for innovation SKUs and optimizing promotional depth strategy.`
      )
      setIsGeneratingSynthesis(false)
    }, 1500)
  }

  const getDeltaColor = (value: number | null) => {
    if (value === null) return "text-zinc-500"
    return value >= 0 ? "text-emerald-400" : "text-red-400"
  }

  const getDeltaBg = (value: number | null) => {
    if (value === null) return "bg-zinc-800"
    return value >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
  }

  const formatDelta = (value: number | null, suffix = "pp") => {
    if (value === null) return "—"
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}${suffix}`
  }

  // ---------- System Scorecard ----------
  const renderSystemScorecard = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {markets.map(m => (
              <SelectItem key={m.value} value={m.value} className="text-zinc-200">{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {periods.map(p => (
              <SelectItem key={p.value} value={p.value} className="text-zinc-200">{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topline KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {toplineKPIs.map(kpi => (
          <Card key={kpi.label} className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">{kpi.label}</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">{kpi.value}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-500">vs PY:</span>
                  <span className={cn("text-xs font-medium", getDeltaColor(kpi.vsPY))}>
                    {formatDelta(kpi.vsPY, "%")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-500">vs BP:</span>
                  <span className={cn("text-xs font-medium", getDeltaColor(kpi.vsBP))}>
                    {formatDelta(kpi.vsBP, "%")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Three Lenses Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sell-In Performance */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">Sell-In Topline Performance</CardTitle>
            <p className="text-[10px] text-zinc-500">NSR {">"} Transaction {">"} Volume</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {sellInPerformance.map(row => (
                <div key={row.metric} className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                  <span className="text-xs text-zinc-400">{row.metric}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-zinc-200">{row.actual}</span>
                    <span className={cn("text-[10px]", getDeltaColor(row.vsPY))}>
                      {formatDelta(row.vsPY, "%")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sell-Out & Market Share */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">Sell-Out Volume & Market Share</CardTitle>
            <p className="text-[10px] text-zinc-500">By Categories and Key Brands</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {sellOutMarketShare.map(row => (
                <div key={row.category} className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                  <span className="text-xs text-zinc-400">{row.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">{row.volume}</span>
                    <span className="text-xs font-medium text-zinc-200">{row.share}</span>
                    <span className={cn("text-[10px]", getDeltaColor(row.vsPY))}>
                      {formatDelta(row.vsPY, "pp")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* External Environment */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300">External Environment</CardTitle>
            <p className="text-[10px] text-zinc-500">Category Growth + Macro Indicators</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {externalEnvironment.map(row => (
                <div key={row.indicator} className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                  <span className="text-xs text-zinc-400">{row.indicator}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-200">{row.value}</span>
                    {row.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                    {row.trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
                    {row.trend === "neutral" && <span className="text-[10px] text-zinc-500">—</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // ---------- Big Bets Tracker ----------
  const renderBigBetsTracker = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {markets.map(m => (
              <SelectItem key={m.value} value={m.value} className="text-zinc-200">{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {periods.map(p => (
              <SelectItem key={p.value} value={p.value} className="text-zinc-200">{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topline Strip */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase">YTD Performance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-zinc-100">€480M</span>
                <span className="text-xs text-emerald-400">+3.8%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase">Quarter Outlook</p>
              <div className="flex items-center gap-3 mt-1">
                <div>
                  <span className="text-xs text-zinc-400">sNSR:</span>
                  <span className="text-xs font-medium text-zinc-200 ml-1">€165M</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Vol:</span>
                  <span className="text-xs font-medium text-zinc-200 ml-1">48M</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Share:</span>
                  <span className="text-xs font-medium text-zinc-200 ml-1">43.2%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase">Full Year Outlook</p>
              <div className="flex items-center gap-3 mt-1">
                <div>
                  <span className="text-xs text-zinc-400">sNSR:</span>
                  <span className="text-xs font-medium text-zinc-200 ml-1">€1.92B</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Vol:</span>
                  <span className="text-xs font-medium text-zinc-200 ml-1">580M</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-400">Share:</span>
                  <span className="text-xs font-medium text-zinc-200 ml-1">43.5%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                On Track
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Big Bets Cards */}
      <div className="space-y-4">
        {bigBetsData.map(bet => (
          <Card key={bet.id} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => toggleBetExpanded(bet.id)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <ChevronRight className={cn(
                    "h-4 w-4 text-zinc-400 transition-transform",
                    expandedBets.includes(bet.id) && "rotate-90"
                  )} />
                  <CardTitle className="text-sm text-zinc-200">
                    Big Bet #{bet.id}: {bet.title}
                  </CardTitle>
                </button>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700">
                  {bet.kbis.length} KBIs
                </Badge>
              </div>
            </CardHeader>
            {expandedBets.includes(bet.id) && (
              <CardContent className="pt-0">
                {/* KBI Table */}
                <div className="rounded-lg border border-zinc-800 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-800/50">
                        <th className="text-left py-2 px-3 text-zinc-500 font-medium">KBI</th>
                        <th className="text-right py-2 px-3 text-zinc-500 font-medium">Actual</th>
                        <th className="text-right py-2 px-3 text-zinc-500 font-medium">vs PY</th>
                        <th className="text-right py-2 px-3 text-zinc-500 font-medium">vs BP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bet.kbis.map((kbi, idx) => (
                        <tr key={idx} className="border-t border-zinc-800/50">
                          <td className="py-2 px-3 text-zinc-300">{kbi.metric}</td>
                          <td className="py-2 px-3 text-right text-zinc-200 font-medium">{kbi.actual}</td>
                          <td className={cn("py-2 px-3 text-right", getDeltaBg(kbi.vsPY), getDeltaColor(kbi.vsPY))}>
                            {formatDelta(kbi.vsPY, "")}
                          </td>
                          <td className={cn("py-2 px-3 text-right", getDeltaBg(kbi.vsBP), getDeltaColor(kbi.vsBP))}>
                            {formatDelta(kbi.vsBP, "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Comments */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Key Comments / Highlights</p>
                  <p className="text-xs text-zinc-300">{bet.comments}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )

  // ---------- Campaign Effectiveness ----------
  const renderCampaignEffectiveness = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-[220px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Select campaign" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="summer-2026" className="text-zinc-200">Summer 2026 Campaign</SelectItem>
            <SelectItem value="spring-2026" className="text-zinc-200">Spring 2026 Campaign</SelectItem>
            <SelectItem value="winter-2025" className="text-zinc-200">Winter 2025 Campaign</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Frequency" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="monthly" className="text-zinc-200">Monthly</SelectItem>
            <SelectItem value="quarterly" className="text-zinc-200">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Areas */}
      <div className="space-y-4">
        {campaignAreas.map(area => (
          <Card key={area.area} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {area.area === "Touchpoints" && <Target className="h-4 w-4 text-blue-400" />}
                {area.area === "Campaigns" && <Megaphone className="h-4 w-4 text-purple-400" />}
                {area.area === "TXD" && <BarChart3 className="h-4 w-4 text-amber-400" />}
                {area.area === "Sampling" && <Users className="h-4 w-4 text-emerald-400" />}
                {area.area === "Influencers" && <Share2 className="h-4 w-4 text-pink-400" />}
                {area.area === "Media" && <Radio className="h-4 w-4 text-cyan-400" />}
                <CardTitle className="text-sm text-zinc-200">{area.area}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-lg border border-zinc-800 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-800/50">
                      <th className="text-left py-2 px-3 text-zinc-500 font-medium">Metric</th>
                      <th className="text-left py-2 px-3 text-zinc-500 font-medium">Source</th>
                      <th className="text-right py-2 px-3 text-zinc-500 font-medium">Plan</th>
                      <th className="text-right py-2 px-3 text-zinc-500 font-medium">Actual</th>
                      <th className="text-right py-2 px-3 text-zinc-500 font-medium">vs BP (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {area.metrics.map((m, idx) => (
                      <tr key={idx} className="border-t border-zinc-800/50">
                        <td className="py-2 px-3 text-zinc-300">{m.metric}</td>
                        <td className="py-2 px-3 text-zinc-500">{m.source}</td>
                        <td className="py-2 px-3 text-right text-zinc-400">
                          {m.plan !== null ? m.plan.toLocaleString() : "—"}
                        </td>
                        <td className="py-2 px-3 text-right text-zinc-200 font-medium">
                          {m.actual !== null ? m.actual.toLocaleString() : "—"}
                        </td>
                        <td className={cn(
                          "py-2 px-3 text-right",
                          m.vsBP !== null && getDeltaBg(m.vsBP),
                          getDeltaColor(m.vsBP)
                        )}>
                          {m.vsBP !== null ? formatDelta(m.vsBP, "%") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // ---------- Initiative Summary ----------
  const renderInitiativeSummary = () => (
    <div className="space-y-6">
      {/* Header Block */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase">Market</p>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger className="mt-1 h-8 bg-zinc-800 border-zinc-700 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {markets.map(m => (
                    <SelectItem key={m.value} value={m.value} className="text-zinc-200">{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase">Period</p>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="mt-1 h-8 bg-zinc-800 border-zinc-700 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {periods.map(p => (
                    <SelectItem key={p.value} value={p.value} className="text-zinc-200">{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-zinc-500 uppercase">Overall Status</p>
              <input
                type="text"
                value={overallStatus}
                onChange={(e) => setOverallStatus(e.target.value)}
                placeholder="Enter one-line status summary..."
                className="mt-1 w-full h-8 px-3 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Three Input Sections */}
      <div className="grid grid-cols-3 gap-4">
        {/* What is Working */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-sm text-zinc-200">What is Working</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={whatIsWorking}
              onChange={(e) => setWhatIsWorking(e.target.value)}
              placeholder="• Enter bullet points for what's working well...
• Strong Gen Z engagement
• Fuze Tea distribution gains
• HORECA recovery momentum"
              className="min-h-[200px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none"
            />
          </CardContent>
        </Card>

        {/* Key Watchouts */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-sm text-zinc-200">Key Watchouts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={keyWatchouts}
              onChange={(e) => setKeyWatchouts(e.target.value)}
              placeholder="• Enter bullet points for areas of concern...
• Competitive pressure in Modern Trade
• Diet category share erosion
• Innovation distribution velocity"
              className="min-h-[200px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none"
            />
          </CardContent>
        </Card>

        {/* Planned Actions */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-sm text-zinc-200">Planned Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={plannedActions}
              onChange={(e) => setPlannedActions(e.target.value)}
              placeholder="• Enter bullet points for planned actions...
• Accelerate innovation distribution
• Optimize promo depth strategy
• Expand HORECA activation programs"
              className="min-h-[200px] bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* AI Synthesis */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-sm text-zinc-200">AI Executive Synthesis</CardTitle>
            </div>
            <Button
              onClick={generateAISynthesis}
              disabled={isGeneratingSynthesis}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
              size="sm"
            >
              {isGeneratingSynthesis ? (
                <>
                  <span className="animate-pulse">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1.5" />
                  Generate Synthesis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {aiSynthesis ? (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-zinc-200 leading-relaxed">{aiSynthesis}</p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">
                Fill in the sections above and click "Generate Synthesis" to create an AI-powered executive summary.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" className="border-zinc-700 text-zinc-300">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
          <Send className="h-4 w-4 mr-2" />
          Submit Summary
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-100">Performance Management</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Track system performance, Big Bets, campaign effectiveness, and market summaries
        </p>
      </div>

      {/* Tab Bar */}
      <Tabs value={activeScreen} onValueChange={(v) => onNavigate(v as PerfMgmtScreen)} className="mb-6">
        <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "text-xs px-4 py-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100",
                "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {activeScreen === "system-scorecard" && renderSystemScorecard()}
      {activeScreen === "big-bets" && renderBigBetsTracker()}
      {activeScreen === "campaign-effectiveness" && renderCampaignEffectiveness()}
      {activeScreen === "initiative-summary" && renderInitiativeSummary()}
    </div>
  )
}
