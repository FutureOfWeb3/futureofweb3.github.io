// Initialize EmailJS
(function() {
    emailjs.init("YOUR_EMAILJS_USER_ID"); // User needs to replace this
})();

// Base prices for each iPhone model (in excellent condition, unlocked, high storage)
const basePrices = {
    "iPhone 11": 250,
    "iPhone 11 Pro": 350,
    "iPhone 11 Pro Max": 400,
    "iPhone 12": 350,
    "iPhone 12 Mini": 300,
    "iPhone 12 Pro": 450,
    "iPhone 12 Pro Max": 500,
    "iPhone 13": 450,
    "iPhone 13 Mini": 400,
    "iPhone 13 Pro": 550,
    "iPhone 13 Pro Max": 650,
    "iPhone 14": 550,
    "iPhone 14 Plus": 600,
    "iPhone 14 Pro": 700,
    "iPhone 14 Pro Max": 800,
    "iPhone 15": 650,
    "iPhone 15 Plus": 700,
    "iPhone 15 Pro": 850,
    "iPhone 15 Pro Max": 950,
    "iPhone 16": 750,
    "iPhone 16 Plus": 800,
    "iPhone 16 Pro": 950,
    "iPhone 16 Pro Max": 1050,
    "iPhone 17 Pro Max": 1200
};

// Storage multipliers
const storageMultipliers = {
    "64GB": 0.85,
    "128GB": 0.95,
    "256GB": 1.0,
    "512GB": 1.15,
    "1TB": 1.30
};

// Condition multipliers
const conditionMultipliers = {
    "Excellent": 1.0,
    "Good": 0.85,
    "Fair": 0.65,
    "Poor": 0.45
};

// Calculator function
function calculateValue() {
    const form = document.getElementById('calculatorForm');
    const formData = new FormData(form);
    
    // Get base values
    const model = formData.get('model');
    const storage = formData.get('storage');
    const condition = formData.get('condition');
    const unlocked = formData.get('unlocked');
    
    // Start with base price
    let price = basePrices[model] || 0;
    
    // Apply storage multiplier
    price *= storageMultipliers[storage] || 1.0;
    
    // Apply condition multiplier
    price *= conditionMultipliers[condition] || 1.0;
    
    // Carrier status deduction
    if (unlocked === "Locked") {
        price *= 0.85; // 15% reduction for locked devices
    }
    
    // Screen damage deductions
    if (document.getElementById('screenCracked').checked) {
        price -= 80; // Major deduction for cracked screen
    }
    if (document.getElementById('screenScratches').checked) {
        price -= 20; // Minor deduction for scratches
    }
    
    // Body damage deductions
    if (document.getElementById('dents').checked) {
        price -= 30;
    }
    if (document.getElementById('backCracked').checked) {
        price -= 50;
    }
    
    // Functionality checks (if any are unchecked, major deduction)
    if (!document.getElementById('charges').checked) {
        price *= 0.5; // 50% reduction if doesn't charge
    }
    if (!document.getElementById('turnsOn').checked) {
        price *= 0.3; // 70% reduction if doesn't turn on
    }
    if (!document.getElementById('touchWorks').checked) {
        price *= 0.6; // 40% reduction if touch doesn't work
    }
    
    // Non-Apple parts deduction
    if (document.getElementById('nonAppleParts').checked) {
        price *= 0.80; // 20% reduction for non-Apple parts
    }
    if (document.getElementById('batteryReplaced').checked) {
        price *= 0.90; // 10% reduction for battery replacement
    }
    
    // Ensure minimum price
    price = Math.max(price, 50);
    
    // Round to nearest $5
    price = Math.round(price / 5) * 5;
    
    return price;
}

// Form submission handler
document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    
    // Calculate the value
    const estimatedValue = calculateValue();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const city = formData.get('city');
    const model = formData.get('model');
    const storage = formData.get('storage');
    const condition = formData.get('condition');
    const unlocked = formData.get('unlocked');
    
    // Build detailed condition report
    const issues = [];
    if (document.getElementById('screenCracked').checked) issues.push('Cracked screen');
    if (document.getElementById('screenScratches').checked) issues.push('Screen scratches');
    if (document.getElementById('dents').checked) issues.push('Dents/dings');
    if (document.getElementById('backCracked').checked) issues.push('Cracked back glass');
    if (!document.getElementById('charges').checked) issues.push('Charging issues');
    if (!document.getElementById('turnsOn').checked) issues.push('Won\'t turn on');
    if (!document.getElementById('touchWorks').checked) issues.push('Touch screen issues');
    if (document.getElementById('nonAppleParts').checked) issues.push('Non-Apple parts');
    if (document.getElementById('batteryReplaced').checked) issues.push('Battery replaced');
    
    const issuesText = issues.length > 0 ? issues.join(', ') : 'None reported';
    
    // Prepare email template parameters
    const templateParams = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        customer_city: city,
        device_model: model,
        device_storage: storage,
        device_condition: condition,
        carrier_status: unlocked,
        device_issues: issuesText,
        estimated_value: `$${estimatedValue}`,
        to_email: 'mobilefranchise952@gmail.com'
    };
    
    // Send email via EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show the quote result
            document.getElementById('quoteAmount').textContent = `$${estimatedValue}`;
            document.getElementById('emailSent').textContent = email;
            document.getElementById('calculatorForm').style.display = 'none';
            document.getElementById('quoteResult').style.display = 'block';
            
            // Scroll to result
            document.getElementById('quoteResult').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, function(error) {
            console.log('FAILED...', error);
            alert('There was an error submitting your quote. Please try again or contact us directly at mobilefranchise952@gmail.com');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-calculator"></i> Get My Instant Quote';
        });
});
