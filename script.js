// QR Code Generator with Logo Overlay
class QRCodeGenerator {
    constructor() {
        this.qrCanvas = document.getElementById('qr-canvas');
        this.qrPlaceholder = document.getElementById('qr-placeholder');
        this.qrTextInput = document.getElementById('qr-text');
        this.logoUpload = document.getElementById('logo-upload');
        this.logoPreview = document.getElementById('logo-preview');
        this.logoPlaceholder = document.getElementById('logo-placeholder');
        this.qrSizeSelect = document.getElementById('qr-size');
        this.logoSizeSelect = document.getElementById('logo-size');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.generateTab = document.getElementById('generate-tab');
        this.scanTab = document.getElementById('scan-tab');

        this.currentLogo = null;
        this.qrCode = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateQRCode(); // Generate initial QR code
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        this.logoUpload.addEventListener('change', (e) => this.handleLogoUpload(e));
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        
        this.generateTab.addEventListener('click', () => this.switchToGenerate());
        this.scanTab.addEventListener('click', () => this.switchToScan());

        // Auto-generate on input changes
        this.qrTextInput.addEventListener('input', () => this.generateQRCode());
        this.qrSizeSelect.addEventListener('change', () => this.generateQRCode());
        this.logoSizeSelect.addEventListener('change', () => this.generateQRCode());
    }

    async generateQRCode() {
        const text = this.qrTextInput.value.trim();
        const size = parseInt(this.qrSizeSelect.value);

        if (!text) {
            this.showError('⚠️ The shadows require content to manifest! Enter a URL or text.');
            return;
        }

        try {
            this.showLoading();

            // Clear canvas
            const ctx = this.qrCanvas.getContext('2d');
            ctx.clearRect(0, 0, this.qrCanvas.width, this.qrCanvas.height);

            // Set canvas size
            this.qrCanvas.width = size;
            this.qrCanvas.height = size;

            // Generate QR code using kjua library
            const qrCanvas = kjua({
                text: text,
                render: 'canvas',
                size: size,
                fill: '#000000',
                back: '#ffffff',
                rounded: 0,
                quiet: 0,
                mode: 'plain',
                crisp: true
            });

            // Copy the generated QR code to our canvas
            ctx.clearRect(0, 0, this.qrCanvas.width, this.qrCanvas.height);
            this.qrCanvas.width = size;
            this.qrCanvas.height = size;
            ctx.drawImage(qrCanvas, 0, 0, size, size);

            // Add logo if available
            if (this.currentLogo) {
                await this.overlayLogo(ctx, size);
            }

            this.hideLoading();
            this.showSuccess();
            this.enableDownload();

        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showError('🌑 The shadows have failed! Your ninja QR could not be created.');
            this.hideLoading();
        }
    }

    async overlayLogo(ctx, canvasSize) {
        return new Promise((resolve, reject) => {
            const logoSizePercent = parseInt(this.logoSizeSelect.value) / 100;
            const logoSize = Math.floor(canvasSize * logoSizePercent);

            const img = new Image();
            img.onload = () => {
                // Calculate position to center the logo
                const x = (canvasSize - logoSize) / 2;
                const y = (canvasSize - logoSize) / 2;

                // Create a white background circle for the logo
                ctx.save();
                ctx.beginPath();
                ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2 + 4, 0, 2 * Math.PI);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                // Draw logo
                ctx.beginPath();
                ctx.arc(x + logoSize/2, y + logoSize/2, logoSize/2, 0, 2 * Math.PI);
                ctx.clip();
                ctx.drawImage(img, x, y, logoSize, logoSize);
                ctx.restore();

                resolve();
            };
            img.onerror = reject;
            img.src = this.currentLogo;
        });
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            this.showError('🗡️ Only true ninja artifacts accepted! Please select PNG, JPG, SVG, or WebP files.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('📦 This scroll is too heavy! Logo file must be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentLogo = e.target.result;
            this.updateLogoPreview(e.target.result);
            this.generateQRCode(); // Regenerate QR code with logo
        };
        reader.onerror = () => {
            this.showError('🌫️ The mists have obscured this artifact! Failed to read logo file.');
        };
        reader.readAsDataURL(file);
    }

    updateLogoPreview(src) {
        this.logoPreview.src = src;
        this.logoPreview.style.display = 'block';
        this.logoPlaceholder.style.display = 'none';
    }

    downloadQRCode() {
        if (!this.qrCanvas.width || !this.qrCanvas.height) {
            this.showError('🌑 No artifact to retrieve from the shadows!');
            return;
        }

        // Create download link
        const link = document.createElement('a');
        link.download = 'ninja-qr-artifact.png';
        link.href = this.qrCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    reset() {
        this.qrTextInput.value = 'https://example.com';
        this.logoUpload.value = '';
        this.currentLogo = null;
        this.logoPreview.style.display = 'none';
        this.logoPlaceholder.style.display = 'block';
        this.logoPlaceholder.textContent = 'No logo selected';
        this.qrSizeSelect.value = '300';
        this.logoSizeSelect.value = '20';

        // Clear canvas
        const ctx = this.qrCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.qrCanvas.width, this.qrCanvas.height);

        this.showPlaceholder();
        this.disableDownload();
    }

    showLoading() {
        this.generateBtn.textContent = '🌀 Crafting Ninja Code...';
        this.generateBtn.classList.add('loading');
        this.generateBtn.disabled = true;
    }

    hideLoading() {
        this.generateBtn.textContent = '⚡ Generate Ninja QR ⚡';
        this.generateBtn.classList.remove('loading');
        this.generateBtn.disabled = false;
    }

    showSuccess() {
        this.qrCanvas.classList.add('success');
        setTimeout(() => {
            this.qrCanvas.classList.remove('success');
        }, 600);
        this.hidePlaceholder();
    }

    showPlaceholder() {
        this.qrPlaceholder.style.display = 'flex';
        this.qrCanvas.style.display = 'none';
    }

    hidePlaceholder() {
        this.qrPlaceholder.style.display = 'none';
        this.qrCanvas.style.display = 'block';
    }

    enableDownload() {
        this.downloadBtn.disabled = false;
        this.downloadBtn.style.opacity = '1';
    }

    disableDownload() {
        this.downloadBtn.disabled = true;
        this.downloadBtn.style.opacity = '0.6';
    }

    switchToGenerate() {
        this.generateTab.classList.add('active');
        this.scanTab.classList.remove('active');
    }

    switchToScan() {
        this.generateTab.classList.remove('active');
        this.scanTab.classList.add('active');
    }

    showError(message) {
        // Create error toast
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Add error toast animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the QR code generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});
