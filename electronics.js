// Electronics Page - Dropdown Handler
document.addEventListener('DOMContentLoaded', function() {
    // Handle all electronics dropdowns
    const dropdowns = [
        { select: 'tablet-select', custom: 'tablet-custom', input: 'tablet-custom-input' },
        { select: 'watch-select', custom: 'watch-custom', input: 'watch-custom-input' },
        { select: 'console-select', custom: 'console-custom', input: 'console-custom-input' },
        { select: 'android-select', custom: 'android-custom', input: 'android-custom-input' }
    ];

    dropdowns.forEach(dropdown => {
        const selectEl = document.getElementById(dropdown.select);
        const customDiv = document.getElementById(dropdown.custom);

        if (selectEl && customDiv) {
            selectEl.addEventListener('change', function() {
                if (this.value === 'other') {
                    customDiv.style.display = 'block';
                } else {
                    customDiv.style.display = 'none';
                }
            });
        }
    });

    // Handle inquiry buttons
    const inquiryButtons = document.querySelectorAll('.inquiry-btn');
    
    inquiryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            let selectedDevice = '';
            let customDevice = '';

            // Determine which category and get the selected value
            if (category === 'Tablet') {
                const select = document.getElementById('tablet-select');
                selectedDevice = select.value;
                if (selectedDevice === 'other') {
                    customDevice = document.getElementById('tablet-custom-input').value;
                }
            } else if (category === 'Smart Watch') {
                const select = document.getElementById('watch-select');
                selectedDevice = select.value;
                if (selectedDevice === 'other') {
                    customDevice = document.getElementById('watch-custom-input').value;
                }
            } else if (category === 'Game Console') {
                const select = document.getElementById('console-select');
                selectedDevice = select.value;
                if (selectedDevice === 'other') {
                    customDevice = document.getElementById('console-custom-input').value;
                }
            } else if (category === 'Android Phone') {
                const select = document.getElementById('android-select');
                selectedDevice = select.value;
                if (selectedDevice === 'other') {
                    customDevice = document.getElementById('android-custom-input').value;
                }
            }

            // Validate selection
            if (!selectedDevice) {
                alert('Please select a device from the dropdown.');
                return;
            }

            if (selectedDevice === 'other' && !customDevice.trim()) {
                alert('Please specify what device you have.');
                return;
            }

            // Prepare the device name for contact
            const deviceName = selectedDevice === 'other' ? customDevice : selectedDevice;

            // Redirect to contact page with device info in URL parameter
            window.location.href = `contact.html?device=${encodeURIComponent(category + ': ' + deviceName)}`;
        });
    });
});
