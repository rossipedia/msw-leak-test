import express from 'express';

const app = express();

app.all('*', (req, res) => {
  req.resume();
  req.on('end', () => {
    res.writeHead(200, 'OK');
    res.end();
  });
});

app.listen(8080, () => {
  console.log('API server running on http://localhost:8080');
});
