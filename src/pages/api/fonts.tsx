import { NextApiRequest, NextApiResponse } from "next";
import client from "../../components/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await client.fonts.findMany({});

    res.json({
        data
    });
}