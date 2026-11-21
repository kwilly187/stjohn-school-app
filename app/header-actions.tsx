'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
export default function HeaderActions(){const path=usePathname();return <nav className="header-actions" aria-label="Messages and notifications">
 <Link href="/messages" aria-current={path==='/messages'?'page':undefined}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></svg><span>Messages</span></Link>
 <Link href="/notifications" aria-current={path==='/notifications'?'page':undefined}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg><span>Notifications</span></Link>
 </nav>}
