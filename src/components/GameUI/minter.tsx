"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MiniKit } from '@worldcoin/minikit-js'



export function Minter() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleMint = async () => {
    if (!session?.user) return;
    try {
      setIsLoading(true);
  
      // Obtener los datos firmados del backend
      const response = await fetch('/api/get-mintable', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ World_ID: session.user.name }),
      });
      const responseData = await response.json();
      console.log("Tipo de variable:", typeof responseData);
      console.log("Contenido de la variable:", responseData.abi);
  
//      // Interactuar con el contrato
      const tx = await MiniKit.commandsAsync.sendTransaction({
          transaction: [
            {
              address: responseData.address,
              abi: responseData.abi,
              functionName: responseData.functionName,
              args: responseData.args,
            },
          ],
      });
  
      console.log("Transacción enviada:", tx);
    } catch (error) {
      console.error("Error en el proceso de minting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    return <button onClick={handleMint} >Mint</button>;
  }

