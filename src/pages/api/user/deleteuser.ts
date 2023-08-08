import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 쿼리에서 뽑은 아이디
        const id = req.query.id === undefined ? '' : req.query.id as string;

        // 아이디로 유저 정보 조회
        const userInfo: any = await client.fontsUser.findUnique({
            where: { user_id: id }
        });

        // 유저 정보 조회 후, 좋아요한 폰트 조회
        const fontInfo =  await client.fontsLiked.findMany({
            where: { user_id: Number(userInfo.user_no) }
        });

        // 좋아요한 폰트를 객체로 변환
        let arr = [];
        for (let i = 0; i < fontInfo.length; i++) {
            arr.push({code: Number(fontInfo[i].font_id)});
        }

        // 유저 정보 삭제 전에, 좋아요한 폰트의 좋아요 수 감소
        await client.fonts.updateMany({
            where: { OR: arr },
            data: { like: {decrement: 1} }
        });

        await client.fontsUser.delete({
            where: { user_id: id }
        });

        return res.status(200).send(true);
    }
}