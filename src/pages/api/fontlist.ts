import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

type fonts = {
    code: number
    name: string
    lang: string
    date: string
    view: number
    source: string
    font_family: string
    font_type: string
    cdn_url: string
}
  
interface data {
    fonts: fonts[]
    nextId: number | undefined
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const limit = 24
        const thisQuery = req.query;
        const lang: string | object = thisQuery.lang === 'kr' ? 'KR' : (thisQuery.lang === 'en' ? 'EN' : {});
        const type: string | object = thisQuery.type === 'sans-serif' ? 'Sans Serif' : (thisQuery.type === 'serif' ? 'Serif' : (thisQuery.type === 'hand-writing' ? 'Hand Writing' : (thisQuery.type === 'display' ? 'Display' : (thisQuery.type === 'pixel' ? 'Pixel' : {}))));
        const sort: object[] = thisQuery.sort === 'view' ? [{ view: 'desc' },{ name: 'asc' }] : (thisQuery.sort === 'date' ? [{ code: 'desc' }] : [{ lang: 'desc' },{ name: 'asc' }]);
        const searchword: object[] = thisQuery.searchword === undefined || thisQuery.searchword === '' ? [{ name: { not: '' } }] : [{ name: { contains: thisQuery.searchword } },{ source: { contains: thisQuery.searchword } },{ font_family: { contains: thisQuery.searchword } }];
        const cursor = thisQuery.id ?? ''
        const cursorObj: object | undefined = cursor === '' ? undefined : { code: parseInt(cursor as string, 10) }

        const fonts = await client.fonts.findMany({
            select: { // 특정 column 선택
                code: true,
                name: true,
                lang: true,
                date: true,
                view: true,
                source: true,
                font_family: true,
                font_type: true,
                cdn_url: true,
            },
            where: {
                OR: searchword,
                lang: lang,
                font_type: type,
            },
            orderBy: sort,
            take: limit, // 가져오는 데이터 수
            skip: cursor !== '' ? 1 : 0, // 건너뛸 데이터 수
            cursor: cursorObj, // 불러온 마지막 데이터의 ID값
        })
        return res.json({ fonts, nextId: fonts.length === limit ? fonts[limit - 1].code : undefined })
    }
}