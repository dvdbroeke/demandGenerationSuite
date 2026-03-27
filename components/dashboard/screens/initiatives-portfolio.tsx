"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { 
  Briefcase,
  FileEdit,
  AlertCircle,
  CheckCircle2,
  Play,
  Users,
  Calendar,
  Target,
  ArrowRight,
  Building2,
  Filter
} from "lucide-react"

interface Initiative {
  id: string
  name: string
  linkedPartition: string
  linkedBrand: string
  linkedCountry: string
  status: "draft" | "under-review" | "approved" | "in-execution"
  owner: "Enterprise" | "Partner"
  keyStakeholders: string[]
  nextDecisionGate: string
  nextForum: string
  sizeOfPrize: string
  submittedDate: string
  strategicPlay: string
  sourcePlatform: string
}

interface InitiativesPortfolioScreenProps {
  onNavigateToInitiativeDetail?: (initiativeId: string) => void
}

const initiatives: Initiative[] = [
  {
    id: "1",
    name: "Shift Media Investment from Brand A Diet to Brand A Zero - GB",
    linkedPartition: "Cola Zero",
    linkedBrand: "Brand A Zero Sugar",
    linkedCountry: "Great Britain",
    status: "draft",
    owner: "Enterprise",
    keyStakeholders: ["Media Director GB", "Brand Manager Brand A Zero", "Partner Marketing Lead"],
    nextDecisionGate: "Business Case Review",
    nextForum: "Marketing Board - Feb 28",
    sizeOfPrize: "€12M incremental volume",
    submittedDate: "2024-01-22",
    strategicPlay: "Zero Sugar Leadership",
    sourcePlatform: "Artemis"
  },
  {
    id: "2",
    name: "Brand A Zero Fan Base Expansion via Social & Online Video",
    linkedPartition: "Cola Zero",
    linkedBrand: "Brand A Zero Sugar",
    linkedCountry: "Great Britain",
    status: "under-review",
    owner: "Enterprise",
    keyStakeholders: ["Digital Marketing Director", "Social Media Lead", "Media Agency Partner"],
    nextDecisionGate: "Channel Mix Approval",
    nextForum: "Digital Board - Mar 5",
    sizeOfPrize: "2.2x ROI on TikTok, 3.5x on Meta",
    submittedDate: "2024-01-20",
    strategicPlay: "Zero Sugar Leadership",
    sourcePlatform: "Artemis"
  },
  {
    id: "3",
    name: "Improve Perceived Affordability of Brand A Zero Pet 2L",
    linkedPartition: "Cola Zero >1L",
    linkedBrand: "Brand A Zero Sugar",
    linkedCountry: "Great Britain",
    status: "in-execution",
    owner: "Partner",
    keyStakeholders: ["RGM Director GB", "Shopper Marketing Lead", "Category Manager - Grocery"],
    nextDecisionGate: "Q1 Performance Review",
    nextForum: "RGM Board - Mar 15",
    sizeOfPrize: "Close affordability gap vs Competitor B Max",
    submittedDate: "2024-01-10",
    strategicPlay: "Zero Sugar Leadership",
    sourcePlatform: "BAM"
  },
]

const statusConfig = {
  "draft": { 
    icon: FileEdit, 
    color: "text-zinc-400", 
    bg: "bg-zinc-500/10", 
    border: "border-zinc-500/20",
    label: "Draft"
  },
  "under-review": { 
    icon: AlertCircle, 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    label: "Under Review"
  },
  "approved": { 
    icon: CheckCircle2, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    label: "Approved"
  },
  "in-execution": { 
    icon: Play, 
    color: "text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20",
    label: "In Execution"
  },
}

const ownerConfig = {
  "Enterprise": { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  "Partner": { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
}

export function InitiativesPortfolioScreen({ onNavigateToInitiativeDetail }: InitiativesPortfolioScreenProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ownerFilter, setOwnerFilter] = useState<string>("all")

  const filteredInitiatives = initiatives.filter(initiative => {
    if (statusFilter !== "all" && initiative.status !== statusFilter) return false
    if (ownerFilter !== "all" && initiative.owner !== ownerFilter) return false
    return true
  })

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Initiatives Portfolio</h1>
          <p className="text-sm text-zinc-500 mt-1">Track and manage strategic initiatives across the system</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
          <Briefcase className="h-4 w-4 mr-2" />
          Submit New Initiative
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-zinc-900/30 border-zinc-800/50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-9 bg-zinc-800/50 border-zinc-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-100">All Statuses</SelectItem>
                <SelectItem value="draft" className="text-zinc-100">Draft</SelectItem>
                <SelectItem value="under-review" className="text-zinc-100">Under Review</SelectItem>
                <SelectItem value="approved" className="text-zinc-100">Approved</SelectItem>
                <SelectItem value="in-execution" className="text-zinc-100">In Execution</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-40 h-9 bg-zinc-800/50 border-zinc-700">
                <SelectValue placeholder="Owner" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all" className="text-zinc-100">All Owners</SelectItem>
                <SelectItem value="Enterprise" className="text-zinc-100">Enterprise</SelectItem>
                <SelectItem value="Partner" className="text-zinc-100">Partner</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-zinc-500">
              {filteredInitiatives.length} of {initiatives.length} initiatives
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Initiatives List */}
      <div className="space-y-4">
        {filteredInitiatives.length === 0 ? (
          <Card className="bg-zinc-900/30 border-zinc-800/50">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-400 mb-2">No initiatives found</h3>
              <p className="text-sm text-zinc-600">Adjust your filters or submit a new initiative</p>
            </CardContent>
          </Card>
        ) : (
          filteredInitiatives.map((initiative) => {
            const statConfig = statusConfig[initiative.status]
            const ownConfig = ownerConfig[initiative.owner]
            const StatusIcon = statConfig.icon
            const isClickable = initiative.id === "3" && onNavigateToInitiativeDetail
            
            return (
              <Card 
                key={initiative.id} 
                className={cn(
                  "bg-zinc-900/50 border-zinc-800/50 transition-all",
                  isClickable ? "hover:border-blue-500/50 cursor-pointer" : "hover:border-zinc-700"
                )}
                onClick={() => isClickable && onNavigateToInitiativeDetail?.(initiative.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Status Icon */}
                    <div className={cn("p-3 rounded-lg flex-shrink-0", statConfig.bg)}>
                      <StatusIcon className={cn("h-5 w-5", statConfig.color)} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-base font-semibold text-zinc-100 mb-1">{initiative.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span>{initiative.linkedBrand}</span>
                            <span>•</span>
                            <span>{initiative.linkedPartition}</span>
                            <span>•</span>
                            <span>{initiative.linkedCountry}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={cn("text-xs", statConfig.bg, statConfig.color, statConfig.border)}>
                            {statConfig.label}
                          </Badge>
                          <Badge className={cn("text-xs", ownConfig.bg, ownConfig.color, ownConfig.border)}>
                            {initiative.owner}
                          </Badge>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-4 gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-zinc-600" />
                          <div>
                            <p className="text-zinc-600">Size of Prize</p>
                            <p className="text-zinc-300 font-medium">{initiative.sizeOfPrize}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                          <div>
                            <p className="text-zinc-600">Next Forum</p>
                            <p className="text-zinc-300 font-medium">{initiative.nextForum}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-zinc-600" />
                          <div>
                            <p className="text-zinc-600">Stakeholders</p>
                            <p className="text-zinc-300 font-medium">{initiative.keyStakeholders.length} people</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-zinc-600" />
                          <div>
                            <p className="text-zinc-600">Source</p>
                            <p className="text-zinc-300 font-medium">{initiative.sourcePlatform}</p>
                          </div>
                        </div>
                      </div>

                      {/* Next Decision Gate */}
                      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-zinc-500">Next Decision Gate:</span>
                          <span className="text-amber-400 font-medium">{initiative.nextDecisionGate}</span>
                        </div>
                        {isClickable && (
                          <span className="text-xs text-blue-400">Click to view details</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
