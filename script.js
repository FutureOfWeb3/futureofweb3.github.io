/**
 * Card Vault Replica - JavaScript Functionality
 * Handles interactive features, filtering, cart operations, and UI enhancements
 */

// ===== GLOBAL STATE =====
const state = {
    cart: [],
    wishlist: [],
    appliedPromo: null,
    filters: {
        category: 'all',
        sort: 'featured',
        view: 'grid'
    },
    announcements: [
        {
            icon: 'fas fa-shipping-fast',
            text: 'Tracked Shipping To The US for only $15!'
        },
        {
            icon: 'fas fa-coins',
            text: '🤑 Become a Pokemon Master!'
        },
        {
            icon: 'fas fa-tags',
            text: '🏷️ Price Match Inquiries!'
        }
    ],
    currentAnnouncement: 0,
    currency: {
        current: 'USD',
        rates: {
            USD: 1.00
        },
        symbols: {
            USD: '$'
        }
    }
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

    // Format currency based on selected currency
    formatCurrency(amount, currencyCode = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Parse price from string (handles USD only)
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
        // Don't start slider here - will be started synchronously with slideshow
    },

    nextAnnouncement() {
        const items = document.querySelectorAll('.announcement-item');
        if (items.length === 0) return;

        const currentItem = items[state.currentAnnouncement];
        
        // Slide out current item
        currentItem.classList.remove('active');
        currentItem.classList.add('sliding-out');
        
        // Move to next
        state.currentAnnouncement = (state.currentAnnouncement + 1) % items.length;
        const nextItem = items[state.currentAnnouncement];
        
        // After a brief delay, slide in the next item
        setTimeout(() => {
            currentItem.classList.remove('sliding-out');
            nextItem.classList.add('active');
        }, 400);
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
        // This function is replaced by wishlistModal.open()
        if (window.wishlistModal) {
            window.wishlistModal.open();
        }
    }
};

const Cart = {
    init() {
        this.setupQuantityControls();
        this.setupAddToCartButtons();
        this.loadCartFromStorage();
        this.updateCartDisplay();
        this.initializeCart();
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
        
        // Check if this is a premium collection box and enforce max quantity of 3 TOTAL across all premium boxes
        const isPremiumCollection = product.title && (
            product.title.toLowerCase().includes('premium collection') ||
            product.title.toLowerCase().includes('blooming waters') ||
            product.title.toLowerCase().includes('lucario premium')
        );
        
        if (isPremiumCollection) {
            // Calculate current total premium boxes in cart
            const currentPremiumTotal = state.cart.reduce((total, item) => {
                const itemIsPremium = item.title && (
                    item.title.toLowerCase().includes('premium collection') ||
                    item.title.toLowerCase().includes('blooming waters') ||
                    item.title.toLowerCase().includes('lucario premium')
                );
                return total + (itemIsPremium ? item.quantity : 0);
            }, 0);
            
            if (existingItem) {
                // Adding to existing premium item
                const newTotalWithExisting = currentPremiumTotal + quantity;
                if (newTotalWithExisting > 3) {
                    const maxCanAdd = 3 - currentPremiumTotal;
                    if (maxCanAdd <= 0) {
                        utils.showNotification('Maximum 3 premium boxes total allowed per shipping box', 'error');
                        return;
                    } else {
                        existingItem.quantity += maxCanAdd;
                        utils.showNotification(`Added ${maxCanAdd} more (Maximum 3 total premium boxes reached)`, 'info');
                    }
                } else {
                    existingItem.quantity += quantity;
                }
            } else {
                // Adding new premium item
                const newTotalWithNew = currentPremiumTotal + quantity;
                if (newTotalWithNew > 3) {
                    const maxCanAdd = 3 - currentPremiumTotal;
                    if (maxCanAdd <= 0) {
                        utils.showNotification('Maximum 3 premium boxes total allowed per shipping box', 'error');
                        return;
                    } else {
                        state.cart.push({...product, productId, quantity: maxCanAdd});
                        utils.showNotification(`Added ${maxCanAdd} (Maximum 3 total premium boxes reached)`, 'info');
                    }
                } else {
                    state.cart.push({...product, productId, quantity});
                }
            }
        } else {
            // Non-premium item, normal logic
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.push({...product, productId, quantity});
            }
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartModal();
        
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
        this.updateCartModal();
        
        utils.showNotification('Added Ultimate Bundle to cart!', 'success');
        this.animateAddToCart(button);
    },

    extractProductData(productCard, button) {
        const titleElement = productCard.querySelector('.product-title');
        const priceElement = productCard.querySelector('.current-price');
        const imageElement = productCard.querySelector('.product-image img');
        
        const productData = {
            id: button?.dataset.product || Date.now() + Math.random(),
            title: titleElement?.textContent?.trim() || 'Unknown Product',
            price: parseFloat(button?.dataset.price) || utils.parsePrice(priceElement?.textContent || '0'),
            image: imageElement?.src || 'https://via.placeholder.com/300x400?text=Pokemon+Pack',
            alt: imageElement?.alt || 'Pokemon Booster Pack'
        };
        
        // Debug logging
        console.log('Extracted product data:', productData);
        console.log('Button element:', button);
        console.log('Product card:', productCard);
        
        return productData;
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
            
            // Debug logging
            console.log('Cart updated:', totalItems, 'items', state.cart);
            
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
                this.updateCartDisplay();
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
                state.cart = [];
            }
        }
        
        // Handle cart link click to show cart modal - specific selectors only
        const cartLinks = document.querySelectorAll('.header .cart-btn, #cart-link, #cart-icon, .cart-icon');
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
        
        // Update promo display
        this.updatePromoDisplay();
        
        // Populate suggestions
        this.populateSuggestions();
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    // Real product database from the actual site pages
    allProducts: [
        // Booster Packs
        {
            id: 'paldean-fates',
            name: 'Paldean Fates',
            subtitle: 'Special Set - Shiny Pokémon',
            price: 5.99,
            image: 'https://images.pokemontcg.io/sv4pt5/logo.png',
            category: 'booster',
            badge: 'Special Set'
        },
        {
            id: 'surging-sparks',
            name: 'Surging Sparks',
            subtitle: 'Scarlet & Violet Series',
            price: 4.49,
            image: 'https://images.pokemontcg.io/sv8/logo.png',
            category: 'booster',
            badge: 'New Release'
        },
        {
            id: 'pokemon-151',
            name: 'Pokémon 151',
            subtitle: 'Classic Collection',
            price: 6.99,
            image: 'https://images.pokemontcg.io/sv3pt5/logo.png',
            category: 'booster',
            badge: 'Classic'
        },
        {
            id: 'prismatic-evolutions',
            name: 'Prismatic Evolutions',
            subtitle: 'Special Collection',
            price: 5.49,
            image: 'https://tcg.pokemon.com/assets/img/sv-expansions/prismatic-evolutions/logo/en-us/sv8pt5-logo.png',
            category: 'booster',
            badge: 'Special Set'
        },
        {
            id: 'twilight-masquerade',
            name: 'Twilight Masquerade',
            subtitle: 'Scarlet & Violet Series',
            price: 4.99,
            image: 'https://images.pokemontcg.io/sv6/logo.png',
            category: 'booster',
            badge: 'Scarlet & Violet'
        },
        {
            id: 'white-flare',
            name: 'White Flare',
            subtitle: 'Special Edition Set',
            price: 5.99,
            image: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/sv_series/sv10pt5/wht/sv10pt5_logo_169_en.png',
            category: 'booster',
            badge: 'Special Edition'
        },
        {
            id: 'black-bolt',
            name: 'Black Bolt',
            subtitle: 'Special Edition Set',
            price: 5.99,
            image: 'https://tcg.pokemon.com/assets/img/sv-expansions/black-white/logos/black-bolt/en-us/zsv10pt5-logo.png',
            category: 'booster',
            badge: 'Special Edition'
        },
        // Elite Trainer Boxes
        {
            id: 'prismatic-evolutions-etb',
            name: 'Prismatic Evolutions ETB',
            subtitle: 'Elite Trainer Box',
            price: 49.99,
            image: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/incrementals/2025/sv8pt5-elite-trainer-box/sv8pt5-elite-trainer-box-169-en.png',
            category: 'etb',
            badge: 'Elite Trainer Box'
        },
        {
            id: 'twilight-masquerade-etb',
            name: 'Twilight Masquerade ETB',
            subtitle: 'Elite Trainer Box',
            price: 44.99,
            image: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/incrementals/2024/sv06-elite-trainer-box/sv06-elite-trainer-box-169-en.png',
            category: 'etb',
            badge: 'Elite Trainer Box'
        },
        {
            id: 'surging-sparks-etb',
            name: 'Surging Sparks ETB',
            subtitle: 'Elite Trainer Box',
            price: 49.99,
            image: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/trading-card-game/series/incrementals/2024/sv08-pokemon-center-elite-trainer-box/sv08-pokemon-center-elite-trainer-box-169-en.png',
            category: 'etb',
            badge: 'New Release'
        },
        // Additional Real ETBs from your site
        {
            id: 'pokemon-151-etb',
            name: 'Pokémon 151 ETB',
            subtitle: 'Elite Trainer Box',
            price: 54.99,
            image: 'https://images.pokemontcg.io/sv3pt5/logo.png',
            category: 'etb',
            badge: 'Elite Trainer Box'
        },
        {
            id: 'paldean-fates-etb',
            name: 'Paldean Fates ETB',
            subtitle: 'Elite Trainer Box',
            price: 52.99,
            image: 'https://images.pokemontcg.io/sv4pt5/logo.png',
            category: 'etb',
            badge: 'Elite Trainer Box'
        }
    ],

    populateSuggestions() {
        const suggestionsContainer = document.querySelector('.suggestions-grid');
        if (!suggestionsContainer) return;

        // Get 4 random products from all available products (exclude items already in cart)
        const cartProductIds = state.cart.map(item => item.productId || item.id);
        const availableProducts = this.allProducts.filter(product => !cartProductIds.includes(product.id));
        
        // Randomize and select 4 products
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0, 4);

        suggestionsContainer.innerHTML = selectedProducts.map(product => `
            <div class="suggestion-item" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" class="suggestion-image" 
                     onerror="this.src='https://via.placeholder.com/150x100?text=${encodeURIComponent(product.name)}'">
                <div class="suggestion-info">
                    <h4>${product.name}</h4>
                    <p class="suggestion-subtitle">${product.subtitle}</p>
                    <p class="suggestion-price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-sm btn-add" onclick="Cart.addSuggestionToCart('${product.id}')">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    },

    addSuggestionToCart(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;

        // Add to cart with proper structure
        const existingItem = state.cart.find(item => (item.productId || item.id) === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({
                productId: product.id,
                id: product.id,
                title: product.name,
                name: product.name,
                subtitle: product.subtitle,
                price: product.price,
                image: product.image,
                alt: product.name,
                category: product.category,
                badge: product.badge,
                quantity: 1
            });
        }

        // Save to localStorage
        localStorage.setItem('cardVaultCart', JSON.stringify(state.cart));
        
        // Update modal display
        this.updateCartModal();
        this.updateCartDisplay();
        
        // Refresh suggestions to show new random products
        this.populateSuggestions();

        // Show brief success message with animation
        const button = event.target.closest('.btn-add');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.disabled = true;
            button.style.background = '#48bb78';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 1200);
        }

        // Show notification
        utils.showNotification(`Added ${product.name} to cart!`, 'success');
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
                    
                    <!-- Free Shipping Progress -->
                    <div class="free-shipping-section">
                        <div class="shipping-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="free-shipping-info">
                            <div class="shipping-threshold">Free Shipping!</div>
                            <div class="shipping-amount">$125.00</div>
                        </div>
                        <div class="shipping-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="shipping-progress-fill"></div>
                            </div>
                            <div class="shipping-text" id="shipping-text">Spend $125.00 more to get Free Shipping!</div>
                        </div>
                    </div>
                    
                    <!-- Promo Code Section -->
                    <div class="promo-code-section">
                        <div class="promo-code-input">
                            <input type="text" id="promo-code-input" placeholder="Promo Code" onkeypress="if(event.key==='Enter') Cart.applyPromoCode()" />
                            <button class="apply-promo-btn" onclick="Cart.applyPromoCode()">Apply</button>
                        </div>
                        <div class="applied-promo" id="applied-promo" style="display: none;">
                            <span class="promo-name"></span>
                            <span class="promo-discount"></span>
                            <button class="remove-promo-btn" onclick="Cart.removePromoCode()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="cart-total">
                        <div class="cart-total-line">
                            <span>Subtotal: </span>
                            <span class="cart-subtotal">$0.00</span>
                        </div>
                        <div class="cart-total-line promo-discount-line" id="promo-discount-line" style="display: none;">
                            <span>Discount: </span>
                            <span class="promo-discount-amount">-$0.00</span>
                        </div>
                        <div class="cart-total-line shipping-line" id="shipping-line">
                            <span>Shipping: </span>
                            <span class="shipping-cost">$15.00</span>
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
                    <button class="btn btn-primary checkout-btn" onclick="Cart.checkout()">
                        <i class="fas fa-shopping-bag"></i> Checkout with Shopify
                    </button>
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
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(8px);
                cursor: pointer;
            }
            
            .cart-modal-content {
                background: #1a1a1a;
                border: 1px solid rgba(192, 132, 252, 0.2);
                border-radius: 12px;
                max-width: 600px;
                max-height: 80vh;
                width: 90%;
                position: relative;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(192, 132, 252, 0.1);
                transform: translateY(-20px);
                transition: transform 0.3s ease;
                color: white;
            }
            
            .cart-modal.show .cart-modal-content {
                transform: translateY(0);
            }
            
            .cart-modal-header {
                padding: 24px 24px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(192, 132, 252, 0.2);
                padding-bottom: 16px;
            }
            
            .cart-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .cart-modal-header h2 i {
                color: #c084fc;
            }
            
            .cart-modal-close {
                background: rgba(192, 132, 252, 0.1);
                border: 1px solid rgba(192, 132, 252, 0.2);
                font-size: 1.5rem;
                cursor: pointer;
                color: white;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.2s;
            }
            
            .cart-modal-close:hover {
                background: rgba(192, 132, 252, 0.2);
                color: #c084fc;
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
                border-bottom: 1px solid rgba(192, 132, 252, 0.1);
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
                background: rgba(192, 132, 252, 0.1);
                border: 1px solid rgba(192, 132, 252, 0.2);
            }
            
            .cart-item-details {
                flex: 1;
            }
            
            .cart-item-title {
                font-weight: 600;
                color: white;
                margin-bottom: 4px;
                font-size: 0.9rem;
            }
            
            .cart-item-price {
                color: #c084fc;
                font-size: 0.9rem;
                font-weight: 500;
            }
            
            .cart-item-price .max-text {
                color: #FFD700;
                font-weight: 700;
                font-size: 0.85rem;
                margin-left: 8px;
                text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
            }
            
            .cart-item-quantity {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-right: 16px;
            }
            
            .cart-qty-btn {
                background: rgba(192, 132, 252, 0.1);
                border: 1px solid rgba(192, 132, 252, 0.2);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: white;
                transition: all 0.2s;
            }
            
            .cart-qty-btn:hover {
                background: #c084fc;
                border-color: #c084fc;
                color: black;
            }
            
            .cart-qty-display {
                min-width: 24px;
                text-align: center;
                font-weight: 600;
                color: white;
            }
            
            .cart-item-remove {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
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
                color: rgba(255, 255, 255, 0.6);
            }
            
            .cart-empty i {
                font-size: 3rem;
                margin-bottom: 16px;
                color: rgba(192, 132, 252, 0.3);
            }
            
            .cart-total {
                border-top: 2px solid rgba(192, 132, 252, 0.2);
                padding-top: 16px;
            }
            
            .cart-total-line {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .cart-total-final {
                font-size: 1.2rem;
                font-weight: 700;
                color: white;
                border-top: 1px solid rgba(192, 132, 252, 0.2);
                padding-top: 8px;
                margin-top: 8px;
            }
            
            .cart-total-final span:last-child {
                color: #c084fc;
            }
            
            .cart-modal-footer {
                padding: 24px;
                border-top: 1px solid rgba(192, 132, 252, 0.2);
                display: flex;
                gap: 16px;
                justify-content: flex-end;
            }

            .btn-secondary {
                background: rgba(255, 255, 255, 0.1) !important;
                color: white !important;
                border: 1px solid rgba(192, 132, 252, 0.2) !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
                cursor: pointer !important;
            }

            .btn-secondary:hover {
                background: rgba(192, 132, 252, 0.1) !important;
                border-color: #c084fc !important;
            }

            .checkout-btn {
                background: linear-gradient(135deg, #c084fc, #a855f7) !important;
                color: white !important;
                border: none !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                transition: all 0.3s ease !important;
            }

            .checkout-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 20px rgba(192, 132, 252, 0.4) !important;
            }

            .cart-suggestions {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid rgba(192, 132, 252, 0.1);
            }

            .cart-suggestions h3 {
                color: white;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .cart-suggestions h3 i {
                color: #c084fc;
            }

            .suggestions-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-top: 16px;
            }

            @media (max-width: 768px) {
                .suggestions-grid {
                    grid-template-columns: 1fr;
                }
            }

            .cart-modal .suggestion-item,
            .suggestion-item {
                background: rgba(26, 26, 26, 0.9) !important;
                border: 1px solid rgba(192, 132, 252, 0.3) !important;
                border-radius: 8px !important;
                padding: 12px !important;
                text-align: center !important;
                transition: all 0.3s ease !important;
                position: relative !important;
                overflow: hidden !important;
                backdrop-filter: blur(10px) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
            }

            .cart-modal .suggestion-item:hover,
            .suggestion-item:hover {
                background: rgba(26, 26, 26, 0.95) !important;
                border-color: rgba(192, 132, 252, 0.5) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(192, 132, 252, 0.3) !important;
            }

            .cart-modal .suggestion-image,
            .suggestion-image {
                width: 100% !important;
                height: 80px !important;
                object-fit: contain !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background: rgba(192, 132, 252, 0.1) !important;
                padding: 4px !important;
                border: 1px solid rgba(192, 132, 252, 0.2) !important;
            }

            .cart-modal .suggestion-info h4,
            .suggestion-info h4 {
                color: white !important;
                font-size: 0.9rem !important;
                margin-bottom: 2px !important;
                font-weight: 600 !important;
                line-height: 1.1 !important;
            }

            .cart-modal .suggestion-subtitle,
            .suggestion-subtitle {
                color: rgba(255, 255, 255, 0.6) !important;
                font-size: 0.75rem !important;
                margin-bottom: 6px !important;
                font-style: italic !important;
            }

            .cart-modal .suggestion-price,
            .suggestion-price {
                color: #c084fc !important;
                font-weight: 700 !important;
                font-size: 1rem !important;
                margin-bottom: 8px !important;
            }


            .btn-add {
                background: linear-gradient(135deg, #c084fc, #a855f7) !important;
                color: white !important;
                border: none !important;
                padding: 6px 12px !important;
                border-radius: 6px !important;
                font-size: 0.8rem !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                width: 100% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 4px !important;
            }

            .btn-add:hover {
                background: linear-gradient(135deg, #a855f7, #9333ea) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 15px rgba(192, 132, 252, 0.4) !important;
            }

            .btn-add:active {
                transform: translateY(0) !important;
            }

            /* Free Shipping Progress Section */
            .free-shipping-section {
                background: rgba(26, 26, 26, 0.9);
                border: 1px solid rgba(192, 132, 252, 0.2);
                border-radius: 12px;
                padding: 16px;
                margin: 24px 0;
                backdrop-filter: blur(10px);
            }
            
            .free-shipping-section .shipping-icon {
                display: flex;
                justify-content: center;
                margin-bottom: 12px;
            }
            
            .free-shipping-section .shipping-icon i {
                background: linear-gradient(135deg, #c084fc, #a855f7);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .free-shipping-info {
                text-align: center;
                margin-bottom: 16px;
            }
            
            .shipping-threshold {
                color: #c084fc;
                font-weight: 700;
                font-size: 1.1rem;
                margin-bottom: 4px;
            }
            
            .shipping-amount {
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #c084fc, #a855f7);
                border-radius: 4px;
                transition: width 0.5s ease;
                width: 0%;
            }
            
            .shipping-text {
                text-align: center;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .shipping-text.free-shipping-achieved {
                color: #FFD700;
                font-weight: 700;
                font-size: 1rem;
                text-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
            }
            
            /* Promo Code Section */
            .promo-code-section {
                margin: 24px 0;
            }
            
            .promo-code-input {
                display: flex;
                gap: 12px;
                margin-bottom: 12px;
            }
            
            .promo-code-input input {
                flex: 1;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(192, 132, 252, 0.2);
                border-radius: 8px;
                padding: 12px 16px;
                color: white;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }
            
            .promo-code-input input:focus {
                outline: none;
                border-color: #c084fc;
                background: rgba(255, 255, 255, 0.15);
                box-shadow: 0 0 0 2px rgba(192, 132, 252, 0.2);
            }
            
            .promo-code-input input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            
            .apply-promo-btn {
                background: #ff6b35;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            
            .apply-promo-btn:hover {
                background: #e5502a;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
            }
            
            .applied-promo {
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 8px;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .promo-name {
                color: #22c55e;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .promo-discount {
                color: #22c55e;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .remove-promo-btn {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 0.8rem;
            }
            
            .remove-promo-btn:hover {
                background: rgba(239, 68, 68, 0.3);
                transform: scale(1.1);
            }
            
            /* Updated Cart Total Section */
            .cart-total-line {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(192, 132, 252, 0.1);
            }
            
            .cart-total-line:last-child {
                border-bottom: none;
                margin-top: 8px;
                padding-top: 16px;
                border-top: 2px solid rgba(192, 132, 252, 0.2);
            }
            
            .promo-discount-line {
                color: #22c55e;
            }
            
            .shipping-line.free-shipping {
                color: #22c55e;
            }
            
            .shipping-line.free-shipping .shipping-cost {
                text-decoration: line-through;
                opacity: 0.6;
                margin-right: 8px;
            }
            
            .shipping-line.free-shipping::after {
                content: "FREE";
                color: #22c55e;
                font-weight: 600;
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
            this.updateShippingProgress(0);
            return;
        }

        let html = '';
        let subtotal = 0;

        state.cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            // Check if this is a premium collection box
            const isPremiumCollection = item.title && (
                item.title.toLowerCase().includes('premium collection') ||
                item.title.toLowerCase().includes('blooming waters') ||
                item.title.toLowerCase().includes('lucario premium')
            );
            
            // Calculate total premium boxes in cart for + button disable logic
            let totalPremiumBoxes = 0;
            if (isPremiumCollection) {
                totalPremiumBoxes = state.cart.reduce((total, cartItem) => {
                    const itemIsPremium = cartItem.title && (
                        cartItem.title.toLowerCase().includes('premium collection') ||
                        cartItem.title.toLowerCase().includes('blooming waters') ||
                        cartItem.title.toLowerCase().includes('lucario premium')
                    );
                    return total + (itemIsPremium ? cartItem.quantity : 0);
                }, 0);
            }
            
            // Disable + button if at max total premium boxes (3 total across all types)
            const plusDisabled = isPremiumCollection && totalPremiumBoxes >= 3 ? 'disabled' : '';
            const maxText = isPremiumCollection ? '<span class="max-text">(Max: 3 total premium boxes)</span>' : '';
            
            html += `
                <div class="cart-item">
                    <img src="${item.image || '/api/placeholder/60/60'}" alt="${item.alt}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${utils.formatCurrency(item.price, state.currency.current)} each ${maxText}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="cart-qty-btn" onclick="Cart.updateQuantity(${index}, -1)">-</button>
                        <span class="cart-qty-display">${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="Cart.updateQuantity(${index}, 1)" ${plusDisabled}>+</button>
                    </div>
                    <button class="cart-item-remove" onclick="Cart.removeItem(${index})" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
        
        // Calculate totals with discounts and shipping
        const discountAmount = this.calculateDiscount(subtotal);
        const discountedSubtotal = subtotal - discountAmount;
        const shippingCost = discountedSubtotal >= 125 ? 0 : 15;
        const finalTotal = discountedSubtotal + shippingCost;
        
        // Update display elements
        subtotalElement.textContent = utils.formatCurrency(subtotal, state.currency.current);
        
        // Update shipping progress
        this.updateShippingProgress(discountedSubtotal);
        
        // Update totals section
        this.updateTotalSection(subtotal, discountAmount, shippingCost, finalTotal);
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
            const item = state.cart[index];
            const newQuantity = item.quantity + change;
            
            // Check if this is a premium collection box and enforce max quantity of 3 TOTAL across all premium boxes
            const isPremiumCollection = item.title && (
                item.title.toLowerCase().includes('premium collection') ||
                item.title.toLowerCase().includes('blooming waters') ||
                item.title.toLowerCase().includes('lucario premium')
            );
            
            if (newQuantity <= 0) {
                state.cart.splice(index, 1);
            } else if (isPremiumCollection && change > 0) {
                // Calculate current total premium boxes (excluding the item being updated)
                const currentPremiumTotal = state.cart.reduce((total, cartItem, cartIndex) => {
                    if (cartIndex === index) return total; // Skip the item being updated
                    const itemIsPremium = cartItem.title && (
                        cartItem.title.toLowerCase().includes('premium collection') ||
                        cartItem.title.toLowerCase().includes('blooming waters') ||
                        cartItem.title.toLowerCase().includes('lucario premium')
                    );
                    return total + (itemIsPremium ? cartItem.quantity : 0);
                }, 0);
                
                const newTotalPremium = currentPremiumTotal + newQuantity;
                if (newTotalPremium > 3) {
                    utils.showNotification('Maximum 3 premium boxes total allowed per shipping box', 'error');
                    return; // Don't update quantity beyond total limit
                } else {
                    item.quantity = newQuantity;
                }
            } else {
                item.quantity = newQuantity;
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

    updateShippingProgress(subtotal) {
        const freeShippingThreshold = 125;
        const progressFill = document.getElementById('shipping-progress-fill');
        const shippingText = document.getElementById('shipping-text');
        
        if (!progressFill || !shippingText) return;
        
        const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
        const remaining = Math.max(freeShippingThreshold - subtotal, 0);
        
        progressFill.style.width = `${progress}%`;
        
        if (subtotal >= freeShippingThreshold) {
            shippingText.textContent = 'You qualify for FREE shipping!';
            shippingText.classList.add('free-shipping-achieved');
        } else {
            shippingText.textContent = `Spend $${remaining.toFixed(2)} more to get Free Shipping!`;
            shippingText.classList.remove('free-shipping-achieved');
        }
    },

    updateTotalSection(subtotal, discountAmount, shippingCost, finalTotal) {
        const discountLine = document.getElementById('promo-discount-line');
        const discountAmountElement = document.querySelector('.promo-discount-amount');
        const shippingLine = document.getElementById('shipping-line');
        const shippingCostElement = document.querySelector('.shipping-cost');
        const totalElement = document.querySelector('.cart-final-total');
        
        // Update discount display
        if (discountAmount > 0 && discountLine && discountAmountElement) {
            discountLine.style.display = 'flex';
            discountAmountElement.textContent = `-${utils.formatCurrency(discountAmount, state.currency.current)}`;
        } else if (discountLine) {
            discountLine.style.display = 'none';
        }
        
        // Update shipping display
        if (shippingLine && shippingCostElement) {
            if (shippingCost === 0) {
                shippingLine.classList.add('free-shipping');
                shippingCostElement.textContent = '$15.00';
            } else {
                shippingLine.classList.remove('free-shipping');
                shippingCostElement.textContent = utils.formatCurrency(shippingCost, state.currency.current);
            }
        }
        
        // Update final total
        if (totalElement) {
            totalElement.textContent = utils.formatCurrency(finalTotal, state.currency.current);
        }
    },

    calculateDiscount(subtotal) {
        if (!state.appliedPromo) return 0;
        
        const promo = state.appliedPromo;
        if (promo.type === 'percentage') {
            return subtotal * (promo.value / 100);
        } else if (promo.type === 'fixed') {
            return Math.min(promo.value, subtotal);
        }
        return 0;
    },

    applyPromoCode() {
        const input = document.getElementById('promo-code-input');
        const promoCode = input.value.trim().toUpperCase();
        
        if (!promoCode) {
            utils.showNotification('Please enter a promo code', 'error');
            return;
        }
        
        // Define available promo codes
        const promoCodes = {
            'NEWTRAINER10': { type: 'percentage', value: 10, name: 'New Trainer 10%' },
            'SAVE15': { type: 'percentage', value: 15, name: 'Save 15%' },
            'POKEMON20': { type: 'percentage', value: 20, name: 'Pokemon 20%' },
            'FREEBIE': { type: 'fixed', value: 5, name: '$5 Off' },
            'WELCOME': { type: 'fixed', value: 10, name: '$10 Off' }
        };
        
        if (promoCodes[promoCode]) {
            state.appliedPromo = { ...promoCodes[promoCode], code: promoCode };
            
            // Update UI
            this.updatePromoDisplay();
            this.updateCartModal();
            
            // Clear input
            input.value = '';
            
            utils.showNotification(`Promo code ${promoCode} applied!`, 'success');
        } else {
            utils.showNotification('Invalid promo code', 'error');
        }
    },

    removePromoCode() {
        state.appliedPromo = null;
        this.updatePromoDisplay();
        this.updateCartModal();
        utils.showNotification('Promo code removed', 'info');
    },

    updatePromoDisplay() {
        const promoInput = document.querySelector('.promo-code-input');
        const appliedPromo = document.getElementById('applied-promo');
        
        if (!promoInput || !appliedPromo) return;
        
        if (state.appliedPromo) {
            promoInput.style.display = 'none';
            appliedPromo.style.display = 'flex';
            
            const promoName = appliedPromo.querySelector('.promo-name');
            const promoDiscount = appliedPromo.querySelector('.promo-discount');
            
            if (promoName && promoDiscount) {
                promoName.textContent = state.appliedPromo.code;
                if (state.appliedPromo.type === 'percentage') {
                    promoDiscount.textContent = `-${state.appliedPromo.value}%`;
                } else {
                    promoDiscount.textContent = `-${utils.formatCurrency(state.appliedPromo.value, state.currency.current)}`;
                }
            }
        } else {
            promoInput.style.display = 'flex';
            appliedPromo.style.display = 'none';
        }
    },

    checkout() {
        if (state.cart.length === 0) {
            utils.showNotification('Your cart is empty!', 'error');
            return;
        }

        // Calculate total
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Show loading message
        utils.showNotification('Redirecting to Shopify checkout...', 'success');
        
        // Hide cart modal
        this.hideCartModal();
        
        // Redirect to Shopify checkout
        setTimeout(() => {
            // In a real implementation, you would build the Shopify cart URL with actual product variants
            // For now, we'll simulate the redirect
            const shopifyDomain = 'your-shop-name.myshopify.com'; // Replace with actual domain
            const checkoutUrl = `https://${shopifyDomain}/cart`;
            
            // For demo purposes, show alert. In production, use: window.location.href = checkoutUrl;
            if (confirm(`Ready to checkout with total: ${utils.formatCurrency(total, state.currency.current)}\n\nClick OK to proceed to Shopify checkout`)) {
                // window.location.href = checkoutUrl;
                alert('This would redirect to your Shopify store checkout page');
            }
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

// ===== HAMBURGER MENU =====
const HamburgerMenu = {
    init() {
        this.hamburgerBtn = document.getElementById('hamburger-menu-btn');
        this.navMenu = document.getElementById('nav-menu');
        
        if (this.hamburgerBtn && this.navMenu) {
            this.bindEvents();
        }
    },

    bindEvents() {
        // Toggle menu when hamburger button is clicked
        this.hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('mobile-open')) {
                if (!this.navMenu.contains(e.target) && !this.hamburgerBtn.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });

        // Close menu when clicking on nav links (but not dropdown toggles)
        this.navMenu.querySelectorAll('.nav-link:not(.dropdown > .nav-link)').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Initialize mobile dropdowns
        this.initMobileDropdowns();

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('mobile-open')) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navMenu.classList.contains('mobile-open')) {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        if (this.navMenu.classList.contains('mobile-open')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        // Add classes for animation
        this.hamburgerBtn.classList.add('active');
        this.navMenu.classList.add('mobile-open');
        document.body.classList.add('menu-open');
        
        // Add aria attributes for accessibility
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
        this.navMenu.setAttribute('aria-hidden', 'false');
        
        // Focus management for accessibility
        const firstLink = this.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    },

    closeMenu() {
        // Remove classes
        this.hamburgerBtn.classList.remove('active');
        this.navMenu.classList.remove('mobile-open');
        document.body.classList.remove('menu-open');
        
        // Update aria attributes
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
    },

    // Utility method to check if menu is open
    isMenuOpen() {
        return this.navMenu.classList.contains('mobile-open');
    },
    
    // Initialize mobile dropdown functionality
    initMobileDropdowns() {
        const dropdowns = this.navMenu.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('> .nav-link');
            
            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other open dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('open');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('open');
                });
            }
        });
        
        // Close dropdown menus when clicking on dropdown menu items
        this.navMenu.querySelectorAll('.dropdown-menu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }
};

// ===== WISHLIST MODAL FUNCTIONALITY =====
const wishlistModal = {
    modal: null,
    overlay: null,
    closeBtn: null,
    itemsContainer: null,
    emptyState: null,
    footer: null,

    init() {
        this.modal = document.getElementById('wishlist-modal');
        this.overlay = document.querySelector('.wishlist-modal-overlay');
        this.closeBtn = document.getElementById('wishlist-close-btn');
        this.itemsContainer = document.getElementById('wishlist-items');
        this.emptyState = document.getElementById('empty-wishlist');
        this.footer = document.getElementById('wishlist-footer');

        // Event listeners
        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Footer button events
        const addAllBtn = document.getElementById('add-all-to-cart-btn');
        const clearBtn = document.getElementById('clear-wishlist-btn');

        if (addAllBtn) {
            addAllBtn.addEventListener('click', () => this.addAllToCart());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearWishlist());
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },

    open() {
        if (this.modal) {
            this.renderWishlistItems();
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    renderWishlistItems() {
        if (!this.itemsContainer) return;

        const wishlist = this.getWishlistFromStorage();
        
        if (wishlist.length === 0) {
            this.showEmptyState();
        } else {
            this.showWishlistItems(wishlist);
        }
    },

    showEmptyState() {
        if (this.emptyState) this.emptyState.style.display = 'block';
        if (this.footer) this.footer.style.display = 'none';
    },

    showWishlistItems(wishlist) {
        if (this.emptyState) this.emptyState.style.display = 'none';
        if (this.footer) this.footer.style.display = 'flex';

        // Clear existing items except empty state
        const existingItems = this.itemsContainer.querySelectorAll('.wishlist-item');
        existingItems.forEach(item => item.remove());

        wishlist.forEach(item => {
            const wishlistItem = this.createWishlistItemElement(item);
            this.itemsContainer.appendChild(wishlistItem);
        });
    },

    createWishlistItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'wishlist-item';
        itemDiv.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${item.image || '/api/placeholder/60/60'}" alt="${item.title}">
            </div>
            <div class="wishlist-item-info">
                <h4 class="wishlist-item-title">${item.title}</h4>
                <p class="wishlist-item-price">${utils.formatCurrency(item.price, state.currency.current)}</p>
            </div>
            <div class="wishlist-item-actions">
                <button class="btn-add-to-cart-wishlist" onclick="wishlistModal.addToCart('${item.id}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-remove-from-wishlist" onclick="wishlistModal.removeFromWishlist('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return itemDiv;
    },

    addToCart(itemId) {
        const wishlist = this.getWishlistFromStorage();
        const item = wishlist.find(i => i.id === itemId);
        
        if (item) {
            const cartItem = {
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: 1
            };

            state.cart.push(cartItem);
            this.updateCartDisplay();
            
            utils.showNotification(`${item.title} added to cart!`, 'success');
        }
    },

    removeFromWishlist(itemId) {
        let wishlist = this.getWishlistFromStorage();
        wishlist = wishlist.filter(item => item.id !== itemId);
        
        localStorage.setItem('rippoke_wishlist', JSON.stringify(wishlist));
        state.wishlist = wishlist;
        
        this.updateWishlistCounter();
        this.renderWishlistItems();
        
        utils.showNotification('Item removed from wishlist', 'success');
    },

    addAllToCart() {
        const wishlist = this.getWishlistFromStorage();
        
        if (wishlist.length === 0) return;

        wishlist.forEach(item => {
            const cartItem = {
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: 1
            };
            state.cart.push(cartItem);
        });

        this.updateCartDisplay();
        utils.showNotification(`${wishlist.length} items added to cart!`, 'success');
        this.close();
    },

    clearWishlist() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            localStorage.removeItem('rippoke_wishlist');
            state.wishlist = [];
            
            this.updateWishlistCounter();
            this.renderWishlistItems();
            
            utils.showNotification('Wishlist cleared', 'success');
        }
    },

    getWishlistFromStorage() {
        try {
            const stored = localStorage.getItem('rippoke_wishlist');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    },

    updateWishlistCounter() {
        const counter = document.querySelector('.wishlist-count');
        if (counter) {
            const wishlist = this.getWishlistFromStorage();
            counter.textContent = wishlist.length;
        }
    },

    updateCartDisplay() {
        const cartCounter = document.querySelector('.cart-count');
        if (cartCounter) {
            const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalItems;
            
            // Animate cart icon when items added
            if (totalItems > 0) {
                cartCounter.parentElement.classList.add('cart-has-items');
            } else {
                cartCounter.parentElement.classList.remove('cart-has-items');
            }
        }
    }
};

// Global function to close wishlist modal
function closeWishlistModal() {
    wishlistModal.close();
}

// Global function to add item to wishlist
function addToWishlist(productId, title, price, image) {
    const wishlist = wishlistModal.getWishlistFromStorage();
    
    if (wishlist.find(item => item.id === productId)) {
        utils.showNotification('Item already in wishlist!', 'error');
        return;
    }

    const wishlistItem = {
        id: productId,
        title: title,
        price: price,
        image: image,
        addedAt: new Date().toISOString()
    };

    wishlist.push(wishlistItem);
    localStorage.setItem('rippoke_wishlist', JSON.stringify(wishlist));
    state.wishlist = wishlist;
    
    wishlistModal.updateWishlistCounter();
    utils.showNotification(`${title} added to wishlist!`, 'success');
}

// ===== CURRENCY CONVERTER =====
const CurrencyConverter = {
    init() {
        this.setUSDOnly();
    },

    setUSDOnly() {
        // Set currency to USD and disable currency selector
        state.currency.current = 'USD';
        
        // Update all currency selectors to show USD and disable them
        const currencySelectors = document.querySelectorAll('#currency, select[name="currency"]');
        currencySelectors.forEach(selector => {
            selector.value = 'USD';
            selector.disabled = true;
        });
        
        // Clean up any stored currency preferences
        localStorage.removeItem('rippoke_currency');
        localStorage.removeItem('rippoke_exchange_rates');
        localStorage.removeItem('rippoke_rates_updated');
    },

    // Simplified methods that always return USD values
    convertPrice(amount, fromCurrency = 'USD', toCurrency = 'USD') {
        return amount; // Always return the same amount since we only use USD
    },

    getFormattedPrice(amount, fromCurrency = 'USD') {
        return utils.formatCurrency(amount, 'USD');
    }
};

// ===== HERO SLIDESHOW =====
let currentSlide = 0;
let slideInterval;
const slides = [];
const navDots = [];

function initHeroSlideshow() {
    const slideElements = document.querySelectorAll('.slide');
    const navDotElements = document.querySelectorAll('.nav-dot');
    
    if (slideElements.length === 0) return;
    
    slides.length = 0;
    navDots.length = 0;
    
    slideElements.forEach(slide => slides.push(slide));
    navDotElements.forEach(dot => navDots.push(dot));
    
    // Add click event listeners to navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Start automatic slideshow
    startSlideshow();
    
    // Pause on hover
    const slideshow = document.querySelector('.slideshow-container');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', pauseSlideshow);
        slideshow.addEventListener('mouseleave', startSlideshow);
    }
}

function goToSlide(slideIndex) {
    // Remove active class from current slide and dot
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (navDots[currentSlide]) navDots[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = slideIndex;
    
    // Add active class to new slide and dot
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (navDots[currentSlide]) navDots[currentSlide].classList.add('active');
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
    // Only sync announcement when auto-playing, not manual controls
}

function prevSlide() {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
}

function nextSlideAuto() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
    // Synchronize announcement banner transition during auto-play
    AnnouncementSlider.nextAnnouncement();
}

function startSlideshow() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlideAuto, 5000); // 5 second interval
}

function pauseSlideshow() {
    clearInterval(slideInterval);
}

// Global function for slide controls
function changeSlide(direction) {
    if (direction === 1) {
        nextSlide();
    } else if (direction === -1) {
        prevSlide();
    }
    // Restart the interval after manual change
    startSlideshow();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    AnnouncementSlider.init();
    Navigation.init();
    ProductFilter.init();
    Wishlist.init();
    Cart.init();
    HamburgerMenu.init();
    
    // Initialize wishlist modal and make it globally accessible
    wishlistModal.init();
    window.wishlistModal = wishlistModal;
    
    // Load wishlist from localStorage into state
    const storedWishlist = wishlistModal.getWishlistFromStorage();
    state.wishlist = storedWishlist;
    wishlistModal.updateWishlistCounter();
    
    // Ensure cart display is updated on page load
    Cart.updateCartDisplay();
    
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
    CurrencyConverter.init();

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
        
        .cart-qty-btn[disabled] {
            opacity: 0.3;
            cursor: not-allowed;
            background: #ccc !important;
            color: #666 !important;
        }
        
        .cart-qty-btn[disabled]:hover {
            background: #ccc !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(cartStyles);

    // Initialize Hero Slideshow
    initHeroSlideshow();

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
        CurrencyConverter,
        utils,
        state
    };
}
