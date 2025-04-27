
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface PlayerResponseProps {
  response: string;
  onResponseChange: (value: string) => void;
  onSubmit: () => void;
}

const PlayerResponse: React.FC<PlayerResponseProps> = ({ 
  response, 
  onResponseChange, 
  onSubmit 
}) => {
  return (
    <div className="space-y-2">
      <Textarea
        value={response}
        onChange={(e) => onResponseChange(e.target.value)}
        placeholder="Type your response..."
        className="w-full bg-background/50 border-neon-purple/30"
      />
      <button
        onClick={onSubmit}
        disabled={!response.trim()}
        className="w-full bg-neon-purple hover:bg-neon-purple/80 disabled:opacity-50 
                 disabled:cursor-not-allowed text-white font-pixel px-8 py-4 rounded-lg transition-colors"
      >
        Drop That Beat
      </button>
    </div>
  );
};

export default PlayerResponse;
