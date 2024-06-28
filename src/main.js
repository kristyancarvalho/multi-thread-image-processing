import express from "express";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { processImagesWithWorkers } from "./multiThreads.js";
import { processImagesSingleThread } from "./singleThread.js";
import colors from "colors";
import winston from "winston";
import Table from "cli-table3";

const app = express();
const port = 3000;

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
const processedDirSingleThread = path.join(
  __dirname,
  "..",
  "images_processed_single_thread"
);
const processedDirWorkerThreads = path.join(
  __dirname,
  "..",
  "images_processed_worker_threads"
);

const imageBatches = [10, 50, 100, 200];

async function processBatch(batchSize, method) {
  const files = await readdir(imagesDir);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  const imagesToProcess = imageFiles.slice(0, batchSize);

  if (imagesToProcess.length === 0) {
    throw new Error(
      `Não há imagens suficientes para o teste de ${batchSize} imagens`
    );
  }

  const startTime = Date.now();
  if (method === "Single Thread") {
    await processImagesSingleThread(
      imagesToProcess,
      imagesDir,
      processedDirSingleThread
    );
  } else {
    await processImagesWithWorkers(
      imagesToProcess,
      imagesDir,
      processedDirWorkerThreads
    );
  }
  const endTime = Date.now();

  return endTime - startTime;
}

app.get("/test/:batchSize", async (req, res) => {
  const batchSize = parseInt(req.params.batchSize, 10);
  if (!imageBatches.includes(batchSize)) {
    return res
      .status(400)
      .json({ error: "Batch size deve ser 10, 50, 100 ou 200" });
  }

  try {
    logger.info(`Iniciando processamento de ${batchSize} imagens`.bold.green);

    const singleThreadTime = await processBatch(batchSize, "Single Thread");
    const workerThreadTime = await processBatch(batchSize, "Worker Threads");

    const percentageDifference = (
      ((singleThreadTime - workerThreadTime) /
        ((singleThreadTime + workerThreadTime) / 2)) *
      100
    ).toFixed(2);

    const results = new Table({
      head: [
        colors.blue.bold("Método"),
        colors.blue.bold("Imagens Processadas"),
        colors.blue.bold("Tempo (ms)"),
        colors.blue.bold("Diferença (%)"),
      ],
      colAligns: ["left", "right", "right", "right"],
    });

    results.push(
      {
        [singleThreadTime < workerThreadTime
          ? colors.green("Single Thread (+)")
          : colors.red("Single Thread (-)")]: [
          batchSize,
          singleThreadTime,
          `${percentageDifference}%`,
        ],
      },
      {
        [singleThreadTime < workerThreadTime
          ? colors.red("Worker Threads (-)")
          : colors.green("Worker Threads (+)")]: [
          batchSize,
          workerThreadTime,
          `${percentageDifference}%`,
        ],
      }
    );

    console.log("\nResultados do Benchmark:");
    console.log(results.toString());

    logger.info(`Teste de ${batchSize} imagens concluído.`.bold.green);

    res.json({
      batchSize,
      singleThreadTime,
      workerThreadTime,
      percentageDifference,
    });
  } catch (error) {
    logger.error(
      "Erro durante o processamento de imagens: ".red + error.message
    );
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`.bold.blue);
});
