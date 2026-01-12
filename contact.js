// Initialize EmailJS
(function() {
    emailjs.init("YOUR_EMAILJS_USER_ID"); // User needs to replace this
})();

// Contact form submission handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Hide any previous messages
    formSuccess.style.display = 'none';
    formError.style.display = 'none';
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || 'Not provided';
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Prepare email template parameters
    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        subject: subject,
        message: message,
        to_email: 'mobilefranchise952@gmail.com'
    };
    
    // Send email via EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            formSuccess.style.display = 'flex';
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, function(error) {
            console.log('FAILED...', error);
            
            // Show error message
            formError.style.display = 'flex';
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            
            // Scroll to error message
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
});
