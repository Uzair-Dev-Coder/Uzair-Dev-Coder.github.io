/* Alpha Gelato — menu filters, quick views, and friendly form interactions. */

// Keep menu content in one place so products are easy to update without changing the layout.
const products = [
  {
    name: "Strawberry Ripple",
    type: "Gelato",
    category: "gelato",
    price: 100,
    unit: "cup",
    image: "assets/strawberry-ripple.jpg",
    alt: "Strawberry gelato in an Alpha Gelato cup",
    badge: "A LITTLE FRUITY",
    description: "Sweet strawberry, cream-soft gelato and a little swirl of berry joy."
  },
  {
    name: "Chocolate Chips",
    type: "Gelato",
    category: "gelato",
    price: 100,
    unit: "cup",
    image: "assets/chocolate-chips.jpg",
    alt: "Chocolate chip gelato in an Alpha Gelato cup",
    badge: "A CROWD FAVOURITE",
    description: "Cool, creamy and full of little chocolatey surprises."
  },
  {
    name: "Pistachio",
    type: "Gelato",
    category: "gelato",
    price: 100,
    unit: "cup",
    image: "assets/pistachio-gelato.jpg",
    alt: "Pistachio gelato in an Alpha Gelato cup",
    badge: "SOMETHING SPECIAL",
    description: "A gently nutty scoop with a lovely, slow-savouring finish."
  },
  {
    name: "King Kulfa",
    type: "Matka Falooda",
    category: "falooda",
    price: 350,
    unit: "matka",
    image: "assets/king-kulfa-falooda.jpg",
    alt: "A colourful King Kulfa matka falooda from Alpha Gelato",
    badge: "THE HOUSE FAVOURITE",
    description: "A joyful matka full of silky kulfa and all the good bits."
  },
  {
    name: "Strawberry Cheese Cake",
    type: "Matka Falooda",
    category: "falooda",
    price: 350,
    unit: "matka",
    image: "assets/strawberry-cheesecake-falooda.jpg",
    alt: "A strawberry falooda topped with fruit and nuts",
    badge: "A LITTLE EXTRA",
    description: "A berry-bright dessert moment with all the cheesecake feels."
  },
  {
    name: "Mango Shake",
    type: "Shake",
    category: "shakes",
    price: 300,
    unit: "glass",
    image: "assets/mango-shake.jpg",
    alt: "A pink fruit shake beside a green falooda in tall glasses",
    badge: "SUNSHINE IN A GLASS",
    description: "Thick, creamy and full of that golden mango goodness."
  },
  {
    name: "Pista Shake",
    type: "Shake",
    category: "shakes",
    price: 300,
    unit: "glass",
    image: "assets/pista-shake.jpg",
    alt: "A pistachio shake topped with crushed nuts",
    badge: "A LITTLE NUTTY",
    description: "Pistachio, crushed ice and a generous pour of happiness."
  },
  {
    name: "Chocolate Shake",
    type: "Shake",
    category: "shakes",
    price: 300,
    unit: "glass",
    image: "assets/chocolate-shake.jpg",
    alt: "A chocolate shake with chocolate sauce and chocolate pieces",
    badge: "CHOCOLATE, ALWAYS",
    description: "Deep cocoa, cold milk and absolutely no reason to share."
  }
];

const money = new Intl.NumberFormat("en-PK");
const productGrid = document.querySelector("#product-grid");
const cartToast = document.querySelector("#cart-toast");
const cartCount = document.querySelector("#cart-count");
const cartDialog = document.querySelector("#cart-dialog");
const cartList = document.querySelector("#cart-items");
const cart = new Map();
let toastTimer;

/** Render the requested menu category as accessible product cards. */
function renderProducts(filter = "all") {
  const cards = productGrid.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.category !== filter;
  });
}

function showToast(message) {
  cartToast.textContent = message;
  cartToast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => cartToast.classList.remove("show"), 2600);
}

// A visitor can pause the moving brand highlights without disabling reduced-motion settings.
const ticker = document.querySelector(".ticker");
const tickerToggle = document.querySelector(".ticker-toggle");
tickerToggle.addEventListener("click", () => {
  const isPaused = tickerToggle.getAttribute("aria-pressed") === "true";
  tickerToggle.setAttribute("aria-pressed", String(!isPaused));
  ticker.classList.toggle("is-paused", !isPaused);
  tickerToggle.textContent = isPaused ? "Pause highlights" : "Play highlights";
});

function addToOrder(product) {
  const quantity = cart.get(product.name) || 0;
  cart.set(product.name, quantity + 1);
  updateCart();
  cartCount.classList.remove("bump");
  // Restart the short badge animation after each item is added.
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
  const itemCount = getCartItemCount();
  document.querySelector(".cart-button").setAttribute("aria-label", `Your order, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
  showToast(`${product.name} added to your little order ♡`);
}

function getCartItemCount() {
  return [...cart.values()].reduce((total, quantity) => total + quantity, 0);
}

/** Update the visible order count, item list, and estimated menu total. */
function updateCart() {
  const entries = [...cart.entries()];
  const emptyMessage = document.querySelector("#cart-empty");
  const cartTotal = document.querySelector("#cart-total");
  const cartNote = document.querySelector("#cart-note");
  const copyButton = document.querySelector("#copy-order-message");
  const itemCount = getCartItemCount();
  const total = entries.reduce((sum, [name, quantity]) => {
    const product = products.find((item) => item.name === name);
    return sum + product.price * quantity;
  }, 0);

  cartCount.textContent = String(itemCount);
  emptyMessage.hidden = entries.length > 0;
  cartTotal.hidden = entries.length === 0;
  cartNote.hidden = entries.length === 0;
  copyButton.disabled = entries.length === 0;
  cartList.replaceChildren();
  cartTotal.textContent = `Estimated total: Rs ${money.format(total)}`;

  entries.forEach(([name, quantity]) => {
    const product = products.find((item) => item.name === name);
    const item = document.createElement("li");
    const details = document.createElement("span");
    const removeButton = document.createElement("button");
    details.className = "cart-line-details";
    details.textContent = `${product.name} × ${quantity} — Rs ${money.format(product.price * quantity)}`;
    removeButton.className = "cart-remove";
    removeButton.type = "button";
    removeButton.dataset.remove = name;
    removeButton.setAttribute("aria-label", `Remove one ${name}`);
    removeButton.textContent = "−";
    item.className = "cart-line";
    item.append(details, removeButton);
    cartList.append(item);
  });
}

// Menu filters update both the visible cards and the active tab state.
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    renderProducts(button.dataset.filter);
  });
});

// Product actions use one delegated listener because the cards are rebuilt by the filters.
const productDialog = document.querySelector("#product-dialog");
productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = products.find((item) => item.name === addButton.dataset.add);
    if (product) addToOrder(product);
    return;
  }
  const quickButton = event.target.closest("[data-quick-view]");
  if (!quickButton) return;
  const product = products.find((item) => item.name === quickButton.dataset.quickView);
  if (!product) return;
  document.querySelector("#dialog-title").textContent = product.name;
  document.querySelector("#dialog-description").textContent = product.description;
  document.querySelector("#dialog-price").textContent = `Rs ${money.format(product.price)} / ${product.unit}`;
  const image = document.querySelector("#dialog-image");
  image.src = product.image;
  image.alt = product.alt;
  document.querySelector("#dialog-add").onclick = () => {
    addToOrder(product);
    productDialog.close();
  };
  productDialog.showModal();
});

document.querySelector(".dialog-close").addEventListener("click", () => productDialog.close());
document.querySelector(".cart-button").addEventListener("click", () => {
  document.querySelector("#copy-order-message").textContent = "Copy order message";
  document.querySelector("#order-message-preview").hidden = true;
  updateCart();
  cartDialog.showModal();
});

cartDialog.querySelector(".dialog-close").addEventListener("click", () => cartDialog.close());
cartList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  const name = removeButton.dataset.remove;
  const quantity = cart.get(name) || 0;
  if (quantity <= 1) cart.delete(name);
  else cart.set(name, quantity - 1);
  updateCart();
});

document.querySelector("#copy-order-message").addEventListener("click", async () => {
  const orderLines = [...cart.entries()].map(([name, quantity]) => {
    const product = products.find((item) => item.name === name);
    return `${quantity} × ${product.name} — Rs ${money.format(product.price * quantity)}`;
  });
  if (orderLines.length === 0) return;
  const orderTotal = [...cart.entries()].reduce((sum, [name, quantity]) => {
    return sum + products.find((item) => item.name === name).price * quantity;
  }, 0);
  const message = [
    "Hi Alpha Gelato! I'd like to ask about this order:",
    ...orderLines,
    `Estimated menu total: Rs ${money.format(orderTotal)}`,
    "Please confirm availability, serving size, and final price."
  ].join("\n");
  const copyButton = document.querySelector("#copy-order-message");
  try {
    await navigator.clipboard.writeText(message);
    copyButton.textContent = "Order copied — paste it in WhatsApp";
  } catch {
    document.querySelector("#order-message-preview").value = message;
    document.querySelector("#order-message-preview").hidden = false;
    document.querySelector("#order-message-preview").focus();
    document.querySelector("#order-message-preview").select();
    copyButton.textContent = "Select and copy the message above";
  }
});

// Mobile navigation supports its toggle, link selection, outside taps, and Escape.
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  menuToggle.querySelector("use").setAttribute("href", isOpen ? "#i-menu" : "#i-close");
  mainNav.classList.toggle("open", !isOpen);
});
mainNav.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  closeMobileMenu();
});
document.addEventListener("click", (event) => {
  if (!mainNav.classList.contains("open")) return;
  if (event.target.closest(".main-nav, .menu-toggle")) return;
  closeMobileMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mainNav.classList.contains("open")) closeMobileMenu();
});

function closeMobileMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.querySelector("use").setAttribute("href", "#i-menu");
}

// Booking form: keep its date picker local to the visitor and update the guest count live.
const dateInput = document.querySelector("#event-date");
const localToday = new Date();
dateInput.min = new Date(localToday.getTime() - localToday.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const guestInput = document.querySelector("#guest-count");
guestInput.addEventListener("input", () => {
  document.querySelector("#guest-output").textContent = guestInput.value;
});

// Validate the required fields, then prepare a message the visitor can review and send in WhatsApp.
const bookingForm = document.querySelector("#booking-form");
const bookingFeedback = document.querySelector("#booking-feedback");
const confirmationDialog = document.querySelector("#confirmation-dialog");
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingFeedback.textContent = "";
  const name = bookingForm.elements.name.value.trim();
  const phone = bookingForm.elements.phone.value.trim();
  const date = bookingForm.elements.date.value;
  const phoneNumber = phone.replace(/[\s-]/g, "");
  const phoneIsValid = /^(?:\+92|0)3\d{9}$/.test(phoneNumber);
  const nameField = bookingForm.elements.name;
  const phoneField = bookingForm.elements.phone;
  const dateField = bookingForm.elements.date;
  [nameField, phoneField, dateField].forEach((field) => field.removeAttribute("aria-invalid"));

  if (!name) {
    nameField.setAttribute("aria-invalid", "true");
    bookingFeedback.textContent = "Please add your name.";
    nameField.focus();
    return;
  }
  if (!phone) {
    phoneField.setAttribute("aria-invalid", "true");
    bookingFeedback.textContent = "Please add your phone number.";
    phoneField.focus();
    return;
  }
  if (!phoneIsValid) {
    phoneField.setAttribute("aria-invalid", "true");
    bookingFeedback.textContent = "Enter a Pakistani mobile number, such as 03001234567 or +923001234567.";
    phoneField.focus();
    return;
  }
  if (!date) {
    dateField.setAttribute("aria-invalid", "true");
    bookingFeedback.textContent = "Please choose an event date.";
    dateField.focus();
    return;
  }

  if (date < dateInput.min) {
    dateField.setAttribute("aria-invalid", "true");
    bookingFeedback.textContent = "Pick today or a date in the future, and we'll take it from there.";
    dateField.focus();
    return;
  }

  const formData = new FormData(bookingForm);
  const reference = `AG-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const eventType = formData.get("eventType");
  const eventTime = formData.get("time");
  const dateLabel = new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date(`${date}T12:00:00`));
  const selectedPackages = formData.getAll("packages");
  const message = [
    "Hi Alpha Gelato! I'd like to ask about booking an event.",
    "",
    `Booking reference: ${reference}`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Event: ${eventType}`,
    `Date: ${dateLabel}`,
    `Preferred time: ${eventTime}`,
    `Guests: ${formData.get("guests")}`,
    `Interested in: ${selectedPackages.length ? selectedPackages.join(", ") : "No add-ons selected"}`,
    `Notes: ${formData.get("message").trim() || "None"}`,
    "",
    "Please let me know availability and pricing."
  ].join("\n");
  document.querySelector("#booking-reference").textContent = reference;
  document.querySelector("#copy-booking-message").textContent = "Copy booking message";
  document.querySelector("#confirmation-copy").textContent = `Thanks, ${name}. Your ${eventType.toLowerCase()} details are ready to share. Copy the message, open WhatsApp, choose the Alpha Gelato chat, then tap Send.`;
  document.querySelector("#booking-whatsapp-message").value = message;
  confirmationDialog.showModal();
});

bookingForm.querySelectorAll("input, select, textarea").forEach((field) => {
  const clearFieldError = () => {
    field.removeAttribute("aria-invalid");
    bookingFeedback.textContent = "";
  };
  field.addEventListener("input", clearFieldError);
  field.addEventListener("change", clearFieldError);
});

document.querySelector("#copy-booking-message").addEventListener("click", async () => {
  const messageField = document.querySelector("#booking-whatsapp-message");
  try {
    await navigator.clipboard.writeText(messageField.value);
    document.querySelector("#copy-booking-message").textContent = "Copied — ready to paste";
  } catch {
    messageField.focus();
    messageField.select();
    document.querySelector("#confirmation-copy").textContent = "Select and copy the message below, then paste it into your Alpha Gelato WhatsApp chat.";
  }
});

document.querySelector(".confirmation-close").addEventListener("click", () => confirmationDialog.close());
confirmationDialog.querySelector(".dialog-close").addEventListener("click", () => confirmationDialog.close());

document.querySelector("#year").textContent = String(new Date().getFullYear());
renderProducts();
updateCart();
