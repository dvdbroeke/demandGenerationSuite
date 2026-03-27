"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Globe,
  Target,
  TrendingUp,
  ChevronRight,
  Users,
  Zap,
} from "lucide-react"

type Country = {
  code: string
  name: string
  archetype: "scale-leader" | "growth-engine" | "strategic-developer"
  strategicRole: string
  emphasis: "core-led" | "balanced" | "accelerator-led"
  mustWinMissions: string[]
  keyMetrics: {
    volumeShare: string
    growthRate: string
    systemAlignment: "aligned" | "partial" | "diverging"
  }
}

const countries: Country[] = [
  {
    code: "GB",
    name: "Great Britain",
    archetype: "scale-leader",
    strategicRole: "Defend leadership and set innovation precedent for Europe",
    emphasis: "balanced",
    mustWinMissions: [
      "Win Cola Zero vs Pepsi Max in AFH",
      "Scale Protein RTD via partnerships",
      "Defend Energy leadership position",
    ],
    keyMetrics: {
      volumeShare: "42%",
      growthRate: "+2.1%",
      systemAlignment: "aligned",
    },
  },
  {
    code: "DE",
    name: "Germany",
    archetype: "scale-leader",
    strategicRole: "Drive volume through affordability and modern trade excellence",
    emphasis: "core-led",
    mustWinMissions: [
      "Affordability packs in discounters",
      "Cola Zero penetration growth",
      "Build Advanced Hydration presence",
    ],
    keyMetrics: {
      volumeShare: "28%",
      growthRate: "+1.4%",
      systemAlignment: "aligned",
    },
  },
  {
    code: "FR",
    name: "France",
    archetype: "strategic-developer",
    strategicRole: "Premium positioning and coffee RTD leadership",
    emphasis: "balanced",
    mustWinMissions: [
      "Costa RTD expansion",
      "Premium cola positioning",
      "AFH recovery acceleration",
    ],
    keyMetrics: {
      volumeShare: "18%",
      growthRate: "+0.8%",
      systemAlignment: "partial",
    },
  },
  {
    code: "ES",
    name: "Spain",
    archetype: "growth-engine",
    strategicRole: "Energy and AFH growth acceleration",
    emphasis: "core-led",
    mustWinMissions: [
      "Energy on-premise development",
      "Tourism channel optimization",
      "Sugar reduction acceleration",
    ],
    keyMetrics: {
      volumeShare: "15%",
      growthRate: "+3.2%",
      systemAlignment: "aligned",
    },
  },
  {
    code: "IT",
    name: "Italy",
    archetype: "strategic-developer",
    strategicRole: "AFH excellence and premium portfolio development",
    emphasis: "balanced",
    mustWinMissions: [
      "AFH premium positioning",
      "Advanced Hydration growth",
      "Build coffee RTD presence",
    ],
    keyMetrics: {
      volumeShare: "12%",
      growthRate: "+1.1%",
      systemAlignment: "partial",
    },
  },
  {
    code: "PL",
    name: "Poland",
    archetype: "growth-engine",
    strategicRole: "Volume growth engine and Energy leadership",
    emphasis: "core-led",
    mustWinMissions: [
      "Fuel/Energy category dominance",
      "Convenience channel growth",
      "Drive Cola Zero adoption",
    ],
    keyMetrics: {
      volumeShare: "8%",
      growthRate: "+5.4%",
      systemAlignment: "aligned",
    },
  },
]

const archetypeColors = {
  "scale-leader": { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  "growth-engine": { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  "strategic-developer": { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
}

const archetypeLabels = {
  "scale-leader": "Scale Leader",
  "growth-engine": "Growth Engine",
  "strategic-developer": "Strategic Developer",
}

export function CountriesScreen() {
  const groupedCountries = {
    "scale-leader": countries.filter(c => c.archetype === "scale-leader"),
    "growth-engine": countries.filter(c => c.archetype === "growth-engine"),
    "strategic-developer": countries.filter(c => c.archetype === "strategic-developer"),
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-semibold text-zinc-100">
            Countries & Must-Win Missions
          </h1>
        </div>
        <div className="max-w-4xl">
          <p className="text-lg text-zinc-300 leading-relaxed">
            Differentiated country roles within the System. No one-size-fits-all — 
            each market has clear ownership, focus, and must-win missions.
          </p>
        </div>
      </div>

      {/* Key Principle */}
      <Card className="p-5 bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Users className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-100 mb-1">
              System Principle
            </h3>
            <p className="text-sm text-zinc-400">
              Countries are grouped by archetype to enable shared learning while 
              respecting local context. Clear accountability with coordinated execution.
            </p>
          </div>
        </div>
      </Card>

      {/* Countries by Archetype */}
      {Object.entries(groupedCountries).map(([archetype, countryList]) => {
        const colors = archetypeColors[archetype as keyof typeof archetypeColors]
        const label = archetypeLabels[archetype as keyof typeof archetypeLabels]
        
        return (
          <div key={archetype} className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={`${colors.bg} ${colors.border} ${colors.text}`}
              >
                {label}
              </Badge>
              <span className="text-xs text-zinc-600">{countryList.length} markets</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {countryList.map((country) => (
                <CountryCard key={country.code} country={country} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CountryCard({ country }: { country: Country }) {
  const colors = archetypeColors[country.archetype]
  
  return (
    <Card className="p-5 bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <span className={`text-lg font-bold ${colors.text}`}>{country.code}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-100">{country.name}</h3>
            <p className="text-xs text-zinc-500 capitalize">
              {country.emphasis.replace("-", " ")} emphasis
            </p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`text-xs ${
            country.keyMetrics.systemAlignment === "aligned"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : country.keyMetrics.systemAlignment === "partial"
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {country.keyMetrics.systemAlignment === "aligned" ? "Aligned" : 
           country.keyMetrics.systemAlignment === "partial" ? "Partial" : "Diverging"}
        </Badge>
      </div>

      <p className="text-sm text-zinc-400 mb-4">{country.strategicRole}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-y border-zinc-800/50">
        <div>
          <p className="text-xs text-zinc-600 mb-1">Volume Share</p>
          <p className="text-lg font-semibold text-zinc-100">{country.keyMetrics.volumeShare}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-600 mb-1">Growth Rate</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <p className="text-lg font-semibold text-emerald-400">{country.keyMetrics.growthRate}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-amber-400" />
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Must-Win Missions
          </h4>
        </div>
        <ul className="space-y-1.5">
          {country.mustWinMissions.map((mission, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
              <ChevronRight className="h-3 w-3 text-zinc-600 flex-shrink-0" />
              <span>{mission}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
