import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 쿼리 가져오기
        const action = req.query.action === undefined ? '' : req.query.action as string;
        const userNo = req.query.userNo === undefined ? '' : req.query.userNo as string;

        var userInfo;
        var randomProfileImg = "/fonts-archive-base-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg";

        if (action === 'change') { // action이 프로필 이미지 변경일 경우

        } else { // action이 프로필 이미지 삭제일 경우
            userInfo = await client.fontsUser.update({
                where: { user_no: Number(userNo) },
                data: { profile_img: randomProfileImg }
            });
        }

        return res.status(200).send(
            action === 'change' ? null :
            action === 'delete' && userInfo !== undefined ? randomProfileImg : null
        );
    }
}