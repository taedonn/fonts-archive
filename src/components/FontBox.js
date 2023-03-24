import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DummyText from "./DummyText";

function FontBox({data}) {
    const [num, setNum] = useState(12);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if ((window.scrollY + window.innerHeight) === document.body.offsetHeight) { setNum(num + 12); }
        });
    });

    // 폰트 박스 클릭 시 윈도우 맨위로 이동
    const boxOnClick = () => { window.scrollTo(0,0); }

    return (
        <>
            <div className="font_area_wrap">
                {
                    data.slice(0,num).map((dataEach) => (
                        <Link className="font_box fade_in" onClick={boxOnClick} to={`/fonts-archive/DetailPage/${dataEach.c[0].v}`} key={dataEach.c[0].v}>
                            <div className="font_name">{dataEach.c[1].v}</div>
                            <div className="type_face">{dataEach.c[3].v}</div>
                            <div className="font_text" style={{fontFamily:dataEach.c[2].v}}><DummyText lang={dataEach.c[17].v}/></div>
                            <link href={dataEach.c[8].v} rel="stylesheet" itemProp="url"/>
                        </Link>
                    ))
                }
                <div className="font_box_empty"></div>
            </div>
        </>
    )
}

export default FontBox;