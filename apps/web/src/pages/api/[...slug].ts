import { app } from '@rebuildyourlife/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default function api(req: NextApiRequest, res: NextApiResponse) {
  // Let Express handle the native Node.js request and response objects
  return app(req, res);
}

// Disable Next.js body parsing so Express can handle it
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
