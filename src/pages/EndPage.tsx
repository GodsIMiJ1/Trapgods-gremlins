
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EndPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const won = location.state?.won;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-pixel mb-12 text-center">
        {won ? (
          <span className="text-neon-green animate-pulse">Trap Lord Crowned!</span>
        ) : (
          <span className="text-red-500 animate-pulse">Gremlin Crashed!</span>
        )}
      </h1>
      <Button
        onClick={() => navigate('/')}
        className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4"
      >
        Play Again
      </Button>
    </div>
  );
};

export default EndPage;
