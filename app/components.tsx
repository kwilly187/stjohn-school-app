import Link from 'next/link';
import {resources, school, sourceChecked} from './school-data.mjs';
export type IconName = 'home'|'calendar'|'updates'|'resources'|'book'|'lunch'|'wallet'|'clock'|'people'|'file'|'shirt'|'heart';
export function Icon({name}:{name:string}) {
 const paths: Record<string, React.ReactNode> = {
 home:<><path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 5h3m4 0h3"/></>,
 updates:<><path d="M5 3h14v18l-7-4-7 4Z"/><path d="M8 7h8m-8 4h6"/></>,
 resources:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 book:<><path d="M12 5v16M3 3l9 2 9-2v16l-9 2-9-2Z"/></>,
 lunch:<><path d="M5 3v7m-3-7v4a3 3 0 0 0 6 0V3M5 10v11m13-10h-4V7a4 4 0 0 1 4-4v18"/></>,
 wallet:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18m-6 5h3M6 5V3h12"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 people:<><circle cx="8" cy="7" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m1 3a5 5 0 0 1 5 5v2"/></>,
 file:<><path d="M5 3h9l5 5v13H5Zm9 0v6h5M8 13h8m-8 4h6"/></>,
 shirt:<path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4a4 4 0 0 1-8 0Z"/>,
 heart:<path d="M12 21 3 12C-3 4 8-2 12 6c4-8 15-2 9 6Z"/>,
 };
 return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.resources}</svg>;
}
export function ExternalLink({href,children,className=''}:{href:string,children:React.ReactNode,className?:string}) {return <a href={href} className={className}>{children}<span aria-hidden="true" className="external-arrow">↗</span></a>}
export function Heading({eyebrow,title,children}:{eyebrow:string,title:string,children:React.ReactNode}) {return <header className="page-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{children}</p></header>}
export function ResourceCard({resource,compact=false}:{resource:typeof resources[number],compact?:boolean}) {return <ExternalLink href={resource.url} className={`resource-card ${compact?'compact':''}`}><span className="icon-tile"><Icon name={resource.icon}/></span><span><strong>{resource.title}</strong><span className="resource-detail">{resource.detail}</span></span></ExternalLink>}
export function HelpCard(){return <aside className="help-card"><div><span className="eyebrow">A REAL PERSON CAN HELP</span><h2>Not sure where to go?</h2><p>Start with the school office.</p></div><div className="help-actions"><a className="button" href={school.phone}>Call 352-622-7275</a><ExternalLink href={school.contact} className="text-link">Contact details</ExternalLink></div></aside>}
export function SourceNote(){return <p className="source-note">Resource links checked {sourceChecked} against the <a href={school.parents}>school’s parent page</a>. This preview does not receive private school messages or track account balances.</p>}
export function NextDates(){return <section className="card dates-card"><div className="section-top"><span className="icon-tile"><Icon name="calendar"/></span><span className="eyebrow">PLAN AHEAD</span></div><h2>What’s coming up?</h2><p>School dates, activities and athletics, straight from the school’s calendars.</p><Link href="/calendar" className="button">See upcoming dates <span aria-hidden="true">→</span></Link><p className="fine-print">Check official notices for closures, early dismissal and schedule changes.</p></section>}
