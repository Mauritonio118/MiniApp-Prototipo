"use client";
import { useContext, useEffect } from "react";
import GameContext from "../../context/GameContext";

export function ClickCounter() {
  const { clicksForMint, setClicksForMint } = useContext(GameContext);


  // Consulta inicial al backend
  useEffect(() => {
    const fetchInitialClickCount = async () => {
      try {
        const response = await fetch("/api/get-clicks", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          setClicksForMint(data.initialClickCount); // Setear el estado inicial con el valor desde la base de datos
        } else {
          console.error("Error al obtener el conteo inicial:", data.message);
        }
      } catch (error) {
        console.error("Error en la consulta inicial:", error);
      } finally {
      }
    };
    fetchInitialClickCount();
  }, []);

  return (
<div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-center">
      <h2 className="text-2xl font-semibold mb-2">Clicks para Mint</h2>
      <p className="text-4xl font-mono">{clicksForMint}</p>
    </div>
  );
}
