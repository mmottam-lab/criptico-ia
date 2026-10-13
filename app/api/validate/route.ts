import { NextResponse } from "next/server";
import { RESPUESTAS, normaliza } from "@/lib/secretos";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { nivel?: number; codigo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalido." }, { status: 400 });
  }
  const nivel = Number(body.nivel);
  const esperado = RESPUESTAS[nivel];
  if (!esperado) {
    return NextResponse.json({ ok: false, error: "Nivel invalido." }, { status: 400 });
  }
  const ok = normaliza(String(body.codigo ?? "")) === esperado;
  return NextResponse.json({ ok });
}
