"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketingScreen } from "./overview"

interface CommunicationPlanProps {
  onNavigate?: (screen: MarketingScreen) => void
}

const campaigns = [
  {
    id: 1,
    name: "Brand B TikTok Challenge",
    brand: "Brand B",
    status: "active",
    startDate: "Jan 2026",
    endDate: "Mar 2026",
    budget: "€2.4M",
    channels: ["TikTok", "Instagram Reels"],
    objective: "Drive trial among Gen Z",
    kpi: "50M video views, 5% trial lift",
    progress: 65,
  },
  {
    id: 2,
    name: "Value for Money Multi-Pack",
    brand: "Brand Portfolio",
    status: "planned",
    startDate: "Apr 2026",
    endDate: "Jun 2026",
    budget: "€1.8M",
    channels: ["TV", "Digital Display", "In-Store"],
    objective: "Improve affordability perception",
    kpi: "+8% value perception score",
    progress: 0,
  },
  {
    id: 3,
    name: "Summer Real Magic",
    brand: "Brand A",
    status: "planned",
    startDate: "May 2026",
    endDate: "Aug 2026",
    budget: "€5.2M",
    channels: ["TV", "OOH", "Social", "Experiential"],
    objective: "Peak season brand presence",
    kpi: "+2pp brand preference",
    progress: 0,
  },
  {
    id: 4,
    name: "Brand D Halloween",
    brand: "Brand D",
    status: "planned",
    startDate: "Sep 2026",
    endDate: "Oct 2026",
    budget: "€1.5M",
    channels: ["TikTok", "Snapchat", "OOH"],
    objective: "Seasonal engagement",
    kpi: "30M social impressions",
    progress: 0,
  },
]

const budgetAllocation = [
  { brand: "Brand A", budget: 12.5, percentage: 45 },
  { brand: "Brand B", budget: 8.2, percentage: 30 },
  { brand: "Brand D", budget: 4.1, percentage: 15 },
  { brand: "Brand C", budget: 2.8, percentage: 10 },
]

const calendarMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const getStatusConfig = (status: string) => {
  switch (status) {
    case "active":
      return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 }
    case "planned":
      return { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock }
    default:
      return { color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20", icon: AlertCircle }
  }
}

export function MarketingCommunicationPlan({ onNavigate }: CommunicationPlanProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Communication Plan</h1>
          <p className="text-xs text-zinc-500 mt-1">Campaign calendar, budget allocation, and media planning</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button 
          onClick={() => onNavigate?.("overview")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Overview
        </button>
        <button 
          onClick={() => onNavigate?.("brand-strategy")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Brand Strategy
        </button>
        <button 
          onClick={() => onNavigate?.("communication-strategy")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Communication Strategy
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-blue-500">
          Communication Plan
        </button>
        <button 
          onClick={() => onNavigate?.("initiative-development")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Initiative Development
        </button>
      </div>

      {/* Budget Overview */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            2026 Media Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {budgetAllocation.map((item) => (
              <div key={item.brand} className="p-4 rounded-lg bg-zinc-800/50">
                <p className="text-xs text-zinc-500 mb-1">{item.brand}</p>
                <p className="text-xl font-bold text-zinc-100">€{item.budget}M</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Calendar */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            Campaign Calendar 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Timeline Header */}
          <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
            <div className="text-xs text-zinc-500 font-medium">Campaign</div>
            <div className="grid grid-cols-12 gap-1">
              {calendarMonths.map((month) => (
                <div key={month} className="text-[10px] text-zinc-500 text-center">{month}</div>
              ))}
            </div>
          </div>

          {/* Campaigns */}
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const statusConfig = getStatusConfig(campaign.status)
              const startMonthIndex = calendarMonths.indexOf(campaign.startDate.split(" ")[0])
              const endMonthIndex = calendarMonths.indexOf(campaign.endDate.split(" ")[0])
              
              return (
                <div key={campaign.id} className="grid grid-cols-[200px_1fr] gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px]", statusConfig.color, statusConfig.border)}
                    >
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-zinc-100 truncate">{campaign.name}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {calendarMonths.map((_, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "h-8 rounded",
                          idx >= startMonthIndex && idx <= endMonthIndex
                            ? campaign.status === "active" 
                              ? "bg-emerald-500/30" 
                              : "bg-blue-500/30"
                            : "bg-zinc-800/30"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-300">Campaign Details</h2>
        <div className="grid grid-cols-2 gap-4">
          {campaigns.map((campaign) => {
            const statusConfig = getStatusConfig(campaign.status)
            const StatusIcon = statusConfig.icon
            
            return (
              <Card key={campaign.id} className={cn("border", statusConfig.bg, statusConfig.border)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">{campaign.name}</h3>
                      <p className="text-xs text-zinc-400">{campaign.brand}</p>
                    </div>
                    <StatusIcon className={cn("h-4 w-4", statusConfig.color)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] text-zinc-500">Duration</p>
                      <p className="text-xs text-zinc-300">{campaign.startDate} - {campaign.endDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500">Budget</p>
                      <p className="text-xs text-zinc-300">{campaign.budget}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-[10px] text-zinc-500 mb-1">Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.map((ch, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                          {ch}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-[10px] text-zinc-500">Objective</p>
                    <p className="text-xs text-zinc-300">{campaign.objective}</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-zinc-500">Target KPI</p>
                    <p className="text-xs text-zinc-300">{campaign.kpi}</p>
                  </div>

                  {campaign.status === "active" && (
                    <div className="mt-3 pt-3 border-t border-zinc-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-zinc-500">Progress</span>
                        <span className="text-[10px] text-emerald-400">{campaign.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button 
          onClick={() => onNavigate?.("initiative-development")}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          Continue to Initiative Development <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
