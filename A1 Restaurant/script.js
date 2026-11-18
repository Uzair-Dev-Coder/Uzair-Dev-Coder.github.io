// ============================================================
// A-1 Peshawari website ka JavaScript
// Is file mein: data (menu, branches, offerings), theme toggle, branch switcher,
// menu search, banners aur detail pages ka logic hai.
// ============================================================

// ---------- 1. DATA ----------
// Menu ka data ek jagah rakha hai. Har item: [naam, chhoti description, poori description].
// Kyun: owner ko menu badalna ho to sirf yahan badalna pade, baqi page khud update ho jata hai.
const MENU_CATEGORIES=[
 ["🔥 Signature Specialties & BBQ",[
  ["Peshawari Beef Chapli Kabab","Pure authentic spices, tomatoes and juicy beef mince, served with Afghani naan and green chutney.","Our signature dish is a hand-shaped patty of freshly ground beef mince blended with tomatoes, coriander seed, pomegranate seed and fiery green chilies, then pan-fried on a hot plate until the edges turn crisp. It is served with warm Afghani naan and a cooling green chutney, and is available as a full order, a half order or a single piece."],
  ["Special Chicken Chapli Kabab","Mild spices, cooked fresh on the hot plate. A great choice for guests who do not eat beef.","A lighter take on the classic, made with seasoned chicken mince and a gentler blend of traditional spices. Each patty is cooked to order on the hot plate so it arrives juicy inside and golden outside, making it an ideal pick for non-beef eaters and families with mixed tastes."],
  ["A1 Special BBQ Platter","Mixed grill, beef seekh kabab and chicken malai boti, served hot for the whole family.","A generous sharing platter that brings together mixed grill, beef seekh kabab and creamy chicken malai boti. Everything is cooked over open heat and served sizzling, so the table gets a full tour of our barbecue in one order."]]],
 ["🍔 Fast Food, Sandwiches & Snacks",[
  ["Zinger Burger","Crispy fried chicken fillet with fresh toppings on a soft bun.","A crunchy, spiced chicken fillet fried to a deep golden color and layered with crisp lettuce and sauce in a soft toasted bun. It is a bold, satisfying burger for anyone who loves a bit of heat."],
  ["Beef Chapli Burger","Our famous chapli kabab patty served in a burger bun.","This burger swaps the usual patty for our famous beef chapli kabab, bringing the same peppery, tomato-rich flavor of Peshawar to a bun with fresh toppings and chutney."],
  ["Chicken Cheese Burger","Juicy chicken patty topped with melted cheese.","A tender chicken patty topped with a slice of melted cheese, fresh vegetables and our house sauce. Creamy, savory and a favorite with kids and adults alike."],
  ["Egg Chicken Mixed Burger","Chicken patty and a fried egg stacked in one burger.","A hearty combination of a seasoned chicken patty and a freshly fried egg, finished with sauce and greens. It is rich, filling and perfect for a big appetite."],
  ["Shami Burger","Classic spiced lentil-and-meat shami patty in a soft bun.","A beloved street-food classic. A lightly spiced shami patty is fried until crisp, then tucked into a soft bun with onions, chutney and sauce."],
  ["Chicken Shawarma","Marinated chicken wrapped in warm bread with garlic sauce.","Thinly sliced marinated chicken wrapped in warm flatbread with pickles, fresh vegetables and creamy garlic sauce, then pressed until lightly toasted."],
  ["Chicken Cheese Shawarma","Chicken shawarma with an extra layer of melted cheese.","Our chicken shawarma upgraded with a layer of melted cheese for a rich, gooey bite that pairs well with a cold drink."],
  ["Beef Shawarma","Seasoned beef strips wrapped with fresh vegetables and sauce.","Tender seasoned beef strips wrapped in warm bread with crunchy vegetables and a tangy sauce. A deeply savory option for beef lovers."],
  ["Club Sandwich","Triple-layer sandwich with chicken, egg and fresh vegetables.","A triple-layer toasted sandwich stacked with chicken, egg, cheese and crisp vegetables. It is filling enough for a full meal and comes with fries."],
  ["Chicken Sandwich","Grilled chicken with fresh veggies and sauce on toasted bread.","Seasoned chicken, crisp vegetables and a creamy sauce between slices of toasted bread. A simple, satisfying snack any time of day."],
  ["Egg Shami Sandwich","Shami patty and egg layered in toasted bread.","A comforting sandwich of a spiced shami patty and fried egg, toasted until golden. Popular for a quick breakfast or a late-night bite."],
  ["French Fries","Golden, crispy fries seasoned and served hot.","Potatoes cut fresh, fried until golden and crisp, and lightly seasoned. The perfect side for any burger, sandwich or kabab."]]],
 ["🍦 Shakes, Falooda & Desserts",[
  ["Special Kulfa Falooda","Rose syrup, vermicelli, basil seeds and kulfa in a tall glass.","A classic dessert layered with rose syrup, silky vermicelli, basil seeds and creamy kulfa. It is refreshing, sweet and a perfect finish to a spicy meal."],
  ["Kulfa Ice Cream","Creamy traditional kulfa, rich with milk and nuts.","A dense, creamy frozen dessert made in the traditional style with thickened milk and a touch of cardamom, finished with chopped nuts."],
  ["A1 Peshawar Ice Cream","Signature ice cream in Pista, Mango and Caramel Crunch.","Our signature ice cream is available in three flavors: nutty Pista, fruity Mango and sweet Caramel Crunch. Each scoop is smooth, rich and served cold."],
  ["Date Shake","Thick, naturally sweet shake blended with fresh dates.","A thick, naturally sweet shake blended with dates and cold milk. Smooth, energizing and a local favorite after a late dinner."],
  ["Peach Chiller","Cool, fruity peach drink served over ice.","A bright, tangy peach drink blended with ice for a crisp, refreshing sip, ideal for hot Karachi evenings."],
  ["Berry Slush","Icy mixed-berry slush with a sweet-tart finish.","A frosty slush made with mixed berries and ice, balancing sweet and tart flavors in every sip."],
  ["Soft Drinks","Chilled bottled soft drinks.","A selection of chilled soft drinks to go with your meal."],
  ["Mineral Water","Chilled bottled mineral water.","Chilled bottled mineral water, served fresh."]]]
];

// Price ek hi jagah hai; asli rate likhne ke liye sirf ye line badlein.
// FIX (UPDATE 2): 'Rs. XXX' live site par unprofessional lagta tha. Khali rakha hai (CSS khud chhupa deta hai); asli rate likhne par sab jagah dikhega, jaise 'Rs. 450'.
const PRICE = '';

// Dono branches ka data. Naya branch jodna ho to sirf yahan ek naya block likhein.
const BRANCHES={
 shahFaisal:{name:"A-1 Peshawari Chapli Kabab & Fast Food",tagline:"Authentic Peshawari Chapli Kabab, BBQ & Fast Food",
  address:"C14, Near A1 Hospital, Block 1, Shah Faisal Colony 1, Karachi.",hours:"08:00 AM – 04:00 AM (Late Night Food Spot)",
  deliveryCoverage:"",highlights:"Rooftop Family Seating · Live Grilling · Late-Night Spot",
  phones:["0340-2661721","021-34573264","0321-9228585"],whatsappNumber:"923402661721",branchLabel:"Shah Faisal Branch"},
 jauhar:{name:"A-1 Peshawari Chapli Kabab & Fast Food (Jauhar Branch)",tagline:"Authentic Peshawari Taste & Fast Food",
  address:"Shop No. 1 & 2, Plot SB-25, Block 18, Near Perfume Chowk / Kamran Chowk, Main Gulistan-e-Jauhar, Karachi.",
  hours:"12:00 PM (Noon) – 04:00 AM (Late Night)",
  deliveryCoverage:"Gulistan-e-Jauhar (Blocks 1-20), Johar Chowrangi, Safoora, University Road, Gulshan-e-Iqbal (Blocks 10/11).",
  highlights:"Outdoor Street-Food Vibes · High Takeaway/Delivery Volume · 4.1★ Rating with 2,500+ Reviews",
  phones:["0333-7147847","0300-2661721"],whatsappNumber:"923216422371",branchLabel:"Jauhar Branch"}
};

// Detail pages (Live Grilling, Rooftop, Fast Foods, Desserts) ka data.
// Har offering ke 3 paragraphs, gallery ke labels aur highlights hain.
const OFFERINGS={
 liveGrilling:{title:'🔥 Live Grilling',introductionParagraphs:['At A-1 Peshawari, the grill is the heart of the restaurant. Our chapli kababs are shaped by hand and cooked on a sizzling hot plate right in front of you, so you can watch the patties brown and hear them crackle before they reach your table.','We use freshly ground beef and chicken, ripe tomatoes and a traditional blend of Peshawari spices. Nothing is pre-cooked or reheated, which keeps every bite juicy, aromatic and full of the flavor the dish is known for.','Beyond chapli, the live grill also turns out seekh kababs and creamy malai boti over open heat. Served with warm Afghani naan and green chutney, it is a meal built for sharing with family and friends.'],pictureLabels:['Chapli Kabab on the Hot Plate','Seekh Kabab over Open Heat','Chicken Malai Boti','Fresh Afghani Naan'],highlights:['Cooked fresh to order, never reheated','Beef and chicken chapli options','Served with Afghani naan and green chutney','A1 Special BBQ Platter for families']},
 rooftopSeating:{title:'🏙️ Rooftop Family Seating',introductionParagraphs:['Our rooftop seating area offers a relaxed open-air setting where families can enjoy a meal away from the bustle of the street. The space is arranged with comfortable tables and plenty of room for groups of every size.','Evenings are especially pleasant, with cool breezes, warm lighting and the aroma of fresh kababs drifting up from the grill below. It is an easy place to celebrate a birthday, catch up with relatives or simply enjoy dinner together.','Dedicated family seating keeps the atmosphere comfortable and welcoming. Combined with late hours, dine-in service and cash on delivery for orders, it makes A-1 Peshawari a dependable choice for a night out in Karachi.'],pictureLabels:['Rooftop Evening View','Family Dining Tables','Warm Evening Lighting','Late-Night Seating'],highlights:['Dedicated family seating','Open-air evening atmosphere','Dine-in and cash on delivery','Open until 4:00 AM at the Shah Faisal branch']},
 fastFood:{title:'🍔 Fast Foods',introductionParagraphs:['Our fast food menu covers all the favorites, from crispy zinger burgers and beef chapli burgers to freshly wrapped shawarmas and loaded club sandwiches. Everything is made to order so it arrives hot and fresh.','We pair classic fast food with local flavor. The chapli burger, for example, puts our famous kabab patty in a soft bun, while our shami burgers and egg shami sandwiches offer a taste of traditional street food.','Whether you are dining in, picking up or ordering delivery, the menu is quick, filling and priced for everyday meals. Add a side of golden fries and a cold drink to complete your order.'],pictureLabels:['Zinger Burger','Chicken Shawarma','Club Sandwich','Golden French Fries'],highlights:['Burgers: Zinger, Beef Chapli, Cheese and Shami','Chicken and beef shawarma','Club and egg shami sandwiches','Fast delivery and takeaway']},
 desserts:{title:'🍦 Falooda &amp; Desserts',introductionParagraphs:['Finish your meal with something sweet. Our dessert menu features creamy kulfa falooda, traditional kulfa ice cream and our signature A1 Peshawar ice cream in Pista, Mango and Caramel Crunch flavors.','For a cooler option, try a thick date shake, a tangy peach chiller or an icy berry slush. Each drink is prepared fresh and served cold.','Our desserts are especially popular late at night, when a chilled treat is the perfect way to end a spicy kabab dinner.'],pictureLabels:['Kulfa Falooda','Peshawar Ice Cream','Date Shake','Berry Slush'],highlights:['Special Kulfa Falooda and Kulfa Ice Cream','A1 Peshawar Ice Cream: Pista, Mango, Caramel Crunch','Date Shake, Peach Chiller and Berry Slush','A perfect late-night treat']}
};

// WhatsApp order buttons ke liye dono branches ke naam aur numbers.
const WHATSAPP_CONTACTS = [['Shah Faisal', '923402661721'], ['Jauhar', '923216422371']];

// ---------- 2. HELPER FUNCTIONS ----------
// Gallery ke placeholder tiles banata hai. Asli photo ke liye <div> ki jagah <img src="..."> lagayein.
// FIX (UPDATE 2): asli photos ka support. Neeche label ke saamne photo ka path likhein, jaise 'Zinger Burger': 'img/zinger.webp'.
// KYUN: <img> mein alt text + lazy loading hoti hai (Google Images SEO + speed); jab tak photo nahi, purana placeholder chalta hai.
const GALLERY_IMAGES = {};
function buildGalleryHtml(pictureLabels) {
  return pictureLabels.map(label => GALLERY_IMAGES[label]
    ? `<div><img src="${GALLERY_IMAGES[label]}" alt="${label} at A-1 Peshawari, Karachi" loading="lazy" decoding="async" width="600" height="450"></div>`
    : `<div role="img" aria-label="${label}">📷<small>${label}</small></div>`).join('');
}

// Dono branches ke WhatsApp order buttons banata hai taake customer apni branch chun sake.
function buildOrderButtonsHtml() {
  return WHATSAPP_CONTACTS.map(([branchName, phoneNumber]) =>
    `<a class="button whatsapp-button" target="_blank" rel="noopener" href="https://wa.me/${phoneNumber}?text=${encodeURIComponent('Hello A-1 Kabab (' + branchName + ' Branch)! Main order dena chahta hu.')}">💬 Order: ${branchName}</a>`).join(' ');
}

// ---------- 3. THEME (LIGHT DEFAULT, DARK OPTIONAL) ----------
// Light mode default hai. Dark mode customer ki marzi se, upar-right wale button se.
function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  const toggleButton = document.getElementById('theme-toggle');
  toggleButton.textContent = themeName === 'dark' ? '☀️' : '🌙';
  toggleButton.setAttribute('aria-label', themeName === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
function toggleTheme() {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  // try/catch isliye ke kuch browsers storage band rakhte hain; tab bhi page chalna chahiye.
  try { localStorage.setItem('a1-theme', newTheme); } catch (error) { /* storage available nahi, koi baat nahi */ }
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('a1-theme') || 'light'; } catch (error) { /* default light hi rahega */ }
applyTheme(savedTheme);

// ---------- 4. HOME PAGE LOGIC ----------
// Menu ko screen par banata hai aur search text se filter karta hai.
function renderMenuList() {
  const searchText = document.getElementById('search-input').value.toLowerCase().trim();
  let html = '';
  MENU_CATEGORIES.forEach(([categoryName, items], categoryIndex) => {
    const matchingItems = items.filter(item => (item[0] + ' ' + item[1]).toLowerCase().includes(searchText));
    if (matchingItems.length) {
      // HEADING (NAYA): div ki jagah h3 (h2 Menu -> h3 category -> h4 item), taake heading ka silsila sahi rahe.
      html += `<h3 class="category-label">${categoryName}</h3>`;
      // Har item ek link hai, click par naye tab mein uska detail page khulta hai.
      matchingItems.forEach(item => {
        html += `<a class="item" href="index.html?page=item&category=${categoryIndex}&item=${items.indexOf(item)}" target="_blank" rel="noopener"><h4>${item[0]}</h4><p>${item[1]}</p></a>`;
      });
    }
  });
  document.getElementById('menu-list').innerHTML = html || '<p>No items found.</p>';
}

// Branch badalne par call, WhatsApp, map aur address sab ek saath badalte hain (galat branch order rokne ke liye).
function selectBranch(branchKey) {
  const branch = BRANCHES[branchKey];
  document.getElementById('branch-button-shah-faisal').classList.toggle('active', branchKey === 'shahFaisal');
  document.getElementById('branch-button-jauhar').classList.toggle('active', branchKey === 'jauhar');
  // ACCESSIBILITY (NAYA): aria-pressed se screen reader ko pata chalta hai kaun si branch chuni hui hai.
  document.getElementById('branch-button-shah-faisal').setAttribute('aria-pressed', branchKey === 'shahFaisal');
  document.getElementById('branch-button-jauhar').setAttribute('aria-pressed', branchKey === 'jauhar');
  document.getElementById('tagline').textContent = branch.tagline;
  document.getElementById('branch-name').textContent = branch.name;
  document.getElementById('branch-address').textContent = branch.address;
  document.getElementById('branch-hours').textContent = branch.hours;
  document.getElementById('branch-highlights').textContent = branch.highlights;
  document.getElementById('delivery-paragraph').style.display = branch.deliveryCoverage ? 'block' : 'none';
  document.getElementById('delivery-coverage').textContent = branch.deliveryCoverage;
  const message = encodeURIComponent('Hello A-1 Kabab (' + branch.branchLabel + ')! Main order dena chahta hu.');
  const whatsappUrl = 'https://wa.me/' + branch.whatsappNumber + '?text=' + message;
  let buttonsHtml = branch.phones.map(phone => `<a class="button call-button" href="tel:${phone.replace(/-/g, '')}">📞 ${phone}</a>`).join('');
  buttonsHtml += `<a class="button whatsapp-button" target="_blank" rel="noopener" href="${whatsappUrl}">💬 Order on WhatsApp</a>`;
  document.getElementById('branch-actions').innerHTML = buttonsHtml;
  document.getElementById('floating-whatsapp-button').href = whatsappUrl;
  const mapQuery = encodeURIComponent('A-1 Peshawari Chapli Kabab ' + branch.address);
  document.getElementById('branch-map').src = 'https://www.google.com/maps?q=' + mapQuery + '&output=embed';
  document.getElementById('map-link').href = 'https://www.google.com/maps/search/?api=1&query=' + mapQuery;
  document.getElementById('review-button').href = 'https://www.google.com/search?q=' + encodeURIComponent('A-1 Peshawari Chapli Kabab Karachi reviews');
}

// Waqt dekh kar banner dikhata hai: raat 8-11 rush hour, 12-4 baje late-night offer.
function updateTimeBasedBanner() {
  // FIX (UPDATE 2): customer ke phone ki ghari ki jagah Karachi (PKT) ka waqt. KYUN: bahar se dekhne walon ko galat banner nahi dikhega.
  const currentHour = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Karachi' }).format(new Date()));
  const bannerElement = document.getElementById('banner');
  if (currentHour >= 20 && currentHour < 23) {
    bannerElement.textContent = '🔥 High Rush Hour Active! Order via WhatsApp now to skip the phone waiting line.';
    bannerElement.style.display = 'block';
  } else if (currentHour >= 0 && currentHour < 4) {
    bannerElement.textContent = '🌙 Open Till 4:00 AM! Satisfy your Late-Night Chapli Kabab Craving in 30 Mins.';
    bannerElement.style.display = 'block';
  } else {
    bannerElement.style.display = 'none';
  }
}

// Page khulte hi sab kuch pehli branch ke saath tayyar karo.
selectBranch('shahFaisal');
renderMenuList();
updateTimeBasedBanner();
setInterval(updateTimeBasedBanner, 60000);

// ---------- 5. DETAIL PAGES (SAME FILE, NAYE TAB MEIN) ----------
// Ek hi index.html teen kaam karta hai: ?page=item / ?page=menu / ?page=<offering>. Warna home dikhta hai.
// Kyun: sirf 3 files rakhni padti hain, maintenance aasaan.
const pageName = new URLSearchParams(window.location.search).get('page');
if (pageName) {
  // Home ke hisse chhupao aur detail page ka hissa dikhao.
  document.getElementById('home-page').hidden = true;
  document.querySelector('header').hidden = true;
  document.getElementById('banner').hidden = true;
  document.getElementById('top-bar').hidden = false;
  const detailPage = document.getElementById('detail-page');
  detailPage.hidden = false;
  // NAYA: detail page par skip link detail content ki taraf jaye (home hidden hota hai).
  document.querySelector('.skip-link').href = '#detail-page';

  if (pageName === 'item') {
    // Menu item ka detail: naam, price, poori description aur gallery.
    const parameters = new URLSearchParams(window.location.search);
    const category = MENU_CATEGORIES[Number(parameters.get('category'))] || MENU_CATEGORIES[0];
    const [itemName, , fullDescription] = category[1][Number(parameters.get('item'))] || MENU_CATEGORIES[0][1][0];
    document.title = itemName + ' | A-1 Peshawari';
    detailPage.innerHTML = `<h1>${itemName} <span class="price">${PRICE}</span></h1>
      <section><p class="lead-paragraph">${fullDescription}</p></section>
      <section><h2>Image Gallery</h2><div class="gallery">${buildGalleryHtml([itemName + ' - Plated', itemName + ' - Close-up', itemName + ' - Fresh from the Kitchen', itemName + ' - Served at the Table'])}</div></section>
      <section><div class="actions">${buildOrderButtonsHtml()}<a class="button call-button" href="index.html?page=menu" target="_blank" rel="noopener">📖 Full Menu</a></div></section>`;
  } else if (Object.prototype.hasOwnProperty.call(OFFERINGS, pageName)) { // FIX: ?page=constructor jaisi galat value se page crash hota tha
    // Offering ka detail: 3 paragraphs, gallery, highlights aur order buttons.
    const offering = OFFERINGS[pageName];
    document.title = offering.title.replace(/&amp;/g, '&') + ' | A-1 Peshawari';
    detailPage.innerHTML = `<h1>${offering.title}</h1>
      <section>${offering.introductionParagraphs.map(paragraph => `<p class="lead-paragraph">${paragraph}</p>`).join('')}</section>
      <section><h2>Picture Gallery</h2><div class="gallery">${buildGalleryHtml(offering.pictureLabels)}</div></section>
      <section><h2>Highlights</h2><div class="highlight-grid">${offering.highlights.map(text => `<div class="item"><p>✔ ${text}</p></div>`).join('')}</div></section>
      <section><h2>Order Now</h2><div class="actions">${buildOrderButtonsHtml()}<a class="button call-button" href="index.html?page=menu" target="_blank" rel="noopener">📖 Full Menu</a></div></section>`;
  } else {
    // Poora menu card: category tabs, har item ka link, price aur dish gallery.
    document.title = 'Menu | A-1 Peshawari';
    detailPage.innerHTML = `<h1>📖 Digital Menu Card</h1><section><p class="lead-paragraph">Peshawari chapli kabab, barbecue, fast food and desserts, all in one place. Select any item to see its full description and photos. Prices may vary by branch.</p>
      <div class="category-tabs">${MENU_CATEGORIES.map((category, index) => `<a href="#category-${index}">${category[0]}</a>`).join('')}</div></section>` +
      MENU_CATEGORIES.map((category, categoryIndex) => `<section id="category-${categoryIndex}"><h2>${category[0]}</h2><div class="menu-grid">${category[1].map((item, itemIndex) => `<a class="item" href="index.html?page=item&category=${categoryIndex}&item=${itemIndex}" target="_blank" rel="noopener"><h3>${item[0]} <span class="price">${PRICE}</span></h3><p>${item[1]}</p></a>`).join('')}</div></section>`).join('') +
      `<section><h2>Dish Gallery</h2><div class="gallery">${buildGalleryHtml(['Chapli Kabab', 'BBQ Platter', 'Burgers', 'Shawarma', 'Falooda', 'Shakes'])}</div></section><section><div class="actions">${buildOrderButtonsHtml()}</div></section>`;
  }
}

// ---------- 6. UPGRADES: SEO + ANIMATION + PERFORMANCE (NAYA) ----------
// Helper: meta tag ki value badalta hai. KYUN: har detail page ka apna description/title Google ko mile.
function setMetaTag(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

// SEO: detail pages (item / offering / menu) ke liye apna description, canonical, social tags aur schema.
// KYUN: ek hi index.html par sab pages hain, is liye har ?page= ko alag pehchan chahiye warna Google sab ko ek jaisa samjhega.
(function updateSeoForDetailPages() {
  if (!pageName) return; // home page ka SEO HTML mein pehle se maujood hai
  // FIX (UPDATE 2): galat ?page= wala link menu dikha deta tha (soft-404 / duplicate). Ab Google ko noindex ka ishara milta hai.
  if (pageName !== 'item' && pageName !== 'menu' && !Object.prototype.hasOwnProperty.call(OFFERINGS, pageName)) setMetaTag('meta[name="robots"]', 'content', 'noindex, follow');
  const params = new URLSearchParams(window.location.search);
  let description = '';
  let schema = null;
  if (pageName === 'item') {
    const category = MENU_CATEGORIES[Number(params.get('category'))] || MENU_CATEGORIES[0];
    const item = category[1][Number(params.get('item'))] || MENU_CATEGORIES[0][1][0];
    description = item[0] + ' at A-1 Peshawari, Karachi. ' + item[2];
    schema = { '@context': 'https://schema.org', '@type': 'MenuItem', name: item[0], description: item[2] };
  } else if (Object.prototype.hasOwnProperty.call(OFFERINGS, pageName)) { // FIX: ?page=constructor jaisi galat value se page crash hota tha
    description = OFFERINGS[pageName].introductionParagraphs[0];
  } else {
    description = 'Full digital menu of A-1 Peshawari in Karachi: chapli kabab, BBQ platters, burgers, shawarma, falooda and shakes.';
    schema = { '@context': 'https://schema.org', '@type': 'Menu', name: 'A-1 Peshawari Menu', hasMenuSection: MENU_CATEGORIES.map(([name, items]) => ({ '@type': 'MenuSection', name: name.replace(/^\S+\s/, ''), hasMenuItem: items.map(item => ({ '@type': 'MenuItem', name: item[0], description: item[1] })) })) };
  }
  // 155 characters se lamba description search result mein kat jata hai, is liye chhota kiya.
  description = description.replace(/&amp;/g, '&');
  if (description.length > 155) description = description.slice(0, 152).replace(/\s+\S*$/, '') + '...';
  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('meta[property="og:title"]', 'content', document.title);
  setMetaTag('meta[property="og:description"]', 'content', description);
  if (window.location.protocol.startsWith('http')) {
    const pageUrl = window.location.origin + window.location.pathname + window.location.search;
    setMetaTag('link[rel="canonical"]', 'href', pageUrl);
    setMetaTag('meta[property="og:url"]', 'content', pageUrl);
  }
  if (schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
})();

// ANIMATION: scroll karte hi sections aur cards narmi se upar uthte hue nazar aate hain.
// KYUN: smooth reveal premium feel deta hai. Class sirf tab lagti hai jab browser support kare aur user ne
// "reduced motion" na manga ho, is liye content kabhi chhup kar nahi reh jata.
(function setupScrollReveal() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } // ek baar dikha to observer band (performance)
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('#home-page > section, #detail-page > section, .hero-card').forEach((element, index) => {
    element.style.setProperty('--i', index % 4); // chhota delay taake cards ek ke baad ek aayen (stagger)
    element.classList.add('reveal');
    observer.observe(element);
  });
})();

// INTERACTION: mouse ke neeche cards mein sunehri roshni (spotlight) chalti hai.
// KYUN: ek hi listener poore page par (event delegation) + requestAnimationFrame, taake scroll/hover smooth rahe aur CPU kam lage.
let spotlightFrame = 0;
document.addEventListener('pointermove', event => {
  const card = event.target.closest && event.target.closest('.hero-card, a.item');
  if (!card || spotlightFrame) return;
  spotlightFrame = requestAnimationFrame(() => {
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', (event.clientX - box.left) + 'px');
    card.style.setProperty('--my', (event.clientY - box.top) + 'px');
    spotlightFrame = 0;
  });
}, { passive: true });

// ANALYTICS (UPDATE 2): call aur WhatsApp clicks ginta hai (Google Analytics 4 laga ho to). KYUN: owner ko pata chale ke website se kitne orders aaye.
// gtag maujood na ho to kuch nahi hota, koi error nahi.
document.addEventListener('click', event => {
  const link = event.target.closest && event.target.closest('a[href^="tel:"], a[href^="https://wa.me"]');
  if (link && window.gtag) gtag('event', link.href.startsWith('tel:') ? 'call_click' : 'whatsapp_click', { link_url: link.href });
});
