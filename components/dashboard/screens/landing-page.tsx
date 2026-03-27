"use client"

import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { CompanyLogo, BAMLogo, RGMLogo, ArtemisLogo, PriceLogo, MixLogo, PromoLogo } from "@/components/ui/platform-logos"

export type Platform = "bam" | "fuelight" | "prescriptive" | "commercial" | "tpo" | "ppa" | "mix"

interface LandingPageProps {
  onSelectPlatform: (platform: Platform) => void
  onNavigateToInitiatives: () => void
}

// Intelligent Enterprise Platforms - with generic icon logos
const intelligentEnterprise = [
  {
    id: "bam" as Platform,
    name: "Rules of the Category & Consumer Partitions",
    question: "Where should we play next to win?",
    Logo: BAMLogo,
  },
  {
    id: "prescriptive" as Platform,
    name: "Performance Management",
    question: "What must change this week to hit NSR/OI targets?",
    Logo: RGMLogo,
  },
  {
    id: "fuelight" as Platform,
    name: "Resource Allocation (Artemis)",
    question: "Where should we focus our next dollar invested?",
    Logo: ArtemisLogo,
  },
]

// RGM Pillars - with generic icon logos
const rgmPillars = [
  { 
    id: "ppa" as Platform, 
    name: "Price", 
    question: "What is the optimal price structure?",
    Logo: PriceLogo,
  },
  { 
    id: "mix" as Platform, 
    name: "Assortment & Mix", 
    question: "What mix optimizes customer and revenue coverage?",
    Logo: MixLogo,
  },
  { 
    id: "tpo" as Platform, 
    name: "Promotion", 
    question: "Which promotions will drive growth?",
    Logo: PromoLogo,
  },
]

export function LandingPage({
  onSelectPlatform,
}: LandingPageProps) {
  const [chatInput, setChatInput] = useState("")

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim()) {
      setChatInput("")
    }
  }

  return (
    <div className="flex flex-col h-full overflow-auto bg-zinc-950">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center pt-12 pb-6 px-6">
        {/* Company Logo */}
        <CompanyLogo size={200} />
        
        {/* Headline */}
        <h1 className="text-4xl font-bold text-zinc-100 mt-8 mb-8">
          How do you want to unlock growth today?
        </h1>
        
        {/* Search Input */}
        <form onSubmit={handleChatSubmit} className="w-full max-w-3xl mb-4">
          <div className="relative flex items-center bg-zinc-900 border border-zinc-700 rounded-full">
            <div className="flex items-center justify-center w-14 h-14 ml-3">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything... E.g. How can I optimize promotion spend for Brand A"
              className="flex-1 py-5 pr-4 bg-transparent text-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button 
              type="submit" 
              className="mr-3 p-4 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 transition-colors"
            >
              <Search className="h-6 w-6 text-white" />
            </button>
          </div>
        </form>
        
        {/* Tagline */}
        <p className="text-base text-zinc-500">
          Powered by AI to help you make data-driven business decisions
        </p>
      </div>

      {/* Main Content - Two Section Cards - Fit to Content */}
      <div className="flex justify-center px-8 pb-12 pt-6">
        <div className="flex gap-8 max-w-6xl w-full items-start">
          
          {/* LEFT: Intelligent Enterprise */}
          <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
            {/* Section Header */}
            <h2 className="text-center text-xl font-bold text-zinc-100 mb-6">
              Intelligent Enterprise
            </h2>
            
            {/* 3 Cards in a row */}
            <div className="grid grid-cols-3 gap-5">
              {intelligentEnterprise.map((platform) => {
                const Logo = platform.Logo
                return (
                  <button
                    key={platform.id}
                    onClick={() => onSelectPlatform(platform.id)}
                    className={cn(
                      "bg-zinc-900 rounded-xl p-5 flex flex-col items-center text-center transition-all border border-zinc-800",
                      "hover:bg-zinc-800/80 hover:border-red-600/50 hover:shadow-lg cursor-pointer active:scale-[0.98]"
                    )}
                  >
                    {/* Logo Icon */}
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                      <Logo size={64} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base font-semibold text-zinc-100 leading-tight mb-3 min-h-[3rem]">
                      {platform.name}
                    </h3>
                    
                    {/* Question */}
                    <p className="text-sm text-zinc-500 leading-relaxed mb-5 min-h-[2.5rem]">
                      {platform.question}
                    </p>
                    
                    {/* Open Button */}
                    <div className="w-full mt-auto">
                      <div className="bg-red-600 hover:bg-red-500 text-white text-base font-medium py-2.5 px-5 rounded-lg transition-colors">
                        Open
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT: RGM */}
          <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
            {/* Section Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h2 className="text-xl font-bold text-zinc-100">RGM</h2>
            </div>
            
            {/* 3 Cards in a row */}
            <div className="grid grid-cols-3 gap-5">
              {rgmPillars.map((pillar) => {
                const Logo = pillar.Logo
                return (
                  <button
                    key={pillar.id}
                    onClick={() => onSelectPlatform(pillar.id)}
                    className={cn(
                      "bg-zinc-900 rounded-xl p-5 flex flex-col items-center text-center transition-all border border-zinc-800",
                      "hover:bg-zinc-800/80 hover:border-red-600/50 hover:shadow-lg cursor-pointer active:scale-[0.98]"
                    )}
                  >
                    {/* Logo Icon */}
                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                      <Logo size={64} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-base font-semibold text-zinc-100 leading-tight mb-3 min-h-[1.5rem]">
                      {pillar.name}
                    </h3>
                    
                    {/* Question */}
                    <p className="text-sm text-zinc-500 leading-relaxed mb-5 min-h-[2.5rem]">
                      {pillar.question}
                    </p>
                    
                    {/* Open Button */}
                    <div className="w-full mt-auto">
                      <div className="bg-red-600 hover:bg-red-500 text-white text-base font-medium py-2.5 px-5 rounded-lg transition-colors">
                        Open
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
