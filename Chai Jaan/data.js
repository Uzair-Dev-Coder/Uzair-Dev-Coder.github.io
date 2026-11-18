/* =====================================================================
   data.js  —  Chai Jan ka SAARA business content yahan hai
   =====================================================================
   Yeh file ek "almari" ki tarah hai jismein dukaan ki saari cheezein rakhi hain:
   address, phone number, kholne/band hone ka waqt, menu ke daam (prices),
   reviews, photos aur FAQ.

   Agar kuch badalna ho (jaise kisi cheez ka daam), to SIRF isi file mein badlein.
   app.js ko chhedne ki zaroorat nahi, wo is file se khud parh leta hai.

   Zaroori: Is file ke saare comments (jo // ya slash-star se shuru hote hain) hata do to bhi website chalegi,
   comments sirf samajhne ke liye hain, computer unhein ignore kar deta hai.
   ===================================================================== */


/* ---------------------------------------------------------------------
   CONFIG = poori website ki "settings"
   Yeh woh cheezein hain jo har branch ke liye ek jaisi hoti hain.
   --------------------------------------------------------------------- */
const CONFIG = {
  // WhatsApp number jis par orders jayenge.
  // Rule: pehle country code (Pakistan ka 92), phir number. "+" ya space NAHI likhna.
  whatsapp: "923284400999",

  // Yahan kisi form service ka link lagate hain (jaise Formspree) taake reviews aur
  // table requests seedha aap tak pahunchen. Khali "" ho to forms WhatsApp se bhej diye jate hain.
  formEndpoint: "",

  // Yahan "kul kitne reviews hain" likhna hai, lekin sirf jab pakka pata ho.
  // Abhi pakka nahi pata, isliye khali chhora hai (galat number dikhana theek nahi).
  reviewCountNote: "",

  // Map ki tasveer ("tiles") kahan se aayengi. OpenStreetMap muft hai aur key nahi maangta.
  // {z}/{x}/{y} ka matlab hai zoom aur jagah: map khud inhein bhar leta hai.
  tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",

  // Map ke neeche chhota sa credit likhna zaroori hai (OpenStreetMap ka rule).
  tileAttribution: "&copy; OpenStreetMap contributors",

  // Address search ke liye service. Customer "Shah Faisal Colony" likhe to yeh service
  // usay map ke point (latitude/longitude) mein badal deti hai. Zyada visitors hon to
  // yahan apni paid service ka link lagayen.
  geocodeUrl: "https://nominatim.openstreetmap.org/search"
};


/* ---------------------------------------------------------------------
   BRANCHES = dono branches ki alag alag maloomat

   "hours" kaise likhte hain? Har din ke liye ek jora [kholne ka waqt, band hone ka waqt].
   Waqt 24 ghante wali ghari mein aur decimal mein likhte hain:
       17    = shaam 5:00 PM
       17.5  = shaam 5:30 PM
   Raat 12 baje ke BAAD ka waqt 24 se bada likhte hain:
       25 = raat 1:00 AM,  27 = raat 3:00 AM,  27.5 = raat 3:30 AM,  28 = raat 4:00 AM
   Saat dino ki list ka order: [Itwaar, Peer, Mangal, Budh, Jumerat, Jumma, Hafta]
       index 0 = Sunday, 1 = Monday ... 6 = Saturday
   --------------------------------------------------------------------- */
const BRANCHES = {

  /* ===================== BRANCH 1: SHAH FAISAL ===================== */
  shahfaisal: {
    // Branch ka naam jo website par dikhta hai.
    name: "Shah Faisal Branch",

    // Poora address jo hero section aur footer mein dikhta hai.
    address: "Sb-1 Maaz Garden, Adjacent KE Grid Station, Shahfaisal Town Road, Gulistan-e-Malir, Gulshan-e-Rafi, Shah Faisal Colony, Karachi.",

    // Phone number jo customer dabaye to seedha call lag jaye.
    phone: "+92 328 4400999",

    // Is branch ke orders is WhatsApp number par jate hain.
    whatsapp: "923284400999",

    // MAP SETUP: lat = latitude (uttar-dakshin ki jagah), lng = longitude (poorab-pachham ki jagah).
    // "null" ka matlab hai "abhi pata nahi". Business se asli coordinates milne par
    // yahan number likhein (Google Maps par branch par right-click karke copy ho jate hain).
    // Jab tak null hain, map ki jagah "Map setup needed" ka message dikhta hai. Hum andaza nahi lagate.
    lat: null, lng: null,

    // Google par branch ki rating (business ne yeh bataya hai).
    rating: "4.4 / 5 on Google, 100+ reviews (supplied by the business)",

    // Kholne aur band hone ka waqt, 7 dino ke liye (upar samjhaya hua tareeqa).
    // Itwaar 5PM-3AM | Peer se Jumerat 5PM-3AM | Jumma aur Hafta 5PM-4AM
    hours: [[17,27],[17,27],[17,27],[17,27],[17,27],[17,28],[17,28]],

    // Delivery ke 3 zones. charge = delivery ka kiraya (Rs.), radiusKm = branch se kitne km tak.
    // radiusKm abhi null hai kyunke business ne zones ka size nahi bataya.
    // Rule: Zone 1 sab se chhota, Zone 2 us se bara, Zone 3 sab se bara (radius barhta jaye).
    zones: [{label:"Zone 1",charge:0,radiusKm:null},{label:"Zone 2",charge:100,radiusKm:null},{label:"Zone 3",charge:200,radiusKm:null}],

    // MENU ka tareeqa (app.js is text ko parh kar menu bana deta hai):
    //   "# Burgers"                  -> # se nayi category (hissa) shuru hoti hai.
    //   "Classic Zinga:550"          -> cheez ka naam, colon (:), phir daam.
    //   ";" (semicolon)              -> do cheezon ke beech alag karne ke liye.
    //   "Strawberry:200/380"         -> do sizes: pehla daam pehle size ka, doosra doosre ka.
    //   "# Waffles [Single/Double]"  -> square bracket mein un sizes ke naam likhte hain.
    // Naya item jodna ho to bas isi tareeqe se ek naya "Naam:daam" likh dein.
    menu: `
# Burgers
Classic Zinga:550;Korean Zinga:590;Thai Zinga:590;Smashed Classic Beef:790;Smashed Mushroom Beef:790
# Sandwiches & Wraps
Chipotle Feast Sandwich:760;Cocktail Sandwich:670;Crispo Peri Peri Wrap:530;Crispo Chilli Blast Wrap:530
# Chicken Strips
Fried Chicken Strips:490;Nashville Chicken Fingers:620;Sweet Chilli Chicken Strips:580
# Loaded Fries
Plain Fries:390;Smoky Kick Loaded Fries:490;Smoky Sriracha Fries:490;Crispy Sriracha Fries:490
# Wings
Korean Wings:430;Peri Peri Wings:430;Cocktail Fried Chicken Wings:430
# Special Chaat
Pani Puri:390;Meethi Puri:390;Gappa Gotala:590;Samosa Chaat:320;Chai Jan Special Chaat:460;Bhalla Spicy Chaat:390;Mix Chaat:360;Chana Chaat:360;Dahi Bary:320
# Chai Jan
Doodh Patti:160;Karak Tea:160;Cardamom Tea:190;Cinnamon Tea:190;Green Tea:130;Lemon Grass:130;Black Tea:130
# Paratha
Lachha Paratha:120;Beef Lachha Paratha:590;Aalu Paratha:290;Aalu Cheese Paratha:390;Cheese Paratha:330;BBQ Chicken Paratha:440;BBQ Chicken Cheese:550;Pizza Paratha:610;Chocolate Paratha:390
# Eggs
Omelette:120;Special Omelette:210;Half Fry:120
# Mocktails
Mint Lemonade:390;Mint Margarita:390;Lemon Margarita:390;Strawberry Margarita:430;Blue Margarita:430;Pina Colada:590;Peach Colada:590;Strawberry Colada:590;Cold Coffee:670;Blue Lagoon:430;Peach Ice Tea:440;Strawberry Ice Tea:440
# Smoothies
Strawberry Smoothie:510;Blueberry Smoothie:510;Peach Smoothie:510;Meethi Lassi:290;Namkeen Lassi:290
# Ice Cream Shakes
Vanilla Shake:530;Chocolate Shake:560;Strawberry Shake:560;Oreo Shake:590;KitKat Shake:660
# Ice Cream [Single Scoop/Double Scoop]
Strawberry:200/380;Vanilla:200/380;Chocolate:200/380
# Waffles [Single/Double]
KitKat:700/850;Oreo:700/850;Lotus:700/850;Choco-crispies:700/850
# Hot Coffee
Cappuccino Coffee:430;Cafe Latte:430;Americano:300;Espresso:220;Caramel:560;Vanilla:560;Hazelnut:560
# Ice Coffee
Cappuccino Coffee:510;Cafe Latte:510;Caramel:590;Vanilla:580;Hazelnut:590
# Frappe
Caramel:790;Vanilla:780;Hazelnut:790
# Beverages
Mineral Water Small:80;Mineral Water Large:120;Soft Drinks:100`
  },


  /* ================= BRANCH 2: MAIN NATIONAL HIGHWAY ================= */
  highway: {
    // Branch ka naam jo website par dikhta hai.
    name: "Main National Highway Branch",

    // Poora address.
    address: "Main National Highway, Malir City Road, near Gevini Foods, Karachi.",

    // TODO (karne wala kaam): agar is branch ka alag phone number hai to yahan likhein.
    phone: "+92 328 4400999",

    // TODO (karne wala kaam): agar is branch ka alag WhatsApp number hai to yahan likhein.
    whatsapp: "923284400999",

    // TODO (karne wala kaam): business se asli coordinates lekar yahan likhein.
    lat: null, lng: null,

    // Is branch ki pakki rating abhi nahi mili, isliye khali "" hai. Rating banane ki koshish nahi ki.
    rating: "",

    // Kholne/band hone ka waqt: Itwaar 6PM-3:30AM | Peer se Jumerat 6PM-2:30AM | Jumma, Hafta 6PM-3:30AM
    hours: [[18,27.5],[18,26.5],[18,26.5],[18,26.5],[18,26.5],[18,27.5],[18,27.5]],

    // Delivery zones (radius abhi pata nahi, isliye null).
    zones: [{label:"Zone 1",charge:0,radiusKm:null},{label:"Zone 2",charge:100,radiusKm:null},{label:"Zone 3",charge:200,radiusKm:null}],

    // Is branch ka alag menu aur alag daam. Likhne ka tareeqa wohi hai jo upar samjhaya gaya.
    menu: `
# Chai Jan / Special Teas
Doodh Patti:140;Karak Tea:140;Cardamom Tea:170;Cinnamon Tea:160;Green Tea:120;Lemon Grass:120;Black Tea:120
# Paratha
Lachha Paratha:90;Beef Lachha Paratha:550;Aalu Paratha:210;Aalu Cheese Paratha:320;Cheese Paratha:270;BBQ Chicken Paratha:380;BBQ Chicken Cheese Paratha:490;Pizza Paratha:510;Chocolate Paratha:290;Nutella Paratha:260;Peanut Butter Paratha:280
# Eggs
Omelette:100;Special Omelette:180;Half Fry:100
# Ice Cream Shakes
Vanilla Shake:410;Chocolate Shake:430;Strawberry Shake:430;Fresh Banana Shake:310;Oreo Shake:490;Kitkat Shake:530
# Mocktails
Mint Lemonade:240;Mint Margarita:240;Lemon Margarita:240;Strawberry Margarita:270;Blue Margarita:270;Pina Colada:450;Peach Colada:450;Strawberry Colada:450;Cold Coffee:490;Blue Lagoon:270;Load Shedding:240
# Smoothies & Lassi
Strawberry Smoothie:350;Blueberry Smoothie:350;Peach Smoothie:350;Meethi Lassi:210;Namkeen Lassi:190
# Hot Beverages
Cappuccino:300;Mochaccino:410;Spanish Latte:360;Latte:300;Hot Chocolate:270;Americano:280;Espresso Coffee:280;Black Coffee:230
# Cold Beverages
Mineral Water Small:80;Mineral Water Large:120;Soft Drinks:100
# Biscuits & Bakery
Zeera Biscuit (250 gm):285;Marble Biscuit (250 gm):285;Jam Biscuit (250 gm):285;Chocolate Biscuit (250 gm):285;Coffee Biscuit (250 gm):285;Cake Rusk (250 gm):300;Almond Nankhatai (250 gm):340;Besan Nankhatai (250 gm):340;Choco Pop:60;Sprinkles Pop:60
# Brownies & Puffs
Choco Chunks Brownie:170;Nutella Brownie:200;Plain Brownie:150;Walnut Brownie:200;Death By Chocolate Brownie:150;Sugar Puff (100 gm):120;White Sesame Puff (100 gm):120;Chicken Patties:90;Vegetable Patties:80
# Cakes & Specials
Double Chocolate Cake Small:850;Double Chocolate Cake Medium:1600;Black Forest Cake Small:695;Black Forest Cake Medium:1400;D Shape Pineapple Cake:450;Nutella Cake Small:950;Nutella Cake Medium:1800;Chocolate Malt Cake Small:900;Chocolate Malt Cake Medium:1700;Blueberry Cheese Cake Mini:240;Chocolate Mousse Cake Mini:290;Three Milk Cake Small:900;Three Milk Cake (200 gm):250;Plain Cake (200 gm):240;Cup Cake (4 Pieces):240;Tabarak Roti:80
# Ice Cream & Gola Ganda [Single Scoop/Double Scoop]
Strawberry Ice Cream:150/270;Vanilla Ice Cream:150/270;Chocolate Ice Cream:150/270;Gola Ganda:320;Gola Ganda Small:210`
  }
};


/* ---------------------------------------------------------------------
   DESCRIPTIONS = khane ki cheezon ka chhota sa bayan (jab customer item kholta hai)
   Abhi business ne koi description nahi di, isliye yeh list khali hai
   aur website "Description coming soon" likhti hai. Hum khud se kuch nahi banate
   (galat ingredients ya allergy ki baat likhna khatarnak ho sakta hai).
   Likhne ka tareeqa:  "branchKey|Item ka Naam": "description yahan",
   --------------------------------------------------------------------- */
const DESCRIPTIONS = {
  // "shahfaisal|Karak Tea": "Yahan business ki di hui description likhein."
};


/* ---------------------------------------------------------------------
   REVIEWS = customers ke asli reviews
   Sirf wohi reviews hain jo business ne diye. Naye review khud se mat banana.
   name = customer ka naam, stars = 1 se 5 tak, text = unhon ne kya likha.
   --------------------------------------------------------------------- */
const REVIEWS = [
  {name:"Muhammad", stars:5, text:"Best..♥️🔥"},
  {name:"Ausaf", stars:5, text:"Kya mzydaaar paratha tha bhaee mazza agaya 🙏🙏🙏❤️❤️❤️"},
  {name:"Moon", stars:5, text:"Tea, or paking both are Soo good highly recommended Dil Khush krdia yr 😍"},
  {name:"Abdullah", stars:4, text:"First time try ki Maza agya."},
  {name:"YASIR", stars:4, text:"Bohat Aalaa chai cardamom tea."},
  {name:"Zeeshan", stars:4, text:"Taste is amazing ! Chai jan special chat and bbq cheese paratha was really good !"},
  {name:"Hira", stars:5, text:"Our chai jan never disappoint us❤️‍🔥 mother's day k lye three milk cake mngwaya tha buht delicious tha..."}
];


/* ---------------------------------------------------------------------
   GALLERY = photos ki list (images folder ki asli tasveerein)
   cat  = photo ki category (filter button ke liye: "Ambiance" ya "Chai")
   src  = photo ki file ka rasta (path)
   w, h = photo ki chaurai aur lambai (pixels). Browser ko pehle se pata ho to page hilta nahi.
   size = bento grid mein photo kitni bari dikhe:
            "big"  = 2 khane chaura aur 2 khane lamba
            "tall" = lambi (1 khana chaura, 2 khane lamba)
            "wide" = chauri (2 khane chaura, 1 khana lamba)
            ""     = normal chhoti photo
   alt  = photo ka bayan alfaaz mein (nabina log aur screen readers isay sunte hain,
          aur photo na khule to yehi likha nazar aata hai)
   --------------------------------------------------------------------- */
const GALLERY = [
  {cat:"Ambiance", src:"images/facade.webp",   w:1100, h:571, size:"big",  alt:"Chai Jan building glowing at sunset with a steaming cup in the foreground"},
  {cat:"Chai",     src:"images/cup.webp",      w:580,  h:770, size:"tall", alt:"Steaming cup of chai on a wooden table"},
  {cat:"Ambiance", src:"images/lounge.webp",   w:1100, h:408, size:"wide", alt:"Lantern-lit pergola seating at Chai Jan"},
  {cat:"Ambiance", src:"images/entrance.webp", w:590,  h:450, size:"",     alt:"Guests walking into Chai Jan along a lit pathway"},
  {cat:"Ambiance", src:"images/corridor.webp", w:600,  h:425, size:"",     alt:"Warmly lit entrance corridor at Chai Jan"}
];


/* ---------------------------------------------------------------------
   FAQ = aksar poochhe jane wale sawal aur unke jawab
   q = sawal (question), a = jawab (answer).
   Jin jawabon mein "being confirmed" likha hai, unka pakka pata lagne par unhein badal dein.
   --------------------------------------------------------------------- */
const FAQ = [
  {q:"What are your opening hours?", a:"Shah Faisal: Mon–Thu and Sun 5:00 PM–3:00 AM, Fri–Sat 5:00 PM–4:00 AM. Main National Highway: Mon–Thu 6:00 PM–2:30 AM, Fri–Sun 6:00 PM–3:30 AM."},
  {q:"Is parking available?", a:"Yes. Free street parking and a free parking lot are available."},
  {q:"Do you offer dine-in, takeaway and delivery?", a:"Yes, all three. Delivery charges depend on your zone: Rs. 0, Rs. 100 or Rs. 200."},
  {q:"Do you have vegetarian options?", a:"Vegetarian details are being confirmed. Please ask the branch about specific dietary needs before ordering."},
  {q:"Is Chai Jan suitable for children?", a:"Chai Jan is a casual place for friends, groups and families. Please contact the branch to confirm details for children."},
  {q:"Which payment methods do you accept?", a:"Payment methods are being confirmed. Please ask the branch when you order."}
];
