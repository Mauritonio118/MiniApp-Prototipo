"use client";
import { useState, useEffect } from "react";
import { Clicker, } from "@/components/GameUI";

export function ClickStats() {
  const [clickCount, setClickCount] = useState<number | null>(null); // Estado de los clicks
  const [isLoading, setIsLoading] = useState(true);

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
          setClickCount(data.initialClickCount); // Setear el estado inicial con el valor desde la base de datos
        } else {
          console.error("Error al obtener el conteo inicial:", data.message);
        }
      } catch (error) {
        console.error("Error en la consulta inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialClickCount();
  }, []);

  // Función para actualizar el valor en el front cuando se hace click
  const updateClickCount = (newCount: number) => {
    setClickCount((prevCount) => (prevCount !== null ? prevCount + 1 : newCount));
  };

  return (
    <div>
      {isLoading ? (
        <p>Cargando clicks...</p>
      ) : (
        <div>
          <h3>Total de clicks: {clickCount !== null ? clickCount : 0}</h3>
          <Clicker onClickUpdate={updateClickCount} />
        </div>
      )}
    </div>
  );
}
