
// Updated to use backend API instead of direct OpenAI calls
export class OpenAIService {
  private apiUrl: string;

  constructor(apiKey?: string) {
    // We don't need the API key anymore since it's stored on the server
    // But we keep the parameter for backward compatibility
    this.apiUrl = 'http://localhost:3001/api'; // Update this to your production URL when deploying
  }

  async generateRoast(): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Roast the player with your savage Gremlin style. Make it hilarious and include one of your catchphrases."
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.roast || "Your flow's so weak, it makes elevator music sound lit! JUUWRRAYYY!";
    } catch (error) {
      console.error('API Error:', error);
      return "Your flow's so weak, it makes elevator music sound lit! Look at em doe!";
    }
  }

  async evaluateResponse(playerResponse: string): Promise<'good' | 'mid' | 'weak'> {
    try {
      const response = await fetch(`${this.apiUrl}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: playerResponse
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.rating as 'good' | 'mid' | 'weak';
    } catch (error) {
      console.error('API Error:', error);
      return 'mid';
    }
  }
}
