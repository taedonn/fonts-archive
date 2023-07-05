import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const code: string = req.query.code === undefined || req.query.code === '' ? '' : req.query.code as string;
        const checked: boolean =  req.query.checked === 'true' ? true : false;
        const user_no: string = req.query.user_no === undefined || req.query.user_no === '' ? '' : req.query.user_no as string;
        
        // 좋아유 수 증가/감소
        await client.fonts.update({
            where: { code: Number(code) },
            data: { like: checked ? { increment: 1 } : { decrement: 1 } }
        });

        // 좋아요 눌렀을 때, DB에 저장
        // 좋아요 취소했을 때, DB에서 삭제
        checked ? await client.fontsLiked.create({
            data: {
                font_id: Number(code),
                user_id: Number(user_no)
            }
        }) : await client.fontsLiked.deleteMany({
            where: {
                font_id: Number(code),
                user_id: Number(user_no)
            }
        });

        return res.status(200).send(checked ? 'like-created' : 'like-deleted');
    }
}