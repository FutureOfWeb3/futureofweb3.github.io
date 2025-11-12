/**
 * Card Vault Replica - JavaScript Functionality
 * Handles interactive features, filtering, cart operations, and UI enhancements
 */

// ===== GLOBAL STATE =====
const state = {
    cart: [],
    wishlist: [],
    filters: {
        category: 'all',
        sort: 'featured',
        view: 'grid'
    },
    announcements: [
        {
            icon: 'fas fa-shipping-fast',
            text: '⚡ Free Shipping on Pokemon Orders Over $75!'
        },
        {
            icon: 'fas fa-coins',
            text: '🎯 New Pokemon Singles Added Daily!'
        },
        {
            icon: 'fas fa-tags',
            text: '🔥 Pokemon Booster Boxes - Best Prices Guaranteed!'
        }
    ],
    currentAnnouncement: 0
};

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Parse price from string
    parsePrice(priceString) {
        return parseFloat(priceString.replace(/[$,]/g, ''));
    },

    // Smooth scroll to element
    scrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    },

    // Add animation class
    animate(element, animationClass) {
        element.classList.add(animationClass);
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    },

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add notification styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.95));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                    animation: slideInRight 0.3s ease;
                    max-width: 350px;
                    color: white;
                }
                .notification-success { 
                    border-left: 4px solid #48bb78;
                    background: linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.95));
                }
                .notification-error { 
                    border-left: 4px solid #f56565;
                    background: linear-gradient(135deg, rgba(72, 45, 45, 0.95), rgba(44, 26, 26, 0.95));
                }
                .notification-info { 
                    border-left: 4px solid #667eea;
                    background: linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(26, 32, 44, 0.95));
                }
                .notification-content {
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: white;
                }
                .notification-content i {
                    font-size: 1.1rem;
                    opacity: 0.9;
                }
                .notification-success .notification-content i {
                    color: #48bb78;
                }
                .notification-error .notification-content i {
                    color: #f56565;
                }
                .notification-info .notification-content i {
                    color: #667eea;
                }
                .notification-content span {
                    color: rgba(255, 255, 255, 0.95);
                    font-weight: 500;
                    flex: 1;
                }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    margin-left: auto;
                    opacity: 0.7;
                    color: rgba(255, 255, 255, 0.7);
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }
                .notification-close:hover { 
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
};

// ===== ANNOUNCEMENT SLIDER =====
const AnnouncementSlider = {
    init() {
        this.startSlider();
    },

    startSlider() {
        setInterval(() => {
            this.nextAnnouncement();
        }, 4000);
    },

    nextAnnouncement() {
        const items = document.querySelectorAll('.announcement-item');
        if (items.length === 0) return;

        // Hide current
        items[state.currentAnnouncement].classList.remove('active');
        
        // Move to next
        state.currentAnnouncement = (state.currentAnnouncement + 1) % items.length;
        
        // Show next
        items[state.currentAnnouncement].classList.add('active');
    }
};

// ===== NAVIGATION FUNCTIONALITY =====
const Navigation = {
    init() {
        this.setupMobileMenu();
        this.setupDropdowns();
    },

    setupMobileMenu() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
                mobileBtn.classList.toggle('active');
            });
        }
    },

    setupDropdowns() {
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        
        dropdownItems.forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');
            if (!dropdown) return;

            let hoverTimeout;

            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                dropdown.style.display = 'grid';
                setTimeout(() => {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                }, 10);
            });

            item.addEventListener('mouseleave', () => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-10px)';
                
                hoverTimeout = setTimeout(() => {
                    dropdown.style.display = 'none';
                }, 300);
            });
        });
    }
};

// ===== PRODUCT FILTERING =====
const ProductFilter = {
    init() {
        this.setupFilterButtons();
        this.setupSortSelect();
        this.setupViewToggle();
    },

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update filter state
                state.filters.category = btn.dataset.filter;
                
                // Apply filter
                this.applyFilters();
            });
        });
    },

    setupSortSelect() {
        const sortSelect = document.getElementById('sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                state.filters.sort = sortSelect.value;
                this.applyFilters();
            });
        }
    },

    setupViewToggle() {
        const viewButtons = document.querySelectorAll('.view-btn');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                state.filters.view = btn.dataset.view;
                this.applyView();
            });
        });
    },

    applyFilters() {
        const products = document.querySelectorAll('.product-card');
        let visibleProducts = [];

        products.forEach(product => {
            const categories = product.dataset.category?.split(' ') || [];
            const shouldShow = state.filters.category === 'all' || 
                             categories.includes(state.filters.category);

            // Add fade out animation
            product.classList.add('fade-out');
            
            setTimeout(() => {
                if (shouldShow) {
                    product.style.display = 'block';
                    product.classList.remove('fade-out');
                    product.classList.add('fade-in');
                    visibleProducts.push(product);
                } else {
                    product.style.display = 'none';
                    product.classList.remove('fade-out', 'fade-in');
                }
            }, 150);
        });

        // Sort visible products after animation
        setTimeout(() => {
            this.sortProducts(visibleProducts);
        }, 200);
    },

    sortProducts(products) {
        const container = document.querySelector('.products-grid') || document.querySelector('.product-grid');
        if (!container) return;

        products.sort((a, b) => {
            switch (state.filters.sort) {
                case 'price-low':
                    return this.getProductPrice(a) - this.getProductPrice(b);
                case 'price-high':
                    return this.getProductPrice(b) - this.getProductPrice(a);
                case 'name':
                    return this.getProductTitle(a).localeCompare(this.getProductTitle(b));
                default:
                    return 0;
            }
        });

        // Reorder DOM elements
        products.forEach(product => {
            container.appendChild(product);
        });
    },

    getProductPrice(productElement) {
        const priceElement = productElement.querySelector('.current-price');
        return priceElement ? utils.parsePrice(priceElement.textContent) : 0;
    },

    getProductTitle(productElement) {
        const titleElement = productElement.querySelector('.product-title');
        return titleElement ? titleElement.textContent.trim() : '';
    },

    applyView() {
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.className = `product-grid view-${state.filters.view}`;
        }
    }
};

// ===== CART FUNCTIONALITY =====
const Wishlist = {
    init() {
        this.loadWishlistFromStorage();
        this.updateWishlistDisplay();
        this.setupWishlistButton();
        this.setupWishlistCardButtons();
        this.updateWishlistButtonStates();
    },

    loadWishlistFromStorage() {
        const savedWishlist = localStorage.getItem('cardVaultWishlist');
        if (savedWishlist) {
            try {
                state.wishlist = JSON.parse(savedWishlist);
            } catch (error) {
                console.error('Error loading wishlist from localStorage:', error);
                state.wishlist = [];
            }
        } else {
            state.wishlist = [];
        }
    },

    updateWishlistDisplay() {
        const wishlistCount = document.querySelector('.wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = state.wishlist.length;
        }
    },

    setupWishlistButton() {
        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWishlistModal();
            });
        }
    },

    setupWishlistCardButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-wishlist') || e.target.closest('.btn-wishlist')) {
                e.preventDefault();
                const button = e.target.classList.contains('btn-wishlist') ? 
                              e.target : e.target.closest('.btn-wishlist');
                this.toggleWishlist(button);
            }
        });
    },

    toggleWishlist(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        const productId = button.dataset.product;
        const existingItem = state.wishlist.find(item => item.productId === productId);

        if (existingItem) {
            // Remove from wishlist
            this.removeFromWishlist(productId);
            button.classList.remove('active');
            utils.showNotification('Removed from wishlist', 'info');
        } else {
            // Add to wishlist
            const product = this.extractWishlistData(productCard, button);
            this.addToWishlist(product);
            button.classList.add('active');
            utils.showNotification('Added to wishlist!', 'success');
        }
    },

    extractWishlistData(productCard, button) {
        const titleElement = productCard.querySelector('.product-title');
        const priceElement = productCard.querySelector('.current-price');
        const imageElement = productCard.querySelector('.product-image img');
        
        return {
            productId: button.dataset.product,
            title: titleElement?.textContent?.trim() || 'Unknown Product',
            price: parseFloat(button.previousElementSibling?.dataset.price) || 0,
            image: imageElement?.src || 'https://via.placeholder.com/300x400?text=Pokemon+Pack',
            alt: imageElement?.alt || 'Pokemon Booster Pack'
        };
    },

    addToWishlist(item) {
        const existingItem = state.wishlist.find(wishlistItem => wishlistItem.productId === item.productId);
        if (!existingItem) {
            state.wishlist.push(item);
            localStorage.setItem('cardVaultWishlist', JSON.stringify(state.wishlist));
            this.updateWishlistDisplay();
        }
    },

    removeFromWishlist(productId) {
        state.wishlist = state.wishlist.filter(item => item.productId !== productId);
        localStorage.setItem('cardVaultWishlist', JSON.stringify(state.wishlist));
        this.updateWishlistDisplay();
    },

    updateWishlistButtonStates() {
        // Update wishlist button states on page load
        const wishlistButtons = document.querySelectorAll('.btn-wishlist');
        wishlistButtons.forEach(button => {
            const productId = button.dataset.product;
            const isInWishlist = state.wishlist.some(item => item.productId === productId);
            if (isInWishlist) {
                button.classList.add('active');
            }
        });
    },

    showWishlistModal() {
        alert(`You have ${state.wishlist.length} items in your wishlist!`);
        // TODO: Create proper wishlist modal similar to cart modal
    }
};

const Cart = {
    init() {
        this.setupQuantityControls();
        this.setupAddToCartButtons();
        this.loadCartFromStorage();
        this.updateCartDisplay();
    },

    setupQuantityControls() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                e.preventDefault();
                const btn = e.target;
                const input = btn.parentElement.querySelector('.qty-input');
                const isPlus = btn.classList.contains('plus');
                const isMinus = btn.classList.contains('minus');
                
                if (input) {
                    let value = parseInt(input.value) || 1;
                    const max = parseInt(input.max) || 999;
                    const min = parseInt(input.min) || 1;
                    
                    if (isPlus && value < max) {
                        value++;
                    } else if (isMinus && value > min) {
                        value--;
                    }
                    
                    input.value = value;
                }
            }
        });
    },

    setupAddToCartButtons() {
        document.addEventListener('click', (e) => {
            // Handle both old and new button classes
            if ((e.target.classList.contains('add-to-cart-btn') || 
                 e.target.classList.contains('btn-add-cart') ||
                 e.target.closest('.btn-add-cart')) && !e.target.disabled) {
                e.preventDefault();
                
                // Get the actual button element
                const button = e.target.classList.contains('btn-add-cart') ? 
                              e.target : e.target.closest('.btn-add-cart');
                
                this.addToCart(button || e.target);
            }
        });
    },

    addToCart(button) {
        // Handle bundle purchases
        if (button.classList.contains('bundle-btn')) {
            this.addBundleToCart(button);
            return;
        }

        const productCard = button.closest('.product-card');
        if (!productCard) return;

        const product = this.extractProductData(productCard, button);
        const quantity = this.getQuantity(productCard);

        // Check if product already in cart using product attribute from button
        const productId = button.dataset.product || product.id;
        const existingItem = state.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            state.cart.push({...product, productId, quantity});
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        
        utils.showNotification(`Added ${product.title} to cart!`, 'success');
        this.animateAddToCart(button);
    },

    addBundleToCart(button) {
        const bundleData = {
            productId: 'ultimate-bundle',
            id: 'ultimate-bundle',
            title: 'Ultimate Booster Bundle',
            price: parseFloat(button.dataset.price) || 34.99,
            image: 'https://via.placeholder.com/300x400?text=Ultimate+Bundle',
            alt: 'Ultimate Booster Bundle',
            quantity: 1,
            isBundle: true
        };

        // Check if bundle already in cart
        const existingItem = state.cart.find(item => item.productId === 'ultimate-bundle');
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push(bundleData);
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        
        utils.showNotification('Added Ultimate Bundle to cart!', 'success');
        this.animateAddToCart(button);
    },

    extractProductData(productCard, button) {
        const titleElement = productCard.querySelector('.product-title');
        const priceElement = productCard.querySelector('.current-price');
        const imageElement = productCard.querySelector('.product-image img');
        
        return {
            id: button?.dataset.product || Date.now() + Math.random(),
            title: titleElement?.textContent?.trim() || 'Unknown Product',
            price: parseFloat(button?.dataset.price) || utils.parsePrice(priceElement?.textContent || '0'),
            image: imageElement?.src || 'https://via.placeholder.com/300x400?text=Pokemon+Pack',
            alt: imageElement?.alt || 'Pokemon Booster Pack'
        };
    },

    animateAddToCart(button) {
        // Add animation class
        button.classList.add('added-to-cart');
        
        // Change button text temporarily
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        
        // Reset after animation
        setTimeout(() => {
            button.classList.remove('added-to-cart');
            button.innerHTML = originalText;
        }, 1500);
    },

    getQuantity(productCard) {
        const qtyInput = productCard.querySelector('.qty-input');
        return parseInt(qtyInput?.value) || 1;
    },

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Animate cart icon when items added
            if (totalItems > 0) {
                cartCount.parentElement.classList.add('cart-has-items');
            } else {
                cartCount.parentElement.classList.remove('cart-has-items');
            }
        }
    },

    saveCartToStorage() {
        localStorage.setItem('cardVaultCart', JSON.stringify(state.cart));
    },

    loadCartFromStorage() {
        const saved = localStorage.getItem('cardVaultCart');
        if (saved) {
            try {
                state.cart = JSON.parse(saved);
            } catch (e) {
                state.cart = [];
            }
        }
    },

    initializeCart() {
        const savedCart = localStorage.getItem('cardVaultCart');
        if (savedCart) {
            try {
                state.cart = JSON.parse(savedCart);
                this.updateCartUI();
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                state.cart = [];
            }
        }
        
        // Handle cart link click to show cart modal - comprehensive selector
        const cartLinks = document.querySelectorAll('#cart-link, #cart-icon, .cart-btn, .cart-icon, [class*="cart"]');
        cartLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });
        });
    },

    showCartModal() {
        // Create cart modal if it doesn't exist
        let modal = document.getElementById('cart-modal');
        if (!modal) {
            modal = this.createCartModal();
            document.body.appendChild(modal);
        }
        
        // Update cart content
        this.updateCartModal();
        
        // Populate suggestions
        this.populateSuggestions();
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    suggestedProducts: [
        {
            id: 'suggest-1',
            name: 'Pokemon Starter Deck',
            price: 12.99,
            image: 'https://images2.imgbox.com/42/8f/YxZqP3Nv_o.png'
        },
        {
            id: 'suggest-2', 
            name: 'Elite Trainer Box',
            price: 39.99,
            image: 'https://images2.imgbox.com/73/1a/MzX8Kd2p_o.png'
        },
        {
            id: 'suggest-3',
            name: 'Premium Collection',
            price: 59.99,
            image: 'https://images2.imgbox.com/91/2c/VpL4Nx7s_o.png'
        },
        {
            id: 'suggest-4',
            name: 'Booster Bundle',
            price: 24.99,
            image: 'https://images2.imgbox.com/65/9b/Qw3Rk8Ht_o.png'
        },
        {
            id: 'suggest-5',
            name: 'Rare Card Pack',
            price: 89.99,
            image: 'https://images2.imgbox.com/18/4f/Lm9Nx5Qz_o.png'
        }
    ],

    populateSuggestions() {
        const suggestionsContainer = document.querySelector('.suggestions-grid');
        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = this.suggestedProducts.map(product => `
            <div class="suggestion-item">
                <img src="${product.image}" alt="${product.name}" class="suggestion-image">
                <div class="suggestion-info">
                    <h4>${product.name}</h4>
                    <p class="suggestion-price">$${product.price}</p>
                    <button class="btn btn-sm btn-add" onclick="Cart.addSuggestionToCart('${product.id}')">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        `).join('');
    },

    addSuggestionToCart(productId) {
        const product = this.suggestedProducts.find(p => p.id === productId);
        if (!product) return;

        // Add to cart
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        // Save to localStorage
        localStorage.setItem('cardVaultCart', JSON.stringify(state.cart));
        
        // Update modal display
        this.updateCartModal();
        this.updateCartUI();

        // Show brief success message
        const button = event.target.closest('.btn-add');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    },

    createCartModal() {
        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-overlay" onclick="Cart.hideCartModal()"></div>
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h2><i class="fas fa-shopping-cart"></i> Your Cart</h2>
                    <button class="cart-modal-close" onclick="Cart.hideCartModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-modal-body">
                    <div class="cart-items-container">
                        <!-- Cart items will be populated here -->
                    </div>
                    <div class="cart-total">
                        <div class="cart-total-line">
                            <span>Subtotal: </span>
                            <span class="cart-subtotal">$0.00</span>
                        </div>
                        <div class="cart-total-line cart-total-final">
                            <span>Total: </span>
                            <span class="cart-final-total">$0.00</span>
                        </div>
                    </div>
                    <div class="cart-suggestions">
                        <h3><i class="fas fa-plus-circle"></i> Add More Items</h3>
                        <div class="suggestions-grid">
                            <!-- Suggested items will be populated here -->
                        </div>
                    </div>
                </div>
                <div class="cart-modal-footer">
                    <button class="btn btn-secondary" onclick="Cart.hideCartModal()">Continue Shopping</button>
                    <button class="btn btn-primary" onclick="Cart.checkout()">Checkout</button>
                </div>
            </div>
        `;

        // Add cart modal styles
        const style = document.createElement('style');
        style.id = 'cart-modal-styles';
        style.textContent = `
            .cart-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .cart-modal.show {
                opacity: 1;
            }
            
            .cart-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                cursor: pointer;
            }
            
            .cart-modal-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                max-height: 80vh;
                width: 90%;
                position: relative;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .cart-modal.show .cart-modal-content {
                transform: translateY(0);
            }
            
            .cart-modal-header {
                padding: 24px 24px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #eee;
                padding-bottom: 16px;
            }
            
            .cart-modal-header h2 {
                margin: 0;
                color: #333;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .cart-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .cart-modal-close:hover {
                background: #f5f5f5;
                color: #333;
            }
            
            .cart-modal-body {
                padding: 24px;
                flex: 1;
                overflow-y: auto;
            }
            
            .cart-items-container {
                min-height: 200px;
                margin-bottom: 24px;
            }
            
            .cart-item {
                display: flex;
                align-items: center;
                padding: 16px 0;
                border-bottom: 1px solid #eee;
                gap: 16px;
            }
            
            .cart-item:last-child {
                border-bottom: none;
            }
            
            .cart-item-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                object-fit: cover;
                background: #f5f5f5;
            }
            
            .cart-item-details {
                flex: 1;
            }
            
            .cart-item-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
                font-size: 0.9rem;
            }
            
            .cart-item-price {
                color: #666;
                font-size: 0.9rem;
            }
            
            .cart-item-quantity {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-right: 16px;
            }
            
            .cart-qty-btn {
                background: #f5f5f5;
                border: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: #666;
                transition: all 0.2s;
            }
            
            .cart-qty-btn:hover {
                background: var(--primary-color);
                color: white;
            }
            
            .cart-qty-display {
                min-width: 24px;
                text-align: center;
                font-weight: 600;
                color: #333;
            }
            
            .cart-item-remove {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                transition: color 0.2s;
            }
            
            .cart-item-remove:hover {
                color: #ff4757;
            }
            
            .cart-empty {
                text-align: center;
                padding: 60px 20px;
                color: #666;
            }
            
            .cart-empty i {
                font-size: 3rem;
                margin-bottom: 16px;
                color: #ddd;
            }
            
            .cart-total {
                border-top: 2px solid #eee;
                padding-top: 16px;
            }
            
            .cart-total-line {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                color: #666;
            }
            
            .cart-total-final {
                font-size: 1.2rem;
                font-weight: 700;
                color: #333;
                border-top: 1px solid #eee;
                padding-top: 8px;
                margin-top: 8px;
            }
            
            .cart-modal-footer {
                padding: 0 24px 24px;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            
            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.9rem;
            }
            
            .btn-secondary {
                background: #f5f5f5;
                color: #666;
            }
            
            .btn-secondary:hover {
                background: #eee;
                color: #333;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #7877c6, #ff77c6);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(120, 119, 198, 0.3);
            }
            
            .cart-suggestions {
                border-top: 2px solid #eee;
                padding-top: 24px;
                margin-top: 24px;
            }
            
            .cart-suggestions h3 {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .suggestions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
            }
            
            .suggestion-item {
                background: #f9f9f9;
                border-radius: 8px;
                padding: 12px;
                text-align: center;
                transition: all 0.2s;
            }
            
            .suggestion-item:hover {
                background: #f0f0f0;
                transform: translateY(-2px);
            }
            
            .suggestion-image {
                width: 100%;
                height: 60px;
                object-fit: cover;
                border-radius: 6px;
                margin-bottom: 8px;
            }
            
            .suggestion-info h4 {
                margin: 0 0 4px 0;
                font-size: 0.8rem;
                color: #333;
                font-weight: 600;
            }
            
            .suggestion-price {
                margin: 0 0 8px 0;
                font-weight: 700;
                color: #7877c6;
                font-size: 0.9rem;
            }
            
            .btn-sm {
                padding: 6px 12px;
                font-size: 0.75rem;
            }
            
            .btn-add {
                background: linear-gradient(135deg, #7877c6, #ff77c6);
                color: white;
                width: 100%;
            }
            
            .btn-add:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(120, 119, 198, 0.3);
            }
        `;
        
        if (!document.getElementById('cart-modal-styles')) {
            document.head.appendChild(style);
        }

        return modal;
    },

    updateCartModal() {
        const modal = document.getElementById('cart-modal');
        if (!modal) return;

        const container = modal.querySelector('.cart-items-container');
        const subtotalElement = modal.querySelector('.cart-subtotal');
        const totalElement = modal.querySelector('.cart-final-total');

        if (state.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some Pokemon cards to get started!</p>
                </div>
            `;
            subtotalElement.textContent = '$0.00';
            totalElement.textContent = '$0.00';
            return;
        }

        let html = '';
        let total = 0;

        state.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item">
                    <img src="${item.image || '/api/placeholder/60/60'}" alt="${item.alt}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${utils.formatCurrency(item.price)} each</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn" onclick="Cart.updateQuantity(${index}, -1)">-</button>
                        <span class="cart-qty-display">${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="Cart.updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="Cart.removeItem(${index})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
        subtotalElement.textContent = utils.formatCurrency(total);
        totalElement.textContent = utils.formatCurrency(total);
    },

    hideCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    },

    updateQuantity(index, change) {
        if (state.cart[index]) {
            state.cart[index].quantity += change;
            
            if (state.cart[index].quantity <= 0) {
                state.cart.splice(index, 1);
            }
            
            this.saveCartToStorage();
            this.updateCartDisplay();
            this.updateCartModal();
        }
    },

    removeItem(index) {
        if (state.cart[index]) {
            const item = state.cart[index];
            state.cart.splice(index, 1);
            
            this.saveCartToStorage();
            this.updateCartDisplay();
            this.updateCartModal();
            
            utils.showNotification(`Removed ${item.title} from cart`, 'success');
        }
    },

    checkout() {
        if (state.cart.length === 0) {
            utils.showNotification('Your cart is empty!', 'error');
            return;
        }

        // Calculate total
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Simulate checkout process
        utils.showNotification('Redirecting to secure checkout...', 'success');
        
        // In a real implementation, you would redirect to your payment processor
        setTimeout(() => {
            alert(`Checkout Total: ${utils.formatCurrency(total)}\n\nIn a real store, this would redirect to your payment processor (Stripe, PayPal, etc.)`);
        }, 1000);
    },
};

// ===== NEWSLETTER SIGNUP =====
const Newsletter = {
    init() {
        const form = document.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        
        const emailInput = e.target.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        const email = emailInput.value.trim();
        
        if (this.validateEmail(email)) {
            // Simulate API call
            setTimeout(() => {
                utils.showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
            }, 500);
        } else {
            utils.showNotification('Please enter a valid email address.', 'error');
        }
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// ===== COOKIE NOTICE =====
const CookieNotice = {
    init() {
        if (!this.hasAcceptedCookies()) {
            this.showNotice();
        }
        this.setupEventListeners();
    },

    hasAcceptedCookies() {
        return localStorage.getItem('cardVaultCookiesAccepted') === 'true';
    },

    showNotice() {
        const notice = document.getElementById('cookie-notice');
        if (notice) {
            notice.classList.add('show');
        }
    },

    hideNotice() {
        const notice = document.getElementById('cookie-notice');
        if (notice) {
            notice.classList.remove('show');
        }
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('accept')) {
                this.acceptCookies();
            } else if (e.target.classList.contains('decline')) {
                this.declineCookies();
            }
        });
    },

    acceptCookies() {
        localStorage.setItem('cardVaultCookiesAccepted', 'true');
        this.hideNotice();
        utils.showNotification('Cookie preferences saved.', 'success');
    },

    declineCookies() {
        this.hideNotice();
        utils.showNotification('Cookies declined. Some features may be limited.', 'info');
    }
};

// ===== LOADING ANIMATIONS =====
const LoadingAnimations = {
    init() {
        this.observeElements();
    },

    observeElements() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        utils.animate(entry.target, 'fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe product cards
            document.querySelectorAll('.product-card').forEach(card => {
                observer.observe(card);
            });

            // Observe sections
            document.querySelectorAll('.product-section').forEach(section => {
                observer.observe(section);
            });
        }
    }
};

// ===== SEARCH FUNCTIONALITY =====
const Search = {
    init() {
        this.createSearchInput();
        this.setupSearch();
    },

    createSearchInput() {
        const filtersLeft = document.querySelector('.filters-left');
        if (filtersLeft) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <input type="text" id="product-search" placeholder="Search products..." class="search-input">
                <i class="fas fa-search search-icon"></i>
            `;
            
            // Add search styles
            const style = document.createElement('style');
            style.textContent = `
                .search-container {
                    position: relative;
                    margin-right: 16px;
                }
                .search-input {
                    padding: 8px 16px 8px 36px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--button-border-radius);
                    font-size: var(--font-size-sm);
                    min-width: 200px;
                }
                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(44, 85, 48, 0.1);
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-light);
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
            
            filtersLeft.insertBefore(searchContainer, filtersLeft.firstChild);
        }
    },

    setupSearch() {
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            const debouncedSearch = utils.debounce(this.performSearch.bind(this), 300);
            searchInput.addEventListener('input', debouncedSearch);
        }
    },

    performSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const shouldShow = !query || title.includes(query);
            
            product.style.display = shouldShow ? 'block' : 'none';
        });
    }
};

// ===== KEYBOARD NAVIGATION =====
const KeyboardNavigation = {
    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    },

    handleKeyPress(e) {
        // ESC key - close modals/dropdowns
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
        }
        
        // Search shortcut (Ctrl/Cmd + K)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.focus();
            }
        }
    },

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
        });
    }
};

// ===== PERFORMANCE OPTIMIZATION =====
const Performance = {
    init() {
        this.lazyLoadImages();
        this.optimizeScrolling();
    },

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    optimizeScrolling() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    handleScroll() {
        // Add scroll effects here if needed
        const scrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        if (header) {
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }
};

// ===== ACCESSIBILITY ENHANCEMENTS =====
const Accessibility = {
    init() {
        this.enhanceFocus();
        this.addAriaLabels();
        this.setupAnnouncements();
    },

    enhanceFocus() {
        // Add visible focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // Track focus method
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    },

    addAriaLabels() {
        // Add aria-labels to interactive elements without text
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(btn => {
            if (!btn.textContent.trim()) {
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    if (iconClass.includes('search')) btn.setAttribute('aria-label', 'Search');
                    if (iconClass.includes('cart')) btn.setAttribute('aria-label', 'Shopping cart');
                    if (iconClass.includes('heart')) btn.setAttribute('aria-label', 'Wishlist');
                    if (iconClass.includes('user')) btn.setAttribute('aria-label', 'Account');
                }
            }
        });
    },

    setupAnnouncements() {
        // Create live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    },

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
};

// Welcome Popup Module
const WelcomePopup = {
    init() {
        // Check if this is a first-time visitor
        if (this.isFirstTimeVisitor()) {
            this.showWelcomePopup();
        }
        this.setupEventListeners();
    },

    isFirstTimeVisitor() {
        const hasVisited = localStorage.getItem('rippoke_visited');
        return !hasVisited;
    },

    showWelcomePopup() {
        setTimeout(() => {
            const popup = document.getElementById('welcome-popup');
            if (popup) {
                popup.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        }, 1500); // Show after 1.5 seconds
    },

    hideWelcomePopup() {
        const popup = document.getElementById('welcome-popup');
        if (popup) {
            popup.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Mark as visited
            localStorage.setItem('rippoke_visited', 'true');
            localStorage.setItem('rippoke_visit_date', new Date().toISOString());
        }
    },

    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('welcome-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideWelcomePopup();
            });
        }

        // Overlay click to close
        const popup = document.getElementById('welcome-popup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup || e.target.classList.contains('welcome-popup-overlay')) {
                    this.hideWelcomePopup();
                }
            });
        }

        // Start Shopping button
        const claimBtn = document.getElementById('claim-discount-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                this.hideWelcomePopup();
                // Redirect to booster packs page
                window.location.href = 'booster-packs.html';
            });
        }

        // Copy code button
        const copyBtn = document.getElementById('copy-code-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyPromoCode();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const popup = document.getElementById('welcome-popup');
                if (popup && popup.classList.contains('show')) {
                    this.hideWelcomePopup();
                }
            }
        });
    },

    copyPromoCode() {
        const code = 'NEWTRAINER10';
        
        // Try to use the clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(code).then(() => {
                this.showCopySuccess();
            }).catch(() => {
                this.fallbackCopyToClipboard(code);
            });
        } else {
            this.fallbackCopyToClipboard(code);
        }
    },

    fallbackCopyToClipboard(text) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        
        document.body.removeChild(textArea);
    },

    showCopySuccess() {
        const copyBtn = document.getElementById('copy-code-btn');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Code Copied!';
            copyBtn.style.background = 'rgba(72, 187, 120, 0.2)';
            copyBtn.style.borderColor = 'rgba(72, 187, 120, 0.4)';
            copyBtn.style.color = '#48bb78';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                copyBtn.style.color = 'rgba(255, 255, 255, 0.9)';
            }, 2000);
        }
        
        // Show notification
        if (typeof utils !== 'undefined' && utils.showNotification) {
            utils.showNotification('Promo code copied to clipboard!', 'success');
        }
    }
};

// Whatnot Live Sales Module
const WhatnotLiveSales = {
    init() {
        this.setupNotificationSignup();
        this.checkStreamStatus();
    },

    setupNotificationSignup() {
        const notificationBtn = document.getElementById('notification-signup');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotificationSignup();
            });
        }
    },

    showNotificationSignup() {
        const email = prompt('Enter your email to get notified when we go live on Whatnot:');
        if (email && this.validateEmail(email)) {
            // Simulate API call to save email
            setTimeout(() => {
                utils.showNotification('Thanks! You\'ll be notified of our next live sale!', 'success');
            }, 500);
        } else if (email) {
            utils.showNotification('Please enter a valid email address.', 'error');
        }
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    checkStreamStatus() {
        // This would normally check if the stream is live
        // For now, it's just a placeholder for future integration
        const statusIndicator = document.getElementById('stream-status');
        if (statusIndicator) {
            // You can update this when going live:
            // this.setStreamLive();
        }
    },

    setStreamLive() {
        const statusIndicator = document.getElementById('stream-status');
        const nextStreamText = document.querySelector('.next-stream span');
        
        if (statusIndicator) {
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('live');
            statusIndicator.querySelector('.status-text').textContent = 'LIVE NOW!';
        }
        
        if (nextStreamText) {
            nextStreamText.textContent = 'Currently Live - Join Now!';
        }
        
        // You can also replace the placeholder with actual Whatnot embed here
        this.embedWhatnotStream();
    },

    setStreamOffline() {
        const statusIndicator = document.getElementById('stream-status');
        const nextStreamText = document.querySelector('.next-stream span');
        
        if (statusIndicator) {
            statusIndicator.classList.remove('live');
            statusIndicator.classList.add('offline');
            statusIndicator.querySelector('.status-text').textContent = 'Currently Offline';
        }
        
        if (nextStreamText) {
            nextStreamText.textContent = 'Next Stream: Check back soon!';
        }
    },

    embedWhatnotStream() {
        // Placeholder for embedding actual Whatnot stream
        // You would replace the stream-placeholder with actual embed code
        const streamEmbed = document.getElementById('stream-embed');
        if (streamEmbed) {
            // Example of what you'd do when going live:
            /*
            streamEmbed.innerHTML = `
                <iframe 
                    src="YOUR_WHATNOT_EMBED_URL" 
                    width="100%" 
                    height="100%" 
                    frameborder="0">
                </iframe>
            `;
            */
        }
    }
};

// Hamburger Menu Module
const HamburgerMenu = {
    init() {
        this.setupHamburgerMenu();
    },

    setupHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburger-menu-btn');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburgerBtn && navMenu) {
            hamburgerBtn.addEventListener('click', () => {
                hamburgerBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a nav link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }
};

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    AnnouncementSlider.init();
    Navigation.init();
    ProductFilter.init();
    Wishlist.init();
    Cart.init();
    HamburgerMenu.init();
    
    // Initialize welcome popup only on homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html') || window.location.pathname === '/index.html') {
        WelcomePopup.init();
    }
    
    // Initialize Whatnot features on live sales page
    if (window.location.pathname.includes('sealed-packs.html')) {
        WhatnotLiveSales.init();
    }
    
    // Add loading complete class
    document.body.classList.add('loaded');
    LoadingAnimations.init();
    Search.init();
    KeyboardNavigation.init();
    Performance.init();
    Accessibility.init();

    // Add additional cart styles
    const cartStyles = document.createElement('style');
    cartStyles.textContent = `
        .cart-has-items .cart-btn {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .cart-has-items .cart-count {
            animation: pulse 0.6s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .header.scrolled {
            box-shadow: var(--shadow-md);
        }
        
        .view-list .product-grid {
            display: block;
        }
        
        .view-list .product-card {
            display: flex;
            margin-bottom: 20px;
            max-width: 100%;
        }
        
        .view-list .product-image {
            width: 200px;
            flex-shrink: 0;
        }
        
        .view-list .product-info {
            flex: 1;
        }
    `;
    document.head.appendChild(cartStyles);

    console.log('Card Vault Replica initialized successfully!');
});

// ===== EXPORT FOR POTENTIAL MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnnouncementSlider,
        Navigation,
        ProductFilter,
        Cart,
        Newsletter,
        CookieNotice,
        utils,
        state
    };
}
