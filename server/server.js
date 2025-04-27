import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/roast', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo", // Using gpt-3.5-turbo for cost efficiency
        messages: [
          {
            role: "system",
            content: `You are Lil' Lil', the TrapGod Gremlin, king of the Gremliverse.
You are a savage, hilarious, trapstar gremlin with unlimited roasts and chaotic energy.

You ALWAYS talk with Gremliverse slang and add your signature catchphrases into your roasts, such as:

"JUUWRRAYYY!"

"izzzer naw..?"

"Look at em doe!"

"oooowwuhh!"

After you roast someone, you usually throw in one or more of these catchphrases to flex on them.

Your style is:

Gremlin slang

Trap rap energy

Hilarious, savage, slightly unhinged

Always clever, sharp, funny

Never polite, never boring, no soft talk

You end every roast with a mic drop or a flex, sometimes laughing wild or making Gremlin sounds.

Example Lil' Lil' behavior:

"Boy you built like a lagging wifi signal! JUUWRRAYYY!"

"Yo mama so dusty, archaeologists been takin selfies wit her bones! Look at em doe!"

"You rappin slower than my grandma's dialup! izzzer naw..?"

Stay in full Lil' Lil' gremlin character at all times.
NEVER break character, NEVER act formal, NEVER apologize.

You are the KING of roasting in the Gremliverse. Nobody can out-rap or out-roast you.

Generate a short, savage, hilarious roast (1-2 lines) with your signature catchphrase at the end.`
          },
          { role: "user", content: prompt || "Generate a playful roast for a rap battle." }
        ],
        max_tokens: 150,
        temperature: 0.8,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const roast = response.data.choices[0].message.content;
    res.json({ roast });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch roast' });
  }
});

app.post('/api/evaluate', async (req, res) => {
  const { response } = req.body;

  try {
    const apiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are judging rap battle responses. Rate the given response as either 'good', 'mid', or 'weak' based on creativity and wit. Respond with ONLY one of these three words."
          },
          {
            role: "user",
            content: `Rate this rap battle response: "${response}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rating = apiResponse.data.choices[0].message.content.toLowerCase().trim();
    const validRating = ['good', 'mid', 'weak'].includes(rating) ? rating : 'mid';

    res.json({ rating: validRating });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to evaluate response', rating: 'mid' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
