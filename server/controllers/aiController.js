const OpenAI = require("openai");

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.generateEventDescription = async (req, res) => {
    const { title, location, keywords } = req.body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
        return res.json({ description: `[MOCK AI] generated description for ${title} at ${location}. (Set valid OPENAI_API_KEY to see real magic)` });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a professional event planner. Write a compelling, high-quality event description under 120 words."
                },
                {
                    role: "user",
                    content: `Write an event description for "${title}" in "${location}". Keywords: ${keywords}. Tone: Exciting and professional.`
                }
            ],
            max_tokens: 200,
        });

        res.json({ description: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Description Error:", error.message);
        res.status(500).json({ description: "Failed to generate description. Please try again." });
    }
};

exports.generateImage = async (title, location) => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
        console.log("[EventFlow] Missing/Invalid OpenAI Key - returning null");
        return null;
    }

    try {
        const prompt = `A visually stunning, high-quality cover image for an event titled "${title}" located in "${location}". Focus on atmosphere. 4k, photorealistic.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
            quality: "standard",
        });

        const b64 = response.data[0].b64_json;
        return `data:image/png;base64,${b64}`;
    } catch (error) {
        console.error("OpenAI Image Error:", error.message);
        return null;
    }
};

exports.generateAvatar = async (name) => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) return null;

    try {
        const prompt = `A professional, modern, artistic profile avatar for user "${name}". Square portrait, vibrant colors, 4k.`;

        // DALL-E 3 requires 1024x1024 minimum
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        const b64 = response.data[0].b64_json;
        return `data:image/png;base64,${b64}`;
    } catch (error) {
        console.error("OpenAI Avatar Error:", error.message);
        return null;
    }
};

exports.chatWithAI = async (req, res) => {
    const { message, history } = req.body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("YOUR_OPENAI_API_KEY")) {
        return res.json({ response: "I am a mock AI assistant. I can help you navigate the app! (Set valid OPENAI_API_KEY for real answers)" });
    }

    try {
        // Construct messages array from history + current message
        // Frontend now sends history as [{ role, content }]
        const messages = [
            { role: "system", content: "You are a helpful and professional AI assistant for the EventFlow application. Keep responses concise and relevant to event management." },
            ...(history || []),
            { role: "user", content: message }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            max_tokens: 300,
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error("OpenAI Chat Error:", error.message);
        res.json({ response: `I'm having trouble connecting to OpenAI (Error: ${error.message}). Please check your usage limits.` });
    }
};
