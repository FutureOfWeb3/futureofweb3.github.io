class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.attachEventListeners();
    }

    loadCart() {
        const saved = localStorage.getItem('gripgod_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('gripgod_cart', JSON.stringify(this.items));
    }

    addItem(service, duration, price) {
        const item = {
            id: Date.now(),
            service: service,
            duration: duration,
            price: parseFloat(price)
        };
        this.items.push(item);
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${service} added to cart!`);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartUI();
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }

    getItemCount() {
        return this.items.length;
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            cartCount.textContent = this.getItemCount();
            cartCount.style.display = this.getItemCount() > 0 ? 'flex' : 'none';
        }

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.service}</h4>
                            <p>${item.duration}</p>
                        </div>
                        <div class="cart-item-price">
                            <span>$${item.price.toFixed(2)}</span>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `).join('');

                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.currentTarget.dataset.id);
                        this.removeItem(id);
                    });
                });
            }
        }

        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
    }

    attachEventListeners() {
        const cartBtn = document.getElementById('cartBtn');
        const closeCart = document.getElementById('closeCart');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartSidebar = document.getElementById('cartSidebar');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const service = e.currentTarget.dataset.service;
                const duration = e.currentTarget.dataset.duration;
                const price = e.currentTarget.dataset.price;
                this.addItem(service, duration, price);
            });
        });
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    async checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        this.closeCart();
        this.showSquarePaymentModal();
    }

    showSquarePaymentModal() {
        const total = this.getTotal();
        const itemsList = this.items.map(item => `
            <div class="order-item">
                <span>${item.service} (${item.duration})</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `).join('');

        const modal = document.createElement('div');
        modal.className = 'square-payment-modal';
        modal.id = 'squarePaymentModal';
        modal.innerHTML = `
            <div class="square-payment-container">
                <div class="square-payment-header">
                    <h2>Complete Your Booking</h2>
                    <button class="close-square-modal" id="closeSquareModal">
                        ×
                    </button>
                </div>
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    ${itemsList}
                    <div class="order-total">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="customer-info-form">
                    <h3>Your Information</h3>
                    <input type="text" id="customerName" placeholder="Full Name" required>
                    <input type="email" id="customerEmail" placeholder="Email Address" required>
                    <input type="tel" id="customerPhone" placeholder="Phone Number" required>
                    <textarea id="customerNotes" placeholder="Special requests or preferred appointment time (optional)" rows="3"></textarea>
                </div>
                <div id="card-container" class="card-container"></div>
                <div id="payment-status" class="payment-status"></div>
                <button id="card-button" class="square-pay-btn">Pay $${total.toFixed(2)}</button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        document.getElementById('closeSquareModal').addEventListener('click', () => {
            this.closeSquareModal();
        });

        this.initializeSquarePayment(total);
    }

    closeSquareModal() {
        const modal = document.getElementById('squarePaymentModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }

    async initializeSquarePayment(amount) {
        try {
            // Initialize Square Web Payments SDK
            // NOTE: Replace 'YOUR_APPLICATION_ID' with your actual Square Application ID
            // Get this from: https://developer.squareup.com/apps
            const applicationId = 'YOUR_APPLICATION_ID'; // REPLACE THIS
            const locationId = 'YOUR_LOCATION_ID'; // REPLACE THIS

            if (!window.Square) {
                throw new Error('Square.js failed to load properly');
            }

            const payments = window.Square.payments(applicationId, locationId);
            const card = await payments.card();
            await card.attach('#card-container');

            const cardButton = document.getElementById('card-button');
            cardButton.addEventListener('click', async (event) => {
                event.preventDefault();
                await this.handlePaymentMethodSubmission(card, amount);
            });
        } catch (e) {
            console.error('Square initialization error:', e);
            this.displayPaymentStatus('Square payment system is being configured. Please contact us to complete your booking.', 'error');
        }
    }

    async handlePaymentMethodSubmission(paymentMethod, amount) {
        const cardButton = document.getElementById('card-button');
        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const customerNotes = document.getElementById('customerNotes').value;

        if (!customerName || !customerEmail || !customerPhone) {
            this.displayPaymentStatus('Please fill in all required fields.', 'error');
            return;
        }

        try {
            cardButton.disabled = true;
            cardButton.textContent = 'Processing...';

            const tokenResult = await paymentMethod.tokenize();
            if (tokenResult.status === 'OK') {
                // Send tokenResult.token to your server for payment processing
                await this.processPayment(tokenResult.token, amount, {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    notes: customerNotes
                });
            } else {
                let errorMessage = 'Payment failed. Please try again.';
                if (tokenResult.errors) {
                    errorMessage = tokenResult.errors.map(error => error.message).join(', ');
                }
                this.displayPaymentStatus(errorMessage, 'error');
                cardButton.disabled = false;
                cardButton.textContent = `Pay $${amount.toFixed(2)}`;
            }
        } catch (e) {
            console.error('Payment error:', e);
            this.displayPaymentStatus('Payment processing error. Please try again.', 'error');
            cardButton.disabled = false;
            cardButton.textContent = `Pay $${amount.toFixed(2)}`;
        }
    }

    async processPayment(token, amount, customerInfo) {
        try {
            // This is where you would send the payment token to your server
            // For now, we'll simulate a successful payment
            // You need to create a server endpoint to process Square payments
            
            // Simulated API call - REPLACE THIS with your actual backend endpoint
            // const response = await fetch('/api/process-payment', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         token: token,
            //         amount: amount * 100, // Square uses cents
            //         currency: 'USD',
            //         customer: customerInfo,
            //         items: this.items
            //     })
            // });
            // const result = await response.json();

            // Simulated success for demonstration
            setTimeout(() => {
                this.displayPaymentStatus('Payment successful! Booking confirmed.', 'success');
                this.sendBookingConfirmation(customerInfo, amount);
                setTimeout(() => {
                    this.clearCart();
                    this.closeSquareModal();
                }, 3000);
            }, 1500);

        } catch (e) {
            console.error('Server error:', e);
            this.displayPaymentStatus('Server error. Please contact us directly.', 'error');
        }
    }

    sendBookingConfirmation(customerInfo, amount) {
        // Send confirmation email via your backend
        console.log('Booking confirmation:', {
            customer: customerInfo,
            amount: amount,
            items: this.items
        });
    }

    displayPaymentStatus(message, type) {
        const statusDiv = document.getElementById('payment-status');
        statusDiv.textContent = message;
        statusDiv.className = `payment-status ${type}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `${message}`;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

const cart = new ShoppingCart();
window.cart = cart;
