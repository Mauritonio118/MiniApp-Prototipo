"use client"; 
import styles from "./clicker.module.css"; 
import { useSession, signIn } from "next-auth/react";

export function Clicker() {
  const { data: session, status } = useSession();
  const isUserLoggedIn = status === "authenticated";

  return (
    <div>
      {isUserLoggedIn ? (
        <button className={styles.activeButton}>
          ¡Click para ganar!
        </button>
      ) : (
        <button onClick={() => signIn()} className={styles.disabledButton}>
          Inicia sesión con World ID para jugar
        </button>
      )}
    </div>
  );
}
