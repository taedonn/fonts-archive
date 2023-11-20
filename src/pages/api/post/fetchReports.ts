import prisma from '@/libs/client-prisma';
  
export async function FetchReports(code: number, user_no: number) {
    // 해당 폰트 상세페이지에 쓰인 댓글 전부 가져오기
    const comments: any = await prisma.fontsComment.findMany({
        where: {
            font_id: code,
            is_deleted: false
        }
    });

    // 유저가 신고한 리포트 전부 가져오기
    const userReports: any = await prisma.fontsUserReport.findMany({
        where: { report_user_id: user_no }
    });

    // 댓글과 리포트 비교 후 신고한 리포트 가져오기
    let reportArr: any[] = [];
    userReports.forEach((userReport: any) => {
        comments.forEach((comment: any) => {
            if (userReport.comment_id === comment.comment_id) {
                reportArr.push(comment.comment_id)
            }
        });
    });

    return reportArr;
}