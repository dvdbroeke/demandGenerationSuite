"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCw, Download } from "lucide-react"

const countries = [
  { value: "sp", label: "Spain" },
  { value: "de", label: "Germany" },
  { value: "gb", label: "Great Britain" },
  { value: "fr", label: "France" },
  { value: "be", label: "Belgium" },
  { value: "nl", label: "Netherlands" },
  { value: "it", label: "Italy" },
  { value: "pl", label: "Poland" },
  { value: "ro", label: "Romania" },
  { value: "ch", label: "Switzerland" },
  { value: "at", label: "Austria" },
  { value: "gr", label: "Greece" },
  { value: "rs", label: "Serbia" },
]

interface TopBarProps {
  country: string
  onCountryChange: (country: string) => void
  onNavigateToPartitions?: () => void
  platformName?: string
}

export function TopBar({ 
  country, 
  onCountryChange, 
  platformName = "Brand Accelerator Model",
}: TopBarProps) {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">
            {platformName}
          </h1>
        </div>
        <div className="h-6 w-px bg-zinc-800" />
        <div className="flex items-center gap-3">
          <Select value={country} onValueChange={onCountryChange}>
            <SelectTrigger className="w-[140px] h-8 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {countries.map((c) => (
                <SelectItem
                  key={c.value}
                  value={c.value}
                  className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100 text-xs"
                >
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 text-xs"
          >
            <Download className="h-3 w-3 mr-1.5" />
            Export
          </Button>
        </div>
      </div>
    </header>
  )
}
