import { NextResponse } from "next/server";
import { connectDB } from "@/lib/DB";
import { getServerSession } from "next-auth";
//import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.name) {
      return NextResponse.json({ success: false, message: "Usuario no autenticado" }, { status: 401 });
    }

    const [user] = await connectDB.query("SELECT Click_Clicked, Click_Minted FROM users WHERE World_ID = ?", [session.user.name]);

    if (!user) {
      return NextResponse.json({ success: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    const initialClickCount = user.Click_Clicked - user.Click_Minted;
    return NextResponse.json({ success: true, initialClickCount });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 });
  }
}

