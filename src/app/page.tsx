import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { Minter, ClickStats, Burner } from "@/components/GameUI";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <br></br>
      <ClickStats />
      <br></br>
      <Minter />
      <br></br>
      <Burner />
      <br></br>
      <VerifyBlock />
      <br></br>
      <PayBlock />
    </main>
  );
}
