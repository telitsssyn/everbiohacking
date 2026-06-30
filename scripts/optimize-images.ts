import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public/images");

async function optimizeImages() {
  console.log("Looking for images to optimize in", IMAGES_DIR);
  
  try {
    const files = await fs.readdir(IMAGES_DIR);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith(".png"));
    
    if (pngFiles.length === 0) {
      console.log("No PNG files found to optimize.");
      return;
    }
    
    console.log(`Found ${pngFiles.length} PNG files. Converting to WebP...`);
    
    for (const file of pngFiles) {
      const inputPath = path.join(IMAGES_DIR, file);
      const outputFilename = file.replace(/\.png$/i, ".webp");
      const outputPath = path.join(IMAGES_DIR, outputFilename);
      
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        const inStats = await fs.stat(inputPath);
        const outStats = await fs.stat(outputPath);
        
        const saved = ((inStats.size - outStats.size) / inStats.size * 100).toFixed(1);
        console.log(`✅ ${file} -> ${outputFilename} (saved ${saved}%)`);
        
        // We do NOT delete the original PNG yet to avoid breaking any links
        // However, we will need to update the markdown files to point to the .webp versions
      } catch (err) {
        console.error(`❌ Failed to optimize ${file}:`, err);
      }
    }
    
    console.log("\nDone! Don't forget to update frontmatter references to point to .webp extensions if you're replacing them permanently.");
    
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}

optimizeImages();
