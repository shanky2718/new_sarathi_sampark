import fs from 'fs';
import path from 'path';

let app: any;
try {
  const distPath = path.resolve(__dirname, '../server/dist/app.js');
  if (fs.existsSync(distPath)) {
    app = require('../server/dist/app').default || require('../server/dist/app');
  } else {
    app = require('../server/src/app').default || require('../server/src/app');
  }
} catch (e) {
  app = require('../server/src/app').default || require('../server/src/app');
}

export default function handler(req: any, res: any) {
  return app(req, res);
}

