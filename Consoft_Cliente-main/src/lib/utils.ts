import api from "@/components/Global/axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchCurrentUser() {
  try {
    const res = await api.get("/api/auth/me", { withCredentials: true, validateStatus: () => true });
    if (res.status !== 200) {
      return null;
    }
    return res.data;
  } catch {
    return null;
  }
}
