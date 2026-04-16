import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

export async function createServer() {
  const PORT = 3000;

  app.use(express.json());

  // API Route for Kodia Chat (Two-Pass Search Strategy)
  app.post("/api/kodia-chat", async (req, res) => {
    const { message, idea } = req.body;
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      console.warn("PERPLEXITY_API_KEY is missing. Using mock response.");
      return res.json({
        content: "J'ai analysé le marché pour ton idée. Voici le plan stratégique personnalisé basé sur les dernières tendances.",
        steps: [
          { title: "Étude de marché", description: "Il t'explique exactement qui sont tes clients...", content: "Analyse simulée : Le marché des SaaS pour freelances est en pleine expansion..." },
          { title: "Stratégie de prix", description: "Il te dit combien facturer...", content: "Modèle suggéré : 19€/mois avec essai gratuit." },
          { title: "MVP & Fonctionnalités", description: "Il liste les 3 fonctionnalités indispensables...", content: "1. Dashboard intuitif, 2. Export PDF, 3. Rappels auto." },
          { title: "Branding & Naming", description: "Il crée ton nom de marque...", content: "Nom suggéré : FreelanceFlow. Couleurs : Vert émeraude." },
          { title: "Stack Technique", description: "Il choisit les outils techniques...", content: "Next.js, Tailwind CSS, Supabase." },
          { title: "Contenu Landing Page", description: "Il rédige tout le texte...", content: "Titre : Gérez vos factures sans stress." },
          { title: "Séquence Email", description: "Il écrit tes 5 premiers emails...", content: "Email 1 : Bienvenue sur FreelanceFlow !" },
          { title: "Le Mega Prompt", description: "Il compile tout ça...", content: "Mega prompt généré pour Google AI Studio." }
        ],
        megaPrompt: "Mega prompt simulé pour Google AI Studio...",
        citations: []
      });
    }

    try {
      // PASS 1: Broad Discovery
      const pass1Response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: `Analyze the following user idea: ${idea || message}. Identify the top 3 industry-standard technologies, the 2 main competitors, and 1 unexpected market trend. Return ONLY a structured JSON summary with keys: tech_stack, competitors, trend.`
            },
            { role: "user", content: message }
          ],
          temperature: 0.2,
          search_context_size: "low"
        })
      });

      const pass1Data = await pass1Response.json();
      const summary = pass1Data.choices[0].message.content;
      
      // Adaptation Logic for Pass 2
      let searchMode = "web";
      let domainFilter: string[] = [];
      if (summary.toLowerCase().includes("ai integration")) {
        searchMode = "academic";
        domainFilter = ["arxiv.org", "paperswithcode.com"];
      }

      // PASS 2: Deep-Dive Strategy & 8-Step Plan Generation
      const pass2Response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: `Tu es un expert en création de SaaS et ingénieur IA. Basé sur ces découvertes : ${summary}, génère un plan stratégique unique en 8 étapes pour l'idée : ${idea || message}.
              
              IMPORTANT : Tu DOIS retourner uniquement un objet JSON valide avec la structure suivante :
              {
                "content": "Message de synthèse court pour le chat",
                "steps": [
                  { "title": "Étude de marché", "description": "Il t'explique exactement qui sont tes clients, combien ils sont, ce qu'ils veulent.", "content": "..." },
                  { "title": "Stratégie de prix", "description": "Il te dit combien facturer, quel modèle de prix choisir.", "content": "..." },
                  { "title": "MVP & Fonctionnalités", "description": "Il liste les 3 fonctionnalités indispensables à créer en premier.", "content": "..." },
                  { "title": "Branding & Naming", "description": "Il crée ton nom de marque, tes couleurs, ton slogan.", "content": "..." },
                  { "title": "Stack Technique", "description": "Il choisit les outils techniques les plus adaptés à ton niveau.", "content": "..." },
                  { "title": "Contenu Landing Page", "description": "Il rédige tout le texte de ta landing page.", "content": "..." },
                  { "title": "Séquence Email", "description": "Il écrit tes 5 premiers emails clients.", "content": "..." },
                  { "title": "Le Mega Prompt", "description": "Il compile tout ça en un seul mega prompt...", "content": "..." }
                ],
                "megaPrompt": "Le contenu complet du mega prompt pour Google AI Studio",
                "citations": ["url1", "url2"]
              }
              
              Le contenu de chaque étape doit être DYNAMIQUE et basé sur les recherches réelles. Ne pas utiliser de template statique.`
            },
            { role: "user", content: message }
          ],
          temperature: 0.5,
          search_context_size: "high",
          search_mode: searchMode,
          search_domain_filter: domainFilter.length > 0 ? domainFilter : undefined
        })
      });

      const pass2Data = await pass2Response.json();
      const finalResult = JSON.parse(pass2Data.choices[0].message.content);
      
      res.json({
        ...finalResult,
        citations: pass2Data.citations || []
      });
    } catch (error) {
      console.error("Perplexity API Error:", error);
      res.status(500).json({ error: "Failed to process research request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

createServer();

export default app;
