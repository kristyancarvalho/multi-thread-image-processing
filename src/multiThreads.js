import { Worker } from "worker_threads";
import PQueue from "p-queue";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function processImagesWithWorkers(
  imageFiles,
  imagesDir,
  outputDir
) {
  const queue = new PQueue({ concurrency: 2 });

  const createWorker = () => {
    const worker = new Worker(path.join(__dirname, "worker.js"), {
      workerData: { outputDir },
    });

    worker.on("message", (result) => {
      if (!result.success) {
        console.error(`Error processing ${result.filePath}: ${result.error}`);
      }
    });

    worker.on("error", (error) => {
      console.error(`Worker error: ${error}`);
    });

    worker.on("exit", (code) => {
      workers.push(createWorker());
    });

    return worker;
  };

  const workers = Array.from({ length: 2 }, createWorker);

  const results = imageFiles.map((file) => {
    const filePath = path.join(imagesDir, file);
    return queue.add(() => {
      return new Promise((resolve, reject) => {
        const worker = workers.shift();
        worker.once("message", (message) => {
          if (message.success) {
            resolve();
          } else {
            reject(new Error(message.error));
          }
        });
        worker.postMessage(filePath);
        workers.push(worker);
      });
    });
  });

  await Promise.all(results);
  await queue.onIdle();

  workers.forEach((worker) => worker.terminate());
}
