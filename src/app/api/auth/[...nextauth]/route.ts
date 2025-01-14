import NextAuth, { NextAuthOptions } from "next-auth";
import { connectDB } from '@/lib/DB';

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      const World_ID = user.id; // ID único del usuario proveniente de World ID
      const VerificationLevel = user.verificationLevel;

      try {
        // Comprobar si el usuario ya existe en la base de datos
        const rows = await connectDB.query('SELECT ID FROM users WHERE World_ID = ?', [World_ID]);

        if (rows.length === 0) {
          // Si no existe, crea la entrada en la base de datos
          await connectDB.query(
            'INSERT INTO users (World_ID, Verification_Level, Click_Clicked, Click_Minted, Points, Points_Sec) VALUES (?, ?, 0, 0, 0.0, 0.0)',
            [World_ID, VerificationLevel]
          );
          console.log(`Usuario creado en la base de datos con ID: ${World_ID}`);
        } else {
          console.log(`Usuario ya registrado con ID: ${World_ID}`);
        }

        // Permitir el inicio de sesión
        return true;
      } catch (error) {
        console.error('Error al crear o verificar el usuario en la base de datos:', error);
        return false; // Rechazar el login si hay error
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
