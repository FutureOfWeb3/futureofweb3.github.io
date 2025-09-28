# QR Code Generator with Logo

A modern, responsive web application that generates custom QR codes with the ability to add your own logo in the center.

## Features

- **Custom QR Code Generation**: Generate QR codes from any URL or text
- **Logo Integration**: Upload and overlay your own logo in the center of the QR code
- **Multiple Sizes**: Choose from Small (200px) to Extra Large (500px) QR codes
- **Logo Size Control**: Adjust logo size from 15% to 30% of QR code size
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Download Support**: Save your QR codes as PNG images
- **Real-time Preview**: See changes instantly as you type or upload logos
- **Error Handling**: User-friendly error messages and validation
- **Modern UI**: Clean, professional interface with smooth animations

## Supported Logo Formats

- PNG
- JPEG/JPG
- SVG
- WebP

## File Size Limits

- QR text: No limit
- Logo files: Maximum 5MB

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Usage

1. **Enter Content**: Type your URL or text in the input field
2. **Upload Logo** (Optional): Click "Choose File" and select your logo image
3. **Adjust Settings**: Choose QR code size and logo size percentage
4. **Generate**: Click "Generate QR Code" button
5. **Download**: Click "Download PNG" to save your QR code

## Technical Details

- **QR Code Library**: Uses qrcode.js for reliable QR code generation
- **Logo Overlay**: Canvas-based logo placement with circular background
- **Error Correction**: High error correction level (Level H) for logo compatibility
- **Canvas Rendering**: HTML5 Canvas for precise control over QR code and logo positioning

## Files Structure

```
qrGen/
├── index.html      # Main HTML structure
├── styles.css      # Modern responsive CSS styling
├── script.js       # QR code generation and logo overlay logic
└── README.md       # This documentation
```

## Development

The application uses vanilla JavaScript and requires no build process. Simply open `index.html` in a modern web browser.

## License

This project is open source and available under the MIT License.
