"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

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

// Fuelight logo - colorful connected nodes in a circle
export function FuelightLogo({
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
      alt="Fuelight"
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

// Coca-Cola logo 

export function CocaColaLogo({
  size = 120,
  className,
}: {
  size?: SizeValue
  className?: string
}) {
  const resolvedSize = resolveSize(size)
  return (
    <Image
      src="/CocaColaLogo.png"
      alt="Coca-Cola"
      width={resolvedSize}
      height={Math.round(resolvedSize * 0.33)}
      style={{ width: resolvedSize, height: 'auto' }}
      className={cn("object-contain", className)}
      priority
    />
  )
}
