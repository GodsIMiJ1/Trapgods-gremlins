
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const EndPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const won = location.state?.won;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-pixel mb-8 text-center">
        {won ? (
          <span className="text-neon-green animate-glitch">TRAP LORD CROWNED</span>
        ) : (
          <span className="text-neon-pink animate-glitch">GREMLIN CRASHED</span>
        )}
      </h1>
      
      <div className="mb-12 font-glitch text-xl">
        {won ? (
          <div className="text-cyber-blue">
            <p>System infiltration complete.</p>
            <p>Gremlin protocols established.</p>
          </div>
        ) : (
          <div className="text-neon-pink">
            <p>Core dumped. Stack overflow.</p>
            <p>Fatal exception: 0xDEADC0DE</p>
          </div>
        )}
      </div>
      
      <Button
        onClick={() => navigate('/')}
        className="font-pixel"
        variant={won ? "default" : "destructive"}
      >
        REBOOT_SYSTEM.exe
      </Button>
    </div>
  );
};

export default EndPage;
