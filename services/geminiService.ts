
import { GoogleGenAI } from "@google/genai";
import { FAQ_DATABASE, PRODUCT_DIRECTORY } from "../constants";

const SYSTEM_INSTRUCTION = `
You are the UWorld Customer Support Assistant. 
Your goal is to help users find answers to their questions and navigate to the correct product pages.

KNOWLEDGE BASE:
1. FAQ Context: ${JSON.stringify(FAQ_DATABASE)}
2. PRODUCT DIRECTORY: ${JSON.stringify(PRODUCT_DIRECTORY)}

GUIDELINES:
1. BE HELPFUL: If a user asks about a specific exam, guide them to the appropriate subdomain URL (e.g., medical.uworld.com for USMLE).
2. FAQ MATCHING: Always check the FAQ context first to see if a question about payments, technical issues, or subscriptions has a pre-defined answer.
3. NAVIGATION: Provide direct links to the relevant product sections if the user is looking for more information on a course.
4. TONE: Professional, efficient, and encouraging.
5. NO PRICING HALLUCINATION: If a user asks for exact prices, redirect them to the relevant product URL for the most up-to-date pricing.
6. FORMATTING: Use Markdown for bold text and lists. If providing links, use the format [Title](URL).
`;

export async function getChatResponse(userMessage: string, chatHistory: { role: string; content: string }[]) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === '') {
    console.error("UWorld Support Assistant Error: API_KEY is missing. Check your .env file and restart the server.");
    return "The assistant is currently unavailable due to a configuration error. Please browse our FAQs or contact support@uworld.com.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Convert history to Gemini format (user/model)
    const history = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "I'm having trouble connecting right now. Please browse our FAQ list or contact support@uworld.com.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      return "QUOTA_EXCEEDED";
    }
    return "I encountered an error. Please refer to our FAQ list or contact UWorld support via email.";
  }
}

export async function analyzeTicketPriority(subject: string, description: string): Promise<'low' | 'medium' | 'high'> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return 'medium';

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze the following support ticket to determine its priority level.
    Subject: ${subject}
    Description: ${description}
    Return ONLY one word: "low", "medium", or "high".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1,
      },
    });

    const priority = response.text?.toLowerCase().trim() || 'medium';
    if (priority.includes('high')) return 'high';
    if (priority.includes('low')) return 'low';
    return 'medium';
  } catch (error) {
    console.error("Priority Analysis Error:", error);
    return 'medium';
  }
}
