import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessage = async (messages: Message[]): Promise<string> => {
  if (!apiKey) {
    throw new Error('OpenAI API key is missing. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
}; 