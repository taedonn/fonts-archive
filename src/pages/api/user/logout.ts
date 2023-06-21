import type { NextApiRequest, NextApiResponse } from 'next';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.setHeader("Set-Cookie", [
            `session=deleted; max-Age=0; path=/`
        ]);

        res.end();
    }
}