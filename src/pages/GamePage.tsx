
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import GremlinGenerator from '../components/GremlinGenerator';
import TrapStreetsGame from '../components/TrapStreetsGame';
import GremlinGauntletGame from '../components/GremlinGauntletGame';
import TrapBossBattle from '../components/TrapBossBattle';

type GameStage = 'start' | 'generateGremlin' | 'trapStreets' | 'gremlinGauntlet' | 'trapBossBattle' | 'gameOver';

const GamePage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<GameStage>('generateGremlin');
  const [gremlin, setGremlin] = useState<any>(null);

  const handleGremlinGenerated = (newGremlin: any) => {
    setGremlin(newGremlin);
    setStage('trapStreets');
  };

  const handleStageComplete = (won: boolean) => {
    if (!won) {
      navigate('/end', { state: { won: false } });
      return;
    }

    // Progress to next stage based on current stage
    switch (stage) {
      case 'trapStreets':
        setStage('gremlinGauntlet');
        break;
      case 'gremlinGauntlet':
        setStage('trapBossBattle');
        break;
      case 'trapBossBattle':
        navigate('/end', { state: { won: true } });
        break;
      default:
        break;
    }
  };

  const renderCurrentStage = () => {
    switch (stage) {
      case 'generateGremlin':
        return <GremlinGenerator onGenerate={handleGremlinGenerated} />;
      case 'trapStreets':
        return <TrapStreetsGame onComplete={handleStageComplete} />;
      case 'gremlinGauntlet':
        return (
          <GremlinGauntletGame 
            onComplete={(won) => handleStageComplete(won)}
          />
        );
      case 'trapBossBattle':
        return (
          <TrapBossBattle 
            onFinishGame={() => handleStageComplete(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {gremlin && (
          <div className="mb-8 p-4 glass-card rounded-lg">
            <h2 className="text-neon-purple font-pixel mb-4">// GREMLIN_PROFILE.dat</h2>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-glitch text-neon-green">NAME: <span className="text-cyber-blue">{gremlin.name}</span></p>
              <p className="font-glitch text-neon-green">CLASS: <span className="text-neon-pink">{gremlin.class}</span></p>
              <p className="font-glitch text-neon-green">WIT: <span className="text-cyber-blue">{gremlin.wit}</span></p>
              <p className="font-glitch text-neon-green">TRAP_ENERGY: <span className="text-cyber-blue">{gremlin.trapEnergy}</span></p>
              <p className="font-glitch text-neon-green">LUCK: <span className="text-cyber-blue">{gremlin.luck}</span></p>
            </div>
          </div>
        )}
        <div className="mb-8">
          {renderCurrentStage()}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
