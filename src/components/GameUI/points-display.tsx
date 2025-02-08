"use client";
import { useContext } from "react";
import GameContext from "../../context/GameContext";

export function PointsDisplay() {
    const { pointsTotal } = useContext(GameContext);
  
    return (
      <div className="p-4 bg-gray-800 text-white text-center rounded-lg">
        <h2 className="text-xl font-bold">Puntos Totales</h2>
        <p className="text-3xl font-mono mt-2">{pointsTotal.toFixed(2)}</p>
      </div>
    );
  }