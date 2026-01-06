const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini with API key from environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateEventDescription = async (req, res) => {
    const { title, location, keywords } = req.body;

    if (!process.env.GEMINI_API_KEY) {
        return res.json({ description: `[MOCK AI] generated description for ${title} at ${location}. (Set valid GEMINI_API_KEY for real AI)` });
    }

    try {
        const prompt = `You are a professional event planner. Write a compelling, high-quality event description under 120 words for an event titled "${title}" in "${location}". Keywords: ${keywords}. Tone: Exciting and professional.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // SDK usage: response.text is a property (getter) in the new SDK, or check if function. 
        // User snippet showed response.text. Adapting to that.
        const text = typeof response.text === 'function' ? response.text() : response.text;
        res.json({ description: text });
    } catch (error) {
        console.error("Gemini Description Error:", error.message);
        res.status(500).json({ description: "Failed to generate description. Please try again." });
    }
};

exports.generateImage = async (title, location) => {
    console.log("[EventFlow] Image generation temporarily unavailable with current Gemini setup. Returning null.");
    return null;
};

exports.generateAvatar = async (name) => {
    console.log("[EventFlow] Avatar generation temporarily unavailable with current Gemini setup. Returning null.");
    return null;
};

exports.chatWithAI = async (req, res) => {
    const { message, history } = req.body;
    console.log("chatWithAI called with message:", message);

    if (!process.env.GEMINI_API_KEY) {
        return res.json({ response: "I am a mock AI assistant. I can help you navigate the app! (Set valid GEMINI_API_KEY for real answers)" });
    }

    try {
        // Convert history to Gemini format if needed, but for single-turn or simple history:
        // Gemini supports 'user' and 'model' roles. 
        // We will construct a prompt or a chat session. For simplicity and statelessness similar to the OpenAI call:

        let contents = [];
        if (history && Array.isArray(history)) {
            contents = history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));
        }

        // Add current message
        contents.push({
            role: "user",
            parts: [{ text: message }]
        });

        const systemInstruction = "You are a helpful and professional AI assistant for the EventFlow application. Keep responses concise and relevant to event management.";

        // For gemini-1.5-pro and newer, system instructions are supported. 
        // Using generateContent with systemInstruction if supported, or prepending to prompt.
        // The simplified SDK usage:

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction
            }
        });

        // SDK usage: response.text is a property based on user snippet
        const text = typeof response.text === 'function' ? response.text() : response.text;
        console.log("Gemini response:", text);
        res.json({ response: text });
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        // Fallback or detailed error for debugging
        res.json({ response: `I'm having trouble connecting to Gemini (Error: ${error.message}).` });
    }
};
