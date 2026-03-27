"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Megaphone,
  Tv,
  Smartphone,
  Users,
  Music,
  Film,
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketingScreen } from "./overview"

interface CommunicationStrategyProps {
  onNavigate?: (screen: MarketingScreen) => void
}

const channelMix = [
  { 
    channel: "Social Media", 
    allocation: 35, 
    trend: "+12%", 
    icon: Smartphone,
    platforms: ["TikTok", "Meta", "Instagram"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  { 
    channel: "Online Video", 
    allocation: 25, 
    trend: "+8%", 
    icon: Film,
    platforms: ["YouTube", "CTV", "Netflix"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10"
  },
  { 
    channel: "Television", 
    allocation: 20, 
    trend: "-5%", 
    icon: Tv,
    platforms: ["Linear TV", "Flex TV"],
    color: "text-amber-400",
    bgColor: "bg-amber-500/10"
  },
  { 
    channel: "Out of Home", 
    allocation: 12, 
    trend: "+2%", 
    icon: Users,
    platforms: ["Digital OOH", "Transit", "Billboard"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  { 
    channel: "Audio", 
    allocation: 8, 
    trend: "+3%", 
    icon: Music,
    platforms: ["Spotify", "Podcasts", "Radio"],
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  },
]

const messagingHierarchy = [
  {
    level: "Master Brand",
    message: "Real Magic",
    description: "Umbrella message connecting all portfolio brands",
  },
  {
    level: "Product Truth",
    message: "Great Taste, Zero Sugar",
    description: "Functional benefit for Brand B",
  },
  {
    level: "Emotional Benefit",
    message: "Confidence Without Compromise",
    description: "How the product makes consumers feel",
  },
  {
    level: "Call to Action",
    message: "Try the Best Coke Ever",
    description: "Conversion-focused messaging for trial",
  },
]

const creativeDirections = [
  {
    title: "Social-First Content",
    description: "Short-form, vertical video optimized for TikTok and Reels",
    status: "active",
    examples: ["Creator collaborations", "Trend-jacking", "UGC campaigns"],
  },
  {
    title: "Value Messaging",
    description: "Highlighting affordability and everyday refreshment",
    status: "development",
    examples: ["Multi-pack value", "Share moments", "Everyday treats"],
  },
  {
    title: "Cultural Moments",
    description: "Owning key cultural and seasonal moments",
    status: "active",
    examples: ["Summer campaigns", "Sports sponsorships", "Music festivals"],
  },
]

export function MarketingCommunicationStrategy({ onNavigate }: CommunicationStrategyProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Communication Strategy</h1>
          <p className="text-xs text-zinc-500 mt-1">Channel mix, messaging hierarchy, and creative direction</p>
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
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-blue-500">
          Communication Strategy
        </button>
        <button 
          onClick={() => onNavigate?.("communication-plan")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Communication Plan
        </button>
        <button 
          onClick={() => onNavigate?.("initiative-development")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Initiative Development
        </button>
      </div>

      {/* Channel Mix */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-blue-400" />
            Channel Mix Allocation 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelMix.map((channel) => {
              const Icon = channel.icon
              return (
                <div key={channel.channel} className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-lg", channel.bgColor)}>
                    <Icon className={cn("h-4 w-4", channel.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-100">{channel.channel}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-100">{channel.allocation}%</span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px]",
                            channel.trend.startsWith("+") 
                              ? "text-emerald-400 border-emerald-500/20" 
                              : "text-red-400 border-red-500/20"
                          )}
                        >
                          {channel.trend} YoY
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", channel.bgColor.replace("/10", "/60"))}
                        style={{ width: `${channel.allocation}%` }}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {channel.platforms.map((platform, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] text-zinc-400 border-zinc-700">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Messaging Hierarchy */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-zinc-100">Messaging Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messagingHierarchy.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                      {idx + 1}
                    </div>
                    <span className="text-xs text-zinc-500">{item.level}</span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 mb-1">"{item.message}"</p>
                  <p className="text-xs text-zinc-400">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Creative Directions */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Creative Directions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {creativeDirections.map((direction, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-zinc-100">{direction.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px]",
                        direction.status === "active" 
                          ? "text-emerald-400 border-emerald-500/20" 
                          : "text-amber-400 border-amber-500/20"
                      )}
                    >
                      {direction.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{direction.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {direction.examples.map((ex, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] text-zinc-500 border-zinc-700">
                        {ex}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">AI Recommendation</h3>
              <p className="text-sm text-zinc-400">
                Based on ROI analysis, shifting an additional 5% of TV budget to TikTok and YouTube for Coke Zero 
                could increase brand awareness among 18-24 by 8% while reducing cost-per-reach by 23%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-end">
        <button 
          onClick={() => onNavigate?.("communication-plan")}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          Continue to Communication Plan <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
