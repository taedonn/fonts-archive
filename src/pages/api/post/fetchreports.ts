import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export async function FetchReports(email: string, provider: string, code: number) {
    // 유저가 신고한 리포트 전부 가져오기
    const reports = await prisma.fontsUserReport.findMany({
        where: {
            report_user_email: email,
            report_user_auth: provider,
            report_font_code: Number(code),
        }
    });

    return reports;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        if (req.query.action === "fetch-reports") {
            try {
                const { code, email, provider } = req.query;

                // 유저가 신고한 리포트 전부 가져오기
                const reports = await prisma.fontsUserReport.findMany({
                    where: {
                        report_user_email: email as string,
                        report_user_auth: provider as string,
                        report_font_code: Number(code),
                    }
                });

                return res.status(200).json({
                    msg: "신고 불러오기 성공",
                    reports: reports,
                });
            } catch (err) {
                return res.status(500).json({
                    err: err,
                    msg: "신고 불러오기 실패"
                });
            }
        }
    }
}