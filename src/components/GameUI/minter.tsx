"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult, SendTransactionInput } from '@worldcoin/minikit-js'




export function Minter() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleMint = async () => {
    if (!session?.user) return;
    try {
      setIsLoading(true);
  

      // Obtener los datos de minteo del backend
      const response = await fetch('/api/get-mintable', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ World_ID: session.user.name }),
      });
      const responseData = await response.json();
      console.log("Tipo de variable:", typeof responseData.args);
      console.log("Contenido de la variable:", responseData.args);

      

      //Verificar humanidad para Mintear
      const verifyPayload: VerifyCommandInput = {
        action: 'mintburn', // This is your action ID from the Developer Portal
        verification_level: VerificationLevel.Orb, // Orb | Device
      }


      if (!MiniKit.isInstalled()) {
        return
      }
      // World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
      const {finalPayload} = await MiniKit.commandsAsync.verify(verifyPayload)
        if (finalPayload.status === 'error') {
          return console.log('Error payload', finalPayload)
        }
    
        // Verify the proof in the backend
        const verifyResponse = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
          action: 'mintburn',
        }),
      })
    
      // TODO: Handle Success!
      const verifyResponseJson = await verifyResponse.json()
      if (verifyResponseJson.status === 200) {
        console.log('Verification success!')
      }
      
      console.log("FINALPAYLOAD:")
      console.log(finalPayload.proof)



      const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString()
      const permitTransfer = {
        permitted: {
          token: "0xEa2B921AB2CD02667615d539Bc7fFE1F59394F99",
          amount: '10000',
        },
        nonce: Date.now().toString(),
        deadline,
      }
      const transa: SendTransactionInput = {
        transaction: [
          {
            address: responseData.address,
            abi: responseData.abi,
            functionName: responseData.functionName,
            args: [responseData.args],
          },
        ],
        

        // Transfers can also be at most 1 hour in the future.
        permit2: [
          {
            ...permitTransfer,
            spender: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
          },
        ],
      }


      const transa2: SendTransactionInput = {
        transaction: [
          {
            address: responseData.address,
            abi: responseData.abi,
            functionName: responseData.functionName,
            args: [responseData.args],
          },
        ],
      }
  

    //      // Interactuar con el contrato
    console.log("INPUT:", transa2);

    const tx = await MiniKit.commandsAsync.sendTransaction(transa2);

    console.log("Transacción enviada:", tx);
    

      










    } catch (error) {
      console.error("Error en el proceso de minting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    return <button onClick={handleMint} >Mint</button>;
  }

  