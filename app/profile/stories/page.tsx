"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, PlusCircle, Trash2, Edit, BookOpen } from "lucide-react";

type Story = {
  id: string;
  petName: string;
  petType: string;
  location: string;
  story: string;
  imageUrl: string;
  createdAt: string;
};

export default function MyStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stories?my=true")
      .then(async (res) => {
        const text = await res.text();
        if (!text) {
          setError("Server returned an empty response.");
          return;
        }
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) setStories(data);
          else setError(data.error ?? "Failed to load stories.");
        } catch {
          setError("Invalid response from server.");
        }
      })
      .catch(() => setError("Network error. Please check your connection."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories(stories.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Failed to delete story.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-10 text-center text-[#8A6672]">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2B1B22]">My Adoption Stories</h1>
          <p className="text-[#8A6672] mt-1 text-sm">Share your pet's happily ever after</p>
        </div>
        <Link
          href="/profile/stories/add"
          className="inline-flex items-center gap-2 bg-[#FF5C8A] hover:bg-[#E94C77] text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <PlusCircle className="w-4 h-4" /> Share Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="bg-white border border-[#F3D6DF] rounded-3xl p-16 text-center">
          <div className="flex justify-center mb-4"><BookOpen className="w-12 h-12 text-[#FF5C8A]" /></div>
          <p className="text-[#2B1B22] font-semibold mb-2">No stories yet</p>
          <p className="text-[#8A6672] text-sm mb-6">Write about your adoption journey to inspire others.</p>
          <Link
            href="/profile/stories/add"
            className="inline-flex items-center gap-2 bg-[#FF5C8A] text-white px-5 py-3 rounded-xl font-semibold"
          >
            <PlusCircle className="w-4 h-4" /> Write a Story
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {stories.map((story) => (
            <div key={story.id} className="bg-white border border-[#F3D6DF] rounded-3xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-48">
                <Image src={story.imageUrl} alt={story.petName} fill className="object-cover" />
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg text-[#2B1B22]">{story.petName}</h3>
                <p className="text-sm text-[#8A6672]">{story.petType} · {story.location}</p>
                <p className="text-[#5A3B45] text-sm mt-3 line-clamp-3">{story.story}</p>
                <div className="mt-auto pt-5 flex gap-2">
                  <Link
                    href={`/profile/stories/${story.id}/edit`}
                    className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl border border-[#F3D6DF] hover:bg-[#FFF0F5] text-sm font-semibold transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
