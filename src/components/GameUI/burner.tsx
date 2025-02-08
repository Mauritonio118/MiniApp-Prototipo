"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { MiniKit, SendTransactionInput } from '@worldcoin/minikit-js'
import GameContext from "../../context/GameContext";



export function Burner() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const { setClicksForMint, setPointsForSecond, pointsForSecond, clicksForMint } = useContext(GameContext);

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
    const {commandPayload, finalPayload} = await MiniKit.commandsAsync.sendTransaction(transac);
    console.log("FINALPAYLOAD", finalPayload)
    console.log("COMMANDPAYLOAD", commandPayload)

    if(finalPayload.status === "success"){
      const totalMinted = Number(responseData.args)/10**18;

      setClicksForMint((prevClicks) => {
        const newClicks = prevClicks - totalMinted;
        console.log("Actualizando clicksForMint:", newClicks);
        return newClicks;
      });
    
      setPointsForSecond((prevPoints) => {
        const newPoints = prevPoints + totalMinted;
        console.log("Actualizando pointsForSecond:", newPoints);
        return newPoints;
      });
    }
    
    } catch (error) {
      console.error("Error en el proceso de burning:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    return <button onClick={handleBurn} >Spent</button>;
  }
