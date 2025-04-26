
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GremlinGenerator from '../components/GremlinGenerator';
import TrapStreetsGame from '../components/TrapStreetsGame';
import GremlinGauntletGame from '../components/GremlinGauntletGame';
import TrapBossBattle from '../components/TrapBossBattle';

const GamePage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [gremlin, setGremlin] = useState(null);

  const handleGremlinGenerated = (newGremlin: any) => {
    setGremlin(newGremlin);
    setStage(1);
  };

  const stages = [
    <GremlinGenerator onGenerate={handleGremlinGenerated} />,
    <TrapStreetsGame />,
    <GremlinGauntletGame />,
    <TrapBossBattle />
  ];

  const nextStage = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
    } else {
      navigate('/end', { state: { won: Math.random() > 0.5 } });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {gremlin && (
          <div className="mb-8 p-4 bg-background/50 backdrop-blur-lg rounded-lg border border-neon-purple/30">
            <h2 className="text-neon-purple font-pixel mb-4">Your Gremlin</h2>
            <div className="grid grid-cols-2 gap-4 text-neon-green">
              <p>Name: {gremlin.name}</p>
              <p>Class: {gremlin.class}</p>
              <p>Wit: {gremlin.wit}</p>
              <p>Trap Energy: {gremlin.trapEnergy}</p>
              <p>Luck: {gremlin.luck}</p>
            </div>
          </div>
        )}
        <div className="mb-8">
          {stages[stage]}
        </div>
        {stage > 0 && (
          <Button
            onClick={nextStage}
            className="bg-neon-purple hover:bg-neon-purple/80 text-white font-pixel px-8 py-4"
          >
            Next Stage
          </Button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
