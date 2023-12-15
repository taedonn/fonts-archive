import React, { useEffect, useRef } from 'react';

function KakaoAdFitTopBanner(props: any) {
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
            ins.setAttribute('data-ad-unit', 'DAN-S69UuSbs9M89VlPg');
            ins.setAttribute('style', `margin-top: ${props.marginTop}px`);
        } else {
            ins.setAttribute('data-ad-width', '728');
            ins.setAttribute('data-ad-height', '90');
            ins.setAttribute('data-ad-unit', 'DAN-8npqLjWDiQg99MCm');
            ins.setAttribute('style', `margin-top: ${props.marginTop}px`);
        }

        script.async = true;
        script.type = 'text/javascript';
        script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

        document.querySelector('.aside__kakaoAdFit_top')?.appendChild(ins);
        document.querySelector('.aside__kakaoAdFit_top')?.appendChild(script);
        
        // 광고 로딩 여부 상태 변경
        adRef.current = true;
    }, [props.marginTop]);

    return <aside className="aside__kakaoAdFit_top flex w-[100%] relative"></aside>
}

export default React.memo(KakaoAdFitTopBanner);