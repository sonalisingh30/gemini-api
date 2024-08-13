import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Store your API key securely, e.g., using environment variables.
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
¸
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});


const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    try {
        // Start a chat session with an empty history array
        const chatSession = model.startChat({
            generationConfig,
            history: [], // History must be an array
        });

        // Send the message with the correct format
        const result = await model.generateContent(prompt);

        const text = result.response.text();

        return text;
    } catch (error) {
        console.error("Error in run function:", error);
    }
}

export default run;
