import type { Article } from "../_lib/types"
import type { StoryFlowService } from "./service"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const SEED_ARTICLES: Article[] = [
  {
    id: "seed-1",
    title: "US Announces New Tariff Package on Chinese Imports",
    summary:
      "The White House unveiled a sweeping set of tariffs targeting $200B in Chinese goods, marking a major escalation in the trade war.",
    publishedDate: "2025-03-15",
    url: "https://example.com/tariff-package",
    source: "Reuters",
    similarityScore: 0.92,
  },
  {
    id: "seed-2",
    title: "EU Responds to Trump Trade Threats with Retaliatory Measures",
    summary:
      "European Commission announces counter-tariffs on American agricultural products and tech services in response to US trade policy.",
    publishedDate: "2025-03-10",
    url: "https://example.com/eu-response",
    source: "Financial Times",
    similarityScore: 0.88,
  },
  {
    id: "seed-3",
    title: "Asian Markets Tumble as Trade War Fears Intensify",
    summary:
      "Major Asian stock indices fell sharply as investors reacted to escalating tariff threats between the US and its trading partners.",
    publishedDate: "2025-03-12",
    url: "https://example.com/asian-markets",
    source: "Bloomberg",
    similarityScore: 0.85,
  },
  {
    id: "seed-4",
    title: "US Auto Industry Warns of Price Hikes from Tariffs",
    summary:
      "Detroit automakers warn that new tariffs on imported parts could raise vehicle prices by up to $5,000 per car.",
    publishedDate: "2025-03-08",
    url: "https://example.com/auto-tariffs",
    source: "Wall Street Journal",
    similarityScore: 0.79,
  },
  {
    id: "seed-5",
    title: "Canada Announces Tariff Retaliation Strategy",
    summary:
      "Canadian government outlines retaliatory tariff plan targeting US steel, aluminum, and agricultural products.",
    publishedDate: "2025-03-14",
    url: "https://example.com/canada-retaliation",
    source: "Globe and Mail",
    similarityScore: 0.82,
  },
]

const TRACEBACK_DATA: Record<string, Article[]> = {
  "seed-1": [
    {
      id: "tb-1a",
      title: "White House Signals Tougher Stance on China Trade",
      summary:
        "Senior officials hint at new tariff measures as trade talks stall, citing national security concerns.",
      publishedDate: "2025-02-20",
      url: "https://example.com/tough-stance",
      source: "Washington Post",
      similarityScore: 0.78,
    },
    {
      id: "tb-1b",
      title: "US-China Trade Talks Break Down Over Tech Transfer",
      summary:
        "Negotiations collapse as Beijing refuses to concede on forced technology transfer practices.",
      publishedDate: "2025-02-10",
      url: "https://example.com/talks-breakdown",
      source: "Reuters",
      similarityScore: 0.72,
    },
  ],
  "seed-2": [
    {
      id: "tb-2a",
      title: "EU Trade Commissioner Warns of Retaliation",
      summary:
        "Commissioner Dombrovskis says Europe will not hesitate to defend its economic interests against unilateral tariffs.",
      publishedDate: "2025-02-25",
      url: "https://example.com/eu-warning",
      source: "Politico",
      similarityScore: 0.75,
    },
    {
      id: "tb-shared-1",
      title: "WTO Rules US Steel Tariffs Violate Trade Agreements",
      summary:
        "World Trade Organization panel finds US Section 232 tariffs on steel and aluminum breach international trade law.",
      publishedDate: "2025-01-15",
      url: "https://example.com/wto-ruling",
      source: "Financial Times",
      similarityScore: 0.68,
    },
  ],
  "seed-3": [
    {
      id: "tb-3a",
      title: "Global Supply Chains Brace for Tariff Impact",
      summary:
        "Multinational companies accelerate supply chain diversification as trade tensions threaten established routes.",
      publishedDate: "2025-02-18",
      url: "https://example.com/supply-chains",
      source: "Bloomberg",
      similarityScore: 0.7,
    },
  ],
  "seed-4": [
    {
      id: "tb-4a",
      title: "Auto Parts Tariff Proposal Draws Industry Backlash",
      summary:
        "Major manufacturers lobby against proposed tariffs on imported auto components, warning of job losses.",
      publishedDate: "2025-02-05",
      url: "https://example.com/auto-lobby",
      source: "Detroit Free Press",
      similarityScore: 0.65,
    },
    {
      id: "tb-shared-1",
      title: "WTO Rules US Steel Tariffs Violate Trade Agreements",
      summary:
        "World Trade Organization panel finds US Section 232 tariffs on steel and aluminum breach international trade law.",
      publishedDate: "2025-01-15",
      url: "https://example.com/wto-ruling",
      source: "Financial Times",
      similarityScore: 0.62,
    },
  ],
  "seed-5": [
    {
      id: "tb-5a",
      title: "USMCA Under Strain as Trade Tensions Rise",
      summary:
        "The US-Mexico-Canada trade agreement faces its biggest test as tariff threats undermine trilateral cooperation.",
      publishedDate: "2025-02-22",
      url: "https://example.com/usmca-strain",
      source: "Globe and Mail",
      similarityScore: 0.73,
    },
  ],
  "tb-1a": [
    {
      id: "tb-d2-1",
      title: "Trump Campaign Pledges Aggressive Trade Policy",
      summary:
        "Presidential campaign rhetoric signals a return to protectionist trade measures if elected.",
      publishedDate: "2024-12-10",
      url: "https://example.com/campaign-trade",
      source: "Politico",
      similarityScore: 0.55,
    },
  ],
  "tb-1b": [
    {
      id: "tb-d2-2",
      title: "US-China Phase One Deal Falls Short of Goals",
      summary:
        "Analysis shows China failed to meet purchasing commitments under the 2020 trade agreement.",
      publishedDate: "2024-11-20",
      url: "https://example.com/phase-one",
      source: "CNBC",
      similarityScore: 0.48,
    },
  ],
  "tb-2a": [
    {
      id: "tb-d2-3",
      title: "Transatlantic Trade Relations at Historic Low",
      summary:
        "EU-US trade disputes multiply across tech regulation, agriculture, and industrial subsidies.",
      publishedDate: "2024-12-05",
      url: "https://example.com/transatlantic",
      source: "Financial Times",
      similarityScore: 0.52,
    },
  ],
  "tb-shared-1": [
    {
      id: "tb-d2-4",
      title: "Section 232 Tariffs: A History of Controversy",
      summary:
        "How national security justifications for trade barriers became a flashpoint in global commerce.",
      publishedDate: "2024-10-15",
      url: "https://example.com/section-232",
      source: "The Economist",
      similarityScore: 0.45,
    },
  ],
  "tb-3a": [
    {
      id: "tb-d2-5",
      title: "Vietnam Emerges as Alternative Manufacturing Hub",
      summary:
        "Southeast Asian nations benefit as companies shift production away from China amid trade uncertainty.",
      publishedDate: "2024-11-30",
      url: "https://example.com/vietnam-hub",
      source: "Nikkei Asia",
      similarityScore: 0.42,
    },
  ],
  "tb-4a": [
    {
      id: "tb-d2-6",
      title: "US Manufacturing Output Declines Despite Tariff Protection",
      summary:
        "Economic data shows tariffs failed to revive domestic manufacturing, contradicting policy goals.",
      publishedDate: "2024-11-10",
      url: "https://example.com/manufacturing-decline",
      source: "Wall Street Journal",
      similarityScore: 0.38,
    },
  ],
  "tb-5a": [
    {
      id: "tb-d2-7",
      title: "Canada-US Lumber Dispute Enters New Phase",
      summary:
        "Long-running softwood lumber trade dispute escalates with new duties imposed on Canadian imports.",
      publishedDate: "2024-12-18",
      url: "https://example.com/lumber-dispute",
      source: "CBC News",
      similarityScore: 0.35,
    },
  ],
  "tb-d2-1": [
    {
      id: "tb-d3-1",
      title: "Historical Analysis: Smoot-Hawley and Modern Protectionism",
      summary:
        "Economists draw parallels between 1930s trade policy and current protectionist trends.",
      publishedDate: "2024-08-20",
      url: "https://example.com/smoot-hawley",
      source: "The Atlantic",
      similarityScore: 0.28,
    },
  ],
  "tb-d2-2": [
    {
      id: "tb-d3-2",
      title: "Global Trade Volume Trends: A Decade in Review",
      summary:
        "Trade growth has slowed significantly since 2018, with tariff wars cited as a primary factor.",
      publishedDate: "2024-09-05",
      url: "https://example.com/trade-trends",
      source: "World Bank",
      similarityScore: 0.25,
    },
  ],
}

export class MockStoryFlowService implements StoryFlowService {
  async searchArticles(_query: string): Promise<Article[]> {
    await delay(500)
    return [...SEED_ARTICLES]
  }

  async traceBack(articleId: string): Promise<Article[]> {
    await delay(300)
    return [...(TRACEBACK_DATA[articleId] ?? [])]
  }
}
