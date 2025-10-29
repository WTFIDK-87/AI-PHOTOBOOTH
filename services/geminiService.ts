import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface TransformResult {
  imageUrl: string | null;
  narrative: string | null;
}

export const transformImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<TransformResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    const result: TransformResult = { imageUrl: null, narrative: null };

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const imageMimeType = part.inlineData.mimeType;
          result.imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
          result.narrative = part.text;
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error transforming image:", error);
    throw new Error("Failed to transform image with Gemini API.");
  }
};


export const replaceBackground = async (
  foregroundBase64: string,
  foregroundMimeType: string,
  backgroundBase64: string,
  backgroundMimeType: string
): Promise<TransformResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: foregroundBase64,
              mimeType: foregroundMimeType,
            },
          },
          {
            inlineData: {
              data: backgroundBase64,
              mimeType: backgroundMimeType,
            },
          },
          {
            text: 'From the first image, accurately segment the person or people and remove the background. Place the segmented people onto the second image, which will serve as the new background. Ensure the final composite image looks realistic and seamless.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const result: TransformResult = { imageUrl: null, narrative: null };

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const imageMimeType = part.inlineData.mimeType;
          result.imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error replacing background:", error);
    throw new Error("Failed to replace background with Gemini API.");
  }
};
