"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Hexagon } from "lucide-react"

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

// Artemis logo (formerly Fuelight) - colorful connected nodes in a circle
export function ArtemisLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <Image
      src="/fuelight_transparant.png"
      alt="Artemis"
      width={resolvedSize}
      height={resolvedSize}
      style={{ width: resolvedSize, height: 'auto' }}
      className={cn(
        "object-contain scale-[0.9]",
        className
      )}
      priority
    />
  )
}

// Legacy alias for backward compatibility
export const FuelightLogo = ArtemisLogo

// BAM logo - waterfall bars style (amber/orange tones)

export function BAMLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <Image
      src="/BAMLogo.png"
      alt="BAM"
      width={resolvedSize}
      height={resolvedSize}
      style={{ width: resolvedSize, height: 'auto' }}
      className={cn("object-contain", className)}
      priority
    />
  )
}

// Marketing Execution logo
export function RGMLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <Image
      src="/RGMLogo.png"
      alt="RGM"
      width={resolvedSize}
      height={resolvedSize}
      style={{ width: resolvedSize, height: 'auto' }}
      className={cn("object-contain", className)}
      priority
    />
  )
}

// Commercial Execution logo

export function CommercialLogo({
  size = 40,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <Image
      src="/executionLogo.png"
      alt="Execution"
      width={resolvedSize}
      height={resolvedSize}
      style={{ width: resolvedSize, height: 'auto' }}
      className={cn("object-contain", className)}
      priority
    />
  )
}

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
