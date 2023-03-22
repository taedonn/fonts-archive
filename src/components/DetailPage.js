function DetailPage(props) {
    return (
        <>
            <div class="font_detail_page_wrap">
                <div class="font_detail_page">
                    <div class="download_btn_wrap">
                        <a class="source_btn" href={props.font_source_link} target="_blank" rel="noopener noreferrer">{props.font_source} 방문하기</a>
                        <a class="download_btn" href={props.zip_link}>폰트 다운로드</a>
                    </div>
                    <p class="font_detail_page_title">웹 폰트 사용하기</p>
                    <div class="cdn_wrap">
                        <input type="radio" id={"cdn_css_" + props.font_code} name={"cdn_" + props.font_code} defaultChecked/>
                        <label for={"cdn_css_" + props.font_code}>CSS 설정하기</label>
                        <input type="radio" id={"cdn_link_" + props.font_code} name={"cdn_" + props.font_code}/>
                        <label for={"cdn_link_" + props.font_code}>link 방식</label>
                        <input type="radio" id={"cdn_import_" + props.font_code} name={"cdn_" + props.font_code}/>
                        <label for={"cdn_import_" + props.font_code}>import 방식</label>
                        <input type="radio" id={"cdn_url_" + props.font_code} name={"cdn_" + props.font_code}/>
                        <label for={"cdn_url_" + props.font_code}>URL 방식</label>
                        <div class="cdn_code_wrap">
                            <div class="cdn_code cdn_code_css">
                                <div>{props.cdn_css}</div>
                                <svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                            <div class="cdn_code cdn_code_link">
                                <div>&#60;{props.cdn_link}</div>
                                <svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                            <div class="cdn_code cdn_code_import">
                                <div>{props.cdn_import}</div>
                                <svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                            <div class="cdn_code cdn_code_url">
                                <div>{props.head_link}</div>
                                <svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>
                                <svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                            </div>
                        </div>
                        <p class="font_detail_page_title">폰트 두께</p>
                        <div class="font_weight_wrap">
                            <input class="font_weight_change" type="text" value="'dummyText"/>
                        </div>
                        <p class="font_detail_page_title">라이센스 사용 범위</p>
                        <table class="license">
                            <tr>
                                <th>카테고리</th>
                                <th>사용 범위</th>
                                <th>허용 여부</th>
                            </tr>
                            <tr>
                                <td rowspan="5">인쇄</td>
                                <td>브로슈어, 카탈로그, DM, 전단지, 포스터, 패키지, 캘린더 등 인쇄물</td>
                                <td class="license_yn">{props.license_print}</td>
                            </tr>
                            <tr>
                                <td>책, 만화책, 잡지, 정기간행물, 신문 등 출판물</td>
                                <td class="license_yn">{props.license_print}</td>
                            </tr>
                            <tr>
                                <td>간판, 현수막, 판넬 등 제작물</td>
                                <td class="license_yn">{props.license_print}</td>
                            </tr>
                            <tr>
                                <td>신문광고, 잡지광고, 차량광고 등 광고물</td>
                                <td class="license_yn">{props.license_print}</td>
                            </tr>
                            <tr>
                                <td>인쇄 및 문서 공유를 위한 PDF 파일 제작</td>
                                <td class="license_yn">{props.license_print}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">웹사이트</td>
                                <td>웹페이지, 광고 배너, 메일, E-브로슈어 등</td>
                                <td class="license_yn">{props.license_web}</td>
                            </tr>
                            <tr>
                                <td>웹서버용 폰트</td>
                                <td class="license_yn">{props.license_web}</td>
                            </tr>
                            <tr>
                                <td rowspan="5">영상</td>
                                <td>방송 및 영상물 자막</td>
                                <td class="license_yn">{props.license_video}</td>
                            </tr>
                            <tr>
                                <td>TV-CF, 온라인 영상광고</td>
                                <td class="license_yn">{props.license_video}</td>
                            </tr>
                            <tr>
                                <td>영화(DVD / 비디오), 오프닝, 엔딩크레딧 자막</td>
                                <td class="license_yn">{props.license_video}</td>
                            </tr>
                            <tr>
                                <td>개인 UCC 및 홍보물</td>
                                <td class="license_yn">{props.license_video}</td>
                            </tr>
                            <tr>
                                <td>E-Learning 콘텐츠, 온라인 동영상강좌, 플래시 강좌</td>
                                <td class="license_yn">{props.license_video}</td>
                            </tr>
                            <tr>
                                <td>포장지</td>
                                <td>판매용 상품의 패키지</td>
                                <td class="license_yn">{props.license_package}</td>
                            </tr>
                            <tr>
                                <td>임베딩</td>
                                <td>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</td>
                                <td class="license_yn">{props.license_embedding}</td>
                            </tr>
                            <tr>
                                <td>BI/CI</td>
                                <td>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</td>
                                <td class="license_yn">{props.license_bici}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">OFL</td>
                                <td>폰트 파일의 수정, 편집 및 재배포</td>
                                <td class="license_yn">{props.license_ofl}</td>
                            </tr>
                            <tr>
                                <td>폰트 파일의 유료 판매</td>
                                <td class="license_yn">{props.license_ofl}</td>
                            </tr>
                            <tr>
                                <td rowspan="2">용도</td>
                                <td>폰트 파일의 수정, 편집 및 재배포</td>
                                <td class="license_yn">{props.license_purpose}</td>
                            </tr>
                            <tr>
                                <td>상업적 용도 사용</td>
                                <td class="license_yn">{props.license_purpose}</td>
                            </tr>
                            <tr>
                                <td>출처</td>
                                <td>출처 표시</td>
                                <td class="license_yn">{props.license_source}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailPage;