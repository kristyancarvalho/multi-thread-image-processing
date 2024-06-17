const path = require("path");
const sharp = require("sharp");
const fs = require("fs").promises;
const winston = require("winston");

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

async function processImagesSingleThread(imageFiles, imagesDir) {
  logger.info(
    `Utilizando 1 núcleo para o processamento Single Thread`.bold.yellow
  );
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    await processImage(filePath);
  }
}

module.exports = {
  processImagesSingleThread,
};
