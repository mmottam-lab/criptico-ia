"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MapaMision from "@/components/MapaMision";
import Descubrimiento from "@/components/Descubrimiento";
import { APRENDIZAJES } from "@/lib/aprendizajes";
import MesaTrabajo from "@/components/MesaTrabajo";
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

  const [vista, setVista] = useState("reto");
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
    if (p.descubrimientoPendiente === n) setEstado("bien");
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
        const p = leerProgreso();
        if (p) { p.descubrimientoPendiente = n; guardarProgreso(p); }
        setEstado("bien");
      } else {
        setEstado("mal");
        setTimeout(() => setEstado("idle"), 1200);
      }
    } catch (error) {
      setEstado("idle");
      setError(error instanceof Error ? error.message : "No se pudo verificar la respuesta. Intenta de nuevo.");
    }
  }

  function continuarMision() {
    const p = leerProgreso();
    if (!p) { router.replace("/"); return; }
    delete p.descubrimientoPendiente;
    p.desbloqueado = Math.max(p.desbloqueado, n + 1);
    if (n === TOTAL_NIVELES && !p.fin) p.fin = Date.now();
    guardarProgreso(p);
    router.push(n === TOTAL_NIVELES ? "/final" : `/nivel/${n + 1}`);
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
    <main className={`nivel ${estado !== "bien" ? "mission-active" : ""}`}>
      <header className="nivel-top">
        <a className="mission-brand" href="/">ARCHIVO <span>2030</span></a>
        <span className="mission-location">SECTOR 0{n} / 05</span>
        <Cronometro />
      </header>

      <MapaMision actual={n} completados={estado === "bien" ? n : n-1} />
      {estado === "bien" ? <Descubrimiento nivel={n} continuar={continuarMision} /> : <>
      <div className="sector-heading"><p className="eyebrow">Exploración en curso</p><h1>{APRENDIZAJES[n-1].sector}</h1><span>01 Resuelve el reto <b>→</b> 02 Descubre la IA</span></div>
      <nav className="workspace-switch" aria-label="Vista de trabajo">
        {[["reto", "01 Reto"], ["chat", "02 Chat IA"], ["herramientas", "03 Herramientas"]].map(([id, label]) => <button type="button" key={id} aria-pressed={vista === id} onClick={() => setVista(id)}>{label}</button>)}
      </nav>
      <div className="nivel-grid" data-vista={vista}>
        <section className="panel panel-reto" aria-label="Reto del sector" tabIndex={0}>
          <p className="eyebrow">Señal interceptada / {nivel.tipo}</p>
          <h2>{nivel.titulo}</h2>
          <details className="reto-instrucciones" open><summary>Cómo abordar este reto</summary><p className="intro">{nivel.intro}</p></details>

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

          <details className="ia-transmission"><summary>¿Qué tiene que ver este reto con la IA?</summary><p>{APRENDIZAJES[n-1].concepto}</p><p className="transmission-task">{APRENDIZAJES[n-1].practica}</p></details>
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
              <button type="submit" disabled={!codigo.trim() || estado === "checando"}>
                {estado === "checando" ? "Verificando…" : estado === "mal" ? "Reintentar" : "Descifrar"}
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
            saludo={esGuardian ? nivel.texto : "Soy tu guía de exploración. Comparte lo que observas o tu primer intento: avanzaremos una pista a la vez."}
          />
        </section>
        <MesaTrabajo nivel={n} />
      </div>
      </>}
    </main>
  );
}
