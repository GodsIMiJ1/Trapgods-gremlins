
import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: This is only for demo purposes
    });
  }

  async generateRoast(): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly rap battle opponent. Generate a playful, family-friendly roast or diss that's creative and funny without being mean-spirited. Keep it short (max 2 lines) and witty."
          },
          {
            role: "user",
            content: "Generate a playful roast for a rap battle."
          }
        ],
        temperature: 0.8,
        max_tokens: 60
      });

      return response.choices[0]?.message?.content || "Your flow's so weak, it makes elevator music sound lit!";
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "Your flow's so weak, it makes elevator music sound lit!";
    }
  }

  async evaluateResponse(playerResponse: string): Promise<'good' | 'mid' | 'weak'> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are judging rap battle responses. Rate the given response as either 'good', 'mid', or 'weak' based on creativity and wit. Respond with ONLY one of these three words."
          },
          {
            role: "user",
            content: `Rate this rap battle response: "${playerResponse}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      });

      const rating = response.choices[0]?.message?.content?.toLowerCase().trim() as 'good' | 'mid' | 'weak';
      return ['good', 'mid', 'weak'].includes(rating) ? rating : 'mid';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return 'mid';
    }
  }
}
