"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function SubscribeForm({ variant }: { variant: "footer" | "home" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      toast.error("Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 md:w-64 px-4 py-2.5 rounded-lg text-sm text-[#2B1B22] bg-[#FFF0F5] placeholder:text-[#8A6672] focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="px-5 py-2.5 bg-[#FF8FA3] hover:bg-[#E6738B] text-white font-semibold text-sm rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-5 py-3 rounded-full border border-[#FBCFE8] focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:border-transparent text-[#2B1B22]"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
