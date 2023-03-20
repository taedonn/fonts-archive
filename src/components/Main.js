import { useEffect } from 'react';
import '../css/Main.css';

// 더미 텍스트
const dummyText = '모든 국민은 성별·종교 또는 사회적 신분에 의하여 정치적, 경제적, 사회적, 문화적 생활의 모든 영역에 있어서 차별을 받지 아니한다.';
const dummyTextShort = '별빛이 별이 쓸쓸함과 까닭입니다. 까닭이요, 별 이름과, 말 딴은 된 봅니다.';

function Main() {
  useEffect(() => {
    // 브라잇 모드 / 나잇 모드
    document.body.classList.add('bright_mode');

    // 데이터 연동
    const base = 'https://docs.google.com/spreadsheets/d/1ryt-0PI5_hWA3AnP0gcyTRyKh8kqAooApts_cI0yhQ0/gviz/tq?';
    const sheetName = 'fonts';
    const query = 'Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W';
    const url = base + '&sheet=' + sheetName + '&tq=' + query;

    fetch(url)
        .then(res => res.text())
        .then(rep => {
          // JSON만 추출
          let data = JSON.parse(rep.substring(47).slice(0, -2));
          let item = data.table.rows;

          // 헤더에 폰트 링크 삽입
          for (let i = 1; i < item.length; i++) { document.head.innerHTML += '<link rel="stylesheet" href="'+item[i].c[9].v+'"/>' }

          // 메인에 폰트 박스 삽입
          document.getElementsByClassName('font_area_wrap')[0].innerHTML = '';
          for (let i = 1; i < item.length; i++) {
              document.getElementsByClassName('font_area_wrap')[0].innerHTML += 
              '<div class="font_box fade_in" data-num="'+(i+1)+'">'
                +'<div class="font_name">'+item[i].c[1].v+'</div>'
                +'<div class="type_face">'+item[i].c[4].v+'</div>'
                +'<div class="font_text" style="font-family:'+item[i].c[2].v+';">'+dummyText+'</div>'
                +'<svg class="close_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>'
                +'<div class="font_detail_page_divider"></div>'
                +'<div class="font_detail_page_wrap">'
                  +'<div class="font_detail_page">'
                    +'<div class="download_btn_wrap">'
                      +'<a class="source_btn" style="border-color:'+item[i].c[6].v+'; color:'+item[i].c[6].v+'" href="'+item[i].c[7].v+'" target="_blank">'+item[i].c[5].v+' 방문하기</a>'
                      +'<a class="download_btn" href="'+item[i].c[8].v+'">폰트 다운로드</a>'
                    +'</div>'
                    +'<p class="font_detail_page_title">웹 폰트 사용하기</p>'
                    +'<div class="cdn_wrap">'
                      +'<input type="radio" id="cdn_css_'+i+'" name="cdn_'+i+'" checked/>'
                      +'<label for="cdn_css_'+i+'">CSS 설정하기</label>'
                      +'<input type="radio" id="cdn_link_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_link_'+i+'">link 방식</label>'
                      +'<input type="radio" id="cdn_import_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_import_'+i+'">import 방식</label>'
                      +'<input type="radio" id="cdn_url_'+i+'" name="cdn_'+i+'"/>'
                      +'<label for="cdn_url_'+i+'">URL 방식</label>'
                      +'<div class="cdn_code_wrap">'
                        +'<div class="cdn_code cdn_code_css">'
                          +'<div>'+item[i].c[10].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                        +'<div class="cdn_code cdn_code_link">'
                          +'<div>&#60;'+item[i].c[11].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                        +'<div class="cdn_code cdn_code_import">'
                          +'<div>'+item[i].c[12].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                        +'<div class="cdn_code cdn_code_url">'
                          +'<div>'+item[i].c[9].v+'</div>'
                          +'<svg class="copy_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>'
                          +'<svg class="copy_chk_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'
                        +'</div>'
                      +'</div>'
                      +'<p class="font_detail_page_title">폰트 두께</p>'
                      +'<div class="font_weight_wrap">'
                        +'<input class="font_weight_change" type="text" value="'+dummyTextShort+'"/>'
                      +'</div>'
                      +'<p class="font_detail_page_title">라이센스 사용 범위</p>'
                      +'<table class="license">'
                        +'<tr>'
                          +'<th>카테고리</th>'
                          +'<th>사용 범위</th>'
                          +'<th>허용 여부</th>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="5">인쇄</td>'
                          +'<td>브로슈어, 카탈로그, DM, 전단지, 포스터, 패키지, 캘린더 등 인쇄물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>책, 만화책, 잡지, 정기간행물, 신문 등 출판물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>간판, 현수막, 판넬 등 제작물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>신문광고, 잡지광고, 차량광고 등 광고물</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>인쇄 및 문서 공유를 위한 PDF 파일 제작</td>'
                          +'<td class="license_yn">'+item[i].c[14].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="2">웹사이트</td>'
                          +'<td>웹페이지, 광고 배너, 메일, E-브로슈어 등</td>'
                          +'<td class="license_yn">'+item[i].c[15].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>웹서버용 폰트</td>'
                          +'<td class="license_yn">'+item[i].c[15].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="5">영상</td>'
                          +'<td>방송 및 영상물 자막</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>TV-CF, 온라인 영상광고</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>영화(DVD / 비디오), 오프닝, 엔딩크레딧 자막</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>개인 UCC 및 홍보물</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>E-Learning 콘텐츠, 온라인 동영상강좌, 플래시 강좌</td>'
                          +'<td class="license_yn">'+item[i].c[16].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>포장지</td>'
                          +'<td>판매용 상품의 패키지</td>'
                          +'<td class="license_yn">'+item[i].c[17].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>임베딩</td>'
                          +'<td>웹사이트 및 프로그램 서버 내 폰트 탑재, E-book 제작</td>'
                          +'<td class="license_yn">'+item[i].c[18].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>BI/CI</td>'
                          +'<td>회사명, 브랜드명, 상품명, 로고, 마크, 슬로건, 캐치프레이즈</td>'
                          +'<td class="license_yn">'+item[i].c[19].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="2">OFL</td>'
                          +'<td>폰트 파일의 수정, 편집 및 재배포</td>'
                          +'<td class="license_yn">'+item[i].c[20].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>폰트 파일의 유료 판매</td>'
                          +'<td class="license_yn">'+item[i].c[20].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td rowspan="2">용도</td>'
                          +'<td>폰트 파일의 수정, 편집 및 재배포</td>'
                          +'<td class="license_yn">'+item[i].c[21].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>상업적 용도 사용</td>'
                          +'<td class="license_yn">'+item[i].c[21].v+'</td>'
                        +'</tr>'
                        +'<tr>'
                          +'<td>출처</td>'
                          +'<td>출처 표시</td>'
                          +'<td class="license_yn">권장</td>'
                        +'</tr>'
                      +'</table>'
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>';

              // 폰트 두께 각자 따로 적용
              if (item[i].c[13].v.indexOf('300') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">Light 300</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:300;">'+dummyTextShort+'</div>'}
              if (item[i].c[13].v.indexOf('400') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">Regular 400</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:400;">'+dummyTextShort+'</div>'}
              if (item[i].c[13].v.indexOf('700') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">Bold 700</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:700;">'+dummyTextShort+'</div>'}
              if (item[i].c[13].v.indexOf('800') !== -1) { document.getElementsByClassName('font_weight_wrap')[i-1].innerHTML += '<div class="font_weight_title">ExtraBold 800</div><div class="font_weight_txt" style="font-family:'+item[i].c[2].v+'; font-weight:800;">'+dummyTextShort+'</div>'}

              // fade-in 초기화
              setTimeout(function(){document.getElementsByClassName('font_box')[i-1].classList.remove('fade_in')},600)
          }

          // 폰트 박스가 홀수일 때 정렬 맞춰주는 빈 div 생성, 뒷배경으로 사용될 div 생성
          document.getElementsByClassName('font_area_wrap')[0].innerHTML += '<div class="font_box_empty"></div><div class="font_area_divider"></div>';

          // 사이드에 폰트 리스트 삽입
          document.getElementsByClassName('font_list')[0].innerHTML = '';
          for (let i = 1; i < item.length; i++) { document.getElementsByClassName('font_list')[0].innerHTML += '<div class="font_name">'+item[i].c[1].v+'</div>'; }
      })
      .then(() => {
          // 폰트 박스 & 폰트 리스트 클릭 이벤트
          let fontBox = document.getElementsByClassName('font_box');
          let fontList = document.getElementsByClassName('font_name');
          for (let i = 0; i < fontBox.length; i++) {
            // 폰트 박스
            fontBox[i].addEventListener('click', (e) => {
              if(fontBox[i].classList.contains('clicked')) { return; }

              // clicked 이벤트 초기화
              for (let o = 0; o < fontBox.length; o++) { 
                fontBox[o].classList.remove('clicked');
                fontBox[o].classList.add('fade_in');
                setTimeout(function(){fontBox[o].classList.remove('fade_in');},600);

                // 폰트 두께 텍스트 변경 이벤트
                fontBox[o].getElementsByClassName('font_weight_change')[0].value = dummyTextShort;
                let fontWeightTxt = fontBox[o].getElementsByClassName('font_weight_txt');
                for(let e = 0; e < fontWeightTxt.length; e++) { fontWeightTxt[e].innerText = fontBox[o].getElementsByClassName('font_weight_change')[0].value; }
              }

              // 새 clicked 이벤트
              fontBox[i].classList.add('clicked');
              fontBox[i].classList.add('fade_in');
              setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);
            });

            // 폰트 리스트
            fontList[i].addEventListener('click', () => {
              for(let o = 0; o < fontBox.length; o++) { fontBox[o].classList.remove('clicked'); }
              fontBox[i].classList.add('clicked');
              fontBox[i].classList.add('fade_in');
              setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);

              // 폰트 두께 텍스트 변경 이벤트
              fontBox[i].getElementsByClassName('font_weight_change')[0].value = dummyTextShort;
              let fontWeightTxt = fontBox[i].getElementsByClassName('font_weight_txt');
              for(let e = 0; e < fontWeightTxt.length; e++) { fontWeightTxt[e].innerText = fontBox[i].getElementsByClassName('font_weight_change')[0].value; }
            });

            // 폰트 두께 텍스트 변경 이벤트
            fontBox[i].getElementsByClassName('font_weight_change')[0].addEventListener('input', (e) => {
              let fontWeightTxt = fontBox[i].getElementsByClassName('font_weight_txt');
              for(let o = 0; o < fontWeightTxt.length; o++) { fontWeightTxt[o].innerText = e.target.value; }
            });
          }

          // 뒤로가기 버튼 클릭 이벤트
          let closeBtn = document.getElementsByClassName('close_btn');
          for (let i = 0; i < closeBtn.length; i++) {
            closeBtn[i].addEventListener('click', () => { for (let o = 0; o < fontBox.length; o++) { if (fontBox[o].classList.contains('clicked')) { setTimeout(function(){fontBox[o].classList.remove('clicked'); fontBox[o].classList.add('fade_in'); setTimeout(function(){fontBox[o].classList.remove('fade_in');},600);},0); } } })
          }

          // 웹 폰트 적용하기 복사 버튼 클릭 이벤트
          let copyWebFont = document.getElementsByClassName('cdn_code');
          for (let i = 0; i < copyWebFont.length; i++) {
            copyWebFont[i].getElementsByClassName('copy_btn')[0].addEventListener('click', () => {
              window.navigator.clipboard.writeText(copyWebFont[i].getElementsByTagName('div')[0].innerText);

              copyWebFont[i].getElementsByClassName('copy_btn')[0].style.display = 'none';
              copyWebFont[i].getElementsByClassName('copy_chk_btn')[0].style.display = 'block';
              setTimeout(function() {
                copyWebFont[i].getElementsByClassName('copy_btn')[0].style.display = 'block';
                copyWebFont[i].getElementsByClassName('copy_chk_btn')[0].style.display = 'none';
              },1500);
            });
          }
      });
  })

  const textChange = (e) => {
    let textArea = document.getElementsByClassName('font_text');
    for (let i = 0; i < textArea.length; i++) {
      textArea[i].innerText = e.target.value;
    }
  }

  const fontWeightChange = (e) => {
    let textArea = document.getElementsByClassName('font_text');
    for (let i = 0; i < textArea.length; i++) {
      textArea[i].style.fontWeight = e.target.value;
    }
  }

  const typeFaceChange = (e) => {
    let fontBox = document.getElementsByClassName('font_box');
    if (e.target.checked) {
      for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600);; if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'block'; } }
    }
    else {
      for (let i = 0; i < fontBox.length; i++) { fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600); if (fontBox[i].getElementsByClassName('type_face')[0].innerText === e.target.value) { fontBox[i].style.display = 'none'; } }
    }
  }

  const searchChange = (e) => {
    let fontList = document.getElementsByClassName('font_list')[0].getElementsByClassName('font_name');
    let fontBox = document.getElementsByClassName('font_box');
    let typeFace = document.getElementsByClassName('category_1')[0].getElementsByTagName('input');

    for (let i = 0; i < fontList.length; i++) {
      if (fontList[i].innerText.indexOf(e.target.value) === -1) { fontList[i].style.display = 'none'; fontBox[i].style.display = 'none'; fontBox[i].classList.remove('clicked'); fontBox[i].classList.add('fade_in'); setTimeout(function(){fontBox[i].classList.remove('fade_in');},600); for(let o = 0; o < typeFace.length; o++) { typeFace[o].checked = true; } }
      else { fontList[i].style.display = 'block'; fontBox[i].style.display = 'block'; }
    }
  }

  // 사이드 메뉴 접기 / 펼치기
  const expandChk = (e) => {
    if(e.target.checked) {
      document.getElementsByClassName('wrap')[0].classList.remove('expand');
      document.getElementsByClassName('wrap')[0].classList.add('shrink');
    }
    else {
      document.getElementsByClassName('wrap')[0].classList.remove('shrink');
      document.getElementsByClassName('wrap')[0].classList.add('expand');
    }
  }

  const goUp = () => { window.scrollTo({top:0,behavior:'smooth'}); }

  const goGitHub = () => { window.open('https://github.com/taedonn/fonts-archive','_blank'); }

  const goNightMode = () => {
    if(document.body.classList.contains('bright_mode')) {
      document.body.classList.remove('bright_mode');
      document.body.classList.add('night_mode');
    }
    else {
      document.body.classList.remove('night_mode');
      document.body.classList.add('bright_mode');
    }
  }

  return (
    <>
        <div className={window.innerWidth > 1080 ? 'wrap expand' : 'wrap shrink'}>
            <div className='side_menu'>
              <div className='expand_btn_wrap'>
                <input type='checkbox' id='expand_btn' onClick={expandChk} defaultChecked={window.innerWidth > 1080 ? false : true}/>
                <label htmlFor='expand_btn'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                </label>
              </div>
              <div className='title'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/></svg>
              </div>
              <div className='search_bar'>
                <input type='text' placeholder='Search Fonts' onChange={searchChange}/>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </div>
              <div className='font_list'></div>
            </div>
            <div className='main_menu'>
              <div className='main_menu_fixed'>
                <div className='search_bar'>
                  <input type='text' placeholder='Type Something' onChange={textChange} defaultValue={dummyText}/>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="m2.244 13.081.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"/>
                  </svg>
                </div>
                <div className='category'>
                  <div className='category_1'>
                    <input type='checkbox' id='serif' onChange={typeFaceChange} value='Serif' defaultChecked/>
                    <label htmlFor='serif'>Serif</label>
                    <input type='checkbox' id='sansSerif' onChange={typeFaceChange} value='Sans Serif' defaultChecked/>
                    <label htmlFor='sansSerif'>Sans Serif</label>
                    <input type='checkbox' id='handWriting' onChange={typeFaceChange} value='Hand Writing' defaultChecked/>
                    <label htmlFor='handWriting'>Hand Writing</label>
                  </div>
                  <div className='divider'></div>
                  <div className='category_2'>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='light' value='300'/>
                    <label htmlFor='light'>Light</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='regular' value='400' defaultChecked/>
                    <label htmlFor='regular'>Regular</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='medium' value='500'/>
                    <label htmlFor='medium'>Medium</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='bold' value='700'/>
                    <label htmlFor='bold'>Bold</label>
                    <input type='radio' onChange={fontWeightChange} name='fontWeight' id='black' value='900'/>
                    <label htmlFor='black'>Black</label>
                  </div>
                </div>
              </div>
              <div className='font_area_wrap'></div>
              <div className='profile_fixed'>
                <div className='profile_star' onClick={goGitHub}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
                </div>
                <div className='profile_color_mode' onClick={goNightMode}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>
                </div>
                <div className='profile_up' onClick={goUp}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>
                </div>
              </div>
            </div>
        </div>
    </>
  );
}

export default Main;