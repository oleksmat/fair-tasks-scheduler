import { setTimeout} from 'node:timers/promises';

let worker = 0;

export class Worker {
  /**
   *
   * @param { import("./tasks.mjs").Tasks } tasks
   */
  constructor(tasks) {
    this.id = worker++;
    this.tasks = tasks;
    this.running = false;
    this.intervalId = undefined;
  }

  start() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.run(), 5);
    }
  }

  async run() {
    if (this.running) {
      return;
    }

    this.running = true;

    const task = this.tasks.popTask();

    if (task) {
      const taskIdStr = `#${task.id}`.padStart(3);

      console.log(`Worker: ${this.id} | Task ${taskIdStr} started (customer: ${task.customerId})`);

      await setTimeout(task.duration);

      this.tasks.endTask(task.id);

      console.log(`Worker: ${this.id} | Task ${taskIdStr} finished (customer: ${task.customerId})`);
    }

    this.running = false;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
