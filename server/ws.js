import { WebSocketServer } from 'ws';

const ws = null;

export default (routing, port) => {
  ws = new WebSocketServer({ port });

  ws.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress;
    connection.on('message', async (message) => {
      const obj = JSON.parse(message);
      const { name, method, args = [] } = obj;
      const entity = routing[name];
      if (!entity) return connection.send('"не знайдено"', { binary: false });
      const handler = entity[method];
      if (!handler) return connection.send('"не знайдено"', { binary: false });
      const json = JSON.stringify(args);
      const parameters = json.substring(1, json.length - 1);
      console.log(`${ip} ${name}.${method}(${parameters})`);
      try {
        const result = await handler(...args);
        connection.send(JSON.stringify(result.rows), { binary: false });
      } catch (err) {
        console.dir({ err });
        connection.send('"помилка сервера"', { binary: false });
      }
    });
  });
  console.log(`api на порті ${port}`);
};
