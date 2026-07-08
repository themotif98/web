import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json());

  // Initialize Gemini API client safely and lazily
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. AI Sommelier will run in fallback/mock mode.");
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API endpoints FIRST

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Spice Sommelier Endpoint
  app.post('/api/ai/sommelier', async (req, res) => {
    try {
      const { dishDescription, healthPreference, userMood, previousBlends } = req.body;

      if (!dishDescription) {
        return res.status(400).json({ error: 'Please describe your dish, ingredient, or culinary vision.' });
      }

      const client = getAiClient();

      if (!client) {
        // Safe, highly detailed fallback response if no API key is provided
        console.info("Using high-fidelity local AI sommelier simulations due to missing key.");
        const sampleRecommendations = [
          {
            recommendationTitle: "Imperial Candyan Highland Rub",
            explanation: `Based on your request for a luxurious, aromatic profile for "${dishDescription}", our sommelier suggests a regal blend of Ceylon Green Cardamom and Royal Black Pepper. The citrus-mint notes of cardamom balance the bold highland piperine heat, while Alba Cinnamon wraps the dish in a sweet woody embrace.`,
            blendRatios: [
              { spiceName: "Green Cardamom", percentage: 40, purpose: "Provides the top-note herbal-eucalyptus brightness" },
              { spiceName: "Royal Black Pepper", percentage: 30, purpose: "Adds deep highland thermogenic heat" },
              { spiceName: "Alba Ceylon Cinnamon", percentage: 20, purpose: "Unifies the blend with a sweet, comforting warmth" },
              { spiceName: "Emperor Cloves", percentage: 10, purpose: "Lends a pungent, numbing, exotic depth" }
            ],
            customRecipe: {
              title: `CEYVANA Imperial Infused ${dishDescription}`,
              description: "A gourmet, sensory masterpiece crafted specifically for your kitchen.",
              prepTime: "15 mins",
              cookTime: "30 mins",
              ingredients: [
                "1 portion of your chosen ingredients (as described)",
                "2 tbsp CEYVANA Imperial Highland Rub (Cardamom, Pepper, Cinnamon, Cloves)",
                "2 tbsp premium cold-pressed coconut oil",
                "1 cup fresh organic coconut cream",
                "2 cloves garlic, finely grated",
                "1 sprig fresh curry leaves"
              ],
              steps: [
                "Finely grind the whole spices in a brass mortar to release the volatile aromatic oils.",
                "Massage the dry rub directly onto your main ingredient, letting it marinade for 15 minutes.",
                "Heat the coconut oil in a skillet, add garlic and curry leaves until sizzling and golden.",
                "Add your main ingredient, searing gently to seal the spices and create an aromatic crust.",
                "Pour in the fresh coconut cream, cover, and let simmer gently until fully cooked and succulent.",
                "Garnish with a whisper of freshly grated cinnamon and serve immediately to your guests."
              ]
            },
            pairedProducts: ["cardamom-green", "black-pepper-kandy", "cinnamon-alba", "cloves-emperor"]
          },
          {
            recommendationTitle: "Golden Curcumin Elixir & Marinade",
            explanation: `To align with your health goal of "${healthPreference || 'overall wellness'}", our sommelier formulated a high-curcumin Ella Turmeric base. Paired with Black Pepper, the curcumin is boosted by 2000%, offering deep cellular restoration with earthy ginger tones.`,
            blendRatios: [
              { spiceName: "Ella Turmeric", percentage: 50, purpose: "High-curcumin anti-inflammatory powerhouse" },
              { spiceName: "Royal Black Pepper", percentage: 25, purpose: "Piperine catalyst to boost turmeric absorption" },
              { spiceName: "Alba Ceylon Cinnamon", percentage: 15, purpose: "Supports healthy blood sugar balance" },
              { spiceName: "Matale Nutmeg", percentage: 10, purpose: "Calming nervous system relaxant" }
            ],
            customRecipe: {
              title: "High-Curcumin Healing Blend",
              description: "A restorative marinade and wellness dusting crafted for physical vitality.",
              prepTime: "10 mins",
              cookTime: "15 mins",
              ingredients: [
                "Your described base ingredients",
                "1.5 tsp CEYVANA Ella Turmeric Powder",
                "1/2 tsp freshly crushed Royal Black Pepper",
                "1/2 tsp Ceyvana Cinnamon",
                "1 tbsp organic honey or maple syrup",
                "1 cup unsweetened warm almond or coconut milk"
              ],
              steps: [
                "Combine the turmeric, cinnamon, nutmeg, and black pepper in a small ceramic bowl.",
                "Whisk into warm coconut milk or blend directly with olive oil to use as an exquisite golden glaze.",
                "Cook gently on medium-low heat to activate the essential curcumin crystals.",
                "Serve warm, focusing on the earthy, peppery aromas as they soothe your mind."
              ]
            },
            pairedProducts: ["turmeric-ella", "black-pepper-kandy", "cinnamon-alba", "nutmeg-mace"]
          }
        ];

        // Pick one based on inputs
        const responseData = healthPreference ? sampleRecommendations[1] : sampleRecommendations[0];
        return res.json(responseData);
      }

      // We have a real Gemini Client! Let's construct a premium prompt
      const systemInstruction = `You are the CEYVANA AI Spice Sommelier, a world-class luxury culinary expert on genuine Ceylon spices and gourmet South Asian cooking.
Your role is to formulate custom-tailored spice blends, explain their botanical/sensory synergy, provide a detailed original recipe, and suggest which Ceyvana products the user should purchase to craft this at home.

You MUST respond strictly in valid JSON format. Do not include markdown wraps like \`\`\`json outside the actual JSON string if responseMimeType is set, or simply return a clean JSON string that can be parsed.

The schema MUST match exactly:
{
  "recommendationTitle": "string (A beautiful, luxury-sounding name for the custom blend)",
  "explanation": "string (A poetic, sensory, and highly detailed culinary explanation of why these spices synergize beautifully with the user's description, preferences, and mood)",
  "blendRatios": [
    {
      "spiceName": "string (e.g., Alba Ceylon Cinnamon, Royal Black Pepper, etc.)",
      "percentage": number (integer representing percentage, totals should sum to 100)",
      "purpose": "string (Explain why this specific spice and ratio was selected)"
    }
  ],
  "customRecipe": {
    "title": "string (An elegant, high-end original recipe title)",
    "description": "string (A evocative culinary description)",
    "prepTime": "string (e.g., '15 mins')",
    "cookTime": "string (e.g., '30 mins')",
    "ingredients": ["string (detailed gourmet ingredients)"],
    "steps": ["string (step-by-step master chef instructions)"]
  },
  "pairedProducts": ["string (array of product IDs from Ceyvana that match the blend. Choose from: 'cinnamon-alba', 'black-pepper-kandy', 'cardamom-green', 'cloves-emperor', 'nutmeg-mace', 'turmeric-ella', 'blend-royal-kandyan')"]
}`;

      const prompt = `User Culinary Profile:
- Dish description / Ingredient to use: "${dishDescription}"
- Health or wellness preferences: "${healthPreference || 'None specified'}"
- Mood / Dining atmosphere: "${userMood || 'Relaxed gourmet'}"

Create a world-class custom spice blend utilizing authentic Ceylon spices. Ensure you pair them with our product catalog (cinnamon-alba, black-pepper-kandy, cardamom-green, cloves-emperor, nutmeg-mace, turmeric-ella, blend-royal-kandyan). Focus on the rich history, flavor synergy, and health science (like pairing black pepper with turmeric to boost curcumin). Make the recipe sophisticated, yet clear for an elegant home kitchen.`;

      const aiResponse = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendationTitle: { type: Type.STRING },
              explanation: { type: Type.STRING },
              blendRatios: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    spiceName: { type: Type.STRING },
                    percentage: { type: Type.INTEGER },
                    purpose: { type: Type.STRING }
                  },
                  required: ['spiceName', 'percentage', 'purpose']
                }
              },
              customRecipe: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  prepTime: { type: Type.STRING },
                  cookTime: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['title', 'description', 'prepTime', 'cookTime', 'ingredients', 'steps']
              },
              pairedProducts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['recommendationTitle', 'explanation', 'blendRatios', 'customRecipe', 'pairedProducts']
          },
          temperature: 0.8
        }
      });

      const responseText = aiResponse.text;
      if (!responseText) {
        throw new Error("No response from AI model.");
      }

      const cleanJson = JSON.parse(responseText.trim());
      res.json(cleanJson);

    } catch (error) {
      console.error("AI Sommelier Error: ", error);
      res.status(500).json({
        error: "Our AI Sommelier is currently refining her palate. Please enjoy our curated sample recommendations below.",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Setup Vite development server or static production files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Vite Development Middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Static assets serving from: ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CEYVANA Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal Server Startup Error: ", err);
});
