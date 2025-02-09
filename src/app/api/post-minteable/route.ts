import { connectDB } from "@/lib/DB"; // Conexión a tu base de datos
import { NextResponse } from "next/server";

export  async function POST(request: Request) {
  try {
    //Leer respuesta
    const { World_ID, amountMintedOnChain } = await request.json();

    // Verificar que el usuario está registrado
    const user = await connectDB.query("SELECT * FROM users WHERE World_ID = ?", [World_ID]);
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    //Extraer dato
    const userData = user[0]
    const Click_Minted = Number(userData.Click_Minted);

    // Calcular el monto mintable
    const amountMinted = Number(amountMintedOnChain) / 10**18;
    const newClick_Minted = Number(Click_Minted + amountMinted);

    // Actualizar el contador de clicks
    await connectDB.query('UPDATE users SET Click_Minted = ? WHERE World_ID = ?', [newClick_Minted.toString(), World_ID]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error en post-mintable:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}