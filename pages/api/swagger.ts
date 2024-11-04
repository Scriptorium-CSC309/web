// /pages/api/swagger.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import swaggerSpec from '@/swagger'; // Adjust the path if swagger.js is located elsewhere

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swaggerSpec);
}
