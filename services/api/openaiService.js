import OpenAI from "openai";
import { OPENAI_API_KEY } from '@env';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: "https://api.upstage.ai/v1/solar",
    dangerouslyAllowBrowser: true,
});

/**
 * Generate a summary of the provided text using OpenAI
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} - Generated summary
 */
export const generateSummary = async (text) => {
    try {
        console.log("Summarizing text...");

        const completion = await openai.chat.completions.create({
            model: "solar-mini",
            messages: [
                {
                    role: "user",
                    content: 'Provide summary of this in a detail way, so that I can use it to study deeply for my exams. Just provide the content "' + text + '"',
                },
            ],
        });
        console.log(completion.choices[0].message.content);
        if (completion.choices[0].message.content) {
            return completion.choices[0].message.content;
        }
        return '';
    } catch (error) {
        console.error('Error summarizing text:', error);
        throw error;
    }
}; 