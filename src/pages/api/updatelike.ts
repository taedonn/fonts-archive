import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const code: string = req.query.code === undefined || req.query.code === '' ? '' : req.query.code as string;
        const checked: boolean =  req.query.checked === 'true' ? true : false;
        const user_no: string = req.query.user_no === undefined || req.query.user_no === '' ? '' : req.query.user_no as string;

        // 이미 좋아요한 폰트인지 체크
        const isLiked: any = !!await prisma.fontsLiked.findFirst({
            where: { AND: {
                font_id: Number(code),
                user_id: Number(user_no)
            } }
        });

        // 사용자 좋아요 체크 후
        checked && !isLiked ? (
            await prisma.fontsLiked.create({ // 유저가 좋아요한 폰트 유저 정보에 저장
                data: {
                    font_id: Number(code),
                    user_id: Number(user_no)
                }
            })
        ) : !checked && isLiked ? (
            await prisma.fontsLiked.deleteMany({ // 유저가 좋아요 해제한 폰트 유저 정보에서 제거
                where: {
                    font_id: Number(code),
                    user_id: Number(user_no)
                }
            })
        ) : 'do-nothing';

        return res.status(200).send(checked && !isLiked ? 'liked' : 'unliked');
    }
}