const path = require("path");
const sharp = require("sharp");
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
    const outputFilePath = filePath.replace("images", "images_processed");
    await sharp(filePath).greyscale().toFile(outputFilePath);
    logger.info(`Processada (single thread): `.blue + path.basename(filePath));
  } catch (error) {
    logger.error(`Erro ao processar imagem ${filePath}: `.red + error.message);
  }
}

async function processImagesSingleThread(imageFiles, imagesDir) {
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    await processImage(filePath);
  }
}

module.exports = {
  processImagesSingleThread,
};
