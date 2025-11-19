/**
 * RipPoke Mobile Fix - Simple and direct mobile menu and slideshow fix
 * This file fixes both the hamburger menu and slideshow functionality
 */

// Wait for page to fully load
window.addEventListener('load', function() {
    console.log('Mobile fix script loaded');
    
    // Fix hamburger menu
    fixMobileMenu();
    
    // Fix slideshow
    fixSlideshow();
    
    // Double-check after a short delay
    setTimeout(() => {
        fixMobileMenu();
        fixSlideshow();
    }, 1000);
});

function fixMobileMenu() {
    console.log('Fixing mobile menu...');
    
    // Find hamburger button - try multiple selectors
    const hamburgerBtn = document.querySelector('.hamburger-menu-btn') || 
                        document.querySelector('#hamburger-menu-btn') || 
                        document.querySelector('button.hamburger-menu-btn') ||
                        document.querySelector('.mobile-menu-btn');
    
    // Find nav menu
    const navMenu = document.querySelector('.nav-menu') || 
                   document.querySelector('#nav-menu') ||
                   document.querySelector('ul.nav-menu');
    
    console.log('Hamburger button found:', hamburgerBtn);
    console.log('Nav menu found:', navMenu);
    
    if (!hamburgerBtn || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Ensure hamburger button is properly styled (let CSS handle positioning)
    if (window.innerWidth <= 1024) {
        hamburgerBtn.style.display = 'flex';
        hamburgerBtn.style.visibility = 'visible';
        hamburgerBtn.style.opacity = '1';
        hamburgerBtn.style.pointerEvents = 'all';
        hamburgerBtn.style.touchAction = 'manipulation';
        hamburgerBtn.style.cursor = 'pointer';
    }
    
    // Remove any existing event listeners by cloning the button
    const newHamburgerBtn = hamburgerBtn.cloneNode(true);
    
    // Ensure the button maintains proper styling after cloning
    if (window.innerWidth <= 1024) {
        newHamburgerBtn.style.display = 'flex';
        newHamburgerBtn.style.visibility = 'visible';
        newHamburgerBtn.style.opacity = '1';
        newHamburgerBtn.style.pointerEvents = 'all';
        newHamburgerBtn.style.touchAction = 'manipulation';
        newHamburgerBtn.style.cursor = 'pointer';
    }
    
    hamburgerBtn.parentNode.replaceChild(newHamburgerBtn, hamburgerBtn);
    
    // Add multiple event listeners for better mobile compatibility
    function handleMenuToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger menu clicked/touched!');
        
        // Toggle menu
        const isOpen = navMenu.classList.contains('mobile-open');
        
        if (isOpen) {
            navMenu.classList.remove('mobile-open');
            newHamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu closed');
        } else {
            navMenu.classList.add('mobile-open');
            newHamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        }
    }
    
    // Add multiple event types for maximum compatibility
    newHamburgerBtn.addEventListener('click', handleMenuToggle);
    newHamburgerBtn.addEventListener('touchstart', handleMenuToggle);
    newHamburgerBtn.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent double-firing
    });
    
    // Add visual feedback for touches
    newHamburgerBtn.addEventListener('touchstart', function() {
        newHamburgerBtn.style.transform = 'scale(0.95)';
    });
    newHamburgerBtn.addEventListener('touchend', function() {
        newHamburgerBtn.style.transform = 'scale(1)';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('mobile-open')) {
            if (!navMenu.contains(e.target) && !newHamburgerBtn.contains(e.target)) {
                navMenu.classList.remove('mobile-open');
                newHamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
                console.log('Menu closed by clicking outside');
            }
        }
    });
    
    // Setup dropdown functionality for mobile
    const dropdowns = navMenu.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger') || 
                       dropdown.querySelector('.nav-link');
        
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                    console.log('Dropdown toggled');
                }
            });
        }
    });
    
    console.log('Mobile menu setup complete');
}

function fixSlideshow() {
    console.log('Fixing slideshow...');
    
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevBtn = document.querySelector('.slide-control.prev');
    const nextBtn = document.querySelector('.slide-control.next');
    
    console.log('Slideshow elements found:', {
        slides: slides.length,
        navDots: navDots.length,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn
    });
    
    if (slides.length === 0) {
        console.error('No slides found');
        return;
    }
    
    let currentSlideIndex = 0;
    let slideInterval;
    
    // Function to show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
        
        currentSlideIndex = index;
        console.log('Showing slide:', index);
    }
    
    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prevIndex = currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
        showSlide(prevIndex);
    }
    
    // Start auto slideshow
    function startSlideshow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Stop slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Initialize first slide
    showSlide(0);
    
    // Setup navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopSlideshow();
            setTimeout(startSlideshow, 1000); // Restart after 1 second
        });
    });
    
    // Setup prev/next buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            stopSlideshow();
            setTimeout(startSlideshow, 1000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            stopSlideshow();
            setTimeout(startSlideshow, 1000);
        });
    }
    
    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }
    
    // Start the slideshow
    startSlideshow();
    
    // Make functions globally available
    window.changeSlide = function(direction) {
        if (direction === 1) {
            nextSlide();
        } else if (direction === -1) {
            prevSlide();
        }
        stopSlideshow();
        setTimeout(startSlideshow, 1000);
    };
    
    console.log('Slideshow setup complete');
}

// Export for debugging
window.mobileFixDebug = {
    fixMobileMenu,
    fixSlideshow
};

console.log('Mobile fix script ready');
