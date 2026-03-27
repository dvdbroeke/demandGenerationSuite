"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { BAMLogo } from "@/components/ui/platform-logos"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BAMPartitionTreeProps {
  onNavigate?: (screen: string) => void
}

const markets = [
  { code: "sp", name: "Spain" },
  { code: "de", name: "Germany" },
  { code: "gb", name: "Great Britain" },
  { code: "fr", name: "France" },
  { code: "be", name: "Belgium" },
  { code: "nl", name: "Netherlands" },
  { code: "it", name: "Italy" },
  { code: "pl", name: "Poland" },
  { code: "ro", name: "Romania" },
  { code: "ch", name: "Switzerland" },
  { code: "at", name: "Austria" },
  { code: "gr", name: "Greece" },
  { code: "rs", name: "Serbia" },
]

const years = ["2025", "2024", "2023", "2022", "2021", "2020"]

interface TreeNode {
  id: string
  name: string
  color: string
  annotation?: { letter: string; text: string }
  children?: TreeNode[]
}

const treeData: TreeNode = {
  id: "nartd",
  name: "NARTD",
  color: "bg-teal-500",
  children: [
    {
      id: "branded",
      name: "Branded",
      color: "bg-emerald-500",
      annotation: { letter: "A", text: "Private Label less of a threat to TCCC relative to Branded" },
      children: [
        {
          id: "ssd",
          name: "SSD",
          color: "bg-amber-500",
          annotation: { letter: "B", text: "Colas actively compete only within SSD, with restricted stretch to Performance" },
          children: [
            {
              id: "cola",
              name: "Cola",
              color: "bg-red-500",
              children: [
                {
                  id: "diet",
                  name: "Diet",
                  color: "bg-orange-400",
                  annotation: { letter: "C", text: "Regular, Diet and Zero represent distinct propositions" },
                },
                {
                  id: "zero",
                  name: "Zero",
                  color: "bg-red-400",
                  children: [
                    { id: "zero-500ml-can", name: "<500ml (Can)", color: "bg-zinc-600" },
                    { id: "zero-500ml-pet", name: "500ml (PET)", color: "bg-zinc-600" },
                    { id: "zero-1l-pet", name: ">1L (PET)", color: "bg-zinc-600" },
                  ]
                },
                { id: "regular-calorie", name: "Regular Calorie", color: "bg-amber-600" },
              ]
            },
            {
              id: "citrus-fruity",
              name: "Citrus/Fruity",
              color: "bg-yellow-500",
              children: [
                { id: "no-calorie-diet", name: "No Calorie/Diet", color: "bg-lime-500" },
                { id: "regular-calorie-citrus", name: "Regular Calorie", color: "bg-amber-600" },
              ]
            },
            {
              id: "bold",
              name: "Bold",
              color: "bg-red-600",
              annotation: { letter: "D", text: "Bold flavors play a unique role, emerging as a fast-growing partition" },
              children: [
                { id: "cherry-dark", name: "Cherry/Dark fruit", color: "bg-pink-500" },
                { id: "specialty", name: "Specialty", color: "bg-purple-500" },
              ]
            },
          ]
        },
      ]
    },
  ]
}

function TreeNodeComponent({ 
  node, 
  depth = 0,
  isLast = false 
}: { 
  node: TreeNode
  depth?: number
  isLast?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="relative">
      <div className="flex items-start gap-2">
        {/* Connection lines */}
        {depth > 0 && (
          <div className="flex items-center gap-0 -ml-4">
            <div className="w-4 border-t border-zinc-700" />
          </div>
        )}
        
        {/* Node */}
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 hover:bg-zinc-800 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-zinc-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <Badge className={cn(node.color, "text-white border-0 text-xs px-3 py-1")}>
            {node.name}
          </Badge>

          {/* Annotation */}
          {node.annotation && (
            <div className="flex items-center gap-2 ml-2">
              <span className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-medium">
                {node.annotation.letter}
              </span>
              <span className="text-xs text-zinc-500 italic max-w-md">
                {node.annotation.text}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 border-l border-zinc-700 pl-4">
          {node.children?.map((child, idx) => (
            <TreeNodeComponent 
              key={child.id} 
              node={child} 
              depth={depth + 1}
              isLast={idx === (node.children?.length || 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function BAMPartitionTree({ onNavigate }: BAMPartitionTreeProps) {
  const [selectedMarket, setSelectedMarket] = useState("gb")
  const [selectedYear, setSelectedYear] = useState("2025")

  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
            <BAMLogo size="md" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Brand Accelerator Model</h1>
            <p className="text-xs text-zinc-500">Strategic Market Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 max-h-[300px]">
              {markets.map((market) => (
                <SelectItem key={market.code} value={market.code} className="text-zinc-100 text-xs">
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {years.map((year) => (
                <SelectItem key={year} value={year} className="text-zinc-100 text-xs">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-zinc-800">
        <button 
          onClick={() => onNavigate?.("overview")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Overview
        </button>
        <button 
          onClick={() => onNavigate?.("partitions-heatmap")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Partitions Heatmap
        </button>
        <button className="px-6 py-3 text-sm font-medium text-zinc-100 border-b-2 border-amber-500">
          Partition Tree
        </button>
        <button 
          onClick={() => onNavigate?.("market-map")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          Market Map
        </button>
        <button 
          onClick={() => onNavigate?.("key-insights")}
          className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-300"
        >
          AI-Driven Insights
        </button>
      </div>

      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Consumer Partitions - Partition Tree</h2>
        <p className="text-sm text-zinc-500">How consumers' behaviour shapes the NARTD market - hierarchical view of market segmentation</p>
      </div>

      {/* Tree */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardContent className="p-6">
          <TreeNodeComponent node={treeData} />
        </CardContent>
      </Card>
    </div>
  )
}
