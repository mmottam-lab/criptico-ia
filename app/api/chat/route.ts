import { NextResponse } from "next/server";
import { systemPromptParaNivel } from "@/lib/secretos";
import { TOTAL_NIVELES } from "@/lib/niveles";

export const runtime = "nodejs";

type Msg = { role: "user" | "model"; text: string };

const MAX_MENSAJES = 30;
const MAX_CHARS = 6000;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Falta GEMINI_API_KEY en las variables de entorno del servidor." },
      { status: 500 },
    );
  }

  let body: { nivel?: number; mensajes?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
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

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const r = await fetch(url, {
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
      { error: `El modelo respondio con error ${r.status}. Intenta de nuevo.` },
      { status: 502 },
    );
  }

  const data = await r.json();
  const texto: string =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
    "";

  return NextResponse.json({ text: texto || "(sin respuesta)" });
}
