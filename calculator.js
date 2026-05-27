function calculateEarnings() {
    const bedrooms = document.getElementById('bedrooms').value;
    const location = document.getElementById('location').value;
    const currentRent = parseFloat(document.getElementById('current-rent').value) || 0;
    
    if (!bedrooms || !location) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Base rates per bedroom (monthly Airbnb potential)
    const baseRates = {
        '1': 2500,
        '2': 3500,
        '3': 4500,
        '4': 6000
    };
    
    const monthlyIncome = baseRates[bedrooms];
    const annualIncome = monthlyIncome * 12;
    
    // Calculate increase vs traditional rent
    let increasePercent = 0;
    if (currentRent > 0) {
        increasePercent = Math.round(((monthlyIncome - currentRent) / currentRent) * 100);
    } else {
        // Default to 2-3x increase if no current rent provided
        increasePercent = Math.round(Math.random() * 50 + 150); // 150-200%
    }
    
    // Format currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    
    // Display results
    document.getElementById('monthly-income').textContent = formatter.format(monthlyIncome);
    document.getElementById('annual-income').textContent = formatter.format(annualIncome);
    document.getElementById('increase-percent').textContent = '+' + increasePercent + '%';
    
    // Show results with animation
    const resultsDisplay = document.getElementById('results-display');
    resultsDisplay.style.display = 'block';
    resultsDisplay.style.opacity = '0';
    
    setTimeout(() => {
        resultsDisplay.style.transition = 'opacity 0.5s ease';
        resultsDisplay.style.opacity = '1';
    }, 100);
    
    // Scroll to results
    resultsDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
