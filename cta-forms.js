// Handle form submissions for CTA page

document.addEventListener('DOMContentLoaded', function() {
    // Earnings Estimate Form
    const earningsForm = document.getElementById('earnings-form');
    if (earningsForm) {
        earningsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Earnings Estimate');
        });
    }

    // Qualification Form
    const qualifyForm = document.getElementById('qualify-form');
    if (qualifyForm) {
        qualifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Property Qualification');
        });
    }

    // Call Scheduling Form
    const callForm = document.getElementById('call-form');
    if (callForm) {
        callForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Call Scheduling');
        });
    }
});

function handleFormSubmit(form, formType) {
    // Get form data
    const formData = new FormData(form);
    
    // In a real implementation, you would send this to your backend
    // For now, we'll just show a success message
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        background-color: #B8956A;
        color: white;
        padding: 1.5rem;
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        border-radius: 4px;
        animation: slideIn 0.3s ease;
    `;
    successMessage.textContent = `✓ Thank you! We'll get back to you within 24 hours.`;
    
    // Replace form with success message
    form.style.opacity = '0';
    setTimeout(() => {
        form.style.display = 'none';
        form.parentElement.appendChild(successMessage);
    }, 300);
    
    // Log submission (in production, send to backend)
    console.log(`${formType} form submitted:`, Object.fromEntries(formData));
    
    // Optional: Send to analytics or backend API
    // fetch('/api/submit-form', {
    //     method: 'POST',
    //     body: formData
    // });
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
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
