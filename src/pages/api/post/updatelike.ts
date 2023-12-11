import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { code, id, email, provider } = req.body;

        if (req.body.action === "increase") {
            try {
                // 좋아요한 폰트에 추가
                await prisma.fontsLiked.create({
                    data: {
                        font_id: Number(code),
                        user_id: Number(id),
                        user_email: email,
                        user_auth: provider,
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
                    num: like.length,
                    like: true,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "좋아요 업데이트 실패",
                    err: err,
                    like: false,
                });
            }
        } else if (req.body.action === "decrease") {
            try {
                // 좋아요한 폰트에서 제거
                await prisma.fontsLiked.deleteMany({
                    where: {
                        font_id: Number(code),
                        user_id: Number(id),
                        user_email: email,
                        user_auth: provider,
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
                    num: like.length,
                    like: false,
                });
            } catch (err) {
                return res.status(500).json({
                    msg: "좋아요 업데이트 실패",
                    err: err,
                    like: true,
                });
            }
        }
    }
}