document.addEventListener('DOMContentLoaded', function() {
    initCustomOrder();
});

function initCustomOrder() {
    const packageItems = [];
    const packageItemsContainer = document.getElementById('packageItems');
    const packageSubtotal = document.getElementById('packageSubtotal');
    const packageDiscount = document.getElementById('packageDiscount');
    const packageTotal = document.getElementById('packageTotal');
    const discountRow = document.getElementById('discountRow');
    const discountPercent = document.getElementById('discountPercent');
    const addPackageBtn = document.getElementById('addPackageBtn');

    document.querySelectorAll('.duration-select input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const card = this.closest('.custom-service-card');
            const btn = card.querySelector('.add-custom-btn');
            btn.disabled = false;
        });
    });

    document.querySelectorAll('.add-custom-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.custom-service-card');
            const serviceName = this.dataset.service;
            const serviceType = this.dataset.type;
            const selectedRadio = card.querySelector('input[type="radio"]:checked');

            if (!selectedRadio) {
                alert('Please select a duration first!');
                return;
            }

            const [duration, price] = selectedRadio.value.split('-');
            
            const item = {
                id: Date.now(),
                service: serviceName,
                type: serviceType,
                duration: duration + ' min',
                price: parseFloat(price)
            };

            packageItems.push(item);
            updatePackageSummary();
            
            selectedRadio.checked = false;
            this.disabled = true;

            showPackageNotification(`${serviceName} added to package!`);
        });
    });

    function updatePackageSummary() {
        if (packageItems.length === 0) {
            packageItemsContainer.innerHTML = '<p class="empty-package">No services selected yet. Choose services above to build your package.</p>';
            addPackageBtn.disabled = true;
            packageSubtotal.textContent = '$0.00';
            packageTotal.textContent = '$0.00';
            discountRow.style.display = 'none';
            return;
        }

        packageItemsContainer.innerHTML = packageItems.map(item => `
            <div class="package-item">
                <div class="package-item-info">
                    <h4>${item.service}</h4>
                    <p>${item.duration}</p>
                </div>
                <div class="package-item-price">
                    <span>$${item.price.toFixed(2)}</span>
                    <button class="remove-package-item" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.remove-package-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const index = packageItems.findIndex(item => item.id === id);
                if (index > -1) {
                    packageItems.splice(index, 1);
                    updatePackageSummary();
                }
            });
        });

        const subtotal = packageItems.reduce((sum, item) => sum + item.price, 0);
        let discount = 0;
        let discountPercentage = 0;

        if (packageItems.length >= 5) {
            discountPercentage = 15;
            discount = subtotal * 0.15;
        } else if (packageItems.length >= 3) {
            discountPercentage = 10;
            discount = subtotal * 0.10;
        }

        const total = subtotal - discount;

        packageSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        packageTotal.textContent = `$${total.toFixed(2)}`;

        if (discount > 0) {
            discountRow.style.display = 'flex';
            discountPercent.textContent = discountPercentage;
            packageDiscount.textContent = `-$${discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }

        addPackageBtn.disabled = false;
    }

    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', function() {
            if (packageItems.length === 0) return;

            const subtotal = packageItems.reduce((sum, item) => sum + item.price, 0);
            let discount = 0;
            
            if (packageItems.length >= 5) {
                discount = subtotal * 0.15;
            } else if (packageItems.length >= 3) {
                discount = subtotal * 0.10;
            }

            const total = subtotal - discount;

            packageItems.forEach(item => {
                window.cart.addItem(item.service, item.duration, item.price);
            });

            if (discount > 0) {
                window.cart.addItem('Package Discount', `${packageItems.length} services`, -discount);
            }

            showPackageNotification(`Package added to cart! Total: $${total.toFixed(2)}`);

            packageItems.length = 0;
            updatePackageSummary();

            setTimeout(() => {
                window.cart.openCart();
            }, 1000);
        });
    }

    function showPackageNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
}
