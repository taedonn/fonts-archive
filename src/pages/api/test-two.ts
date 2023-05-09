import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

type fonts = {
    code: string
    name: string
}
  
interface Data {
    fontList: fonts[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const count = 5;
    // const { code } = req.query;
    // const isFirstPage = !code;

    const pageCondition: object = {
        skip: 1,
        // cursor: { id: code as string, },
    };

    const fonts: any = await client.fonts.findMany({
        take: count,
        // ...(!isFirstPage && pageCondition),
    });

    const length: number = fonts.length;
    res.status(200).json({ fontList: 0 < length ? fonts : undefined });
}