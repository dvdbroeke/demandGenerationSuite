"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface PartitionData {
  name: string
  partitionCagr: { value: number; volume: number }
  tcccCagr: { value: number; volume: number }
  tcccShare: { value: number; volume: number }
  status: "hotspot" | "stronghold" | "pressure" | "emerging"
}

const partitions: PartitionData[] = [
  {
    name: "Cola Regular",
    partitionCagr: { value: 2.1, volume: 0.8 },
    tcccCagr: { value: 2.4, volume: 1.1 },
    tcccShare: { value: 62, volume: 58 },
    status: "stronghold",
  },
  {
    name: "Cola Zero",
    partitionCagr: { value: 12.4, volume: 8.6 },
    tcccCagr: { value: 14.2, volume: 10.1 },
    tcccShare: { value: 68, volume: 65 },
    status: "hotspot",
  },
  {
    name: "Cola Diet",
    partitionCagr: { value: 1.8, volume: -0.4 },
    tcccCagr: { value: 2.1, volume: 0.2 },
    tcccShare: { value: 71, volume: 69 },
    status: "stronghold",
  },
  {
    name: "Lemon-Lime",
    partitionCagr: { value: 5.2, volume: 3.1 },
    tcccCagr: { value: 4.8, volume: 2.6 },
    tcccShare: { value: 54, volume: 51 },
    status: "stronghold",
  },
  {
    name: "Orange",
    partitionCagr: { value: 4.8, volume: 2.4 },
    tcccCagr: { value: 5.1, volume: 2.9 },
    tcccShare: { value: 58, volume: 55 },
    status: "stronghold",
  },
  {
    name: "Cherry / Dark Fruit",
    partitionCagr: { value: 8.7, volume: 5.2 },
    tcccCagr: { value: 9.4, volume: 6.1 },
    tcccShare: { value: 45, volume: 42 },
    status: "hotspot",
  },
  {
    name: "Energy",
    partitionCagr: { value: 15.2, volume: 11.8 },
    tcccCagr: { value: 8.6, volume: 6.2 },
    tcccShare: { value: 23, volume: 21 },
    status: "pressure",
  },
  {
    name: "Other Citrus",
    partitionCagr: { value: 9.1, volume: 6.8 },
    tcccCagr: { value: 7.2, volume: 5.1 },
    tcccShare: { value: 38, volume: 35 },
    status: "emerging",
  },
  {
    name: "Water",
    partitionCagr: { value: 5.4, volume: 4.2 },
    tcccCagr: { value: 6.1, volume: 4.8 },
    tcccShare: { value: 32, volume: 30 },
    status: "emerging",
  },
  {
    name: "RTD Tea/Coffee",
    partitionCagr: { value: 18.6, volume: 14.2 },
    tcccCagr: { value: 22.1, volume: 17.8 },
    tcccShare: { value: 28, volume: 26 },
    status: "hotspot",
  },
  {
    name: "Juice",
    partitionCagr: { value: 3.2, volume: 1.1 },
    tcccCagr: { value: 2.8, volume: 0.6 },
    tcccShare: { value: 18, volume: 16 },
    status: "pressure",
  },
  {
    name: "Hybrid Energy",
    partitionCagr: { value: 22.3, volume: 18.9 },
    tcccCagr: { value: 28.4, volume: 24.1 },
    tcccShare: { value: 19, volume: 17 },
    status: "hotspot",
  },
]

const statusConfig = {
  hotspot: {
    label: "Growth Hotspot",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  stronghold: {
    label: "Stronghold",
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    dot: "bg-teal-500",
  },
  pressure: {
    label: "Under Pressure",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-500",
  },
  emerging: {
    label: "Emerging",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-500",
  },
}

type ViewType = "value" | "volume"

export function MarketMapScreen() {
  const [view, setView] = useState<ViewType>("value")

  const getShareColor = (share: number) => {
    if (share >= 60) return "bg-teal-500"
    if (share >= 40) return "bg-teal-600"
    if (share >= 25) return "bg-amber-500"
    return "bg-red-500"
  }

  const formatCagr = (value: number) => {
    const prefix = value >= 0 ? "+" : ""
    return `${prefix}${value.toFixed(1)}%`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">
            TCCC Performance by Partition
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Compare partition growth with TCCC performance and market share
            position
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("value")}
            className={cn(
              "px-4 transition-colors",
              view === "value"
                ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 hover:text-teal-300"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            Value
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("volume")}
            className={cn(
              "px-4 transition-colors",
              view === "volume"
                ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 hover:text-teal-300"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
          >
            Volume
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", statusConfig.hotspot.dot)} />
              <span className="text-xs text-zinc-500">Growth Hotspots</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {partitions.filter((p) => p.status === "hotspot").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", statusConfig.stronghold.dot)} />
              <span className="text-xs text-zinc-500">Strongholds</span>
            </div>
            <p className="text-2xl font-bold text-teal-400">
              {partitions.filter((p) => p.status === "stronghold").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", statusConfig.pressure.dot)} />
              <span className="text-xs text-zinc-500">Under Pressure</span>
            </div>
            <p className="text-2xl font-bold text-red-400">
              {partitions.filter((p) => p.status === "pressure").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", statusConfig.emerging.dot)} />
              <span className="text-xs text-zinc-500">Emerging</span>
            </div>
            <p className="text-2xl font-bold text-amber-400">
              {partitions.filter((p) => p.status === "emerging").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partition Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {partitions.map((partition) => {
          const status = statusConfig[partition.status]
          const cagr = view === "value" ? partition.partitionCagr.value : partition.partitionCagr.volume
          const tcccCagr = view === "value" ? partition.tcccCagr.value : partition.tcccCagr.volume
          const share = view === "value" ? partition.tcccShare.value : partition.tcccShare.volume
          const outperforming = tcccCagr > cagr

          return (
            <Card
              key={partition.name}
              className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold text-zinc-100">
                    {partition.name}
                  </CardTitle>
                  <Badge variant="outline" className={status.color}>
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* CAGR Comparison */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Partition CAGR</span>
                    <span
                      className={cn(
                        "font-medium",
                        cagr >= 5
                          ? "text-emerald-400"
                          : cagr >= 0
                            ? "text-zinc-300"
                            : "text-red-400"
                      )}
                    >
                      {formatCagr(cagr)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">TCCC CAGR</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium",
                          tcccCagr >= 5
                            ? "text-emerald-400"
                            : tcccCagr >= 0
                              ? "text-zinc-300"
                              : "text-red-400"
                        )}
                      >
                        {formatCagr(tcccCagr)}
                      </span>
                      {outperforming ? (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                          Outperforming
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded">
                          Lagging
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">TCCC Share</span>
                    <span className="font-semibold text-zinc-100">{share}%</span>
                  </div>
                  <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all",
                        getShareColor(share)
                      )}
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Legend */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h4 className="text-sm font-semibold text-zinc-100">
                Status Definitions
              </h4>
              <div className="flex items-center gap-4 text-xs">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", config.dot)} />
                    <span className="text-zinc-400">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>
                <span className="text-emerald-400">Outperforming</span> = TCCC
                CAGR {">"} Partition CAGR
              </span>
              <span>
                <span className="text-red-400">Lagging</span> = TCCC CAGR {"<"}
                Partition CAGR
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
