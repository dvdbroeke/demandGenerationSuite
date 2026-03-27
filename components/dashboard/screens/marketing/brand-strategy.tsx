"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  Users,
  Heart,
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketingScreen } from "./overview"

interface BrandStrategyProps {
  onNavigate?: (screen: MarketingScreen) => void
}

const brands = [
  {
    name: "Coca-Cola Classic",
    positioning: "The original taste that brings people together",
    targetAudience: "Mass market, 25-54, shared moments seekers",
    values: ["Authenticity", "Happiness", "Togetherness", "Refreshment"],
    keyMessage: "Real Magic",
    color: "red",
  },
  {
    name: "Coca-Cola Zero Sugar",
    positioning: "Great Coca-Cola taste, zero sugar, zero compromise",
    targetAudience: "Health-conscious adults 18-34, Gen Z & Millennials",
    values: ["Bold", "Confident", "Modern", "Guilt-free enjoyment"],
    keyMessage: "Best Coke Ever?",
    color: "red",
  },
  {
    name: "Fanta",
    positioning: "Playful, fruity fun for the young at heart",
    targetAudience: "Teens and young adults 13-24, fun seekers",
    values: ["Playfulness", "Color", "Energy", "Self-expression"],
    keyMessage: "More Fanta, Less Serious",
    color: "amber",
  },
  {
    name: "Sprite",
    positioning: "Cut through the BS with crisp, clean refreshment",
    targetAudience: "Urban youth 16-30, culture creators",
    values: ["Authenticity", "Freshness", "Street culture", "Boldness"],
    keyMessage: "Obey Your Thirst",
    color: "emerald",
  },
]

const strategicPriorities = [
  {
    title: "Shift to Digital-First",
    description: "Reallocate 40% of media spend to social and digital channels by 2027",
    status: "in-progress",
    initiatives: ["TikTok Campaign for Coke Zero", "Meta Brand Lift Study"],
  },
  {
    title: "Affordability Perception",
    description: "Improve value perception through smart pack-price architecture",
    status: "in-progress",
    initiatives: ["Multi-pack Value Campaign", "Everyday Low Price Messaging"],
  },
  {
    title: "Gen Z Fan Base",
    description: "Build emotional connection with 18-24 demographic through cultural relevance",
    status: "planned",
    initiatives: ["Creator Partnerships", "Gaming Sponsorships"],
  },
]

const colorConfig = {
  red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
}

export function MarketingBrandStrategy({ onNavigate }: BrandStrategyProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Brand Strategy</h1>
          <p className="text-xs text-zinc-500 mt-1">Brand positioning, values, and target audiences</p>
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
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-blue-500">
          Brand Strategy
        </button>
        <button 
          onClick={() => onNavigate?.("communication-strategy")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
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

      {/* Strategic Priorities */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            Strategic Priorities 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {strategicPriorities.map((priority, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-zinc-100">{priority.title}</h3>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px]",
                      priority.status === "in-progress" 
                        ? "text-blue-400 border-blue-500/20" 
                        : "text-zinc-400 border-zinc-700"
                    )}
                  >
                    {priority.status === "in-progress" ? "In Progress" : "Planned"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mb-3">{priority.description}</p>
                <div className="space-y-1">
                  {priority.initiatives.map((init, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      {init}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-300">Brand Portfolio</h2>
        <div className="grid grid-cols-2 gap-4">
          {brands.map((brand) => {
            const colors = colorConfig[brand.color as keyof typeof colorConfig]
            return (
              <Card key={brand.name} className={cn("border", colors.bg, colors.border)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{brand.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 italic">"{brand.keyMessage}"</p>
                    </div>
                    <Target className={cn("h-5 w-5", colors.text)} />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">Positioning</p>
                      <p className="text-sm text-zinc-300">{brand.positioning}</p>
                    </div>
                    
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">Target Audience</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-zinc-500" />
                        <p className="text-sm text-zinc-300">{brand.targetAudience}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Brand Values</p>
                      <div className="flex flex-wrap gap-1.5">
                        {brand.values.map((value, idx) => (
                          <Badge key={idx} variant="outline" className={cn("text-[10px]", colors.text, colors.border)}>
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button 
          onClick={() => onNavigate?.("communication-strategy")}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          Continue to Communication Strategy <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
