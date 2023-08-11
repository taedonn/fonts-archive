import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client-prisma';
import { getSignedFileUrl } from '@/libs/client-s3';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // 쿼리 가져오기
            const userNo = req.query.userNo === undefined ? '' : req.query.userNo as string;

            var randomProfileImg = "/fonts-archive-base-profile-img-" + (Math.floor(Math.random() * 6) + 1) + ".svg";

            const userInfo = !!await client.fontsUser.updateMany({
                where: { user_no: Number(userNo) },
                data: { profile_img: randomProfileImg }
            });

            return res.status(200).send(userInfo ? 'Profile image deleted successfully.' : 'Profile image did not get deleted due to an error.');
        } catch (err) {
            return res.status(500).send(err);
        }
    } else if (req.method === "POST") {
        try {
            let { name, type } = JSON.parse(req.body);

            const fileParams = {
                name: name,
                type: type,
            }
            const signedUrl = await getSignedFileUrl(fileParams);

            return res.status(200).json({
                message: "file upload success.",
                url: signedUrl
            });
        } catch (err) {
            return res.status(500).json({
                message: "file upload failed."
            });
        }
    }
}