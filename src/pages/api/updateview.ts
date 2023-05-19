import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
    view: number
}
  
interface data {
    fonts: fonts[],
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'POST') {
        const { body } = req;
        const { code } = JSON.parse(body);

        const fonts: any = await client.fonts.update({
            where: { code },
            data: { view: { increment: 1 } }
        });

        return res.status(200).json(fonts);
    }
}