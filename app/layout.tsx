import Link from 'next/link';
import Navigation from './navigation';
import HeaderActions from './header-actions';
import StudentMenu from './student-menu';
import './style.css';
import {school,platform} from './school-data.mjs';
export const metadata = {title:{default:`${school.appName} | ${school.name}`,template:`%s | ${school.appName}`},description:`School calendars, parent resources and everyday essentials for ${school.name} families.`};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body style={school.theme as React.CSSProperties}><a className="skip-link" href="#main">Skip to main content</a><div className="app"><header className="topbar"><Link className="brand" href="/" aria-label={`${school.appName} — Home`}><img src={school.logo} alt="" width="52" height="52"/><span>{school.brandName}<strong>{school.appName}</strong></span></Link><HeaderActions/><StudentMenu/></header><main id="main">{children}</main><footer className="footer">{school.name} <span>·</span> {school.location}<a className="powered-by" href={platform.url}>Powered by {platform.name}</a></footer><Navigation/></div></body></html>}
