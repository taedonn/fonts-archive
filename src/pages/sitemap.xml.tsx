import { FetchAllFonts } from "./api/admin/font";

function generateSiteMap(posts: any) {
    return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://fonts.taedonn.com/</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/notices</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/issue/font</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/issue/bug</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/user/login</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/user/terms</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/user/privacy</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/user/findpw</loc>
        </url>
        <url>
            <loc>https://fonts.taedonn.com/user/register</loc>
        </url>
        ${
            posts.map((font: any) => {
                return `
                    <url>
                        <loc>https://fonts.taedonn.com/post/${font.font_family.replaceAll(" ", "+")}</loc>
                    </url>
                `;
            }).join('')
        }
        </urlset>`;
}

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: any }) {
    // We make an API call to gather the URLs for our site
    const posts = await FetchAllFonts();

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(posts);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}
  
export default SiteMap;