import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "fs/promises";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const outputDir = path.join(__dirname, "..", "images_processed");
    const outputFilePath = path.join(outputDir, path.basename(filePath));
    await fs.mkdir(outputDir, { recursive: true });
    await sharp(data).resize(800).greyscale().toFile(outputFilePath);
  } catch (error) {
    console.error(`Erro ao processar imagem ${filePath}: ${error.message}`);
  }
}

export async function processImagesSingleThread(imageFiles, imagesDir) {
  logger.info(
    `Utilizando 1 núcleo para o processamento Single Thread`.bold.yellow
  );
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    await processImage(filePath);
  }
}
