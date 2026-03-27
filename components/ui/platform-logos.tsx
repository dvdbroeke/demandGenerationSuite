"use client"

import { cn } from "@/lib/utils"
import { Hexagon, Target, Layers, DollarSign, PieChart, Network, Gauge } from "lucide-react"

// Size utility for logo components
type SizeKey = "sm" | "md" | "lg"
type SizeValue = SizeKey | number

const sizeMap: Record<SizeKey, number> = {
  sm: 20,
  md: 32,
  lg: 48,
}

function resolveSize(size: SizeValue): number {
  if (typeof size === "number") {
    return size
  }
  return sizeMap[size] ?? 40
}

// Artemis logo (Resource Allocation) - network/connected nodes icon
export function ArtemisLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center rounded-lg bg-emerald-500/20", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <Network 
        className="text-emerald-400" 
        style={{ width: resolvedSize * 0.6, height: resolvedSize * 0.6 }}
        strokeWidth={2}
      />
    </div>
  )
}

// Legacy alias for backward compatibility
export const FuelightLogo = ArtemisLogo

// BAM logo (Rules of Category & Partitions) - pie chart/segmentation icon
export function BAMLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center rounded-lg bg-amber-500/20", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <PieChart 
        className="text-amber-400" 
        style={{ width: resolvedSize * 0.6, height: resolvedSize * 0.6 }}
        strokeWidth={2}
      />
    </div>
  )
}

// RGM logo (Performance Management) - gauge/performance icon
export function RGMLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center rounded-lg bg-blue-500/20", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <Gauge 
        className="text-blue-400" 
        style={{ width: resolvedSize * 0.6, height: resolvedSize * 0.6 }}
        strokeWidth={2}
      />
    </div>
  )
}

// Price logo - dollar sign icon
export function PriceLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center rounded-lg bg-emerald-500/20", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <DollarSign 
        className="text-emerald-400" 
        style={{ width: resolvedSize * 0.6, height: resolvedSize * 0.6 }}
        strokeWidth={2}
      />
    </div>
  )
}

// Mix/Assortment logo - layers icon
export function MixLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center rounded-lg bg-emerald-500/20", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <Layers 
        className="text-emerald-400" 
        style={{ width: resolvedSize * 0.6, height: resolvedSize * 0.6 }}
        strokeWidth={2}
      />
    </div>
  )
}

// Promotion/TPO logo - target icon
export function PromoLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center rounded-lg bg-amber-500/20", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <Target 
        className="text-amber-400" 
        style={{ width: resolvedSize * 0.6, height: resolvedSize * 0.6 }}
        strokeWidth={2}
      />
    </div>
  )
}

// Commercial Execution logo - alias to PromoLogo for backward compatibility
export const CommercialLogo = PromoLogo

// Company logo - Generic placeholder for client branding
export function CompanyLogo({
  size = 120,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <div 
      className={cn("flex items-center justify-center flex-shrink-0", className)}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <Hexagon className="h-full w-full text-emerald-500" strokeWidth={1.5} />
    </div>
  )
}

// Legacy alias for backward compatibility
export const CocaColaLogo = CompanyLogo
