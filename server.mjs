import { createServer } from 'node:http';

export class Server {
  constructor(
    tasks
  ) {
    /**
     * @type { import("./tasks.mjs").Tasks }
     */
    this.tasks = tasks;
    this.server = createServer((req, res) => {
      const url = new URL(req.url, 'http://localhost:4000');

      const customerId = url.searchParams.get('customerId');
      const duration = Number(url.searchParams.get('duration'));

      this.tasks.addTask({ customerId, duration });

      res.statusCode = 200;
      res.end();
    });
  }

  listen(port) {
    this.server.listen(port, (e) => {
      if (e) {
        console.error(e);
        process.exit(1);
      }

      console.log('server started');
    });
  }
}
