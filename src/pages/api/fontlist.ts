import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/client-prisma';
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // 최대 폰트 로딩 개수
        const limit = 24;

        // 정렬 조건에 맞게 Sorting
        const lang: string | object = req.query.lang === 'kr' ? 'KR' : (req.query.lang === 'en' ? 'EN' : {});
        const type: string | object = req.query.type === 'sans-serif' ? 'Sans Serif' : (req.query.type === 'serif' ? 'Serif' : (req.query.type === 'hand-writing' ? 'Hand Writing' : (req.query.type === 'display' ? 'Display' : (req.query.type === 'pixel' ? 'Pixel' : {}))));
        const sort: object[] = req.query.sort === 'like' ? [{ like: 'desc' },{ name: 'asc' }] : req.query.sort === 'view' ? [{ view: 'desc' },{ name: 'asc' }] : req.query.sort === 'date' ? [{ code: 'desc' }] : [{ lang: 'desc' },{ name: 'asc' }];
        
        // refetching 시 새로 추가될 데이터에서 기준이 될 마지막 폰트
        const cursor = req.query.id ?? '';
        const cursorObj: any = cursor === '' ? undefined : { code: parseInt(cursor as string, 10) };

        // 검색 조건에 맞는 폰트 필터링
        const searchword: object[] = req.query.searchword === '' ? [{ name: { not: '' } }] : [{ name: { contains: req.query.searchword } },{ source: { contains: req.query.searchword } },{ font_family: { contains: req.query.searchword } }];

        // 좋아요 표시한 폰트 필터링
        let objArr: any = [];
        const filter: null | string = req.query.filter === '' ? null : req.query.filter as string;
        const filteredArr = filter === null ? null : filter.split(','); // [A,B,C]
        filteredArr === null ? null : filteredArr.forEach((arr: string) => objArr.push({ code: Number(arr) }));

        const fonts = await prisma.fonts.findMany({
            where: {
                OR: req.query.searchword !== '' ? searchword : req.query.filter !== '' ? objArr : [{ name: { not: '' } }],
                lang: lang,
                font_type: type,
                show_type: true,
            },
            orderBy: sort, // 정렬순
            take: limit, // 가져오는 데이터 수
            skip: cursor !== '' ? 1 : 0, // 건너뛸 데이터 수
            cursor: cursorObj, // 불러온 마지막 데이터의 ID값
        });

        // 총 개수 가져오기
        const total = await prisma.fonts.findMany({
            select: { code: true },
            where: {
                OR: req.query.searchword !== '' ? searchword : req.query.filter !== '' ? objArr : [{ name: { not: '' } }],
                lang: lang,
                font_type: type,
                show_type: true,
            },
        });

        return res.json({ 
            fonts, 
            nextId: fonts.length === limit ? fonts[limit - 1].code : undefined, sort: sort,
            total: total.length,
        });
    }
}