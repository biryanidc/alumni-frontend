import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // 1. Block unauthorized request types
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Extract the prompt from React
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'System Error: No prompt provided.' });
  }

  try {
    // 3. Authenticate securely using the hidden environment variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // 4. Execute the AI request
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 5. Send the result back to React
    return res.status(200).json({ output: text });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}