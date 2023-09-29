import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/client-prisma";

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
    
        const fonts: any = await prisma.fonts.findMany({
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