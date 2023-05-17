import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/client";

// export async function FetchFontSearch(keyword: string) {
//     const fonts = await client.fonts.findMany({
//         select: { // 특정 column 선택
//             code: true,
//             name: true,
//             source: true,
//             font_family: true,
//         },
//         where: {
//             OR: [
//                 { name: { contains: keyword } },
//                 { source: { contains: keyword } },
//                 { font_family: { contains: keyword } },
//             ]
//         }
//     });

//     return fonts;
// }

type fonts = {
    code: number
    name: string
    source: string
    font_family: string
}

interface data {
    fonts: fonts[]
}

export default async function FetchFontSearch (req: NextApiRequest, res: NextApiResponse<data>)  {
    if (req.method === "GET") {
        const keyword: string = req.query.keyword === undefined || req.query.keyword === "" ? "" : req.query.keyword as string;
    
        const fonts: any = await client.fonts.findMany({
            select: { // 특정 column 선택
                code: true,
                name: true,
                source: true,
                font_family: true,
            },
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { source: { contains: keyword } },
                    { font_family: { contains: keyword } },
                ]
            }
        });

        return res.json(fonts);
    }
}