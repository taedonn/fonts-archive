import { useParams } from "react-router-dom";
import SideMenu from './SideMenu';
import DummyText from './DummyText';

function DetailPage(props) {
    const { id } = useParams()

    // 웹 폰트 적용하기 복사 버튼 클릭 이벤트
    const copyOnClick = (e) => {
        window.navigator.clipboard.writeText(document.getElementsByClassName('code')[e.target.id].innerText);

        document.getElementsByClassName('copy_btn')[e.target.id].style.display = 'none';
        document.getElementsByClassName('copy_chk_btn')[e.target.id].style.display = 'block';
        setTimeout(function() {
            document.getElementsByClassName('copy_btn')[e.target.id].style.display = 'block';
            document.getElementsByClassName('copy_chk_btn')[e.target.id].style.display = 'none';
        },1500)
    }

    return (
        <>
            <SideMenu data={props.data}/>
            <div className="font_detail_page_wrap">
                <div className="font_name">{props.data[id].c[1].v}</div>
                <div className="type_face">{props.data[id].c[3].v}</div>
                <div className="font_detail_page_divider"></div>
                <div className="font_detail_page">
                    <div className="download_btn_wrap">
                        <a className="source_btn" href={props.data[id].c[6].v} style={{borderColor:props.data[id].c[5].v,color:props.data[id].c[5].v}} target="_blank" rel="noopener noreferrer">{props.data[id].c[4].v} 방문하기</a>
                        <a className="download_btn" href={props.data[id].c[7].v}>폰트 다운로드</a>
                    </div>
                    <p className="font_detail_page_title">웹 폰트 사용하기</p>
                    <div className="cdn_wrap">
                        <input type="radio" id="cdn_css" name="cdn" defaultChecked/>
                        <label htmlFor="cdn_css">CSS 설정하기</label>
                        <input type="radio" id="cdn_link" name="cdn"/>
                        <label htmlFor="cdn_link">link 설정하기</label>
                        <input type="radio" id="cdn_import" name="cdn"/>
                        <label htmlFor="cdn_import">import 설정하기</label>
                        <input type="radio" id="cdn_url" name="cdn"/>
                        <label htmlFor="cdn_url">URL 설정하기</label>
                        <div className="cdn_code_wrap">
                            <div className="cdn_code cdn_code_css">
                                <div className="code">{props.data[id].c[9].v}</div>
                                <svg className="copy_btn" id="0" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                            <div className="cdn_code cdn_code_link">
                                <div className="code">{props.data[id].c[10].v}</div>
                                <svg className="copy_btn" id="1" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                            <div className="cdn_code cdn_code_import">
                                <div className="code">{props.data[id].c[11].v}</div>
                                <svg className="copy_btn" id="2" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                            <div className="cdn_code cdn_code_url">
                                <div className="code">{props.data[id].c[8].v}</div>
                                <svg className="copy_btn" id="3" onClick={copyOnClick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg className="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                        </div>
                    </div>
                    <p className="font_detail_page_title">폰트 두께</p>
                    <div className="font_weight_wrap">
                        {
                            props.data[id].c[12].v === "Y"
                            ? <><div class="font_weight_title">Light 300</div><div class="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"300"}}><DummyText/></div></>
                            : <></>
                        }
                        {
                            props.data[id].c[13].v === "Y"
                            ? <><div class="font_weight_title">Regular 400</div><div class="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"400"}}><DummyText/></div></>
                            : <></>
                        }
                        {
                            props.data[id].c[14].v === "Y"
                            ? <><div class="font_weight_title">Medium 500</div><div class="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"500"}}><DummyText/></div></>
                            : <></>
                        }
                        {
                            props.data[id].c[15].v === "Y"
                            ? <><div class="font_weight_title">Bold 700</div><div class="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"700"}}><DummyText/></div></>
                            : <></>
                        }
                        {
                            props.data[id].c[16].v === "Y"
                            ? <><div class="font_weight_title">ExtraBold 800</div><div class="font_weight_txt" style={{fontFamily:props.data[id].c[2].v,fontWeight:"800"}}><DummyText/></div></>
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPage;