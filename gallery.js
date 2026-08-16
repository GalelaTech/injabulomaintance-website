// ======== CART STATE ========
    const cart = {};

    // ======== QTY CONTROL ========
    function changeQty(btn, delta) {
      const qtyEl = btn.parentElement.querySelector('.qty');
      let qty = parseInt(qtyEl.textContent) + delta;
      if (qty < 0) qty = 0;
      qtyEl.textContent = qty;
    }

    // ======== ADD TO CART ========
    function addToCart(btn, name, price) {
      const card = btn.closest('.product-card');
      const qty = parseInt(card.querySelector('.qty').textContent);
      if (qty === 0) { shakeBtn(btn); return; }
      cart[name] ? (cart[name].qty += qty) : (cart[name] = { price, qty });
      card.querySelector('.qty').textContent = '0';
      btn.classList.add('added');
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fas fa-basket-shopping"></i> Add to Order';
      }, 1400);
      updateCartBar();
    }

    function shakeBtn(btn) {
      btn.style.animation = 'shake 0.35s ease';
      setTimeout(() => btn.style.animation = '', 400);
    }

    // ======== CART BAR ========
    function updateCartBar() {
      const totalItems = Object.values(cart).reduce((s, v) => s + v.qty, 0);
      const totalPrice = Object.values(cart).reduce((s, v) => s + v.price * v.qty, 0);
      document.getElementById('cartCount').textContent = totalItems;
      document.getElementById('cartTotal').textContent = totalPrice.toLocaleString('en-ZA');
      document.getElementById('cartBar').classList.toggle('visible', totalItems > 0);
    }

    // ======== CHECKOUT MODAL ========
    function checkout() {
      const items = Object.entries(cart);
      if (!items.length) return;
      let summaryHtml = '', total = 0;
      items.forEach(([name, { price, qty }]) => {
        const sub = price * qty; total += sub;
        summaryHtml += `<div class="summary-row"><span>${name} × ${qty}</span><span>R ${sub.toLocaleString('en-ZA')}</span></div>`;
      });
      summaryHtml += `<div class="summary-row"><span>Total</span><span>R ${total.toLocaleString('en-ZA')}</span></div>`;
      document.getElementById('modalCartSummary').innerHTML = summaryHtml;
      document.getElementById('orderModal').classList.add('active');
      document.getElementById('modalOverlay').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      document.getElementById('orderModal').classList.remove('active');
      document.getElementById('modalOverlay').classList.remove('active');
      document.body.style.overflow = '';
    }

    // ======== SEND TO WHATSAPP ========
    function sendWhatsApp() {
      const name = document.getElementById('orderName').value.trim();
      const address = document.getElementById('orderAddress').value.trim();
      const note = document.getElementById('orderNote').value.trim();
      if (!name || !address) { alert('Please fill in your name and delivery address.'); return; }
      let msg = `*🌸 New Flower Order — Injabulo*\n\n*Customer:* ${name}\n*Delivery Address:* ${address}\n\n*Order:*\n`;
      let total = 0;
      Object.entries(cart).forEach(([itemName, { price, qty }]) => {
        const sub = price * qty; total += sub;
        msg += `• ${itemName} × ${qty} = R ${sub.toLocaleString('en-ZA')}\n`;
      });
      msg += `\n*Total: R ${total.toLocaleString('en-ZA')}*`;
      if (note) msg += `\n\n*Note:* ${note}`;
      window.open(`https://wa.me/27660400260?text=${encodeURIComponent(msg)}`, '_blank');
      Object.keys(cart).forEach(k => delete cart[k]);
      updateCartBar();
      closeModal();
    }

    // ======== FILTER ========
    function filterShop(category, btn) {
    let lowerCat =category.toLowerCase()
    console.log(lowerCat)
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.product-card').forEach(card => {
    const cat = card.dataset.category;

    card.classList.toggle(
      'hidden',
      !(lowerCat === 'all' || cat === lowerCat || cat === 'all')
    );
  });
}
    // ======== NAV TOGGLE ========
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }

    // ======== PRODUCT FORM ========
    function uploadProduct() {
  const image = document.getElementById('productImage').files[0];
  const name = document.getElementById('productName').value;
  const desc = document.getElementById('productDesc').value;
  const price = document.getElementById('productPrice').value;
  const category = document.getElementById('productCategory').value;

  

  const reader = new FileReader();
   reader.readAsDataURL(image);
   console.log(reader.result)
  
  

  reader.onload = function(e) {
    

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = category;

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${e.target.result}" alt="${name}">
        <span class="product-badge new-badge">New</span>
      </div>

      <div class="product-info">
        <h3 class="product-name">${name}</h3>
        <p class="product-desc">${desc}</p>

        <div class="product-footer">
          <span class="product-price">R ${price}</span>

          <div class="qty-control">
            <button onclick="changeQty(this,-1)">−</button>
            <span class="qty">0</span>
            <button onclick="changeQty(this,1)">+</button>
          </div>
        </div>

        <button class="add-to-cart-btn"
          onclick="addToCart(this,'${name}',${price})">
          <i class="fas fa-basket-shopping"></i>
          Add to Order
        </button>
      </div>
    `;
    document.querySelector('.products-grid').appendChild(card);
  };


 
}
 

// ======== COMPOST CYCLE PRESENTATION ========
let cycleInterval;
let currentCycleStep = 1;
const totalCycleSteps = 7;

function initCompostCycle() {
  // Start the automatic cycle presentation
  highlightCycleStep(currentCycleStep);

  cycleInterval = setInterval(() => {
    // Move to next step, loop back to 1 after step 7
    currentCycleStep = currentCycleStep >= totalCycleSteps ? 1 : currentCycleStep + 1;
    highlightCycleStep(currentCycleStep);
  }, 3800); // 3.8 seconds per step

  // Add click handlers to all photo frames
  document.querySelectorAll('.photo-frame').forEach(frame => {
    frame.addEventListener('click', function() {
      const stage = this.closest('.cycle-stage');
      if (!stage) return;

      const step = parseInt(stage.getAttribute('data-step'), 10);
      if (Number.isNaN(step)) return;

      // Pause auto-rotation
      clearInterval(cycleInterval);
      cycleInterval = null;

      // Highlight clicked step
      currentCycleStep = step;
      highlightCycleStep(step);

      // Resume auto-rotation after 7 seconds
      setTimeout(() => {
        if (!cycleInterval) {
          cycleInterval = setInterval(() => {
            currentCycleStep = currentCycleStep >= totalCycleSteps ? 1 : currentCycleStep + 1;
            highlightCycleStep(currentCycleStep);
          }, 3800);
        }
      }, 7000);
    });
  });
}

function highlightCycleStep(stepNumber) {
  // Remove all highlights
  document.querySelectorAll('.photo-frame').forEach(f => f.classList.remove('active-pop'));
  document.querySelectorAll('.bullet-point').forEach(b => b.classList.remove('cycle-highlight'));

  // Add highlight to current step
  const frame = document.getElementById(`frame${stepNumber}`);
  const bullet = document.getElementById(`bullet${stepNumber}`);

  if (frame) frame.classList.add('active-pop');
  if (bullet) bullet.classList.add('cycle-highlight');
}

// ======== STEP 2 PHOTO FLIP ========
function initFrameFlip() {
  const btn = document.getElementById('btnFlip');
  const flipImg = document.getElementById('flip');
  if (!btn || !flipImg) return; // guard: only wire this up if the markup is present

  btn.addEventListener('click', () => {
    flipImg.hidden = !flipImg.hidden;
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initCompostCycle();
  initFrameFlip();
});