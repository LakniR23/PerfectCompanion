"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, ArrowUp, ArrowDown, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";

const SPECIES_OPTIONS = ["dogs", "cats", "birds", "rabbits", "other"];
const GENDER_OPTIONS = ["Male", "Female"];

export default function AddPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    species: "dogs",
    customSpecies: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    description: "",
    ownerName: "",
    ownerContact: ""
  });

  const [images, setImages] = useState<File[]>([]);
  


  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("species", form.species === "other" ? form.customSpecies : form.species);
    formData.append("breed", form.breed);
    formData.append("age", form.age);
    formData.append("gender", form.gender);
    formData.append("location", form.location);
    formData.append("description", form.description);
    formData.append("ownerName", form.ownerName);
    formData.append("ownerContact", form.ownerContact);

    images.forEach((url, i) => {
      formData.append(`imageUrl_${i}`, url);
    });

    try {
      const res = await fetch("/api/pets", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to add pet.");
        setLoading(false);
        return;
      }

      router.push("/profile/pets");
    } catch (err) {
      setError("Network error.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#F3D6DF] rounded-3xl p-8 max-w-3xl mx-auto shadow-sm">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#8A6672] hover:text-[#FF5C8A] mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="mb-8 border-b border-[#F3D6DF] pb-6">
        <h1 className="text-3xl font-bold text-[#2B1B22]">Add a Pet</h1>
        <p className="text-[#8A6672] mt-2">Create a new listing to help a companion find a forever home.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 font-medium flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Details Section */}
        <div>
          <h2 className="text-lg font-bold text-[#2B1B22] mb-4">Basic Details</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="relative">
              <input
                id="pet-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder=" " required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
              />
              <label htmlFor="pet-name" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white">
                Pet Name *
              </label>
            </div>

            {/* Species */}
            <div className="relative">
              <select
                id="pet-species" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}
                className="w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] appearance-none"
              >
                {SPECIES_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <label htmlFor="pet-species" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#FF5C8A]">
                Species *
              </label>
            </div>

            {form.species === "other" && (
              <div className="relative">
                <input
                  id="pet-species-custom"
                  value={form.customSpecies ?? ""}
                  onChange={e => setForm({ ...form, customSpecies: e.target.value })}
                  placeholder=" "
                  required
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
                />
                <label htmlFor="pet-species-custom" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
                  Specify species *
                </label>
              </div>
            )}

            {/* Breed */}
            <div className="relative">
              <input
                id="pet-breed" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
              />
              <label htmlFor="pet-breed" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white">
                Breed (Optional)
              </label>
            </div>

            {/* Age */}
            <div className="relative">
              <input
                id="pet-age"
                type="text"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                placeholder=" "
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
              />
              <label
                htmlFor="pet-age"
                className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text"
              >
                Age (e.g. 3 months, 2 years)
              </label>
            </div>

            {/* Gender */}
            <div className="relative">
              <select
                id="pet-gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] appearance-none"
              >
                {GENDER_OPTIONS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <label htmlFor="pet-gender" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#FF5C8A] transition-all">
                Gender
              </label>
            </div>

            {/* Location */}
            <div className="relative">
              <input
                id="pet-location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder=" " required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
              />
              <label htmlFor="pet-location" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white">
                Location *
              </label>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h2 className="text-lg font-bold text-[#2B1B22] mb-4">Description</h2>
          <div className="relative">
            <textarea
              id="pet-desc" rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder=" " required
              className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] resize-y"
            />
            <label htmlFor="pet-desc" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white">
              Tell us about the pet *
            </label>
          </div>
        </div>

        {/* Images Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2B1B22]">Photos</h2>
            <span className="text-sm font-medium text-[#8A6672] bg-[#FFF0F5] px-3 py-1 rounded-full">
              {images.length} / 5 max
            </span>
          </div>
          
          <div className="bg-[#FAF5F7] border border-[#F3D6DF] rounded-2xl p-5">

          {/* Upload Area */}
          <label
            htmlFor="pet-images"
            className="
              flex flex-col items-center justify-center
              w-full h-40
              border-2 border-dashed border-[#F3D6DF]
              rounded-2xl
              bg-white
              cursor-pointer
              hover:border-[#FF5C8A]
              hover:bg-[#FFF7FA]
              transition
            "
          >
            <ImageIcon className="w-10 h-10 text-[#FF5C8A] mb-3" />

            <p className="font-semibold text-[#2B1B22]">
              Click to upload photos
            </p>

            <p className="text-sm text-[#8A6672] mt-1">
              PNG, JPG, JPEG • Maximum 5 images
            </p>

            <input
              id="pet-images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);

                if (images.length + files.length > 5) {
                  alert("Maximum 5 images allowed.");
                  return;
                }

                setImages((prev) => [...prev, ...files]);
              }}
            />
          </label>

          {/* Preview Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden border border-[#F3D6DF] bg-white"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                    className="
                      absolute top-2 right-2
                      bg-white/90
                      hover:bg-red-50
                      rounded-full
                      p-1.5
                      shadow
                    "
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-[#8A6672]">
              No photos uploaded yet
            </div>
          )}
        </div>

  {/* Owner Name */}
  <div className="relative mt-4 mb-4">
    <input
      id="owner-name"
      value={form.ownerName}
      onChange={e => setForm({ ...form, ownerName: e.target.value })}
      placeholder=" "
      className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
    />
    <label htmlFor="owner-name" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
      Owner Name (Optional)
    </label>
  </div>

  {/* Owner Contact */}
  <div className="relative">
    <input
      id="owner-contact"
      value={form.ownerContact}
      onChange={e => setForm({ ...form, ownerContact: e.target.value })}
      placeholder=" "
      className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
    />
    <label htmlFor="owner-contact" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
      Owner Contact (Optional)
    </label>
  </div>
</div>

        <div className="pt-6 border-t border-[#F3D6DF]">
          <button
            type="submit" disabled={loading}
            className="w-full bg-[#FF5C8A] hover:bg-[#E94C77] disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg transition shadow-md flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Publishing..." : "Publish Listing"}
          </button>
        </div>

      </form>
    </div>
  );
}