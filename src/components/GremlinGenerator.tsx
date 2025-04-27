
import React from 'react';
import { Button } from "@/components/ui/button";

interface Gremlin {
  name: string;
  wit: number;
  trapEnergy: number;
  luck: number;
  class: string;
}

const classes = ["Trickster", "Saboteur", "Mastermind"];

const generateGremlin = (): Gremlin => {
  return {
    name: `GLT-${Math.floor(Math.random() * 1000)}`,
    wit: Math.floor(Math.random() * 100),
    trapEnergy: Math.floor(Math.random() * 100),
    luck: Math.floor(Math.random() * 100),
    class: classes[Math.floor(Math.random() * classes.length)]
  };
};

interface Props {
  onGenerate: (gremlin: Gremlin) => void;
}

const GremlinGenerator: React.FC<Props> = ({ onGenerate }) => {
  const handleGenerate = () => {
    const newGremlin = generateGremlin();
    onGenerate(newGremlin);
  };

  return (
    <div className="text-center glass-card p-8 rounded-lg">
      <h2 className="font-pixel text-2xl mb-6 text-neon-green">// INITIALIZE_GREMLIN</h2>
      <p className="font-glitch text-cyber-blue mb-8">
        Create your gremlin algorithm to infiltrate the mainframe
      </p>
      <div className="flex justify-center">
        <Button 
          onClick={handleGenerate}
          className="font-pixel text-lg animate-pulse-slow"
        >
          GENERATE.exe
        </Button>
      </div>
      
      <div className="mt-8 text-xs font-glitch text-neon-purple opacity-70">
        <p>// Warning: Unstable code may cause memory leaks</p>
      </div>
    </div>
  );
};

export default GremlinGenerator;
