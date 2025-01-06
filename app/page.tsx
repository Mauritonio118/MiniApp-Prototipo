import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { Clicker, Minter } from "@/components/GameUI";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <Clicker />
      <Minter />
      <VerifyBlock />
      <PayBlock />
    </main>
  );
}
