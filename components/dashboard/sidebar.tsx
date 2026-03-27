"use client"

import React from "react"

import { cn } from "@/lib/utils"
import {
  Briefcase,
  Home,
  Lock,
} from "lucide-react"
import { ArtemisLogo, BAMLogo, RGMLogo, CommercialLogo, CompanyLogo } from "@/components/ui/platform-logos"

export type Platform = "bam" | "fuelight" | "prescriptive" | "commercial" | "initiatives" | "tpo" | "ppa" | "mix"

export type BAMScreen = "overview" | "partitions-heatmap" | "partition-tree" | "market-map" | "key-insights"

interface SidebarProps {
  activePlatform: Platform | null
  bamScreen?: BAMScreen
  onNavigate: (platform: Platform) => void
  onNavigateBAM?: (screen: BAMScreen) => void
  onGoHome: () => void
}

const intelligentEnterprisePlatforms = [
  {
    id: "bam" as Platform,
    name: "Rules of Category & Partitions",
    Logo: BAMLogo,
    color: "amber",
    available: true,
  },
  {
    id: "prescriptive" as Platform,
    name: "Performance Management",
    Logo: RGMLogo,
    color: "blue",
    available: true,
  },
  {
    id: "fuelight" as Platform,
    name: "Resource Allocation (Artemis)",
    Logo: ArtemisLogo,
    color: "emerald",
    available: true,
  },
]

const rgmPlatforms = [
  {
    id: "ppa" as Platform,
    name: "Price",
    Logo: RGMLogo,
    color: "green",
    available: true,
  },
  {
    id: "mix" as Platform,
    name: "Assortment & Mix",
    Logo: RGMLogo,
    color: "green",
    available: true,
  },
  {
    id: "tpo" as Platform,
    name: "Promotion",
    Logo: CommercialLogo,
    color: "green",
    available: true,
  },
]

const colorClasses = {
  amber: {
    active: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: "text-amber-400",
    iconBg: "bg-amber-500/20",
  },
  emerald: {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
  blue: {
    active: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "text-blue-400",
    iconBg: "bg-blue-500/20",
  },
  green: {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
}

import {
  LayoutDashboard,
  Grid3X3,
  GitBranch,
  Map,
  Lightbulb,
} from "lucide-react"

const bamScreens = [
  { id: "overview" as BAMScreen, name: "Overview", icon: LayoutDashboard },
  { id: "partitions-heatmap" as BAMScreen, name: "Partitions Heatmap", icon: Grid3X3 },
  { id: "partition-tree" as BAMScreen, name: "Partition Tree", icon: GitBranch },
  { id: "market-map" as BAMScreen, name: "Market Map", icon: Map },
  { id: "key-insights" as BAMScreen, name: "AI-Driven Insights", icon: Lightbulb },
]

function PlatformButton({
  platform,
  isActive,
  onNavigate,
}: {
  platform: { id: Platform; name: string; Logo: React.ComponentType<{ size?: string | number }>; color: string; available: boolean }
  isActive: boolean
  onNavigate: (id: Platform) => void
}) {
  const Logo = platform.Logo
  const colors = colorClasses[platform.color as keyof typeof colorClasses]

  return (
    <button
      onClick={() => platform.available && onNavigate(platform.id)}
      disabled={!platform.available}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
        platform.available
          ? isActive
            ? `${colors.active} border`
            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
          : "text-zinc-600 cursor-not-allowed opacity-50"
      )}
    >
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        <Logo size="sm" />
      </div>
      <span className="font-medium flex-1 text-left text-xs">
        {platform.name}
      </span>
      {!platform.available && (
        <Lock className="h-3 w-3 text-zinc-600" />
      )}
    </button>
  )
}

export function Sidebar({
  activePlatform,
  bamScreen,
  onNavigate,
  onNavigateBAM,
  onGoHome,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/50 flex flex-col">
      
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800/50">
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
        >
          <CompanyLogo size={36} className="flex-shrink-0" />
          <div className="text-left">
            <h1 className="text-xs font-semibold text-zinc-100">
              Enterprise System
            </h1>
            <p className="text-[10px] text-zinc-500">
              Decision Intelligence
            </p>
          </div>
        </button>
      </div>

      {/* Home Button */}
      <div className="p-3">
        <button
          onClick={onGoHome}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            activePlatform === null
              ? "bg-zinc-800/50 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
          )}
        >
          <Home className="h-4 w-4" />
          <span className="font-medium">Home</span>
        </button>
      </div>

      {/* Intelligent Enterprise Section */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-auto">
        <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold px-3 mb-2">
          Intelligent Enterprise
        </p>

        {intelligentEnterprisePlatforms.map((platform) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isActive={activePlatform === platform.id}
            onNavigate={onNavigate}
          />
        ))}

        {/* RGM Section */}
        <div className="pt-3 mt-2">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold px-3 mb-2">
            Revenue Growth Management
          </p>
          {rgmPlatforms.map((platform) => (
            <PlatformButton
              key={platform.id}
              platform={platform}
              isActive={activePlatform === platform.id}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      {/* Initiatives (Always accessible) */}
      <div className="px-3 pb-3 border-t border-zinc-800/50 pt-3">
        <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-semibold px-3 mb-2">
          Transversal
        </p>
        <button
          onClick={() => onNavigate("initiatives")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            activePlatform === "initiatives"
              ? "bg-zinc-800/50 text-zinc-100 border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
          )}
        >
          <Briefcase className="h-4 w-4" />
          <span className="font-medium flex-1 text-left">
            Initiatives Portfolio
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/50">
        <div className="px-3 py-2 rounded-lg bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-zinc-400">
              System connected
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
