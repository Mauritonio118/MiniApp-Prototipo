"use client";
import { useContext } from "react";
import GameContext from "../../context/GameContext";

export function PointsDisplay() {
    const { pointsTotal } = useContext(GameContext);
  
    return (
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
        <h2 className="text-2xl font-semibold mb-2">Ponist!!!</h2>
        <p className="text-4xl font-mono">{pointsTotal.toFixed(2)}</p>
      </div>
    );
  }