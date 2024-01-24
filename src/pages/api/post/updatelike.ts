import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { code, id, email, provider } = req.body;

        if (req.body.action === "increase") {
            try {
                await prisma.fonts.update({
                    where: { code: Number(code) },
                    data: {
                        like: { increment: 1 },
                        liked_user: {
                            create: [{
                                user_id: Number(id),
                                user_email: email,
                                user_auth: provider,
                            }]
                        }
                    },
                    include: { liked_user: true }
                });
    
                const like = await prisma.fontsLiked.findMany({
                    where: { font_id: Number(code) }
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
                await prisma.fonts.update({
                    where: { code: Number(code) },
                    data: {
                        like: { decrement: 1 },
                        liked_user: {
                            deleteMany: [{ user_id: id }]
                        }
                    },
                    include: { liked_user: true }
                });
    
                const like = await prisma.fontsLiked.findMany({
                    where: { font_id: Number(code) }
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