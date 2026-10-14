import { NextResponse } from "next/server";
import { systemPromptParaNivel } from "@/lib/secretos";
import { TOTAL_NIVELES } from "@/lib/niveles";

export const runtime = "nodejs";

type Msg = { role: "user" | "model"; text: string };

const MAX_MENSAJES = 30;
const MAX_CHARS = 6000;

export async function POST(req: Request) {
  let body: { nivel?: number; mensajes?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body) || !Array.isArray(body.mensajes)) {
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }
  const nivel = Number(body.nivel);
  if (!Number.isInteger(nivel) || nivel < 1 || nivel > TOTAL_NIVELES) {
    return NextResponse.json({ error: "Nivel invalido." }, { status: 400 });
  }

  const mensajes = (body.mensajes ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "model") && typeof m.text === "string")
    .slice(-MAX_MENSAJES)
    .map((m) => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_CHARS) }] }));

  if (mensajes.length === 0 || mensajes[mensajes.length - 1].role !== "user") {
    return NextResponse.json({ error: "El ultimo mensaje debe ser del usuario." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY en el servidor." }, { status: 503 });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(45000),
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPromptParaNivel(nivel) }] },
        contents: mensajes,
        generationConfig: { temperature: nivel === 5 ? 0.9 : 0.3, maxOutputTokens: 2048 },
      }),
    });

    if (!r.ok) {
      const detalle = await r.text().catch(() => "");
      console.error("Gemini error", r.status, detalle.slice(0, 500));
      return NextResponse.json(
        { error: r.status === 429
          ? "Se alcanzo el limite de Gemini. Espera un momento y vuelve a intentar."
          : r.status === 401 || r.status === 403
            ? "La clave de Gemini no tiene acceso. Revisa la configuracion del servidor."
            : r.status === 404
              ? "El modelo configurado no esta disponible. Revisa GEMINI_MODEL en el servidor."
              : "Gemini no esta disponible en este momento. Intenta de nuevo." },
        { status: r.status === 429 ? 429 : 502 },
      );
    }

    const data = await r.json();
    const texto: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
      "";

    if (!texto.trim()) {
      return NextResponse.json({ error: "Gemini no genero una respuesta. Reformula el mensaje o intenta de nuevo." }, { status: 502 });
    }
    return NextResponse.json({ text: texto });
  } catch (error) {
    const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json({ error: timeout
      ? "Gemini tardo demasiado. Intenta de nuevo."
      : "No se pudo conectar con Gemini. Intenta de nuevo." }, { status: timeout ? 504 : 502 });
  }
}
