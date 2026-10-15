'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authService, clearAccessToken, getAccessToken } from '@/lib/services';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => setToken(getAccessToken()), []);
  async function login(e: React.FormEvent) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await authService.login(email, password); setToken(getAccessToken()); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not sign in.'); }
    finally { setBusy(false); }
  }
  async function logout() { try { await authService.logout(); } catch {} clearAccessToken(); setToken(''); }
  return <div className="wrap account-page"><span className="eyebrow">A PLACE OF YOUR OWN</span><h1>Your account</h1>
    <div className="profile-grid"><aside className="profile-nav"><b>Account overview</b><Link href="/orders">Order history ↗</Link><Link href="/wishlist">Saved pieces ↗</Link></aside>
    <div className="profile-content"><section><span className="eyebrow">YOUR DETAILS</span><h2>{token ? 'You are signed in' : 'Sign in to your account'}</h2>
      {token ? <><p>Your session is ready for catalog and order requests.</p><button className="button button-dark" onClick={logout}>Sign out</button></> : <form className="form-grid" onSubmit={login}>
        <label>Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {error && <p role="alert">{error}</p>}<div className="form-action"><button className="button button-dark" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></div>
      </form>}
      <p>Profile editing, address book, and customer registration are not available in the connected API yet.</p>
    </section></div></div></div>;
}
