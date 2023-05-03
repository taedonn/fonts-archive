// 훅
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { throttle } from 'lodash';

// 컴포넌트
import DummyText from "./DummyText";

function FontBox(props) {
    // 데이터 훅
    const defaultNum = 12;
    const [num, setNum] = useState(defaultNum);

    // 뒤로가기 시 스크롤이 맨밑에 있을 때 데이터 추가
    useEffect(() => {
        const handleScrollPos = setInterval(() => {
            if (window.scrollY !== 0 && (window.scrollY + window.innerHeight) >= document.body.offsetHeight - (window.innerHeight * 0.1)) {
                setNum(defaultNum + 12);
                clearInterval(handleScrollPos);
            }
            else { clearInterval(handleScrollPos); }
        },200);
        return () => { clearInterval(handleScrollPos); }
    },[]);

    useEffect(() => {
        // 스크롤 이벤트
        window.addEventListener('scroll', throttledScroll);

        return () => {
            // 스크롤 이벤트 제거
            window.removeEventListener('scroll', throttledScroll);
        }
    });

    // 스크롤 이벤트
    const handleScroll = () => {
        // 셀렉트박스 스크롤 시 체크 해제
        let select1 = document.getElementById("category_1_select");
        let select2 = document.getElementById("category_2_select");
        let select3 = document.getElementById("category_3_select");
        if (select1 !== null) { select1.checked = false; }
        if (select2 !== null) { select2.checked = false; }
        if (select3 !== null) { select3.checked = false; }
        console.log("Y");

        if ((window.scrollY + window.innerHeight) >= document.body.offsetHeight - (window.innerHeight * 0.5)) { setNum(num + 12); }
    }

    const throttledScroll = throttle(handleScroll,1000)

    // 데이터 연동
    // const handleTypeFace = () => { setNum(num + 12); }

    return (
        <>
            <div className="font_area_wrap">
                {
                    props.sortby === "latest"
                    ? props.data.sort(function(a,b) { return b.c[0].v - a.c[0].v; }).slice(0,num).map((dataEach) => (
                        <Link className="font_box fade_in" to={`/DetailPage/${dataEach.c[0].v}`} state={{currentNum:num}} key={dataEach.c[0].v}>
                            <div className="font_name" style={{fontFamily:"'"+dataEach.c[2].v+"'",fontWeight:props.fontWeight}}>{dataEach.c[1].v}</div>
                            <div className='font_info_wrap'>
                                <div className="font_source" style={{fontFamily:"'"+dataEach.c[2].v+"'",fontWeight:props.fontWeight}}><span>by</span> {dataEach.c[4].v}</div>
                            </div>
                            <div className="font_divider"></div>
                            <div className="font_text" id={dataEach.c[22].v} style={{fontFamily:"'"+dataEach.c[2].v+"'",fontWeight:props.fontWeight}}><p><DummyText lang={dataEach.c[22].v} text={props.text}/></p></div>
                            <link href={dataEach.c[12].v} rel="stylesheet" type="text/css" itemProp="url"/>
                        </Link>
                    ))
                    : props.data.sort(function(a,b) { return a.c[1].v.localeCompare(b.c[1].v); }).slice(0,num).map((dataEach) => (
                        <Link className="font_box fade_in" to={`/DetailPage/${dataEach.c[0].v}`} state={{currentNum:num}} key={dataEach.c[0].v}>
                            <div className="font_name" style={{fontFamily:"'"+dataEach.c[2].v+"'",fontWeight:props.fontWeight}}>{dataEach.c[1].v}</div>
                            <div className='font_info_wrap'>
                                <div className="font_source" style={{fontFamily:"'"+dataEach.c[2].v+"'",fontWeight:props.fontWeight}}><span>by</span> {dataEach.c[4].v}</div>
                            </div>
                            <div className="font_divider"></div>
                            <div className="font_text" style={{fontFamily:"'"+dataEach.c[2].v+"'",fontWeight:props.fontWeight}}><p><DummyText lang={dataEach.c[22].v} text={props.text}/></p></div>
                            <link href={dataEach.c[12].v} rel="stylesheet" type="text/css" itemProp="url"/>
                        </Link>
                    ))
                }
                <div className="font_box_empty"></div>
            </div>
            {
                props.data.length > num
                ? <span className="loader"></span>
                : <><span className="no_loader"></span></>
            }
        </>
    )
}

export default FontBox;