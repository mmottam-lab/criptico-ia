"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatoTiempo, leerProgreso, Progreso, reiniciar, tiempoTotalMs } from "@/lib/progreso";

export default function Final() {
  const router = useRouter();
  const [p, setP] = useState<Progreso | null>(null);

  useEffect(() => {
    const prog = leerProgreso();
    if (!prog || !prog.fin) {
      router.replace("/");
      return;
    }
    setP(prog);
  }, [router]);

  if (!p) return null;

  const bruto = (p.fin ?? Date.now()) - p.inicio;
  const total = tiempoTotalMs(p);

  return (
    <main className="portada final">
      <div className="portada-inner">
        <p className="eyebrow">Archivo abierto</p>
        <h1>
          Bienvenidos, <span>primera generacion</span>.
        </h1>
        <p className="lead">
          Equipo <strong>{p.equipo}</strong>. Cinco capas, cinco formas distintas de trabajar con una IA:
          pedir con claridad, dar contexto, estructurar la entrada, explorar opciones y entender sus limites.
          Eso es lo que se estudia aqui.
        </p>

        <div className="resultado">
          <div>
            <span className="num">{formatoTiempo(total)}</span>
            <span className="lbl">tiempo final</span>
          </div>
          <div>
            <span className="num">{formatoTiempo(bruto)}</span>
            <span className="lbl">sin penalizaciones</span>
          </div>
          <div>
            <span className="num">{p.pistas.length}</span>
            <span className="lbl">pistas usadas</span>
          </div>
        </div>

        <p className="muted">Tomen captura de esta pantalla y muestrenla para registrar su tiempo.</p>

        <button
          type="button"
          className="link"
          onClick={() => {
            reiniciar();
            router.push("/");
          }}
        >
          Reiniciar para otro equipo
        </button>
      </div>
    </main>
  );
}
