import { useState, useEffect, useCallback } from 'react';

const MAX_ENERGY = 3;
const ENERGY_STORAGE_KEY = 'roastEnergy';
const LAST_PLAYED_DATE_KEY = 'lastPlayedDate';

export const useEnergySystem = () => {
  const [energy, setEnergy] = useState<number>(MAX_ENERGY);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize energy from localStorage or reset if it's a new day
  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(LAST_PLAYED_DATE_KEY);

    if (lastPlayed !== today) {
      // It's a new day, reset energy
      setEnergy(MAX_ENERGY);
      localStorage.setItem(LAST_PLAYED_DATE_KEY, today);
      localStorage.setItem(ENERGY_STORAGE_KEY, String(MAX_ENERGY));
    } else {
      // Same day, load saved energy
      const savedEnergy = localStorage.getItem(ENERGY_STORAGE_KEY);
      if (savedEnergy !== null) {
        setEnergy(parseInt(savedEnergy));
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Update energy and save to localStorage
  const updateEnergy = useCallback((newEnergy: number) => {
    setEnergy(newEnergy);
    localStorage.setItem(ENERGY_STORAGE_KEY, String(newEnergy));
  }, []);

  // Consume one energy point
  const consumeEnergy = useCallback(() => {
    if (energy > 0) {
      updateEnergy(energy - 1);
      return true;
    }
    return false;
  }, [energy, updateEnergy]);

  // Check if user has enough energy
  const hasEnergy = useCallback(() => {
    return energy > 0;
  }, [energy]);

  return {
    energy,
    maxEnergy: MAX_ENERGY,
    consumeEnergy,
    hasEnergy,
    isInitialized
  };
};
