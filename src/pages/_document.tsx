// 서버로 요청이 들어왔을 때 _app.tsx 다음으로 실행되는 component

// 훅
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preload" href="https://cdn.jsdelivr.net/gh/fonts-archive/SpoqaHanSansNeo/SpoqaHanSansNeo.css" type="text/css"/>
                </Head>
                <body style={{fontFamily:"Spoqa Han Sans Neo"}} className="bg-dark-theme-2 expand">
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}

export default MyDocument;