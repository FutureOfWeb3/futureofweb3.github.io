// Direct Mobile Menu Fix - Simple and Guaranteed to Work
console.log('Direct mobile menu script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up mobile menu...');
    
    setupMobileMenuDirect();
    
    // Also try again after a delay in case of loading issues
    setTimeout(setupMobileMenuDirect, 500);
    setTimeout(setupMobileMenuDirect, 1000);
});

function setupMobileMenuDirect() {
    console.log('Setting up mobile menu direct...');
    
    // Find elements - try multiple ways
    const hamburgerBtn = document.getElementById('hamburger-menu-btn') || 
                        document.querySelector('.hamburger-menu-btn') ||
                        document.querySelector('button[aria-label*="Toggle"]');
    
    const navMenu = document.getElementById('nav-menu') ||
                   document.querySelector('.nav-menu') ||
                   document.querySelector('ul.nav-menu');
    
    console.log('Found hamburger:', hamburgerBtn);
    console.log('Found nav menu:', navMenu);
    console.log('Nav menu classes:', navMenu ? navMenu.className : 'not found');
    
    if (!hamburgerBtn || !navMenu) {
        console.error('Could not find hamburger button or nav menu');
        return;
    }
    
    // Remove any existing listeners
    const newBtn = hamburgerBtn.cloneNode(true);
    if (hamburgerBtn.parentNode) {
        hamburgerBtn.parentNode.replaceChild(newBtn, hamburgerBtn);
    }
    
    // Add click handler
    newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger clicked!');
        console.log('Nav menu current classes before toggle:', navMenu.className);
        
        const isOpen = navMenu.classList.contains('mobile-open');
        console.log('Menu is currently open:', isOpen);
        
        if (isOpen) {
            navMenu.classList.remove('mobile-open');
            newBtn.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu closed');
        } else {
            navMenu.classList.add('mobile-open');
            newBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        }
        
        console.log('Nav menu classes after toggle:', navMenu.className);
        
        // Force style update
        navMenu.style.display = isOpen ? 'none' : 'block';
        console.log('Forced nav menu display to:', navMenu.style.display);
    });
    
    // Add touch support
    newBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        // The click event will handle the toggle
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('mobile-open')) {
            if (!navMenu.contains(e.target) && !newBtn.contains(e.target)) {
                navMenu.classList.remove('mobile-open');
                newBtn.classList.remove('active');
                document.body.style.overflow = '';
                navMenu.style.display = 'none';
                console.log('Menu closed by clicking outside');
            }
        }
    });
    
    // Make sure menu is hidden initially on mobile
    if (window.innerWidth <= 1024) {
        navMenu.style.display = 'none';
        navMenu.classList.remove('mobile-open');
        newBtn.classList.remove('active');
    }
    
    console.log('Mobile menu setup complete');
}

// Make functions globally accessible for debugging
window.setupMobileMenuDirect = setupMobileMenuDirect;
