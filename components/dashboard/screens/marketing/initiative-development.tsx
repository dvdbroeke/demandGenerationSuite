"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Lightbulb,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Play,
  ChevronRight,
  Sparkles,
  DollarSign,
  Users,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketingScreen } from "./overview"

interface InitiativeDevelopmentProps {
  onNavigate?: (screen: MarketingScreen) => void
}

type InitiativeStage = "ideation" | "development" | "pilot" | "scale" | "optimize"

interface Initiative {
  id: string
  name: string
  description: string
  stage: InitiativeStage
  priority: "high" | "medium" | "low"
  brand: string
  owner: string
  budget: string
  expectedROI: string
  timeline: string
  keyActions: string[]
  metrics: { label: string; value: string }[]
}

const initiatives: Initiative[] = [
  {
    id: "1",
    name: "TikTok Media Campaign for Brand B",
    description: "Shift media investment to social channels with creator partnerships and viral challenge mechanics to build mental availability among Gen Z",
    stage: "pilot",
    priority: "high",
    brand: "Brand B",
    owner: "Sarah Chen",
    budget: "€2.4M",
    expectedROI: "3.5x",
    timeline: "Q1-Q2 2026",
    keyActions: [
      "Partner with 15 TikTok creators (50K-500K followers)",
      "Launch #BestChoiceEver challenge",
      "A/B test short-form content formats",
      "Implement real-time engagement tracking",
    ],
    metrics: [
      { label: "Target Views", value: "50M" },
      { label: "Engagement Rate", value: "8%+" },
      { label: "Trial Lift", value: "+5%" },
    ],
  },
  {
    id: "2",
    name: "Perceived Affordability Campaign",
    description: "Improve value perception through smart messaging architecture highlighting multi-pack value and everyday affordability moments",
    stage: "development",
    priority: "high",
    brand: "Brand Portfolio",
    owner: "Marcus Johnson",
    budget: "€1.8M",
    expectedROI: "2.2x",
    timeline: "Q2-Q3 2026",
    keyActions: [
      "Develop 'Everyday Treats' messaging platform",
      "Create multi-pack value communication",
      "Partner with grocery retailers on POS materials",
      "Launch comparative value calculator tool",
    ],
    metrics: [
      { label: "Value Perception", value: "+12%" },
      { label: "Price Sensitivity", value: "-8%" },
      { label: "Purchase Intent", value: "+6%" },
    ],
  },
  {
    id: "3",
    name: "YouTube Brand Storytelling",
    description: "Long-form content strategy for emotional brand building through documentary-style storytelling",
    stage: "ideation",
    priority: "medium",
    brand: "Brand A",
    owner: "Emma Williams",
    budget: "€1.2M",
    expectedROI: "1.8x",
    timeline: "Q3 2026",
    keyActions: [
      "Identify compelling community stories",
      "Partner with documentary filmmakers",
      "Develop 'Real Magic, Real Stories' series",
      "Create supplementary social content",
    ],
    metrics: [
      { label: "Brand Love", value: "+4%" },
      { label: "Watch Time", value: "10M hrs" },
      { label: "Share Rate", value: "3%+" },
    ],
  },
  {
    id: "4",
    name: "Gaming Community Integration",
    description: "Build presence in gaming culture through esports sponsorships and in-game activations",
    stage: "ideation",
    priority: "medium",
    brand: "Brand B",
    owner: "Alex Rivera",
    budget: "€800K",
    expectedROI: "2.5x",
    timeline: "Q4 2026",
    keyActions: [
      "Secure esports team partnership",
      "Develop in-game branded experiences",
      "Launch Twitch streamer program",
      "Create limited edition gaming packs",
    ],
    metrics: [
      { label: "Gaming Audience Reach", value: "20M" },
      { label: "Brand Association", value: "+15%" },
      { label: "18-24 Awareness", value: "+8%" },
    ],
  },
]

const stageConfig: Record<InitiativeStage, { label: string; color: string; bg: string; border: string; icon: typeof Lightbulb }> = {
  ideation: { label: "Ideation", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: Lightbulb },
  development: { label: "Development", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Target },
  pilot: { label: "Pilot", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Play },
  scale: { label: "Scale", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: TrendingUp },
  optimize: { label: "Optimize", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", icon: Zap },
}

const stages: InitiativeStage[] = ["ideation", "development", "pilot", "scale", "optimize"]

export function MarketingInitiativeDevelopment({ onNavigate }: InitiativeDevelopmentProps) {
  const getInitiativesByStage = (stage: InitiativeStage) => 
    initiatives.filter(i => i.stage === stage)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Initiative Development</h1>
          <p className="text-xs text-zinc-500 mt-1">Track and develop marketing initiatives across stages</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Lightbulb className="h-4 w-4 mr-2" />
          New Initiative
        </Button>
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
        <button 
          onClick={() => onNavigate?.("communication-plan")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Communication Plan
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-blue-500">
          Initiative Development
        </button>
      </div>

      {/* Stage Pipeline */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-zinc-100">Initiative Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {stages.map((stage, idx) => {
              const config = stageConfig[stage]
              const count = getInitiativesByStage(stage).length
              const Icon = config.icon
              return (
                <div key={stage} className="flex items-center">
                  <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg", config.bg, config.border, "border")}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                    <span className="text-sm font-medium text-zinc-100">{config.label}</span>
                    <Badge variant="outline" className={cn("text-[10px] ml-1", config.color, config.border)}>
                      {count}
                    </Badge>
                  </div>
                  {idx < stages.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-zinc-600 mx-1" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Initiative Cards */}
      <div className="space-y-4">
        {initiatives.map((initiative) => {
          const config = stageConfig[initiative.stage]
          const StageIcon = config.icon
          
          return (
            <Card key={initiative.id} className={cn("border hover:border-zinc-600 transition-all", config.bg, config.border)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", config.bg)}>
                      <StageIcon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={cn("text-[10px]", config.color, config.border)}>
                          {config.label}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px]",
                            initiative.priority === "high" 
                              ? "text-red-400 border-red-500/20" 
                              : "text-zinc-400 border-zinc-700"
                          )}
                        >
                          {initiative.priority} priority
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-100">{initiative.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{initiative.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-lg font-bold">{initiative.expectedROI}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Expected ROI</p>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 mb-4">{initiative.description}</p>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <Users className="h-3 w-3" />
                      <span className="text-[10px]">Owner</span>
                    </div>
                    <p className="text-sm text-zinc-100">{initiative.owner}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-[10px]">Budget</span>
                    </div>
                    <p className="text-sm text-zinc-100">{initiative.budget}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px]">Timeline</span>
                    </div>
                    <p className="text-sm text-zinc-100">{initiative.timeline}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-[10px]">Target Metrics</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {initiative.metrics.map((m, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] text-zinc-300 border-zinc-700">
                          {m.label}: {m.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-700/50 pt-4">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-2">Key Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {initiative.keyActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className={cn("h-3.5 w-3.5 mt-0.5 flex-shrink-0", config.color)} />
                        <span className="text-xs text-zinc-300">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
