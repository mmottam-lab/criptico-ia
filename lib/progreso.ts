"use client";

import { TOTAL_NIVELES } from "./niveles";

export type Progreso = {
  equipo: string;
  inicio: number; // timestamp ms
  desbloqueado: number; // nivel mas alto accesible (1..6; 6 = final)
  descubrimientoPendiente?: number;
  fin?: number; // timestamp ms al terminar
  pistas: number[]; // niveles donde se uso pista
};

// Conserva la clave histórica para mantener las partidas y notas guardadas.
const KEY = "archivo2036";

export function leerProgreso(): Progreso | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (!p || typeof p !== "object" || typeof p.equipo !== "string" || !p.equipo.trim()
      || !Number.isFinite(p.inicio) || p.inicio <= 0
      || !Number.isInteger(p.desbloqueado) || p.desbloqueado < 1 || p.desbloqueado > TOTAL_NIVELES + 1
      || !Array.isArray(p.pistas) || p.pistas.some((n: unknown) => typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > TOTAL_NIVELES)
      || (p.descubrimientoPendiente !== undefined && (!Number.isInteger(p.descubrimientoPendiente) || p.descubrimientoPendiente < 1 || p.descubrimientoPendiente > TOTAL_NIVELES || p.descubrimientoPendiente > p.desbloqueado))
      || (p.fin !== undefined && (!Number.isFinite(p.fin) || p.fin < p.inicio))
      || (p.desbloqueado === TOTAL_NIVELES + 1 && p.fin === undefined)) return null;
    return { ...p, pistas: [...new Set<number>(p.pistas)] };
  } catch {
    return null;
  }
}

export function guardarProgreso(p: Progreso) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function iniciar(equipo: string): Progreso {
  const p: Progreso = { equipo, inicio: Date.now(), desbloqueado: 1, pistas: [] };
  guardarProgreso(p);
  return p;
}

export function reiniciar() {
  try {
    localStorage.removeItem(KEY);
    for (let i = 1; i <= TOTAL_NIVELES; i++) {
      localStorage.removeItem(`${KEY}:chat:${i}`);
      localStorage.removeItem(`${KEY}:notas:${i}`);
    }
  } catch {}
}

export function leerChat(nivel: number): { role: "user" | "model"; text: string }[] {
  try {
    const raw = localStorage.getItem(`${KEY}:chat:${nivel}`);
    const mensajes = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(mensajes)) return [];
    return mensajes.filter((m) => m && (m.role === "user" || m.role === "model") && typeof m.text === "string").slice(-40);
  } catch {
    return [];
  }
}

export function guardarChat(nivel: number, msgs: { role: "user" | "model"; text: string }[]) {
  try {
    localStorage.setItem(`${KEY}:chat:${nivel}`, JSON.stringify(msgs.slice(-40)));
  } catch {}
}

export const PENALIZACION_PISTA_MS = 2 * 60 * 1000;

export function tiempoTotalMs(p: Progreso): number {
  const fin = p.fin ?? Date.now();
  return fin - p.inicio + p.pistas.length * PENALIZACION_PISTA_MS;
}

export function formatoTiempo(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
