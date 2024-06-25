import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { processImagesWithWorkers } from "./utils.js";
import { processImagesSingleThread } from "./singleThread.js";
import colors from "colors";
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
const imagesDir = path.join(__dirname, "..", "images");

async function main() {
  try {
    const files = await readdir(imagesDir);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    const totalImages = imageFiles.length;

    logger.info(`Iniciando processamento de ${totalImages} imagens`.bold.green);

    console.time("Single Thread");
    await processImagesSingleThread(imageFiles, imagesDir);
    console.timeEnd("Single Thread");

    console.time("Worker Threads");
    await processImagesWithWorkers(imageFiles, imagesDir);
    console.timeEnd("Worker Threads");

    logger.info(`Benchmark concluído.`.bold.green);
  } catch (error) {
    logger.error(
      "Erro durante o processamento de imagens: ".red + error.message
    );
  }
}

main();
