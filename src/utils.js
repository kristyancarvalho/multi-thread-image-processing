const path = require("path");
const os = require("os");
const { Worker } = require("worker_threads");
const winston = require("winston");

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

async function processImagesWithWorkers(imageFiles, imagesDir) {
  logger.info(
    `Utilizando ${numCPUs} núcleos para o processamento Multi Thread`.bold
      .yellow
  );

  const queue = imageFiles.map((file) => path.join(imagesDir, file));
  const promises = [];

  function createWorker() {
    const worker = new Worker(path.join(__dirname, "worker.js"));
    worker.on("message", () => {
      const filePath = queue.pop();
      if (filePath) {
        worker.postMessage({ filePath });
      } else {
        worker.terminate();
      }
    });
    worker.postMessage({ filePath: queue.pop() });
    return worker;
  }

  for (let i = 0; i < numCPUs; i++) {
    promises.push(createWorker());
  }

  await Promise.all(promises);
}

module.exports = {
  processImagesWithWorkers,
};
