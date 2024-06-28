import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export async function processImagesSingleThread(imageFiles, imagesDir) {
  const promises = imageFiles.map(async (image) => {
    const filePath = path.join(imagesDir, image);
    const data = await fs.readFile(filePath);
    const outputDir = path.join(
      imagesDir,
      "..",
      "images_processed_single_thread"
    );
    const outputFilePath = path.join(outputDir, path.basename(filePath));
    await fs.mkdir(outputDir, { recursive: true });
    await sharp(data).resize(800).greyscale().toFile(outputFilePath);
  });

  await Promise.all(promises);
}
