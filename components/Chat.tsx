"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "@/components/Markdown";
import { guardarChat, leerChat } from "@/lib/progreso";

type Msg = { role: "user" | "model"; text: string; incompleta?: boolean };

export default function Chat({
  nivel,
  placeholder,
  nombreIA,
  saludo,
}: {
  nivel: number;
  placeholder: string;
  nombreIA: string;
  saludo?: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMsgs(leerChat(nivel));
  }, [nivel]);

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, cargando]);

  async function enviar(continuacion?: string) {
    const texto = (continuacion ?? input).trim();
    if (!texto || cargando) return;
    setError(null);
    const nuevos: Msg[] = [...msgs, { role: "user", text: texto }];
    setMsgs(nuevos);
    guardarChat(nivel, nuevos);
    setInput("");
    setCargando(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel, mensajes: nuevos }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Error del servidor");
      const conResp: Msg[] = [...nuevos, { role: "model", text: data.text, incompleta: data.incompleta === true }];
      setMsgs(conResp);
      guardarChat(nivel, conResp);
    } catch (e) {
      setMsgs(msgs);
      guardarChat(nivel, msgs);
      setInput(texto);
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
      taRef.current?.focus();
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div className="chat">
      <div className="chat-head">
        <span className="dot" />
        <span>{nombreIA}</span>
        <span className="chat-hint">Enter para enviar, Shift+Enter para salto de linea</span>
      </div>
      <div className="chat-lista" ref={listaRef}>
        {saludo && msgs.length === 0 && (
          <div className="msg model">
            <div className="msg-body">{saludo}</div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-body">
              {m.role === "model" ? <Markdown>{m.text}</Markdown> : m.text}
              {m.role === "model" && m.incompleta && (
                <div className="chat-continuacion">
                  <p>La respuesta se corto por el limite de longitud.</p>
                  {i === msgs.length - 1 && (
                    <button type="button" className="ghost" disabled={cargando || !!input.trim()}
                      onClick={() => enviar("Continua desde donde se corto tu ultima respuesta, sin repetir lo anterior.")}>
                      Continuar respuesta
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {cargando && (
          <div className="msg model">
            <div className="msg-body pensando" role="status" aria-label="La guía está preparando una pista">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {error && <div className="chat-error" role="alert">{error}</div>}
      </div>
      <div className="chat-input">
        <textarea
          aria-label="Mensaje para tu guía de IA"
          ref={taRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          rows={3}
          maxLength={6000}
          disabled={cargando}
        />
        <button onClick={() => enviar()} disabled={cargando || !input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}
