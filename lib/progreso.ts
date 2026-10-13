"use client";

export type Progreso = {
  equipo: string;
  inicio: number; // timestamp ms
  desbloqueado: number; // nivel mas alto accesible (1..6; 6 = final)
  fin?: number; // timestamp ms al terminar
  pistas: number[]; // niveles donde se uso pista
};

const KEY = "archivo2036";

export function leerProgreso(): Progreso | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progreso) : null;
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
    for (let i = 1; i <= 5; i++) localStorage.removeItem(`${KEY}:chat:${i}`);
  } catch {}
}

export function leerChat(nivel: number): { role: "user" | "model"; text: string }[] {
  try {
    const raw = localStorage.getItem(`${KEY}:chat:${nivel}`);
    return raw ? JSON.parse(raw) : [];
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
