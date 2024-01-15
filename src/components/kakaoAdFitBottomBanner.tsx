import React, { useEffect, useRef } from 'react';

const defaultKakaoAdFitBottomBanner = {
    marginTop: 0,
    marginBottom: 0,
}

interface KakaoAdFitBottomBanner {
    marginTop?: number,
    marginBottom?: number,
}

function KakaoAdFitBottomBanner({
    marginTop=defaultKakaoAdFitBottomBanner.marginTop,
    marginBottom=defaultKakaoAdFitBottomBanner.marginBottom,
}: KakaoAdFitBottomBanner) {
    // 최초 1회만 광고를 불러오기 위한 변수
    const adRef = useRef<boolean>(false);

    useEffect(() => {
        // 로딩된 광고가 있으면, 추가 로딩 X
        if (adRef.current) return;

        const ins = document.createElement('ins');
        const script = document.createElement('script');

        ins.className = 'kakao_ad_area';
        ins.style.display = 'none;';

        const windowSize = window.innerWidth;
        if (windowSize < 1024) {
            ins.setAttribute('data-ad-width', '320');
            ins.setAttribute('data-ad-height', '100');
            ins.setAttribute('data-ad-unit', 'DAN-i74cAINlzifEFWxH');
        } else {
            ins.setAttribute('data-ad-width', '728');
            ins.setAttribute('data-ad-height', '90');
            ins.setAttribute('data-ad-unit', 'DAN-RGGxOLqLPc0Xouyi');
        }

        script.async = true;
        script.type = 'text/javascript';
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

        document.querySelector('.aside__kakaoAdFit_bottom')?.appendChild(ins);
        document.querySelector('.aside__kakaoAdFit_bottom')?.appendChild(script);
        
        // 광고 로딩 여부 상태 변경
        adRef.current = true;
    }, [marginTop, marginBottom]);

    return <aside style={{marginTop: marginTop + "px", marginBottom: marginBottom + "px"}} className="aside__kakaoAdFit_bottom relative"></aside>
}

export default React.memo(KakaoAdFitBottomBanner);