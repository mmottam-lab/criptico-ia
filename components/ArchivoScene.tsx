export default function ArchivoScene({ completados = 0, compacto = false }: { completados?: number; compacto?: boolean }) {
  return <div className={`archivo-scene ${compacto ? 'compacto' : ''}`}>
    <div className="scene-coordinates" aria-hidden="true"><span>ARCHIVO / 2030</span><span>SEÑAL RECUPERADA</span></div>
    <svg viewBox="0 0 560 430" role="img" aria-label={`Núcleo del archivo: ${completados} de 5 sectores recuperados`}>
      <g className="scene-grid" fill="none" stroke="currentColor">
        {[70,130,190,250,310,370].map(y => <path key={y} d={`M20 ${y} H540`} />)}
        {[60,140,220,300,380,460,540].map(x => <path key={x} d={`M${x} 40 V390`} />)}
      </g>
      <g transform="translate(280 212)" fill="none">
        <circle r="162" className="orbit-outside" />
        <circle r="140" className="orbit-dotted" />
        <path d="M-185 0 H-155 M155 0 H185 M0 -185 V-155 M0 155 V185" className="scene-lines" />
        <g className="core-float">
          <path d="M0 -100 L87 -50 V50 L0 100 L-87 50 V-50 Z" className="core-shell" />
          <path d="M0 -76 L66 -38 V38 L0 76 L-66 38 V-38 Z" className="core-inner" />
          <path d="M-66 -38 L0 0 L66 -38 M0 0 V76" className="scene-lines" />
          <path d="M0 -45 L39 -22 V22 L0 45 L-39 22 V-22 Z" className="core-heart" />
          <path d={completados === 5 ? "M-15 -5 V-17 A15 15 0 0 1 15 -17 M-20 -5 H20 V24 H-20 Z" : "M-15 -5 V-17 A15 15 0 0 1 15 -17 V-5 M-20 -5 H20 V24 H-20 Z"} className="core-lock" />
          <circle cy="7" r="3" className="core-key" />
        </g>
        {[0,1,2,3,4].map(i => {
          const angle = (i * 72 - 90) * Math.PI / 180;
          return <g key={i} transform={`translate(${Math.cos(angle)*162} ${Math.sin(angle)*162})`} className={i < completados ? 'satellite recovered' : 'satellite'}>
            <rect x="-18" y="-18" width="36" height="36" rx="8" />
            <text y="5" textAnchor="middle">{i < completados ? '✓' : `0${i+1}`}</text>
          </g>;
        })}
      </g>
    </svg>
    <div className="scene-caption"><span className="signal-dot" />{completados === 5 ? 'NÚCLEO RESTAURADO' : 'CINCO SECTORES. UNA MISIÓN.'}<span>{completados}/5</span></div>
  </div>;
}
