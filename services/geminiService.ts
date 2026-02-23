
import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary, Message, Country, SearchResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateItinerary = async (params: {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  style: string;
}): Promise<Itinerary> => {
  const prompt = `Hey! I'm Alex, and I'm building this travel site for my final school project. Can you help me fill in the data for a trip to ${params.destination}? 
  Dates: ${params.startDate} to ${params.endDate}. 
  Budget: around $${params.budget}. 
  Style of trip: ${params.style}.
  
  Please give me some cool daily plans and a flight idea (airline, flight number, times, and price). 
  Write the descriptions like a real traveler sharing advice with a friend. Use some emojis and keep it fun!
  
  CRITICAL: Never mention you are an AI, a computer, or a large language model. If anyone asks, you're just a travel expert I hired to help with my app's data. 
  
  Return the results as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          dailyPlans: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                title: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      location: {
                        type: Type.OBJECT,
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          suggestedFlight: {
            type: Type.OBJECT,
            properties: {
              airline: { type: Type.STRING },
              flightNumber: { type: Type.STRING },
              departureTime: { type: Type.STRING },
              arrivalTime: { type: Type.STRING },
              duration: { type: Type.STRING },
              price: { type: Type.NUMBER }
            },
            required: ["airline", "flightNumber", "departureTime", "arrivalTime", "duration", "price"]
          },
          totalEstimatedCost: { type: Type.NUMBER }
        }
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  return {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    startDate: params.startDate,
    endDate: params.endDate,
    budget: params.budget,
    style: params.style,
    createdAt: new Date().toISOString()
  };
};

export const searchTravelDeals = async (params: {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
}): Promise<SearchResults> => {
  const prompt = `Yo, can you check the internet for real flights and hotels for ${params.destination}? 
  Dates: ${params.startDate} to ${params.endDate}. 
  Budget: $${params.budget}. 
  Just give me a list of cool deals with prices. Write it like you're sending me a quick text with some links. 
  NEVER mention you are an AI. You're just a travel buddy doing some research for me!`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "My script couldn't find anything right now. Maybe check TripAdvisor?",
    sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as any[]
  };
};

export const getCountryDetails = async (countryName: string): Promise<Partial<Country>> => {
  const prompt = `Write a fun and easy guide for ${countryName}. 
  Include:
  1. A fun description of the country's vibe.
  2. The best time of year to visit.
  3. The currency used.
  4. 3 culture tips for visitors.
  5. 6 world-famous landmarks or must-visit spots (Return these as an array of names).
  
  Return as JSON. Be super enthusiastic! (And remember, no AI talk).`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          bestTimeToVisit: { type: Type.STRING },
          currency: { type: Type.STRING },
          cultureTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          attractions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const chatWithAssistant = async (history: Message[], userMessage: string): Promise<string> => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are Alex, a high school senior who loves traveling and coding. You built this app for your computer science class project. You are super friendly, use emojis, and know a lot about the world. NEVER say you are an AI or a bot. If someone asks how the app works, just say you wrote some cool scripts to find the best travel info.',
    },
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text || "Oops, my code glitched out. Try again?";
};
