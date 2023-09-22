import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

// SSR 전체 댓글수 불러오기
export async function FetchComments(user_id: number) {
    const comments = await prisma.fontsComment.findMany({
        select: { user_id: true },
        where: { user_id: user_id }
    });

    return comments.length;
}
  
// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const allComments = await prisma.fontsComment.findMany({
            select: { user_id: true },
            where: { user_id: Number(req.query.user_id) }
        });

        // 최대 댓글 로딩 개수
        const limit = 10;

        // 댓글 가져오기
        const comments = await prisma.fontsComment.findMany({
            where: { user_id: Number(req.query.user_id) },
            orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
            take: limit // 가져오는 데이터 수
        });

        // 폰트 아이디 중복 체크
        const commentsNoRepeat = comments.reduce((acc: any, current: any) => {
            const x = acc.find((item: any) => item.font_id === current.font_id);
            if (!x) { return acc.concat([current]); }
            else { return acc; }
        }, []);

        // 중복 체크 후 배열에 저장
        let commentsArr: any = [];
        for (let i = 0; i < commentsNoRepeat.length; i++) {
            commentsArr.push({code: commentsNoRepeat[i].font_id});
        }

        // 배열에 저장된 폰트 ID로 폰트 이름 가져오기
        const fonts = await prisma.fonts.findMany({
            select: {
                code: true,
                name: true
            },
            where: { OR: commentsArr }
        });

        // 폰트 이름을 댓글 배열에 저장
        for (let i = 0; i < comments.length; i++) {
            for (let o = 0; o < fonts.length; o++) {
                if (comments[i].font_id === fonts[o].code) { Object.assign(comments[i], fonts[o]) }
            }
        }

        return res.json({
            message: "댓글 가져오기 성공",
            comments: comments,
            length: allComments.length
        });
    }
}