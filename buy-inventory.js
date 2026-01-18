// iPhone Inventory Price Lookup
// Prices will be updated by client

const iphonePrices = {
    // iPhone 17 Series
    '17-pro-max': {
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '17-pro': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '17-plus': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '17': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    
    // iPhone 16 Series
    '16-pro-max': {
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '16-pro': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '16-plus': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '16': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    
    // iPhone 15 Series
    '15-pro-max': {
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '15-pro': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '15-plus': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '15': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    
    // iPhone 14 Series
    '14-pro-max': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '14-pro': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '14-plus': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '14': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    
    // iPhone 13 Series
    '13-pro-max': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '13-pro': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price',
        '1tb': 'Contact for Price'
    },
    '13': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '13-mini': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    
    // iPhone 12 Series
    '12-pro-max': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '12-pro': {
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '12': {
        '64gb': 'Contact for Price',
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    },
    '12-mini': {
        '64gb': 'Contact for Price',
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    },
    
    // iPhone 11 Series
    '11-pro-max': {
        '64gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '11-pro': {
        '64gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    '11': {
        '64gb': 'Contact for Price',
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    },
    
    // iPhone X Series
    'xs-max': {
        '64gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    'xs': {
        '64gb': 'Contact for Price',
        '256gb': 'Contact for Price',
        '512gb': 'Contact for Price'
    },
    'xr': {
        '64gb': 'Contact for Price',
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    },
    'x': {
        '64gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    },
    
    // iPhone 8 Series
    '8-plus': {
        '64gb': 'Contact for Price',
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    },
    '8': {
        '64gb': 'Contact for Price',
        '128gb': 'Contact for Price',
        '256gb': 'Contact for Price'
    }
};

// Model name mapping for display
const modelNames = {
    '17-pro-max': 'iPhone 17 Pro Max',
    '17-pro': 'iPhone 17 Pro',
    '17-plus': 'iPhone 17 Plus',
    '17': 'iPhone 17',
    '16-pro-max': 'iPhone 16 Pro Max',
    '16-pro': 'iPhone 16 Pro',
    '16-plus': 'iPhone 16 Plus',
    '16': 'iPhone 16',
    '15-pro-max': 'iPhone 15 Pro Max',
    '15-pro': 'iPhone 15 Pro',
    '15-plus': 'iPhone 15 Plus',
    '15': 'iPhone 15',
    '14-pro-max': 'iPhone 14 Pro Max',
    '14-pro': 'iPhone 14 Pro',
    '14-plus': 'iPhone 14 Plus',
    '14': 'iPhone 14',
    '13-pro-max': 'iPhone 13 Pro Max',
    '13-pro': 'iPhone 13 Pro',
    '13': 'iPhone 13',
    '13-mini': 'iPhone 13 Mini',
    '12-pro-max': 'iPhone 12 Pro Max',
    '12-pro': 'iPhone 12 Pro',
    '12': 'iPhone 12',
    '12-mini': 'iPhone 12 Mini',
    '11-pro-max': 'iPhone 11 Pro Max',
    '11-pro': 'iPhone 11 Pro',
    '11': 'iPhone 11',
    'xs-max': 'iPhone XS Max',
    'xs': 'iPhone XS',
    'xr': 'iPhone XR',
    'x': 'iPhone X',
    '8-plus': 'iPhone 8 Plus',
    '8': 'iPhone 8'
};

document.addEventListener('DOMContentLoaded', function() {
    const checkPriceBtn = document.getElementById('check-price-btn');
    const modelSelect = document.getElementById('iphone-model');
    const storageSelect = document.getElementById('storage-size');
    const priceDisplay = document.getElementById('price-display');
    const selectedDeviceEl = document.getElementById('selected-device');
    const devicePriceEl = document.getElementById('device-price');

    checkPriceBtn.addEventListener('click', function() {
        const model = modelSelect.value;
        const storage = storageSelect.value;

        // Validate selections
        if (!model || !storage) {
            alert('Please select both a model and storage size.');
            return;
        }

        // Check if combination exists
        if (!iphonePrices[model] || !iphonePrices[model][storage]) {
            alert('This storage size is not available for the selected model. Please choose a different combination.');
            return;
        }

        // Get price
        const price = iphonePrices[model][storage];
        const modelName = modelNames[model];
        const storageDisplay = storage.toUpperCase();

        // Update display
        selectedDeviceEl.textContent = `${modelName} - ${storageDisplay}`;
        devicePriceEl.textContent = price;

        // Show price display with animation
        priceDisplay.style.display = 'block';
        
        // Scroll to price display
        setTimeout(() => {
            priceDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    });

    // Hide price display when selections change
    modelSelect.addEventListener('change', function() {
        priceDisplay.style.display = 'none';
    });

    storageSelect.addEventListener('change', function() {
        priceDisplay.style.display = 'none';
    });
});
