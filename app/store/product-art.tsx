/** Original illustrative product silhouettes, not photographs or stocked merchandise. */
type Props = {kind?: 'tee'|'polo'|'hoodie'|'cap'|'tote'|'bottle'; category?: string; color: string; name: string};
export default function ProductArt({kind, category, color, name}: Props) {
  const type = kind || category || 'tee';
  const light = ['#ffffff','#fff','#f4f1e8','#f5f2e8','#f7f4ec','white'].includes(color.toLowerCase());
  const trim = light ? '#b9c2cf' : '#ffffff';
  const crest = (x:number,y:number,width:number,height:number) => <image href="/stjohn-logo.png" x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid meet"/>;
  return <svg viewBox="0 0 360 320" role="img" aria-label={`${name} concept illustration`} xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="180" cy="282" rx={type==='bottle'?58:108} ry="10" fill="#172c4c" opacity=".07"/>
    {type==='cap' ? <>
      <path d="M80 191c1-69 39-110 101-110s99 46 101 110l-40 29H111z" fill={color} stroke="#142747" strokeOpacity=".18"/>
      <path d="M89 188c72-21 133-14 194 7 32 12 43 32 27 43-20 14-80-8-122-19-41-11-70-10-99-6z" fill={color} stroke="#142747" strokeOpacity=".18"/>
      <path d="M180 83v91M180 83c-34 29-48 58-49 96M180 83c35 22 51 55 52 99" fill="none" stroke={trim} strokeOpacity=".16"/>
      <ellipse cx="180" cy="82" rx="9" ry="5" fill={color}/>{crest(158,115,44,57)}
    </> : type==='tote' ? <>
      <path d="M129 113V86c0-69 102-69 102 0v27" fill="none" stroke={color} strokeWidth="16"/>
      <path d="M83 103h194l-11 164H94z" fill={color} stroke="#142747" strokeOpacity=".18"/>
      <path d="M100 114l9 141h142l9-141M130 108v34m100-34v34" fill="none" stroke={trim} strokeOpacity=".23"/>{crest(152,142,56,72)}
      <text x="180" y="236" textAnchor="middle" fill={trim} opacity=".8" fontFamily="Arial,sans-serif" fontSize="9" letterSpacing="2">ST. JOHN LUTHERAN</text>
    </> : type==='bottle' ? <>
      <rect x="150" y="38" width="60" height="32" rx="9" fill="#263342"/><path d="M150 65h60v24c0 12 15 18 15 35v130c0 20-90 20-90 0V124c0-17 15-23 15-35z" fill={color} stroke="#142747" strokeOpacity=".2"/>
      <path d="M146 123v120" stroke="white" strokeWidth="4" opacity=".2" strokeLinecap="round"/>{crest(157,148,46,59)}
      <path d="M159 49h42" stroke="white" strokeOpacity=".2"/>
    </> : <>
      {type==='hoodie' && <path d="M130 83c-9-73 109-73 100 0l-24 29h-51z" fill={color} stroke="#142747" strokeOpacity=".2"/>}
      <path d={type==='hoodie'?'M130 76l-38 20-41 135 35 11 38-87-4 115h120l-4-115 38 87 35-11-41-135-38-20-28 16h-44z':'M135 75l-42 17-49 69 44 28 33-39-3 121h124l-3-121 33 39 44-28-49-69-42-17c-14 22-76 22-90 0z'} fill={color} stroke="#142747" strokeOpacity=".2" strokeLinejoin="round"/>
      <path d="M124 258h112M91 100l33 34m145-34-33 34" fill="none" stroke={trim} strokeOpacity=".14"/>
      {type==='polo' ? <><path d="M137 75l43 15-19 31-24-29zm86 0-43 15 19 31 24-29z" fill={color} stroke={trim} strokeOpacity=".3"/><path d="M180 93v51" stroke={trim} strokeOpacity=".5"/><circle cx="184" cy="111" r="1.8" fill={trim}/><circle cx="184" cy="126" r="1.8" fill={trim}/></> : <path d="M137 77c12 26 73 26 86 0" fill="none" stroke={trim} strokeWidth="5" strokeOpacity=".16"/>}
      {type==='hoodie' ? <><path d="M151 210h58l13 38h-84z" fill="none" stroke={trim} strokeOpacity=".22"/><path d="M163 99v38m34-38v38" stroke={trim} strokeWidth="2" strokeOpacity=".65"/>{crest(155,144,50,62)}</> : crest(204,124,29,39)}
    </>}
  </svg>;
}
