 import { SignIn } from "@/components/SignIn"
 import { Minter, Clicker, Burner, PointsDisplay, ClickCounter } from "@/components/GameUI"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Click Token</h1>
          <SignIn />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <div className="space-y-6 text-center">
            <PointsDisplay />
            <ClickCounter />
            <Clicker />
          </div>
          <div className="space-y-6 text-center">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Acciones</h2>
              <div className="flex justify-around">
                <Minter />
                <Burner />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}