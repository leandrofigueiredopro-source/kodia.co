
interface Step {
  title: string;
  description: string;
  content: string;
}

export async function generateMockPlan(idea: string): Promise<{ steps: Step[], megaPrompt: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const steps: Step[] = [
    {
      title: "Étape 1 : Étude de marché",
      description: "Il t'explique exactement qui sont tes clients, combien ils sont, ce qu'ils veulent.",
      content: `Pour ton idée "${idea}", tes clients cibles sont les indépendants et TPE de 1 à 10 employés. Le marché français compte environ 3 millions de travailleurs indépendants ayant besoin de simplifier leur facturation.`
    },
    {
      title: "Étape 2 : Stratégie de prix",
      description: "Il te dit combien facturer, quel modèle de prix choisir.",
      content: `Nous recommandons un prix de lancement à 19€/mois ou 190€/an. Propose une version gratuite limitée à 5 factures pour attirer les utilisateurs.`
    },
    {
      title: "Étape 3 : MVP & Fonctionnalités",
      description: "Il liste les 3 fonctionnalités indispensables à créer en premier.",
      content: `1. Création et édition de factures PDF.\n2. Dashboard de suivi des paiements.\n3. Gestion des clients et relances automatiques.`
    },
    {
      title: "Étape 4 : Branding & Naming",
      description: "Il crée ton nom de marque, tes couleurs, ton slogan.",
      content: `Nom suggéré : FactuFlow.\nPalette : Bleu marine (#1E3A8A) et Vert émeraude (#10B981).\nSlogan : "La facturation qui travaille pour vous."`
    },
    {
      title: "Étape 5 : Stack Technique",
      description: "Il choisit les outils techniques les plus adaptés.",
      content: `Frontend : Next.js + Tailwind.\nBackend : Supabase (Auth + DB).\nPaiements : Stripe.\nHébergement : Vercel.`
    },
    {
      title: "Étape 6 : Contenu Landing Page",
      description: "Il rédige tout le texte de ta landing page.",
      content: `Hero : "Facturez vos clients en 30 secondes".\nSous-titre : "Gérez devis, factures et relances depuis un seul tableau de bord."`
    },
    {
      title: "Étape 7 : Séquence Email",
      description: "Il écrit tes 5 premiers emails clients.",
      content: `Email 1 (Bienvenue) : "Merci d'avoir choisi FactuFlow !"\nEmail 2 (Tips) : "Personnalisez votre logo."\nEmail 3 : "Activez les relances auto."\nEmail 4 : "Découvrez les devis."\nEmail 5 : "Parrainage : 1 mois offert."`
    },
    {
      title: "Étape 8 : Le Mega Prompt",
      description: "Il compile tout ça en un seul mega prompt que tu colles dans Google AI Studio pour coder ton SaaS automatiquement.",
      content: `Ci-dessous le prompt complet pour générer automatiquement le code de ton SaaS.`
    }
  ];

  const megaPrompt = `Tu es un développeur expert. Crée une application SaaS de facturation pour freelances nommée "FactuFlow".

Fonctionnalités requises :
- Création de factures PDF
- Dashboard de suivi des paiements
- Gestion des clients
- Relances automatiques

Stack technique : Next.js 14, Tailwind CSS, Supabase, Stripe.

Génère le code complet de l'application avec authentification et interface moderne.`;

  return { steps, megaPrompt };
}
