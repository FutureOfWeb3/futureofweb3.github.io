// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Scroll-to-hide navigation
let lastScrollTop = 0;
const nav = document.querySelector('nav');
let scrollTimeout;

window.addEventListener('scroll', function() {
    // Clear the timeout if it exists
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Debounce scroll events for better performance
    scrollTimeout = setTimeout(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show nav at top of page
        if (scrollTop === 0) {
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        }
        // Hide nav when scrolling down, show when scrolling up
        else if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past threshold
            nav.classList.add('nav-hidden');
            nav.classList.remove('nav-visible');
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, 10); // 10ms debounce delay
});

// Return to Top Button functionality
const returnToTopBtn = document.getElementById('return-to-top');

// Show/hide return to top button based on scroll position
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) { // Show button after scrolling 300px
        returnToTopBtn.classList.add('show');
    } else {
        returnToTopBtn.classList.remove('show');
    }
});

// Smooth scroll to top when button is clicked
returnToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryImages = document.querySelectorAll('.gallery img');

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
    });
});

document.getElementById('lightbox-close').addEventListener('click', () => {
    lightbox.style.display = 'none';
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
        lightbox.style.display = 'none';
    }
});

// Populate gallery with 80 images
if (document.querySelector('.gallery')) {
    const gallery = document.querySelector('.gallery');
    for (let i = 1; i <= 40; i++) {
        const img = document.createElement('img');
        img.src = `https://via.placeholder.com/300x200/333/4CAF50?text=Image+${i}`;
        img.alt = `Scrap Yard Photo ${i}`;
        gallery.appendChild(img);
    }
}

// Dynamic Scrap Metal Pricing System
class ScrapMetalPricing {
    constructor() {
        this.basePrices = {
            'copper-price': 3.85,
            'copper2-price': 3.60,
            'insulated-copper-price': 2.80,
            'aluminum-price': 0.85,
            'aluminum-cans-price': 0.65,
            'red-brass-price': 3.10,
            'yellow-brass-price': 2.65,
            'heavy-steel-price': 0.18,
            'light-steel-price': 0.14,
            'cast-iron-price': 0.20,
            'appliances-price': 0.12,
            'battery-price': 12.00,
            'motors-price': 0.35
        };
        
        this.lastUpdate = new Date();
        this.init();
    }
    
    init() {
        if (document.getElementById('current-prices')) {
            this.updateLastUpdatedTime();
            this.simulateMarketFluctuations();
            
            // Update prices every 5 minutes
            setInterval(() => {
                this.simulateMarketFluctuations();
                this.updateLastUpdatedTime();
            }, 300000);
            
            // Update time display every minute
            setInterval(() => {
                this.updateLastUpdatedTime();
            }, 60000);
        }
    }
    
    simulateMarketFluctuations() {
        Object.keys(this.basePrices).forEach(priceId => {
            const element = document.getElementById(priceId);
            if (element && priceId !== 'catalytic-price') {
                const basePrice = this.basePrices[priceId];
                // Simulate market fluctuation between -8% to +12%
                const fluctuation = (Math.random() * 0.20) - 0.08;
                const newPrice = basePrice * (1 + fluctuation);
                
                let formattedPrice;
                if (priceId === 'battery-price') {
                    formattedPrice = `$${newPrice.toFixed(2)}/each`;
                } else {
                    formattedPrice = `$${newPrice.toFixed(2)}/lb`;
                }
                
                // Add price change animation
                element.style.transition = 'all 0.5s ease';
                element.style.transform = 'scale(1.1)';
                element.textContent = formattedPrice;
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 500);
            }
        });
        
        this.lastUpdate = new Date();
    }
    
    updateLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
            const dateString = now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            lastUpdatedElement.textContent = `${dateString} at ${timeString}`;
        }
    }
    
    // Simulate real market-based price updates
    updateFromMarketData() {
        // This would typically fetch from a real API
        // For demonstration, we'll simulate LME-based pricing
        const marketFactors = {
            copper: 1 + (Math.random() * 0.15 - 0.075), // ±7.5%
            aluminum: 1 + (Math.random() * 0.12 - 0.06), // ±6%
            steel: 1 + (Math.random() * 0.10 - 0.05), // ±5%
            brass: 1 + (Math.random() * 0.08 - 0.04) // ±4%
        };
        
        // Apply market factors to base prices
        const copperPrices = ['copper-price', 'copper2-price', 'insulated-copper-price'];
        const aluminumPrices = ['aluminum-price', 'aluminum-cans-price'];
        const steelPrices = ['heavy-steel-price', 'light-steel-price', 'cast-iron-price', 'appliances-price'];
        const brassPrices = ['red-brass-price', 'yellow-brass-price'];
        
        copperPrices.forEach(id => this.updatePrice(id, marketFactors.copper));
        aluminumPrices.forEach(id => this.updatePrice(id, marketFactors.aluminum));
        steelPrices.forEach(id => this.updatePrice(id, marketFactors.steel));
        brassPrices.forEach(id => this.updatePrice(id, marketFactors.brass));
        
        // Motors and batteries have their own fluctuation
        this.updatePrice('motors-price', 1 + (Math.random() * 0.06 - 0.03));
        this.updatePrice('battery-price', 1 + (Math.random() * 0.08 - 0.04));
    }
    
    updatePrice(priceId, factor) {
        const element = document.getElementById(priceId);
        if (element && this.basePrices[priceId]) {
            const newPrice = this.basePrices[priceId] * factor;
            const suffix = priceId === 'battery-price' ? '/each' : '/lb';
            element.textContent = `$${newPrice.toFixed(2)}${suffix}`;
        }
    }
}

// Initialize pricing system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ScrapMetalPricing();
});

// Add price alert functionality
if (document.getElementById('current-prices')) {
    // Add price trend indicators
    setInterval(() => {
        const priceElements = document.querySelectorAll('.price');
        priceElements.forEach(element => {
            if (Math.random() > 0.7) {
                const trend = Math.random() > 0.5 ? '↗️' : '↘️';
                const originalText = element.textContent;
                element.textContent = `${originalText} ${trend}`;
                
                setTimeout(() => {
                    element.textContent = originalText;
                }, 3000);
            }
        });
    }, 30000); // Show trends every 30 seconds
}

// Add market status indicator
function addMarketStatusIndicator() {
    if (document.getElementById('current-prices')) {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'market-status';
        statusIndicator.innerHTML = `
            <div class="status-indicator">
                <span class="status-light"></span>
                <span class="status-text">Market Open - Prices Updating</span>
            </div>
        `;
        
        const priceSection = document.getElementById('current-prices');
        const updateInfo = priceSection.querySelector('.price-update-info');
        if (updateInfo) {
            updateInfo.appendChild(statusIndicator);
        }
        
        // Add CSS for market status
        const style = document.createElement('style');
        style.textContent = `
            .market-status {
                margin-top: 15px;
                display: flex;
                justify-content: center;
            }
            .status-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(0,255,0,0.1);
                padding: 8px 15px;
                border-radius: 20px;
                border: 1px solid #00ff00;
            }
            .status-light {
                width: 10px;
                height: 10px;
                background: #00ff00;
                border-radius: 50%;
                animation: pulse-light 2s infinite;
            }
            .status-text {
                color: #00ff00;
                font-size: 12px;
                font-weight: bold;
            }
            @keyframes pulse-light {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize market status on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addMarketStatusIndicator, 1000);
});
