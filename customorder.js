document.addEventListener('DOMContentLoaded', function() {
    initCustomOrder();
});

function initCustomOrder() {
    const packageItems = [];
    const selectedAddons = [];
    let selectedMembership = null;
    const packageItemsContainer = document.getElementById('packageItems');
    const packageSubtotal = document.getElementById('packageSubtotal');
    const packageDiscount = document.getElementById('packageDiscount');
    const packageTotal = document.getElementById('packageTotal');
    const discountRow = document.getElementById('discountRow');
    const discountPercent = document.getElementById('discountPercent');
    const addPackageBtn = document.getElementById('addPackageBtn');
    const addonsSection = document.getElementById('addonsSection');
    const membershipSection = document.getElementById('membershipSection');
    const notesSection = document.getElementById('notesSection');

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
            checkProgressiveFlow();
            
            selectedRadio.checked = false;
            this.disabled = true;

            showPackageNotification(`${serviceName} added to package!`);
        });
    });

    function checkProgressiveFlow() {
        const hasMassage = packageItems.some(item => item.type === 'massage');
        const hasFacial = packageItems.some(item => item.type === 'facial');
        
        if (hasMassage && hasFacial) {
            addonsSection.style.display = 'block';
            membershipSection.style.display = 'block';
            notesSection.style.display = 'block';
        } else if (packageItems.length > 0) {
            addonsSection.style.display = 'block';
            membershipSection.style.display = 'block';
            notesSection.style.display = 'block';
        }
    }

    document.querySelectorAll('input[name="addon"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const [addonName, addonPrice] = this.value.split('-');
            if (this.checked) {
                selectedAddons.push({
                    name: addonName,
                    price: parseFloat(addonPrice)
                });
            } else {
                const index = selectedAddons.findIndex(a => a.name === addonName);
                if (index > -1) selectedAddons.splice(index, 1);
            }
            updatePackageSummary();
        });
    });

    document.querySelectorAll('input[name="membership"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'none') {
                selectedMembership = null;
            } else {
                const [tier, price] = this.value.split('-');
                selectedMembership = {
                    tier: tier.charAt(0).toUpperCase() + tier.slice(1),
                    price: parseFloat(price)
                };
            }
            updatePackageSummary();
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

        let summaryHTML = packageItems.map(item => `
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

        if (selectedAddons.length > 0) {
            summaryHTML += '<div class="package-divider">Add-Ons</div>';
            summaryHTML += selectedAddons.map(addon => `
                <div class="package-item addon-item">
                    <div class="package-item-info">
                        <h4>${addon.name}</h4>
                        <p>Enhancement</p>
                    </div>
                    <div class="package-item-price">
                        <span>$${addon.price.toFixed(2)}</span>
                    </div>
                </div>
            `).join('');
        }

        if (selectedMembership) {
            summaryHTML += '<div class="package-divider">Membership</div>';
            summaryHTML += `
                <div class="package-item membership-item">
                    <div class="package-item-info">
                        <h4>${selectedMembership.tier} Membership</h4>
                        <p>Monthly subscription</p>
                    </div>
                    <div class="package-item-price">
                        <span>$${selectedMembership.price.toFixed(2)}/mo</span>
                    </div>
                </div>
            `;
        }

        packageItemsContainer.innerHTML = summaryHTML;

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

        let subtotal = packageItems.reduce((sum, item) => sum + item.price, 0);
        subtotal += selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
        if (selectedMembership) {
            subtotal += selectedMembership.price;
        }
        
        let discount = 0;
        let discountPercentage = 0;

        if (packageItems.length >= 5) {
            discountPercentage = 15;
            discount = packageItems.reduce((sum, item) => sum + item.price, 0) * 0.15;
        } else if (packageItems.length >= 3) {
            discountPercentage = 10;
            discount = packageItems.reduce((sum, item) => sum + item.price, 0) * 0.10;
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

            let subtotal = packageItems.reduce((sum, item) => sum + item.price, 0);
            subtotal += selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
            if (selectedMembership) {
                subtotal += selectedMembership.price;
            }

            let discount = 0;
            
            if (packageItems.length >= 5) {
                discount = packageItems.reduce((sum, item) => sum + item.price, 0) * 0.15;
            } else if (packageItems.length >= 3) {
                discount = packageItems.reduce((sum, item) => sum + item.price, 0) * 0.10;
            }

            const total = subtotal - discount;

            packageItems.forEach(item => {
                window.cart.addItem(item.service, item.duration, item.price);
            });

            selectedAddons.forEach(addon => {
                window.cart.addItem(addon.name + ' (Add-On)', 'Enhancement', addon.price);
            });

            if (selectedMembership) {
                window.cart.addItem(selectedMembership.tier + ' Membership', 'Monthly subscription', selectedMembership.price);
            }

            if (discount > 0) {
                window.cart.addItem('Package Discount', `${packageItems.length} services`, -discount);
            }

            const customNotes = document.getElementById('customNotes').value;
            if (customNotes.trim()) {
                window.cart.addItem('Special Notes', customNotes.substring(0, 50) + '...', 0);
            }

            showPackageNotification(`Package added to cart! Total: $${total.toFixed(2)}`);

            packageItems.length = 0;
            selectedAddons.length = 0;
            selectedMembership = null;
            document.getElementById('customNotes').value = '';
            document.querySelectorAll('input[name="addon"]').forEach(cb => cb.checked = false);
            document.getElementById('noMembership').checked = true;
            addonsSection.style.display = 'none';
            membershipSection.style.display = 'none';
            notesSection.style.display = 'none';
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
