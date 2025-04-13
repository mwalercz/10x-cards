const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateFlashcards(text: string) {
  const systemPrompt = `You are a helpful AI assistant that creates educational flashcards. 
Given the text, generate 5-10 flashcards with questions and answers that cover the main concepts.
Format your response as a JSON array of objects with 'question' and 'answer' properties.
Keep questions concise and answers detailed but not too long.`;

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.PUBLIC_OPENROUTER_API_KEY}`,
      'HTTP-Referer': import.meta.env.PUBLIC_WEBSITE_URL,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate flashcards');
  }

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    throw new Error('Failed to parse AI response');
  }
}