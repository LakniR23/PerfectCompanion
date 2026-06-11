"use client";

export default function FavoriteButton() {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alert("Added to favorites ❤️");
      }}
      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#D0C0B8] hover:text-[#D4633A] transition-colors shadow-sm"
    >
      ❤️
    </button>
  );
}