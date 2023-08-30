import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 하루에 한번씩 cron으로, 3일이 지난 '삭제된 댓글' 삭제
        await prisma.fontsComment.deleteMany({

        });
    } catch (err) {
        return res.status(400).json({
            message: "Comments deletion failed.",
            error: err
        });
    }
}