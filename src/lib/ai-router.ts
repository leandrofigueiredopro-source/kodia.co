export interface AIConfig {
  model: string;
  systemPrompt: string;
  search_domain_filter?: string[];
  search_recency_filter?: string;
  temperature: number;
  search_mode?: string;
}

/**
 * Analyzes the user's message and returns a tailored AI configuration.
 * This "Router" ensures the response tone and search parameters match the user's intent.
 */
export function buildRequestConfig(userMessage: string): AIConfig {
  const msg = userMessage.toLowerCase();
  
  // 1. Technical / Coding Keywords
  const isTech = /code|api|framework|stack|next\.js|react|python|base de données|auth|stripe/i.test(msg);
  
  // 2. Marketing / Business Keywords
  const isBusiness = /prix|marché|client|cible|concurrent|business model|monétisation|freemium/i.test(msg);
  
  // 3. Design / Branding Keywords
  const isDesign = /couleur|logo|police|typographie|design|interface|ux|ui|slogan/i.test(msg);
  
  // 4. Academic / Research Keywords (Deep Dive)
  const isResearch = /étude|recherche|tendance|analyse|statistique|prévision|white paper/i.test(msg);

  // Configuration logic based on keywords
  if (isTech) {
    return {
      model: "sonar-pro",
      systemPrompt: "You are an expert full-stack developer and solutions architect. Provide detailed, practical technical advice. Favor official documentation sources.",
      search_domain_filter: ["github.com", "stackoverflow.com", "docs.nextjs.org", "supabase.com", "vercel.com"],
      search_recency_filter: "month",
      temperature: 0.2 // More deterministic, factual code
    };
  }
  
  if (isBusiness) {
    return {
      model: "sonar",
      systemPrompt: "You are a seasoned startup advisor and market strategist. Analyze the business viability, suggest pricing tiers, and identify target demographics. Use trusted industry reports.",
      search_domain_filter: ["crunchbase.com", "techcrunch.com", "ycombinator.com", "indiehackers.com"],
      search_recency_filter: "month",
      temperature: 0.7 // More creative for marketing angles
    };
  }
  
  if (isDesign) {
    return {
      model: "sonar",
      systemPrompt: "You are a creative director specialized in SaaS branding. Suggest modern color palettes, font pairings (Outfit, Inter, DM Serif Display), and UI layouts.",
      search_domain_filter: ["dribbble.com", "behance.net", "awwwards.com", "fonts.google.com"],
      temperature: 0.9 // Maximum creativity for visual ideas
    };
  }

  if (isResearch) {
    return {
      model: "sonar-pro",
      search_mode: "academic", // Prioritize scholarly sources
      systemPrompt: "You are a research analyst. Provide thorough, citation-backed summaries of market trends and technological advancements.",
      temperature: 0.1,
      search_recency_filter: "year"
    };
  }
  
  // Default Configuration
  return {
    model: "sonar",
    systemPrompt: "You are Kodia, an AI assistant specialized in helping non-developers create SaaS products. You are encouraging, clear, and step-by-step.",
    temperature: 0.5,
    search_domain_filter: ["-reddit.com", "-pinterest.com"] // Exclude noisy sources
  };
}
