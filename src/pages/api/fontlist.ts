import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 최대 폰트 로딩 개수
        const limit = 20;

        // 쿼리
        const { user_id, license, searchword, filter } = req.query;

        // 정렬 조건에 맞게 Sorting
        const lang: string | object = req.query.lang === 'kr' ? 'KR' : (req.query.lang === 'en' ? 'EN' : {});
        const type: string | object = req.query.type === 'sans-serif' ? 'Sans Serif' : (req.query.type === 'serif' ? 'Serif' : (req.query.type === 'hand-writing' ? 'Hand Writing' : (req.query.type === 'display' ? 'Display' : (req.query.type === 'pixel' ? 'Pixel' : {}))));
        const sort: object[] = req.query.sort === 'like' ? [{ like: 'desc' },{ name: 'asc' }] : req.query.sort === 'view' ? [{ view: 'desc' },{ name: 'asc' }] : req.query.sort === 'date' ? [{ code: 'desc' }] : [{ lang: 'desc' },{ name: 'asc' }];
        
        // refetching 시 새로 추가될 데이터에서 기준이 될 마지막 폰트
        const cursor = req.query.id ?? '';
        const cursorObj: any = cursor === '' ? undefined : { code: parseInt(cursor as string, 10) };

        // 라이센스 필터링
        const licenseFilter = [];
        if (license === "print") { licenseFilter.push({ license_print: "Y" }); }
        else if (license === "web") { licenseFilter.push({ license_web: "Y" }); }
        else if (license === "video") { licenseFilter.push({ license_video: "Y" }); }
        else if (license === "package") { licenseFilter.push({ license_package: "Y" }); }
        else if (license === "embed") { licenseFilter.push({ license_embed: "Y" }); }
        else if (license === "bici") { licenseFilter.push({ license_bici: "Y" }); }
        else if (license === "ofl") { licenseFilter.push({ license_ofl: "Y" }); }

        const fonts = await prisma.fonts.findMany({
            where: {
                AND: licenseFilter,
                OR: [
                    { name: { contains: searchword as string } },
                    { source: { contains: searchword as string } },
                    { font_family: { contains: searchword as string } },
                ],
                lang: lang,
                font_type: type,
                show_type: true,
                liked_user: user_id && filter === "liked"
                    ? { some: { user_id: Number(user_id) } }
                    : {}
            },
            include: {
                liked_user: true,
            },
            orderBy: sort, // 정렬순
            take: limit, // 가져오는 데이터 수
            skip: cursor !== '' ? 1 : 0, // 건너뛸 데이터 수
            cursor: cursorObj // 불러온 마지막 데이터의 ID값
        });

        return res.json({
            fonts,
            nextId: fonts.length === limit ? fonts[limit - 1].code : undefined,
            sort: sort
        });
    }
}