// 서버로 요청이 들어왔을 때 _app.tsx 다음으로 실행되는 component

// next hooks
import Document, { Html, Head, Main, NextScript } from "next/document";

// components
import Footer from "@/components/footer";

const themeInitializerScript = `
    (function () {
        function getCookie(cookieName){
            var cookieValue=null;
            if(document.cookie){
                var array=document.cookie.split((escape(cookieName)+'='));
                if(array.length >= 2){
                    var arraySub=array[1].split(';');
                    cookieValue=unescape(arraySub[0]);
                }
            }
            return cookieValue;
        }

        if (getCookie("theme") === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            document.documentElement.classList.add("dark");
        }
    })();
`;

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ko">
                <Head>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/SpoqaHanSansNeo/SpoqaHanSansNeo.css" type="text/css"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" type="text/css"></link>

                    {/* Google AdSense */}
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7819549426971576" crossOrigin="anonymous"></script>
                </Head>
                <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }}/>
                <body style={{fontFamily: "Spoqa Han Sans Neo, Noto Sans KR"}} className="relative min-h-[calc(100vh-60px)] tlg:min-h-[calc(100vh-52px)] px-[32px] tlg:px-[16px] pb-[88px] tlg:pb-[76px]">
                    <Main/>
                    <NextScript/>
                    <Footer/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;