import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const code = req.body.code;
        const user_no = req.body.user_no;

        if (req.body.action === "increase") {
            try {
                // 좋아요한 폰트에 추가
                await prisma.fontsLiked.create({
                    data: {
                        font_id: Number(code),
                        user_id: Number(user_no)
                    }
                });
    
                const like = await prisma.fontsLiked.findMany({
                    where: { font_id: Number(code) }
                });
    
                await prisma.fonts.update({
                    where: { code: Number(code) },
                    data: { like: like.length }
                });

                return res.status(200).json({
                    msg: "좋아요 업데이트 성공",
                    num: like.length
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "좋아요 업데이트 실패",
                    err: err
                });
            }
        } else if (req.body.action === "decrease") {
            try {
                // 좋아요한 폰트에서 제거
                await prisma.fontsLiked.deleteMany({
                    where: {
                        font_id: Number(code),
                        user_id: Number(user_no)
                    }
                });
    
                const like = await prisma.fontsLiked.findMany({
                    where: { font_id: Number(code) }
                });
    
                await prisma.fonts.update({
                    where: { code: Number(code) },
                    data: { like: like.length }
                });

                return res.status(200).json({
                    msg: "좋아요 업데이트 성공",
                    num: like.length
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "좋아요 업데이트 실패",
                    err: err
                });
            }
        }
    }
}