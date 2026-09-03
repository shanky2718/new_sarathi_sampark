import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const appModule = require('../server/src/app');
    const app = appModule.default || appModule.app || appModule;
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel API Handler Error:', err);
    return res.status(200).json({
      status: 'UP',
      mode: 'Vercel Serverless Mode',
      error: err?.message || String(err),
      stack: err?.stack || null
    });
  }
}

