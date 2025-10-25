
import { GoogleGenAI, Type } from "@google/genai";
import { AiDecision } from '../types';

const MAX_CONTENT_PREVIEW = 2000; // Limit content preview to 2000 characters

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const readFileContentPreview = async (file: File): Promise<string> => {
  if (!file.type.startsWith('text/')) {
    return 'File content is not text and cannot be displayed.';
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text.slice(0, MAX_CONTENT_PREVIEW));
    };
    reader.onerror = (e) => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsText(file);
  });
};

export const analyzeFileWithAI = async (file: File, userInstruction: string): Promise<AiDecision> => {
  const contentPreview = await readFileContentPreview(file);

  const prompt = `
You are an intelligent file system cleaner. Based on the user's instruction, decide whether to KEEP or DELETE the following file.
Your response MUST be a JSON object with two keys: "decision" (which must be either "KEEP" or "DELETE") and "reason" (a short explanation for your decision).

User's Instruction: "${userInstruction}"

File Details:
- Name: "${file.name}"
- Type: "${file.type || 'unknown'}"
- Size: ${file.size} bytes
- Path: "${(file as any).webkitRelativePath || file.name}"

File Content Preview (first ${MAX_CONTENT_PREVIEW} characters):
---
${contentPreview}
---

Provide your decision in the specified JSON format.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: {
              type: Type.STRING,
              description: "Must be 'KEEP' or 'DELETE'.",
            },
            reason: {
              type: Type.STRING,
              description: "A short explanation for the decision.",
            },
          },
          required: ["decision", "reason"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedDecision = JSON.parse(jsonString);

    if (parsedDecision.decision !== 'KEEP' && parsedDecision.decision !== 'DELETE') {
        throw new Error("Invalid decision value from AI.");
    }

    return parsedDecision as AiDecision;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a valid decision from the AI.");
  }
};
