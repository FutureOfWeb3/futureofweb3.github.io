// Complete Spice Inventory for Stick & Spice
const spicesInventory = [
    // Basic Essentials
    { name: "Salt", category: "basic", price: 6.99, color: "#e0e0e0" },
    { name: "Pepper", category: "basic", price: 6.99, color: "#2c2c2c" },
    { name: "Garlic Powder", category: "basic", price: 6.99, color: "#f5f0e8" },
    { name: "Onion Powder", category: "basic", price: 6.99, color: "#f4e4c1" },
    { name: "Paprika", category: "basic", price: 6.99, color: "#e74c3c" },
    { name: "Season Salt", category: "basic", price: 6.99, color: "#d4af37" },
    { name: "Lemon Pepper", category: "basic", price: 6.99, color: "#fff44f" },
    { name: "Garlic Salt", category: "basic", price: 6.99, color: "#f0e68c" },
    { name: "Onion Salt", category: "basic", price: 6.99, color: "#faebd7" },
    
    // Herbs
    { name: "Bay Leaves", category: "herbs", price: 6.99, color: "#6b8e23" },
    { name: "Oregano", category: "herbs", price: 6.99, color: "#556b2f" },
    { name: "Basil", category: "herbs", price: 6.99, color: "#7cb342" },
    { name: "Thyme", category: "herbs", price: 6.99, color: "#8fbc8f" },
    { name: "Italian Seasoning", category: "herbs", price: 6.99, color: "#6a994e" },
    { name: "Rosemary", category: "herbs", price: 6.99, color: "#4a7c59" },
    { name: "Sage", category: "herbs", price: 6.99, color: "#bcb88a" },
    { name: "Tarragon", category: "herbs", price: 6.99, color: "#9caf88" },
    { name: "Parsley", category: "herbs", price: 6.99, color: "#7ac74f" },
    { name: "Dill Weed", category: "herbs", price: 6.99, color: "#6b8e23" },
    { name: "Chives", category: "herbs", price: 6.99, color: "#90ee90" },
    
    // Premium Spices
    { name: "Himalayan Pink Salt", category: "premium", price: 8.99, color: "#f4a7b9" },
    { name: "Saffron", category: "premium", price: 12.99, color: "#f4c430" },
    { name: "Vanilla Beans", category: "premium", price: 15.99, color: "#8b4513" },
    { name: "Star Anise", category: "premium", price: 7.99, color: "#8b4513" },
    { name: "Cardamom", category: "premium", price: 8.99, color: "#c8b560" },
    { name: "Smoked Paprika", category: "premium", price: 7.99, color: "#c44536" },
    
    // Specialty & International
    { name: "Turmeric", category: "specialty", price: 6.99, color: "#ff9800" },
    { name: "Cumin", category: "specialty", price: 6.99, color: "#a0702a" },
    { name: "Coriander", category: "specialty", price: 6.99, color: "#d2b48c" },
    { name: "Curry Powder", category: "specialty", price: 6.99, color: "#daa520" },
    { name: "Ginger", category: "specialty", price: 6.99, color: "#d2691e" },
    { name: "Cayenne Pepper", category: "specialty", price: 6.99, color: "#dc143c" },
    { name: "Crushed Red Pepper", category: "specialty", price: 6.99, color: "#ff4500" },
    { name: "Chinese Five Spice", category: "specialty", price: 6.99, color: "#8b4513" },
    { name: "Garam Masala", category: "specialty", price: 6.99, color: "#b8860b" },
    { name: "Cajun Seasoning", category: "specialty", price: 6.99, color: "#c41e3a" },
    { name: "Fenugreek", category: "specialty", price: 6.99, color: "#c19a6b" },
    { name: "Taco Seasoning", category: "specialty", price: 6.99, color: "#cd853f" },
    
    // Baking & Sweet Spices
    { name: "Cinnamon", category: "basic", price: 6.99, color: "#a0522d" },
    { name: "Nutmeg", category: "basic", price: 6.99, color: "#8b7355" },
    { name: "Allspice", category: "basic", price: 6.99, color: "#6f4e37" },
    { name: "Cloves", category: "basic", price: 6.99, color: "#654321" },
    { name: "Pumpkin Spice", category: "specialty", price: 6.99, color: "#d2691e" },
    
    // Seeds & Specialty Items
    { name: "Sesame Seeds", category: "specialty", price: 6.99, color: "#f5f5dc" },
    { name: "Black Sesame", category: "specialty", price: 6.99, color: "#2f2f2f" },
    { name: "Poppy Seeds", category: "specialty", price: 6.99, color: "#36454f" },
    { name: "Fennel", category: "specialty", price: 6.99, color: "#bdb76b" },
    { name: "Mustard Seed", category: "specialty", price: 6.99, color: "#ffdb58" },
    { name: "Celery Salt", category: "specialty", price: 6.99, color: "#a8c090" },
    
    // Other Seasonings
    { name: "White Pepper", category: "basic", price: 6.99, color: "#f5f5f5" },
    { name: "Ground Mustard", category: "basic", price: 6.99, color: "#ffdb58" },
    { name: "Cream of Tartar", category: "specialty", price: 6.99, color: "#fffafa" },
    { name: "Minced Onion", category: "basic", price: 6.99, color: "#f4e4c1" },
    { name: "Popcorn Seasoning", category: "specialty", price: 6.99, color: "#ffd700" }
];

// Generate spice cards dynamically
function generateSpiceCards() {
    const container = document.getElementById('jarsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    spicesInventory.forEach((spice, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', spice.category);
        card.setAttribute('data-name', spice.name.toLowerCase());
        
        card.innerHTML = `
            <div class="product-image" style="background: linear-gradient(135deg, ${spice.color} 0%, ${adjustColor(spice.color, -30)} 100%); display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-jar" style="font-size: 4rem; color: white; opacity: 0.9;"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${spice.name}</h3>
                <p class="product-description">Custom labeled spice jar with beautiful design</p>
                <div class="product-price">$${spice.price.toFixed(2)}</div>
                <button class="shopify-buy-button" onclick="contactForOrder('${spice.name}')">Order Now</button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    updateSpiceCount(spicesInventory.length);
}

// Adjust color brightness
function adjustColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 +
        (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('spiceSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const spiceName = card.getAttribute('data-name');
            if (spiceName.includes(searchTerm)) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        updateSpiceCount(visibleCount);
    });
}

// Filter functionality
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const cards = document.querySelectorAll('.product-card');
            let visibleCount = 0;
            
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Reset search
            const searchInput = document.getElementById('spiceSearch');
            if (searchInput) searchInput.value = '';
            
            updateSpiceCount(visibleCount);
        });
    });
}

// Update spice count
function updateSpiceCount(count) {
    const counter = document.getElementById('spiceCount');
    if (counter) {
        counter.textContent = `(${count})`;
    }
}

// Contact for order
function contactForOrder(spiceName) {
    window.location.href = `custom-orders.html?spice=${encodeURIComponent(spiceName)}`;
}

// Bundle Builder State
let selectedBundle = [];
const BUNDLE_SIZE = 5;
const BUNDLE_PRICE = 29.99; // $29.99 for 5 jars (normally $34.95, save $4.96)
const REGULAR_PRICE_PER_JAR = 6.99;

// Open bundle modal
function openBundleModal() {
    const modal = document.getElementById('bundleModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close bundle modal
function closeBundleModal() {
    const modal = document.getElementById('bundleModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup modal functionality
function setupBundleModal() {
    const modal = document.getElementById('bundleModal');
    const closeBtn = document.querySelector('.bundle-modal-close');
    const confirmBtn = document.getElementById('confirmBundle');
    
    // Make all slots clickable to open modal
    for (let i = 1; i <= BUNDLE_SIZE; i++) {
        const slot = document.getElementById(`slot${i}`);
        if (slot) {
            slot.addEventListener('click', openBundleModal);
        }
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBundleModal);
    }
    
    // Click outside modal to close
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBundleModal();
            }
        });
    }
    
    // Confirm button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (selectedBundle.length === BUNDLE_SIZE) {
                closeBundleModal();
                updateBundleDisplay();
                showBundleMessage('Bundle complete! Ready to add to cart.', 'success');
            }
        });
    }
}

// Generate bundle spice selector
function generateBundleSpiceGrid() {
    const container = document.getElementById('bundleSpiceGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Sort spices alphabetically for easy browsing
    const sortedSpices = [...spicesInventory].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedSpices.forEach(spice => {
        const item = document.createElement('div');
        item.className = 'bundle-spice-item';
        item.setAttribute('data-spice-name', spice.name);
        
        // Check if already selected
        if (selectedBundle.find(s => s.name === spice.name)) {
            item.classList.add('selected');
        }
        
        item.innerHTML = `
            <div class="spice-icon">🧂</div>
            <div class="spice-name">${spice.name}</div>
            <div class="spice-price">$${spice.price.toFixed(2)}</div>
        `;
        
        item.addEventListener('click', () => toggleBundleSpice(spice, item));
        container.appendChild(item);
    });
}

// Toggle spice in bundle
function toggleBundleSpice(spice, itemElement) {
    const spiceIndex = selectedBundle.findIndex(s => s.name === spice.name);
    
    if (spiceIndex > -1) {
        // Remove spice from bundle
        selectedBundle.splice(spiceIndex, 1);
        itemElement.classList.remove('selected');
    } else {
        // Add spice to bundle (if not full)
        if (selectedBundle.length < BUNDLE_SIZE) {
            selectedBundle.push(spice);
            itemElement.classList.add('selected');
        } else {
            // Bundle is full, can't add more
            return;
        }
    }
    
    updateModalCounters();
    updateBundleSpiceStates();
}

// Update modal counters
function updateModalCounters() {
    const count = selectedBundle.length;
    
    // Update modal counter
    const modalCount = document.getElementById('modalBundleCount');
    if (modalCount) {
        modalCount.textContent = count;
    }
    
    const selectionCount = document.getElementById('modalSelectionCount');
    if (selectionCount) {
        selectionCount.textContent = count;
    }
    
    // Update confirm button state
    const confirmBtn = document.getElementById('confirmBundle');
    if (confirmBtn) {
        if (count === BUNDLE_SIZE) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = `Confirm Selection (${count}/5) ✓`;
        } else {
            confirmBtn.disabled = true;
            confirmBtn.textContent = `Select ${BUNDLE_SIZE - count} More (${count}/5)`;
        }
    }
}

// Update bundle display (slots and pricing)
function updateBundleDisplay() {
    const count = selectedBundle.length;
    
    // Update count
    document.getElementById('bundleCount').textContent = count;
    
    // Update slots
    for (let i = 1; i <= BUNDLE_SIZE; i++) {
        const slot = document.getElementById(`slot${i}`);
        const spice = selectedBundle[i - 1];
        
        if (spice) {
            slot.classList.add('filled');
            const label = slot.querySelector('.slot-label');
            label.textContent = spice.name;
            
            // Add remove button if not already there
            if (!slot.querySelector('.remove-btn')) {
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    removeSpiceFromBundle(i - 1);
                };
                slot.appendChild(removeBtn);
            }
        } else {
            slot.classList.remove('filled');
            const label = slot.querySelector('.slot-label');
            label.textContent = 'Empty';
            const removeBtn = slot.querySelector('.remove-btn');
            if (removeBtn) removeBtn.remove();
        }
    }
    
    // Update pricing
    if (count === BUNDLE_SIZE) {
        document.getElementById('bundlePrice').textContent = `$${BUNDLE_PRICE.toFixed(2)}`;
        document.getElementById('bundleSavings').style.display = 'inline-block';
        document.getElementById('addBundleToCart').disabled = false;
        showBundleMessage('Bundle complete! Ready to add to cart.', 'success');
    } else {
        const currentPrice = count * REGULAR_PRICE_PER_JAR;
        document.getElementById('bundlePrice').textContent = `$${currentPrice.toFixed(2)}`;
        document.getElementById('bundleSavings').style.display = 'none';
        document.getElementById('addBundleToCart').disabled = true;
        showBundleMessage(`Select ${BUNDLE_SIZE - count} more spice${BUNDLE_SIZE - count !== 1 ? 's' : ''} to complete your bundle`, 'info');
    }
}

// Remove spice from bundle by index
function removeSpiceFromBundle(index) {
    const removedSpice = selectedBundle[index];
    selectedBundle.splice(index, 1);
    
    // Update the visual state of the removed spice in the grid
    const spiceItems = document.querySelectorAll('.bundle-spice-item');
    spiceItems.forEach(item => {
        if (item.getAttribute('data-spice-name') === removedSpice.name) {
            item.classList.remove('selected');
        }
    });
    
    updateBundleDisplay();
    updateBundleSpiceStates();
}

// Update spice item states (disable when bundle full)
function updateBundleSpiceStates() {
    const spiceItems = document.querySelectorAll('.bundle-spice-item');
    const isFull = selectedBundle.length >= BUNDLE_SIZE;
    
    spiceItems.forEach(item => {
        const isSelected = item.classList.contains('selected');
        if (isFull && !isSelected) {
            item.classList.add('disabled');
        } else {
            item.classList.remove('disabled');
        }
    });
}

// Show bundle message
function showBundleMessage(message, type) {
    const messageEl = document.getElementById('bundleMessage');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    
    // Color based on type
    const colors = {
        info: 'var(--text-light)',
        success: '#27ae60',
        warning: '#f39c12'
    };
    
    messageEl.style.color = colors[type] || colors.info;
}

// Add bundle to cart
function addBundleToCart() {
    if (selectedBundle.length !== BUNDLE_SIZE) {
        showBundleMessage('Please select 5 spices to complete your bundle', 'warning');
        return;
    }
    
    const bundleNames = selectedBundle.map(s => s.name).join(', ');
    const encodedBundle = encodeURIComponent(JSON.stringify({
        type: '5-Jar Bundle',
        spices: selectedBundle.map(s => s.name),
        price: BUNDLE_PRICE
    }));
    
    // Redirect to custom orders with bundle data
    window.location.href = `custom-orders.html?bundle=${encodedBundle}`;
}

// Setup add to cart button
function setupBundleCart() {
    const cartBtn = document.getElementById('addBundleToCart');
    if (cartBtn) {
        cartBtn.addEventListener('click', addBundleToCart);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateSpiceCards();
    setupSearch();
    setupFilters();
    generateBundleSpiceGrid();
    setupBundleModal();
    setupBundleCart();
    updateBundleDisplay();
    updateModalCounters();
});
