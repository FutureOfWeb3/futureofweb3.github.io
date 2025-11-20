// Clean Mobile Menu Implementation - RipPoke
console.log('Mobile menu script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up mobile menu...');
    setupMobileMenu();
});

function setupMobileMenu() {
    // Find the hamburger button and nav menu
    const hamburgerBtn = document.getElementById('hamburger-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    console.log('Hamburger button:', hamburgerBtn);
    console.log('Nav menu:', navMenu);
    
    if (!hamburgerBtn || !navMenu) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Ensure the menu starts closed on mobile
    if (window.innerWidth <= 1024) {
        navMenu.classList.remove('mobile-open');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Toggle menu function
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        console.log('Mobile menu toggle triggered');
        
        const isCurrentlyOpen = navMenu.classList.contains('mobile-open');
        console.log('Menu currently open:', isCurrentlyOpen);
        
        if (isCurrentlyOpen) {
            // Close menu
            navMenu.classList.remove('mobile-open');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menu closed');
        } else {
            // Open menu
            navMenu.classList.add('mobile-open');
            hamburgerBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        }
    }
    
    // Add event listeners
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    hamburgerBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('mobile-open')) {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                toggleMobileMenu();
                console.log('Menu closed by outside click');
            }
        }
    });
    
    // Handle dropdown menus on mobile
    const dropdownTriggers = navMenu.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const dropdown = trigger.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('open');
                    console.log('Dropdown toggled');
                }
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            // Desktop view - close mobile menu
            navMenu.classList.remove('mobile-open');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('Mobile menu setup complete!');
}

// Make functions globally accessible for debugging
window.setupMobileMenu = setupMobileMenu;
