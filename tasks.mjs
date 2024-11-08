/**
 * @typedef Task
 * @prop { number } id
 * @prop { 'pending' | 'running' | 'serving' } status
 * @prop { string } customerId
 * @prop { number } duration
 * @prop { number } createdAt
 * @prop { number } updatedAt
 */

export class Tasks {
  /**
   *
   * @param { Pick<Task, 'customerId' | 'duration'>[] } [tasks]
   */
  constructor(tasks) {
    /** @type { Map<Task['id'], Task> } */
    this.tasks = new Map();
    /** @type { Map<Task['customerId'], Set<Task['id']>> } */
    this.pendingTasks = new Map();
    /** @type { Map<Task['customerId'], Set<Task['id']>> } */
    this.runningTasks = new Map();

    this.counter = 0;

    if (tasks) {
      for (const task of tasks) {
        this.addTask(task);
      }
    }
  }

  /**
   *
   * @param { { customerId: string, duration: number } } data
   */
  addTask(data) {
    /** @type Task */
    const task = {
      ...data,
      id: this.counter++,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.tasks.set(task.id, task);

    const pending = this.pendingTasks;

    const tasks = pending.get(data.customerId);

    if (!tasks) {
      pending.set(data.customerId, new Set([task.id]));
    } else {
      tasks.add(task.id);
    }
  }

  /**
   *
   * @returns { Task | null }
   */
  popTask() {
    // algorithm:
    // we randomly select task from the list
    // of earliest submitted ones (have the smallest `createdAt`)
    // by customer (only one task per each customer)
    // prioritizing tasks from customers
    // who do not have any tasks running currently

    /** @type { Map<Task['customerId'], Task> } */
    const tasksByPendingCustomers = new Map();
    /** @type { Map<Task['customerId'], Task> } */
    const tasksByRunningCustomers = new Map();

    for (const [customerId, pendingTasksIds] of this.pendingTasks) {
      const runningTasks = this.runningTasks.get(customerId);

      /** @type {Task | null} */
      let task = null;

      for (const pendingTaskId of (pendingTasksIds ?? [])) {
        const pendingTask = this.tasks.get(pendingTaskId);

        if (!pendingTask) {
          continue;
        }

        if (!task) {
          task = pendingTask;
        } else if (pendingTask.createdAt < task.createdAt) {
          task = pendingTask;
        }
      }

      if (runningTasks && runningTasks.size) {
        tasksByRunningCustomers.set(customerId, task);
      } else {
        tasksByPendingCustomers.set(customerId, task);
      }
    }

    const map = tasksByPendingCustomers.size ? tasksByPendingCustomers : tasksByRunningCustomers;

    const random = Math.floor(Math.random() * map.size);
    let i = 0;

    for (const [_, task] of map) {
      if (i === random) {
        task.status = 'running';
        task.updatedAt = Date.now();

        let tasks = this.pendingTasks.get(task.customerId);

        if (tasks) {
          tasks.delete(task.id);

          if (!tasks.size) {
            this.pendingTasks.delete(task.customerId);
          }
        }

        tasks = this.runningTasks.get(task.customerId);

        if (!tasks) {
          this.runningTasks.set(task.customerId, new Set([task.id]));
        } else {
          tasks.add(task.id);
        }

        return task;
      }
    }

    return null;
  }

  /**
   *
   * @param { Task['id'] } id
   */
  endTask(id) {
    const task = this.tasks.get(id);

    if (!task) {
      return;
    }

    if (task.status !== 'running') {
      return;
    }

    const tasks = this.runningTasks.get(task.customerId);

    if (tasks) {
      tasks.delete(task.id);

      if (!tasks.size) {
        this.runningTasks.delete(task.customerId);
      }
    }

    task.status = 'serving';
    task.updatedAt = Date.now();
  }
}
