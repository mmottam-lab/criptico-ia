import { APRENDIZAJES } from '@/lib/aprendizajes';
export default function MapaMision({ actual, completados }: { actual: number; completados: number }) {
  return <nav className="mission-map" aria-label="Progreso de la misión">
    <ol>{APRENDIZAJES.map((a,i) => <li key={a.sector} className={i < completados ? 'recovered' : i+1 === actual ? 'active' : ''} aria-current={i+1 === actual ? 'step' : undefined}>
      <span className="map-node" aria-hidden="true">{i < completados ? '✓' : `0${i+1}`}</span>
      <span className="map-label">{a.sector}<small>{i < completados ? 'Recuperado' : i+1 === actual ? 'En exploración' : 'Bloqueado'}</small></span>
    </li>)}</ol>
  </nav>;
}
