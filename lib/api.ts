/* ─────────────────────────────────────────────────────────────────────────────
   lib/api.ts  –  Typed API client for the backend routes
───────────────────────────────────────────────────────────────────────────── */

/* ── Types ──────────────────────────────────────────────────────────────── */

export type ApiPetImage = {
  id: string;
  imageUrl: string;
};

export type ApiPetOwner = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export type ApiPet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  gender: string | null;
  location: string;
  description: string | null;
  adopted: boolean;
  images: ApiPetImage[];
  owner: ApiPetOwner | null;
  createdAt: string;
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed: ${res.status}`);
  }

  // 204 No Content — return empty object cast to T
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

/* ── Pets namespace ─────────────────────────────────────────────────────── */

type ListParams = {
  species?: string;
  adopted?: boolean;
};

const pets = {
  /** List pets, optionally filtered */
  list(params: ListParams = {}): Promise<ApiPet[]> {
    const qs = new URLSearchParams();
    if (params.species !== undefined) qs.set("species", params.species);
    if (params.adopted !== undefined)
      qs.set("adopted", String(params.adopted));
    const query = qs.toString();
    return request<ApiPet[]>(`/api/pets${query ? `?${query}` : ""}`);
  },

  /** Fetch a single pet by ID */
  get(id: string): Promise<ApiPet> {
    return request<ApiPet>(`/api/pets/${id}`);
  },

  /** Create a new pet (multipart form data) */
  create(formData: FormData): Promise<ApiPet> {
    return request<ApiPet>("/api/pets", { method: "POST", body: formData });
  },

  /** List the authenticated user's pets */
  myPets(): Promise<ApiPet[]> {
    return request<ApiPet[]>("/api/pets/my");
  },

  /** Mark a pet as adopted */
  markAdopted(id: string): Promise<ApiPet> {
    return request<ApiPet>(`/api/pets/${id}/adopt`, { method: "PATCH" });
  },

  /** Delete a pet listing */
  delete(id: string): Promise<void> {
    return request<void>(`/api/pets/${id}`, { method: "DELETE" });
  },
};

/* ── Auth namespace ─────────────────────────────────────────────────────── */

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

type RegisterBody = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

type LoginBody = {
  email: string;
  password: string;
};

const auth = {
  register(body: RegisterBody): Promise<ApiUser> {
    return request<ApiUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: LoginBody): Promise<ApiUser> {
    return request<ApiUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  logout(): Promise<void> {
    return request<void>("/api/auth/logout", { method: "POST" });
  },

  me(): Promise<ApiUser> {
    return request<ApiUser>("/api/auth/me");
  },
};

/* ── Exported API object ────────────────────────────────────────────────── */

export const api = { pets, auth };
