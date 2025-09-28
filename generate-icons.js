const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Icon sizes needed for PWA and Android
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('Generating app icons...');

  try {
    // Load the SVG icon
    const svgPath = path.join(__dirname, 'icons', 'icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);

    // For each size, create a canvas and draw the SVG
    for (const size of iconSizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      // Load SVG as image (this requires canvas with SVG support)
      // Note: In a real implementation, you'd use a proper SVG to PNG converter
      // For now, we'll create placeholder icons

      // Create a simple programmatic icon
      createProgrammaticIcon(ctx, size);

      // Save as PNG
      const outputPath = path.join(__dirname, 'icons', `icon-${size}x${size}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);

      console.log(`Generated ${size}x${size} icon`);
    }

    console.log('Icon generation complete!');
    console.log('Note: For production, convert the icon.svg to PNG files using an online converter or design software.');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

function createProgrammaticIcon(ctx, size) {
  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(0.5, '#1a1a1a');
  gradient.addColorStop(1, '#000000');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Border
  const borderGradient = ctx.createLinearGradient(0, 0, size, size);
  borderGradient.addColorStop(0, '#ff0000');
  borderGradient.addColorStop(0.5, '#8a2be2');
  borderGradient.addColorStop(1, '#00ffff');

  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = size * 0.06;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size * 0.45, 0, 2 * Math.PI);
  ctx.stroke();

  // Inner circle background
  ctx.fillStyle = '#333333';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size * 0.4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Eyes
  ctx.fillStyle = borderGradient;
  ctx.beginPath();
  ctx.arc(size * 0.35, size * 0.35, size * 0.03, 0, 2 * Math.PI);
  ctx.arc(size * 0.65, size * 0.35, size * 0.03, 0, 2 * Math.PI);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(size * 0.35, size * 0.35, size * 0.015, 0, 2 * Math.PI);
  ctx.arc(size * 0.65, size * 0.35, size * 0.015, 0, 2 * Math.PI);
  ctx.fill();

  // Shuriken
  ctx.fillStyle = borderGradient;
  ctx.save();
  ctx.translate(size/2, size * 0.75);
  ctx.rotate(Math.PI / 4);

  const points = [
    [0, -size * 0.08], [size * 0.02, -size * 0.04], [size * 0.08, 0],
    [size * 0.04, size * 0.02], [0, size * 0.08], [-size * 0.04, size * 0.02],
    [-size * 0.08, 0], [-size * 0.04, -size * 0.04]
  ];

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Run if called directly
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
