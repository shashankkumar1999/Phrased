const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Read the SVG file
const svgFile = path.join(__dirname, 'src', 'logo.svg');

// Sizes to generate
const sizes = [16, 32, 48, 64, 128];

async function generateIcons() {
  try {
    // Read SVG content
    const svgBuffer = fs.readFileSync(svgFile);
    
    console.log('Generating icon files...\n');
    
    for (const size of sizes) {
      // Create a white background version (for better visibility)
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(path.join(__dirname, 'src', `icon${size}.png`));
      
      console.log(`✓ Generated icon${size}.png (${size}x${size})`);
    }
    
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
