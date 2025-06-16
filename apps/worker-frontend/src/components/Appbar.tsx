"use client";

import {
  WalletDisconnectButton,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const Appbar = () => {
  const { publicKey, signMessage } = useWallet();
  const [hasSigned, setHasSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey && !hasSigned) {
      (async () => {
        try {
          setLoading(true);
          const message = new TextEncoder().encode("Sign in into Crowdlens");
          const signature = await signMessage?.(message);

          if (!signature) throw new Error("Signature failed");

          const response = await axios.post(`${BACKEND_URL}/api/v1/worker/signin`, {
            signature,
            publicKey: publicKey.toBase58()
          });

          localStorage.setItem("token", `Bearer ${response.data.token}`);
          setHasSigned(true);
        } catch (err) {
          console.error("Login failed:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [publicKey, hasSigned, signMessage]);

  return (
    <div className="w-full border-b border-border bg-background/60 backdrop-blur-md shadow-sm px-6 py-3 flex justify-between items-center z-50">
    {/* Brand Logo */}
    <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-3xl font-extrabold tracking-tight">
        CrowdLens
        </div>
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground border">
        Worker-Beta
        </span>
    </div>

    {/* Right Side: Wallet + Status */}
    <div className="flex items-center gap-4">
        {loading && (
        <span className="text-sm text-primary animate-pulse">
            Signing in...
        </span>
        )}
        <div className="rounded-xl bg-card shadow-inner border border-border px-3 py-2 flex items-center gap-3">
        {publicKey ? (
            <WalletDisconnectButton className="!text-sm !px-4 !py-1.5 !rounded-md !bg-red-500 hover:!bg-red-600" />
        ) : (
            <WalletMultiButton className="!text-sm !px-4 !py-1.5 !rounded-md !bg-green-600 hover:!bg-green-700" />
        )}
        </div>
    </div>
    </div>
  );
};
