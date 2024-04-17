import express from 'express';
import path from 'path';
import * as backend from './request_3d.js';
import { __dirname } from './files.js';
import { IncomingForm } from 'formidable';
import $ from 'jquery';

const app = express();
const port = 3001;
const req3D = new backend.Request3D();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
  req3D.version();
});

app.post('/upload', async (req, res) => {
  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    let convert = new Promise((resolve, reject) => {
      req3D.convert(files, res, resolve, reject);
    });
    await convert;
  } catch (err) {
    console.error('Error', err);
    res.status(500).send(err.message);
  }
  console.log('Wartezeit beendet');
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
