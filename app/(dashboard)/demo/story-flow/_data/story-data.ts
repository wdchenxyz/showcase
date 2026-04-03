import type { StoryNode } from "../_lib/types"

export const storyData: StoryNode[] = [
  // Root
  {
    id: "root",
    parentId: null,
    headline: "The AI Regulation Race Begins",
    description:
      "G7 Hiroshima AI Process kickstarts global coordination on AI governance, setting the stage for divergent national approaches.",
    date: "2023-06",
    category: "policy",
    icon: "Government",
  },

  // === Branch 1: EU Policy ===
  {
    id: "eu-ai-act-draft",
    parentId: "root",
    headline: "EU AI Act Draft Advances",
    description:
      "European Parliament committees reach agreement on the world's first comprehensive AI regulation framework.",
    date: "2023-06",
    category: "policy",
    icon: "File01",
  },
  {
    id: "eu-parliament-debate",
    parentId: "eu-ai-act-draft",
    headline: "Parliamentary Debates Intensify",
    description:
      "MEPs clash over biometric surveillance bans and foundation model obligations in heated plenary sessions.",
    date: "2023-09",
    category: "policy",
    icon: "Comment01",
  },
  {
    id: "eu-ai-act-passed",
    parentId: "eu-parliament-debate",
    headline: "EU AI Act Passes",
    description:
      "European Parliament approves the AI Act with overwhelming majority, creating the world's first binding AI law.",
    date: "2024-03",
    category: "policy",
    icon: "Tick02",
  },
  {
    id: "eu-implementation",
    parentId: "eu-ai-act-passed",
    headline: "Implementation Timeline Set",
    description:
      "EU publishes phased rollout: banned practices in 6 months, high-risk rules in 24 months.",
    date: "2024-06",
    category: "policy",
    icon: "Calendar03",
  },
  {
    id: "eu-fines",
    parentId: "eu-implementation",
    headline: "First Enforcement Actions",
    description:
      "EU AI Office issues initial fines for non-compliant emotion recognition systems in hiring.",
    date: "2025-03",
    category: "legal",
    icon: "Alert02",
  },
  {
    id: "eu-compliance",
    parentId: "eu-implementation",
    headline: "Compliance Guidance Published",
    description:
      "European Commission releases detailed technical standards and compliance checklists for high-risk AI systems.",
    date: "2025-01",
    category: "policy",
    icon: "BookOpen01",
  },

  // === Branch 2: US Policy ===
  {
    id: "us-executive-order",
    parentId: "root",
    headline: "Biden Signs AI Executive Order",
    description:
      "Sweeping executive order mandates safety testing, red-teaming, and reporting requirements for powerful AI models.",
    date: "2023-10",
    category: "policy",
    icon: "PencilEdit01",
  },
  {
    id: "nist-guidelines",
    parentId: "us-executive-order",
    headline: "NIST AI Safety Guidelines",
    description:
      "National Institute of Standards and Technology publishes AI Risk Management Framework companion document.",
    date: "2024-01",
    category: "policy",
    icon: "Shield01",
  },
  {
    id: "senate-hearings",
    parentId: "us-executive-order",
    headline: "Senate AI Hearings",
    description:
      "Sam Altman, Dario Amodei, and other tech leaders testify before Congress on AI risks and regulation needs.",
    date: "2023-09",
    category: "policy",
    icon: "Building06",
  },
  {
    id: "california-sb1047",
    parentId: "senate-hearings",
    headline: "California SB 1047 Debate",
    description:
      "Controversial state bill proposes liability for AI developers; fierce lobbying from tech industry leads to veto.",
    date: "2024-08",
    category: "policy",
    icon: "Location01",
  },
  {
    id: "us-framework-debate",
    parentId: "nist-guidelines",
    headline: "Federal Framework Stalls",
    description:
      "Bipartisan AI legislation efforts fragment as Congress debates voluntary vs. mandatory approaches.",
    date: "2024-12",
    category: "policy",
    icon: "Loading03",
  },

  // === Branch 3: Industry Response ===
  {
    id: "openai-board-crisis",
    parentId: "root",
    headline: "OpenAI Board Crisis",
    description:
      "Sam Altman fired and reinstated within days, exposing tensions between safety research and commercial pressures.",
    date: "2023-11",
    category: "industry",
    icon: "Alert02",
  },
  {
    id: "frontier-model-forum",
    parentId: "openai-board-crisis",
    headline: "Frontier Model Forum Launches",
    description:
      "Google, Microsoft, OpenAI, and Anthropic form industry body for responsible AI development and safety research.",
    date: "2023-07",
    category: "industry",
    icon: "UserGroup",
  },
  {
    id: "voluntary-commitments",
    parentId: "frontier-model-forum",
    headline: "Voluntary Safety Commitments",
    description:
      "15 AI companies sign White House voluntary commitments on watermarking, red-teaming, and information sharing.",
    date: "2023-09",
    category: "industry",
    icon: "Agreement02",
  },
  {
    id: "gemini-launch",
    parentId: "openai-board-crisis",
    headline: "Google Gemini Launch",
    description:
      "Google releases Gemini multimodal model, intensifying the AI capability race amid safety concerns.",
    date: "2023-12",
    category: "industry",
    icon: "AiChat02",
  },
  {
    id: "safety-departures",
    parentId: "gemini-launch",
    headline: "Safety Team Departures",
    description:
      "Key safety researchers leave major AI labs citing commercialization pressure overriding safety priorities.",
    date: "2024-05",
    category: "social",
    icon: "UserRemove01",
  },
  {
    id: "industry-lobbying",
    parentId: "voluntary-commitments",
    headline: "Industry Lobbying Intensifies",
    description:
      "AI companies spend record amounts lobbying against mandatory regulation, pushing self-governance alternatives.",
    date: "2024-06",
    category: "industry",
    icon: "Money01",
  },

  // === Branch 4: Open Source Movement ===
  {
    id: "llama2-release",
    parentId: "root",
    headline: "Meta Releases Llama 2",
    description:
      "Meta open-sources Llama 2 family of models, sparking debate on open vs. closed AI development.",
    date: "2023-07",
    category: "opensource",
    icon: "CodeCircle",
  },
  {
    id: "mistral-funding",
    parentId: "llama2-release",
    headline: "Mistral AI Raises €400M",
    description:
      "French open-source AI startup raises massive funding round, challenging US dominance in foundation models.",
    date: "2023-12",
    category: "opensource",
    icon: "Money01",
  },
  {
    id: "huggingface-growth",
    parentId: "llama2-release",
    headline: "Hugging Face Ecosystem Explodes",
    description:
      "Open model hub surpasses 500K models, becoming the GitHub of machine learning with community-driven safety tools.",
    date: "2024-03",
    category: "opensource",
    icon: "Share01",
  },
  {
    id: "opensource-safety-debate",
    parentId: "huggingface-growth",
    headline: "Open Source Safety Debate",
    description:
      "Researchers disagree on whether open-weight models enable or undermine AI safety through transparency.",
    date: "2024-07",
    category: "opensource",
    icon: "Comment01",
  },
  {
    id: "model-weight-controversy",
    parentId: "opensource-safety-debate",
    headline: "Weight Sharing Controversy",
    description:
      "Calls for restricting model weight distribution clash with open science advocates, EU considers exemptions.",
    date: "2024-11",
    category: "opensource",
    icon: "Lock",
  },

  // === Branch 5: Legal & Social ===
  {
    id: "nyt-lawsuit",
    parentId: "root",
    headline: "NYT Sues OpenAI",
    description:
      "New York Times files landmark copyright lawsuit against OpenAI and Microsoft over training data usage.",
    date: "2023-12",
    category: "legal",
    icon: "LegalDocument01",
  },
  {
    id: "artist-copyright",
    parentId: "nyt-lawsuit",
    headline: "Artist Copyright Cases Mount",
    description:
      "Class-action lawsuits from visual artists against Stability AI and Midjourney proceed through courts.",
    date: "2024-02",
    category: "legal",
    icon: "PaintBoard",
  },
  {
    id: "deepfake-legislation",
    parentId: "nyt-lawsuit",
    headline: "Deepfake Legislation Wave",
    description:
      "Multiple US states pass laws criminalizing non-consensual AI-generated intimate imagery and election deepfakes.",
    date: "2024-06",
    category: "social",
    icon: "Image01",
  },
  {
    id: "job-displacement",
    parentId: "deepfake-legislation",
    headline: "Job Displacement Studies",
    description:
      "IMF and World Bank publish analyses showing AI could affect 40% of global jobs, amplifying inequality.",
    date: "2024-09",
    category: "social",
    icon: "ChartLineData01",
  },
]
