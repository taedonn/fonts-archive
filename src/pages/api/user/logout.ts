import type { NextApiRequest, NextApiResponse } from 'next';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const date = new Date();
        res.setHeader(
            'Set-Cookie',
            `session=; Path=/; Expires=${date.setHours(date.getHours() - 1)}; HttpOnly`,
        );

        res.end();
    }
}