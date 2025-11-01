"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const port = process.env.PORT || 8000;
console.log("database", process.env.DATABASE_URL);
// cluster
// if (cluster.isPrimary) {
//   const totalCpu = os.cpus().length;
//   console.log(`Primary ${process.pid} running, forking ${totalCpu} workers...`);
//   for (let i = 0; i < totalCpu; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker) => {
//     console.error(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else {
app_1.app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// }
