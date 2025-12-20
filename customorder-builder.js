// Package Builder State
const packageConfig = {
    massage: null,
    massageDuration: null,
    massagePrice: 0,
    facial: null,
    facialPrice: 0,
    addons: [],
    addonPrices: 0,
    membership: null,
    membershipPrice: 0,
    notes: ''
};

let currentStep = 0;

// Service Data
const massages = [
    { name: 'Introductory Massage', desc: 'Perfect for first-time clients', durations: [{time: '60 min', price: 80}] },
    { name: 'Swedish Massage', desc: 'Classic relaxation massage', durations: [{time: '60 min', price: 120}, {time: '90 min', price: 150}, {time: '120 min', price: 190}] },
    { name: 'Deep Tissue Massage', desc: 'Intense muscle therapy', durations: [{time: '60 min', price: 145}, {time: '90 min', price: 165}] },
    { name: 'Hot Stone Massage', desc: 'Heated stone therapy', durations: [{time: '60 min', price: 150}, {time: '90 min', price: 175}] },
    { name: 'Mobile Custom Massage', desc: 'We bring the spa to you', durations: [{time: '60 min', price: 130}, {time: '90 min', price: 165}, {time: '120 min', price: 225}] },
    { name: 'Couples Swedish Massage', desc: 'Share a relaxing experience', durations: [{time: '60 min', price: 175}, {time: '90 min', price: 220}, {time: '120 min', price: 295}] },
    { name: 'Couples Deep Tissue', desc: 'Therapeutic deep tissue for two', durations: [{time: '60 min', price: 205}, {time: '90 min', price: 250}] }
];

const facials = [
    { name: 'Introduction Cleanse', desc: 'Perfect for first-time clients', price: 80 },
    { name: 'Back Facial', desc: 'Back treatment and cleansing', price: 100 },
    { name: 'Acne Cleanse', desc: 'Specialized acne treatment', price: 110 },
    { name: 'Hyperpigmentation Facial', desc: 'Dark spot and pigmentation treatment', price: 120 },
    { name: 'Microdermabrasion', desc: 'Skin exfoliation treatment', price: 110 },
    { name: 'Nano Infusion', desc: 'Advanced skin infusion', price: 130 },
    { name: 'Hydrafacial Signature', desc: 'Signature hydrafacial treatment', price: 165 },
    { name: 'Hydrafacial Deluxe', desc: 'Enhanced hydrafacial experience', price: 190 },
    { name: 'Hydrafacial Platinum', desc: 'Ultimate hydrafacial luxury', price: 220 }
];

const addons = [
    { name: 'Hot Stones', desc: 'Heated stone therapy enhancement', price: 30 },
    { name: 'Cupping', desc: 'Therapeutic cupping treatment', price: 20 },
    { name: 'Steam/Mist Cool', desc: 'Steam or cooling mist treatment', price: 25 },
    { name: 'Theragun', desc: 'Percussion therapy device', price: 30 },
    { name: 'Muscle Relaxant', desc: 'Topical muscle relief', price: 15 },
    { name: 'Aromatherapy', desc: 'Essential oil enhancement', price: 10 },
    { name: 'Body Scrub', desc: 'Full body exfoliation', price: 45 },
    { name: 'Hands or Foot Scrub', desc: 'Hand or foot exfoliation', price: 10 },
    { name: 'VR Movie or Show', desc: 'Virtual reality entertainment', price: 50 },
    { name: 'Mask', desc: 'Facial mask treatment', price: 25 },
    { name: 'Serums', desc: 'Facial serums application', price: 10 },
    { name: 'Eye mask/patch', desc: 'Eye treatment mask', price: 10 },
    { name: 'Cold globes', desc: 'Cooling facial globes', price: 5 },
    { name: 'Gua Sha', desc: 'Facial massage tool treatment', price: 15 },
    { name: 'Sonic Face&Scalp massage', desc: '10/15-minute sonic massage', price: 20 },
    { name: 'High frequency', desc: 'High frequency facial treatment', price: 20 },
    { name: 'Light therapy 15 min', desc: '15 minutes of light therapy', price: 20 },
    { name: 'Light therapy 30 min', desc: '30 minutes of light therapy', price: 35 },
    { name: 'Derma planing', desc: 'Exfoliation treatment', price: 65 },
    { name: 'Microdermabrasion', desc: 'Skin exfoliation treatment', price: 100 },
    { name: 'Retinol extraction peel', desc: 'Retinol peel treatment', price: 30 },
    { name: 'Chemical peel', desc: 'Medium light chemical peel', price: 75 }
];

const memberships = [
    { 
        name: 'No Membership', 
        desc: 'Continue without membership benefits', 
        price: 0, 
        badge: null,
        details: null
    },
    { 
        name: 'Standard Membership', 
        desc: '12 months - $250 upfront', 
        price: 250, 
        badge: 'Popular',
        details: [
            { duration: '60min', first: 85, second: 50 },
            { duration: '90min', first: 115, second: 75 },
            { duration: '120min', first: 150, second: 100 }
        ]
    },
    { 
        name: 'VIP Membership', 
        desc: '12 months - $375 upfront', 
        price: 375, 
        badge: 'Best Value',
        details: [
            { duration: '60min', first: 75, second: 37.5 },
            { duration: '90min', first: 105, second: 52.5 },
            { duration: '120min', first: 140, second: 90 }
        ]
    }
];

// Initialize Builder
function initBuilder() {
    loadMassageChoices();
    loadFacialChoices();
    loadAddonChoices();
    loadMembershipChoices();
}

function startBuilder() {
    currentStep = 1;
    showStep(currentStep);
}

function showStep(step) {
    document.querySelectorAll('.builder-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
}

function nextStep() {
    if (currentStep < 6) {
        currentStep++;
        showStep(currentStep);
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

function skipStep() {
    nextStep();
}

// Load Choices
function loadMassageChoices() {
    const container = document.getElementById('massageChoices');
    container.innerHTML = massages.map(massage => {
        const hasDurations = massage.durations.length > 1;
        return `
            <div class="choice-card" data-service="massage" data-name="${massage.name}" ${!hasDurations ? `onclick="selectMassage('${massage.name}', '${massage.durations[0].time}', ${massage.durations[0].price}, event)"` : ''}>
                <div class="choice-name">${massage.name}</div>
                <div class="choice-desc">${massage.desc}</div>
                ${hasDurations ? `
                    <div class="choice-durations">
                        ${massage.durations.map(dur => `
                            <div class="duration-option" onclick="selectMassage('${massage.name}', '${dur.time}', ${dur.price}, event)">
                                <span style="color: rgba(255,255,255,0.7);">${dur.time}</span> - 
                                <span style="color: var(--secondary-color); font-weight: 700;">$${dur.price}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="choice-price">
                        $${massage.durations[0].price}
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function loadFacialChoices() {
    const container = document.getElementById('facialChoices');
    container.innerHTML = facials.map(facial => `
        <div class="choice-card" onclick="selectFacial('${facial.name}', ${facial.price})">
            <div class="choice-name">${facial.name}</div>
            <div class="choice-desc">${facial.desc}</div>
            <div class="choice-price">$${facial.price}</div>
        </div>
    `).join('');
}

function loadAddonChoices() {
    const container = document.getElementById('addonChoices');
    container.innerHTML = addons.map(addon => `
        <div class="choice-card addon-card-compact" onclick="toggleAddon('${addon.name}', ${addon.price}, event)">
            <div class="addon-checkbox"></div>
            <div class="choice-name">${addon.name}</div>
            <div class="choice-price">+$${addon.price}</div>
        </div>
    `).join('');
}

function loadMembershipChoices() {
    const container = document.getElementById('membershipChoices');
    container.innerHTML = memberships.map(membership => `
        <div class="choice-card membership-card-detailed" onclick="selectMembership('${membership.name}', ${membership.price})">
            ${membership.badge ? `<div class="membership-badge">${membership.badge}</div>` : ''}
            <div class="choice-name">${membership.name}</div>
            <div class="choice-desc">${membership.desc}</div>
            ${membership.details ? `
                <div class="membership-details">
                    ${membership.details.map(detail => `
                        <div class="membership-pricing-row">
                            <span class="duration-label">${detail.duration}:</span>
                            <span class="pricing-text">1st: $${detail.first} | 2x: $${detail.second}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${!membership.details ? `<div class="choice-price">${membership.price > 0 ? '$' + membership.price : 'Free'}</div>` : ''}
        </div>
    `).join('');
}

// Selection Handlers
function selectMassage(name, duration, price, event) {
    // Animate selection
    const card = event.currentTarget.closest('.choice-card');
    document.querySelectorAll('#massageChoices .choice-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    setTimeout(() => {
        packageConfig.massage = name;
        packageConfig.massageDuration = duration;
        packageConfig.massagePrice = price;
        
        updateSummary();
        
        setTimeout(() => {
            nextStep();
        }, 300);
    }, 500);
}

function selectFacial(name, price) {
    // Animate selection
    event.currentTarget.classList.add('selected');
    
    setTimeout(() => {
        packageConfig.facial = name;
        packageConfig.facialPrice = price;
        
        updateSummary();
        
        setTimeout(() => {
            nextStep();
        }, 300);
    }, 500);
}

function toggleAddon(name, price, event) {
    const card = event.currentTarget;
    card.classList.toggle('selected');
    
    const index = packageConfig.addons.findIndex(a => a.name === name);
    if (index > -1) {
        packageConfig.addons.splice(index, 1);
        packageConfig.addonPrices -= price;
    } else {
        packageConfig.addons.push({ name, price });
        packageConfig.addonPrices += price;
    }
    
    updateSummary();
}

function selectMembership(name, price) {
    // Animate selection
    document.querySelectorAll('#membershipChoices .choice-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    setTimeout(() => {
        packageConfig.membership = name;
        packageConfig.membershipPrice = price;
        
        updateSummary();
        
        setTimeout(() => {
            nextStep();
        }, 300);
    }, 500);
}

// Update Summary Panel
function updateSummary() {
    const container = document.getElementById('summaryItems');
    let html = '';
    
    // Massage
    if (packageConfig.massage) {
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <span class="summary-item-name">${packageConfig.massage}</span>
                    <span class="summary-item-price">$${packageConfig.massagePrice}</span>
                </div>
                <div class="summary-item-details">${packageConfig.massageDuration}</div>
            </div>
        `;
    }
    
    // Facial
    if (packageConfig.facial) {
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <span class="summary-item-name">${packageConfig.facial}</span>
                    <span class="summary-item-price">$${packageConfig.facialPrice}</span>
                </div>
                <div class="summary-item-details">60 min session</div>
            </div>
        `;
    }
    
    // Add-ons
    if (packageConfig.addons.length > 0) {
        html += '<div class="summary-divider">Add-On Services</div>';
        packageConfig.addons.forEach(addon => {
            html += `
                <div class="summary-item">
                    <div class="summary-item-header">
                        <span class="summary-item-name">${addon.name}</span>
                        <span class="summary-item-price">$${addon.price}</span>
                    </div>
                </div>
            `;
        });
    }
    
    // Membership
    if (packageConfig.membership && packageConfig.membershipPrice > 0) {
        html += '<div class="summary-divider">Membership</div>';
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <span class="summary-item-name">${packageConfig.membership}</span>
                    <span class="summary-item-price">$${packageConfig.membershipPrice}/mo</span>
                </div>
            </div>
        `;
    }
    
    if (html === '') {
        html = `
            <div class="summary-empty">
                <i class="fas fa-spa" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>Start building your package by selecting services</p>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Update total
    const total = packageConfig.massagePrice + packageConfig.facialPrice + packageConfig.addonPrices + packageConfig.membershipPrice;
    document.getElementById('totalAmount').textContent = total;
}

// Finish Builder
function finishBuilder() {
    packageConfig.notes = document.getElementById('customNotes').value;
    currentStep = 6;
    showStep(currentStep);
    displayFinalSummary();
}

function displayFinalSummary() {
    const container = document.getElementById('finalSummary');
    let html = '';
    
    if (packageConfig.massage) {
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <span class="summary-item-name">${packageConfig.massage}</span>
                    <span class="summary-item-price">$${packageConfig.massagePrice}</span>
                </div>
                <div class="summary-item-details">${packageConfig.massageDuration}</div>
            </div>
        `;
    }
    
    if (packageConfig.facial) {
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <span class="summary-item-name">${packageConfig.facial}</span>
                    <span class="summary-item-price">$${packageConfig.facialPrice}</span>
                </div>
                <div class="summary-item-details">60 min session</div>
            </div>
        `;
    }
    
    if (packageConfig.addons.length > 0) {
        html += '<div class="summary-divider">Add-Ons</div>';
        packageConfig.addons.forEach(addon => {
            html += `
                <div class="summary-item">
                    <div class="summary-item-header">
                        <span class="summary-item-name">${addon.name}</span>
                        <span class="summary-item-price">$${addon.price}</span>
                    </div>
                </div>
            `;
        });
    }
    
    if (packageConfig.membership && packageConfig.membershipPrice > 0) {
        html += '<div class="summary-divider">Membership</div>';
        html += `
            <div class="summary-item">
                <div class="summary-item-header">
                    <span class="summary-item-name">${packageConfig.membership}</span>
                    <span class="summary-item-price">$${packageConfig.membershipPrice}/mo</span>
                </div>
            </div>
        `;
    }
    
    if (packageConfig.notes) {
        html += '<div class="summary-divider">Special Notes</div>';
        html += `
            <div class="summary-item">
                <div class="summary-item-details" style="white-space: pre-wrap;">${packageConfig.notes}</div>
            </div>
        `;
    }
    
    const total = packageConfig.massagePrice + packageConfig.facialPrice + packageConfig.addonPrices + packageConfig.membershipPrice;
    html += `
        <div class="summary-item" style="border-top: 2px solid rgba(0, 188, 212, 0.3); padding-top: 1rem; margin-top: 1rem;">
            <div class="summary-item-header">
                <span class="summary-item-name" style="font-size: 1.3rem;">Package Total:</span>
                <span class="summary-item-price" style="font-size: 1.5rem;">$${total}</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Add to Cart
function addToCart() {
    if (packageConfig.massage) {
        window.cart.addItem(packageConfig.massage, packageConfig.massageDuration, packageConfig.massagePrice);
    }
    
    if (packageConfig.facial) {
        window.cart.addItem(packageConfig.facial, '60 min', packageConfig.facialPrice);
    }
    
    packageConfig.addons.forEach(addon => {
        window.cart.addItem(addon.name + ' (Add-On)', 'Enhancement', addon.price);
    });
    
    if (packageConfig.membership && packageConfig.membershipPrice > 0) {
        window.cart.addItem(packageConfig.membership, 'Monthly subscription', packageConfig.membershipPrice);
    }
    
    if (packageConfig.notes) {
        window.cart.addItem('Special Notes', packageConfig.notes.substring(0, 40) + '...', 0);
    }
    
    const total = packageConfig.massagePrice + packageConfig.facialPrice + packageConfig.addonPrices + packageConfig.membershipPrice;
    
    showNotification(`Package added to cart! Total: $${total}`);
    
    setTimeout(() => {
        window.cart.openCart();
        restartBuilder();
    }, 1500);
}

// Restart Builder
function restartBuilder() {
    packageConfig.massage = null;
    packageConfig.massageDuration = null;
    packageConfig.massagePrice = 0;
    packageConfig.facial = null;
    packageConfig.facialPrice = 0;
    packageConfig.addons = [];
    packageConfig.addonPrices = 0;
    packageConfig.membership = null;
    packageConfig.membershipPrice = 0;
    packageConfig.notes = '';
    
    document.getElementById('customNotes').value = '';
    
    document.querySelectorAll('.choice-card').forEach(card => card.classList.remove('selected'));
    
    currentStep = 0;
    showStep(currentStep);
    updateSummary();
}

// Notification
function showNotification(message) {
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

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initBuilder();
});
