"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Scale, 
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  Users,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Decision {
  id: string
  title: string
  type: "strategic" | "investment" | "operational"
  status: "taken" | "pending"
  date: string
  forum: string
  owner: string
  outcome?: string
  nextSteps?: string
}

const decisionsTaken: Decision[] = [
  {
    id: "1",
    title: "Approve Zero Sugar Leadership as primary growth lever",
    type: "strategic",
    status: "taken",
    date: "Jan 15, 2024",
    forum: "SteerCo",
    owner: "Europe President",
    outcome: "Approved with €150M investment envelope",
    nextSteps: "Cascade to country teams by Feb 1"
  },
  {
    id: "2",
    title: "Deprioritize Traditional Juice category in Nordics",
    type: "strategic",
    status: "taken",
    date: "Jan 10, 2024",
    forum: "SteerCo",
    owner: "Strategy Director",
    outcome: "Exit plan approved; maintain only top 3 SKUs",
    nextSteps: "Communication to trade partners"
  },
  {
    id: "3",
    title: "Energy convenience cooler expansion Phase 1",
    type: "investment",
    status: "taken",
    date: "Dec 20, 2023",
    forum: "System Working Session",
    owner: "CCEP Commercial",
    outcome: "5,000 coolers approved for GB/DE",
    nextSteps: "Rollout in progress; Phase 2 review Q2"
  },
]

const decisionsPending: Decision[] = [
  {
    id: "4",
    title: "Topo Chico Hard Seltzer France launch — Go/No-Go",
    type: "strategic",
    status: "pending",
    date: "Feb 28, 2024",
    forum: "SteerCo",
    owner: "France GM",
    nextSteps: "Final business case due Feb 20"
  },
  {
    id: "5",
    title: "Value pack architecture for Southern Europe",
    type: "investment",
    status: "pending",
    date: "Mar 15, 2024",
    forum: "Pricing Committee",
    owner: "RGM Director",
    nextSteps: "Trade-off analysis in progress"
  },
  {
    id: "6",
    title: "Costa RTD supply chain investment — €25M approval",
    type: "investment",
    status: "pending",
    date: "Mar 15, 2024",
    forum: "System Working Session",
    owner: "Supply Chain Director",
    nextSteps: "Bottler alignment discussions ongoing"
  },
]

interface Forum {
  name: string
  date: string
  agenda: string[]
  participants: string
}

const upcomingForums: Forum[] = [
  {
    name: "Europe SteerCo",
    date: "Feb 28, 2024",
    agenda: [
      "ARTD France launch decision",
      "Q1 performance review",
      "2025 planning parameters"
    ],
    participants: "TCCC Leadership + Bottler CEOs"
  },
  {
    name: "System Working Session",
    date: "Mar 15, 2024",
    agenda: [
      "Costa RTD investment approval",
      "Execution dashboard review",
      "Capability gaps assessment"
    ],
    participants: "Commercial & Operations leads"
  },
  {
    name: "Marketing Board",
    date: "Feb 15, 2024",
    agenda: [
      "Zero campaign creative sign-off",
      "Media allocation review",
      "Brand health metrics"
    ],
    participants: "CMOs and Brand Directors"
  },
]

const typeConfig = {
  strategic: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  investment: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  operational: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
}

export function DecisionsGovernanceScreen() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Decisions & Governance</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Decisions taken, decisions pending, and upcoming governance forums
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">{decisionsTaken.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Decisions Taken</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-400/30" />
            </div>
            <p className="text-xs text-zinc-500 mt-3">This cycle</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{decisionsPending.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Decisions Pending</p>
              </div>
              <Clock className="h-8 w-8 text-amber-400/30" />
            </div>
            <p className="text-xs text-zinc-500 mt-3">Awaiting forums</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">{upcomingForums.length}</p>
                <p className="text-sm text-zinc-400 mt-1">Upcoming Forums</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400/30" />
            </div>
            <p className="text-xs text-zinc-500 mt-3">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decisions Taken */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Decisions Taken
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {decisionsTaken.map((decision) => {
              const config = typeConfig[decision.type]
              return (
                <div 
                  key={decision.id}
                  className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-sm font-medium text-zinc-100">{decision.title}</h4>
                    <Badge variant="outline" className={cn("text-[10px] flex-shrink-0", config.color, config.border)}>
                      {decision.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                    <span>{decision.date}</span>
                    <span>•</span>
                    <span>{decision.forum}</span>
                    <span>•</span>
                    <span>{decision.owner}</span>
                  </div>
                  {decision.outcome && (
                    <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10 mb-2">
                      <p className="text-xs text-emerald-400">{decision.outcome}</p>
                    </div>
                  )}
                  {decision.nextSteps && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <ArrowRight className="h-3 w-3" />
                      {decision.nextSteps}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Decisions Pending */}
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Decisions Pending
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {decisionsPending.map((decision) => {
              const config = typeConfig[decision.type]
              return (
                <div 
                  key={decision.id}
                  className="p-4 rounded-lg bg-zinc-800/30 border border-amber-500/10"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-sm font-medium text-zinc-100">{decision.title}</h4>
                    <Badge variant="outline" className={cn("text-[10px] flex-shrink-0", config.color, config.border)}>
                      {decision.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                    <span className="text-amber-400">{decision.date}</span>
                    <span>•</span>
                    <span>{decision.forum}</span>
                    <span>•</span>
                    <span>{decision.owner}</span>
                  </div>
                  {decision.nextSteps && (
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <AlertCircle className="h-3 w-3 text-amber-400" />
                      {decision.nextSteps}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Forums */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Upcoming Governance Forums
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {upcomingForums.map((forum, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-zinc-100">{forum.name}</h4>
                  <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                    {forum.date}
                  </Badge>
                </div>
                <div className="space-y-2 mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">Agenda</p>
                  {forum.agenda.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="text-zinc-600">{i + 1}.</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-zinc-700/50">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Users className="h-3 w-3" />
                    {forum.participants}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
