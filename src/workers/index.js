const path = require("path");
const { Worker, isMainThread, parentPort } = require("worker_threads");
module.exports = async function ({ filePath, workerData }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filePath, {
      workerData,
    });
    worker.on("message", (message) => {
      return resolve(message);
    });
    worker.on("error", (error) => {
      return reject(error);
    });
    worker.on("exit", (code) => {
      if (code !== 0)
        return reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};
