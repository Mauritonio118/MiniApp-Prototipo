"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { MiniKit } from '@worldcoin/minikit-js'
import { Transaction } from "ethers";

export function Minter() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleMint = async () => {
    if (!session?.user) return;
    try {
      setIsLoading(true);
  
      // Obtener los datos firmados del backend
      const response = await fetch(`/api/get-mintable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ World_ID: session.user.name }),
      });
      const { mintable, timestamp } = await response.json();
  
      // Interactuar con el contrato
      const tx = await MiniKit.commandsAsync.sendTransaction({
          address: string;
          abi: Abi ;
          functionName: ContractFunctionName;
          args: ContractFunctionArgs;

      });
  
      console.log("Transacción enviada:", tx);
    } catch (error) {
      console.error("Error en el proceso de minting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    return <button>Mint</button>;
  }