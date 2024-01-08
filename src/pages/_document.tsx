// 서버로 요청이 들어왔을 때 _app.tsx 다음으로 실행되는 component

// next
import Document, { Html, Head, Main, NextScript } from "next/document";

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

        if (getCookie("theme") === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    })();
`;

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ko">
                <Head>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/SpoqaHanSansNeo/SpoqaHanSansNeo.css" type="text/css"/>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" type="text/css"/>
                </Head>
                <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }}/>
                <body className="custom-lg-scrollbar font-sans absolute w-full min-h-full px-8 tlg:px-4 pt-[60px] tlg:pt-[52px] pb-[76px]">
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;