
import { GoogleGenAI, Type } from '@google/genai';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // In a real app, you'd handle this more gracefully.
    // For this example, we'll throw an error if the key is missing.
    throw new Error('API_KEY is not defined in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: 'The main title of the article.',
        },
        summary: {
            type: Type.STRING,
            description: 'A concise, neutral summary of the article, no more than 3-4 sentences.',
        },
        tags: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: 'An array of 3 to 5 relevant tags (keywords) for this article.',
        },
    },
    required: ["title", "summary", "tags"],
};

export const fetchLinkMetadata = async (url: string): Promise<{ title: string; summary: string; tags: string[] }> => {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        You are an expert content analyst. A user has provided the following URL: "${url}".

        Your tasks are:
        1.  Access the content of the article at this URL. If you cannot access it, indicate that in the title and summary.
        2.  Generate a concise, neutral summary of the article, no more than 3-4 sentences.
        3.  Generate an array of 3 to 5 relevant lowercase tags (keywords) for this article.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text;
        const parsedData = JSON.parse(jsonString);

        if (
            !parsedData.title ||
            !parsedData.summary ||
            !Array.isArray(parsedData.tags)
        ) {
            throw new Error('Invalid data structure from API');
        }

        return parsedData;

    } catch (error) {
        console.error('Error fetching link metadata:', error);
        throw new Error('Failed to process the link with Gemini API.');
    }
};
