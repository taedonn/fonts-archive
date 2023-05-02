// 훅
import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

// 컴포넌트
import SideMenu from './SideMenu';
import DummyText from './DummyText';

const alphabetKR = '가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9';
const alphabetEN = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9';

const urlString = window.location.href.split('DetailPage/')[1];

function DetailPage(props) {
    // URL에서 id값 추출하는 훅
    const { id } = useParams();

    const defaultWebFont = "CSS";
    const [webFont, setWebFont] = useState(defaultWebFont);
    useEffect(() => {
        setWebFont(defaultWebFont);
    },[]);

    // 웹 폰트 적용하기 복사 버튼 클릭 이벤트
    const copyOnClick = (e) => {
        window.navigator.clipboard.writeText(document.getElementsByClassName('code_' + e.target.id)[0].getElementsByTagName('pre')[0].innerText);

        document.getElementsByClassName('copy_btn')[0].style.display = 'none';
        document.getElementsByClassName('copy_chk_btn')[0].style.display = 'block';
        setTimeout(function() {
            document.getElementsByClassName('copy_btn')[0].style.display = 'block';
            document.getElementsByClassName('copy_chk_btn')[0].style.display = 'none';
        },1000);
    }

    // 문구 변경 시 폰트 두께 별 문구도 변경
    const detailTextChange = (e) => {
        let detailTextArea = document.getElementsByClassName('font_weight_txt');
        for (let i = 0; i < detailTextArea.length; i++) {
            if (e.target.value === "") {
                if (detailTextArea[i].id === "KR") { detailTextArea[i].innerText = "원하는 문구를 적어보세요."; }
                else { detailTextArea[i].innerText = "Type something."; }
            }
            else { detailTextArea[i].innerText = e.target.value; }
        }
    }

    // 웹 폰트 클릭 시 코드 변경
    const handleWebFont = (e) => {
        if (e.target.value === "CSS") { setWebFont("CSS"); }
        else if (e.target.value === "link") { setWebFont("link"); }
        else if (e.target.value === "import") { setWebFont("import"); }
        else { setWebFont("url"); }
    }

    return (
        <>
            {
                props.fixedDataByLatest[id] === undefined
                ? props.fixedDataByLatest[id] === urlString
                : <>
                    {window.scrollTo(0,0)}
                    {document.title = props.fixedDataByLatest[id].c[1].v + " · FONTS ARCHIVE"}
                    <SideMenu data={props.fixedDataByName}/>
                    <div className="font_detail_page_wrap">
                        <link href={props.fixedDataByLatest[id].c[12].v} rel="stylesheet" itemProp="url"/>
                        <Link to={'/'}><svg className="close_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg></Link>
                        <div className="font_name" style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}}>{props.fixedDataByLatest[id].c[1].v}</div>
                        <div className="font_source"style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}}><span>제작</span>{props.fixedDataByLatest[id].c[4].v}</div>
                        <div className="type_face"style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}}><span>형태</span>{props.fixedDataByLatest[id].c[3].v === "Sans Serif" ? "고딕" : (props.fixedDataByLatest[id].c[3].v === "Serif" ? "명조" : (props.fixedDataByLatest[id].c[3].v === "Hand Writing") ? "손글씨" : "장식체")}</div>
                        <div className="font_detail_page_divider"></div>
                        <div className="font_detail_page">
                            <div className="download_btn_wrap">
                                <a className="source_btn" href={props.fixedDataByLatest[id].c[6].v} target="_blank" rel="noopener noreferrer">다운로드 페이지로 이동</a>
                                <a className="download_btn" href={props.fixedDataByLatest[id].c[7].v} target="_blank" rel="noopener noreferrer">폰트 다운로드</a>
                            </div>
                            {
                                props.fixedDataByLatest[id].c[27].v === "N"
                                ? <></>
                                : <>
                                    <p className="font_detail_page_title">웹 폰트 사용하기</p>
                                    <div className="cdn_wrap">
                                        <input type="radio" id="cdn_css" name="cdn" value="CSS" onChange={handleWebFont} defaultChecked/>
                                        <label htmlFor="cdn_css">CSS 설정하기</label>
                                        <input type="radio" id="cdn_link" name="cdn" value="link" onChange={handleWebFont}/>
                                        <label htmlFor="cdn_link">link 방식</label>
                                        <input type="radio" id="cdn_import" name="cdn" value="import" onChange={handleWebFont}/>
                                        <label htmlFor="cdn_import">import 방식</label>
                                        <input type="radio" id="cdn_url" name="cdn" value="url" onChange={handleWebFont}/>
                                        <label htmlFor="cdn_url">font-face 방식</label>
                                        <div className="cdn_code_wrap">
                                            {
                                                webFont === "CSS"
                                                ? <div className="cdn_code cdn_code_css">
                                                    <div className="code_css"><pre>{props.fixedDataByLatest[id].c[8].v}</pre></div>
                                                    <svg className="copy_btn" id="css" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                    <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                </div>
                                                : ( webFont === "link"
                                                    ? <div className="cdn_code cdn_code_link">
                                                        <div className="code_link"><pre>&#60;{props.fixedDataByLatest[id].c[9].v}</pre></div>
                                                        <svg className="copy_btn" id="link" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                        <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                    </div>
                                                    : ( webFont === "import"
                                                        ? <div className="cdn_code cdn_code_import">
                                                            <div className="code_import"><pre>{props.fixedDataByLatest[id].c[10].v}</pre></div>
                                                            <svg className="copy_btn" id="import" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                            <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                        </div>
                                                        : <div className="cdn_code cdn_code_font_face">
                                                            <div className="code_url"><pre>{props.fixedDataByLatest[id].c[11].v}</pre></div>
                                                            <svg className="copy_btn" id="url" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                                            <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                </>
                            }
                            <p className="font_detail_page_title">폰트 두께</p>
                            <div className="font_weight_wrap">
                                <input className="font_weight_change" type="text" placeholder="Type Something" onChange={detailTextChange}/>
                                {
                                    props.fixedDataByLatest[id].c[13].v === "Y"
                                    ? <><div className="font_weight_title">Thin 100</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"100"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[14].v === "Y"
                                    ? <><div className="font_weight_title">ExtraLight 200</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"200"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[15].v === "Y"
                                    ? <><div className="font_weight_title">Light 300</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"300"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[16].v === "Y"
                                    ? <><div className="font_weight_title">Regular 400</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"400"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[17].v === "Y"
                                    ? <><div className="font_weight_title">Medium 500</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"500"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[18].v === "Y"
                                    ? <><div className="font_weight_title">Bold 600</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"600"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[19].v === "Y"
                                    ? <><div className="font_weight_title">ExtraBold 700</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"700"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[20].v === "Y"
                                    ? <><div className="font_weight_title">Heavy 800</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"800"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                                {
                                    props.fixedDataByLatest[id].c[21].v === "Y"
                                    ? <><div className="font_weight_title">Black 900</div><div className="font_weight_txt" id={props.fixedDataByLatest[id].c[22].v} style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'",fontWeight:"900"}}><DummyText lang={props.fixedDataByLatest[id].c[22].v} text={""}/></div></>
                                    : <></>
                                }
                            </div>
                            <p className="font_detail_page_title">폰트 크기</p>
                            <div className="font_size_wrap">
                                <div><h2>10px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_10">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>12px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_12">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>14px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_14">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>16px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_16">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>18px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_18">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>20px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_20">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>24px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_24">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>28px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_28">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>32px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_32">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>36px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_36">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>40px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_40">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>48px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_48">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>56px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_56">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                                <div><h2>64px</h2><h3 style={{fontFamily:"'"+props.fixedDataByLatest[id].c[2].v+"'"}} className="font_size_64">{props.fixedDataByLatest[id].c[22].v === "KR" ? alphabetKR : alphabetEN}</h3></div>
                            </div>
                            <p className="font_detail_page_title">라이센스 사용 범위</p>
                            {
                                props.fixedDataByLatest[id].c[32].v === null
                                ? <></>
                                : <>
                                    <pre className='license'>{props.fixedDataByLatest[id].c[32].v}</pre>
                                </>
                            }
                            <table>
                                <thead>
                                    <tr>
                                        <th>카테고리</th>
                                        <th>사용 범위</th>
                                        <th>허용 여부</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td rowSpan={5}>인쇄</td>
                                        <td>브로슈어, 카탈로그, DM, 전단지, 포스터, 패키지, 캘린더 등 인쇄물</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[23].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[23].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[23].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[23].v[0] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>책, 만화책, 잡지, 정기간행물, 신문 등 출판물</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[23].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[23].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[23].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[23].v[1] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>간판, 현수막, 판넬 등 제작물</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[23].v[2] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[23].v[2] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[23].v[2] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[23].v[2] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>신문광고, 잡지광고, 차량광고 등 광고물</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[23].v[3] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[23].v[3] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[23].v[3] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[23].v[3] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>인쇄 및 문서 공유를 위한 PDF 파일 제작</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[23].v[4] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[23].v[4] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[23].v[4] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[23].v[4] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">웹사이트</td>
                                        <td>웹페이지, 광고 배너, 메일, E-브로슈어 등</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[24].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[24].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[24].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[24].v[0] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>웹서버용 폰트</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[24].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[24].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[24].v[1] === "R"
                                                       ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[24].v[1] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="5">영상</td>
                                        <td>방송 및 영상물 자막</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[25].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[25].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[25].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[25].v[0] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>TV-CF, 온라인 영상광고</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[25].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[25].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[25].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[25].v[1] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>영화(DVD / 비디오), 오프닝, 엔딩크레딧 자막</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[25].v[2] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[25].v[2] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[25].v[2] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[25].v[2] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>개인 UCC 및 홍보물</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[25].v[3] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[25].v[3] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[25].v[3] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[25].v[3] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>E-Learning 콘텐츠, 온라인 동영상강좌, 플래시 강좌</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[25].v[4] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[25].v[4] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[25].v[4] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[25].v[4] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>포장지</td>
                                        <td>판매용 상품의 패키지</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[26].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[26].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[26].v === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[26].v === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>임베딩</td>
                                        <td>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[27].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[27].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[27].v === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[27].v === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>BI/CI</td>
                                        <td>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[28].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[28].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[28].v === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[28].v === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">OFL</td>
                                        <td>폰트 파일의 수정, 편집 및 재배포</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[29].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[29].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[29].v[0] === "R"
                                                       ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[29].v[0] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>폰트 파일의 유료 판매</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[29].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[29].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[29].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[29].v[1] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan="2">용도</td>
                                        <td>개인적 용도 사용</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[30].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[30].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[30].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[30].v[0] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>상업적 용도 사용</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[30].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[30].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[30].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[30].v[1] === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>출처</td>
                                        <td>출처 표시</td>
                                        <td>
                                            {
                                                props.fixedDataByLatest[id].c[31].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.fixedDataByLatest[id].c[31].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.fixedDataByLatest[id].c[31].v === "R"
                                                        ? <>권장</>
                                                        : ( props.fixedDataByLatest[id].c[31].v === "Q"
                                                            ? <div style={{color:"#C30010"}}>문의</div>
                                                            : <></>
                                                        )
                                                    )
                                                )
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default DetailPage;