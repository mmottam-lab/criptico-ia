"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="portada">
      <div className="portada-inner">
        <p className="eyebrow">Licenciatura en Inteligencia Artificial / CENTRO</p>
        <h1>
          El Archivo <span>2036</span>
        </h1>
        <p className="lead">
          Interceptamos un mensaje sellado hace diez anos por la primera generacion de la licenciatura.
          Esta protegido por cinco capas. Nadie lo resuelve a mano. Tienen una IA y el reloj corre.
        </p>

        <ul className="reglas">
          <li>Cada capa resuelta entrega la palabra que abre la siguiente.</li>
          <li>La IA de cada capa solo sabe lo que ustedes le cuenten. Lo que importa es como le preguntan.</li>
          <li>Pueden pedir una pista por capa. Cada pista suma 2 minutos al tiempo final.</li>
          <li>La ultima capa no se descifra. Se conversa.</li>
        </ul>

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
              Abrir el archivo
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
    </main>
  );
}
