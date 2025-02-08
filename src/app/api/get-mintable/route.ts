import { connectDB } from "@/lib/DB"; // Conexión a tu base de datos
import { NextResponse } from "next/server";

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

//wrap argumentos -> todo en string
//Multiples arg visualmente array realmente string

    console.log("DATOS AL FRON:")
    return NextResponse.json({
      address: process.env.MINTER_V4,  //Contrato testnet
      abi: process.env.ABI_MINT_V4,
      functionName: process.env.NAME_MINT_V4,
      args: mintable.toString(),
    });



  } catch (error) {
    console.error("Error en get-mintable:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


