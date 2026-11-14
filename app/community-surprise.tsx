'use client';
import {useRef} from 'react';
import styles from './community-surprise.module.css';
export default function CommunitySurprise({className}:{className:string}){
 const taps=useRef(0);const lastTap=useRef(0);const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 const reveal=()=>{const now=Date.now();taps.current=now-lastTap.current>4000?1:taps.current+1;lastTap.current=now;if(taps.current===3){taps.current=0;dialog.current?.showModal();}};
 return <><button ref={trigger} className={`${className} ${styles.trigger}`} type="button" aria-label="Saints Community crest" onClick={reveal}><img src="/stjohn-logo.png" alt="" width="80" height="80"/></button><dialog ref={dialog} className={styles.dialog} aria-labelledby="jamie-surprise" onClose={()=>trigger.current?.focus()}><img src="/stjohn-logo.png" alt="" width="76" height="76"/><h2 id="jamie-surprise">Fuck off</h2><div className={styles.confetti} aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,animationDelay:`${(i%6)*.08}s`,background:i%2?'#edbc0d':'#2a3695'}}/>)}</div><form method="dialog"><button className="button">Close</button></form></dialog></>;
}
