/* =====================================================================
   app.js  —  Website ka "dimaag" (saari logic yahan hai)
   =====================================================================
   Soch lo website ek insaan hai:
     index.html  = jism (haddiyan, yani cheezein jo dikhti hain)
     styles.css  = kapde aur makeup (kaisi dikhti hain)
     data.js     = yaaddasht (menu, daam, address, waqt)
     app.js      = dimaag (sochta hai aur kaam karwata hai)

   Yeh file kya kya karti hai:
     1. Loading screen (chai ka cup) chalati hai.
     2. Dekhti hai ke branch abhi khuli hai ya band.
     3. Menu dikhati hai aur search/category se chhanti hai.
     4. Cart (tokri) sambhalti hai aur daam jodti hai.
     5. Map par delivery zone dhoondti hai aur delivery fee nikalti hai.
     6. Order, review aur table request WhatsApp par bhejti hai.
     7. Chhote chhote khoobsurat effects (glow, parallax) lagati hai.

   Zaroori: data.js pehle load hoti hai (index.html mein), isliye yahan hum
   BRANCHES, CONFIG, REVIEWS, GALLERY, FAQ, DESCRIPTIONS seedha istemal kar sakte hain.
   ===================================================================== */


/* =====================================================================
   HISSA 1: Chhote madadgaar (helpers)
   Yeh chhote chhote auzaar hain jo baar baar kaam aate hain.
   ===================================================================== */

// $("#naam") = page par ek cheez dhoondo. Yeh lamba likhne ka chhota rasta (shortcut) hai.
// document.querySelector ek cheez dhoondta hai. "r = document" ka matlab: agar kuch aur na bataya
// to poore page mein dhoondo.
const $ = (s, r = document) => r.querySelector(s);

// $$("selector") = page par SAARI milti julti cheezein dhoondo aur unki list (array) bana do.
// [...] list banane ka tareeqa hai, taake hum is par forEach/map chala sakein.
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// money(550) -> "Rs. 550". toLocaleString commas lagata hai, jaise 1600 -> "1,600".
const money = n => "Rs. " + n.toLocaleString("en-PK");

// esc() = text ko "mehfooz" banata hai. Agar kisi ne naam mein <script> jaisa khatarnak code likh diya
// to yeh us ke khaas nishan (< > & " ') ko saada text bana deta hai, taake woh chal na sake.
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// store = browser ki chhoti si yaaddasht (localStorage) jahan hum branch aur theme ka choice yaad rakhte hain.
// Kabhi kabhi browser isay band rakhta hai (private mode), is liye try/catch lagaya:
//   "try" = koshish karo. Agar error aaye to "catch" mein jao aur chup chaap aage barho (website na ruke).
const store = {
  // get = yaaddasht se parho. Agar kuch na mile to d (default, yani pehle se tay kiya hua) wapas do.
  get(k, d) { try { return localStorage.getItem(k) || d; } catch { return d; } },
  // set = yaaddasht mein likho.
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};


/* =====================================================================
   HISSA 2: Website ki "halat" (state) — woh cheezein jo badalti rehti hain
   ===================================================================== */

// key = abhi kaunsi branch chuni hui hai ("shahfaisal" ya "highway").
// Pehle yaaddasht se parhte hain (customer pichli baar kaunsi dekh kar gaya tha), warna "shahfaisal".
let key = store.get("cj-branch", "shahfaisal");

// Agar yaaddasht mein koi ajeeb/purana naam ho jo BRANCHES mein nahi, to wapas "shahfaisal" par aa jao.
if (!BRANCHES[key]) key = "shahfaisal";

// Chaar cheezein jo website ko yaad rakhni hain:
//   cart  = tokri (list) jis mein customer ne cheezein daali hain
//   cat   = menu ki kaunsi category chuni hai ("All" = sab)
//   query = search box mein kya likha hua hai
//   cur   = jo item abhi popup (dialog) mein khula hua hai
let cart = [], cat = "All", query = "", cur = null;

// B() = "abhi chuni hui branch ki saari maloomat wapas do". Yeh B() baar baar istemal hota hai.
const B = () => BRANCHES[key];


/* =====================================================================
   HISSA 3: Loading screen (Preloader)
   Chai ka cup table par sarakta hai, percent 0 se 100 tak jata hai,
   aakhir mein bhaap (steam) uthti hai aur asli website nazar aati hai.
   Progress ASLI hai: DOM tayar (40%), fonts tayar (75%), poora page load (100%).
   ===================================================================== */
// Yeh "(function () { ... })();" ek aisa chhota dabba hai jo foran khud chal jata hai.
// Is ke andar ke naam (variables) bahar ke code se takrate nahi.
(function () {
  // L = loading screen ka poora parda (index.html mein id="loader").
  const L = $("#loader");
  // Agar loader hai hi nahi (kisi wajah se), to kuch mat karo, yahin ruk jao.
  if (!L) return;

  // reduce = kya customer ne phone/computer mein "animation kam karo" ka option on kiya hua hai?
  // Kuch logon ko tez harkat se chakkar aate hain, un ka khayal rakhte hain.
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // MIN = loader kam az kam kitni der dikhega (milliseconds mein, 1800 = 1.8 second).
  // Taake animation nazar aaye. "reduce" on ho to 0 (foran guzar jao).
  const MIN = reduce ? 0 : 1800;

  // Loader ke SVG tasveer ke hisse jinhein hum hilayenge:
  //   cupG  = poora cup ka group (jo table par sarakta hai)
  //   chai  = cup ke andar ki chai (jo upar chadhti hai)
  //   froth = chai ke upar jhaag ke bulbule
  //   t0    = loader shuru hone ka waqt (yaad rakhne ke liye, MIN ginne ke kaam aata hai)
  const cupG = $("#cupG"), chai = $("#chai"), froth = $("#froth"), t0 = performance.now();

  // target  = progress kahan tak pahunchna chahiye (shuru mein 40 kyunke page ka dhancha ban chuka hai)
  // shown   = abhi screen par kitna percent dikh raha hai (0 se shuru, dheere dheere target tak jata hai)
  // finished= kya loading khatam ho chuki?
  let target = 40, shown = 0, finished = false;

  // bump(n) = "target ko kam az kam n tak le jao" (target kabhi peeche nahi jata, sirf aage).
  const bump = n => { target = Math.max(target, n); };

  // Jab fonts (khoobsurat likhai) download ho jayein to target 75% kar do.
  // (document.fonts na ho to foran "poora ho gaya" maan lo.)
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => bump(75));

  // Jab poora page (photos wagaira samet) load ho jaye to target 100%.
  // Agar page pehle hi load ho chuka hai to foran 100%, warna "load" ka intezar karo.
  if (document.readyState === "complete") bump(100); else addEventListener("load", () => bump(100));

  // Hifazati jaal: agar internet bohat slow ho to 5 second baad bhi 100% kar do, taake customer atka na rahe.
  setTimeout(() => bump(100), 5000);

  // draw() = jo "shown" hai uske hisaab se loader ki tasveer banata hai.
  function draw() {
    // p = 0 se 1 ke beech ka number (0 = shuru, 1 = poora). Percent ko 100 se taqseem kiya.
    const p = shown / 100;
    // Cup ko table par sarkao: shuru mein -130px (thoda bahar), aakhir mein +70px (beech mein).
    cupG.style.transform = `translateX(${-130 + p * 200}px)`;
    // Chai ka level upar chadhao (aakhir tak 12px upar).
    chai.style.transform = `translateY(${-12 * p}px)`;
    // Jhaag (froth) dheere dheere nazar aaye: shuru mein bilkul gayab, 15% ke baad nazar aana shuru.
    froth.style.opacity = Math.max(0, (p - .15) / .85);
    // Screen par percent ka number likho (gol karke, jaise 47).
    $("#pct").textContent = Math.round(shown);
    // Screen reader (nabina logon ki madad) ko bhi progress batao.
    L.setAttribute("aria-valuenow", Math.round(shown));
  }

  // finish() = loading poori. Bhaap chalao, phir loader ko ghaib karo.
  // fast = true ho (Skip dabaya) to intezar nahi karna.
  function finish(fast) {
    // Agar pehle hi khatam ho chuki to dobara mat karo.
    if (finished) return;
    // Ab khatam hai. 100% dikhao aur "done" class lagao (CSS us se bhaap shuru karti hai).
    finished = true; shown = 100; draw(); L.classList.add("done");
    // Thori der (1.1 second) baad loader ko dhundla karke hata do.
    setTimeout(() => {
      // "out" class se loader dheere dheere ghaib hota hai.
      // "loading" class hatane se page dobara scroll hone lagta hai.
      L.classList.add("out"); document.body.classList.remove("loading");
      // 0.6 second baad loader ko page se poori tarah nikaal do.
      setTimeout(() => L.remove(), 600);
    }, fast || reduce ? 0 : 1100);
  }

  // tick() = har screen-refresh par chalta hai (1 second mein ~60 baar) aur progress aage barhata hai.
  (function tick(now) {
    // Agar khatam ho chuka to ab loop band.
    if (finished) return;
    // goal = abhi kahan tak ja sakte hain: target tak, lekin MIN waqt guzarne se pehle 99 se aage nahi
    // (taake animation kam az kam 1.8 second chale).
    const goal = Math.min(target, now - t0 < MIN ? 99 : 100);
    // shown ko goal ki taraf thoda sa aage barhao. Jitna door, utni tez; kam az kam .35 ka qadam.
    shown = Math.min(goal, shown + Math.max(.35, (goal - shown) * .06));
    // Tasveer nayi banao.
    draw();
    // Agar 100 ho gaya to finish(), warna agle refresh par dobara tick() chalao.
    shown >= 100 ? finish() : requestAnimationFrame(tick);
  })(performance.now());

  // "Skip" button dabane par foran khatam karo (fast = true).
  $("#loaderSkip").onclick = () => finish(true);
})();


/* =====================================================================
   HISSA 4: Menu ke text ko "asli list" mein badalna
   data.js mein menu ek lamba text hai. Yeh function usay categories aur items ki
   saaf list mein badalta hai jis se hum kaam kar sakein.
   ===================================================================== */
function parseMenu(text) {
  // cats = categories ki khali list. Hum isay bharte jayenge.
  const cats = [];
  // text ko line line todo (trim = aage peeche ki faltu khali jagah hatao), har line par kaam karo.
  text.trim().split("\n").forEach(line => {
    // Is line ki aage peeche ki khali jagah hatao.
    line = line.trim();
    // Agar line "#" se shuru hoti hai to yeh NAYI CATEGORY ka naam hai (jaise "# Burgers").
    if (line[0] === "#") {
      // "#" ke baad ka naam nikaalo. Agar [Single/Double] jaisa bracket ho to alag nikaal lo.
      // m[1] = category ka naam, m[2] = bracket ke andar ka text (sizes).
      const m = line.slice(1).trim().match(/^(.*?)(?:\[(.*)\])?$/);
      // Nayi category list mein jodo: naam, sizes ke naam (labels) aur khali items ki list.
      cats.push({ name: m[1].trim(), labels: (m[2] || "").split("/"), items: [] });
    } else {
      // Warna yeh items ki line hai. ";" se alag karo (jaise "Classic Zinga:550;Korean Zinga:590").
      line.split(";").forEach(i => {
        // Har item ko ":" par todo: n = naam, p = daam (ya daam, jaise "200/380").
        const [n, p] = i.split(":");
        // Agar daam mila (p khali nahi) to item ko aakhri category mein jod do.
        // Daam ko "/" par todo (agar 2 sizes hain) aur har ek ko number banao.
        if (p) cats[cats.length - 1].items.push({ name: n.trim(), prices: p.split("/").map(Number) });
      });
    }
  });
  // Tayar list wapas do.
  return cats;
}
// Har branch ke liye uska menu text parh kar "cats" naam ki list uski maloomat mein jod do.
Object.values(BRANCHES).forEach(b => b.cats = parseMenu(b.menu));


/* =====================================================================
   HISSA 5: Pakistan ka waqt aur "khula hai ya band?"
   ===================================================================== */

// Din ke naam (0 = Itwaar/Sunday se 6 = Hafta/Saturday tak), data.js ki hours list ke order mein.
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// pkNow() = abhi Pakistan (Karachi) mein kaunsa din hai aur waqt kya hai? (chahe customer kisi aur mulk mein ho)
function pkNow() {
  // Intl.DateTimeFormat waqt ko kisi bhi shehar ke hisaab se nikalta hai.
  // formatToParts() waqt ke tukde karta hai (din, ghanta, minute) aur hum unhein ek "naam: qeemat" dabbe mein rakhte hain.
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
  }).formatToParts(new Date()).map(x => [x.type, x.value]));
  // day = din ka number (0 = Sunday). h = waqt decimal mein, jaise 5:30 PM = 17.5.
  // "% 24" isliye ke kuch browser raat 12 baje ko "24" likhte hain, usay 0 bana do.
  return { day: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(parts.weekday), h: (+parts.hour % 24) + (+parts.minute) / 60 };
}

// fmtT(17.5) -> "5:30 PM". Decimal waqt ko insani zubaan mein likhta hai.
function fmtT(h) {
  // 24 se bara waqt (jaise 27 = raat 3 baje) ko 24 ghata kar 0-24 ke andar lao.
  h = h % 24;
  // hh = poore ghante, mm = baaqi minute (0.5 ghanta = 30 minute).
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  // 12 ghante wali ghari: 0 ya 12 baje ko "12" likho; minute ke aage zaroorat par "0" lagao (5:05).
  // 12 ya us se zyada ho to PM, warna AM.
  return `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`;
}

// branchStatus(b) = branch khuli hai ya band? Agar band hai to kab khulegi?
// Khaas baat: raat 12 ke baad bhi pichle din ki shift chal sakti hai (jaise Jumma ki shift hafta ki subah 4 baje tak).
function branchStatus(b) {
  // Abhi ka din aur waqt.
  const { day, h } = pkNow();
  // [s, e] = aaj ka kholne (s) aur band hone (e) ka waqt.
  // pe = KAL (pichle din) ka band hone ka waqt. (day + 6) % 7 pichle din ka number deta hai.
  const [s, e] = b.hours[day], pe = b.hours[(day + 6) % 7][1];
  // Haalat 1: abhi ka waqt aaj ke khulne aur band hone ke beech hai => KHULI hai.
  if (h >= s && h < e) return { open: true, until: e };
  // Haalat 2: pichle din ki shift raat 12 ke baad (24 se zyada) tak thi aur abhi us waqt se pehle hain => KHULI hai.
  if (pe > 24 && h < pe - 24) return { open: true, until: pe };
  // Haalat 3: band hai, lekin aaj hi baad mein khulegi (abhi khulne ke waqt se pehle).
  if (h < s) return { open: false, start: s, label: "" };
  // Haalat 4: aaj ka waqt nikal gaya, kal khulegi. nd = kal ka din.
  const nd = (day + 1) % 7;
  return { open: false, start: b.hours[nd][0], label: ` tomorrow (${DAYS[nd]})` };
}

// renderStatus() = upar wali bar aur hero mein "khuli/band" ka message screen par likhta hai.
function renderStatus() {
  // st = ab ka haal, el = hero mein status ki line.
  const st = branchStatus(B()), el = $("#status");
  // Class "status open" rakho (CSS usay hara kinara deti hai).
  el.className = "status open";
  // Band ho to hero ki status line chhupa do (message upar wali bar mein dikhega).
  el.hidden = !st.open;
  // Khuli ho to likho: "Open now. Serving until 3:00 AM."
  if (st.open) el.textContent = `Open now. Serving until ${fmtT(st.until)}.`;
  // Upar ki bar: khuli ho to chhupa do, band ho to dikhao.
  $("#closedBar").hidden = st.open;
  // Agar band hai to bar mein message likho.
  if (!st.open) {
    // Message: "Sorry, we're closed right now. We'll reopen at 5:00 PM."
    const msg = `Sorry, we're closed right now. We'll reopen at ${fmtT(st.start)}${st.label}.`;
    // Sirf tab likho jab message badla ho (warna har 30 second par bekaar dobara likhna).
    if ($("#closedMsg").textContent !== msg) $("#closedMsg").textContent = msg;
  }
}


/* =====================================================================
   HISSA 6: Branch ki maloomat screen par dikhana
   ===================================================================== */
function renderBranch() {
  // b = chuni hui branch.
  const b = B();
  // Branch ke do buttons mein se jo chuna hua hai usay "dabaya hua" (aria-pressed=true) dikhao.
  $$(".seg button").forEach(x => x.setAttribute("aria-pressed", x.dataset.b === key));
  // Branch ka naam aur address likho.
  $("#bName").textContent = b.name;
  $("#bAddr").textContent = b.address;
  // Phone number likho (hero aur footer dono mein) aur link banao taake dabane par call lage.
  // replace(/\s/g, "") number se khali jagah hata deta hai (tel: link mein space nahi chalti).
  [$("#bPhone"), $("#fPhone")].forEach(a => { a.textContent = b.phone; a.href = "tel:" + b.phone.replace(/\s/g, ""); });
  // Footer mein bhi address likho.
  $("#fAddr").textContent = b.address;
  // Rating agar hai to likho, warna khali chhor do.
  $("#bRating").textContent = b.rating ? "Rating: " + b.rating : "";
  // Reviews ke upar ka note: branch ki rating aur (agar likha ho) reviews ki kul ginti.
  $("#revNote").textContent = (b.rating ? `${b.name}: ${b.rating}. ` : "") + CONFIG.reviewCountNote;
  // Hafte ke saat dino ki list banao: "Monday: 5:00 PM – 3:00 AM". map() har din ke liye ek <li> banata hai.
  $("#bHours").innerHTML = b.hours.map((x, d) => `<li>${DAYS[d]}: ${fmtT(x[0])} – ${fmtT(x[1])}</li>`).join("");
  // Footer mein delivery charges ki list: "Zone 1: Free delivery", "Zone 2: Rs. 100".
  $("#zones").innerHTML = b.zones.map(z => `<li>${z.label}: ${z.charge ? money(z.charge) : "Free delivery"}</li>`).join("");
  // Menu ka heading: "Menu: Shah Faisal Branch".
  $("#menuTitle").textContent = "Menu: " + b.name;
  // Neeche WhatsApp ke gol button ka link is branch ke number aur message ke saath banao.
  const wa = $("#waFloat");
  wa.href = waLink(`Hello Chai Jan! I have a question about the ${b.name}.`);
  // Screen reader ke liye button ka naam (label) bhi branch ke saath likho.
  wa.setAttribute("aria-label", `Chat with Chai Jan, ${b.name}, on WhatsApp`);
  // Baaqi hisson ko bhi nayi branch ke hisaab se dobara banao: status, reservation ka waqt,
  // search box ka typewriter aur delivery map.
  renderStatus(); renderTimes(); typeHint(); renderMap();
}


/* =====================================================================
   HISSA 7: Menu dikhana, chhanta aur typewriter
   ===================================================================== */
function renderMenu() {
  // cats = chuni hui branch ki categories. q = search ka text chhote harfon (lowercase) mein.
  const cats = B().cats, q = query.toLowerCase();
  // Upar category ke buttons ("All", "Burgers", ...) banao. Jo chuna hua hai wo "dabaya hua" dikhega.
  $("#chips").innerHTML = ["All", ...cats.map(c => c.name)].map(n =>
    `<button type="button" class="chip" aria-pressed="${n === cat}" data-cat="${esc(n)}">${esc(n)}</button>`).join("");
  // html = menu ka poora likha hua hissa, shuru mein khali.
  let html = "";
  // Har category ke liye:
  cats.forEach(c => {
    // Agar koi khaas category chuni hai aur yeh wo nahi hai to chhor do.
    if (cat !== "All" && c.name !== cat) return;
    // its = is category ke wo items jin ke naam mein search ka text aata ho (includes = "shamil hai?").
    const its = c.items.filter(i => i.name.toLowerCase().includes(q));
    // Agar koi item na mile to is category ko dikhao hi mat.
    if (!its.length) return;
    // Category ka heading aur items ke buttons html mein jodo.
    // Agar 2 sizes hain to "from" likho aur sab se chhota daam dikhao (Math.min = sab se chhota).
    html += `<h3>${esc(c.name)}</h3><ul class="grid plain">` + its.map(i =>
      `<li><button type="button" class="item" data-c="${esc(c.name)}" data-i="${esc(i.name)}"><span>${esc(i.name)}</span><b>${i.prices.length > 1 ? "from " : ""}${money(Math.min(...i.prices))}</b></button></li>`).join("") + "</ul>";
  });
  // Page par rakh do. Agar kuch na mila to "koi item nahi mila" ka message.
  $("#menuList").innerHTML = html || `<p class="empty">No items match "${esc(query)}". Try another word or clear the search.</p>`;
}

// typeHint() = search box ka typewriter. Placeholder (halka likha hua text) mein
// khane ke naam ek ek harf karke likhta hai: "Try: K", "Try: Ka", "Try: Kar"... Sirf sajawat hai.
function typeHint() {
  // el = search box. Pichla chalta hua typewriter ho to usay roko (clearTimeout), warna do chalne lagenge.
  const el = $("#q"); clearTimeout(typeHint.t);
  // Agar customer ne "animation kam karo" chuna hai to saada text rakho aur yahin ruk jao.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.placeholder = "Search the menu"; return; }
  // names = is branch ke saare items ke naam ki ek lambi list (flatMap = list ke andar ki list ko seedhi list banata hai).
  const names = B().cats.flatMap(c => c.items.map(i => i.name));
  // n = abhi kaunsa naam, c = us naam ke kitne harf likh chuke.
  let n = 0, c = 0;
  // tick() = ek harf aur likho.
  (function tick() {
    // w = abhi wala naam.
    const w = names[n];
    // Pehle c+1 harf likho (slice = naam ka shuru ka hissa kaato).
    el.placeholder = "Try: " + w.slice(0, ++c);
    // Agar poora naam likh diya: 1.4 second ruko, phir koi aur (random) naam chuno aur shuru se likho.
    if (c >= w.length) { c = 0; n = Math.floor(Math.random() * names.length); typeHint.t = setTimeout(tick, 1400); }
    // Warna 0.09 second baad agla harf likho.
    else typeHint.t = setTimeout(tick, 90);
  })();
}


/* =====================================================================
   HISSA 8: Item ka popup (dialog)
   Item par dabane se naya page nahi khulta, usi page par chhota popup khulta hai.
   ===================================================================== */
// openItem(c, i) = category c ka item i popup mein kholo.
function openItem(c, i) {
  // cc = wo category, it = wo item. (find = list mein pehli milti cheez dhoondo.)
  const cc = B().cats.find(x => x.name === c), it = cc.items.find(x => x.name === i);
  // Yaad rakho ke abhi kaunsa item khula hai (baad mein cart mein daalte waqt kaam aayega).
  cur = { cc, it };
  // Item ka naam likho.
  $("#itName").textContent = it.name;
  // Description likho. Agar data.js mein nahi hai to "coming soon" likho (kuch invent nahi karte).
  $("#itDesc").textContent = DESCRIPTIONS[key + "|" + it.name] || "Description coming soon. Please ask the branch about ingredients or allergens.";
  // Sizes ke radio buttons banao (ek time par ek hi chun sakte hain). Pehla size pehle se chuna hua ("checked").
  // Agar size ka naam nahi to "Regular" likho.
  $("#itOpts").innerHTML = it.prices.map((p, k) =>
    `<label class="opt"><input type="radio" name="opt" value="${k}" ${k ? "" : "checked"}> ${esc(cc.labels[k] || "Regular")}: ${money(p)}</label>`).join("");
  // Quantity shuru mein 1.
  $("#itQty").value = 1;
  // Kul daam (1 x daam) abhi se likh do.
  updTotal();
  // Popup kholo (showModal = baaki page dhundla karke beech mein popup).
  $("#itemDlg").showModal();
}

// stepQty(d) = quantity ko d se badlo (+1 ya -1), lekin 1 se kam aur 20 se zyada nahi.
const stepQty = d => { const q = $("#itQty"); q.value = Math.max(1, Math.min(20, (+q.value || 1) + d)); updTotal(); };

// updTotal() = quantity ya size badalte hi kul daam foran nayi tarah likhta hai.
// Misaal: 4 fries, har ek Rs. 150 => "4 × Rs. 150 = Rs. 600".
function updTotal() {
  // k = kaunsa size chuna hai (0 = pehla). "?." ka matlab: agar kuch chuna hi nahi to 0 maan lo.
  // q = quantity (1 se 20 ke beech).
  const k = +($("input[name=opt]:checked")?.value || 0), q = Math.max(1, Math.min(20, +$("#itQty").value || 1));
  // price = ek cheez ka daam us size ka.
  const price = cur.it.prices[k];
  // Screen par hisaab likho: "4 × Rs. 150 = Rs. 600".
  $("#itTotal").textContent = `${q} × ${money(price)} = ${money(price * q)}`;
  // "Add to cart" button par bhi kul daam likho.
  $("#addBtn").textContent = `Add to cart: ${money(price * q)}`;
}


/* =====================================================================
   HISSA 9: Cart (tokri) aur delivery ka kiraya
   ===================================================================== */

// subtotal() = cart ki saari cheezon ka jod (daam x quantity). reduce = list ko jod kar ek number banata hai.
const subtotal = () => cart.reduce((a, x) => a + x.price * x.qty, 0);

// deliveryInfo() = delivery ka kiraya kitna hai? Sirf map ke zone se aata hai.
// Agar zone nahi mila to "branch WhatsApp par confirm karegi" likhte hain. Kabhi khud se free nahi maante.
function deliveryInfo() {
  // Agar order "Delivery" nahi (Takeaway ya Dine-in hai) to koi kiraya nahi.
  if ($("#oType").value !== "Delivery") return { text: "No delivery charge", amount: 0 };
  // Agar customer ki location ek zone ke andar aati hai (loc.i >= 0) to us zone ka kiraya lagao.
  if (loc && loc.i >= 0) { const z = B().zones[loc.i]; return { text: `${z.label}: ${z.charge ? money(z.charge) : "Rs. 0 (free)"}`, amount: z.charge }; }
  // Warna: ya to location teeno zones se bahar hai, ya abhi chuni hi nahi. amount: null = "abhi pata nahi".
  return { text: loc ? "Outside our delivery zones, to be confirmed by the branch on WhatsApp" : "To be confirmed by the branch on WhatsApp", amount: null };
}

// renderCart() = cart ka poora hissa dobara banao (ginti, cheezein, jod, delivery, zone ka dabba).
function renderCart() {
  // qtyN = cart mein kul kitni cheezein (har item ki quantity ka jod).
  const qtyN = cart.reduce((a, x) => a + x.qty, 0);
  // Header ke cart button par ginti likho.
  $("#cartCount").textContent = qtyN;
  // Neeche ki "View cart" bar: cart khali ho to chhupa do; warna "View cart (3) — Rs. 1,200" likho.
  const cb = $("#cartBar"); cb.hidden = !qtyN; cb.textContent = `View cart (${qtyN}) — ${money(subtotal())}`;
  // Cart ke andar likho ke order kis branch ka hai.
  $("#cartBranch").textContent = "Ordering from: " + B().name;
  // Cart ki har cheez ki ek line banao: naam, daam x quantity, line ka kul, aur - + ✕ buttons.
  // Agar cart khali hai to "Your cart is empty" likho.
  $("#cartLines").innerHTML = cart.length ? cart.map((x, i) =>
    `<li><div>${esc(x.name)}${x.label ? ` <small>${esc(x.label)}</small>` : ""}<br><small>${money(x.price)} each × ${x.qty}</small> <b>${money(x.price * x.qty)}</b></div>
     <div class="qty"><button type="button" data-d="-1" data-i="${i}" aria-label="Decrease ${esc(x.name)}">−</button><span>${x.qty}</span><button type="button" data-d="1" data-i="${i}" aria-label="Increase ${esc(x.name)}">+</button><button type="button" data-d="0" data-i="${i}" aria-label="Remove ${esc(x.name)}">✕</button></div></li>`).join("")
    : `<li class="empty">Your cart is empty. Pick an item from the menu.</li>`;
  // d = delivery ki maloomat (kiraya kitna hai).
  const d = deliveryInfo();
  // Jod ka hissa: Subtotal, Delivery, aur (agar kiraya pata hai to) Total = jod + kiraya.
  $("#totals").innerHTML = `Subtotal: <b>${money(subtotal())}</b><br>Delivery: ${d.text}` +
    (d.amount !== null ? `<br>Total: <b>${money(subtotal() + d.amount)}</b>` : "");
  // del = kya order "Delivery" wala hai?
  const del = $("#oType").value === "Delivery";
  // Zone ka dabba: agar map tayar nahi to batao; agar location chuni hai to kiraya mota likho;
  // warna "abhi location nahi chuni". Saath mein "Set it on the map" ka link.
  $("#zoneWrap").innerHTML = `<b>Delivery location</b><br>${!mapReady(B()) ? "Zone lookup is not set up yet. The branch will confirm your delivery charge on WhatsApp."
    : loc ? `<b>${esc($("#feeOut").textContent)}</b>` : "No location chosen yet."} <a href="#delivery">Set it on the map</a>`;
  // Zone ka dabba aur address ka box sirf "Delivery" mein dikhao (Takeaway/Dine-in mein chhupa do).
  $("#zoneWrap").hidden = $("#addrWrap").hidden = !del;
  // Address sirf delivery mein zaroori (required) hai.
  $("#oAddr").required = del;
}


/* =====================================================================
   HISSA 10: WhatsApp ko bhejna
   ===================================================================== */

// waLink(text, number) = WhatsApp ka link banata hai jis par dabane se WhatsApp khulta hai aur message pehle se likha hota hai.
// Number nahi diya to chuni hui branch ka number, warna CONFIG wala number.
// encodeURIComponent = message ke khaas nishan (space, &, ? wagaira) ko link mein mehfooz tareeqe se likhta hai.
const waLink = (t, n = B().whatsapp || CONFIG.whatsapp) => `https://wa.me/${n}?text=${encodeURIComponent(t)}`;

// orderText() = order ka poora message banata hai jo WhatsApp mein khulega.
function orderText() {
  // d = delivery ka kiraya.
  const d = deliveryInfo();
  // Pehle heading aur cart ki saari cheezein ek ek line mein: "2 x Karak Tea (Chai Jan) @ Rs. 160 = Rs. 320".
  // "\n" ka matlab nayi line.
  let t = `*New order request: Chai Jan, ${B().name}*\n\n` +
    cart.map(x => `${x.qty} x ${x.name}${x.label ? " [" + x.label + "]" : ""} @ ${money(x.price)} = ${money(x.price * x.qty)}`).join("\n") +
    `\n\nSubtotal: ${money(subtotal())}\nOrder type: ${$("#oType").value}\nDelivery charge: ${d.text}\n`;
  // Agar kiraya pata hai to kul jod bhi likho.
  if (d.amount !== null) t += `Total: ${money(subtotal() + d.amount)}\n`;
  // Customer ka naam aur phone.
  t += `\nName: ${$("#oName").value}\nPhone: ${$("#oPhone").value}`;
  // Delivery ho to address likho.
  if ($("#oType").value === "Delivery") t += `\nAddress: ${$("#oAddr").value}`;
  // Delivery ho aur map par location chuni ho to Google Maps ka link bhi do (rider ke liye aasani).
  if ($("#oType").value === "Delivery" && loc) t += `\nPin: https://maps.google.com/?q=${loc.lat.toFixed(6)},${loc.lng.toFixed(6)}`;
  // Agar customer ne khaas hidayat likhi ho to woh bhi.
  if ($("#oNote").value.trim()) t += `\nNotes: ${$("#oNote").value}`;
  // Poora message wapas do.
  return t;
}

// deliver() = order/review/table request bhejta hai.
// Agar CONFIG mein form service ka link hai to wahan POST karta hai, warna WhatsApp kholta hai.
// Hum kabhi "order confirm ho gaya" nahi likhte, kyunke staff ne abhi dekha hi nahi hota.
//   kind   = kis qism ka (order/review/reservation)
//   data   = form ka data
//   waText = WhatsApp wala message
//   msgEl  = jahan customer ko jawab dikhana hai
//   okText = kamyabi ka message
async function deliver(kind, data, waText, msgEl, okText) {
  // Agar form service ka link maujood hai:
  if (CONFIG.formEndpoint) {
    try {
      // Data us link par bhejo (fetch = internet par kuch bhejna/mangna). await = jawab aane tak ruko.
      const r = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ kind, branch: B().name, ...data }) });
      // Agar jawab theek nahi aaya (r.ok false) to jaan boojh kar error banao taake catch chale.
      if (!r.ok) throw new Error("bad response");
      // Sab theek: kamyabi ka message dikhao.
      msgEl.textContent = okText;
    } catch { msgEl.textContent = "We could not send this right now. Please try again, or message us on WhatsApp."; }
    // Yahin khatam (WhatsApp nahi kholna).
    return;
  }
  // Form service nahi hai: WhatsApp naye tab mein kholo. "noopener" = naya tab purane page par qabza na kar sake (hifazat).
  const w = window.open(waLink(waText), "_blank", "noopener");
  // Customer ko batao ke WhatsApp mein "Send" dabana hai. Agar browser ne naya tab roka (w khali) to link dabane ka option do.
  msgEl.innerHTML = "WhatsApp is opening with your message. Press Send there to deliver it. " +
    (w ? "" : `<a href="${waLink(waText)}" target="_blank" rel="noopener">Tap here if it did not open.</a>`);
}


/* =====================================================================
   HISSA 11: Reviews, gallery (photos) aur FAQ
   ===================================================================== */

// stars(4) -> "★★★★☆". Pehle n bhare sitare, baaqi (5 - n) khali sitare.
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);

// renderReviews() = data.js ke saare reviews ke dabbe (cards) banata hai.
function renderReviews() {
  $("#revList").innerHTML = REVIEWS.map(r =>
    `<li class="card"><p aria-label="${r.stars} out of 5 stars" class="stars">${stars(r.stars)}</p><p>${esc(r.text)}</p><p class="muted">${esc(r.name)}</p></li>`).join("");
}

// galCat = gallery ki kaunsi category chuni hai ("All" = sab).
// galList = jo photos abhi dikh rahi hain (filter ke baad).
// lbI = lightbox (bari photo) mein abhi kaunsi photo number hai.
let galCat = "All", galList = [], lbI = 0;

// renderGallery() = filter ke buttons aur photos ka bento grid banata hai.
function renderGallery() {
  // Filter buttons: "All" aur har alag category (Set = duplicate hata deta hai).
  $("#galChips").innerHTML = ["All", ...new Set(GALLERY.map(g => g.cat))].map(c =>
    `<button type="button" class="chip" aria-pressed="${c === galCat}" data-g="${c}">${c}</button>`).join("");
  // Sirf wo photos rakho jo chuni hui category ki hain (ya "All" ho to sab).
  galList = GALLERY.filter(g => galCat === "All" || g.cat === galCat);
  // Har photo ka ek button (dabane par bari khulti hai). Agar photo ka rasta (src) nahi to "Photo placeholder" ka dabba.
  // loading="lazy" = photo tab download ho jab screen ke qareeb aaye (website tez rehti hai).
  $("#galGrid").innerHTML = galList.map((g, i) =>
    g.src ? `<button type="button" class="gb ${g.size || ""}" data-lb="${i}" aria-label="Open photo: ${esc(g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async"></button>`
          : `<div class="ph gb"><span>Photo placeholder<br>${esc(g.cat)}</span></div>`).join("");
}

// openLb(i) = lightbox mein photo number i kholo (bari photo, Previous/Next/Close ke saath). Esc se bhi band hota hai.
function openLb(i) {
  // Photo number ko "gol" rakho: aakhri ke baad pehli, pehli se pehle aakhri. (% = baaqi bachna.)
  lbI = (i + galList.length) % galList.length; const g = galList[lbI];
  // Bari photo, uska bayan (alt) aur neeche likha caption set karo.
  $("#lbImg").src = g.src; $("#lbImg").alt = g.alt; $("#lbCap").textContent = g.alt;
  // Agar popup pehle se khula nahi to kholo.
  if (!$("#lbDlg").open) $("#lbDlg").showModal();
}

// renderFaq() = FAQ ke sawal-jawab dikhata hai aur search box ke mutabiq chhanta hai.
function renderFaq() {
  // q = search ka text (lowercase).
  const q = $("#faqQ").value.toLowerCase();
  // Wo sawal rakho jin ke sawal ya jawab mein q aata ho. Har ek ke liye khulne wala <details> dabba banao.
  $("#faqList").innerHTML = FAQ.filter(f => (f.q + f.a).toLowerCase().includes(q)).map(f =>
    `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("") || `<p class="empty">No questions match. Try another word.</p>`;
}


/* =====================================================================
   HISSA 12: Table reservation ka waqt
   Customer sirf wohi waqt chun sakta hai jab branch khuli ho.
   ===================================================================== */
function renderTimes() {
  // sel = waqt ka dropdown, v = customer ne jo tareekh chuni (jaise "2026-10-20").
  const sel = $("#resTime"), v = $("#resDate").value;
  // Agar tareekh abhi chuni hi nahi to "pehle tareekh chunein" likh do aur ruk jao.
  if (!v) { sel.innerHTML = `<option value="">Choose a date first</option>`; return; }
  // Tareekh ko saal-mahina-din mein todo.
  const [y, m, d] = v.split("-").map(Number);
  // Us tareekh ka din nikalo (getDay: 0 = Itwaar) aur us din ke kholne/band hone ka waqt lo.
  // (m - 1 isliye ke JavaScript mein mahine 0 se shuru hote hain.)
  const [s, e] = B().hours[new Date(y, m - 1, d).getDay()];
  // o = options ka text, shuru mein khali.
  let o = "";
  // Kholne ke waqt se band hone se 1 ghanta pehle tak, har aadhe ghante ka ek option.
  // (24 se zyada waqt par "(after midnight)" likho.)
  for (let h = s; h <= e - 1; h += 0.5) o += `<option>${fmtT(h)}${h >= 24 ? " (after midnight)" : ""}</option>`;
  // Dropdown mein rakh do.
  sel.innerHTML = o;
}


/* =====================================================================
   HISSA 13: Delivery map aur zones
   Map tab chalta hai jab data.js mein branch ki lat/lng aur teeno zones ke radius bhare hon
   (chhota se bara). Warna "Map setup needed" ka message dikhta hai.
   ===================================================================== */

// ZCOL = teeno zones ke rang: hara (Zone 1), peela (Zone 2), laal (Zone 3).
const ZCOL = ["#2E9E6B", "#E8A317", "#D9534F"];

// map      = asli map (Leaflet library ka) jab bana ho
// pin      = customer ki chuni hui jagah ka nishan
// loc      = customer ki jagah ki maloomat (lat, lng, doori, kaunsa zone)
// leafletP = Leaflet library download ka "wada" (Promise), taake sirf ek baar download ho
let map = null, pin = null, loc = null, leafletP = null;

// mapReady(b) = kya is branch ka map tayar hai? Teen shartein:
//   1) lat aur lng bhare hon, 2) har zone ka radius 0 se bara ho,
//   3) radius barhta jaye (Zone 2 > Zone 1, Zone 3 > Zone 2).
const mapReady = b => b.lat != null && b.lng != null && b.zones.every((z, i) => z.radiusKm > 0 && (!i || z.radiusKm > b.zones[i - 1].radiusKm));

// loadLeaflet() = map banane wali Leaflet library internet se sirf TAB mangwata hai jab zaroorat ho
// (website tez rehti hai). Pehle se mangwa li ho to wohi wada wapas deta hai.
const loadLeaflet = () => leafletP || (leafletP = new Promise((ok, no) => {
  // Library ka design wali file (css) page mein jodo.
  const c = document.createElement("link"); c.rel = "stylesheet"; c.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.append(c);
  // Library ka code wali file (js) page mein jodo. Load ho jaye to ok(), na ho to no() (nakami).
  const j = document.createElement("script"); j.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; j.onload = ok; j.onerror = no; document.head.append(j);
}));

// ctl(off) = location ke chaar buttons ko band (true) ya chalu (false) karo.
// Jab map tayar na ho to buttons band rehte hain.
const ctl = off => ["#locBtn", "#coordBtn", "#addrBtn", "#addrFind"].forEach(s => $(s).disabled = off);

// goPick() = page ko smoothly "Your delivery location" ke dabbe tak scroll karo.
// Agar customer ne animation kam karne ka option chuna hai to jhat se (auto), warna aaram se (smooth).
const goPick = () => $("#pickCard").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });

// metres(a, b, c, d) = zameen par do jagahon ke beech doori (metres mein).
// (a, b) = pehli jagah ki lat, lng; (c, d) = doosri jagah ki lat, lng.
// Zameen gol hai, isliye seedhi line ka hisaab nahi chalta; "haversine" naam ka formula gol zameen ka hisaab karta hai.
function metres(a, b, c, d) {
  // R = zameen ka radius (metres). t = degree ko radian mein badalne wala chhota function.
  // h = haversine formula ka darmiyani hissa.
  const R = 6371000, t = x => x * Math.PI / 180, h = Math.sin(t(c - a) / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(t(d - b) / 2) ** 2;
  // Aakhri doori nikaal kar wapas do.
  return 2 * R * Math.asin(Math.sqrt(h));
}

// classify(lat, lng) = customer ki jagah kaunse zone mein aati hai?
// Boundary ka usool: doori nazdeeki metre tak gol ki jati hai, aur agar jagah BILKUL zone ki sarhad par ho
// to usay andar wale (sasta) zone mein ginte hain. Is tarah kiraya hamesha ek hi aur saaf rehta hai.
function classify(lat, lng) {
  // b = branch, d = branch se customer ki doori (metres).
  const b = B(), d = Math.round(metres(b.lat, b.lng, lat, lng));
  // i = pehla zone jis ke radius ke andar d aata ho. (-1 ka matlab: kisi zone mein nahi, teeno se bahar.)
  return { d, i: b.zones.findIndex(z => d <= Math.round(z.radiusKm * 1000)) };
}

// renderMap() = chuni hui branch ka map aur legend dobara banata hai.
function renderMap() {
  // b = branch, el = map ka dabba.
  const b = B(), el = $("#map");
  // Pichli chuni hui location bhool jao, aur purana map ho to hata do.
  loc = null; pin = null; if (map) { map.remove(); map = null; }
  // Map ke upar likho kis branch ke zones hain.
  $("#dBranch").textContent = `Delivery zones for the ${b.name}`;
  // Legend (nishani ki list): har zone ka rangeen gol, naam aur kiraya. Zone 3 ka gol tooti hui line se (rang na dekh sakne walon ke liye).
  $("#legend").innerHTML = b.zones.map((z, i) => `<li><span class="sw" style="--c:${ZCOL[i]}" ${i === 2 ? "data-dash" : ""}></span>${z.label}: ${z.charge ? "Delivery charge — " + money(z.charge) : "Free delivery — Rs. 0"}${z.radiusKm ? ` (up to ${z.radiusKm} km)` : ""}</li>`).join("");
  // Agar map tayar nahi (coordinates ya radius nahi bhare):
  if (!mapReady(b)) {
    // "Map setup needed" ka dabba dikhao. Koi andaze se bani hui boundary nahi dikhate.
    el.innerHTML = `<div class="setup"><b>Map setup needed</b><p>This branch's exact location and approved zone sizes have not been provided yet, so no zone boundaries are shown. Your delivery charge will be confirmed by the branch on WhatsApp.</p></div>`;
    // Location ke buttons band karo (ctl(true)) aur samjhao.
    ctl(true);
    $("#zoneOut").textContent = "Delivery zone lookup is not set up yet.";
    $("#feeOut").textContent = "Delivery fee: to be confirmed by the branch on WhatsApp.";
    // Cart ka zone wala dabba bhi naye haal ke mutabiq banao aur yahin ruk jao.
    renderCart(); return;
  }
  // Map tayar hai: dabba khali karo aur buttons chalu karo (ctl(false)).
  el.innerHTML = ""; ctl(false);
  $("#zoneOut").textContent = "Tap the map, use your location or enter your address to see your delivery fee.";
  $("#feeOut").textContent = "Delivery fee: choose a location to see it.";
  // Leaflet library mangwao, phir map banao.
  loadLeaflet().then(() => {
    // Agar library aane tak customer ne doosri branch chun li to purana kaam chhod do.
    if (B() !== b) return;
    // Map banao branch ke markaz par, zoom 13 se shuru. scrollWheelZoom: false = page scroll karte waqt map ghoom kar zoom na ho.
    map = L.map(el, { scrollWheelZoom: false }).setView([b.lat, b.lng], 13);
    // Map ki tasveer ki parat (tiles) lagao aur credit likho.
    L.tileLayer(CONFIG.tileUrl, { attribution: CONFIG.tileAttribution, maxZoom: 19 }).addTo(map);
    // Branch ki jagah par pin (marker) lagao.
    L.marker([b.lat, b.lng], { title: b.name }).addTo(map);
    // Teeno zones ke gol (circles) banao. reverse = sab se bara pehle, taake chhote wale upar nazar aayein.
    [...b.zones.keys()].reverse().forEach(i => {
      // z = zone, r = us ka radius metres mein (km x 1000).
      const z = b.zones[i], r = z.radiusKm * 1000;
      // Rangeen gol: Zone 3 ki line tooti hui (dashArray). interactive: false = isay dabane se map ke click mein rukawat na ho.
      L.circle([b.lat, b.lng], { radius: r, color: ZCOL[i], weight: 3, dashArray: i === 2 ? "8 8" : null, fillOpacity: .08, interactive: false }).addTo(map);
      // Gol ke upar wale hisse par chhota label: "Zone 1: Rs. 0". (111320 metres = 1 degree latitude.)
      L.marker([b.lat + r / 111320, b.lng], { interactive: false, keyboard: false, icon: L.divIcon({ className: "", iconSize: [0, 0],
        html: `<span class="zl" style="--c:${ZCOL[i]}">${z.label}: ${money(z.charge)}</span>` }) }).addTo(map);
    });
    // Map ko aise zoom karo ke sab se bara gol poora nazar aaye.
    map.fitBounds(L.circle([b.lat, b.lng], { radius: b.zones[2].radiusKm * 1000 }).getBounds());
    // Map par jahan customer dabaye wahan ki jagah chun lo.
    map.on("click", e => setLoc(e.latlng.lat, e.latlng.lng));
  // Agar library download na ho saki (internet masla) to dostana message dikhao.
  }).catch(() => { el.innerHTML = `<div class="setup"><b>Map could not load</b><p>Check your internet connection and reload. You can still enter coordinates, or the branch will confirm your delivery charge on WhatsApp.</p></div>`; });
}

// setLoc(lat, lng) = customer ki jagah chuno: zone dhoondo, kiraya dikhao, pin lagao, cart naya karo.
function setLoc(lat, lng) {
  // Agar map tayar hi nahi to kuch mat karo.
  const b = B(); if (!mapReady(b)) return;
  // r = {doori, zone number}. km = doori kilometre mein (ek ashariya tak).
  const r = classify(lat, lng), km = (r.d / 1000).toFixed(1);
  // Yaad rakho: customer ki jagah aur uska zone.
  loc = { lat, lng, ...r };
  // zz = customer ka zone (agar kisi zone mein ho).
  const zz = b.zones[r.i];
  // Bara likha hua kiraya: zone mein ho to "Delivery fee: Rs. 100" (ya Free), warna "branch confirm karegi".
  $("#feeOut").textContent = r.i >= 0 ? `Delivery fee: ${zz.charge ? money(zz.charge) : "Free (Rs. 0)"}` : "Delivery fee: to be confirmed by the branch on WhatsApp";
  // Map par pin: pehle se hai to usay hilao, warna naya gol nishan banao.
  if (map) { if (pin) pin.setLatLng([lat, lng]); else pin = L.circleMarker([lat, lng], { radius: 9, color: "#fff", weight: 3, fillColor: "#D9702B", fillOpacity: 1 }).addTo(map); }
  // z = wohi zone (naam dobara chhota kiya taake neeche saaf parha jaye).
  const z = b.zones[r.i];
  // Samjhane wala message: kis zone mein hai aur kitna door; ya teeno zones se bahar hai to free nahi maante.
  $("#zoneOut").textContent = r.i >= 0
    ? `Your pin is in ${z.label}, about ${km} km from the branch. Delivery charge: ${z.charge ? money(z.charge) : "Rs. 0 (free)"}. A point exactly on a boundary counts as the inner zone.`
    : `Your pin is about ${km} km away, outside our three delivery zones. Delivery availability and the charge must be confirmed by the branch on WhatsApp. We do not assume free delivery.`;
  // Cart ko nayi kiraya ke saath dobara banao.
  renderCart();
}

// findAddress() = "Enter Delivery Address": customer jo address likhe usay map ke point mein badalta hai
// (is kaam ko "geocoding" kehte hain), phir zone aur kiraya nikalta hai.
// "async" = yeh function internet ka intezar kar sakta hai bina baaqi website ko rok kar.
async function findAddress() {
  // q = customer ka likha hua address (aage peeche ki khali jagah hata kar).
  const q = $("#addrIn").value.trim();
  // Agar 4 harf se kam likha to pehle poora likhne ko kaho.
  if (q.length < 4) { $("#zoneOut").textContent = "Type your street, area or landmark first."; return; }
  // Customer ko batao ke dhoondh rahe hain.
  $("#zoneOut").textContent = "Searching for your address…";
  try {
    // Search service se poochho. ", Karachi" jod dete hain taake Karachi mein hi dhoondhe. countrycodes=pk = sirf Pakistan.
    const r = await fetch(`${CONFIG.geocodeUrl}?format=jsonv2&limit=1&countrycodes=pk&q=${encodeURIComponent(q + ", Karachi")}`, { headers: { Accept: "application/json" } });
    // Jawab ko parho (json = data likhne ka aam tareeqa).
    const j = await r.json();
    // Agar kuch na mila to madad ke mashware do.
    if (!j.length) { $("#zoneOut").textContent = "We could not find that address. Try a nearby landmark, tap the map to drop a pin, or use your location."; return; }
    // Pehla nateeja: uski lat aur lng (+ number banata hai).
    const lat = +j[0].lat, lng = +j[0].lon;
    // Jagah chuno, aur map ho to us par zoom karo (15 = gali ke qareeb).
    setLoc(lat, lng); if (map) map.setView([lat, lng], 15);
    // Order form ka address box khali ho to wahan bhi yehi address bhar do (customer ko dobara na likhna pade).
    if (!$("#oAddr").value) $("#oAddr").value = q;
    // Message: "Mil gaya: ..." phir zone ka message, aur yaad dihani ke pin hilaya ja sakta hai.
    $("#zoneOut").textContent = `Found: ${j[0].display_name}. ${$("#zoneOut").textContent} Not exactly right? Tap the map to move the pin.`;
  // Agar internet ya service mein masla ho to dostana message.
  } catch { $("#zoneOut").textContent = "Address search is not available right now. Tap the map, use your location or enter coordinates."; }
}


/* =====================================================================
   HISSA 14: Events (jab customer kuch dabaye ya likhe to kya ho)
   ===================================================================== */

// setBranch(k) = branch badlo. Agar cart mein cheezein hain to pehle poochho (kyunke har branch ka menu aur daam alag hai).
function setBranch(k) {
  // Wohi branch dobara chuni to kuch mat karo.
  if (k === key) return;
  // Cart khali nahi hai to pooch kar tasdeeq lo: "Cancel" par ruk jao (cart dekhne ka moqa), "OK" par badlo.
  if (cart.length && !confirm(`Your cart belongs to the ${B().name}. Menus and prices differ by branch, so switching to the ${BRANCHES[k].name} will clear it. Press Cancel to review your cart first, or OK to switch.`)) return;
  // Nayi branch yaad rakho (browser ki yaaddasht mein bhi), cart khali karo, category "All" aur search saaf karo.
  key = k; store.set("cj-branch", k); cart = []; cat = "All"; query = ""; $("#q").value = "";
  // Sab kuch nayi branch ke hisaab se dobara banao.
  renderBranch(); renderMenu(); renderCart();
}

// Poore page par ek hi "kaan" (click listener): jo bhi button dabaya jaye, yeh dekhta hai ke woh kis kaam ka hai.
// Is tareeqe (event delegation) se nayi bani hui cheezon (jaise menu ke buttons) par bhi kaam chalta hai.
document.addEventListener("click", e => {
  // t = dabaye gaye kisi button ko dhoondo (closest = qareeb tareen). Button na ho to chhor do.
  const t = e.target.closest("button"); if (!t) return;
  // data-b wala = branch ka button.
  if (t.dataset.b) setBranch(t.dataset.b);
  // data-cat wala = menu category ka button: category chuno aur menu dobara banao.
  else if (t.dataset.cat) { cat = t.dataset.cat; renderMenu(); }
  // data-g wala = gallery filter ka button.
  else if (t.dataset.g) { galCat = t.dataset.g; renderGallery(); }
  // data-lb wala = gallery ki photo: bari karke kholo.
  else if (t.dataset.lb !== undefined) openLb(+t.dataset.lb);
  // data-c wala = menu ka item: popup kholo.
  else if (t.dataset.c) openItem(t.dataset.c, t.dataset.i);
  // data-d wala (cart ke andar) = quantity kam/zyada/hataane ka button.
  else if (t.dataset.d !== undefined && t.closest("#cartLines")) {
    // i = cart ki kaunsi line, d = badlao (-1 kam, +1 zyada, 0 hata do).
    const i = +t.dataset.i, d = +t.dataset.d;
    // d = 0 ho to line hata do (splice = list se nikalo); warna quantity badlo, aur 1 se kam ho jaye to bhi hata do.
    if (d === 0) cart.splice(i, 1); else { cart[i].qty += d; if (cart[i].qty < 1) cart.splice(i, 1); }
    // Cart naye sire se banao.
    renderCart();
  }
});

// Menu ke search box mein kuch likha jaye to query yaad rakho aur menu dobara chhaan do.
$("#q").addEventListener("input", e => { query = e.target.value.trim(); renderMenu(); });
// FAQ ke search box mein likha jaye to FAQ dobara chhaan do.
$("#faqQ").addEventListener("input", renderFaq);
// Item popup mein quantity ka number haath se likha jaye to kul daam update karo.
$("#itQty").addEventListener("input", updTotal);
// Size (radio) badli jaye to kul daam update karo.
$("#itOpts").addEventListener("change", updTotal);
// "−" button = quantity 1 kam, "+" button = quantity 1 zyada.
$("#qMinus").onclick = () => stepQty(-1);
$("#qPlus").onclick = () => stepQty(1);
// Item popup ka "Close" button.
$("#itClose").onclick = () => $("#itemDlg").close();

// "Add to cart" dabane par:
$("#addBtn").onclick = () => {
  // k = kaunsa size chuna, q = quantity (1 se 20 ke andar).
  const k = +$("input[name=opt]:checked").value, q = Math.max(1, Math.min(20, +$("#itQty").value || 1));
  // cc, it = khula hua item ki category aur item. id = is item+size ka khaas "pehchan" text.
  // ex = agar yehi item+size pehle se cart mein hai to wohi line.
  const { cc, it } = cur, id = `${cc.name}|${it.name}|${k}`, ex = cart.find(x => x.id === id);
  // Pehle se hai to sirf quantity badhao, warna nayi line cart mein jodo.
  if (ex) ex.qty += q;
  else cart.push({ id, name: `${it.name} (${cc.name})`, label: it.prices.length > 1 ? cc.labels[k] : "", price: it.prices[k], qty: q });
  // Popup band karo aur cart naya banao.
  $("#itemDlg").close(); renderCart();
};

// Header ka cart button: cart naya banao aur cart ka popup kholo.
$("#cartBtn").onclick = () => { renderCart(); $("#cartDlg").showModal(); };
// Cart popup ka band karne wala (✕) button.
$("#cartClose").onclick = () => $("#cartDlg").close();
// Neeche "View cart" bar dabane par wohi kaam jo header ke cart button se hota hai.
$("#cartBar").onclick = () => $("#cartBtn").click();
// Order type (Delivery/Takeaway/Dine-in) badle to cart dobara banao (zone aur address ka dabba dikhana/chhupana).
$("#oType").onchange = renderCart;

// Order form "submit" hone par (Place order via WhatsApp):
$("#orderForm").addEventListener("submit", e => {
  // preventDefault = page ko dobara load hone se roko (hum khud sambhalenge).
  e.preventDefault();
  // Cart khali ho to order mat bhejo.
  if (!cart.length) { $("#orderMsg").textContent = "Add at least one item before ordering."; return; }
  // Order bhejo (WhatsApp ya form service par).
  deliver("order", {}, orderText(), $("#orderMsg"), "");
});

// Review form submit hone par: data ikatha karo aur bhejo. Review "moderation" mein jata hai (pehle staff dekhega).
$("#revForm").addEventListener("submit", e => {
  e.preventDefault();
  // f = form ke saare khaane (naam, rating, review) ek dabbe mein.
  const f = Object.fromEntries(new FormData(e.target));
  deliver("review", f, `*Review for moderation: Chai Jan, ${B().name}*\nName: ${f.name}\nRating: ${f.stars}/5\nReview: ${f.text}`,
    $("#revMsg"), "Thanks! Your review is pending moderation and will appear once approved.");
});

// Table request form submit hone par: data ikatha karo aur bhejo. Yeh sirf "request" hai, tasdeeq staff karega.
$("#resForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  deliver("reservation", f, `*Table request: Chai Jan, ${B().name}*\nDate: ${f.date}\nTime: ${f.time}\nGuests: ${f.guests}\nName: ${f.name}\nPhone: ${f.phone}\n(Request only, please confirm.)`,
    $("#resMsg"), "Request received. It is not confirmed until our staff contact you.");
});

// Tareekh badle to us din ke hisaab se waqt ke options dobara banao.
$("#resDate").addEventListener("change", renderTimes);
// Guzri hui tareekh na chuni ja sake: sab se pehli tareekh "aaj" (Pakistan ke hisaab se). "en-CA" format saal-mahina-din deta hai.
$("#resDate").min = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date());

// "Use my current location" button dabane par:
$("#locBtn").onclick = () => {
  // Pehle page ko location wale dabbe tak scroll karo.
  goPick();
  // Agar browser location batana hi nahi jaanta to dusre tareeqe batao.
  if (!navigator.geolocation) { $("#zoneOut").textContent = "Your browser cannot share location. Tap the map or enter coordinates instead."; return; }
  // "Dhoondh rahe hain..." likho.
  $("#zoneOut").textContent = "Finding your location…";
  // Browser se location mango (customer se ijazat poochi jati hai).
  navigator.geolocation.getCurrentPosition(
    // Mil gayi: jagah chuno aur map us par le jao (zoom 14).
    p => { setLoc(p.coords.latitude, p.coords.longitude); if (map) map.setView([p.coords.latitude, p.coords.longitude], 14); },
    // Na mil saki (ijazat nahi di ya masla): madad ka message.
    () => { $("#zoneOut").textContent = "We could not get your location. Tap the map or enter coordinates instead."; });
};

// "Enter Delivery Address" button dabane par: address likhne ka dabba kholo, scroll karo, aur likhne wali jagah par cursor rakho.
$("#addrBtn").onclick = e => {
  // hidden = false matlab dabba nazar aaye. aria-expanded="true" screen readers ko batata hai ke dabba khul gaya.
  $("#addrBox").hidden = false; e.currentTarget.setAttribute("aria-expanded", "true");
  // focus = likhne wali jagah par cursor. preventScroll = focus karte waqt page ko dobara na hilao.
  goPick(); $("#addrIn").focus({ preventScroll: true });
};
// Address form submit (Find button ya Enter) hone par address dhoondo.
$("#addrForm").addEventListener("submit", e => { e.preventDefault(); findAddress(); });

// "Check my zone" (coordinates se) button dabane par:
$("#coordBtn").onclick = () => {
  // la = latitude, ln = longitude (jo customer ne likhe, number banaye).
  const la = parseFloat($("#latIn").value), ln = parseFloat($("#lngIn").value);
  // Latitude -90 se 90 aur longitude -180 se 180 ke andar honi chahiye, warna ghalat likha hai.
  if (!(la >= -90 && la <= 90 && ln >= -180 && ln <= 180)) { $("#zoneOut").textContent = "Enter valid latitude and longitude numbers."; return; }
  // Sahi hai: jagah chuno aur map us par le jao.
  setLoc(la, ln); if (map) map.setView([la, ln], 14);
};

// Cart ke zone wale dabbe mein "Set it on the map" link dabane par cart popup band karo (taake map nazar aaye).
$("#zoneWrap").addEventListener("click", e => { if (e.target.closest("a")) $("#cartDlg").close(); });

/* DISABLED - FUTURE REFERENCE: Pause/Play behavior for the closed bar.
// Upar wali "closed" bar ka Pause/Play button: slide rokne par message saaf parha ja sakta hai.
$("#barPause").onclick = e => {
  // toggle = class lagao agar nahi hai, hata do agar hai. paused = ab ruka hua hai ya nahi.
  const paused = $("#closedBar").classList.toggle("paused");
  // Screen reader ko batao, aur button par naya naam likho.
  e.currentTarget.setAttribute("aria-pressed", paused);
  e.currentTarget.textContent = paused ? "Play" : "Pause";
};
*/

// setTheme(t) = rang ka mode badlo: "dark" (andhera) ya "light" (roshan).
function setTheme(t) {
  // Page par theme lagao (CSS isi se rang badalti hai) aur choice yaad rakho.
  document.documentElement.dataset.theme = t; store.set("cj-theme", t);
  // b = theme ka button. Dark mode mein button par suraj (☀) dikhao (roshan par jane ke liye), warna chand (☾).
  const b = $("#themeBtn"); b.querySelector(".ico").textContent = t === "dark" ? "☀" : "☾";
  // Screen reader ke liye button ka naam bhi badlo.
  b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
}
// Theme button dabane par ulta mode lagao (dark hai to light, light hai to dark).
$("#themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");


/* =====================================================================
   HISSA 15: Shuru karna (Start)
   Upar sab cheezein bana li gayin. Ab yahan se asal kaam shuru hota hai.
   ===================================================================== */

// Theme lagao: customer ne pehle jo chuna wohi, warna dark (restaurant ki garam, dheemi roshni se milta).
setTheme(store.get("cj-theme", "dark"));
// Pehli baar sab hisse screen par banao: branch, menu, cart, reviews, gallery, FAQ.
renderBranch(); renderMenu(); renderCart(); renderReviews(); renderGallery(); renderFaq();
// Har 30 second baad "khuli ya band" dobara dekho (waqt guzarta rehta hai). 30000 milliseconds = 30 second.
setInterval(renderStatus, 30000);

// Gallery ki bari photo ke "Previous", "Next" aur "Close" buttons.
$("#lbPrev").onclick = () => openLb(lbI - 1);
$("#lbNext").onclick = () => openLb(lbI + 1);
$("#lbClose").onclick = () => $("#lbDlg").close();


/* =====================================================================
   HISSA 16: Khoobsurat effects (glow, ubharna, parallax, magnet)
   Lenis jaisi bhari library ki jagah halka tareeqa use kiya hai:
   CSS ka smooth scroll aur IntersectionObserver (jo batata hai ke koi cheez screen par aayi ya nahi).
   Is se koi extra file download nahi hoti aur website tez rehti hai.
   ===================================================================== */
(function () {
  // reduce = kya customer ne "animation kam karo" ka option chuna hai?
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // EFFECT 1: cursor ke saath chalne wali roshni (glow). Mouse jis card/item par ho, usme roshni uske neeche chalti hai.
  document.addEventListener("pointermove", e => {
    // t = mouse ke neeche wala item ya card (closest = qareeb tareen). Na ho to kuch na karo.
    const t = e.target.closest && e.target.closest(".item,.card");
    if (!t) return;
    // r = us cheez ki jagah aur size. Mouse ki jagah usi cheez ke andar nikalo (--mx, --my) aur CSS ko de do.
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px"); t.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  // Agar customer ne animation kam karne ko kaha hai to baaqi effects na lagao, yahin ruk jao.
  if (reduce) return;

  // EFFECT 2: sections scroll karte hi dheere se upar ubharte hain.
  // IntersectionObserver = nigehbaan jo batata hai ke koi cheez screen mein aayi.
  // Jab aaye to "in" class lagao (CSS usay nazar aane wala banati hai) aur nigrani band karo (unobserve).
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { rootMargin: "0px 0px -8% 0px" });
  // Har section (hero aur map ke dabbe ke ilawa) ki cheezon par "rv" class lagao (shuru mein chhupi hui) aur nigrani shuru karo.
  $$("main section:not(.hero) > .wrap > *:not(.dgrid)").forEach(el => { el.classList.add("rv"); io.observe(el); });

  // EFFECT 3: parallax. Scroll karne par hero ki photo dheere sarakti hai aur arch ulti taraf, jis se gehraai ka ehsaas hota hai.
  // bg = hero ki peeche wali photo, arch = arch wali photo, busy = abhi kaam chal raha hai? (bar bar na chalaye).
  const bg = $(".hero-bg"), arch = $(".arch"); let busy = false;
  addEventListener("scroll", () => {
    // Agar pehle ka kaam chal raha hai to dobara shuru mat karo.
    if (busy) return; busy = true;
    // Agle refresh par ek hi baar hisaab lagao (smooth rehta hai).
    requestAnimationFrame(() => {
      // y = page abhi kitna neeche scroll hua hai.
      const y = scrollY;
      // Sirf jab hero screen ke qareeb ho tab hilao (baaqi waqt ka bekaar kaam bachao).
      if (y < innerHeight * 1.3) { bg.style.transform = `translate3d(0,${y * .22}px,0)`; if (arch) arch.style.transform = `translate3d(0,${-y * .05}px,0)`; }
      // Kaam khatam, ab agla scroll sambhal sakte hain.
      busy = false;
    });
  }, { passive: true });

  // EFFECT 4: "magnetic" buttons. Mouse button ke qareeb aaye to button halka sa mouse ki taraf khinchta hai.
  // Sirf us device par jis par mouse (hover) ho. Touch phone par yeh nahi chalta.
  if (matchMedia("(hover: hover)").matches) $$(".mag").forEach(b => {
    // Mouse button ke upar hile to button ko mouse ki taraf thoda sarkao (beech se faasle ka 25% aur 35%).
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    // Mouse hat jaye to button wapas apni jagah.
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
})();
