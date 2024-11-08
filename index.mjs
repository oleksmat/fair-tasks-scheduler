import {Tasks} from "./tasks.mjs";
import {Server} from "./server.mjs";
import {Worker} from './worker.mjs';

async function main() {
  const tasks = new Tasks();
  const server = new Server(tasks);

  const array = [
    new Worker(tasks),
    new Worker(tasks),
    new Worker(tasks),
    new Worker(tasks)
  ];

  array.forEach((worker) => worker.start());

  server.listen(4000);
}

await main();
