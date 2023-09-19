import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // 아이디로 유저 정보 조회
        const userInfo: any = await prisma.fontsUser.findUnique({
            where: { user_id: req.body.id as string }
        });

        // 유저 정보 조회 후, 좋아요한 폰트 조회
        const userLikedFonts =  await prisma.fontsLiked.findMany({
            where: { user_id: Number(userInfo.user_no) }
        });

        if (userLikedFonts && userLikedFonts.length > 0) {
            // 좋아요한 폰트를 객체로 변환
            let arr = [];
            for (let i = 0; i < userLikedFonts.length; i++) {
                arr.push({code: Number(userLikedFonts[i].font_id)});
            }

            // 좋아요한 폰트 삭제
            await prisma.fontsLiked.deleteMany({
                where: { user_id: userInfo.user_no }
            });
        }

        // 댓글 신고 값 조회
        const reports = await prisma.fontsUserReport.findMany({
            where: { report_user_id: Number(req.body.user_no) }
        });

        // 댓글 신고 값 있는 경우 삭제
        reports && reports.length > 0
        ? await prisma.fontsUserReport.deleteMany({
            where: { report_user_id: Number(req.body.user_no) }
        }) : null;

        // 댓글 조회
        const comments = await prisma.fontsComment.findMany({
            where: { user_id: Number(req.body.user_no) }
        });

        // 댓글의 bundle_id 조회
        let commentsArr: any = [];
        if (comments && comments.length > 0) {
            for (let i = 0; i < comments.length; i++) {
                commentsArr.push({
                    font_id: Number(comments[i].font_id),
                    bundle_id: Number(comments[i].bundle_id)
                });
            }
        }

        // 댓글, 답글, 다른 유저의 답글까지 모두 삭제
        comments && comments.length > 0
        ? await prisma.fontsComment.deleteMany({
            where: { OR: commentsArr }
        }) : null;

        // 유저 정보 삭제
        await prisma.fontsUser.delete({
            where: { user_id: userInfo.user_id }
        });

        return res.status(200).json({
            message: "Account deleted successfully."
        });
    }
}