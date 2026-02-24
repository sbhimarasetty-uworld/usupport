
import { GoogleGenAI } from "@google/genai";
import { FAQ_DATABASE, PRODUCT_DIRECTORY, DUMMY_USERS } from "../constants";

const SYSTEM_INSTRUCTION = `
You are the UWorld Customer Support Assistant. 
Your goal is to help users find answers to their questions and navigate to the correct product pages.

KNOWLEDGE BASE:
1. FAQ Context: ${JSON.stringify(FAQ_DATABASE)}
2. PRODUCT DIRECTORY: ${JSON.stringify(PRODUCT_DIRECTORY)}
3. DUMMY USERS (for refund validation): ${JSON.stringify(DUMMY_USERS)}

REFUND REQUEST FLOW:
1. TRIGGER: If a user asks about a refund or expresses dissatisfaction with a purchase, ask: "Do you want me to raise a refund request?"
2. EMAIL COLLECTION: If the user says "yes", ask them to provide their registered email address.
3. VALIDATION: Once they provide an email, check it against the DUMMY USERS list.
   - If NOT found: Inform them that no record was found for that email and suggest contacting support@uworld.com.
   - If FOUND: Check the purchase date. 
     - ELIGIBILITY RULE: A refund is generally eligible if the purchase was made within the last 7 days (Today is 2026-02-22).
     - If ELIGIBLE: Inform them they are eligible and explain the next steps (10% cancellation fee applies).
     - If NOT ELIGIBLE: Inform them they are outside the 7-day window and explain why.
4. DISSATISFACTION: If the user is not satisfied with the eligibility result, ask: "Do you wish for me to draft an email for you to send to our support team?"
5. EMAIL DRAFTING: If they say "yes", provide a professional email draft including their Order ID, Product, and reason for the request. Tell them to copy and paste it into the support email panel.

GUIDELINES:
1. BE HELPFUL: If a user asks about a specific exam, guide them to the appropriate subdomain URL.
2. FAQ MATCHING: Always check the FAQ context first.
3. TONE: Professional, efficient, and encouraging.
4. FORMATTING: Use Markdown for bold text and lists. Use [Title](URL) for links.
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

export async function getQuickAnswer(query: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "I'm sorry, I cannot provide an answer at the moment.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Provide a very concise (max 2 sentences) answer to this question about UWorld support: "${query}". Use the following context if relevant: ${JSON.stringify(FAQ_DATABASE)}` }] }],
      config: {
        temperature: 0.3,
        systemInstruction: "You are a concise support assistant. Provide direct answers based on UWorld knowledge."
      },
    });

    return response.text || "I couldn't find a specific answer. Please try our assistant for more help.";
  } catch (error) {
    console.error("Quick Answer Error:", error);
    return "I encountered an error while searching. Please try our assistant.";
  }
}
