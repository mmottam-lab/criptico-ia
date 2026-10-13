"use client";

import { useEffect, useState } from "react";
import { formatoTiempo, leerProgreso, tiempoTotalMs } from "@/lib/progreso";

export default function Cronometro() {
  const [txt, setTxt] = useState("00:00");
  const [equipo, setEquipo] = useState("");
  const [pistas, setPistas] = useState(0);

  useEffect(() => {
    const tick = () => {
      const p = leerProgreso();
      if (!p) return;
      setEquipo(p.equipo);
      setPistas(p.pistas.length);
      setTxt(formatoTiempo(tiempoTotalMs(p)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="crono">
      <span className="crono-equipo">{equipo}</span>
      <span className="crono-tiempo">{txt}</span>
      {pistas > 0 && <span className="crono-pistas">+{pistas * 2} min por pistas</span>}
    </div>
  );
}
