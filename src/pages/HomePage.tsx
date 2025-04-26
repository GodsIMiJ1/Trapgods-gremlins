
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-pixel text-neon-purple mb-12 text-center animate-pulse-slow">
        TrapGods Gremlins
      </h1>
      <Button
        onClick={() => navigate('/game')}
        className="bg-neon-green hover:bg-neon-green/80 text-background font-pixel px-8 py-4 text-lg"
      >
        Start Game
      </Button>
    </div>
  );
};

export default HomePage;
