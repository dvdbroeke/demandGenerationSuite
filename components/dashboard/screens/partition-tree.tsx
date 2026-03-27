"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeNode {
  name: string
  description?: string
  value?: string
  growth?: string
  color?: string
  children?: TreeNode[]
}

const treeData: TreeNode = {
  name: "NARTD",
  description: "Non-Alcoholic Ready to Drink",
  value: "€11.1B",
  growth: "+5.9%",
  color: "bg-zinc-600",
  children: [
    {
      name: "Branded",
      description: "Branded soft drinks",
      value: "€9.8B",
      growth: "+6.2%",
      color: "bg-zinc-500",
      children: [
        {
          name: "SSD",
          description: "Sparkling Soft Drinks",
          value: "€7.4B",
          growth: "+5.8%",
          color: "bg-teal-600",
          children: [
            {
              name: "Cola",
              description: "Cola-flavored carbonated drinks",
              value: "€4.2B",
              growth: "+4.9%",
              color: "bg-teal-500",
              children: [
                {
                  name: "Regular",
                  description: "Full-sugar cola variants",
                  value: "€2.1B",
                  growth: "+2.1%",
                  color: "bg-red-500",
                },
                {
                  name: "Zero",
                  description: "Zero-sugar cola variants",
                  value: "€1.4B",
                  growth: "+12.4%",
                  color: "bg-teal-400",
                },
                {
                  name: "Diet",
                  description: "Diet/light cola variants",
                  value: "€0.7B",
                  growth: "+1.8%",
                  color: "bg-zinc-400",
                },
              ],
            },
            {
              name: "Citrus / Fruity",
              description: "Citrus and fruit-flavored drinks",
              value: "€1.8B",
              growth: "+6.4%",
              color: "bg-amber-500",
              children: [
                {
                  name: "Lemon-Lime",
                  description: "Brand C, alternatives and variants",
                  value: "€0.9B",
                  growth: "+5.2%",
                  color: "bg-lime-500",
                },
                {
                  name: "Orange",
                  description: "Brand D and orange variants",
                  value: "€0.6B",
                  growth: "+4.8%",
                  color: "bg-orange-500",
                },
                {
                  name: "Other Citrus",
                  description: "Grapefruit, mixed citrus",
                  value: "€0.3B",
                  growth: "+9.1%",
                  color: "bg-yellow-500",
                },
              ],
            },
            {
              name: "Cherry / Dark Fruit",
              description: "Cherry, berry, and dark fruit flavors",
              value: "€0.8B",
              growth: "+8.7%",
              color: "bg-rose-500",
            },
            {
              name: "Energy",
              description: "Energy and performance drinks",
              value: "€1.6B",
              growth: "+15.2%",
              color: "bg-emerald-500",
              children: [
                {
                  name: "Traditional Energy",
                  description: "Red Bull, Monster style",
                  value: "€1.2B",
                  growth: "+14.8%",
                  color: "bg-emerald-400",
                },
                {
                  name: "Hybrid Energy",
                  description: "Coffee-energy combinations",
                  value: "€0.4B",
                  growth: "+22.3%",
                  color: "bg-emerald-600",
                },
              ],
            },
          ],
        },
        {
          name: "Still",
          description: "Non-carbonated drinks",
          value: "€2.4B",
          growth: "+7.1%",
          color: "bg-sky-600",
          children: [
            {
              name: "Water",
              description: "Plain and flavored water",
              value: "€1.2B",
              growth: "+5.4%",
              color: "bg-sky-400",
            },
            {
              name: "Juice",
              description: "Fruit juices and drinks",
              value: "€0.8B",
              growth: "+3.2%",
              color: "bg-orange-400",
            },
            {
              name: "Tea/Coffee RTD",
              description: "Ready-to-drink tea and coffee",
              value: "€0.4B",
              growth: "+18.6%",
              color: "bg-amber-600",
            },
          ],
        },
      ],
    },
    {
      name: "Private Label",
      description: "Store brand drinks",
      value: "€1.3B",
      growth: "+3.8%",
      color: "bg-zinc-700",
    },
  ],
}

interface TreeItemProps {
  node: TreeNode
  level: number
  isLast: boolean
}

function TreeItem({ node, level, isLast }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(level < 3)
  const [isHovered, setIsHovered] = useState(false)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="relative">
      {/* Connector lines */}
      {level > 0 && (
        <div
          className="absolute left-0 top-0 h-full border-l border-zinc-700/50"
          style={{ marginLeft: `${(level - 1) * 24 + 12}px` }}
        />
      )}

      <div
        className="flex items-center gap-2 py-1.5 group"
        style={{ paddingLeft: `${level * 24}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 rounded hover:bg-zinc-800 transition-colors"
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-zinc-500" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {/* Node pill */}
        <div
          className={cn(
            "inline-flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all cursor-default",
            isHovered
              ? "border-zinc-600 bg-zinc-800/80"
              : "border-zinc-800 bg-zinc-900/50"
          )}
        >
          <div className={cn("w-2.5 h-2.5 rounded-full", node.color)} />
          <span className="text-sm font-medium text-zinc-100">{node.name}</span>
          {node.value && (
            <span className="text-xs text-zinc-400">{node.value}</span>
          )}
          {node.growth && (
            <span
              className={cn(
                "text-xs font-medium",
                node.growth.startsWith("+") && Number.parseFloat(node.growth) >= 5
                  ? "text-emerald-400"
                  : node.growth.startsWith("+")
                    ? "text-zinc-400"
                    : "text-red-400"
              )}
            >
              {node.growth}
            </span>
          )}
        </div>

        {/* Hover tooltip */}
        {isHovered && node.description && (
          <div className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 whitespace-nowrap">
            <p className="text-xs text-zinc-300">{node.description}</p>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((child, idx) => (
            <TreeItem
              key={child.name}
              node={child}
              level={level + 1}
              isLast={idx === node.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function PartitionTreeScreen() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100">
          Market Partition Hierarchy
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Explore the hierarchical structure of the NARTD market. Click to
          expand/collapse segments.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 mb-1">Total Partitions</p>
            <p className="text-2xl font-bold text-zinc-100">18</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 mb-1">Hierarchy Depth</p>
            <p className="text-2xl font-bold text-zinc-100">5 Levels</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 mb-1">Fastest Growing</p>
            <p className="text-2xl font-bold text-emerald-400">+22.3%</p>
            <p className="text-xs text-zinc-500 mt-1">Hybrid Energy</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-xs text-zinc-500 mb-1">Largest Segment</p>
            <p className="text-2xl font-bold text-zinc-100">€4.2B</p>
            <p className="text-xs text-zinc-500 mt-1">Cola</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-zinc-100">
            Partition Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <TreeItem node={treeData} level={0} isLast />
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-zinc-100 mb-3">
            Segment Legend
          </h4>
          <div className="flex flex-wrap gap-4">
            {[
              { color: "bg-teal-500", label: "Cola" },
              { color: "bg-amber-500", label: "Citrus/Fruity" },
              { color: "bg-rose-500", label: "Cherry/Dark Fruit" },
              { color: "bg-emerald-500", label: "Energy" },
              { color: "bg-sky-500", label: "Still" },
              { color: "bg-zinc-500", label: "Other" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", item.color)} />
                <span className="text-xs text-zinc-400">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
