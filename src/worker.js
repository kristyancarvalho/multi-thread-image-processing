const workerpool = require("workerpool");
const sharp = require("sharp");
const path = require("path");

async function processImage({ filePath }) {
  const outputFilePath = filePath.replace(
    "images",
    "images_processed_worker_threads"
  );
  await sharp(filePath).greyscale().toFile(outputFilePath);
  return "done";
}

workerpool.worker({
  processImage,
});
