import app from '../server/src/app';

export default async function handler(req: any, res: any) {
  try {
    return await app(req, res);
  } catch (err: any) {
    console.error('Vercel Serverless Exception:', err);
    return res.status(500).json({
      error: err?.message || 'Internal Vercel Serverless Error'
    });
  }
}

