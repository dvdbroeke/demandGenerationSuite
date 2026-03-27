"use client"

import { useState } from "react"
import { Sidebar, type Platform, type BAMScreen as SidebarBAMScreen } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { LandingPage, type Platform as LandingPlatform } from "@/components/dashboard/screens/landing-page"
import { ConsumerPartitionsScreen, type Partition } from "@/components/dashboard/screens/consumer-partitions"
import { GrowthSignalsScreen } from "@/components/dashboard/screens/growth-signals"
import { WhereToPlayScreen } from "@/components/dashboard/screens/where-to-play"
import { HowToWinScreen } from "@/components/dashboard/screens/how-to-win"
import { InitiativesPortfolioScreen } from "@/components/dashboard/screens/initiatives-portfolio"
import { InitiativeDetailScreen } from "@/components/dashboard/screens/initiative-detail"
import { ScenariosInvestmentScreen } from "@/components/dashboard/screens/scenarios-investment"
import { DecisionsGovernanceScreen } from "@/components/dashboard/screens/decisions-governance"
import { SystemWiringScreen } from "@/components/dashboard/screens/system-wiring"
import { PartitionActionsScreen } from "@/components/dashboard/screens/partition-actions"
import { ScenarioBuilderScreen } from "@/components/dashboard/screens/scenario-builder"
import { CountryPartitionDeepDive } from "@/components/dashboard/screens/country-partition-deep-dive"
import { FuelightPerformanceDashboard } from "@/components/dashboard/screens/fuelight/performance-dashboard"
import { FuelightWaterfallAnalysis } from "@/components/dashboard/screens/fuelight/waterfall-analysis"
import { FuelightCannibalizationView } from "@/components/dashboard/screens/fuelight/cannibalization-view"
import { FuelightOpportunityView } from "@/components/dashboard/screens/fuelight/opportunity-view"
import { FuelightPartitionsMatrix } from "@/components/dashboard/screens/fuelight/partitions-matrix"
import { FuelightOptimizationScenario } from "@/components/dashboard/screens/fuelight/optimization-scenario"
import { FuelightOptimizerConfig } from "@/components/dashboard/screens/fuelight/optimizer-config"
import { FuelightComparisonView } from "@/components/dashboard/screens/fuelight/comparison-view"
import { FuelightTrendView } from "@/components/dashboard/screens/fuelight/trend-view"
import { FuelightEditParameters } from "@/components/dashboard/screens/fuelight/edit-parameters"
// BAM screens
import { BAMOverview } from "@/components/dashboard/screens/bam/overview"
import { BAMPartitionsHeatmap } from "@/components/dashboard/screens/bam/partitions-heatmap"
import { BAMPartitionTree } from "@/components/dashboard/screens/bam/partition-tree"
import { BAMMarketMap } from "@/components/dashboard/screens/bam/market-map"
import { BAMKeyInsights } from "@/components/dashboard/screens/bam/key-insights"
import { BAMBeachHeatmap } from "@/components/dashboard/screens/bam/beach-heatmap"
import { BAMSkuHeatmap } from "@/components/dashboard/screens/bam/sku-heatmap"
import { BAMShopperPartitions } from "@/components/dashboard/screens/bam/shopper-partitions"
// RGM screen type (no longer uses separate RGM components - navigates directly to TPO/PPA/Mix)
type RGMScreen = "overview" | "tpo" | "ppa" | "assortment" | "simulator"

// Performance Management screen types
type PerfMgmtScreen = "system-scorecard" | "big-bets" | "campaign-effectiveness" | "initiative-summary"
// TPO screens
import { type TPOScreen } from "@/components/dashboard/screens/tpo/promo-effectiveness"
import { TPOPromoEvolution } from "@/components/dashboard/screens/tpo/promo-evolution"
import { TPOPromoPerformance } from "@/components/dashboard/screens/tpo/promo-performance"
import { TPOPerformanceByLever } from "@/components/dashboard/screens/tpo/performance-by-lever"
import { TPOTradeClientMatrix } from "@/components/dashboard/screens/tpo/trade-client-matrix"
import { TPOSimulateForecast } from "@/components/dashboard/screens/tpo/simulate-forecast"
// PPA screens
import { PricingPerformance, type PPAScreen } from "@/components/dashboard/screens/ppa/pricing-performance"
import { PPAPriceIncentive } from "@/components/dashboard/screens/ppa/price-incentive"
import { PPASimulateForecast as PPASimulate } from "@/components/dashboard/screens/ppa/simulate-forecast"
// Assortment & Mix screens
import { type MixScreen } from "@/components/dashboard/screens/mix/mix-performance"
import { MixSimulateForecast } from "@/components/dashboard/screens/mix/simulate-forecast"
import { MarketOpportunities } from "@/components/dashboard/screens/assortment/market-opportunities"
import { PortfolioQuality } from "@/components/dashboard/screens/assortment/portfolio-quality"
  import { AssortmentShare } from "@/components/dashboard/screens/assortment/assortment-share"

// Performance Management
import { PerformanceManagement } from "@/components/dashboard/screens/perfmgmt/performance-management"


type FuelightScreen = 
  | "performance"
  | "edit-parameters"
  | "waterfall"
  | "comparison"
  | "trend"
  | "partitions"
  | "cannibalization"
  | "opportunity"
  | "optimizer-config"
  | "optimization-scenario"

type BAMScreen =
  | "overview"
  | "partitions-heatmap"
  | "partition-tree"
  | "market-map"
  | "key-insights"
  | "beach-heatmap"
  | "sku-heatmap"
  | "shopper-partitions"
  | "consumer-partitions"
  | "growth-signals"
  | "where-to-play"
  | "how-to-win"
  | "scenarios-investment"
  | "decisions-governance"
  | "system-wiring"
  | "partition-actions"
  | "scenario-builder"
  | "country-deep-dive"

interface NavigationState {
  platform: Platform | null
  fuelightScreen: FuelightScreen
  bamScreen: BAMScreen
  rgmScreen: RGMScreen
  tpoScreen: TPOScreen
  ppaScreen: PPAScreen
  mixScreen: MixScreen
  perfmgmtScreen: PerfMgmtScreen
  selectedBrand: string
  trendDriver?: string
  selectedPartition?: Partition
  selectedAction?: string
  selectedCountry?: string
  initiativeCreated: boolean
  selectedInitiativeId?: string
  optimizationConfig?: {
    brand: string
    dateRange: string
    fundingAmount: string
    objective: string
    constraints: string[]
  }
  isRGMImport?: boolean // True when optimization was imported from RGM tools
}

export default function StrategyControlTower() {
  const [navigation, setNavigation] = useState<NavigationState>({
    platform: null,
    fuelightScreen: "performance",
    bamScreen: "overview",
    rgmScreen: "overview",
    tpoScreen: "promo-evolution",
    ppaScreen: "pricing-performance",
    mixScreen: "market-opportunities",
    perfmgmtScreen: "system-scorecard",
    selectedBrand: "Brand A",
    initiativeCreated: false,
    isRGMImport: false,
  })
  const [country, setCountry] = useState("it")
  const [timeHorizon, setTimeHorizon] = useState("short-term") // Declared timeHorizon and setTimeHorizon

  const handleNavigateToFuelightFromBAM = () => {
    setNavigation(prev => ({
      ...prev,
      platform: "fuelight",
      fuelightScreen: "performance",
      selectedBrand: "Brand A Zero",
    }))
  }

  const handleNavigateToBeachHeatmap = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "beach-heatmap",
    }))
  }

  const handleNavigateToSkuHeatmap = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "shopper-partitions",
    }))
  }

  const handleNavigateToShopperPartitions = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "shopper-partitions",
    }))
  }

  const handleBackToPartitionsHeatmap = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "partitions-heatmap",
    }))
  }

  const handleBackToBeachHeatmap = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "beach-heatmap",
    }))
  }

  // Optimizer config navigation
  const handleNavigateToOptimizerConfig = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "optimizer-config",
    }))
  }

  // Optimization navigation
  const handleRunOptimization = (config: {
  brand: string
  dateRange: string
  fundingAmount: string
  channelConstraint: string
  }) => {
  setNavigation(prev => ({
  ...prev,
  platform: "fuelight",
  fuelightScreen: "optimization-scenario",
  optimizationConfig: config,
  isRGMImport: false, // Native Fuelight optimization, not imported from RGM
  }))
  }

  const handleBackFromOptimization = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "performance",
    }))
  }

  const handleLaunchInitiativeFromOptimization = () => {
    setNavigation(prev => ({
      ...prev,
      platform: "initiatives",
      initiativeCreated: true,
    }))
  }

  // Platform navigation
  const handleSelectPlatform = (platform: LandingPlatform) => {
    setNavigation(prev => ({
      ...prev,
      platform: platform as Platform,
      fuelightScreen: "performance",
      bamScreen: "overview",
      rgmScreen: "overview",
      tpoScreen: "promo-evolution",
      ppaScreen: "pricing-performance",
      mixScreen: "market-opportunities",
    }))
  }

  const handleNavigateToPlatform = (platform: Platform) => {
    setNavigation(prev => ({
      ...prev,
      platform,
      fuelightScreen: "performance",
      bamScreen: "overview",
      rgmScreen: "overview",
      tpoScreen: "promo-evolution",
      ppaScreen: "pricing-performance",
      mixScreen: "market-opportunities",
    }))
  }

  // Cross-platform: Fuelight -> RGM
  const handleNavigateToRGMSimulator = (prefilled: { brand: string; funding: string; channel: string }) => {
    setNavigation(prev => ({
      ...prev,
      platform: "commercial",
      rgmScreen: "simulator",
    }))
  }

  const handleNavigateToRGMPricing = () => {
  setNavigation(prev => ({
  ...prev,
  platform: "ppa", // Navigate to PPA platform directly
  ppaScreen: "pricing-performance", // Start at Pricing Performance screen
  }))
  }

  const handleNavigateToAssortmentMix = () => {
  setNavigation(prev => ({
  ...prev,
  platform: "mix",
  mixScreen: "market-opportunities", // Start at Market Opportunities (Overview) screen
  }))
  }

  const handleNavigateToRGMPromotion = () => {
    setNavigation(prev => ({
      ...prev,
      platform: "tpo", // Navigate to TPO platform directly
      tpoScreen: "promo-evolution", // Start at Promo Evolution screen
    }))
  }

  // TPO navigation
  const handleTPONavigate = (screen: TPOScreen) => {
    setNavigation(prev => ({
      ...prev,
      tpoScreen: screen,
    }))
  }

  // PPA navigation
  const handlePPANavigate = (screen: PPAScreen) => {
    setNavigation(prev => ({
      ...prev,
      ppaScreen: screen,
    }))
  }

  // Mix navigation
  const handleMixNavigate = (screen: MixScreen) => {
    setNavigation(prev => ({
      ...prev,
      mixScreen: screen,
    }))
  }

  // RGM navigation
  const handleRGMNavigate = (screen: RGMScreen) => {
    setNavigation(prev => ({
      ...prev,
      rgmScreen: screen,
    }))
  }

  const handleGoHome = () => {
    setNavigation(prev => ({
      ...prev,
      platform: null,
    }))
  }

  const handleNavigateToInitiatives = () => {
    setNavigation(prev => ({
      ...prev,
      platform: "initiatives",
      selectedInitiativeId: undefined,
    }))
  }

  const handleNavigateToInitiativeDetail = (initiativeId: string) => {
    setNavigation(prev => ({
      ...prev,
      platform: "initiatives",
      selectedInitiativeId: initiativeId,
    }))
  }

  const handleBackToInitiativesPortfolio = () => {
    setNavigation(prev => ({
      ...prev,
      selectedInitiativeId: undefined,
    }))
  }

  // Fuelight navigation
  const handleFuelightNavigateToWaterfall = (brand: string) => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "waterfall",
      selectedBrand: brand,
    }))
  }

  const handleFuelightNavigateToPartitions = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "partitions",
    }))
  }

  const handleFuelightBackToSummary = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "performance",
    }))
  }

  const handleFuelightDrillDown = (driver: string) => {
    // "pricing" leads to cannibalization view (Diet Coke vs Coke Zero)
    // "media" leads to opportunity view (high ROI channels)
    if (driver === "media") {
      setNavigation(prev => ({
        ...prev,
        fuelightScreen: "opportunity",
      }))
    } else {
      // pricing/promotion goes to cannibalization
      setNavigation(prev => ({
        ...prev,
        fuelightScreen: "cannibalization",
      }))
    }
  }

  const handleFuelightNavigateToComparison = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "comparison",
    }))
  }

  const handleFuelightNavigateToTrend = (driver?: string) => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "trend",
      trendDriver: driver || "meta",
    }))
  }

  const handleFuelightBackToWaterfall = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "waterfall",
    }))
  }

  const handleFuelightNavigateToOpportunity = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "opportunity",
    }))
  }

  const handleFuelightBackToCannibalization = () => {
    setNavigation(prev => ({
      ...prev,
      fuelightScreen: "cannibalization",
    }))
  }

  const handleFuelightLaunchInitiative = () => {
    setNavigation(prev => ({
      ...prev,
      platform: "initiatives",
      initiativeCreated: true,
    }))
  }

  const handleFuelightSelectBrand = (brand: string) => {
    setNavigation(prev => ({
      ...prev,
      selectedBrand: brand,
      fuelightScreen: "waterfall",
    }))
  }

  // BAM navigation
  const handleBAMNavigate = (screen: string) => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: screen as BAMScreen,
    }))
  }

  const handleNavigateToPartitionActions = (partition: Partition) => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "partition-actions",
      selectedPartition: partition,
    }))
  }

  const handleNavigateToCountry = (countryCode: string) => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "country-deep-dive",
      selectedCountry: countryCode,
    }))
  }

  const handleBackToPartitions = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "consumer-partitions",
    }))
  }

  const handleNavigateBAMScreen = (screen: SidebarBAMScreen) => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: screen,
    }))
  }

  const handleSelectAction = (actionId: string) => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "scenario-builder",
      selectedAction: actionId,
    }))
  }

  const handleBackToActions = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "partition-actions",
    }))
  }

  const handleNavigateToColaDeepDive = () => {
    setNavigation(prev => ({
      ...prev,
      bamScreen: "cola-deep-dive",
    }))
  }

  const renderTPOScreen = () => {
    switch (navigation.tpoScreen) {
      case "promo-evolution":
        return <TPOPromoEvolution onNavigate={handleTPONavigate} />
      case "promo-performance":
        return <TPOPromoPerformance onNavigate={handleTPONavigate} />
      case "trade-client-matrix":
        return <TPOTradeClientMatrix onNavigate={handleTPONavigate} />
      case "performance-by-lever":
        return <TPOPerformanceByLever onNavigate={handleTPONavigate} />
      case "simulate-forecast":
        return <TPOSimulateForecast onNavigate={handleTPONavigate} onLaunchInitiative={handleLaunchInitiativeFromOptimization} onNavigateToFuelight={() => setNavigation(prev => ({ ...prev, platform: "fuelight", fuelightScreen: "optimization-scenario", isRGMImport: true }))} />
      default:
        return <TPOPromoEvolution onNavigate={handleTPONavigate} />
    }
  }

  const renderPPAScreen = () => {
    switch (navigation.ppaScreen) {
      case "pricing-performance":
        return <PricingPerformance onNavigate={handlePPANavigate} />
      case "price-incentive":
        return <PPAPriceIncentive onNavigate={handlePPANavigate} />
  case "simulate-forecast":
  return <PPASimulate onNavigate={handlePPANavigate} onLaunchInitiative={handleLaunchInitiativeFromOptimization} onNavigateToFuelight={() => setNavigation(prev => ({ ...prev, platform: "fuelight", fuelightScreen: "optimization-scenario", isRGMImport: true }))} />
      default:
        return <PricingPerformance onNavigate={handlePPANavigate} />
    }
  }

  const renderMixScreen = () => {
    switch (navigation.mixScreen) {
      case "market-opportunities":
        return <MarketOpportunities onNavigate={handleMixNavigate} />
      case "portfolio-quality":
        return <PortfolioQuality onNavigate={handleMixNavigate} />
      case "assortment-share":
        return <AssortmentShare onNavigate={handleMixNavigate} />
  case "simulate-forecast":
  return <MixSimulateForecast onNavigate={handleMixNavigate} onLaunchInitiative={handleLaunchInitiativeFromOptimization} onNavigateToFuelight={() => setNavigation(prev => ({ ...prev, platform: "fuelight", fuelightScreen: "optimization-scenario", isRGMImport: true }))} />
      default:
        return <MarketOpportunities onNavigate={handleMixNavigate} />
    }
  }

  // Performance Management screens renderer
  const handlePerfMgmtNavigate = (screen: PerfMgmtScreen) => {
    setNavigation(prev => ({ ...prev, perfmgmtScreen: screen }))
  }
  
  const renderPerfMgmtScreen = () => {
    return (
      <PerformanceManagement 
        activeScreen={navigation.perfmgmtScreen}
        onNavigate={handlePerfMgmtNavigate}
      />
    )
  }
  
  // RGM navigation now goes directly to TPO/PPA/Mix platforms - no separate RGM screen renderer needed

  const renderFuelightScreen = () => {
    switch (navigation.fuelightScreen) {
      case "performance":
        return (
          <FuelightPerformanceDashboard 
            onNavigateToWaterfall={handleFuelightNavigateToWaterfall}
            onNavigateToPartitions={handleFuelightNavigateToPartitions}
            onNavigateToOptimizer={handleNavigateToOptimizerConfig}
            onNavigateToComparison={handleFuelightNavigateToComparison}
            onNavigateToTrend={handleFuelightNavigateToTrend}
            onNavigateToEdit={() => setNavigation(prev => ({ ...prev, fuelightScreen: "edit-parameters" }))}
          />
        )
      case "edit-parameters":
        return (
          <FuelightEditParameters 
            onNavigateToView={() => setNavigation(prev => ({ ...prev, fuelightScreen: "performance" }))}
            onNavigateToOptimize={handleNavigateToOptimizerConfig}
          />
        )
      case "waterfall":
        return (
          <FuelightWaterfallAnalysis 
            brand={navigation.selectedBrand}
            onBack={handleFuelightBackToSummary}
            onDrillDown={handleFuelightDrillDown}
            onNavigateToSummary={handleFuelightBackToSummary}
            onNavigateToOptimizer={handleNavigateToOptimizerConfig}
            onNavigateToEdit={() => setNavigation(prev => ({ ...prev, fuelightScreen: "edit-parameters" }))}
            onNavigateToComparison={handleFuelightNavigateToComparison}
            onNavigateToTrend={handleFuelightNavigateToTrend}
            onNavigateToRGMPricing={handleNavigateToRGMPricing}
            onNavigateToRGMPromotion={handleNavigateToRGMPromotion}
          />
        )
      case "comparison":
        return (
          <FuelightComparisonView
            brand={navigation.selectedBrand}
            onBack={handleFuelightBackToSummary}
            onNavigateToSummary={handleFuelightBackToSummary}
            onNavigateToWaterfall={() => handleFuelightNavigateToWaterfall(navigation.selectedBrand)}
            onNavigateToTrend={handleFuelightNavigateToTrend}
            onNavigateToOptimizer={handleNavigateToOptimizerConfig}
            onNavigateToEdit={() => setNavigation(prev => ({ ...prev, fuelightScreen: "edit-parameters" }))}
          />
        )
      case "trend":
        return (
          <FuelightTrendView
            brand={navigation.selectedBrand}
            initialDriver={navigation.trendDriver || "meta"}
            onBack={handleFuelightBackToSummary}
            onNavigateToSummary={handleFuelightBackToSummary}
            onNavigateToWaterfall={() => handleFuelightNavigateToWaterfall(navigation.selectedBrand)}
            onNavigateToComparison={handleFuelightNavigateToComparison}
            onNavigateToOptimizer={handleNavigateToOptimizerConfig}
            onNavigateToEdit={() => setNavigation(prev => ({ ...prev, fuelightScreen: "edit-parameters" }))}
          />
        )
      case "partitions":
        return (
          <FuelightPartitionsMatrix 
            onBack={handleFuelightBackToSummary}
            onSelectBrand={handleFuelightSelectBrand}
          />
        )
      case "cannibalization":
        return (
          <FuelightCannibalizationView 
            onBack={handleFuelightBackToWaterfall}
            onNavigateToOpportunity={handleFuelightNavigateToOpportunity}
            onLaunchInitiative={handleFuelightLaunchInitiative}
            onNavigateToRGMPromotion={handleNavigateToRGMPromotion}
          />
        )
      case "opportunity":
        return (
          <FuelightOpportunityView 
            onBack={handleFuelightBackToCannibalization}
            onLaunchInitiative={handleFuelightLaunchInitiative}
            onRunOptimizer={handleNavigateToOptimizerConfig}
          />
        )
      case "optimizer-config":
        return (
          <FuelightOptimizerConfig 
            onNavigateToView={() => setNavigation(prev => ({ ...prev, fuelightScreen: "performance" }))}
            onNavigateToEdit={() => setNavigation(prev => ({ ...prev, fuelightScreen: "edit-parameters" }))}
            onRunOptimization={handleRunOptimization}
          />
        )
      case "optimization-scenario":
        return (
  <FuelightOptimizationScenario 
  brand={navigation.optimizationConfig?.brand || "coca-cola-zero"}
  dateRange={navigation.optimizationConfig?.dateRange || "cy-2026"}
  fundingAmount={navigation.optimizationConfig?.fundingAmount || "39.4"}
  onBack={handleBackFromOptimization}
  onLaunchInitiative={handleLaunchInitiativeFromOptimization}
  onNavigateToView={() => setNavigation(prev => ({ ...prev, fuelightScreen: "performance" }))}
  onNavigateToEdit={() => setNavigation(prev => ({ ...prev, fuelightScreen: "edit-parameters" }))}
  onNavigateToRGMPricing={handleNavigateToRGMPricing}
  onNavigateToAssortmentMix={handleNavigateToAssortmentMix}
  isRGMImport={navigation.isRGMImport}
  />
        )
      default:
        return <FuelightPerformanceDashboard onNavigateToWaterfall={handleFuelightNavigateToWaterfall} onNavigateToPartitions={handleFuelightNavigateToPartitions} onNavigateToComparison={handleFuelightNavigateToComparison} onNavigateToTrend={handleFuelightNavigateToTrend} />
    }
  }

  const renderBAMScreen = () => {
    switch (navigation.bamScreen) {
      case "overview":
        return <BAMOverview onNavigate={handleBAMNavigate} />
      case "partitions-heatmap":
        return <BAMPartitionsHeatmap onNavigate={handleBAMNavigate} onNavigateToSkuHeatmap={handleNavigateToSkuHeatmap} />
      case "beach-heatmap":
        return <BAMBeachHeatmap onBack={handleBackToPartitionsHeatmap} onNavigateToFuelight={handleNavigateToFuelightFromBAM} />
      case "sku-heatmap":
        return <BAMSkuHeatmap onBack={handleBackToPartitionsHeatmap} onNavigate={handleBAMNavigate} onNavigateToFuelight={handleNavigateToFuelightFromBAM} onNavigateToInitiative={() => handleNavigateToInitiativeDetail("3")} />
      case "shopper-partitions":
        return <BAMShopperPartitions onBack={handleBackToPartitionsHeatmap} onNavigate={handleBAMNavigate} onNavigateToFuelight={handleNavigateToFuelightFromBAM} onNavigateToInitiative={() => handleNavigateToInitiativeDetail("3")} />
      case "partition-tree":
        return <BAMPartitionTree onNavigate={handleBAMNavigate} />
      case "market-map":
        return <BAMMarketMap onNavigate={handleBAMNavigate} />
      case "key-insights":
        return <BAMKeyInsights onNavigate={handleBAMNavigate} />
      case "consumer-partitions":
        return (
          <ConsumerPartitionsScreen 
            onNavigateToActions={handleNavigateToPartitionActions}
            onNavigateToCountry={handleNavigateToCountry}
          />
        )
      case "country-deep-dive":
        if (navigation.selectedCountry) {
          return (
            <CountryPartitionDeepDive 
              country={navigation.selectedCountry}
              onBack={handleBackToPartitions}
            />
          )
        }
        return <ConsumerPartitionsScreen onNavigateToActions={handleNavigateToPartitionActions} onNavigateToCountry={handleNavigateToCountry} />
      case "growth-signals":
        return <GrowthSignalsScreen />
      case "where-to-play":
        return <WhereToPlayScreen />
      case "how-to-win":
        return <HowToWinScreen />
      case "scenarios-investment":
        return <ScenariosInvestmentScreen />
      case "decisions-governance":
        return <DecisionsGovernanceScreen />
      case "system-wiring":
        return <SystemWiringScreen />
      case "partition-actions":
        if (navigation.selectedPartition) {
          return (
            <PartitionActionsScreen 
              partition={navigation.selectedPartition}
              onBack={handleBackToPartitions}
              onSelectAction={handleSelectAction}
            />
          )
        }
        return <ConsumerPartitionsScreen onNavigateToActions={handleNavigateToPartitionActions} onNavigateToCountry={handleNavigateToCountry} />
      case "scenario-builder":
        if (navigation.selectedPartition && navigation.selectedAction) {
          return (
            <ScenarioBuilderScreen 
              partition={navigation.selectedPartition}
              actionId={navigation.selectedAction}
              onBack={handleBackToActions}
            />
          )
        }
        return <ConsumerPartitionsScreen onNavigateToActions={handleNavigateToPartitionActions} onNavigateToCountry={handleNavigateToCountry} />
      default:
        return <ConsumerPartitionsScreen onNavigateToActions={handleNavigateToPartitionActions} onNavigateToCountry={handleNavigateToCountry} />
    }
  }

  const renderContent = () => {
    if (navigation.platform === null) {
      return (
        <LandingPage 
          onSelectPlatform={handleSelectPlatform}
          onNavigateToInitiatives={handleNavigateToInitiatives}
        />
      )
    }

    if (navigation.platform === "fuelight") {
      return renderFuelightScreen()
    }

    if (navigation.platform === "bam") {
      return renderBAMScreen()
    }

    if (navigation.platform === "initiatives") {
      if (navigation.selectedInitiativeId) {
        return <InitiativeDetailScreen onBack={handleBackToInitiativesPortfolio} />
      }
      return <InitiativesPortfolioScreen onNavigateToInitiativeDetail={handleNavigateToInitiativeDetail} />
    }

    if (navigation.platform === "tpo") {
      return renderTPOScreen()
    }

    if (navigation.platform === "ppa") {
      return renderPPAScreen()
    }

  if (navigation.platform === "mix") {
  return renderMixScreen()
  }
  
  if (navigation.platform === "prescriptive") {
  return renderPerfMgmtScreen()
  }
  
  // "commercial" platform is deprecated - navigation now goes directly to tpo/ppa/mix
  if (navigation.platform === "commercial") {
    // Redirect to appropriate platform based on rgmScreen
    if (navigation.rgmScreen === "tpo") {
      return renderTPOScreen()
    } else if (navigation.rgmScreen === "ppa") {
      return renderPPAScreen()
    } else if (navigation.rgmScreen === "assortment") {
      return renderMixScreen()
    }
    // Default: show coming soon
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-zinc-400">RGM Tools</p>
          <p className="text-sm text-zinc-500 mt-2">Please use Price, Promotion, or Mix tools from the sidebar.</p>
        </div>
      </div>
    )
  }

    // Platform not implemented
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-zinc-400">Coming Soon</p>
          <p className="text-sm text-zinc-500 mt-2">This platform is not yet available.</p>
        </div>
      </div>
    )
  }

  // Show landing page without sidebar
  if (navigation.platform === null) {
    return (
      <div className="h-screen bg-zinc-950">
        {renderContent()}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar 
        activePlatform={navigation.platform} 
        bamScreen={navigation.bamScreen as SidebarBAMScreen}
        onNavigate={handleNavigateToPlatform}
        onNavigateBAM={handleNavigateBAMScreen}
        onGoHome={handleGoHome}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          country={country} 
          onCountryChange={setCountry}
          onNavigateToPartitions={handleBackToPartitions}
          platformName={
            navigation.platform === "bam" ? "Brand Accelerator Model" :
            navigation.platform === "fuelight" ? "Fuelight" :
            navigation.platform === "prescriptive" ? "Prescriptive Operational Insights" :
            navigation.platform === "commercial" ? "Revenue Growth Management (OBPPC)" :
            navigation.platform === "tpo" ? "Promotion" :
            navigation.platform === "ppa" ? "Price" :
            navigation.platform === "assortment" ? "Assortment" :
            navigation.platform === "mix" ? "Mix" :
            navigation.platform === "initiatives" ? "Initiatives Portfolio" :
            "Platform"
          }
        />
        <main className="flex-1 overflow-auto bg-zinc-950">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
