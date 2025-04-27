
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          {Array(10).fill(0).map((_, i) => (
            <div 
              key={i}
              className="absolute text-neon-green font-glitch text-4xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.2,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {Math.random() > 0.5 ? "01" : "10"}
            </div>
          ))}
        </div>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-pixel text-neon-green mb-4 glitch-text animate-pulse-slow">
        TrapGods
      </h1>
      <h2 className="text-3xl md:text-5xl font-glitch text-neon-pink mb-12">
        GREMLINS
      </h2>
      
      <Button
        onClick={() => navigate('/game')}
        className="bg-dark-surface border border-neon-green text-neon-green hover:shadow-neon-green font-pixel px-8 py-4 text-lg"
      >
        START_GAME.exe
      </Button>
      
      <p className="mt-8 text-cyber-blue font-glitch text-sm">
        // Enter at your own risk. Gremlins inside.
      </p>
    </div>
  );
};

export default HomePage;
