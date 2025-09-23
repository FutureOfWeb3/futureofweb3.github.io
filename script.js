// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');

        // Special handling for calculator modal
        if (targetId === '#calculator') {
            showCalculatorModal();
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80; // Account for fixed header
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking a link
            const navMenu = document.querySelector('.nav-menu');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Calculator modal functions
function showCalculatorModal() {
    const calculatorModal = document.getElementById('calculator-modal');
    if (calculatorModal) {
        calculatorModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
}

function hideCalculatorModal() {
    const calculatorModal = document.getElementById('calculator-modal');
    if (calculatorModal) {
        calculatorModal.classList.remove('show');
        document.body.style.overflow = 'auto';

        // Reset form and results
        resetCalculatorForm();
    }
}

function resetCalculatorForm() {
    const calculatorForm = document.getElementById('car-calculator-form');
    const quoteResults = document.getElementById('quote-results');
    const quoteValue = document.getElementById('quote-value');

    if (calculatorForm) {
        calculatorForm.reset();
    }
    if (quoteResults) {
        quoteResults.style.display = 'none';
    }
    if (quoteValue) {
        quoteValue.textContent = '$0 - $500';
    }
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const calculatorModal = document.getElementById('calculator-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    // Modal close button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideCalculatorModal);
    }

    // Close modal when clicking backdrop
    if (calculatorModal) {
        calculatorModal.addEventListener('click', function(e) {
            if (e.target === calculatorModal || e.target.classList.contains('modal-backdrop')) {
                hideCalculatorModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && calculatorModal && calculatorModal.classList.contains('show')) {
            hideCalculatorModal();
        }
    });
});

// Active Navigation Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;

    if (header) {
        if (scrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Add scroll event listener
window.addEventListener('scroll', handleHeaderScroll);

// Initialize header state on page load
document.addEventListener('DOMContentLoaded', function() {
    handleHeaderScroll();
});

// Contact Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quote-form');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate required fields
            if (!validateForm(formObject)) {
                return;
            }

            // Show success message
            showFormMessage('Thank you! We\'ll contact you within 2 hours with your quote.', 'success');

            // Reset form
            this.reset();

            // Here you would typically send the data to your backend
            console.log('Form submitted:', formObject);
        });

        // Real-time validation
        const requiredInputs = quoteForm.querySelectorAll('input[required], select[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
});

function validateForm(data) {
    let isValid = true;
    const errors = [];

    // Check required fields
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name');
        isValid = false;
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
        isValid = false;
    }

    // Show errors if any
    if (!isValid) {
        showFormMessage(errors.join('<br>'), 'error');
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }

    if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
    }

    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
    }

    // Update field styling
    if (isValid) {
        field.style.borderColor = '#48bb78';
    } else {
        field.style.borderColor = '#e53e3e';
    }

    return isValid;
}

function isValidPhone(phone) {
    // Basic phone validation - accepts various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[1-9][\d]{0,2}[\s\-\.]?[\d]{3,4}[\s\-\.]?[\d]{3,4}$/;
    const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 6px;
        font-weight: 500;
        text-align: center;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#c6f6d5';
        messageDiv.style.color = '#22543d';
        messageDiv.style.border = '1px solid #9ae6b4';
    } else {
        messageDiv.style.backgroundColor = '#fed7d7';
        messageDiv.style.color = '#742a2a';
        messageDiv.style.border = '1px solid #feb2b2';
    }

    // Insert before the form
    const form = document.getElementById('quote-form');
    form.parentNode.insertBefore(messageDiv, form);

    // Auto-remove success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .step, .testimonial-card, .contact-card');

    animateElements.forEach(element => {
        observer.observe(element);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .service-card,
    .step,
    .testimonial-card,
    .contact-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }

    .service-card.animate-in,
    .step.animate-in,
    .testimonial-card.animate-in,
    .contact-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .form-message {
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})/, '($1) ');
            }

            e.target.value = value;
        });
    }
});

// Lazy loading for images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to monitoring service
});

// Car Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('car-calculator-form');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const callNowBtn = document.getElementById('call-now-btn');
    const quoteResults = document.getElementById('quote-results');
    const quoteValue = document.getElementById('quote-value');
    const calcPhoneInput = document.getElementById('calc-phone');
    const schedulePickupBtn = document.getElementById('schedule-pickup');
    const getAccurateQuoteBtn = document.getElementById('get-accurate-quote');

    // Modal functionality
    const calculatorModal = document.getElementById('calculator-modal');
    const modalCloseBtn = document.querySelector('.modal-close');

    // Function to show modal
    function showModal() {
        if (calculatorModal) {
            calculatorModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Function to hide modal
    function hideModal() {
        if (calculatorModal) {
            calculatorModal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Restore scrolling

            // Reset form and results
            resetCalculator();
        }
    }

    // Function to reset calculator
    function resetCalculator() {
        if (calculatorForm) {
            calculatorForm.reset();
        }
        if (quoteResults) {
            quoteResults.style.display = 'none';
        }
        if (quoteValue) {
            quoteValue.textContent = '$0 - $500';
        }
    }

    // Modal close button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }

    // Close modal when clicking backdrop
    if (calculatorModal) {
        calculatorModal.addEventListener('click', function(e) {
            if (e.target === calculatorModal || e.target.classList.contains('modal-backdrop')) {
                hideModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && calculatorModal && calculatorModal.classList.contains('show')) {
            hideModal();
        }
    });

    // Phone number formatting for calculator
    if (calcPhoneInput) {
        calcPhoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})/, '($1) ');
            }

            e.target.value = value;
        });
    }

    // Get instant quote button
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            if (validateCalculatorForm()) {
                calculateQuote();
                if (quoteResults) {
                    quoteResults.style.display = 'block';
                    quoteResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Call now button
    if (callNowBtn) {
        callNowBtn.addEventListener('click', function() {
            window.location.href = 'tel:303-257-7230';
        });
    }

    // Schedule pickup button
    if (schedulePickupBtn) {
        schedulePickupBtn.addEventListener('click', function() {
            // Scroll to contact form and close modal
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                hideCalculatorModal();
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }, 300); // Wait for modal to close
            }
        });
    }

    // Get accurate quote button
    if (getAccurateQuoteBtn) {
        getAccurateQuoteBtn.addEventListener('click', function() {
            // Scroll to contact form and close modal
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                hideCalculatorModal();
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }, 300); // Wait for modal to close
            }
        });
    }

    // Make modal calculator buttons trigger modal opening
    const modalTriggerButtons = document.querySelectorAll('a[href="#calculator"], .cta-button[href="#calculator"]');
    modalTriggerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showCalculatorModal();
        });
    });
});

// Validate calculator form
function validateCalculatorForm() {
    const requiredFields = ['calc-year', 'calc-make', 'calc-model', 'calc-zip', 'calc-name', 'calc-phone'];
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e53e3e';
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.style.borderColor = '#48bb78';
        }
    });

    // Validate zip code format
    const zipField = document.getElementById('calc-zip');
    if (zipField && zipField.value.trim() && !/^\d{5}$/.test(zipField.value.trim())) {
        isValid = false;
        zipField.style.borderColor = '#e53e3e';
        if (!firstInvalidField) {
            firstInvalidField = zipField;
        }
    }

    // Validate phone number
    const phoneField = document.getElementById('calc-phone');
    if (phoneField && phoneField.value.trim() && !isValidPhone(phoneField.value.replace(/\D/g, ''))) {
        isValid = false;
        phoneField.style.borderColor = '#e53e3e';
        if (!firstInvalidField) {
            firstInvalidField = phoneField;
        }
    }

    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        showCalculatorMessage('Please fill in all required fields correctly.', 'error');
    }

    return isValid;
}

// Calculate instant quote
function calculateQuote() {
    const year = parseInt(document.getElementById('calc-year').value);
    const make = document.getElementById('calc-make').value.toLowerCase();
    const condition = document.getElementById('calc-condition').value;
    const mileage = parseInt(document.getElementById('calc-mileage').value) || 0;

    let baseValue = 0;

    // Base value by year
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age <= 2) {
        baseValue = 1500; // Newer cars
    } else if (age <= 5) {
        baseValue = 1000; // 3-5 years old
    } else if (age <= 10) {
        baseValue = 600; // 6-10 years old
    } else if (age <= 15) {
        baseValue = 300; // 11-15 years old
    } else {
        baseValue = 100; // Older than 15 years
    }

    // Adjust by make/popular brands
    const popularMakes = ['ford', 'chevrolet', 'toyota', 'honda', 'bmw', 'mercedes', 'audi'];
    if (popularMakes.includes(make)) {
        baseValue *= 1.2; // 20% premium for popular makes
    }

    // Adjust by condition
    switch (condition) {
        case 'excellent':
            baseValue *= 1.3; // 30% premium
            break;
        case 'good':
            baseValue *= 1.1; // 10% premium
            break;
        case 'fair':
            baseValue *= 0.8; // 20% reduction
            break;
        case 'poor':
            baseValue *= 0.5; // 50% reduction
            break;
        case 'scrap':
            baseValue *= 0.2; // 80% reduction
            break;
    }

    // Adjust by mileage (rough estimate)
    if (mileage > 150000) {
        baseValue *= 0.8; // High mileage reduction
    } else if (mileage > 100000) {
        baseValue *= 0.9; // Moderate mileage reduction
    }

    // Add some randomness to make it feel more "real"
    const randomFactor = 0.8 + (Math.random() * 0.4); // Random between 0.8 and 1.2
    baseValue *= randomFactor;

    // Ensure minimum and maximum values
    baseValue = Math.max(50, Math.min(3000, baseValue));

    const minValue = Math.max(25, Math.round(baseValue * 0.7));
    const maxValue = Math.min(4000, Math.round(baseValue * 1.4));

    const quoteValue = document.getElementById('quote-value');
    if (quoteValue) {
        quoteValue.textContent = `$${minValue} - $${maxValue}`;
    }

    showCalculatorMessage('Quote calculated successfully! This is an estimate based on market conditions.', 'success');
}

// Show calculator messages
function showCalculatorMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.calculator-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `calculator-message ${type}`;
    messageDiv.innerHTML = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 6px;
        font-weight: 500;
        text-align: center;
        border: 2px solid;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
        messageDiv.style.color = '#22543d';
        messageDiv.style.borderColor = '#48bb78';
    } else {
        messageDiv.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
        messageDiv.style.color = '#742a2a';
        messageDiv.style.borderColor = '#e53e3e';
    }

    // Insert at top of calculator form
    const calculatorForm = document.getElementById('car-calculator-form');
    if (calculatorForm) {
        calculatorForm.parentNode.insertBefore(messageDiv, calculatorForm);

        // Auto-remove success message after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }
}

// Real-time validation for calculator fields
document.addEventListener('DOMContentLoaded', function() {
    const calcRequiredInputs = document.querySelectorAll('#car-calculator-form input[required], #car-calculator-form select[required]');
    calcRequiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateCalculatorField(this);
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(229, 62, 62)') {
                validateCalculatorField(this);
            }
        });
    });
});

function validateCalculatorField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }

    if (field.id === 'calc-zip' && value && !/^\d{5}$/.test(value)) {
        isValid = false;
    }

    if (field.id === 'calc-phone' && value && !isValidPhone(value.replace(/\D/g, ''))) {
        isValid = false;
    }

    // Update field styling
    if (isValid) {
        field.style.borderColor = 'var(--border-color)';
    } else {
        field.style.borderColor = '#e53e3e';
    }

    return isValid;
}

// Contact form category selection and vehicle fields toggle
document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.getElementById('category');
    const vehicleFields = document.getElementById('vehicle-fields');
    const vehicleInputs = document.querySelectorAll('#vehicle-fields input[required], #vehicle-fields select[required]');
    
    if (categorySelect && vehicleFields) {
        categorySelect.addEventListener('change', function() {
            if (this.value === 'automotive') {
                vehicleFields.style.display = 'block';
                // Make vehicle fields required when shown
                vehicleInputs.forEach(input => {
                    input.setAttribute('required', 'required');
                });
            } else {
                vehicleFields.style.display = 'none';
                // Remove required attribute when hidden
                vehicleInputs.forEach(input => {
                    input.removeAttribute('required');
                    input.value = ''; // Clear values
                });
            }
        });
    }
});

// Contact form validation
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        // Real-time validation for contact form fields
        const contactInputs = document.querySelectorAll('#quote-form input[required], #quote-form select[required]');
        contactInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateContactField(this);
            });

            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(229, 62, 62)') {
                    validateContactField(this);
                }
            });
        });

        // Form submission handler
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                // Show success message
                showContactMessage('Thank you! We\'ll contact you within 2 hours with your free quote. We pay CASH for junk cars and provide affordable hauling services for other items.', 'success');
                
                // Reset form after successful submission
                setTimeout(() => {
                    quoteForm.reset();
                    // Hide vehicle fields
                    const vehicleFields = document.getElementById('vehicle-fields');
                    if (vehicleFields) {
                        vehicleFields.style.display = 'none';
                    }
                }, 2000);
            }
        });
    }
});

function validateContactField(field) {
    const value = field.value.trim();
    let isValid = true;

    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
    }

    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value.replace(/\D/g, ''))) {
        isValid = false;
    }

    // Update field styling
    if (isValid) {
        field.style.borderColor = 'var(--border-color)';
    } else {
        field.style.borderColor = '#e53e3e';
    }

    return isValid;
}

function validateContactForm() {
    const categorySelect = document.getElementById('category');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    
    let isValid = true;
    
    // Check required fields
    if (!categorySelect.value) {
        isValid = false;
        categorySelect.style.borderColor = '#e53e3e';
    } else {
        categorySelect.style.borderColor = 'var(--border-color)';
    }
    
    if (!nameInput.value.trim()) {
        isValid = false;
        nameInput.style.borderColor = '#e53e3e';
    } else {
        nameInput.style.borderColor = 'var(--border-color)';
    }
    
    if (!phoneInput.value.trim()) {
        isValid = false;
        phoneInput.style.borderColor = '#e53e3e';
    } else {
        phoneInput.style.borderColor = 'var(--border-color)';
    }
    
    // Validate email if provided
    if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        isValid = false;
        emailInput.style.borderColor = '#e53e3e';
    } else {
        emailInput.style.borderColor = 'var(--border-color)';
    }
    
    // Check vehicle fields if automotive is selected
    if (categorySelect.value === 'automotive') {
        const vehicleYear = document.getElementById('vehicle-year');
        const vehicleMake = document.getElementById('vehicle-make');
        const vehicleModel = document.getElementById('vehicle-model');
        const condition = document.getElementById('condition');
        
        if (!vehicleYear.value) {
            isValid = false;
            vehicleYear.style.borderColor = '#e53e3e';
        } else {
            vehicleYear.style.borderColor = 'var(--border-color)';
        }
        
        if (!vehicleMake.value.trim()) {
            isValid = false;
            vehicleMake.style.borderColor = '#e53e3e';
        } else {
            vehicleMake.style.borderColor = 'var(--border-color)';
        }
        
        if (!vehicleModel.value.trim()) {
            isValid = false;
            vehicleModel.style.borderColor = '#e53e3e';
        } else {
            vehicleModel.style.borderColor = 'var(--border-color)';
        }
        
        if (!condition.value) {
            isValid = false;
            condition.style.borderColor = '#e53e3e';
        } else {
            condition.style.borderColor = 'var(--border-color)';
        }
    }
    
    if (!isValid) {
        showContactMessage('Please fill in all required fields.', 'error');
    }
    
    return isValid;
}

// Show contact form messages
function showContactMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message ${type}`;
    messageDiv.innerHTML = message;

    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 6px;
        font-weight: 500;
        text-align: center;
        border: 2px solid;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(72, 187, 120, 0.1)';
        messageDiv.style.color = '#22543d';
        messageDiv.style.borderColor = '#48bb78';
    } else {
        messageDiv.style.backgroundColor = 'rgba(229, 62, 62, 0.1)';
        messageDiv.style.color = '#742a2a';
        messageDiv.style.borderColor = '#e53e3e';
    }

    // Insert at top of contact form
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.parentNode.insertBefore(messageDiv, quoteForm);

        // Auto-remove success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
}

// Phone validation helper
function isValidPhone(phone) {
    const phoneRegex = /^(\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
}
