'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Icon} from './components';
const tabs = [{href:'/',label:'Home',icon:'home'},{href:'/calendar',label:'Calendar',icon:'calendar'},{href:'/updates',label:'Contacts',icon:'updates'},{href:'/resources',label:'Resources',icon:'resources'}];
export default function Navigation(){const pathname=usePathname();return <nav className="bottom-nav" aria-label="Primary navigation">{tabs.map(tab=><Link key={tab.href} href={tab.href} aria-current={pathname===tab.href||(tab.href==='/resources'&&['/lunch','/athletics','/dress-code'].includes(pathname))||(tab.href==='/updates'&&pathname==='/staff')||(tab.href==='/'&&['/students','/pickup'].includes(pathname))?'page':undefined}><Icon name={tab.icon}/><span>{tab.label}</span></Link>)}</nav>}

