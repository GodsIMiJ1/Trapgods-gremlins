
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
    name: `Gremlin-${Math.floor(Math.random() * 1000)}`,
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
    <div className="text-center">
      <Button 
        onClick={handleGenerate}
        className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4"
      >
        Generate Gremlin
      </Button>
    </div>
  );
};

export default GremlinGenerator;
