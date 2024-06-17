const fs = require("fs").promises;
const path = require("path");
const winston = require("winston");
const colors = require("colors");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/clean.log" }),
  ],
});

const directories = [
  path.join(__dirname, "images_processed"),
  path.join(__dirname, "images_processed_worker_threads"),
];

async function cleanDirectory(directory) {
  try {
    const files = await fs.readdir(directory);
    const deletePromises = files.map((file) =>
      fs.unlink(path.join(directory, file))
    );
    await Promise.all(deletePromises);
    logger.info(`Limpeza da pasta ${directory} concluída`.green);
  } catch (error) {
    if (error.code === "ENOENT") {
      logger.warn(`Pasta ${directory} não encontrada, nada a limpar`.yellow);
    } else {
      logger.error(`Erro ao limpar a pasta ${directory}: ${error.message}`.red);
    }
  }
}

async function cleanDirectories() {
  try {
    await Promise.all(directories.map(cleanDirectory));
    logger.info("Limpeza das pastas concluída".green.bold);
  } catch (error) {
    logger.error("Erro durante a limpeza das pastas: ".red + error.message);
  }
}

cleanDirectories();
