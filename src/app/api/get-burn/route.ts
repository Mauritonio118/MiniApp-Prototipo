import { NextResponse } from "next/server";

const ABI_BURN_V4 = [{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]
console.log(process.env.NAME_MINT_V4)

export  async function POST(request: Request) {
  try {
    const burnOnChain = "10000000000000000000";
    //Enviar transaccion
    return NextResponse.json({
      address: process.env.MINTER_V4,  
      abi: ABI_BURN_V4,
      functionName: process.env.NAME_BURN_V4,
      args: burnOnChain.toString(),
    });

  } catch (error) {
    console.error("Error en get-mintable:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}