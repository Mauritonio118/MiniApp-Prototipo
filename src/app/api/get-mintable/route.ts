import { ethers } from "ethers";
import { connectDB } from "@/lib/DB"; // Conexión a tu base de datos
import { NextResponse } from "next/server";

//PARA BORRAR
// Clave privada del backend (asegúrate de protegerla correctamente)
//const PRIVATE_KEY = process.env.PRIVATE_KEY;
//if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY no está definida");
//const signer = new ethers.Wallet(PRIVATE_KEY);

export  async function POST(request: Request) {
  try {
    const { World_ID } = await request.json();

    // Verificar que el usuario está registrado
    const user = await connectDB.query("SELECT * FROM users WHERE World_ID = ?", [World_ID]);
    console.log("INFO USER")
    console.log(typeof user)
    console.log(user)
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const { Click_Clicked, Click_Minted } = user[0];
    
    // Calcular el monto mintable
    console.log("Click_Clicked: ", Click_Clicked)
    console.log("Click_Minted: ", Click_Minted)
    console.log("Tipos: ", typeof Click_Clicked , typeof Click_Minted)

    const mintable = Click_Clicked - Click_Minted;
    if (mintable <= 0) return NextResponse.json({ error: "Nada que mintear" }, { status: 400 });
    
    console.log("MONTO MINTEABLE:", mintable)

    //PARA BORRAR
    // Crear un mensaje para firmar
    //const messageHash = ethers.solidityPackedKeccak256(
    //  ["uint256"],
    //  [mintable]
    //);

    // Firmar el mensaje
    //const signature = await signer.signMessage(ethers.getBytes(messageHash));

    // Enviar respuesta al frontend
    console.log("DATOS AL FRON:")
    return NextResponse.json({
//      address: "0xc1399662D5d1d643486C917339a40c16b579F0f7",  //Contrato mainnet
      address: 0x373Cac5cA12D0c35d35971d1F042F6D6A6B12908,  //Contrato testnet

      abi: process.env.ABI_MINT,
      functionName: "mint",
      args: [mintable],
    });




  } catch (error) {
    console.error("Error en get-mintable:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


