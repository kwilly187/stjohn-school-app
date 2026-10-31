import Link from 'next/link';
import Navigation from './navigation';
import './style.css';
import {school,platform} from './school-data.mjs';
export const metadata = {title:{default:`${school.appName} | ${school.name}`,template:`%s | ${school.appName}`},description:`School calendars, parent resources and everyday essentials for ${school.name} families.`};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body style={school.theme as React.CSSProperties}><a className="skip-link" href="#main">Skip to main content</a><div className="app"><header className="topbar"><Link className="brand" href="/" aria-label={`${school.appName} — Today`}><img src={school.logo} alt="" width="52" height="52"/><span>{school.brandName}<strong>{school.appName}</strong></span></Link><span className="preview-label">PREVIEW</span></header><main id="main">{children}</main><footer className="footer">{school.name} <span>·</span> {school.location}<br/>Public resources. Your school accounts stay with their providers.<a className="powered-by" href={platform.url}>Powered by {platform.name}</a></footer><Navigation/></div></body></html>}
