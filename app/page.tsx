"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArchivoScene from "@/components/ArchivoScene";
import { iniciar, leerProgreso, reiniciar } from "@/lib/progreso";

export default function Inicio() {
  const router = useRouter();
  const [equipo, setEquipo] = useState("");
  const [existente, setExistente] = useState<{ equipo: string; desbloqueado: number } | null>(null);

  useEffect(() => {
    const p = leerProgreso();
    if (p) setExistente({ equipo: p.equipo, desbloqueado: p.desbloqueado });
  }, []);

  function comenzar(e: React.FormEvent) {
    e.preventDefault();
    const nombre = equipo.trim();
    if (!nombre) return;
    reiniciar();
    iniciar(nombre);
    router.push("/nivel/1");
  }

  function continuar() {
    if (!existente) return;
    router.push(existente.desbloqueado > 5 ? "/final" : `/nivel/${existente.desbloqueado}`);
  }

  return (
    <main className="portada game-home">
      <div className="home-status"><span>CENTRO / EXPLORACIONES DE IA</span><span>EXPEDICIÓN 001</span></div>
      <div className="home-layout">
      <div className="portada-inner">
        <p className="eyebrow">Misión interactiva · 5 sectores</p>
        <h1>
          El Archivo <span>2036<span className="title-cursor" aria-hidden="true">_</span></span>
        </h1>
        <p className="lead">
          Un archivo del futuro está a punto de desaparecer. Recuperen sus cinco fragmentos con ayuda de una IA y descubran cómo funciona, dónde falla y qué decisiones siguen en sus manos.
        </p>

        <div className="mission-brief"><span>SU OBJETIVO</span><p>Exploren un código. Conversen con su guía. Comprueben una idea sobre inteligencia artificial.</p></div>
        <p className="mission-meta">◷ Cerca de 60 min <span>01 dispositivo por equipo</span></p>
        <form onSubmit={comenzar} className="form-equipo">
          <label htmlFor="equipo">Nombre del equipo</label>
          <div className="row">
            <input
              id="equipo"
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              placeholder="Los sin pista"
              maxLength={40}
              autoComplete="off"
            />
            <button type="submit" disabled={!equipo.trim()}>
              Iniciar misión →
            </button>
          </div>
        </form>

        {existente && (
          <p className="continuar">
            Hay una partida de <strong>{existente.equipo}</strong> en este dispositivo.{" "}
            <button type="button" className="link" onClick={continuar}>
              Continuar donde se quedaron
            </button>
          </p>
        )}
      </div>
      <div className="home-art"><ArchivoScene /><div className="transmission"><span>TRANSMISIÓN 00 / ANTES DE ENTRAR</span><h2>La IA propone.<br />Ustedes comprueban.</h2><p>La IA puede generar texto y reconocer patrones. También puede equivocarse. Aquí aprenderán a trabajar con ella, no a creerle a ciegas.</p></div></div>
      </div>
      <footer className="home-footer"><span>LICENCIATURA EN INTELIGENCIA ARTIFICIAL / CENTRO</span><span>Las pistas del reto suman 2 minutos. Aprender no penaliza.</span></footer>
    </main>
  );
}
