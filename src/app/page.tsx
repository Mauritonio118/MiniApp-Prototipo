import { SignIn } from "@/components/SignIn";
import { Minter, Clicker, Burner, PointsDisplay, ClickCounter } from "@/components/GameUI";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <br></br>
      <br></br>
      <PointsDisplay />
      <br></br>
      <ClickCounter />
      <br></br>
      <Clicker />
      <br></br>
      <Minter />
      <br></br>
      <Burner />
    </main>
  );
}
