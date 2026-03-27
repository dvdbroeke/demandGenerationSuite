"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  Pencil, 
  Zap, 
  ChevronRight, 
  Settings2,
  Lock,
  Undo2,
  Redo2,
  Download,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ArtemisLogo } from "@/components/ui/platform-logos"

interface EditParametersProps {
  onNavigateToView: () => void
  onNavigateToOptimize: () => void
}

// Sample weekly data with lock status
const weeklyData = [
  { week: "7/6 - 7/12", locked: true },
  { week: "7/13 - 7/19", locked: true },
  { week: "7/20 - 7/26", locked: false },
  { week: "7/27 - 8/2", locked: false },
  { week: "8/3 - 8/9", locked: false },
  { week: "8/10 - 8/16", locked: false },
  { week: "8/17 - 8/23", locked: false },
  { week: "8/24 - 8/30", locked: false },
]

// Platform data with editable values
const initialPlatformData = [
  { name: "Meta", values: [1.8, 2.0, 2.0, 2.0, 1.5, 0.7, 0.7, 0.7] },
  { name: "TikTok", values: [1.1, 1.3, 1.3, 1.3, 0.9, 0.5, 0.5, 0.5] },
  { name: "Snapchat", values: [0.0, 0.0, 0.0, 0.0, 0.0, null, null, null] },
  { name: "Other", values: [null, null, null, null, null, null, null, null] },
  { name: "X (Twitter)", values: [null, null, null, null, null, null, null, null] },
]

export function FuelightEditParameters({ onNavigateToView, onNavigateToOptimize }: EditParametersProps) {
  const [platformData, setPlatformData] = useState(initialPlatformData)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Don't allow editing locked columns
    if (weeklyData[colIndex].locked) return
    setEditingCell({ row: rowIndex, col: colIndex })
  }

  const handleCellChange = (value: string, rowIndex: number, colIndex: number) => {
    const newData = [...platformData]
    const numValue = value === "" ? null : parseFloat(value)
    newData[rowIndex] = {
      ...newData[rowIndex],
      values: newData[rowIndex].values.map((v, i) => i === colIndex ? numValue : v)
    }
    setPlatformData(newData)
    setHasChanges(true)
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const handleResetDefault = () => {
    setPlatformData(initialPlatformData)
    setHasChanges(false)
  }

  const handleSave = () => {
    setHasChanges(false)
    // Save logic here
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ArtemisLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Demo</h1>
                <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">Edited View</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right text-xs text-zinc-500">
              <div>Latest available data as of: 00/00/0000</div>
              <div>Outcomes actualized through: 00/00/0000</div>
            </div>
            
            {/* View/Edit/Optimize Navigation */}
            <div className="flex items-center gap-1">
              <button 
                onClick={onNavigateToView}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-emerald-500 text-emerald-400 bg-emerald-500/10"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button 
                onClick={onNavigateToOptimize}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Optimize
              </button>
            </div>
            
            <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="flex items-center gap-3 mt-4">
          {["TR", "₺ - TRY", "360", "Jun 30, 2024 - Oct 5, 2024", "System Funding", "Brand A"].map((filter, i) => (
            <button 
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700"
            >
              {filter}
              <ChevronDown className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Breadcrumb & Table Settings */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Settings2 className="h-4 w-4" />
              All Drivers
            </span>
            <ChevronRight className="h-4 w-4" />
            <span>Consumer (Paid)</span>
            <ChevronRight className="h-4 w-4" />
            <span>Digital Media</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-200">Social</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Lock className="h-4 w-4" />
              View-only
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Settings2 className="h-4 w-4" />
              Table Settings
            </button>
          </div>
        </div>

        {/* Data Table */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-400 w-40"></th>
                  <th colSpan={8} className="text-left p-4 text-sm font-medium text-zinc-400">2024</th>
                </tr>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-400 w-40"></th>
                  {weeklyData.map((week, i) => (
                    <th key={i} className="text-center p-4 text-sm font-medium text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {week.locked && <Lock className="h-3 w-3" />}
                        {week.week}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platformData.map((platform, pi) => (
                  <tr key={pi} className="border-b border-zinc-800/50">
                    <td className="p-4 text-sm text-zinc-200 font-medium">{platform.name}</td>
                    {platform.values.map((value, vi) => {
                      const isLocked = weeklyData[vi].locked
                      const isEditing = editingCell?.row === pi && editingCell?.col === vi
                      
                      return (
                        <td 
                          key={vi} 
                          className={cn(
                            "p-2 text-center text-sm border-l border-zinc-800/50",
                            isLocked ? "bg-zinc-800/30 text-zinc-500" : "text-zinc-200 cursor-pointer hover:bg-zinc-800/50"
                          )}
                          onClick={() => handleCellClick(pi, vi)}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.1"
                              value={value ?? ""}
                              onChange={(e) => handleCellChange(e.target.value, pi, vi)}
                              onBlur={handleCellBlur}
                              autoFocus
                              className="w-full bg-zinc-700 border border-teal-500 rounded px-2 py-1 text-center text-zinc-100 focus:outline-none"
                            />
                          ) : (
                            <span className={cn(isLocked && "opacity-60")}>
                              {value !== null ? value.toFixed(1) : "--"}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
              <Undo2 className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
              <Redo2 className="h-5 w-5" />
            </button>
            <button 
              onClick={handleResetDefault}
              className="text-sm text-zinc-500 hover:text-zinc-300"
            >
              Reset Default
            </button>
          </div>
          
          <div className="text-sm text-zinc-500">
            Click on a cell to edit values.
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-zinc-400" onClick={handleResetDefault}>
              Cancel
            </Button>
            <Button 
              className={cn(
                "px-6",
                hasChanges 
                  ? "bg-teal-600 hover:bg-teal-500 text-white" 
                  : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              )}
              disabled={!hasChanges}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
