'use client';
import {useState} from 'react';
import {parentActions} from './actions.mjs';
import styles from './actions.module.css';
export default function ActionFinder(){const [category,setCategory]=useState('All');const actions=parentActions.filter(action=>category==='All'||action.category===category);return <div><div className={styles.filters} role="group" aria-label="Parent action category">{['All','Payments','Registration','Forms','Messages','Get involved'].map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}</div><div className={styles.grid}>{actions.map(action=><article className={styles.card} key={action.id}><span>{action.category}</span><h2>{action.title}</h2><p>{action.detail}</p><a href={action.href}>{action.label}</a></article>)}</div><p className={styles.note}>School services handle payments and submissions. Email links open your email app.</p></div>}
