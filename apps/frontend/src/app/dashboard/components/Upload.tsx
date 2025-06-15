"use client";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { UploadImage } from "./UploadImage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const Upload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  async function onSubmit() {
    try {
      setLoading(true);
      toast.loading("Submitting task...");
      const response = await axios.post(
        `${NEXT_PUBLIC_BACKEND_URL}/api/v1/user/task`,
        JSON.stringify({
          options: images.map((image) => ({ imageUrl: image })),
          title,
          signature: txSignature,
        }),
        {
          headers: {
            "Authorization": `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify({
              options: images.map((image) => ({ imageUrl: image })),
              title,
              signature: txSignature,
            }).length.toString()
          },
        }
      );

      toast.dismiss();
      toast.success("Task created!");
      router.push(`/dashboard/task/${response.data.id}`);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to submit task.");
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  async function makePayment() {
    try {
      if (!publicKey) return toast.error("Wallet not connected");
      setLoading(true);
      toast.loading("Sending 0.1 SOL...");

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("5tm9oN2bpTxFdELx9ddcxjFG9HD4NQHdkdz3CYm25EQj"),
          lamports: 0.1 * LAMPORTS_PER_SOL,
        })
      );

      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, { minContextSlot });

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

      setTxSignature(signature);
      toast.dismiss();
      toast.success("Payment successful!");
    } catch (err) {
        console.log(err)
        toast.dismiss();
        toast.error("Payment failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create a New Task</h1>
          {publicKey && (
            <div className="text-sm text-muted-foreground">
              Connected: {publicKey.toBase58().slice(0, 4)}...
              {publicKey.toBase58().slice(-4)}
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Choose the best thumbnail"
            className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Image Options</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-md">
                <img src={image} alt="Uploaded" className="w-full h-32 object-cover" />
              </div>
            ))}
            <UploadImage
              onImageAdded={(imageUrl) => {
                setImages((i) => [...i, imageUrl]);
              }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full flex justify-end">
          <button
            onClick={txSignature ? onSubmit : makePayment}
            disabled={loading || !title || images.length < 1}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              txSignature
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-green-600 text-white hover:bg-green-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? txSignature
                ? "Submitting..."
                : "Paying..."
              : txSignature
              ? "Submit Task"
              : "Pay 0.1 SOL"}
          </button>
        </div>
      </div>
    </div>
  );
};
