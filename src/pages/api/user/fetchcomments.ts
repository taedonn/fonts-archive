import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';

// SSR 댓글 페이지 수
export async function FetchCommentsLength(user_id: number) {
    const comments = await prisma.fontsComment.findMany({
        select: { user_id: true },
        where: {
            user_id: user_id,
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false
        }
    });

    return comments.length;
}

// SSR 첫 댓글 목록 가져오기
export async function FetchComments(user_id: number, lastId: number | undefined) {
    const comments = await prisma.fontsComment.findMany({
        where: {
            user_id: user_id,
            is_deleted: false,
            is_deleted_with_reply: false,
            is_deleted_by_reports: false
        },
        orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
        take: 10, // 가져오는 데이터 수
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: {comment_id: lastId} })
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

    return comments;
}
  
// API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // text에 폰트 이름이 포함되어 있는지 체크
            const textWithFonts = req.query.text !== ''
            ? req.query.filter === 'all' || req.query.filter === 'font'
                ? await prisma.fonts.findMany({
                    select: {
                        code: true,
                        name: true,
                    },
                    where: { name: {contains: req.query.text as string} }
                }) 
                : []
            : [];

            // 폰트 이름 배열에 저장
            let textArr: any = [];
            if (req.query.filter === 'font') { // 필터링: 폰트 선택 시
                if (textWithFonts.length > 0) { for (let i = 0; i < textWithFonts.length; i++) { textArr.push({font_id: textWithFonts[i].code}); } }
            } else if (req.query.filter === 'comment') {
                textArr.push({comment: {contains: req.query.text as string}});
            } else {
                if (textWithFonts.length > 0) { for (let i = 0; i < textWithFonts.length; i++) { textArr.push({font_id: textWithFonts[i].code}); } }
                textArr.push({comment: {contains: req.query.text as string}});
            }

            // 댓글 페이지 수 가져오기
            const length = await prisma.fontsComment.findMany({
                where: {
                    user_id: Number(req.query.user_id),
                    is_deleted: false,
                    is_deleted_with_reply: false,
                    is_deleted_by_reports: false,
                    OR: textArr
                }
            });
            const count = Number(length.length) % 10 > 0 ? Math.floor(Number(length.length)/10) + 1 : Math.floor(Number(length.length)/10);

            // 댓글 가져오기
            const comments = await prisma.fontsComment.findMany({
                where: {
                    user_id: Number(req.query.user_id),
                    is_deleted: false,
                    is_deleted_with_reply: false,
                    is_deleted_by_reports: false,
                    OR: textArr
                },
                orderBy: [{created_at: 'desc'}, {comment_id: 'desc'}], // 정렬순
                take: 10, // 가져오는 데이터 수
                skip: Number(req.query.page) === 1 ? 0 : (Number(req.query.page) - 1) * 10
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

            return res.status(200).json({
                message: "댓글 가져오기 성공",
                comments: comments,
                count: count,
                test: textWithFonts,
            });
        } catch (err) {
            return res.status(500).json({
                message: "댓글 가져오기 실패",
                error: err,
            })
        }
    }
}