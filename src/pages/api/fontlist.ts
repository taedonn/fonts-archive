import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/libs/client';

export type fonts = {
    code: number
    name: string
    lang: string
    date: string
    source: string
    font_family: string
    font_type: string
    cdn_url: string
}
  
export interface data {
    fonts: fonts[]
    nextId: number | undefined
}
  
export default async function handler(req: NextApiRequest, res: NextApiResponse<data>) {
    if (req.method === 'GET') {
        const limit = 24
        const sort: object = req.query.sort === 'date' ? { date: 'desc' } : { name: 'desc' }
        const cursor = req.query.id ?? ''
        const cursorObj: object | undefined = cursor === '' ? undefined : { code: parseInt(cursor as string, 10) }

        const fonts = await client.fonts.findMany({
            select: { // 특정 column 선택
                code: true,
                name: true,
                lang: true,
                date: true,
                source: true,
                font_family: true,
                font_type: true,
                cdn_url: true,
            },
            orderBy: [ // 정렬
                sort
            ],
            take: limit, // 가져오는 데이터 수
            skip: cursor !== '' ? 1 : 0, // 건너뛸 데이터 수
            cursor: cursorObj, // 불러온 마지막 데이터의 ID값
        })
        return res.json({ fonts, nextId: fonts.length === limit ? fonts[limit - 1].code : undefined })
    }
}