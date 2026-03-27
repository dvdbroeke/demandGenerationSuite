// Canonical SKU master list used across TPO, PPA, and PAM screens.
// Every screen MUST import from here to keep filters consistent.
// Pack formats aligned to the shopper partition matrix: 150mL, 250mL, 330mL, 500mL, 1.25L, 1.5L, 1.75L, 2L, 8x330mL, 18x330mL, 24x330mL

export interface SkuMaster {
  sku: string
  brand: string
  pack: string        // human-readable pack descriptor
  packMl: number      // volume in ml (for price-per-litre calcs)
  tier: "Single Serve" | "On-the-Go" | "Multi Serve" | "Multipack"
  role: "Traffic" | "Core" | "Premium"
  ppl: number         // price per litre (EUR)
  rsp: number         // retail shelf price (EUR)
  velocity: number    // units per WD%
  distribution: number // TT weighted distribution %
  revM: number        // revenue in EUR millions
  gpMargin: number    // gross profit margin %
  gpPerStore: number  // GP per store (EUR)
  priceIndex: number  // vs category average (100 = parity)
  compPrice: number   // closest competitor RSP
  vsComp: number      // % gap vs competitor
  elasticity: number  // price elasticity
  incrContrib: number // incremental contribution % (after cannib)
  cannibPct: number   // cannibalisation %
  cannibFrom: string[]
  volGrowth: number   // YoY volume growth %
}

export const skuMaster: SkuMaster[] = [
  // ======== CC Classic ========
  { sku: "CC Classic 150ml",      brand: "CC Classic", pack: "150ml Can",     packMl: 150,  tier: "Single Serve", role: "Premium", ppl: 6.67, rsp: 1.00, velocity: 1.8,  distribution: 34, revM: 0.8,  gpMargin: 48, gpPerStore: 320,  priceIndex: 118, compPrice: 0.89, vsComp: 12.4, elasticity: -0.92, incrContrib: 92, cannibPct: 2,  cannibFrom: ["CC Classic 250ml"],               volGrowth: 12.4 },
  { sku: "CC Classic 250ml",      brand: "CC Classic", pack: "250ml Can",     packMl: 250,  tier: "Single Serve", role: "Premium", ppl: 5.20, rsp: 1.30, velocity: 2.2,  distribution: 42, revM: 1.2,  gpMargin: 44, gpPerStore: 380,  priceIndex: 112, compPrice: 1.19, vsComp: 9.2,  elasticity: -1.05, incrContrib: 86, cannibPct: 4,  cannibFrom: ["CC Classic 330ml"],               volGrowth: 8.6 },
  { sku: "CC Classic 330ml",      brand: "CC Classic", pack: "330ml Can",     packMl: 330,  tier: "Single Serve", role: "Core",    ppl: 4.09, rsp: 1.35, velocity: 8.2,  distribution: 94, revM: 12.4, gpMargin: 38, gpPerStore: 1083, priceIndex: 105, compPrice: 1.29, vsComp: 4.7,  elasticity: -1.24, incrContrib: 82, cannibPct: 4,  cannibFrom: ["CC Zero 330ml"],                  volGrowth: 2.1 },
  { sku: "CC Classic 500ml",      brand: "CC Classic", pack: "500ml PET",     packMl: 500,  tier: "On-the-Go",   role: "Core",    ppl: 3.78, rsp: 1.89, velocity: 5.6,  distribution: 88, revM: 9.8,  gpMargin: 34, gpPerStore: 748,  priceIndex: 112, compPrice: 1.69, vsComp: 11.8, elasticity: -1.62, incrContrib: 68, cannibPct: 12, cannibFrom: ["CC Classic 330ml","CC Classic 1.5L"], volGrowth: 1.4 },
  { sku: "CC Classic 1.25L",      brand: "CC Classic", pack: "1.25L PET",     packMl: 1250, tier: "Multi Serve",  role: "Core",    ppl: 1.68, rsp: 2.10, velocity: 2.8,  distribution: 56, revM: 2.4,  gpMargin: 24, gpPerStore: 420,  priceIndex: 98,  compPrice: 2.09, vsComp: 0.5,  elasticity: -1.78, incrContrib: 52, cannibPct: 10, cannibFrom: ["CC Classic 1.5L"],                 volGrowth: 0.6 },
  { sku: "CC Classic 1.5L",       brand: "CC Classic", pack: "1.5L PET",      packMl: 1500, tier: "Multi Serve",  role: "Traffic", ppl: 1.43, rsp: 2.15, velocity: 3.1,  distribution: 92, revM: 7.2,  gpMargin: 22, gpPerStore: 682,  priceIndex: 98,  compPrice: 2.19, vsComp: -1.8, elasticity: -1.85, incrContrib: 54, cannibPct: 8,  cannibFrom: ["CC Classic 500ml"],               volGrowth: -0.8 },
  { sku: "CC Classic 1.75L",      brand: "CC Classic", pack: "1.75L PET",     packMl: 1750, tier: "Multi Serve",  role: "Traffic", ppl: 1.26, rsp: 2.20, velocity: 1.6,  distribution: 40, revM: 1.4,  gpMargin: 20, gpPerStore: 280,  priceIndex: 94,  compPrice: 2.29, vsComp: -3.9, elasticity: -1.92, incrContrib: 38, cannibPct: 16, cannibFrom: ["CC Classic 1.5L","CC Classic 2L"],  volGrowth: -2.2 },
  { sku: "CC Classic 2L",         brand: "CC Classic", pack: "2L PET",        packMl: 2000, tier: "Multi Serve",  role: "Traffic", ppl: 1.10, rsp: 2.19, velocity: 2.4,  distribution: 85, revM: 5.8,  gpMargin: 18, gpPerStore: 520,  priceIndex: 95,  compPrice: 2.29, vsComp: -4.4, elasticity: -2.10, incrContrib: 42, cannibPct: 14, cannibFrom: ["CC Classic 1.5L"],                 volGrowth: -1.6 },
  { sku: "CC Classic 8x330ml",    brand: "CC Classic", pack: "8x330ml MP",    packMl: 2640, tier: "Multipack",    role: "Core",    ppl: 1.70, rsp: 4.49, velocity: 3.8,  distribution: 72, revM: 6.2,  gpMargin: 26, gpPerStore: 640,  priceIndex: 100, compPrice: 4.39, vsComp: 2.3,  elasticity: -1.42, incrContrib: 68, cannibPct: 10, cannibFrom: ["CC Classic 330ml","CC Classic 24x330ml"], volGrowth: 2.8 },
  { sku: "CC Classic 18x330ml",   brand: "CC Classic", pack: "18x330ml MP",   packMl: 5940, tier: "Multipack",    role: "Traffic", ppl: 1.18, rsp: 7.00, velocity: 1.4,  distribution: 48, revM: 2.2,  gpMargin: 18, gpPerStore: 260,  priceIndex: 94,  compPrice: 6.79, vsComp: 3.1,  elasticity: -1.72, incrContrib: 34, cannibPct: 18, cannibFrom: ["CC Classic 8x330ml","CC Classic 24x330ml"], volGrowth: -0.6 },
  { sku: "CC Classic 24x330ml",   brand: "CC Classic", pack: "24x330ml MP",   packMl: 7920, tier: "Multipack",    role: "Core",    ppl: 1.01, rsp: 8.00, velocity: 4.6,  distribution: 82, revM: 10.8, gpMargin: 22, gpPerStore: 890,  priceIndex: 96,  compPrice: 7.79, vsComp: 2.7,  elasticity: -1.52, incrContrib: 62, cannibPct: 12, cannibFrom: ["CC Classic 8x330ml"],               volGrowth: 3.2 },

  // ======== CC Zero ========
  { sku: "CC Zero 150ml",         brand: "CC Zero",   pack: "150ml Can",     packMl: 150,  tier: "Single Serve", role: "Premium", ppl: 7.00, rsp: 1.05, velocity: 1.4,  distribution: 28, revM: 0.5,  gpMargin: 50, gpPerStore: 290,  priceIndex: 120, compPrice: 0.95, vsComp: 10.5, elasticity: -0.88, incrContrib: 94, cannibPct: 1,  cannibFrom: ["CC Zero 250ml"],                  volGrowth: 15.2 },
  { sku: "CC Zero 250ml",         brand: "CC Zero",   pack: "250ml Can",     packMl: 250,  tier: "Single Serve", role: "Premium", ppl: 5.40, rsp: 1.35, velocity: 1.8,  distribution: 36, revM: 0.9,  gpMargin: 46, gpPerStore: 340,  priceIndex: 115, compPrice: 1.25, vsComp: 8.0,  elasticity: -1.00, incrContrib: 88, cannibPct: 3,  cannibFrom: ["CC Zero 330ml"],                  volGrowth: 11.0 },
  { sku: "CC Zero 330ml",         brand: "CC Zero",   pack: "330ml Can",     packMl: 330,  tier: "Single Serve", role: "Premium", ppl: 4.21, rsp: 1.39, velocity: 6.0,  distribution: 82, revM: 6.8,  gpMargin: 40, gpPerStore: 960,  priceIndex: 108, compPrice: 1.35, vsComp: 3.0,  elasticity: -1.18, incrContrib: 88, cannibPct: 3,  cannibFrom: ["Diet Coke 330ml"],                volGrowth: 6.8 },
  { sku: "CC Zero 500ml",         brand: "CC Zero",   pack: "500ml PET",     packMl: 500,  tier: "On-the-Go",   role: "Core",    ppl: 3.90, rsp: 1.95, velocity: 4.3,  distribution: 78, revM: 5.5,  gpMargin: 36, gpPerStore: 648,  priceIndex: 113, compPrice: 1.79, vsComp: 8.9,  elasticity: -1.52, incrContrib: 72, cannibPct: 6,  cannibFrom: ["CC Zero 330ml","Diet Coke 500ml"], volGrowth: 4.2 },
  { sku: "CC Zero 1.25L",         brand: "CC Zero",   pack: "1.25L PET",     packMl: 1250, tier: "Multi Serve",  role: "Core",    ppl: 1.76, rsp: 2.20, velocity: 2.2,  distribution: 48, revM: 1.8,  gpMargin: 26, gpPerStore: 360,  priceIndex: 102, compPrice: 2.15, vsComp: 2.3,  elasticity: -1.72, incrContrib: 48, cannibPct: 12, cannibFrom: ["CC Zero 1.5L"],                   volGrowth: 1.4 },
  { sku: "CC Zero 1.5L",          brand: "CC Zero",   pack: "1.5L PET",      packMl: 1500, tier: "Multi Serve",  role: "Core",    ppl: 1.46, rsp: 2.19, velocity: 2.0,  distribution: 72, revM: 3.2,  gpMargin: 24, gpPerStore: 288,  priceIndex: 104, compPrice: 2.15, vsComp: 1.9,  elasticity: -1.78, incrContrib: 45, cannibPct: 14, cannibFrom: ["CC Classic 1.5L","CC Zero 500ml"], volGrowth: 1.8 },
  { sku: "CC Zero 1.75L",         brand: "CC Zero",   pack: "1.75L PET",     packMl: 1750, tier: "Multi Serve",  role: "Traffic", ppl: 1.31, rsp: 2.29, velocity: 1.2,  distribution: 32, revM: 0.8,  gpMargin: 20, gpPerStore: 210,  priceIndex: 96,  compPrice: 2.35, vsComp: -2.6, elasticity: -1.88, incrContrib: 32, cannibPct: 20, cannibFrom: ["CC Zero 1.5L","CC Zero 2L"],       volGrowth: -3.0 },
  { sku: "CC Zero 2L",            brand: "CC Zero",   pack: "2L PET",        packMl: 2000, tier: "Multi Serve",  role: "Traffic", ppl: 1.08, rsp: 2.15, velocity: 1.6,  distribution: 58, revM: 2.1,  gpMargin: 20, gpPerStore: 210,  priceIndex: 100, compPrice: 2.19, vsComp: -1.8, elasticity: -2.05, incrContrib: 32, cannibPct: 18, cannibFrom: ["CC Zero 1.5L","CC Classic 2L"],    volGrowth: -0.4 },
  { sku: "CC Zero 8x330ml",       brand: "CC Zero",   pack: "8x330ml MP",    packMl: 2640, tier: "Multipack",    role: "Core",    ppl: 1.78, rsp: 4.69, velocity: 3.2,  distribution: 64, revM: 4.4,  gpMargin: 28, gpPerStore: 560,  priceIndex: 104, compPrice: 4.49, vsComp: 4.5,  elasticity: -1.40, incrContrib: 62, cannibPct: 12, cannibFrom: ["CC Zero 330ml","CC Zero 24x330ml"], volGrowth: 5.4 },
  { sku: "CC Zero 18x330ml",      brand: "CC Zero",   pack: "18x330ml MP",   packMl: 5940, tier: "Multipack",    role: "Traffic", ppl: 1.22, rsp: 7.25, velocity: 1.0,  distribution: 38, revM: 1.2,  gpMargin: 16, gpPerStore: 180,  priceIndex: 92,  compPrice: 6.99, vsComp: 3.7,  elasticity: -1.80, incrContrib: 28, cannibPct: 22, cannibFrom: ["CC Zero 8x330ml","CC Zero 24x330ml"], volGrowth: -1.4 },
  { sku: "CC Zero 24x330ml",      brand: "CC Zero",   pack: "24x330ml MP",   packMl: 7920, tier: "Multipack",    role: "Core",    ppl: 1.05, rsp: 8.29, velocity: 3.8,  distribution: 70, revM: 7.2,  gpMargin: 24, gpPerStore: 720,  priceIndex: 98,  compPrice: 7.99, vsComp: 3.8,  elasticity: -1.48, incrContrib: 58, cannibPct: 14, cannibFrom: ["CC Zero 8x330ml"],                 volGrowth: 6.0 },

  // ======== Diet Coke ========
  { sku: "Diet Coke 150ml",       brand: "Diet Coke", pack: "150ml Can",     packMl: 150,  tier: "Single Serve", role: "Premium", ppl: 6.33, rsp: 0.95, velocity: 1.2,  distribution: 30, revM: 0.4,  gpMargin: 46, gpPerStore: 260,  priceIndex: 114, compPrice: 0.85, vsComp: 11.8, elasticity: -0.95, incrContrib: 90, cannibPct: 2,  cannibFrom: ["Diet Coke 250ml"],                volGrowth: 4.2 },
  { sku: "Diet Coke 250ml",       brand: "Diet Coke", pack: "250ml Can",     packMl: 250,  tier: "Single Serve", role: "Core",    ppl: 4.80, rsp: 1.20, velocity: 1.6,  distribution: 38, revM: 0.7,  gpMargin: 42, gpPerStore: 310,  priceIndex: 108, compPrice: 1.09, vsComp: 10.1, elasticity: -1.10, incrContrib: 82, cannibPct: 4,  cannibFrom: ["Diet Coke 330ml"],                volGrowth: 2.0 },
  { sku: "Diet Coke 330ml",       brand: "Diet Coke", pack: "330ml Can",     packMl: 330,  tier: "Single Serve", role: "Core",    ppl: 3.91, rsp: 1.29, velocity: 5.8,  distribution: 86, revM: 7.1,  gpMargin: 36, gpPerStore: 684,  priceIndex: 100, compPrice: 1.25, vsComp: 3.2,  elasticity: -1.30, incrContrib: 58, cannibPct: 18, cannibFrom: ["CC Zero 330ml","CC Zero 500ml"],   volGrowth: -1.2 },
  { sku: "Diet Coke 500ml",       brand: "Diet Coke", pack: "500ml PET",     packMl: 500,  tier: "On-the-Go",   role: "Core",    ppl: 3.58, rsp: 1.79, velocity: 3.9,  distribution: 80, revM: 4.9,  gpMargin: 32, gpPerStore: 448,  priceIndex: 104, compPrice: 1.65, vsComp: 8.5,  elasticity: -1.68, incrContrib: 42, cannibPct: 22, cannibFrom: ["CC Zero 330ml","CC Classic 500ml","CC Zero 500ml"], volGrowth: -2.4 },
  { sku: "Diet Coke 1.25L",       brand: "Diet Coke", pack: "1.25L PET",     packMl: 1250, tier: "Multi Serve",  role: "Traffic", ppl: 1.52, rsp: 1.89, velocity: 1.4,  distribution: 40, revM: 1.0,  gpMargin: 20, gpPerStore: 200,  priceIndex: 92,  compPrice: 1.99, vsComp: -5.0, elasticity: -1.88, incrContrib: 34, cannibPct: 18, cannibFrom: ["Diet Coke 1.5L"],                 volGrowth: -2.8 },
  { sku: "Diet Coke 1.5L",        brand: "Diet Coke", pack: "1.5L PET",      packMl: 1500, tier: "Multi Serve",  role: "Traffic", ppl: 1.33, rsp: 1.99, velocity: 2.2,  distribution: 74, revM: 3.0,  gpMargin: 20, gpPerStore: 310,  priceIndex: 96,  compPrice: 2.09, vsComp: -4.8, elasticity: -1.92, incrContrib: 40, cannibPct: 16, cannibFrom: ["CC Classic 1.5L","CC Zero 1.5L"],  volGrowth: -3.0 },
  { sku: "Diet Coke 1.75L",       brand: "Diet Coke", pack: "1.75L PET",     packMl: 1750, tier: "Multi Serve",  role: "Traffic", ppl: 1.14, rsp: 2.00, velocity: 0.8,  distribution: 22, revM: 0.3,  gpMargin: 16, gpPerStore: 120,  priceIndex: 88,  compPrice: 2.15, vsComp: -7.0, elasticity: -2.08, incrContrib: 22, cannibPct: 24, cannibFrom: ["Diet Coke 1.5L","Diet Coke 2L"],  volGrowth: -5.2 },
  { sku: "Diet Coke 2L",          brand: "Diet Coke", pack: "2L PET",        packMl: 2000, tier: "Multi Serve",  role: "Traffic", ppl: 1.00, rsp: 1.99, velocity: 1.8,  distribution: 68, revM: 2.4,  gpMargin: 18, gpPerStore: 220,  priceIndex: 94,  compPrice: 2.09, vsComp: -4.8, elasticity: -2.12, incrContrib: 36, cannibPct: 16, cannibFrom: ["Diet Coke 1.5L"],                 volGrowth: -2.0 },
  { sku: "Diet Coke 8x330ml",     brand: "Diet Coke", pack: "8x330ml MP",    packMl: 2640, tier: "Multipack",    role: "Core",    ppl: 1.59, rsp: 4.19, velocity: 2.6,  distribution: 60, revM: 3.4,  gpMargin: 24, gpPerStore: 420,  priceIndex: 98,  compPrice: 4.09, vsComp: 2.4,  elasticity: -1.48, incrContrib: 54, cannibPct: 14, cannibFrom: ["Diet Coke 330ml","Diet Coke 24x330ml"], volGrowth: -0.8 },
  { sku: "Diet Coke 18x330ml",    brand: "Diet Coke", pack: "18x330ml MP",   packMl: 5940, tier: "Multipack",    role: "Traffic", ppl: 1.12, rsp: 6.65, velocity: 0.6,  distribution: 28, revM: 0.6,  gpMargin: 14, gpPerStore: 100,  priceIndex: 88,  compPrice: 6.49, vsComp: 2.5,  elasticity: -1.90, incrContrib: 20, cannibPct: 26, cannibFrom: ["Diet Coke 8x330ml"],               volGrowth: -4.0 },
  { sku: "Diet Coke 24x330ml",    brand: "Diet Coke", pack: "24x330ml MP",   packMl: 7920, tier: "Multipack",    role: "Core",    ppl: 0.95, rsp: 7.49, velocity: 2.8,  distribution: 62, revM: 4.8,  gpMargin: 20, gpPerStore: 480,  priceIndex: 92,  compPrice: 7.29, vsComp: 2.7,  elasticity: -1.58, incrContrib: 48, cannibPct: 16, cannibFrom: ["Diet Coke 8x330ml"],               volGrowth: 0.4 },

  // ======== Fanta ========
  { sku: "Fanta Orange 150ml",    brand: "Fanta",     pack: "150ml Can",     packMl: 150,  tier: "Single Serve", role: "Premium", ppl: 6.00, rsp: 0.90, velocity: 1.0,  distribution: 24, revM: 0.3,  gpMargin: 44, gpPerStore: 220,  priceIndex: 110, compPrice: 0.79, vsComp: 13.9, elasticity: -0.98, incrContrib: 88, cannibPct: 2,  cannibFrom: ["Fanta Orange 250ml"],             volGrowth: 8.0 },
  { sku: "Fanta Orange 250ml",    brand: "Fanta",     pack: "250ml Can",     packMl: 250,  tier: "Single Serve", role: "Core",    ppl: 4.40, rsp: 1.10, velocity: 1.4,  distribution: 32, revM: 0.5,  gpMargin: 40, gpPerStore: 280,  priceIndex: 105, compPrice: 1.05, vsComp: 4.8,  elasticity: -1.12, incrContrib: 80, cannibPct: 5,  cannibFrom: ["Fanta Orange 330ml"],             volGrowth: 5.2 },
  { sku: "Fanta Orange 330ml",    brand: "Fanta",     pack: "330ml Can",     packMl: 330,  tier: "Single Serve", role: "Core",    ppl: 3.79, rsp: 1.25, velocity: 4.8,  distribution: 76, revM: 4.2,  gpMargin: 35, gpPerStore: 560,  priceIndex: 97,  compPrice: 1.19, vsComp: 5.0,  elasticity: -1.34, incrContrib: 74, cannibPct: 5,  cannibFrom: ["Sprite 330ml"],                   volGrowth: 5.4 },
  { sku: "Fanta Orange 500ml",    brand: "Fanta",     pack: "500ml PET",     packMl: 500,  tier: "On-the-Go",   role: "Core",    ppl: 3.38, rsp: 1.69, velocity: 3.2,  distribution: 74, revM: 3.0,  gpMargin: 30, gpPerStore: 390,  priceIndex: 96,  compPrice: 1.55, vsComp: 9.0,  elasticity: -1.56, incrContrib: 62, cannibPct: 7,  cannibFrom: ["Fanta Orange 330ml"],             volGrowth: 3.2 },
  { sku: "Fanta Orange 1.25L",    brand: "Fanta",     pack: "1.25L PET",     packMl: 1250, tier: "Multi Serve",  role: "Traffic", ppl: 1.44, rsp: 1.79, velocity: 1.2,  distribution: 36, revM: 0.6,  gpMargin: 20, gpPerStore: 160,  priceIndex: 90,  compPrice: 1.89, vsComp: -5.3, elasticity: -1.84, incrContrib: 30, cannibPct: 16, cannibFrom: ["Fanta Orange 1.5L"],               volGrowth: -2.4 },
  { sku: "Fanta Orange 1.5L",     brand: "Fanta",     pack: "1.5L PET",      packMl: 1500, tier: "Multi Serve",  role: "Traffic", ppl: 1.20, rsp: 1.79, velocity: 1.8,  distribution: 64, revM: 1.8,  gpMargin: 22, gpPerStore: 230,  priceIndex: 92,  compPrice: 1.89, vsComp: -5.3, elasticity: -1.90, incrContrib: 38, cannibPct: 12, cannibFrom: ["Fanta Orange 500ml"],              volGrowth: -0.6 },
  { sku: "Fanta Orange 1.75L",    brand: "Fanta",     pack: "1.75L PET",     packMl: 1750, tier: "Multi Serve",  role: "Traffic", ppl: 1.09, rsp: 1.89, velocity: 0.6,  distribution: 18, revM: 0.2,  gpMargin: 16, gpPerStore: 90,   priceIndex: 86,  compPrice: 1.99, vsComp: -5.0, elasticity: -2.10, incrContrib: 18, cannibPct: 28, cannibFrom: ["Fanta Orange 1.5L","Fanta Orange 2L"], volGrowth: -6.0 },
  { sku: "Fanta Orange 2L",       brand: "Fanta",     pack: "2L PET",        packMl: 2000, tier: "Multi Serve",  role: "Traffic", ppl: 0.95, rsp: 1.89, velocity: 1.8,  distribution: 62, revM: 1.8,  gpMargin: 18, gpPerStore: 186,  priceIndex: 92,  compPrice: 1.99, vsComp: -5.0, elasticity: -2.18, incrContrib: 30, cannibPct: 12, cannibFrom: ["Fanta Orange 500ml"],              volGrowth: -1.0 },
  { sku: "Fanta Orange 8x330ml",  brand: "Fanta",     pack: "8x330ml MP",    packMl: 2640, tier: "Multipack",    role: "Core",    ppl: 1.52, rsp: 4.00, velocity: 2.0,  distribution: 50, revM: 2.2,  gpMargin: 24, gpPerStore: 320,  priceIndex: 96,  compPrice: 3.89, vsComp: 2.8,  elasticity: -1.50, incrContrib: 56, cannibPct: 10, cannibFrom: ["Fanta Orange 330ml"],              volGrowth: 2.0 },
  { sku: "Fanta Orange 18x330ml", brand: "Fanta",     pack: "18x330ml MP",   packMl: 5940, tier: "Multipack",    role: "Traffic", ppl: 1.06, rsp: 6.29, velocity: 0.4,  distribution: 20, revM: 0.3,  gpMargin: 12, gpPerStore: 70,   priceIndex: 84,  compPrice: 6.19, vsComp: 1.6,  elasticity: -1.96, incrContrib: 16, cannibPct: 30, cannibFrom: ["Fanta Orange 8x330ml"],            volGrowth: -5.0 },
  { sku: "Fanta Orange 24x330ml", brand: "Fanta",     pack: "24x330ml MP",   packMl: 7920, tier: "Multipack",    role: "Core",    ppl: 0.88, rsp: 6.99, velocity: 2.2,  distribution: 52, revM: 3.0,  gpMargin: 20, gpPerStore: 360,  priceIndex: 90,  compPrice: 6.79, vsComp: 2.9,  elasticity: -1.60, incrContrib: 44, cannibPct: 14, cannibFrom: ["Fanta Orange 8x330ml"],            volGrowth: 1.8 },

  // ======== Sprite ========
  { sku: "Sprite 150ml",          brand: "Sprite",    pack: "150ml Can",     packMl: 150,  tier: "Single Serve", role: "Premium", ppl: 5.67, rsp: 0.85, velocity: 0.8,  distribution: 20, revM: 0.2,  gpMargin: 42, gpPerStore: 180,  priceIndex: 108, compPrice: 0.75, vsComp: 13.3, elasticity: -1.00, incrContrib: 86, cannibPct: 2,  cannibFrom: ["Sprite 250ml"],                   volGrowth: 6.0 },
  { sku: "Sprite 250ml",          brand: "Sprite",    pack: "250ml Can",     packMl: 250,  tier: "Single Serve", role: "Core",    ppl: 4.00, rsp: 1.00, velocity: 1.2,  distribution: 28, revM: 0.4,  gpMargin: 38, gpPerStore: 240,  priceIndex: 102, compPrice: 0.99, vsComp: 1.0,  elasticity: -1.14, incrContrib: 78, cannibPct: 5,  cannibFrom: ["Sprite 330ml"],                   volGrowth: 3.6 },
  // STORYLINE: Sprite 330ml is significantly underpriced vs pack ladder - anomaly for single serve
  { sku: "Sprite 330ml",          brand: "Sprite",    pack: "330ml Can",     packMl: 330,  tier: "Single Serve", role: "Traffic", ppl: 2.73, rsp: 0.90, velocity: 4.2,  distribution: 68, revM: 3.4,  gpMargin: 28, gpPerStore: 280,  priceIndex: 78,  compPrice: 1.15, vsComp: 3.5,  elasticity: -1.28, incrContrib: 38, cannibPct: 9,  cannibFrom: ["Fanta Orange 330ml","CC Classic 330ml"], volGrowth: 1.0 },
  { sku: "Sprite 500ml",          brand: "Sprite",    pack: "500ml PET",     packMl: 500,  tier: "On-the-Go",   role: "Traffic", ppl: 3.30, rsp: 1.65, velocity: 2.8,  distribution: 62, revM: 2.6,  gpMargin: 28, gpPerStore: 202,  priceIndex: 94,  compPrice: 1.55, vsComp: 6.5,  elasticity: -1.64, incrContrib: 28, cannibPct: 11, cannibFrom: ["Fanta Orange 500ml","Sprite 330ml"], volGrowth: -0.4 },
  { sku: "Sprite 1.25L",          brand: "Sprite",    pack: "1.25L PET",     packMl: 1250, tier: "Multi Serve",  role: "Traffic", ppl: 1.28, rsp: 1.59, velocity: 0.8,  distribution: 26, revM: 0.3,  gpMargin: 18, gpPerStore: 100,  priceIndex: 84,  compPrice: 1.69, vsComp: -5.9, elasticity: -1.92, incrContrib: 22, cannibPct: 22, cannibFrom: ["Sprite 1.5L"],                     volGrowth: -4.4 },
  { sku: "Sprite 1.5L",           brand: "Sprite",    pack: "1.5L PET",      packMl: 1500, tier: "Multi Serve",  role: "Traffic", ppl: 1.20, rsp: 1.79, velocity: 1.4,  distribution: 52, revM: 1.2,  gpMargin: 22, gpPerStore: 148,  priceIndex: 88,  compPrice: 1.89, vsComp: -5.3, elasticity: -2.00, incrContrib: 24, cannibPct: 14, cannibFrom: ["Sprite 500ml","Fanta Orange 2L"],   volGrowth: -2.2 },
  { sku: "Sprite 1.75L",          brand: "Sprite",    pack: "1.75L PET",     packMl: 1750, tier: "Multi Serve",  role: "Traffic", ppl: 1.03, rsp: 1.79, velocity: 0.4,  distribution: 14, revM: 0.1,  gpMargin: 14, gpPerStore: 60,   priceIndex: 82,  compPrice: 1.89, vsComp: -5.3, elasticity: -2.14, incrContrib: 14, cannibPct: 32, cannibFrom: ["Sprite 1.5L","Sprite 2L"],         volGrowth: -7.0 },
  { sku: "Sprite 2L",             brand: "Sprite",    pack: "2L PET",        packMl: 2000, tier: "Multi Serve",  role: "Traffic", ppl: 0.90, rsp: 1.79, velocity: 1.2,  distribution: 48, revM: 0.8,  gpMargin: 16, gpPerStore: 130,  priceIndex: 86,  compPrice: 1.89, vsComp: -5.3, elasticity: -2.20, incrContrib: 22, cannibPct: 16, cannibFrom: ["Sprite 1.5L"],                     volGrowth: -2.8 },
  { sku: "Sprite 8x330ml",        brand: "Sprite",    pack: "8x330ml MP",    packMl: 2640, tier: "Multipack",    role: "Core",    ppl: 1.40, rsp: 3.69, velocity: 1.6,  distribution: 42, revM: 1.4,  gpMargin: 22, gpPerStore: 240,  priceIndex: 92,  compPrice: 3.59, vsComp: 2.8,  elasticity: -1.54, incrContrib: 48, cannibPct: 12, cannibFrom: ["Sprite 330ml"],                     volGrowth: 1.2 },
  { sku: "Sprite 18x330ml",       brand: "Sprite",    pack: "18x330ml MP",   packMl: 5940, tier: "Multipack",    role: "Traffic", ppl: 1.01, rsp: 5.99, velocity: 0.3,  distribution: 16, revM: 0.2,  gpMargin: 10, gpPerStore: 50,   priceIndex: 80,  compPrice: 5.89, vsComp: 1.7,  elasticity: -2.00, incrContrib: 12, cannibPct: 34, cannibFrom: ["Sprite 8x330ml"],                  volGrowth: -6.0 },
  { sku: "Sprite 24x330ml",       brand: "Sprite",    pack: "24x330ml MP",   packMl: 7920, tier: "Multipack",    role: "Core",    ppl: 0.82, rsp: 6.49, velocity: 1.8,  distribution: 44, revM: 1.8,  gpMargin: 18, gpPerStore: 260,  priceIndex: 86,  compPrice: 6.29, vsComp: 3.2,  elasticity: -1.62, incrContrib: 40, cannibPct: 16, cannibFrom: ["Sprite 8x330ml"],                  volGrowth: 0.6 },
]

// Derived lists
export const allSkuNames = skuMaster.map(s => s.sku)
export const allBrands  = ["CC Classic", "CC Zero", "Diet Coke", "Fanta", "Sprite"] as const
export const allPacks   = [...new Set(skuMaster.map(s => s.pack))] as string[]
export const allTiers   = ["Single Serve", "On-the-Go", "Multi Serve", "Multipack"] as const
export const allRoles   = ["Traffic", "Core", "Premium"] as const
export const allPackSizes = ["150ml", "250ml", "330ml", "500ml", "1.25L", "1.5L", "1.75L", "2L", "8x330ml", "18x330ml", "24x330ml"] as const

export const retailerOptions = ["All Retailers", "Esselunga", "Conad", "Coop Italia", "Carrefour IT", "Eurospin", "Lidl IT", "PAM", "Despar"] as const
export const mechanicOptions = ["All Mechanics", "TPR", "Multibuy", "BOGOF", "Meal Deal", "\u20ac1 PMP", "Display Only"] as const

export const brandColors: Record<string, string> = {
  "CC Classic": "#ef4444",
  "CC Zero":    "#f97316",
  "Diet Coke":  "#a3a3a3",
  "Fanta":      "#f59e0b",
  "Sprite":     "#22c55e",
}

export const skuColors: Record<string, string> = Object.fromEntries(
  skuMaster.map(s => [s.sku, brandColors[s.brand] || "#888"])
)

// Seeded hash for deterministic but visually varied data across filters
export function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}
