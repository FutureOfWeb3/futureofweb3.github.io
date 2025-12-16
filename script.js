// ============================================
// STICK N SIP - Main JavaScript
// ============================================

// Hero Slideshow
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Function to show specific slide
        function showSlide(n) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Wrap around if needed
            if (n >= slides.length) {
                currentSlide = 0;
            } else if (n < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = n;
            }

            // Add active class to current slide and dot
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        // Next slide
        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Previous slide
        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // Auto play slideshow
        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        // Stop slideshow
        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // Event listeners for arrows
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent click from bubbling to slide link
                nextSlide();
                stopSlideshow();
                startSlideshow(); // Restart timer
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent click from bubbling to slide link
                prevSlide();
                stopSlideshow();
                startSlideshow(); // Restart timer
            });
        }

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent click from bubbling to slide link
                showSlide(index);
                stopSlideshow();
                startSlideshow(); // Restart timer
            });
        });

        // Pause slideshow on hover
        const heroSlideshow = document.querySelector('.hero-slideshow');
        if (heroSlideshow) {
            heroSlideshow.addEventListener('mouseenter', stopSlideshow);
            heroSlideshow.addEventListener('mouseleave', startSlideshow);
        }
        
        // Also add hover to each slide (since they cover the container)
        slides.forEach(slide => {
            slide.addEventListener('mouseenter', stopSlideshow);
            slide.addEventListener('mouseleave', startSlideshow);
        });

        // Start the slideshow
        startSlideshow();
    }

    // Mobile Menu Toggle
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Handling - Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send to your backend or email service
        console.log('Contact form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you within 24-48 hours.');
        contactForm.reset();
    });
}

// Form Handling - Custom Order Form
const customOrderForm = document.getElementById('customOrderForm');
if (customOrderForm) {
    customOrderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(customOrderForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send to your backend or email service
        console.log('Custom order submitted:', data);
        
        // Show success message
        alert('Thank you for your custom order request! We\'ll send you a design mockup within 24-48 hours.');
        customOrderForm.reset();
    });
}

// Product Filter Functionality (for products page)
const filterButtons = document.querySelectorAll('.filter-btn');
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.classList.add('btn-primary');
            this.classList.remove('btn-secondary');
            
            // Get category
            const category = this.getAttribute('data-category');
            console.log('Filter by category:', category);
            
            // This would filter products - integrate with Shopify
            // For now, just log the category
        });
    });
}

// Fade-in Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .feature-card, .category-card, .gallery-item').forEach(element => {
    observer.observe(element);
});

// ============================================
// SHOPIFY BUY BUTTON INTEGRATION
// ============================================

// Initialize Shopify Buy SDK
// NOTE: Replace 'your-shop-domain' and 'your-storefront-access-token' with actual values
// from your Shopify store settings

/*
Example Shopify Buy Button Integration:
After setting up your Shopify store, you'll add code like this:

(function() {
    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
            ShopifyBuyInit();
        } else {
            loadScript();
        }
    } else {
        loadScript();
    }

    function loadScript() {
        var script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = ShopifyBuyInit;
    }

    function ShopifyBuyInit() {
        var client = ShopifyBuy.buildClient({
            domain: 'your-shop-domain.myshopify.com',
            storefrontAccessToken: 'your-storefront-access-token',
        });

        ShopifyBuy.UI.onReady(client).then(function(ui) {
            // Create buy buttons for products
            // You'll get product IDs from your Shopify admin
            
            // Example: Add a product to a specific element
            ui.createComponent('product', {
                id: 'your-product-id',
                node: document.getElementById('product-component'),
                options: {
                    product: {
                        styles: {
                            button: {
                                'background-color': '#d4a574',
                                ':hover': {
                                    'background-color': '#8b6f47'
                                }
                            }
                        }
                    }
                }
            });
        });
    }
})();
*/

// Placeholder function to handle "Add to Cart" clicks before Shopify integration
document.querySelectorAll('.shopify-buy-button').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productTitle = productCard ? productCard.querySelector('.product-title').textContent : 'Product';
        
        // This is a placeholder - will be replaced with actual Shopify functionality
        alert(`Great choice! "${productTitle}" will be available for purchase once the Shopify store is set up. Check the SHOPIFY_SETUP_GUIDE.md for instructions.`);
    });
});

// Newsletter Subscription Forms
document.querySelectorAll('form').forEach(form => {
    // Skip forms that already have handlers
    if (form.id === 'contactForm' || form.id === 'customOrderForm') {
        return;
    }
    
    form.addEventListener('submit', function(e) {
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput && !form.id) {
            e.preventDefault();
            const email = emailInput.value;
            
            // Here you would typically integrate with your email marketing service
            // (Mailchimp, Klaviyo, etc.)
            console.log('Newsletter subscription:', email);
            
            alert('Thanks for subscribing! You\'ll receive our latest updates and exclusive offers.');
            emailInput.value = '';
        }
    });
});

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Gallery Lightbox (Simple Implementation)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            // Close on click
            lightbox.addEventListener('click', function() {
                document.body.removeChild(lightbox);
            });
        }
    });
});

// Add to cart animation (visual feedback)
function addToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = '#4caf50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Console welcome message
console.log('%cWelcome to Stick n Sip! 🎨', 'color: #d4a574; font-size: 24px; font-weight: bold;');
console.log('%cHandcrafted with love ❤️', 'color: #8b6f47; font-size: 16px;');
