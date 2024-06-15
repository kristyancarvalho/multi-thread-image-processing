const path = require("path");
const sharp = require("sharp");
const workerpool = require("workerpool");
const winston = require("winston");
const os = require("os");

const numCPUs = os.cpus().length;

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

async function processImagesWithWorkers(imageFiles, imagesDir) {
  const pool = workerpool.pool(path.join(__dirname, "worker.js"), {
    minWorkers: "max",
  });

  logger.info(
    `Utilizando ${numCPUs} núcleos para o processamento com Worker Threads`.bold
      .yellow
  );

  const promises = imageFiles.map((file) => {
    const filePath = path.join(imagesDir, file);
    return pool
      .exec("processImage", [{ filePath }])
      .then(() => {
        logger.info(`Processada (worker thread): `.cyan + file);
      })
      .catch((err) => {
        logger.error(
          `Erro ao processar imagem ${filePath}: `.red + err.message
        );
      });
  });

  await Promise.all(promises);
  await pool.terminate();
}

module.exports = {
  processImagesSingleThread,
  processImagesWithWorkers,
};
