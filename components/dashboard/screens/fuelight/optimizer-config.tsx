"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Zap, Eye, Pencil, ChevronDown, Plus, X, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { ArtemisLogo } from "@/components/ui/platform-logos"

interface OptimizerConfigProps {
  onNavigateToView?: () => void
  onNavigateToEdit?: () => void
  onRunOptimization: (config: {
    brand: string
    dateRange: string
    fundingAmount: string
    channelConstraint: string
  }) => void
}

const fundingSources = [
  { value: "brand-owner", label: "Brand Owner Funding" },
  { value: "system", label: "System Funding" },
  { value: "partner", label: "Partner Funding" },
]

const outcomeMetrics = [
  { value: "sell-out-volume", label: "Sell-out Volume" },
  { value: "system-nsr", label: "System NSR" },
  { value: "system-gp", label: "System GP" },
  { value: "market-share", label: "Market Share" },
]

const investmentAreas = [
  { value: "all", label: "All Investment Areas" },
  { value: "consumer-paid", label: "Consumer (Paid)" },
  { value: "consumer-earned", label: "Consumer (Earned)" },
  { value: "shopper", label: "Shopper" },
]

interface Goal {
  id: string
  metric: string
  target: string
}

interface Constraint {
  id: string
  type: string
  value: string
}

export function FuelightOptimizerConfig({ 
  onNavigateToView,
  onNavigateToEdit,
  onRunOptimization,
}: OptimizerConfigProps) {
  const [scenarioName, setScenarioName] = useState("Demo Optimization")
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-12-31")
  const [fundingSource, setFundingSource] = useState("brand-owner")
  const [approach, setApproach] = useState<"flexible" | "fixed">("flexible")
  const [outcomeMetric, setOutcomeMetric] = useState("")
  const [fundingTarget, setFundingTarget] = useState<"total" | "additional">("total")
  const [fundingAmount, setFundingAmount] = useState("")
  const [minimumAmount, setMinimumAmount] = useState("")
  const [investmentArea, setInvestmentArea] = useState("")
  const [additionalGoals, setAdditionalGoals] = useState<Goal[]>([])
  const [constraints, setConstraints] = useState<Constraint[]>([])

  const addGoal = () => {
    setAdditionalGoals([...additionalGoals, { id: crypto.randomUUID(), metric: "", target: "" }])
  }

  const removeGoal = (id: string) => {
    setAdditionalGoals(additionalGoals.filter(g => g.id !== id))
  }

  const addConstraint = () => {
    setConstraints([...constraints, { id: crypto.randomUUID(), type: "", value: "" }])
  }

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id))
  }

  const totalFunding = fundingAmount ? parseFloat(fundingAmount) : 780000000

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <ArtemisLogo size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="text-xl font-bold text-zinc-100 bg-transparent border-none outline-none focus:ring-1 focus:ring-emerald-500/50 rounded px-1 -ml-1"
                placeholder="Optimization Name"
              />
              <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-400 text-xs">
                Optimization
              </Badge>
            </div>
            <p className="text-xs text-zinc-500">Latest available data as of: 00/00/0000</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateToView}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-emerald-500 text-emerald-400 bg-emerald-500/10">
            <Zap className="h-4 w-4" />
            Optimize
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">DE</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">EUR</Badge>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">360</Badge>
        <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-full px-3 py-1">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent text-zinc-300 text-sm border-none outline-none w-28"
          />
          <span className="text-zinc-500">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent text-zinc-300 text-sm border-none outline-none w-28"
          />
        </div>
        <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 px-3 py-1">Brand A</Badge>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-12 pt-4">
        {/* Left Column - Section Title */}
        <div className="w-64 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-zinc-100 leading-tight">
            Optimization Funding<br />& Approach
          </h2>
        </div>

        {/* Right Column - Form Fields */}
        <div className="flex-1 max-w-3xl space-y-8">
          {/* Funding Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Funding Source</label>
            <Select value={fundingSource} onValueChange={setFundingSource}>
              <SelectTrigger className="w-full h-12 bg-zinc-800/50 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select funding source" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {fundingSources.map((source) => (
                  <SelectItem key={source.value} value={source.value} className="text-zinc-100 focus:bg-zinc-800">
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Approach */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300">Approach</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setApproach("flexible")}
                className={cn(
                  "p-5 rounded-lg border text-left transition-all",
                  approach === "flexible"
                    ? "bg-zinc-800/50 border-emerald-500/50"
                    : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5",
                    approach === "flexible" ? "border-emerald-400" : "border-zinc-600"
                  )}>
                    {approach === "flexible" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium",
                      approach === "flexible" ? "text-emerald-300" : "text-zinc-400"
                    )}>
                      Achieve a goal with flexible funding
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Define your goals and let Artemis determine the funding need and allocation.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setApproach("fixed")}
                className={cn(
                  "p-5 rounded-lg border text-left transition-all",
                  approach === "fixed"
                    ? "bg-zinc-800/50 border-emerald-500/50"
                    : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5",
                    approach === "fixed" ? "border-emerald-400" : "border-zinc-600"
                  )}>
                    {approach === "fixed" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium",
                      approach === "fixed" ? "text-emerald-300" : "text-zinc-400"
                    )}>
                      Maximize outcome with fixed funding
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Work with a set budget to get the best possible result.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Outcome Metric & Minimum Amount (for flexible) */}
          {approach === "flexible" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Outcome Metric</label>
                <Select value={outcomeMetric} onValueChange={setOutcomeMetric}>
                  <SelectTrigger className="w-full h-12 bg-zinc-800/50 border-zinc-700 text-zinc-100">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    {outcomeMetrics.map((metric) => (
                      <SelectItem key={metric.value} value={metric.value} className="text-zinc-100 focus:bg-zinc-800">
                        {metric.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Minimum Amount</label>
                <Input
                  type="text"
                  value={minimumAmount}
                  onChange={(e) => setMinimumAmount(e.target.value)}
                  placeholder="Enter minimum amount"
                  className="h-12 bg-zinc-800/50 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>
          )}

          {/* Outcome Metric (for fixed) */}
          {approach === "fixed" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Outcome Metric</label>
              <Select value={outcomeMetric} onValueChange={setOutcomeMetric}>
                <SelectTrigger className="w-full h-12 bg-zinc-800/50 border-zinc-700 text-zinc-100">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {outcomeMetrics.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value} className="text-zinc-100 focus:bg-zinc-800">
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Funding Target (for fixed) */}
          {approach === "fixed" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300">Funding Target</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFundingTarget("total")}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    fundingTarget === "total"
                      ? "bg-zinc-800/50 border-emerald-500/50"
                      : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      fundingTarget === "total" ? "border-emerald-400" : "border-zinc-600"
                    )}>
                      {fundingTarget === "total" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                    </div>
                    <span className={fundingTarget === "total" ? "text-zinc-100" : "text-zinc-400"}>
                      Optimize total funding
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setFundingTarget("additional")}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    fundingTarget === "additional"
                      ? "bg-zinc-800/50 border-emerald-500/50"
                      : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      fundingTarget === "additional" ? "border-emerald-400" : "border-zinc-600"
                    )}>
                      {fundingTarget === "additional" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                    </div>
                    <span className={fundingTarget === "additional" ? "text-zinc-100" : "text-zinc-400"}>
                      Optimize additional funding only
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Funding Amount (for fixed) */}
          {approach === "fixed" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Funding Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">EUR</span>
                <Input
                  type="text"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="Enter funding amount"
                  className="h-12 bg-zinc-800/50 border-zinc-700 text-zinc-100 pl-14"
                />
              </div>
              <p className="text-xs text-zinc-500">
                Updated Total Brand Owner Funding: EUR {totalFunding.toLocaleString()}
              </p>
            </div>
          )}

          {/* Investment Areas */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Investment Areas</label>
            <Select value={investmentArea} onValueChange={setInvestmentArea}>
              <SelectTrigger className="w-full h-12 bg-zinc-800/50 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select channels" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {investmentAreas.map((area) => (
                  <SelectItem key={area.value} value={area.value} className="text-zinc-100 focus:bg-zinc-800">
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Goals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Additional Goal(s)</label>
              <button 
                onClick={addGoal}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Add goal <Plus className="h-4 w-4" />
              </button>
            </div>
            {additionalGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <Input 
                  placeholder="Goal metric" 
                  className="flex-1 h-10 bg-zinc-800/50 border-zinc-700 text-zinc-100"
                  value={goal.metric}
                  onChange={(e) => {
                    setAdditionalGoals(additionalGoals.map(g => 
                      g.id === goal.id ? { ...g, metric: e.target.value } : g
                    ))
                  }}
                />
                <Input 
                  placeholder="Target value" 
                  className="w-32 h-10 bg-zinc-800/50 border-zinc-700 text-zinc-100"
                  value={goal.target}
                  onChange={(e) => {
                    setAdditionalGoals(additionalGoals.map(g => 
                      g.id === goal.id ? { ...g, target: e.target.value } : g
                    ))
                  }}
                />
                <button onClick={() => removeGoal(goal.id)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Constraint(s)</label>
              <button 
                onClick={addConstraint}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Add constraint <Plus className="h-4 w-4" />
              </button>
            </div>
            {constraints.map((constraint) => (
              <div key={constraint.id} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                <Input 
                  placeholder="Constraint type" 
                  className="flex-1 h-10 bg-zinc-800/50 border-zinc-700 text-zinc-100"
                  value={constraint.type}
                  onChange={(e) => {
                    setConstraints(constraints.map(c => 
                      c.id === constraint.id ? { ...c, type: e.target.value } : c
                    ))
                  }}
                />
                <Input 
                  placeholder="Value" 
                  className="w-32 h-10 bg-zinc-800/50 border-zinc-700 text-zinc-100"
                  value={constraint.value}
                  onChange={(e) => {
                    setConstraints(constraints.map(c => 
                      c.id === constraint.id ? { ...c, value: e.target.value } : c
                    ))
                  }}
                />
                <button onClick={() => removeConstraint(constraint.id)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Run Optimization Button */}
          <div className="pt-6">
            <Button
              onClick={() => onRunOptimization({
                brand: "coca-cola",
                dateRange: "2025",
                fundingAmount: fundingAmount || "780000000",
                channelConstraint: investmentArea || "all"
              })}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-zinc-900 font-semibold text-base"
            >
              <Zap className="h-5 w-5 mr-2" />
              Run Optimization
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
