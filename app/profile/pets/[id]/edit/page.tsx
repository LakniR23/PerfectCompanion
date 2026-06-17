"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";

const SPECIES_OPTIONS = ["dogs", "cats", "birds", "rabbits", "other"];
const GENDER_OPTIONS = ["Male", "Female"];

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
}

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", species: "dogs", customSpecies: "", breed: "", age: "", gender: "", location: "", description: "", ownerName: "", ownerContact: "" });
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    fetch(`/api/pets/${id}`)
      .then(async (res) => {
        const text = await res.text();
        if (!text) { setError("Empty response."); return; }
        const data = JSON.parse(text);

        const knownSpecies = ["dogs", "cats", "birds", "rabbits", "other"];
        const isKnown = knownSpecies.includes(data.species);

        setForm({ 
          name: data.name, 
          species: isKnown ? data.species : "other",
          customSpecies: isKnown ? "" : data.species,  
          breed: data.breed ?? "", 
          age: data.age?.toString() ?? "", 
          gender: data.gender ?? "Male", 
          location: data.location, 
          description: data.description,
          ownerName: data.ownerName ?? "",
          ownerContact: data.ownerContact ?? ""
        });

        const existingImages = data.images.map((img: { imageUrl: string }, idx: number) => ({
          id: `existing-${idx}`,
          url: img.imageUrl,
          isNew: false
        }));
        setImages(existingImages);
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < images.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const totalImages = images.length + fileArray.length;
    
    if (totalImages > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    
    const newImages: ImageItem[] = fileArray.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      file: file,
      isNew: true
    }));
    
    setImages([...images, ...newImages]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

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
    
    // Send image order and data
    images.forEach((image, index) => {
      formData.append(`imageOrder_${index}`, image.isNew ? "new" : "existing");
      
      if (image.isNew && image.file) {
        formData.append(`newImage_${index}`, image.file);
      } else if (!image.isNew) {
        formData.append(`existingImage_${index}`, image.url);
      }
    });
    
    // Send IDs of images to keep (for deletion tracking)
    const keepImages = images.filter(img => !img.isNew).map(img => img.url);
    formData.append("keepImages", JSON.stringify(keepImages));

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/profile/pets"), 1200);
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.isNew && image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#F3D6DF] rounded-3xl p-8 max-w-3xl mx-auto shadow-sm">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#8A6672] hover:text-[#FF5C8A] mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-8 border-b border-[#F3D6DF] pb-6">
        <h1 className="text-3xl font-bold text-[#2B1B22]">Edit Pet</h1>
        <p className="text-[#8A6672] mt-1">Update your listing details.</p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-5 py-4">
          Saved! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-bold text-[#2B1B22] mb-4">Basic Details</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {([
              ["name", "Pet Name *", form.name, "name", true, "text"],
              ["breed", "Breed (Optional)", form.breed, "breed", false, "text"],
              ["age", "Age (e.g. 3 months, 2 years)", form.age, "age", false, "text"],
              ["location", "Location *", form.location, "location", true, "text"]
            ] as [string, string, string, string, boolean, string][]).map(([fid, label, value, key, req, type]) => (
              <div key={fid} className="relative">
                <input
                  id={fid}
                  type={type}
                  value={value}
                  required={req}
                  placeholder=" "
                  min={type === "number" ? "0" : undefined}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
                />
                <label
                  htmlFor={fid}
                  className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text"
                >
                  {label}
                </label>
              </div>
            ))}
            
           <div className="relative">
              <select
                id="species"
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value, customSpecies: "" })}
                className="w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] appearance-none"
              >
                {SPECIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <label htmlFor="species" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#FF5C8A]">
                Species *
              </label>
            </div>

            {form.species === "other" && (
              <div className="relative">
                <input
                  id="species-custom"
                  value={form.customSpecies ?? ""}
                  onChange={(e) => setForm({ ...form, customSpecies: e.target.value })}
                  placeholder=" "
                  required
                  className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
                />
                <label htmlFor="species-custom" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
                  Specify species *
                </label>
              </div>
            )}
            
            <div className="relative">
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] appearance-none"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <label
                htmlFor="gender"
                className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#FF5C8A]"
              >
                Gender
              </label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#2B1B22] mb-4">Description</h2>
          <div className="relative">
            <textarea
              id="desc"
              rows={5}
              value={form.description}
              required
              placeholder=" "
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] resize-y"
            />
            <label
              htmlFor="desc"
              className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text"
            >
              Tell us about the pet *
            </label>
          </div>
        </div>

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
              <p className="font-semibold text-[#2B1B22]">Click to upload photos</p>
              <p className="text-sm text-[#8A6672] mt-1">
                PNG, JPG, JPEG • Maximum 5 images total
              </p>
              <input
                id="pet-images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAddImages(e.target.files)}
              />
            </label>

            {/* Images Grid with Reordering */}
            {images.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 mt-5">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-3 bg-white border border-[#F3D6DF] p-2 rounded-xl shadow-sm"
                  >
                    {/* Image Preview */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={image.url}
                        alt={`Pet ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {image.isNew && (
                        <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center">
                          New
                        </span>
                      )}
                    </div>
                    
                    {/* Image Info */}
                    <div className="flex-1 text-sm text-[#5A3B45] truncate">
                      {image.isNew ? image.file?.name || "New image" : "Existing image"}
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 text-gray-400 hover:text-[#2B1B22] hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, "down")}
                        disabled={index === images.length - 1}
                        className="p-1.5 text-gray-400 hover:text-[#2B1B22] hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      
                      <div className="w-px h-6 bg-gray-200 mx-1" />
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-[#8A6672]">
                No photos uploaded yet
              </div>
            )}
            
            {/* Reorder Hint */}
            {images.length > 1 && (
              <p className="text-xs text-center text-[#8A6672] mt-3">
                Use ↑ ↓ arrows to reorder images
              </p>
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
            type="submit"
            disabled={saving}
            className="w-full bg-[#FF5C8A] hover:bg-[#E94C77] disabled:opacity-60 text-white py-4 rounded-xl font-bold text-lg transition shadow-md flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}