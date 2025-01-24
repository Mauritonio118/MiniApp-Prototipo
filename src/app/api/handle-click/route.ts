import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/DB';

export async function POST(request: Request) {
  try {
    const { worldId } = await request.json(); // Recibimos el World ID del usuario

    // Validar que el usuario exista
    const [user] = await connectDB.query('SELECT World_ID FROM users WHERE World_ID = ?', [worldId]);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Actualizar el contador de clicks
    await connectDB.query('UPDATE users SET Click_Clicked = Click_Clicked + 1 WHERE World_ID = ?', [worldId]);

    return NextResponse.json({ success: true, newClickCount: user.Click_Clicked + 1 });
  } catch (error) {
    console.error('Error al manejar el click:', error);
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
