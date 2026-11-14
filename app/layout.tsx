import Link from 'next/link';
import Navigation from './navigation';
import HeaderActions from './header-actions';
import StudentMenu from './student-menu';
import './style.css';
import {school,platform} from './school-data.mjs';
const siteUrl='https://stjohn-school-app-git-codex-parent-fi-342ea3-seagull-management.vercel.app';
export const metadata = {
 metadataBase:new URL(siteUrl),
 title:{default:`${school.appName} | ${school.name}`,template:`%s | ${school.appName}`},
 description:'St. John school calendars, family resources and everyday parent essentials in one place.',
 applicationName:'Saints Parent',
 openGraph:{type:'website',locale:'en_US',siteName:'Saints Parent',title:'Saints Parent',description:'School dates, family resources and everyday essentials for St. John parents.',images:[{url:'/brand/saints-parent-share.png',width:1200,height:630,alt:'Saints Parent — St. John Lutheran School, Ocala'}]},
 twitter:{card:'summary_large_image',title:'Saints Parent',description:'School dates, family resources and everyday essentials for St. John parents.',images:['/brand/saints-parent-share.png']},
 icons:{icon:[{url:'/brand/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/brand/saints-parent-192.png',sizes:'192x192',type:'image/png'}],apple:[{url:'/brand/saints-parent-180.png',sizes:'180x180',type:'image/png'}]},
 appleWebApp:{capable:true,title:'Saints Parent',statusBarStyle:'default'},
 manifest:'/manifest.webmanifest'
};
export const viewport={themeColor:'#2a3695'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body style={school.theme as React.CSSProperties}><a className="skip-link" href="#main">Skip to main content</a><div className="app"><aside className="school-identity" aria-label={school.name}><Link href="/" aria-label={`${school.appName} home`}><img src={school.logo} alt="" width="86" height="86"/><span>{school.brandName}</span><strong>{school.appName}</strong></Link><p>{school.location}</p></aside><header className="topbar"><Link className="brand" href="/" aria-label={`${school.appName} — Home`}><img src={school.logo} alt="" width="52" height="52"/><span>{school.brandName}<strong>{school.appName}</strong></span></Link><HeaderActions/><StudentMenu/></header><main id="main">{children}</main><footer className="footer">{school.name} <span>·</span> {school.location}<a className="powered-by" href={platform.url}>Powered by {platform.name}</a></footer><Navigation/></div></body></html>}
