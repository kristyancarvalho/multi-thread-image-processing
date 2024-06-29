import { parentPort, workerData } from "worker_threads";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

const { outputDir } = workerData;

parentPort.on("message", async (filePath) => {
  try {
    const data = await fs.readFile(filePath);
    const outputFilePath = path.join(outputDir, path.basename(filePath));
    await fs.mkdir(outputDir, { recursive: true });
    await sharp(data).resize(800).greyscale().toFile(outputFilePath);
    parentPort.postMessage({ filePath, success: true });
  } catch (error) {
    parentPort.postMessage({ filePath, success: false, error: error.message });
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
});
