import React, { useEffect, useRef } from 'react';

const defaultKakaoAdFitLeftBanner = {
    marginLeft: 0,
    marginRight: 0,
}

interface KakaoAdFitLeftBanner {
    marginLeft?: number,
    marginRight?: number,
}

function KakaoAdFitLeftBanner({
    marginLeft=defaultKakaoAdFitLeftBanner.marginLeft,
    marginRight=defaultKakaoAdFitLeftBanner.marginRight,
}: KakaoAdFitLeftBanner) {
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
        if (windowSize >= 1024) {
            ins.setAttribute('data-ad-width', '160');
            ins.setAttribute('data-ad-height', '600');
            ins.setAttribute('data-ad-unit', 'DAN-waxiBIb3ZmDHApcV');

            script.async = true;
            script.type = 'text/javascript';
            script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

            document.querySelector('.aside__kakaoAdFit_left')?.appendChild(ins);
            document.querySelector('.aside__kakaoAdFit_left')?.appendChild(script);
        }
        
        // 광고 로딩 여부 상태 변경
        adRef.current = true;
    }, [marginLeft, marginRight]);

    return <aside style={{marginLeft: marginLeft + "rem", marginRight: marginRight + "rem"}} className="aside__kakaoAdFit_left relative flex"></aside>
}

export default React.memo(KakaoAdFitLeftBanner);