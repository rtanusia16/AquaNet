
import { GoogleGenAI } from "@google/genai";

// Fix: Creating instances inside functions to ensure the latest API key is used
// Fix: Using process.env.API_KEY directly as required by guidelines

export async function getWaterAdvice(history: string) {
  // Fix: Instantiating GoogleGenAI within the scope of the request
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are AQUANET AI, a smart water conservation assistant.
      Based on this user's recent water usage activity: "${history}", 
      provide 1 short, actionable tip to save water today. Keep it friendly and encouraging.`,
      config: {
        maxOutputTokens: 150,
        temperature: 0.8,
      }
    });

    // Fix: Accessing .text property directly (not calling as a function)
    return response.text || "Keep up the great work saving water!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your water usage looks stable today. Remember: every drop counts!";
  }
}

export async function askAiAssistant(query: string, currentUsage: number) {
  // Fix: Instantiating GoogleGenAI within the scope of the request
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User asks: "${query}". Their current daily usage is ${currentUsage} Liters. 
      Answer their question about water usage or saving tips concisely.`,
      config: {
        maxOutputTokens: 300,
        tools: [{ googleSearch: {} }]
      }
    });

    // Fix: Extracting URLs from groundingChunks and appending them to the response
    let outputText = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks && groundingChunks.length > 0) {
      const sources = groundingChunks
        .filter(chunk => chunk.web?.uri)
        .map(chunk => `\n- ${chunk.web?.title || 'Source'}: ${chunk.web?.uri}`);
      
      if (sources.length > 0) {
        outputText += "\n\nSources used:" + sources.join("");
      }
    }

    return outputText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my central brain. Try checking your sensors directly!";
  }
}

// Fix: Adding missing generateContentAdvice function required by Editor component
export async function generateContentAdvice(title: string, content: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve the following app listing for engagement and clarity:
      Title: ${title}
      Description: ${content}
      
      Suggest a professional tone and identify 3 key improvement points.`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.7,
      }
    });
    // Fix: Accessing .text property directly
    return response.text || "No suggestions available at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI advice. Please check your project details and try again.";
  }
}
