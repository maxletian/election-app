import { GoogleGenAI } from "@google/genai";
import { Candidate } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCandidateBio = async (name: string, department: string): Promise<string> => {
  if (!apiKey) return "AI Bio generation unavailable (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional, inspiring, short (2 sentences max) election campaign bio for a candidate named ${name} running for ${department}.`,
    });
    return response.text || "Bio unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Bio generation failed.";
  }
};

export const analyzeElectionResults = async (candidates: Candidate[]): Promise<string> => {
  if (!apiKey) return "AI Analysis unavailable (Missing API Key).";

  const dataSummary = candidates.map(c => `${c.name} (${c.department}): ${c.votes} votes`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these election results briefly. Identify the leading candidates and any close races. Keep it under 100 words.\n\nData:\n${dataSummary}`,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Analysis failed.";
  }
};
