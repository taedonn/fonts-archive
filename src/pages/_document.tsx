// 서버로 요청이 들어왔을 때 _app.tsx 다음으로 실행되는 component

// next
import Document, { Head, Html, Main, NextScript } from "next/document";

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

        if (getCookie("theme") === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-color-scheme", "dark");
        }
        else {
          document.documentElement.classList.remove("dark");
          document.documentElement.setAttribute("data-color-scheme", "light");
        }
    })();
`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head>
          {/* Icons */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
            type="text/css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css"
            type="text/css"
          />

          {/* Naver Site Verification */}
          <meta
            name="naver-site-verification"
            content="024c9dabcc1f9744c1804786ed5ed6b481391f3a"
          />

          {/* Google AdSense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7819549426971576"
            crossOrigin="anonymous"
          ></script>

          {/* Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                                    page_path: window.location.pathname,
                                });
                            `,
            }}
          />
        </Head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <body className="font-sans absolute w-full min-h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
