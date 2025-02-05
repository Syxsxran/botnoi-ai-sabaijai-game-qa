const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config(); // โหลดค่า ENV

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let gameState = {
    object: null,
    questions: [],
};

app.get("/api/question", async (req, res) => {
    if (!gameState.object) {
        gameState.object = "unknown";
        gameState.questions = ["มันเป็นสิ่งมีชีวิตหรือไม่?"];
    }
    res.json({ question: gameState.questions[gameState.questions.length - 1] });
});

app.post("/api/answer", async (req, res) => {
    const userAnswer = req.body.answer;
    gameState.questions.push(`ผู้เล่น: ${userAnswer}`);

    const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "คุณเป็น AI ที่พยายามเดาสิ่งของในใจของผู้เล่น ถามคำถาม Yes/No เพื่อลดขอบเขต" },
            { role: "user", content: gameState.questions.join("\n") },
        ],
    });

    const nextQuestion = aiResponse.choices[0].message.content;
    gameState.questions.push(`AI: ${nextQuestion}`);

    res.json({ question: nextQuestion });
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
