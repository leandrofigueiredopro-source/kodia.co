import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Step {
  title: string;
  description: string;
  content: string;
}

export interface PlanResult {
  steps: Step[];
  megaPrompt: string;
}

export async function generatePlan(idea: string): Promise<PlanResult> {
  const prompt = `Tu es un expert en stratégie SaaS et développement produit. 
L'utilisateur a une idée de SaaS : "${idea}".

Génère un plan stratégique en 8 étapes précises pour ce SaaS.
Chaque étape doit avoir un titre, une courte description et un contenu détaillé.

Les étapes doivent être :
1. Étude de marché
2. Stratégie de prix
3. MVP & Fonctionnalités
4. Branding & Naming
5. Stack Technique
6. Contenu Landing Page
7. Séquence Email
8. Le Mega Prompt (Un prompt détaillé pour Google AI Studio pour générer le code complet de l'application).

Réponds UNIQUEMENT au format JSON suivant :
{
  "steps": [
    { "title": "...", "description": "...", "content": "..." },
    ...
  ],
  "megaPrompt": "..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Réponse vide de l'IA");
    }

    return JSON.parse(text) as PlanResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
