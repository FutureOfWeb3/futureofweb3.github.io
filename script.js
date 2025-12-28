// ===== SHOPPING CART =====
let cart = JSON.parse(localStorage.getItem('fireworksCart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('fireworksCart', JSON.stringify(cart));
    updateCartUI();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showCartNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
}

// Update item quantity
function updateQuantity(productName, quantity) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Update cart UI
function updateCartUI() {
    // Update cart count badge
    const cartCount = document.getElementById('cartCount');
    const count = getCartCount();
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Render cart items
    renderCartItems();
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        cartItems.innerHTML = '';
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-burst"></i>'}
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.name}', ${item.quantity - 1})" class="qty-btn">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', ${item.quantity + 1})" class="qty-btn">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.name}')" class="cart-item-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    if (cartTotal) {
        cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
    }
}

// Checkout function - show checkout form
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Close cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
    
    // Open checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    if (checkoutModal) checkoutModal.classList.add('active');
    if (checkoutOverlay) checkoutOverlay.classList.add('active');
    
    // Populate order summary
    populateCheckoutSummary();
}

// Populate checkout summary
function populateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div>
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    if (checkoutTotal) {
        checkoutTotal.textContent = `$${getCartTotal().toFixed(2)}`;
    }
}

// Close checkout form
function closeCheckoutForm() {
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutSuccess = document.getElementById('checkoutSuccess');
    
    if (checkoutModal) checkoutModal.classList.remove('active');
    if (checkoutOverlay) checkoutOverlay.classList.remove('active');
    
    // Reset form and success message
    setTimeout(() => {
        if (checkoutForm) {
            checkoutForm.style.display = 'block';
            checkoutForm.reset();
        }
        if (checkoutSuccess) checkoutSuccess.style.display = 'none';
    }, 300);
}

// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link (except dropdown toggle)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's a dropdown parent on mobile, toggle dropdown instead
            if (link.closest('.dropdown') && window.innerWidth <= 768) {
                e.preventDefault();
                link.closest('.dropdown').classList.toggle('active');
            } else {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Close menu when clicking dropdown links
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== URL FILTER HANDLING =====
// Check if page loaded with filter parameter
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam && document.querySelector('.filters')) {
        // Find and click the corresponding filter button
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }
});

// ===== PRODUCTS DATA (Ready for your product list) =====
const products = [
    {
        name: "New Yorker",
        category: "assortments",
        price: 149.99,
        description: "Big city fireworks assortment",
        specs: "Variety pack",
        badge: "",
        image: "https://i.ytimg.com/vi/D4sqhVkFgBc/maxresdefault.jpg"
    },
    {
        name: "Cul-de-Sac Crusader",
        category: "assortments",
        price: 129.99,
        description: "Neighborhood favorite variety pack",
        specs: "Variety pack",
        badge: "",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5eYMNYbUrX3anks2PW7Y_7mH4dpo9MbPOeA&s"
    },
    {
        name: "Phantom Celebration",
        category: "assortments",
        price: 99.99,
        description: "Phantom brand celebration assortment pack",
        specs: "Variety pack",
        badge: "",
        image: "https://images2.imgbox.com/3a/7c/dGMl6qIw_o.jpeg"
    },
    {
        name: "Vapor Trails",
        category: "assortments",
        price: 89.99,
        description: "Spectacular vapor trail assortment",
        specs: "Variety pack",
        badge: "",
        image: "https://images2.imgbox.com/42/4b/GoE1UdaD_o.jpeg"
    },
    {
        name: "Party All Night",
        category: "fountains",
        price: 199.99,
        description: "Over 8 hours of entertainment! Complete party package",
        specs: "Large fountain",
        badge: "Best Value",
        image: "https://i.ytimg.com/vi/l7fTlCvQ8WQ/maxresdefault.jpg"
    },
    {
        name: "Funky Monkey Fountain",
        category: "fountains",
        price: 49.99,
        description: "Emits showers of colorful sparks and effects",
        specs: "Ground fountain",
        badge: "Popular",
        image: "https://cdn.shopify.com/s/files/1/0725/7001/1928/files/funky-monkey-fountain.png?v=1753982193"
    },
    {
        name: "Phoenix Finale Fountain",
        category: "fountains",
        price: 59.99,
        description: "Spectacular finale fountain with vibrant colors",
        specs: "Premium fountain",
        badge: "",
        image: "https://i.ytimg.com/vi/46UQoNJ8hbc/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGH8gMCgfMA8=&rs=AOn4CLCm8zGUQlB2qkXDB0EhZjC2iH3cCA"
    },
    {
        name: "Brew Ha-Ha Fountain",
        category: "fountains",
        price: 59.99,
        description: "High-performance fountain display",
        specs: "Premium fountain",
        badge: "",
        image: "https://cdn.shopify.com/s/files/1/0725/7001/1928/files/brew-ha-ha-fountain.png?v=1754071154"
    },
    {
        name: "Large Happy Planets Repeater",
        category: "repeaters",
        price: 19.99,
        description: "36 shots of colorful aerial effects",
        shots: "36 shots",
        badge: "",
        image: "https://cdn.shopify.com/s/files/1/0924/0336/8243/files/large-happy-planets.png?v=1754679634&width=1000&height=750&crop=center"
    },
    {
        name: "Shriller",
        category: "repeaters",
        price: 24.99,
        description: "High-pitched shrieking aerial effects",
        shots: "16 shots",
        badge: "",
        image: "https://images2.imgbox.com/30/35/Lh0sYYlv_o.jpeg"
    },
    {
        name: "Super Slugger",
        category: "fountains",
        price: 29.99,
        description: "Mondo Melon - powerful tube candles",
        specs: "3 piece set",
        badge: "",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc1BVBS8pKNDMJav9CUeE_uYnEXRqnTjE_Gw&s"
    },
    {
        name: "Flaming Titan Meter",
        category: "repeaters",
        price: 29.99,
        description: "16 shots of flaming titan action",
        shots: "16 shots",
        badge: "",
        image: "https://images2.imgbox.com/e1/90/UzSChiRJ_o.jpeg"
    },
    {
        name: "Emerald City Repeater",
        category: "repeaters",
        price: 29.99,
        description: "16 shots of emerald green effects",
        shots: "16 shots",
        badge: "",
        image: "https://images2.imgbox.com/09/c9/gm27zIXV_o.jpeg"
    },
    {
        name: "Exotic Lights Repeater",
        category: "repeaters",
        price: 39.99,
        description: "16 shots of exotic light displays",
        shots: "16 shots",
        badge: "",
        image: "https://images2.imgbox.com/e3/43/nTnIW7uC_o.jpeg"
    },
    {
        name: "Pirates Invasion",
        category: "repeaters",
        price: 44.99,
        description: "23 shots of pirate-themed aerial effects",
        shots: "23 shots",
        badge: "Popular",
        image: "https://images2.imgbox.com/f5/62/Ty6HUc37_o.jpeg"
    },
    {
        name: "Hidden Gem Repeater",
        category: "repeaters",
        price: 39.99,
        description: "16 shots of hidden gem treasures",
        shots: "16 shots",
        badge: "",
        image: "https://thumbs2.imgbox.com/fb/94/mbA6RptX_t.jpeg"
    },
    {
        name: "Deja Vu Repeater",
        category: "repeaters",
        price: 44.99,
        description: "24 shots of dazzling effects",
        shots: "24 shots",
        badge: "",
        image: "https://images2.imgbox.com/6d/ee/Mu04anN7_o.jpeg"
    },
    {
        name: "Meteor Flash Repeater",
        category: "repeaters",
        price: 49.99,
        description: "16 shots of meteor flash effects",
        shots: "16 shots",
        badge: "",
        image: "https://images2.imgbox.com/6d/ee/Mu04anN7_o.jpeg"
    },
    {
        name: "Bustler's Roaring Blaze Repeater",
        category: "repeaters",
        price: 49.99,
        description: "25 shots of roaring blaze action",
        shots: "25 shots",
        badge: "",
        image: "https://images2.imgbox.com/72/14/HINfqHsO_o.jpeg"
    },
    {
        name: "Rain of Fire Repeater",
        category: "repeaters",
        price: 49.99,
        description: "16 shots of rain fire effects",
        shots: "16 shots",
        badge: "",
        image: "https://images2.imgbox.com/8e/1f/mnZ6A1lg_o.jpeg"
    },
    {
        name: "Whatever Sparks Your Fire Repeater",
        category: "repeaters",
        price: 69.99,
        description: "16 shots of spectacular sparking effects",
        shots: "16 shots",
        badge: "Premium",
        image: "https://images2.imgbox.com/56/13/gVo8eHTq_o.jpeg"
    },
    {
        name: "All That Flash Repeater",
        category: "repeaters",
        price: 69.99,
        description: "25 shots of brilliant flashing effects",
        shots: "25 shots",
        badge: "",
        image: "https://images2.imgbox.com/70/b6/HwKOfJ8q_o.jpeg"
    },
    {
        name: "Star Spangled Showdown",
        category: "repeaters",
        price: 89.99,
        description: "Premium star-spangled aerial display",
        specs: "Multi-effect",
        badge: "Premium",
        image: "https://images2.imgbox.com/71/07/0yR2AM5c_o.jpeg"
    },
    {
        name: "Strobe Spectacular",
        category: "repeaters",
        price: 89.99,
        description: "20 shots of spectacular strobing effects",
        shots: "20 shots",
        badge: "",
        image: "https://images2.imgbox.com/c9/e6/MGKQKAt4_o.jpeg"
    },
    {
        name: "Cosmic Velocity",
        category: "repeaters",
        price: 99.99,
        description: "High-speed cosmic aerial effects",
        shots: "25 shots",
        badge: "",
        image: "https://images2.imgbox.com/18/46/E04V2pHR_o.jpeg"
    },
    {
        name: "Galactic Radiance",
        category: "repeaters",
        price: 99.99,
        description: "Radiant galactic light display",
        shots: "25 shots",
        badge: "",
        image: "https://images2.imgbox.com/18/46/E04V2pHR_o.jpeg"
    },
    {
        name: "Electric Manipulation",
        category: "repeaters",
        price: 109.99,
        description: "Electric crackling aerial effects",
        shots: "30 shots",
        badge: "",
        image: "https://images2.imgbox.com/18/46/E04V2pHR_o.jpeg"
    },
    {
        name: "Crack the Sky",
        category: "repeaters",
        price: 109.99,
        description: "Sky-cracking aerial bombardment",
        shots: "30 shots",
        badge: "Popular",
        image: "https://images2.imgbox.com/e4/e3/hDUrOBK6_o.jpeg"
    },
    {
        name: "Rain of Fire",
        category: "repeaters",
        price: 119.99,
        description: "36 shots of premiere rain fire effects",
        shots: "36 shots",
        badge: "Popular",
        image: "https://thumbs2.imgbox.com/92/a0/s8t3R6z5_t.jpeg"
    },
    {
        name: "The Duke of Flames",
        category: "repeaters",
        price: 149.99,
        description: "Premium flame aerial display",
        specs: "Premium grade",
        badge: "Premium",
        image: "https://images2.imgbox.com/41/cf/11fCU4yV_o.jpeg"
    },
    {
        name: "Cat Scat Fever",
        category: "repeaters",
        price: 149.99,
        description: "High-performance repeater with wild effects",
        specs: "Premium grade",
        badge: "Premium",
        image: "https://images2.imgbox.com/95/0b/5zxyQatr_o.jpeg"
    },
    {
        name: "Popo Magnet",
        category: "repeaters",
        price: 149.99,
        description: "Out-of-this-world aerial effects",
        specs: "Premium grade",
        badge: "Premium",
        image: "https://images2.imgbox.com/02/e1/v0dXIJIt_o.jpeg"
    },
    {
        name: "Tropic Thunder",
        category: "repeaters",
        price: 149.99,
        description: "Thunder and lightning tropical effects",
        specs: "Premium grade",
        badge: "Premium",
        image: "https://images2.imgbox.com/01/fa/pJDgrnqh_o.jpeg"
    },
    {
        name: "Boomalicious",
        category: "repeaters",
        price: 149.99,
        description: "High-powered boom effects",
        specs: "Premium grade",
        badge: "",
        image: "https://images2.imgbox.com/9a/1f/WIt8UnXS_o.jpeg"
    },
    {
        name: "Attention Getter",
        category: "repeaters",
        price: 149.99,
        description: "Impossible to ignore aerial display",
        specs: "Premium grade",
        badge: "",
        image: "https://images2.imgbox.com/2b/b8/6iAkaKjT_o.jpeg"
    },
    {
        name: "Walloping Warheads",
        category: "repeaters",
        price: 149.99,
        description: "Powerful warhead aerial effects",
        specs: "Premium grade",
        badge: "",
        image: "https://images2.imgbox.com/07/c6/OKd5uanW_o.jpeg"
    },
    {
        name: "God of Fire",
        category: "repeaters",
        price: 159.99,
        description: "30 shots of divine fire effects",
        shots: "30 shots",
        badge: "Popular",
        image: "https://images2.imgbox.com/99/cd/NtVgKVjx_o.jpeg"
    },
    {
        name: "Colossal Constellation Cluster",
        category: "repeaters",
        price: 299.99,
        description: "Massive 720 shots creating constellation patterns",
        shots: "720 shots!",
        badge: "Epic",
        image: "https://images2.imgbox.com/45/8d/yijnfdq8_o.jpeg"
    },
    {
        name: "Everlasting Extravaganza",
        category: "repeaters",
        price: 299.99,
        description: "Ultimate fireworks extravaganza package",
        specs: "Complete show",
        badge: "Epic",
        image: "https://images2.imgbox.com/e3/6a/HEMPDCBB_o.jpeg"
    },
    {
        name: "Phantom Flash Ball Shell",
        category: "mortars",
        price: 89.99,
        description: "Premium Phantom ball shell with flash effects",
        specs: "Shell artillery",
        badge: "",
        image: "https://images2.imgbox.com/f6/8b/9Wg50zVG_o.jpeg"
    },
    {
        name: "Color Change Wolf Pack",
        category: "mortars",
        price: 89.99,
        description: "Color changing shells pack",
        specs: "Multi-shell kit",
        badge: "",
        image: "https://images2.imgbox.com/b8/13/3Sdvy8xR_o.jpeg"
    },
    {
        name: "Nishiki",
        category: "mortars",
        price: 89.99,
        description: "Premium Japanese-style mortar shells",
        specs: "Multi-shell kit",
        badge: "",
        image: "https://images2.imgbox.com/ca/1c/BkPu7EtE_o.jpeg"
    },
    {
        name: "Flaming Fire Bombs",
        category: "mortars",
        price: 79.99,
        description: "Explosive flaming bomb mortar shells",
        specs: "Multi-shell kit",
        badge: "",
        image: "https://images2.imgbox.com/84/ce/qbNPPGRz_o.jpeg"
    },
    {
        name: "Phan-tastic",
        category: "mortars",
        price: 119.99,
        description: "Phantom brand fantastic mortar display",
        specs: "Shell artillery",
        badge: "Popular",
        image: "https://images2.imgbox.com/d1/96/ADtFSINr_o.jpeg"
    },
    {
        name: "Biggest Boom in The Room",
        category: "mortars",
        price: 139.99,
        description: "Massive boom effects artillery shells",
        specs: "Premium shells",
        badge: "Premium",
        image: "https://images2.imgbox.com/73/a5/5GPk90Pq_o.jpeg"
    },
    {
        name: "Red White Blue Mortar",
        category: "mortars",
        price: 69.99,
        description: "Patriotic red, white and blue mortar shells",
        specs: "Multi-shell kit",
        badge: "",
        image: "https://images2.imgbox.com/47/71/WzlZakRa_o.jpeg"
    },
    {
        name: "Boom Shockalocka",
        category: "mortars",
        price: 99.99,
        description: "Monster artillery shells kit",
        specs: "6 shells",
        badge: "",
        image: "https://images2.imgbox.com/e3/a5/q3ESeXF9_o.jpeg"
    },
    {
        name: "Scatter Bombs Mortar Kit",
        category: "mortars",
        price: 109.99,
        description: "6-inch shells burst mortar kit",
        specs: "6 shells",
        badge: "",
        image: "https://images2.imgbox.com/66/bf/rFgZbPz0_o.jpeg"
    },
    {
        name: "Lock and Load Mortar Kit",
        category: "mortars",
        price: 279.99,
        description: "Professional 24-shell mortar kit",
        specs: "24 shells",
        badge: "Premium",
        image: "https://images2.imgbox.com/17/e4/AAJJtIOl_o.jpeg"
    },
    {
        name: "Wolf Pack High Performance Canister Shells",
        category: "mortars",
        price: 279.99,
        description: "High-performance 24-shell canister kit",
        specs: "24 shells",
        badge: "Premium",
        image: "https://images2.imgbox.com/cb/02/pPbk106T_o.jpeg"
    },
    {
        name: "Grand Jury Mortar Kit",
        category: "mortars",
        price: 299.99,
        description: "Ultimate 24-shell premium mortar kit",
        specs: "24 shells",
        badge: "Epic",
        image: "https://images2.imgbox.com/98/07/3m9xsITh_o.jpeg"
    },
    {
        name: "Mini Barrage",
        category: "romancandles",
        price: 12.99,
        description: "Compact roman candle barrage",
        specs: "Multi-shot",
        badge: "",
        image: "https://images2.imgbox.com/3c/47/y0Bc3U7S_o.jpeg"
    },
    {
        name: "Barrage Fire",
        category: "romancandles",
        price: 24.99,
        description: "Intense barrage of roman candle shots",
        specs: "Multi-shot",
        badge: "",
        image: "https://images2.imgbox.com/9b/f4/DlHp0ccB_o.jpeg"
    },
    {
        name: "Crazy Ball Cannon",
        category: "romancandles",
        price: 19.99,
        description: "Wild ball effects roman candle",
        specs: "Ball shots",
        badge: "",
        image: "https://images2.imgbox.com/ca/f2/MwcKccHa_o.jpeg"
    },
    {
        name: "5 Ball Mini",
        category: "romancandles",
        price: 9.99,
        description: "5-shot mini ball roman candle",
        specs: "5 shots",
        badge: "",
        image: "https://images2.imgbox.com/7f/ba/U1CqzQm5_o.jpeg"
    },
    {
        name: "10 Ball",
        category: "romancandles",
        price: 14.99,
        description: "Classic 10-ball roman candle",
        specs: "10 shots",
        badge: "Popular",
        image: "https://images2.imgbox.com/8c/a4/7qgtsU4L_o.jpeg"
    },
    {
        name: "10 Ball Colored",
        category: "romancandles",
        price: 16.99,
        description: "10-ball roman candle with colored effects",
        specs: "10 shots",
        badge: "",
        image: "https://images2.imgbox.com/b5/ee/98asxImu_o.jpeg"
    },
    {
        name: "Out of This World",
        category: "romancandles",
        price: 29.99,
        description: "Spectacular out-of-this-world roman candle effects",
        specs: "Multi-shot",
        badge: "Premium",
        image: "https://images2.imgbox.com/4c/8c/8PIOOiqD_o.jpeg"
    },
    {
        name: "100 Wolfpack Firecrackers",
        category: "firecrackers",
        price: 8.99,
        description: "100-count firecracker pack",
        specs: "100 crackers",
        badge: "",
        image: "https://images2.imgbox.com/ac/70/ZAl1jOrn_o.jpeg"
    },
    {
        name: "200 Wolfpack Firecrackers",
        category: "firecrackers",
        price: 14.99,
        description: "200-count firecracker pack",
        specs: "200 crackers",
        badge: "Popular",
        image: "https://images2.imgbox.com/da/d3/MvjbpNck_o.jpeg"
    },
    {
        name: "Thunder Bomb",
        category: "firecrackers",
        price: 19.99,
        description: "Loud thunder bomb firecrackers",
        specs: "Premium pack",
        badge: "",
        image: "https://images2.imgbox.com/70/70/On4GxFgu_o.jpeg"
    },
    {
        name: "Titanium Salute",
        category: "firecrackers",
        price: 24.99,
        description: "Premium titanium salute firecrackers",
        specs: "High power",
        badge: "Premium",
        image: "https://images2.imgbox.com/e0/24/vvA80lFP_o.jpeg"
    },
    {
        name: "Snap Crackers",
        category: "firecrackers",
        price: 4.99,
        description: "Safe snap and pop crackers",
        specs: "Party pack",
        badge: "",
        image: "https://images2.imgbox.com/9d/bb/qlHbNfSj_o.jpeg"
    },
    {
        name: "Poco Loco",
        category: "bottlerockets",
        price: 19.99,
        description: "Crazy little bottle rockets",
        specs: "Bottle rockets",
        badge: "",
        image: "https://images2.imgbox.com/64/a9/F2MiQsWl_o.jpeg"
    },
    {
        name: "Whistling Bottle Rockets",
        category: "bottlerockets",
        price: 24.99,
        description: "Classic whistling bottle rockets",
        specs: "Bottle rockets",
        badge: "",
        image: "https://images2.imgbox.com/25/8e/NSLJXTwK_o.jpeg"
    },
    {
        name: "Bottle Rockets",
        category: "bottlerockets",
        price: 14.99,
        description: "Standard bottle rocket pack",
        specs: "Bottle rockets",
        badge: "Popular",
        image: "https://images2.imgbox.com/de/6e/cwuOnPUe_o.jpeg"
    },
    {
        name: "Wolfpack Rockets",
        category: "bottlerockets",
        price: 29.99,
        description: "Premium Wolfpack bottle rockets",
        specs: "Bottle rockets",
        badge: "Premium",
        image: "https://images2.imgbox.com/93/0a/Di6K0yML_o.jpeg"
    },
    {
        name: "Gold Sparklers",
        category: "sparklers",
        price: 6.99,
        description: "Classic gold sparklers",
        specs: "Pack of sparklers",
        badge: "Popular",
        image: "https://images2.imgbox.com/de/56/pnQFv8EA_o.jpeg"
    },
    {
        name: "Neon Sparklers",
        category: "sparklers",
        price: 8.99,
        description: "Bright neon colored sparklers",
        specs: "Pack of sparklers",
        badge: "",
        image: "https://images2.imgbox.com/1e/86/HL6qloFr_o.jpeg"
    },
    {
        name: "Fiery Frogs",
        category: "fountains",
        price: 12.99,
        description: "Hopping frog fountain effects",
        specs: "Ground fountain",
        badge: "",
        image: "https://images2.imgbox.com/3d/48/belLw2iR_o.jpeg"
    },
    {
        name: "Red White Blue Parachute",
        category: "misc",
        price: 16.99,
        description: "Parachute firework with patriotic colors",
        specs: "Aerial parachute",
        badge: "",
        image: "https://images2.imgbox.com/25/2b/lvOlV7Cz_o.jpeg"
    },
    {
        name: "Small Paratroopers",
        category: "misc",
        price: 12.99,
        description: "Small paratrooper aerial effects",
        specs: "Aerial parachute",
        badge: "",
        image: "https://images2.imgbox.com/8e/83/4Jz33thx_o.jpeg"
    }
];

// ===== RENDER PRODUCTS =====
function renderProducts(filterCategory = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Filter products
    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(p => p.category === filterCategory);
    
    console.log('Total products in database:', products.length);
    console.log('Filter:', filterCategory);
    console.log('Filtered products:', filteredProducts.length);
    console.log('Product names:', filteredProducts.map(p => p.name));

    // Clear grid except the no-products message
    const noProductsMsg = productsGrid.querySelector('.no-products');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        if (noProductsMsg) {
            noProductsMsg.style.display = 'block';
            productsGrid.appendChild(noProductsMsg);
        }
        return;
    }

    // Render products
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        const icon = getIconForCategory(product.category);
        const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
        
        // Use product image if available, otherwise use icon
        const imageContent = product.image 
            ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover;">`
            : `<i class="${icon}"></i>`;
        
        card.innerHTML = `
            <div class="product-image">
                ${imageContent}
                ${badge}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    ${product.duration ? `<span><i class="fas fa-clock"></i> ${product.duration}</span>` : ''}
                    ${product.height ? `<span><i class="fas fa-ruler-vertical"></i> ${product.height}</span>` : ''}
                    ${product.specs ? `<span><i class="fas fa-box"></i> ${product.specs}</span>` : ''}
                    ${product.shots ? `<span><i class="fas fa-burst"></i> ${product.shots}</span>` : ''}
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-small btn-primary add-to-cart-btn" data-product='${JSON.stringify(product)}'>
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(card);
    });

    // Add animation
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add event listeners for Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productData = JSON.parse(button.getAttribute('data-product'));
            addToCart(productData);
        });
    });
}

// ===== GET ICON FOR CATEGORY =====
function getIconForCategory(category) {
    const icons = {
        assortments: 'fas fa-boxes-stacked',
        fountains: 'fas fa-fire',
        repeaters: 'fas fa-rocket',
        mortars: 'fas fa-bomb',
        romancandles: 'fas fa-wand-magic-sparkles',
        firecrackers: 'fas fa-burst',
        bottlerockets: 'fas fa-wine-bottle',
        sparklers: 'fas fa-wand-sparkles',
        misc: 'fas fa-circle-question',
        extras: 'fas fa-star'
    };
    return icons[category] || 'fas fa-burst';
}

// ===== PRODUCT FILTERING =====
const filterButtons = document.querySelectorAll('.filter-btn');
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            const filter = button.getAttribute('data-filter');
            renderProducts(filter);
        });
    });

    // Initial render
    renderProducts('all');
}

// ===== CONTACT FORM WITH EMAILJS =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // EmailJS service details - User needs to set up EmailJS account
        const serviceID = 'YOUR_SERVICE_ID'; // User needs to replace
        const templateID = 'YOUR_TEMPLATE_ID'; // User needs to replace
        
        // Send email via EmailJS
        emailjs.sendForm(serviceID, templateID, contactForm)
            .then(() => {
                // Show success message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.style.display = 'none';
                }, 5000);
            }, (error) => {
                alert('Failed to send message. Please try again or email us directly at ninjatech5g@gmail.com');
                console.log('EmailJS Error:', error);
            });
    });
}

// ===== FIREWORKS ANIMATION (Hero Section) =====
function createFirework() {
    const container = document.querySelector('.fireworks-animation');
    if (!container) return;

    const colors = ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#007aff', '#af52de'];
    const firework = document.createElement('div');
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.7;
    
    firework.style.position = 'absolute';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    firework.style.width = '4px';
    firework.style.height = '4px';
    firework.style.borderRadius = '50%';
    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    firework.style.boxShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
    firework.style.animation = 'explode 1s ease-out forwards';
    
    container.appendChild(firework);
    
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

// Add fireworks animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes explode {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(50);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create fireworks periodically on hero section
if (document.querySelector('.hero')) {
    setInterval(createFirework, 2000);
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== CHECKOUT FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const customerName = document.getElementById('customerName').value;
            const fulfillmentMethod = document.querySelector('input[name="fulfillmentMethod"]:checked').value;
            
            // Prepare order data
            const orderData = {
                customerName: customerName,
                fulfillmentMethod: fulfillmentMethod,
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity
                })),
                total: getCartTotal(),
                timestamp: new Date().toLocaleString()
            };
            
            // Google Sheets Web App URL - REPLACE WITH YOUR ACTUAL URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzchPFcVPWMqalbel2i_70t3DWnzFzknuEDPX_gFu8sD_DT1drJbnW3hPuq8GOaDxXWig/exec';
            
            try {
                // Show loading state
                const submitBtn = checkoutForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Send to Google Sheets
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });
                
                // Show success message
                checkoutForm.style.display = 'none';
                const checkoutSuccess = document.getElementById('checkoutSuccess');
                if (checkoutSuccess) checkoutSuccess.style.display = 'flex';
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('There was an error submitting your order. Please try again or call us at 904-557-0052.');
                
                // Reset button
                const submitBtn = checkoutForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Order';
            }
        });
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .product-card, .contact-method').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

console.log('🎆 Fireworks Emporium - Ready to load products!');
console.log('📝 Add your products to the products array in script.js');
