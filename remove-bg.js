const { Jimp } = require('jimp');

async function removeBackground() {
  try {
    const image = await Jimp.read('public/logo.png');
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // If color is white or near white, set alpha to 0 (transparent)
      // The new logo might have slight compression artifacts on the white background, 
      // so threshold 230 is safer
      if (r > 220 && g > 220 && b > 220) {
        this.bitmap.data[idx + 3] = 0;
      }
    });

    await image.write('public/logo-transparent.png');
    console.log('Successfully created logo-transparent.png');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

removeBackground();
