"use client";
import { createContext, useState, useEffect } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [pointsTotal, setPointsTotal] = useState(0.0);
  const [pointsForSecond, setPointsForSecond] = useState(0.0);
  const [clicksForMint, setClicksForMint] = useState(0);


  // Bucle infinito para actualizar automáticamente los puntos cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setPointsTotal((prevPoints) => prevPoints + pointsForSecond);
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [pointsForSecond]); // Se ejecuta cuando cambia `pointsForSecond`

  return (
    <GameContext.Provider value={{
        pointsTotal,
        setPointsTotal,
        pointsForSecond,
        setPointsForSecond,
        clicksForMint,
        setClicksForMint,
      }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
