'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Fund } from '@/lib/data/metrics';
export function Shell({ funds,children }: { funds: Fund[]; children: React.ReactNode }) {
  const pathname = usePathname(), [open,setOpen] = useState(false);
  const nav = (href: string,title: string,icon: string) => <Link href={href} className={`nav-link ${pathname === href || (href.startsWith('/funds/') && pathname.startsWith(href)) ? 'active' : ''}`} onClick={() => setOpen(false)}><span className="nav-icon">{icon}</span>{title}</Link>;
  return <div className="app-shell"><div className="mobile-bar"><Link href="/" className="brand">FM <span>Fund Management</span></Link><button className="secondary" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button></div>{open && <button className="nav-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}<aside className={`sidebar ${open ? 'open' : ''}`}><Link href="/" className="brand"><span className="brand-mark">FM</span><span>Fund<br />Management</span></Link><div className="workspace-label">PORTFOLIO WORKSPACE</div><nav aria-label="Main navigation">{nav('/','Overview','◫')}{nav('/entries','All entries','≡')}<div className="nav-label">YOUR FUNDS <span>{funds.length}</span></div>{funds.map(f => <div key={f.id}>{nav(`/funds/${f.id}`,f.name,f.code.slice(0,2))}</div>)}<Link href="/funds/new" className="nav-link add-fund" onClick={() => setOpen(false)}>＋ Add fund</Link></nav><div className="sidebar-footer"><span className="status-dot" /> Demo workspace<p>Manual entry · Shared access</p></div></aside><main className="main-content">{children}</main></div>;
}
