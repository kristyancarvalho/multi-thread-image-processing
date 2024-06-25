import { parentPort } from "worker_threads";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

parentPort.on("message", async ({ filePath }) => {
  try {
    const data = await fs.readFile(filePath);
    const outputDir = path.join(
      __dirname,
      "..",
      "images_processed_worker_threads"
    );
    const outputFilePath = path.join(outputDir, path.basename(filePath));
    await fs.mkdir(outputDir, { recursive: true });
    await sharp(data).resize(800).greyscale().toFile(outputFilePath);
    parentPort.postMessage("done");
  } catch (error) {
    parentPort.postMessage(
      `Erro ao processar imagem ${filePath}: ${error.message}`
    );
  }
});
