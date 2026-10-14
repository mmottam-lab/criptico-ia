"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Chat from "@/components/Chat";
import Cronometro from "@/components/Cronometro";
import { getNivel, TOTAL_NIVELES } from "@/lib/niveles";
import { guardarProgreso, leerProgreso } from "@/lib/progreso";

export default function PaginaNivel() {
  const params = useParams<{ n: string }>();
  return <ContenidoNivel key={params.n} n={Number(params.n)} />;
}

function ContenidoNivel({ n }: { n: number }) {
  const router = useRouter();
  const nivel = getNivel(n);

  const [listo, setListo] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState<"idle" | "checando" | "mal" | "bien">("idle");
  const [pistaVisible, setPistaVisible] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = leerProgreso();
    if (!p) {
      router.replace("/");
      return;
    }
    if (!nivel) {
      router.replace("/");
      return;
    }
    if (n > p.desbloqueado) {
      router.replace(p.desbloqueado > TOTAL_NIVELES ? "/final" : `/nivel/${p.desbloqueado}`);
      return;
    }
    setPistaVisible(p.pistas.includes(n));
    setListo(true);
  }, [n, nivel, router]);

  if (!nivel || !listo) return null;

  async function validar(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim() || (estado === "checando" || estado === "bien")) return;
    setEstado("checando");
    setError(null);
    try {
      const r = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel: n, codigo }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "No se pudo verificar la respuesta. Intenta de nuevo.");
      if (data.ok) {
        setEstado("bien");
        const p = leerProgreso();
        if (p) {
          p.desbloqueado = Math.max(p.desbloqueado, n + 1);
          if (n === TOTAL_NIVELES && !p.fin) p.fin = Date.now();
          guardarProgreso(p);
        }
        setTimeout(() => router.push(n === TOTAL_NIVELES ? "/final" : `/nivel/${n + 1}`), 900);
      } else {
        setEstado("mal");
        setTimeout(() => setEstado("idle"), 1200);
      }
    } catch (error) {
      setEstado("idle");
      setError(error instanceof Error ? error.message : "No se pudo verificar la respuesta. Intenta de nuevo.");
    }
  }

  function pedirPista() {
    const p = leerProgreso();
    if (!p) return;
    if (!p.pistas.includes(n)) {
      p.pistas.push(n);
      guardarProgreso(p);
    }
    setPistaVisible(true);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(nivel!.texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {}
  }

  const esGuardian = n === TOTAL_NIVELES;

  return (
    <main className="nivel">
      <header className="nivel-top">
        <div className="progreso">
          {Array.from({ length: TOTAL_NIVELES }, (_, i) => (
            <span key={i} className={`seg ${i + 1 < n ? "done" : i + 1 === n ? "cur" : ""}`} />
          ))}
        </div>
        <Cronometro />
      </header>

      <div className="nivel-grid">
        <section className="panel">
          <p className="eyebrow">{nivel.tipo}</p>
          <h2>{nivel.titulo}</h2>
          <p className="intro">{nivel.intro}</p>

          <div className="texto-wrap">
            <pre className={`texto ${esGuardian ? "guardian" : ""}`}>{nivel.texto}</pre>
            {!esGuardian && (
              <button type="button" className="ghost" onClick={copiar}>
                {copiado ? "Copiado" : "Copiar texto"}
              </button>
            )}
          </div>

          <p className="habilidad">
            <span>Lo que se entrena aqui:</span> {nivel.habilidad}
          </p>

          <div className="pista-wrap">
            {pistaVisible ? (
              <p className="pista">{nivel.pista}</p>
            ) : (
              <button type="button" className="ghost" onClick={pedirPista}>
                Pedir pista (+2 min)
              </button>
            )}
          </div>

          <form onSubmit={validar} className={`form-codigo ${estado}`}>
            <label htmlFor="codigo">{esGuardian ? "Palabra final" : "Palabra que abre la siguiente capa"}</label>
            <div className="row">
              <input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Escribela aqui"
                autoComplete="off"
                autoCapitalize="characters"
              />
              <button type="submit" disabled={!codigo.trim() || estado === "checando" || estado === "bien"}>
                {estado === "bien" ? "Abierta" : estado === "mal" ? "No" : "Abrir"}
              </button>
            </div>
            {error && <p role="alert">{error}</p>}
          </form>
        </section>

        <section className="panel panel-chat">
          <Chat
            nivel={n}
            placeholder={nivel.placeholder}
            nombreIA={esGuardian ? "El guardian" : "IA del archivo"}
            saludo={esGuardian ? nivel.texto : undefined}
          />
        </section>
      </div>
    </main>
  );
}
