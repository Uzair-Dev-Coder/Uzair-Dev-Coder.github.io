'use strict';
/* Is settings block se dukaan ka naam, WhatsApp number aur cart ki pabandiyan badlein. */
const CONFIG = {
  businessName: 'Pizza Mars',
  branch: 'Shah Faisal Colony, 2 Number',
  whatsappLocal: '0320-3123111',
  countryCode: '92',
  currency: 'Rs.',
  // SEO: Google ko batata hai ke price kis currency mein hai (Pakistani rupee = PKR). Aam taur par badalne ki zaroorat nahi.
  schemaCurrency: 'PKR',
  maxQty: 20,
  storageKey: 'pizzamars.cart.v1'
};
/* Yahan pizza ke sizes aur baqi menu items ke naam aur qeemat badlein. */
const MENU = {
  pizzas: {
    sizes: [{ id: 's', label: 'Small', price: 600 }, { id: 'r', label: 'Regular', price: 1200 }, { id: 'l', label: 'Large', price: 1800 }, { id: 'j', label: 'Jumbo', price: 2400 }],
    items: ['Atomic Tikka', 'Creamikka', 'Lunar Fajita', 'Spicy Bite', 'Malai Mystery', 'Mars Signature', 'Supreme Galaxy', 'Mission Mars'],
    // Asli pizza photo lagane ke liye: photos mein pizza ka naam (chhote harf, '-' ke saath) aur photo ka rasta likhein, jaise 'mars-signature': 'assets/mars-signature.jpg'. Photo na ho to drawing dikhti hai.
    photos: {}
  },
  categories: [
    { title: 'Appetizers', items: [{ name: 'Garlic Bread, 4 pcs', price: 199 }, { name: 'Cheesy Garlic Bread, 4 pcs', price: 249 }, { name: 'Cheese Sticks, 4 pcs', price: 499 }, { name: 'Chicken Wings, 6 pcs', price: 499 }] },
    { title: 'Sandwiches', items: [{ name: 'Philly Steak Sandwich', price: 699 }] },
    { title: 'Pastas', items: [{ name: 'Chicken Pasta', price: 699 }, { name: 'Mini Pasta', price: 349 }, { name: 'Chicken Lasagna', price: 699 }, { name: 'Mini Lasagna', price: 349 }] },
    { title: 'Fries', items: [{ name: 'Plain Fries', price: 249 }, { name: 'Pizza Fries', price: 599 }] },
    { title: 'Beverages', items: [{ name: 'Soft drink, 345 ml', price: 90 }, { name: 'Soft drink, 500 ml', price: 120 }, { name: 'Soft drink, 1 liter', price: 180 }, { name: 'Soft drink, 1.5 liters', price: 230 }, { name: 'Water, small', price: 60 }, { name: 'Water, large', price: 120 }] }
  ]
};

/* Chhoti helper cheezein: element dhoondhna, HTML safe karna aur price/WhatsApp link banana. */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const money = (n) => `${CONFIG.currency} ${n.toLocaleString('en-US')}`;
const waNumber = CONFIG.countryCode + CONFIG.whatsappLocal.replace(/\D/g, '').replace(/^0+/, '');
const waLink = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

/* Menu ke har item ka naam aur qeemat dhoondhne ke liye catalog tayyar hota hai. */
const catalog = new Map();
MENU.pizzas.items.forEach((n) => MENU.pizzas.sizes.forEach((s) => catalog.set(`${slug(n)}:${s.id}`, { name: `${n} (${s.label})`, price: s.price })));
MENU.categories.forEach((c) => c.items.forEach((i) => catalog.set(slug(i.name), { name: i.name, price: i.price })));

/* Cart, customer details, storage ki halat aur checkout ka current step yahan rakha jata hai. */
let cart = [];
let details = { name: '', phone: '', address: '', notes: '' };
let storageOk = true;
let step = 1;

/* Pichli visit ka cart aur details browser storage se wapas load karta hai. */
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(CONFIG.storageKey) || 'null');
    if (!d) return;
    cart = (d.cart || []).map((l) => ({ key: l.key, qty: Math.min(l.qty | 0, CONFIG.maxQty) })).filter((l) => l.qty > 0 && catalog.has(l.key));
    Object.assign(details, d.details || {});
  } catch (e) { storageOk = false; }
}
/* Cart aur details ko browser mein save karta hai taa-ke refresh par na mitain. */
function save() {
  try { localStorage.setItem(CONFIG.storageKey, JSON.stringify({ cart, details })); } catch (e) { storageOk = false; }
  $('#cart-msg').textContent = storageOk ? '' : 'Your browser is not saving the cart, so it will reset if you refresh this page.';
}

/* Cart mein item dhoondhne aur quantity/total nikalne wale helpers. */
const find = (k) => cart.find((l) => l.key === k);
const count = () => cart.reduce((s, l) => s + l.qty, 0);
const total = () => cart.reduce((s, l) => s + l.qty * catalog.get(l.key).price, 0);
const lineText = (l, i) => { const c = catalog.get(l.key); return `${i + 1}. ${c.name} x${l.qty} - ${money(c.price)} each = ${money(c.price * l.qty)}`; };

let tt;
/* Screen par chhota message dikhata hai, phir kuch dair baad chupata hai. */
function toast(m) {
  const t = $('#toast'); t.textContent = m; t.classList.add('on');
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200);
}
/* Item cart mein dalta hai, quantity limit check karta hai aur cart refresh karta hai. */
function add(key) {
  const l = find(key);
  if (l && l.qty >= CONFIG.maxQty) return toast(`Maximum ${CONFIG.maxQty} per item`);
  l ? l.qty++ : cart.push({ key, qty: 1 });
  update(); toast(`Added ${catalog.get(key).name}`);
  const b = $('#cart-count'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
/* Cart item ki quantity badalta ya item ko poori tarah hata deta hai. */
function setQty(key, q) {
  if (q < 1) cart = cart.filter((l) => l.key !== key); else find(key).qty = Math.min(q, CONFIG.maxQty);
  update();
}

/* WhatsApp ke liye chhota message banata hai, khaali cart ho to sawal bhejta hai. */
function quickMessage() {
  if (!cart.length) return `Hello ${CONFIG.businessName}! I would like to ask about placing an order.`;
  return `Hello ${CONFIG.businessName}! I would like to order:\n${cart.map(lineText).join('\n')}\nSubtotal: ${money(total())}`;
}
/* Checkout ki tamam details aur cart ko WhatsApp order message mein jama karta hai. */
function fullMessage() {
  const d = details;
  return [`*New order for ${CONFIG.businessName}*`, `Branch: ${CONFIG.branch}`, '',
    '*Customer*', `Name: ${d.name.trim()}`, `Phone: ${d.phone.trim()}`, `Delivery address: ${d.address.trim()}`, '',
    '*Order*', ...cart.map(lineText), `*Subtotal: ${money(total())}*`,
    'Delivery charges are applicable and are not included in this subtotal.',
    ...(d.notes.trim() ? ['', `*Notes:* ${d.notes.trim()}`] : []), '', 'Please confirm my order and the delivery charge. Thank you!'].join('\n');
}

/* Menu data se pizza cards aur category lists bana kar page par dikhata hai. */
function renderMenu() {
  const root = $('#menu-root');
  try {
    const tilt = [-8, 6, -3, 10, 5, -9, 4, -6];
    const pz = MENU.pizzas.items.map((n, i) => {
      const id = slug(n);
      // Agar is pizza ki photo di gayi hai to photo dikhao, warna pizza ki drawing.
      const pic = MENU.pizzas.photos[id] ? `<img src="${esc(MENU.pizzas.photos[id])}" alt="${esc(n)} pizza" width="400" height="400" loading="lazy">` : '<svg viewBox="0 0 200 200" aria-hidden="true"><use href="#pz"/></svg>';
      return `<article class="card" style="--r:${tilt[i % 8]}deg"><div class="plate">${pic}</div><h4>${esc(n)}</h4>` +
        `<fieldset class="sz"><legend class="sr">Choose a size for ${esc(n)}</legend>${MENU.pizzas.sizes.map((s) => `<label><input type="radio" name="sz-${id}" value="${s.id}"${s.id === 'r' ? ' checked' : ''}><span>${esc(s.label)}<b>${money(s.price)}</b></span></label>`).join('')}</fieldset>` +
        `<button class="btn add-cart" type="button" data-addpz="${id}">Add to cart</button></article>`;
    }).join('');
    const cats = MENU.categories.map((c) => `<div class="box"><h3>${esc(c.title)}</h3><ul class="list">${c.items.map((i) => `<li><span>${esc(i.name)}</span><b>${money(i.price)}</b><button class="add" type="button" data-add="${slug(i.name)}" aria-label="Add ${esc(i.name)} to cart">+</button></li>`).join('')}</ul></div>`).join('');
    root.innerHTML = `<h3 class="sub">Pizzas</h3><div class="grid pz">${pz}</div><div class="menus">${cats}</div>`;
  } catch (e) {
    root.innerHTML = `<p class="state" role="alert">The menu could not load. Please refresh, or call <a href="tel:+${waNumber}">${esc(CONFIG.whatsappLocal)}</a> to order.</p>`;
  }
}

/* SEO: menu ka structured data (JSON-LD) MENU se banata hai taake Google aur AI search ko har cheez ka naam aur price saaf milein. Menu badalne par ye khud theek ho jata hai. */
function menuSchema() {
  const offer = (name, price) => (name ? { '@type': 'Offer', name, price: String(price), priceCurrency: CONFIG.schemaCurrency } : { '@type': 'Offer', price: String(price), priceCurrency: CONFIG.schemaCurrency });
  const pizzas = { '@type': 'MenuSection', name: 'Pizzas', hasMenuItem: MENU.pizzas.items.map((n) => ({ '@type': 'MenuItem', name: n, offers: MENU.pizzas.sizes.map((s) => offer(s.label, s.price)) })) };
  const others = MENU.categories.map((c) => ({ '@type': 'MenuSection', name: c.title, hasMenuItem: c.items.map((i) => ({ '@type': 'MenuItem', name: i.name, offers: offer('', i.price) })) }));
  return { '@type': 'Menu', name: `${CONFIG.businessName} menu`, hasMenuSection: [pizzas, ...others] };
}
/* SEO: page mein maujood JSON-LD (id seo-schema) mein menu aur WhatsApp ka link taza karta hai. Koi ghalti ho to chupchap chhod deta hai, website par asar nahi. */
function syncSchema() {
  try {
    const el = $('#seo-schema'), d = JSON.parse(el.textContent);
    d.hasMenu = menuSchema();
    d.potentialAction.target.urlTemplate = `https://wa.me/${waNumber}`;
    el.textContent = JSON.stringify(d);
  } catch (e) { /* schema update na ho paye to bhi page theek chalta hai */ }
}

/* Cart ke items, quantity buttons aur subtotal ko dialog mein dikhata hai. */
function renderCart() {
  const box = $('#cart-items'), foot = $('#cart-foot');
  if (!cart.length) {
    box.innerHTML = '<div class="state"><p>Your cart is empty.</p><button class="btn" type="button" id="browse">Browse the menu</button></div>';
    foot.innerHTML = ''; return;
  }
  box.innerHTML = `<ul class="lines">${cart.map((l) => { const c = catalog.get(l.key), n = esc(c.name); return `<li><div class="ln"><b>${n}</b><span>${money(c.price)} each</span></div><div class="lt">${money(c.price * l.qty)}</div>` +
    `<div class="qty"><button type="button" data-dec="${l.key}" aria-label="Decrease quantity of ${n}">&minus;</button><output aria-label="Quantity of ${n}">${l.qty}</output><button type="button" data-inc="${l.key}" aria-label="Increase quantity of ${n}">+</button></div>` +
    `<button class="rm" type="button" data-rm="${l.key}" aria-label="Remove ${n} from cart">Remove</button></li>`; }).join('')}</ul>`;
  foot.innerHTML = `<p class="sumline"><span>Subtotal</span><b>${money(total())}</b></p><p class="fine">Delivery charges are applicable and are not included in the subtotal.</p>` +
    '<div class="acts"><button class="btn alt" type="button" id="clear">Clear cart</button><button class="btn" type="button" id="to-details">Continue to details</button></div>';
}

/* Cart badalne ke baad save, display, badge aur WhatsApp links ko update karta hai. */
function update() {
  save(); renderCart();
  const n = count();
  $('#cart-count').textContent = n;
  $('#cart-open').setAttribute('aria-label', `Open cart, ${n} ${n === 1 ? 'item' : 'items'}`);
  const href = waLink(quickMessage());
  document.querySelectorAll('[data-wa]').forEach((a) => { a.href = href; });
  if (!cart.length && step > 1) go(1);
}

/* Checkout ke teen steps ke naam aur dikhane/chhupane ka tareeqa. */
const titles = ['Review your cart', 'Your details', 'Confirm and send'];
/* Checkout ko aglay ya pichlay step par le jata hai. */
function go(n) {
  step = n;
  document.querySelectorAll('.step').forEach((s) => { s.hidden = +s.dataset.step !== n; });
  const h = $('#stepno'); h.textContent = `Step ${n} of 3: ${titles[n - 1]}`; h.focus();
  if (n === 3) renderReview();
}

/* Customer ke naam, phone aur address ke liye sahi format ke qawaid. */
const rules = {
  name: (v) => v.trim().length >= 2 || 'Enter your name.',
  phone: (v) => /^\+?\d{10,13}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a phone number with 10 to 13 digits.',
  address: (v) => v.trim().length >= 10 || 'Enter your full delivery address so the order can reach you.'
};
/* Form check karta hai, ghalti batata hai aur pehle ghalat field par focus karta hai. */
function validate() {
  let first = null;
  Object.keys(rules).forEach((k) => {
    const el = $(`#f-${k}`), r = rules[k](el.value), bad = r !== true;
    $(`#e-${k}`).textContent = bad ? r : '';
    el.setAttribute('aria-invalid', bad);
    if (bad && !first) first = el;
  });
  if (first) first.focus();
  return !first;
}
/* Form ki nayi values customer details mein rakhta aur save karta hai. */
function readForm() { ['name', 'phone', 'address', 'notes'].forEach((k) => { details[k] = $(`#f-${k}`).value; }); save(); }

/* Aakhri step par customer aur order ki tasdeeq dikhata hai. */
function renderReview() {
  const d = details;
  $('#review').innerHTML = `<h3>Items</h3><ul class="lines">${cart.map((l) => { const c = catalog.get(l.key); return `<li><div class="ln"><b>${esc(c.name)}</b><span>${l.qty} x ${money(c.price)}</span></div><div class="lt">${money(c.price * l.qty)}</div></li>`; }).join('')}</ul>` +
    `<p class="sumline"><span>Subtotal</span><b>${money(total())}</b></p><p class="fine">Delivery charges are applicable and are not included in the subtotal.</p><h3>Your details</h3>` +
    `<dl class="rv"><dt>Name</dt><dd>${esc(d.name.trim())}</dd><dt>Phone</dt><dd>${esc(d.phone.trim())}</dd><dt>Address</dt><dd>${esc(d.address.trim())}</dd>${d.notes.trim() ? `<dt>Notes</dt><dd>${esc(d.notes.trim())}</dd>` : ''}</dl>`;
  $('#place').href = waLink(fullMessage());
  $('#place-note').textContent = '';
}

/* Cart dialog ka element rakhta hai taa-ke open aur close kiya ja sake. */
const dlg = $('#cart');
/* Cart kholta aur checkout ko pehle step se shuru karta hai. */
function openCart() {
  go(1);
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  document.documentElement.classList.add('lock');
}
/* Cart band karke page ki scrolling dobara chalu karta hai. */
function closeCart() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); document.documentElement.classList.remove('lock'); }
/* Dialog band ho to page par scrolling lock hatata hai. */
dlg.addEventListener('close', () => document.documentElement.classList.remove('lock'));
/* Dialog ke bahar click karne par cart band karta hai. */
dlg.addEventListener('click', (e) => { if (e.target === dlg) closeCart(); });

/* Page ke buttons ko aik hi click listener se chalata hai: add, remove, checkout ya copy. */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button, a');
  if (!t) return;
  const d = t.dataset;
  if (d.add) add(d.add);
  else if (d.addpz) { const r = document.querySelector(`input[name="sz-${d.addpz}"]:checked`); add(`${d.addpz}:${r ? r.value : 'r'}`); }
  else if (d.inc) setQty(d.inc, find(d.inc).qty + 1);
  else if (d.dec) setQty(d.dec, find(d.dec).qty - 1);
  else if (d.rm) setQty(d.rm, 0);
  else if (d.go) go(+d.go);
  else if (t.id === 'cart-open') openCart();
  else if (t.id === 'cart-close') closeCart();
  else if (t.id === 'clear') { cart = []; update(); }
  else if (t.id === 'to-details') go(2);
  else if (t.id === 'browse') { closeCart(); location.hash = '#menu'; }
  else if (t.id === 'place') $('#place-note').textContent = `WhatsApp should now be open with your order message. Your order is not sent until you tap Send in WhatsApp. If WhatsApp did not open, copy the message below or call ${CONFIG.whatsappLocal}.`;
  else if (t.id === 'copy') {
    const box = $('#msgbox'); box.value = fullMessage();
    (navigator.clipboard ? navigator.clipboard.writeText(box.value) : Promise.reject()).then(() => { $('#place-note').textContent = 'Order message copied. Paste it into a WhatsApp chat and tap Send.'; })
      .catch(() => { box.hidden = false; box.select(); $('#place-note').textContent = 'Copy did not work here. Select the text below and copy it manually.'; });
  }
});
/* Order review submit hone par details check karke tasdeeq wala step kholta hai. */
$('#details').addEventListener('submit', (e) => { e.preventDefault(); if (validate()) { readForm(); go(3); } });
/* User input theek kare to us field ki purani error foran hata deta hai. */
$('#details').addEventListener('input', (e) => { const k = e.target.name; if (rules[k]) { $(`#e-${k}`).textContent = ''; e.target.removeAttribute('aria-invalid'); } });

/* Page shuru hote hi saved cart load, menu render aur cart display update karta hai. */
load(); renderMenu(); syncSchema();
['name', 'phone', 'address', 'notes'].forEach((k) => { $(`#f-${k}`).value = details[k] || ''; });
update();

/* URL mein setup likha ho to WhatsApp number check karne ka test link dikhata hai. */
if (new URLSearchParams(location.search).has('setup')) {
  const b = document.createElement('div'); b.className = 'setup';
  b.innerHTML = `Setup check: orders go to +${waNumber}. <a href="${waLink('Setup test from the Pizza Mars website')}" target="_blank" rel="noopener noreferrer">Open a test chat</a> to confirm this number is on WhatsApp.`;
  document.body.prepend(b);
}

// Add self-canonical metadata from the deployed host, never from a hard-coded placeholder.
if (location.protocol === 'http:' || location.protocol === 'https:') {
  const canonicalUrl = `${location.origin}${location.pathname}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = canonicalUrl;
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.append(ogUrl); }
  ogUrl.content = canonicalUrl;
}
