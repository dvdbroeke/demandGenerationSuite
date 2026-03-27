"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Target,
  Layers,
  GitCompare,
  Lightbulb,
  TrendingUp,
  MapPin,
  CheckCircle2
} from "lucide-react"

interface CountryPartitionDeepDiveProps {
  country: string
  onBack: () => void
}

// Country-specific data
const countryData: Record<string, {
  displayName: string
  whereToPlay: {
    title: string
    items: string[]
  }
  structuralTruths: {
    title: string
    items: string[]
  }
  marketDifferences: {
    title: string
    items: string[]
  }
  howToWin: {
    title: string
    items: string[]
  }
  comparisons: {
    market: string
    driver: string
  }[]
}> = {
  "gb": {
    displayName: "Great Britain",
    whereToPlay: {
      title: "Where to Play (GB)",
      items: [
        "Zero Cola, Cherry/Bold, and Energy drive >100% of volume growth",
        "Cola & Energy are separate partitions (some overlap on 500ml)",
        "Regular, Diet, and Zero are distinct partitions (Gen Z more interchangeable)",
        "Advanced Hydration is a sizeable, under-measured partition"
      ]
    },
    structuralTruths: {
      title: "What Is Structurally True",
      items: [
        "Penetration is the primary growth driver",
        "High churn and overlap across partitions",
        "Mental availability, OBPPC, and physical availability all required",
        "AFH recovery still incomplete post-COVID"
      ]
    },
    marketDifferences: {
      title: "How GB Differs vs Other Markets",
      items: [
        "Flavour (esp. Cherry/Bold) is a primary driver of incrementality",
        "Pack size is less dominant than in Italy",
        "Brand B substitution logic differs vs Brand A when Zero variant is absent",
        "Strong convenience channel reliance for impulse occasions"
      ]
    },
    howToWin: {
      title: "Implications for How to Win",
      items: [
        "Strengthen Brand B differentiation vs Brand A",
        "Ensure media sufficiency for CCZS",
        "Close Zero distribution gaps in independents and forecourts",
        "Build Cherry and Caffeine-free scale in AH and AFH"
      ]
    },
    comparisons: [
      { market: "Italy", driver: "Pack size and calorie level drive incrementality" },
      { market: "Germany", driver: "Brand loyalty and routine drive incrementality" },
      { market: "GB", driver: "Flavour and occasion drive incrementality" }
    ]
  },
  "it": {
    displayName: "Italy",
    whereToPlay: {
      title: "Where to Play (IT)",
      items: [
        "Cola Regular remains dominant but Zero gaining fast",
        "Pack size architecture is primary incrementality driver",
        "Energy underdeveloped vs other markets — growth opportunity",
        "Nutrition/Protein emerging in metro areas"
      ]
    },
    structuralTruths: {
      title: "What Is Structurally True",
      items: [
        "Meal occasions dominate — family pack is critical",
        "Strong retailer concentration in North vs fragmented South",
        "Calorie concerns accelerating in under-35 demographic",
        "Traditional grocery still significant channel"
      ]
    },
    marketDifferences: {
      title: "How IT Differs vs Other Markets",
      items: [
        "Pack size architecture drives incrementality (not flavour)",
        "1.5L and 2L multipacks outperform vs GB single-serve focus",
        "Zero sugar adoption slower than Northern Europe",
        "Less convenience channel development than GB/DE"
      ]
    },
    howToWin: {
      title: "Implications for How to Win",
      items: [
        "Optimize OBPPC for meal occasions",
        "Accelerate Zero adoption through value positioning",
        "Build Energy category from low base",
        "Expand convenience presence in metro areas"
      ]
    },
    comparisons: [
      { market: "GB", driver: "Flavour and occasion drive incrementality" },
      { market: "Italy", driver: "Pack size and calorie level drive incrementality" },
      { market: "France", driver: "Health positioning and premium drive incrementality" }
    ]
  },
  "de": {
    displayName: "Germany",
    whereToPlay: {
      title: "Where to Play (DE)",
      items: [
        "Cola Zero is market leader in zero-sugar — defend position",
        "Energy highly competitive — Competitor X/Competitor Y pressure",
        "Advanced Hydration growing from strong base",
        "Nutrition/Protein most developed in Europe"
      ]
    },
    structuralTruths: {
      title: "What Is Structurally True",
      items: [
        "Brand loyalty is higher than other markets",
        "Discounter channel dominates retail landscape",
        "Sustainability concerns influence purchase decisions",
        "Routine consumption patterns more stable"
      ]
    },
    marketDifferences: {
      title: "How DE Differs vs Other Markets",
      items: [
        "Brand loyalty and routine drive incrementality",
        "Discounter presence requires different pack/price strategy",
        "Zero sugar already mainstream — less upside vs GB/IT",
        "Sustainability messaging more important than taste"
      ]
    },
    howToWin: {
      title: "Implications for How to Win",
      items: [
        "Defend Zero leadership against Pepsi Max",
        "Win in discounter with right pack/price architecture",
        "Lead sustainability narrative",
        "Accelerate Nutrition/Protein as first-mover"
      ]
    },
    comparisons: [
      { market: "GB", driver: "Flavour and occasion drive incrementality" },
      { market: "Germany", driver: "Brand loyalty and routine drive incrementality" },
      { market: "Spain", driver: "Price and promotion drive incrementality" }
    ]
  },
  "fr": {
    displayName: "France",
    whereToPlay: {
      title: "Where to Play (FR)",
      items: [
        "Zero Cola growing but from smaller base than DE",
        "Premium positioning resonates — opportunity for innovation",
        "Energy underpenetrated vs Northern Europe",
        "Health/wellness positioning critical for recruitment"
      ]
    },
    structuralTruths: {
      title: "What Is Structurally True",
      items: [
        "Health concerns paramount — sugar tax impact visible",
        "Premium/quality positioning outperforms value",
        "AFH/HoReCa significant channel — tourism tailwind",
        "Private label pressure in grocery"
      ]
    },
    marketDifferences: {
      title: "How FR Differs vs Other Markets",
      items: [
        "Health positioning and premium drive incrementality",
        "Sugar tax created structural shift earlier than other markets",
        "Less price sensitive than Spain/Italy",
        "Innovation receptivity higher for health claims"
      ]
    },
    howToWin: {
      title: "Implications for How to Win",
      items: [
        "Lead with health/wellness positioning",
        "Accelerate Zero conversion — room to grow",
        "Build premium innovation pipeline",
        "Expand AFH presence in tourism corridors"
      ]
    },
    comparisons: [
      { market: "France", driver: "Health positioning and premium drive incrementality" },
      { market: "Spain", driver: "Price and promotion drive incrementality" },
      { market: "GB", driver: "Flavour and occasion drive incrementality" }
    ]
  },
  "sp": {
    displayName: "Spain",
    whereToPlay: {
      title: "Where to Play (ES)",
      items: [
        "Cola Regular still strong — Zero conversion opportunity",
        "Energy growing fast from low base",
        "Strong AFH/tourism channel — seasonal peaks",
        "Price sensitivity higher than Northern Europe"
      ]
    },
    structuralTruths: {
      title: "What Is Structurally True",
      items: [
        "Price and promotion heavily influence choice",
        "Seasonal patterns pronounced — tourism drives Q2-Q3",
        "Traditional trade still significant in some regions",
        "Economic sensitivity impacts category mix"
      ]
    },
    marketDifferences: {
      title: "How ES Differs vs Other Markets",
      items: [
        "Price and promotion drive incrementality",
        "Zero sugar adoption slower — value positioning needed",
        "Tourism creates unique AFH opportunity",
        "Regional fragmentation requires tailored approach"
      ]
    },
    howToWin: {
      title: "Implications for How to Win",
      items: [
        "Accelerate Zero conversion through value messaging",
        "Optimize promotional calendar for seasonality",
        "Capture tourism occasions in AFH",
        "Build Energy from growing base"
      ]
    },
    comparisons: [
      { market: "Spain", driver: "Price and promotion drive incrementality" },
      { market: "Italy", driver: "Pack size and calorie level drive incrementality" },
      { market: "Germany", driver: "Brand loyalty and routine drive incrementality" }
    ]
  }
}

export function CountryPartitionDeepDive({ country, onBack }: CountryPartitionDeepDiveProps) {
  const data = countryData[country]

  if (!data) {
    return (
      <div className="p-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Europe View
        </Button>
        <p className="text-zinc-400">Country data not available.</p>
      </div>
    )
  }

  const sectionIcons = [
    { icon: Target, color: "text-teal-400", bgColor: "bg-teal-500/10" },
    { icon: Layers, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { icon: GitCompare, color: "text-amber-400", bgColor: "bg-amber-500/10" },
    { icon: Lightbulb, color: "text-emerald-400", bgColor: "bg-emerald-500/10" }
  ]

  const sections = [
    data.whereToPlay,
    data.structuralTruths,
    data.marketDifferences,
    data.howToWin
  ]

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-zinc-400 hover:text-zinc-100 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Europe View
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">
              {data.displayName} — Consumer Partitions Deep-Dive
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Market-specific partition dynamics and strategic implications
            </p>
          </div>
        </div>
      </div>

      {/* Four Section Grid */}
      <div className="grid grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const IconComponent = sectionIcons[index].icon
          return (
            <Card 
              key={section.title}
              className="p-6 bg-zinc-900/50 border-zinc-800/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-lg ${sectionIcons[index].bgColor} flex items-center justify-center`}>
                  <IconComponent className={`h-4 w-4 ${sectionIcons[index].color}`} />
                </div>
                <h2 className="text-sm font-medium text-zinc-100">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>

      {/* Comparative Context Panel */}
      <Card className="p-6 bg-zinc-900/50 border-zinc-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <GitCompare className="h-4 w-4 text-purple-400" />
          </div>
          <h2 className="text-sm font-medium text-zinc-100">
            How This Differs from Other Markets
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Understanding incrementality drivers by market is essential for de-averaged strategy
        </p>
        <div className="grid grid-cols-3 gap-4">
          {data.comparisons.map((comparison) => (
            <div 
              key={comparison.market}
              className={`p-4 rounded-lg border ${
                comparison.market === data.displayName || comparison.market === country.toUpperCase()
                  ? "bg-teal-500/5 border-teal-500/30"
                  : "bg-zinc-800/30 border-zinc-700/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    comparison.market === data.displayName || comparison.market === country.toUpperCase()
                      ? "border-teal-500/30 bg-teal-500/10 text-teal-400"
                      : "border-zinc-600 text-zinc-400"
                  }`}
                >
                  {comparison.market}
                </Badge>
                {(comparison.market === data.displayName || comparison.market === country.toUpperCase()) && (
                  <span className="text-[10px] text-teal-400">Current</span>
                )}
              </div>
              <p className="text-sm text-zinc-300">{comparison.driver}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Strategic Implication Banner */}
      <Card className="p-6 bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-100 mb-2">
              Why Country-Specific Strategy Matters
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Europe-wide partition views reveal common growth patterns, but the drivers of incrementality 
              differ materially by country. What works in {data.displayName} — where {
                data.comparisons.find(c => c.market === data.displayName || c.market === country.toUpperCase())?.driver.toLowerCase()
              } — may not transfer directly to other markets. 
              Strategy requires de-averaging Europe.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
