import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from './supabaseClient';
import './styles.css';

// Convert a Supabase row into the shape the UI already expects
const mapRow = (row) => ({
  number: row.number,
  table: row.table_number,
  items: row.items,
  note: row.note,
  total: row.total,
  tax: row.tax,
  date: row.order_date,
  status: row.status
});

const menu = [
  { id: 'burrata', category: 'Vorspeisen', name: 'Burrata & Tomaten', description: 'Basilikum, geröstete Pinienkerne, Focaccia', price: 12.9, emoji: '🍅', tag: 'Vegetarisch' },
  { id: 'suppe', category: 'Vorspeisen', name: 'Kürbis-Ingwer-Suppe', description: 'Kokosmilch, Chiliöl, Sauerteig-Croutons', price: 7.5, emoji: '🥣', tag: 'Vegan' },
  { id: 'ravioli', category: 'Hauptgerichte', name: 'Trüffel-Ravioli', description: 'Ricotta, Salbeibutter, Parmesan', price: 18.9, emoji: '🍝', tag: 'Hausfavorit' },
  { id: 'lachs', category: 'Hauptgerichte', name: 'Gebratener Lachs', description: 'Kartoffelstampf, grünes Gemüse, Zitronenbutter', price: 23.5, emoji: '🐟', tag: 'Glutenfrei' },
  { id: 'risotto', category: 'Hauptgerichte', name: 'Pilzrisotto', description: 'Waldpilze, Pecorino, Kräuter', price: 17.5, emoji: '🍄', tag: 'Vegetarisch' },
  { id: 'burger', category: 'Hauptgerichte', name: 'Tischglück Burger', description: 'Hähnchen, Cheddar, karamellisierte Zwiebeln, Pommes', price: 19.5, emoji: '🍔', tag: null },
  { id: 'tiramisu', category: 'Dessert', name: 'Tiramisu', description: 'Mascarpone, Espresso, Kakao', price: 8.5, emoji: '🍰', tag: 'Klassiker' },
  { id: 'panna', category: 'Dessert', name: 'Panna Cotta', description: 'Vanille, Beerenkompott, Mandelkrokant', price: 7.9, emoji: '🍓', tag: 'Vegetarisch' },
  { id: 'wasser', category: 'Getränke', name: 'Tafelwasser', description: 'Still oder sprudelnd · 0,75 l', price: 5.9, emoji: '💧', tag: null },
  { id: 'spritz', category: 'Getränke', name: 'Aperol Spritz', description: 'Aperol, Prosecco, Soda, Orange', price: 8.9, emoji: '🍹', tag: null },
  { id: 'riesling', category: 'Getränke', name: 'Riesling trocken', description: 'Weingut Müller · 0,2 l', price: 7.5, emoji: '🍷', tag: null }
];
const english = { 'Tisch':'Table', 'WILLKOMMEN BEI TISCHGLÜCK':'WELCOME TO TISCHGLÜCK', 'Genuss, ganz':'Good food,', 'entspannt.':'made easy.', 'Bestellen Sie direkt vom Tisch. Wir bringen Ihren Lieblingsmoment zu Ihnen.':'Order directly from your table. We will bring your favourite moment to you.', 'seit 2018':'since 2018', 'Alle':'All', 'Vorspeisen':'Starters', 'Hauptgerichte':'Main courses', 'Getränke':'Drinks', 'UNSERE KÜCHE':'OUR KITCHEN', 'Für Sie ausgewählt':'Selected for you', 'Gerichte':'dishes', 'Vegetarisch':'Vegetarian', 'Hausfavorit':'House favourite', 'Glutenfrei':'Gluten-free', 'Klassiker':'Classic', 'Burrata & Tomaten':'Burrata & Tomatoes', 'Kürbis-Ingwer-Suppe':'Pumpkin & Ginger Soup', 'Trüffel-Ravioli':'Truffle Ravioli', 'Gebratener Lachs':'Pan-fried Salmon', 'Pilzrisotto':'Wild Mushroom Risotto', 'Riesling trocken':'Dry Riesling', 'Tafelwasser':'Table Water', 'Basilikum, geröstete Pinienkerne, Focaccia':'Basil, toasted pine nuts, focaccia', 'Kokosmilch, Chiliöl, Sauerteig-Croutons':'Coconut milk, chilli oil, sourdough croutons', 'Ricotta, Salbeibutter, Parmesan':'Ricotta, sage butter, Parmesan', 'Kartoffelstampf, grünes Gemüse, Zitronenbutter':'Mashed potatoes, green vegetables, lemon butter', 'Waldpilze, Pecorino, Kräuter':'Wild mushrooms, Pecorino, herbs', 'Hähnchen, Cheddar, karamellisierte Zwiebeln, Pommes':'Chicken, Cheddar, caramelised onions, fries', 'Vanille, Beerenkompott, Mandelkrokant':'Vanilla, berry compote, almond brittle', 'Still oder sprudelnd · 0,75 l':'Still or sparkling · 0.75 l', 'Weingut Müller · 0,2 l':'Müller winery · 0.2 l', 'Bestellung':'Order', '← Zur Speisekarte':'← Back to menu', 'IHRE AUSWAHL':'YOUR SELECTION', 'Ihre Bestellung':'Your order', 'pro Portion':'each', 'Anmerkung für die Küche':'Note for the kitchen', 'z. B. ohne Zwiebeln, Allergien …':'e.g. no onions, allergies …', 'Zwischensumme':'Subtotal', 'inkl. 19 % MwSt.':'incl. 19% VAT', 'Gesamt':'Total', 'Weiter zur Bestellung':'Continue to order', 'Noch nichts ausgewählt':'Nothing selected yet', 'Ihre Lieblingsgerichte warten auf Sie.':'Your favourite dishes are waiting for you.', 'Speisekarte ansehen':'View menu', '← Zurück':'← Back', 'FAST GESCHAFFT':'ALMOST THERE', 'Bestellung prüfen':'Review your order', 'Lieferung an':'Deliver to', 'Geschätzte Wartezeit':'Estimated wait', '15–20 Minuten':'15–20 minutes', 'Verbindlich bestellen':'Place order', 'Mit der Bestellung stimmen Sie unserem digitalen Beleg zu.':'By ordering, you agree to receive a digital receipt.', 'BESTELLUNG EINGEGANGEN':'ORDER RECEIVED', 'Guten Appetit!':'Enjoy your meal!', 'Rechnung ansehen':'View invoice', 'Weiter bestellen':'Order more', 'Ihr QR-Code':'Your QR code', 'Scannen Sie diesen Code, um die Bestellung für diesen Tisch zu öffnen.':'Scan this code to open ordering for this table.', 'RECHNUNG':'INVOICE', 'Rechnung für Tisch':'Invoice for table', 'Position':'Item', 'Menge':'Qty', 'Preis':'Price', 'Vielen Dank für Ihren Besuch!':'Thank you for visiting!', 'Wir freuen uns auf ein Wiedersehen.':'We look forward to seeing you again.', 'Rechnung drucken / als PDF sichern':'Print / save invoice as PDF', 'Dessert':'Desserts' };
const money = (value) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
const tableFromUrl = () => Math.max(1, Math.min(20, Number(new URLSearchParams(window.location.search).get('tisch')) || 7));

function App() {
  const [table, setTable] = useState(tableFromUrl);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('tischglueck-cart') || '[]'));
  const [active, setActive] = useState('Alle');
  const [view, setView] = useState('menu');
  const [order, setOrder] = useState(() => JSON.parse(localStorage.getItem('tischglueck-order') || 'null'));
  const [orders, setOrders] = useState([]);
  const [note, setNote] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('tischglueck-language') || 'de');
  useEffect(() => localStorage.setItem('tischglueck-cart', JSON.stringify(cart)), [cart]);
  // Load all orders from Supabase, and keep them live-updated across every device
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) { console.error('Fehler beim Laden der Bestellungen:', error); return; }
      setOrders(data.map(mapRow));
    };
    fetchOrders();
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);
  useEffect(() => {
    localStorage.setItem('tischglueck-language', language); document.documentElement.lang = language;
    const replacements = language === 'en' ? english : Object.fromEntries(Object.entries(english).map(([de,en]) => [en,de]));
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT); const nodes=[]; let node;
    while ((node=walker.nextNode())) nodes.push(node);
    nodes.forEach(n => { const value=n.nodeValue.trim(), translated=replacements[value]; if (translated) n.nodeValue=n.nodeValue.replace(value,translated); });
  });
  const categories = ['Alle', ...new Set(menu.map(x => x.category))];
  const filtered = active === 'Alle' ? menu : menu.filter(x => x.category === active);
  const subtotal = cart.reduce((sum, row) => sum + row.price * row.qty, 0);
  const tax = subtotal * 0.19;
  const add = (item) => setCart(old => old.some(x => x.id === item.id) ? old.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...old, { ...item, qty: 1 }]);
  const change = (id, amount) => setCart(old => old.map(x => x.id === id ? { ...x, qty: x.qty + amount } : x).filter(x => x.qty > 0));
  const orderNow = async () => {
    const created = { number: `TG-${String(Date.now()).slice(-6)}`, table, items: cart, total: subtotal, tax, note, date: new Date().toLocaleString('de-DE'), status: 'Neu' };
    setOrder(created); localStorage.setItem('tischglueck-order', JSON.stringify(created)); setCart([]); setView('confirmation');
    const { error } = await supabase.from('orders').insert([{
      number: created.number,
      table_number: created.table,
      items: created.items,
      total: created.total,
      tax: created.tax,
      note: created.note,
      order_date: created.date,
      status: created.status
    }]);
    if (error) console.error('Fehler beim Senden der Bestellung:', error);
  };
  const newOrder = () => { setOrder(null); localStorage.removeItem('tischglueck-order'); setView('menu'); };
  const qrUrl = `${window.location.origin}${window.location.pathname}?tisch=${table}`;
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
  if (isAdmin) return <AdminDashboard orders={orders} setOrders={setOrders} />;
  return <main>
    <header className="topbar"><a className="brand" href="?tisch=7"><span>✦</span> tischglück</a><div className="language-switch" aria-label="Language selector"><button className={language === 'de' ? 'active' : ''} onClick={() => setLanguage('de')}>DE</button><button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button></div><div className="table-pill">Tisch <strong>{table}</strong></div><button className="icon-button" onClick={() => setShowQR(true)} aria-label="QR-Code zeigen">▦</button></header>
    <section className="hero"><div><p className="eyebrow">WILLKOMMEN BEI TISCHGLÜCK</p><h1>Genuss, ganz<br/><em>entspannt.</em></h1><p>Bestellen Sie direkt vom Tisch. Wir bringen Ihren Lieblingsmoment zu Ihnen.</p></div><div className="hero-plate">✦<span>seit 2018</span></div></section>
    {view === 'menu' && <>
      <nav className="category-nav">{categories.map(c => <button key={c} onClick={() => setActive(c)} className={active === c ? 'selected' : ''}>{c}</button>)}</nav>
      <section className="menu-section"><div className="section-heading"><div><p className="eyebrow">UNSERE KÜCHE</p><h2>{active === 'Alle' ? 'Für Sie ausgewählt' : active}</h2></div><span>{filtered.length} Gerichte</span></div><div className="menu-grid">{filtered.map(item => <article className="dish" key={item.id}><div className="dish-art">{item.emoji}</div><div className="dish-copy">{item.tag && <small>{item.tag}</small>}<h3>{item.name}</h3><p>{item.description}</p><div className="dish-bottom"><strong>{money(item.price)}</strong><button onClick={() => add(item)} aria-label={`${item.name} hinzufügen`}>+</button></div></div></article>)}</div></section>
    </>}
    {view === 'cart' && <section className="panel"><button className="back" onClick={() => setView('menu')}>← Zur Speisekarte</button><p className="eyebrow">IHRE AUSWAHL</p><h2>Ihre Bestellung</h2>{cart.length ? <><div className="cart-list">{cart.map(row => <div className="cart-row" key={row.id}><span className="cart-emoji">{row.emoji}</span><div><h3>{row.name}</h3><p>{money(row.price)} pro Portion</p></div><div className="quantity"><button onClick={() => change(row.id,-1)}>−</button><b>{row.qty}</b><button onClick={() => change(row.id,1)}>+</button></div><strong>{money(row.price * row.qty)}</strong></div>)}</div><label className="note">Anmerkung für die Küche<textarea value={note} onChange={e => setNote(e.target.value)} placeholder="z. B. ohne Zwiebeln, Allergien …" /></label><Totals subtotal={subtotal} tax={tax}/><button className="primary wide" onClick={() => setView('checkout')}>Weiter zur Bestellung <span>→</span></button></> : <div className="empty"><div>🍽️</div><h3>Noch nichts ausgewählt</h3><p>Ihre Lieblingsgerichte warten auf Sie.</p><button className="primary" onClick={() => setView('menu')}>Speisekarte ansehen</button></div>}</section>}
    {view === 'checkout' && <section className="panel checkout"><button className="back" onClick={() => setView('cart')}>← Zurück</button><p className="eyebrow">FAST GESCHAFFT</p><h2>Bestellung prüfen</h2><div className="order-card"><div><span>Lieferung an</span><b>Tisch {table}</b></div><div><span>Geschätzte Wartezeit</span><b>15–20 Minuten</b></div></div><div className="checkout-items">{cart.map(x => <p key={x.id}><span>{x.qty} × {x.name}</span><b>{money(x.qty*x.price)}</b></p>)}</div><Totals subtotal={subtotal} tax={tax}/><button className="primary wide" onClick={orderNow}>Verbindlich bestellen <span>→</span></button><p className="fineprint">Mit der Bestellung stimmen Sie unserem digitalen Beleg zu.</p></section>}
    {view === 'confirmation' && order && <section className="confirmation"><div className="success-mark">✓</div><p className="eyebrow">BESTELLUNG EINGEGANGEN</p><h1>Guten Appetit!</h1><p className="lead">Ihre Bestellung für Tisch {order.table} ist in unserer Küche. Wir melden uns, wenn sie serviert wird.</p><div className="order-number">Bestellnummer <strong>{order.number}</strong></div><div className="confirmation-actions"><button className="primary" onClick={() => setView('bill')}>Rechnung ansehen</button><button className="secondary" onClick={newOrder}>Weiter bestellen</button></div></section>}
    {view === 'bill' && order && <Invoice order={order} onBack={() => setView('confirmation')} />}
    {view !== 'confirmation' && view !== 'bill' && <button className="cart-fab" onClick={() => setView('cart')}><span>🛒</span>{cart.length ? <b>{cart.reduce((a,x) => a+x.qty,0)}</b> : null}<div><small>Bestellung</small><strong>{money(subtotal)}</strong></div></button>}
    {showQR && <div className="modal-backdrop" onClick={() => setShowQR(false)}><div className="qr-modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setShowQR(false)}>×</button><p className="eyebrow">TISCH {table}</p><h2>Ihr QR-Code</h2><p>Scannen Sie diesen Code, um die Bestellung für diesen Tisch zu öffnen.</p><div className="qr-wrap"><QRCodeSVG value={qrUrl} size={210} bgColor="#fffaf2" fgColor="#123d38" includeMargin /></div><code>{qrUrl}</code><div className="table-switch"><label>Tisch</label><select value={table} onChange={e => { const next=+e.target.value; setTable(next); history.replaceState(null,'',`?tisch=${next}`)}}>{Array.from({length:20},(_,i)=><option key={i+1}>{i+1}</option>)}</select></div></div></div>}
  <div className="made-by">Made by Bhuvan</div>
  </main>;
}
function AdminDashboard({ orders, setOrders }) {
  const updateStatus = async (number, status) => {
    setOrders(old => old.map(order => order.number === number ? { ...order, status } : order));
    const { error } = await supabase.from('orders').update({ status }).eq('number', number);
    if (error) console.error('Fehler beim Aktualisieren des Status:', error);
  };
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  return <main className="admin-page"><header className="admin-header"><a className="brand" href="?tisch=7"><span>✦</span> tischglück</a><a className="customer-link" href="?tisch=7">Kundenansicht öffnen →</a></header><section className="admin-content"><div className="admin-title"><div><p className="eyebrow">RESTAURANT-ÜBERSICHT</p><h1>Bestellungen</h1><p>Alle eingehenden Bestellungen nach Tisch, in Echtzeit für diese Demo.</p></div><div className="admin-date">Heute<br/><strong>{new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'long', year:'numeric' })}</strong></div></div><div className="admin-stats"><div><span>Neue Bestellungen</span><strong>{orders.filter(x => x.status === 'Neu').length}</strong></div><div><span>In Vorbereitung</span><strong>{orders.filter(x => x.status === 'In Zubereitung').length}</strong></div><div><span>Umsatz heute</span><strong>{money(total)}</strong></div></div>{orders.length ? <div className="order-board">{orders.map(order => <article className="staff-order" key={order.number}><div className="staff-order-top"><div className="table-number"><span>TISCH</span><strong>{order.table}</strong></div><div className="staff-order-meta"><b>{order.number}</b><span>{order.date}</span></div><select className={`status ${order.status.replaceAll(' ','-')}`} value={order.status} onChange={e => updateStatus(order.number, e.target.value)}><option>Neu</option><option>In Zubereitung</option><option>Serviert</option><option>Bezahlt</option></select></div><div className="staff-items">{order.items.map(item => <p key={item.id}><span>{item.qty} × {item.name}</span><b>{money(item.qty * item.price)}</b></p>)}</div>{order.note && <p className="staff-note"><b>Küchenhinweis:</b> {order.note}</p>}<div className="staff-total"><span>Gesamt</span><strong>{money(order.total)}</strong></div></article>)}</div> : <div className="staff-empty"><div>📋</div><h2>Noch keine Bestellungen</h2><p>Sobald ein Gast bestellt, erscheint die Bestellung hier mit Tischnummer und Rechnungssumme.</p></div>}</section><div className="made-by">Made by Bhuvan</div></main>;
}
function Totals({subtotal, tax}) { return <div className="totals"><p><span>Zwischensumme</span><b>{money(subtotal)}</b></p><p><span>inkl. 19 % MwSt.</span><b>{money(tax)}</b></p><p className="total"><span>Gesamt</span><b>{money(subtotal)}</b></p></div> }
function Invoice({order, onBack}) { return <section className="invoice panel"><button className="back no-print" onClick={onBack}>← Zurück</button><div className="invoice-head"><div className="brand"><span>✦</span> tischglück</div><div><b>RECHNUNG</b><p>{order.number}</p></div></div><div className="invoice-meta"><div><b>Tischglück Restaurant</b><p>Gartenstraße 17<br/>80331 München<br/>Deutschland</p></div><div><b>Rechnung für Tisch {order.table}</b><p>{order.date}<br/>Bedienung: Digital</p></div></div><table><thead><tr><th>Position</th><th>Menge</th><th>Preis</th></tr></thead><tbody>{order.items.map(i=><tr key={i.id}><td>{i.name}</td><td>{i.qty}</td><td>{money(i.price*i.qty)}</td></tr>)}</tbody></table><Totals subtotal={order.total} tax={order.tax}/><div className="invoice-footer"><p>Vielen Dank für Ihren Besuch!<br/>Wir freuen uns auf ein Wiedersehen.</p><small>Inhaber: Tischglück GmbH · USt-IdNr. DE123456789</small></div><button className="primary wide no-print" onClick={() => window.print()}>Rechnung drucken / als PDF sichern</button></section> }
createRoot(document.getElementById('root')).render(<App />);
