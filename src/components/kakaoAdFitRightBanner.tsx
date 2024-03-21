import React, { useEffect, useRef } from 'react';

const defaultKakaoAdFitRightBanner = {
    marginLeft: 0,
    marginRight: 0,
}

interface KakaoAdFitRightBanner {
    marginLeft?: number,
    marginRight?: number,
}

function KakaoAdFitRightBanner({
    marginLeft=defaultKakaoAdFitRightBanner.marginLeft,
    marginRight=defaultKakaoAdFitRightBanner.marginRight,
}: KakaoAdFitRightBanner) {
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
            ins.setAttribute('data-ad-unit', 'DAN-lb4lveZ8Vpr7LnNY');

            script.async = true;
            script.type = 'text/javascript';
            script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

            document.querySelector('.aside__kakaoAdFit_right')?.appendChild(ins);
            document.querySelector('.aside__kakaoAdFit_right')?.appendChild(script);
        }
        
        // 광고 로딩 여부 상태 변경
        adRef.current = true;
    }, [marginLeft, marginRight]);

    return <aside style={{marginLeft: marginLeft + "rem", marginRight: marginRight + "rem"}} className="aside__kakaoAdFit_right relative flex"></aside>
}

export default React.memo(KakaoAdFitRightBanner);