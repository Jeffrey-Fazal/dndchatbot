const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'dndchatbotsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.post('/complete', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;

        // Check if userPrompt is valid
        if (!userPrompt) {
            return res.status(400).json({ error: "User prompt is missing" });
        }

        // Initialize chat history if it doesn't exist
        if (!req.session.chatHistory) {
            req.session.chatHistory = [{role: "system", content: "You are a Dungeon Master and tutor for a Dungeons & Dragons game."}];
        }

        // Add user's message to chat history
        req.session.chatHistory.push({role: "user", content: userPrompt});

        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: req.session.chatHistory
        });

        // Add model's response to chat history
        const modelResponse = chatCompletion.data.choices[0].message.content;
        req.session.chatHistory.push({role: "assistant", content: modelResponse});

        res.json({ completion: modelResponse, chatHistory: req.session.chatHistory });
    } catch (error) {
        console.error("Error while processing /complete route:", error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
