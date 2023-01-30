const { workerData, parentPort } = require("worker_threads");

const { browser } = workerData;
main({  })
  .then((result) => {
    parentPort.postMessage(result);
  })
  .catch((error) => {
    parentPort.postMessage(error);
});