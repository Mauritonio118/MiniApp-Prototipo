"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MiniKit, SendTransactionInput } from '@worldcoin/minikit-js'

export function Burner() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleBurn = async () => {
    if (!session?.user) return;
    try {
      setIsLoading(true);
  
      // Obtener los datos de minteo del backend
      console.log("PRE SOLICITUD")
      const response = await fetch('/api/get-burn', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ World_ID: session.user.name }),
      });
      console.log("POST SOLICITUD")

      const responseData = await response.json();

      const transac: SendTransactionInput = {
        transaction: [
          {
            address: responseData.address,
            abi: responseData.abi,
            functionName: responseData.functionName,
            args: [responseData.args] ,
          },
        ],
      }
  
    // Interactuar con el contrato
    console.log("PRE TRANSACCION")
    const { finalPayload} = await MiniKit.commandsAsync.sendTransaction(transac);

    if(finalPayload.status === "success"){
      console.log("success")
      // fetch('/api/post-minteable', {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ 
      //     World_ID: session.user.name,
      //     amountMintedOnChain: responseData.args
      //   }),
      // });
    }
    
    } catch (error) {
      console.error("Error en el proceso de burning:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    return <button onClick={handleBurn} >Spent</button>;
  }
