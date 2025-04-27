
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OpenAIKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-neon-purple mb-2">Enter OpenAI API Key</h3>
        <p className="text-sm text-neon-green/70 mb-4">
          This is a temporary solution. For security, consider connecting to Supabase to handle API keys safely.
        </p>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="mb-2"
        />
        <Button type="submit" disabled={!apiKey.trim()}>
          Start Battle
        </Button>
      </div>
    </form>
  );
};

export default OpenAIKeyInput;
