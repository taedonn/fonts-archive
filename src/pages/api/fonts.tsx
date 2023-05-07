import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const fonts = await client.fonts.findMany({});

    res.json({
        fonts
    });
}