import { Link, useParams, Navigate } from "react-router-dom";
import SideMenu from './SideMenu';
import DummyText from './DummyText';

const alphabet = '가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 가 나 다 라 마 바 사 아 자 차 카 타 파 하 a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9'

function DetailPage(props) {
    const { id } = useParams();

    // 웹 폰트 적용하기 복사 버튼 클릭 이벤트
    const copyOnClick = (e) => {
        window.navigator.clipboard.writeText(document.getElementsByClassName('code')[e.target.id].getElementsByTagName('pre')[0].innerText);

        document.getElementsByClassName('copy_btn')[e.target.id].style.display = 'none';
        document.getElementsByClassName('copy_chk_btn')[e.target.id].style.display = 'block';
        setTimeout(function() {
            document.getElementsByClassName('copy_btn')[e.target.id].style.display = 'block';
            document.getElementsByClassName('copy_chk_btn')[e.target.id].style.display = 'none';
        },1500);
    }

    const detailTextChange = (e) => {
        let detailTextArea = document.getElementsByClassName('font_weight_txt');
        for (let i = 0; i < detailTextArea.length; i++) { detailTextArea[i].innerText = e.target.value; }
    }

    return (
        <>
            {
                props.data[id] === undefined
                ? <Navigate replace to='/fonts-archive'/>
                : <>
                    <SideMenu data={props.data}/>
                    <div className="font_detail_page_wrap">
                        <link href={props.data[id].c[12].v} rel="stylesheet" itemProp="url"/>
                        <Link to={'/fonts-archive/'}><svg className="close_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg></Link>
                        <div className="font_name">{props.data[id].c[1].v}</div>
                        <div className="font_source"><span>제작</span>{props.data[id].c[4].v}</div>
                        <div className="type_face"><span>형태</span>{props.data[id].c[3].v}</div>
                        <div className="font_detail_page_divider"></div>
                        <div className="font_detail_page">
                            <div className="download_btn_wrap">
                                <a className="source_btn" href={props.data[id].c[6].v} style={{borderColor:props.data[id].c[5].v,color:props.data[id].c[5].v}} target="_blank" rel="noopener noreferrer">원본 페이지로 이동</a>
                                <a className="download_btn" href={props.data[id].c[7].v} target="_blank" rel="noopener noreferrer">폰트 다운로드</a>
                            </div>
                            <p className="font_detail_page_title">웹 폰트 사용하기</p>
                            <div className="cdn_wrap">
                                <input type="radio" id="cdn_css" name="cdn" defaultChecked/>
                                <label htmlFor="cdn_css">CSS 설정하기</label>
                                <input type="radio" id="cdn_link" name="cdn"/>
                                <label htmlFor="cdn_link">link 방식</label>
                                <input type="radio" id="cdn_import" name="cdn"/>
                                <label htmlFor="cdn_import">import 방식</label>
                                <input type="radio" id="cdn_url" name="cdn"/>
                                <label htmlFor="cdn_url">font-face 방식</label>
                                <div className="cdn_code_wrap">
                                    <div className="cdn_code cdn_code_css">
                                        <div className="code"><pre>{props.data[id].c[8].v}</pre></div>
                                        <svg className="copy_btn" id="0" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                        <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                    </div>
                                    <div className="cdn_code cdn_code_link">
                                        <div className="code"><pre>&#60;{props.data[id].c[9].v}</pre></div>
                                        <svg className="copy_btn" id="1" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                        <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                    </div>
                                    <div className="cdn_code cdn_code_import">
                                        <div className="code"><pre>{props.data[id].c[10].v}</pre></div>
                                        <svg className="copy_btn" id="2" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                        <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                    </div>
                                    <div className="cdn_code cdn_code_font_face">
                                        <div className="code"><pre>{props.data[id].c[11].v}</pre></div>
                                        <svg className="copy_btn" id="3" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                        <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <p className="font_detail_page_title">폰트 두께</p>
                            <div className="font_weight_wrap">
                                <input className="font_weight_change" type="text" placeholder="Type Something" onChange={detailTextChange}/>
                                {
                                    props.data[id].c[13].v === "Y"
                                    ? <><div className="font_weight_title">Light 300</div><div className="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"300"}}><DummyText lang={props.data[id].c[18].v}/></div></>
                                    : <></>
                                }
                                {
                                    props.data[id].c[14].v === "Y"
                                    ? <><div className="font_weight_title">Regular 400</div><div className="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"400"}}><DummyText lang={props.data[id].c[18].v}/></div></>
                                    : <></>
                                }
                                {
                                    props.data[id].c[15].v === "Y"
                                    ? <><div className="font_weight_title">Medium 500</div><div className="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"500"}}><DummyText lang={props.data[id].c[18].v}/></div></>
                                    : <></>
                                }
                                {
                                    props.data[id].c[16].v === "Y"
                                    ? <><div className="font_weight_title">Bold 700</div><div className="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"700"}}><DummyText lang={props.data[id].c[18].v}/></div></>
                                    : <></>
                                }
                                {
                                    props.data[id].c[17].v === "Y"
                                    ? <><div className="font_weight_title">ExtraBold 800</div><div className="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"800"}}><DummyText lang={props.data[id].c[18].v}/></div></>
                                    : <></>
                                }
                            </div>
                            <p className="font_detail_page_title">폰트 크기</p>
                            <div className="font_size_wrap">
                                <div><h2>10px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_10">{alphabet}</h3></div>
                                <div><h2>12px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_12">{alphabet}</h3></div>
                                <div><h2>14px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_14">{alphabet}</h3></div>
                                <div><h2>16px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_16">{alphabet}</h3></div>
                                <div><h2>18px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_18">{alphabet}</h3></div>
                                <div><h2>20px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_20">{alphabet}</h3></div>
                                <div><h2>24px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_24">{alphabet}</h3></div>
                                <div><h2>28px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_28">{alphabet}</h3></div>
                                <div><h2>32px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_32">{alphabet}</h3></div>
                                <div><h2>36px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_36">{alphabet}</h3></div>
                                <div><h2>40px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_40">{alphabet}</h3></div>
                                <div><h2>48px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_48">{alphabet}</h3></div>
                                <div><h2>56px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_56">{alphabet}</h3></div>
                                <div><h2>64px</h2><h3 style={{fontFamily:props.data[id].c[2].v}} className="font_size_64">{alphabet}</h3></div>
                            </div>
                            <p className="font_detail_page_title">라이센스 사용 범위</p>
                            <table className="license">
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
                                                props.data[id].c[19].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[19].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[19].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[19].v[0] === "Q"
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
                                                props.data[id].c[19].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[19].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[19].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[19].v[1] === "Q"
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
                                                props.data[id].c[19].v[2] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[19].v[2] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[19].v[2] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[19].v[2] === "Q"
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
                                                props.data[id].c[19].v[3] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[19].v[3] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[19].v[3] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[19].v[3] === "Q"
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
                                                props.data[id].c[19].v[4] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[19].v[4] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[19].v[4] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[19].v[4] === "Q"
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
                                                props.data[id].c[20].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[20].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[20].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[20].v[0] === "Q"
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
                                                props.data[id].c[20].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[20].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[20].v[1] === "R"
                                                       ? <>권장</>
                                                        : ( props.data[id].c[20].v[1] === "Q"
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
                                                props.data[id].c[21].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[21].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[21].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[21].v[0] === "Q"
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
                                                props.data[id].c[21].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[21].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[21].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[21].v[1] === "Q"
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
                                                props.data[id].c[21].v[2] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[21].v[2] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[21].v[2] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[21].v[2] === "Q"
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
                                                props.data[id].c[21].v[3] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[21].v[3] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[21].v[3] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[21].v[3] === "Q"
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
                                                props.data[id].c[21].v[4] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[21].v[4] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[21].v[4] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[21].v[4] === "Q"
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
                                                props.data[id].c[22].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[22].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[22].v === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[22].v === "Q"
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
                                                props.data[id].c[23].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[23].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[23].v === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[23].v === "Q"
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
                                                props.data[id].c[24].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[24].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[24].v === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[24].v === "Q"
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
                                                props.data[id].c[25].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[25].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[25].v[0] === "R"
                                                       ? <>권장</>
                                                        : ( props.data[id].c[25].v[0] === "Q"
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
                                                props.data[id].c[25].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[25].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[25].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[25].v[1] === "Q"
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
                                                props.data[id].c[26].v[0] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[26].v[0] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[26].v[0] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[26].v[0] === "Q"
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
                                                props.data[id].c[26].v[1] === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[26].v[1] === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[26].v[1] === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[26].v[1] === "Q"
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
                                                props.data[id].c[27].v === "Y"
                                                ? <svg className="y_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/></svg>
                                                : ( props.data[id].c[27].v === "N"
                                                    ? <div style={{color:"#C30010"}}>금지</div>
                                                    : ( props.data[id].c[27].v === "R"
                                                        ? <>권장</>
                                                        : ( props.data[id].c[27].v === "Q"
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