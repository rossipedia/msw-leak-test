import { setupServer } from 'msw/node';
import http from 'http';
import express from 'express';
import v8 from 'node:v8';

const enableMSW = !!process.env.ENABLE_MSW;

if (enableMSW) {
  setupServer().listen({
    onUnhandledRequest: 'bypass',
  });
}

const app = express();

app.get('/', (_, res) => {
  http.get('http://localhost:8080', (r) => {
    r.on('data', () => {});
    r.on('end', () => {
      res.send('ok\n\n');
    });
  });
});

app.post('/snapshot', (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    res.status(400).send('name query parameter is required\n');
    return;
  }

  global.gc?.();
  v8.writeHeapSnapshot(`${name}.heapsnapshot`);
  res.send(`wrote snapshot to ${name}.heapsnapshot\n`);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
