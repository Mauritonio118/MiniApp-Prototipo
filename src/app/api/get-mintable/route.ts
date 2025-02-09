import { connectDB } from "@/lib/DB"; // Conexión a tu base de datos
import { NextResponse } from "next/server";

const ABI_MINT_V4 = [{"inputs":[{"internalType":"uint256","name":"amountMint","type":"uint256"}],"name":"mintToken","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
console.log(process.env.NAME_MINT_V4)

export  async function POST(request: Request) {
  try {
    const { World_ID } = await request.json();

    // Verificar que el usuario está registrado
    const user = await connectDB.query("SELECT * FROM users WHERE World_ID = ?", [World_ID]);
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Extraer datos
    const { Click_Clicked, Click_Minted } = user[0];
    
    // Calcular el monto mintable en unidades de token
    const mintable = Click_Clicked - Click_Minted;
    if (mintable <= 0) return NextResponse.json({ error: "Nada que mintear" }, { status: 400 });
    const mintableOnChain = mintable * 10**18;

    //Enviar transaccion
    return NextResponse.json({
      address: process.env.MINTER_V4,  
      abi: ABI_MINT_V4,
      functionName: process.env.NAME_MINT_V4,
      args: mintableOnChain.toString(),
    });

  } catch (error) {
    console.error("Error en get-mintable:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


